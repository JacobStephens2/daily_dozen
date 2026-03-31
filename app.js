// Catholic Daily Dozen Tracker - Main Application Logic
// Version: 2.0.13 - Fix stale checkboxes on day change

import { getCategoriesForDietType, getActiveCategories, getAllCategories, PRESETS, getCategoryNameHtml } from './js/categories.js';
import * as storage from './js/storage.js';
import { handleServingChange } from './js/checkbox.js';
import { PwaManager } from './js/pwa.js';
import { HistoryView } from './js/history.js';
import { AuthManager } from './js/auth.js';
import { trapFocus } from './js/focus-trap.js';

// Check for updates on page load (but don't clear cache aggressively)
if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.update();
            });
        });
    }
}

class DailyDozenTracker {
    constructor() {
        this.currentDate = new Date();
        this.profiles = storage.loadProfiles();
        this.currentProfile = storage.loadCurrentProfile();
        this.customServings = this.loadServings();
        this.categories = getActiveCategories(this.customServings);
        this.pwa = new PwaManager();
        this.history = new HistoryView(this);
        this.auth = new AuthManager(this);
        this.init();
    }

    init() {
        this.updateDateDisplay();
        this.setProfileSelector();
        this.renderCategories();
        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.updateHeaderColor();
        this.setupEventListeners();
        this.setupDayChangeDetection();
        this.pwa.init();
        this.auth.updateUI();
        this.setupOfflineIndicator();
        // Refresh token and sync from server on load if logged in
        if (this.auth.isLoggedIn) {
            this.auth.refreshTokenIfNeeded().then(() => this.auth.sync()).catch(() => {});
        }
    }

    refreshAfterSync() {
        // Re-anchor to the real "today" in case the sync arrived after a day change
        if (this.isViewingToday()) {
            this.currentDate = new Date();
        }
        this.profiles = storage.loadProfiles();
        this.customServings = this.loadServings();
        this.categories = getActiveCategories(this.customServings);
        this.setProfileSelector();
        this.renderCategories();
        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.updateHeaderColor();
        this.updateDateDisplay();
    }

    // --- Date navigation ---

    navigateToDate(date) {
        this.currentDate = date;
        this.updateDateDisplay();
        this.renderCategories();
        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
    }

    isViewingToday() {
        return this.currentDate.toDateString() === new Date().toDateString();
    }

    returnToToday() {
        this.navigateToDate(new Date());
    }

    updateDateDisplay() {
        const dateElement = document.getElementById('current-date');
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        dateElement.textContent = this.currentDate.toLocaleDateString('en-US', options);

        const backBtn = document.getElementById('back-to-today-btn');
        const isToday = this.isViewingToday();
        if (backBtn) {
            backBtn.style.display = isToday ? 'none' : 'inline-block';
        }

        // Visual indicator when viewing a past date
        const datePill = document.getElementById('date-pill');
        if (datePill) {
            datePill.classList.toggle('viewing-past', !isToday);
        }

        // Sync the hidden date picker value
        const picker = document.getElementById('date-picker');
        if (picker) {
            const y = this.currentDate.getFullYear();
            const m = String(this.currentDate.getMonth() + 1).padStart(2, '0');
            const d = String(this.currentDate.getDate()).padStart(2, '0');
            picker.value = `${y}-${m}-${d}`;
        }

        // Disable next arrow if viewing today
        const nextBtn = document.getElementById('date-next-btn');
        if (nextBtn) {
            nextBtn.classList.toggle('disabled', isToday);
            nextBtn.disabled = isToday;
        }
    }

    // --- Profile management ---

    setProfileSelector() {
        const profileContainer = document.getElementById('profile-selector');
        if (!profileContainer) return;

        profileContainer.innerHTML = '';

        Object.keys(this.profiles).forEach(profileId => {
            const profile = this.profiles[profileId];
            const profileBtn = document.createElement('button');
            profileBtn.className = 'profile-btn';
            profileBtn.dataset.profileId = profileId;

            if (profileId === this.currentProfile) {
                profileBtn.classList.add('active');
            }

            profileBtn.style.setProperty('--profile-color', profile.color);
            profileBtn.innerHTML = `
                <span class="profile-icon">👤</span>
                <span class="profile-name">${profile.name}</span>
                <button class="edit-profile-btn" data-profile-id="${profileId}">✏️</button>
            `;

            profileBtn.addEventListener('click', (e) => {
                if (!e.target.classList.contains('edit-profile-btn')) {
                    this.switchProfile(profileId);
                }
            });

            const editBtn = profileBtn.querySelector('.edit-profile-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editProfileName(profileId);
            });

            profileContainer.appendChild(profileBtn);
        });
    }

    switchProfile(profileId) {
        if (profileId === this.currentProfile) return;

        this.currentProfile = profileId;
        storage.saveCurrentProfile(profileId);

        this.customServings = this.loadServings();
        this.categories = getActiveCategories(this.customServings);

        this.setProfileSelector();
        this.renderCategories();

        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.updateHeaderColor();
    }

    updateHeaderColor() {
        const header = document.querySelector('.app-header');
        const profile = this.profiles[this.currentProfile];
        if (header && profile) {
            header.style.backgroundColor = profile.color;
        }
    }

    editProfileName(profileId) {
        const profile = this.profiles[profileId];
        const currentName = profile.name;

        // Show inline edit modal instead of browser prompt()
        const modal = document.createElement('div');
        modal.className = 'profile-edit-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="profile-edit-content">
                <h3>Edit Profile Name</h3>
                <input type="text" class="profile-edit-input" id="profile-edit-input"
                       value="${currentName}" maxlength="30" autocomplete="off">
                <div class="profile-edit-actions">
                    <button class="profile-edit-save" id="profile-edit-save">Save</button>
                    <button class="profile-edit-cancel" id="profile-edit-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const releaseFocus = trapFocus(modal);
        const input = document.getElementById('profile-edit-input');
        input.focus();
        input.select();

        const close = () => { releaseFocus(); modal.remove(); };
        const save = () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                this.profiles[profileId].name = newName;
                storage.saveProfiles(this.profiles);
                this.setProfileSelector();
                this.showProfileNameUpdated(newName);
                this.auth.schedulePush();
            }
            close();
        };

        modal.querySelector('#profile-edit-save').addEventListener('click', save);
        modal.querySelector('#profile-edit-cancel').addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') close();
        });
    }

    showProfileNameUpdated(newName) {
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'profile-update-confirmation';
        confirmationDiv.innerHTML = `
            <div class="confirmation-content">
                <span>✅ Profile name updated to "${newName}"</span>
            </div>
        `;

        document.body.appendChild(confirmationDiv);

        setTimeout(() => {
            if (confirmationDiv.parentNode) {
                confirmationDiv.parentNode.removeChild(confirmationDiv);
            }
        }, 3000);
    }

    // --- Category rendering ---

    renderCategories() {
        const container = document.getElementById('categories-container');
        container.innerHTML = '';

        this.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            container.appendChild(categoryElement);
        });
    }

    createCategoryElement(category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.categoryId = category.id;

        const servingsHtml = this.createServingsHtml(category);
        const categoryName = getCategoryNameHtml(category);

        card.innerHTML = `
            <div class="category-header">
                <div class="category-icon">${category.icon}</div>
                <div class="category-info">
                    <h3>${categoryName}</h3>
                    <p>${category.description}</p>
                </div>
            </div>
            <div class="servings-container">
                ${servingsHtml}
            </div>
        `;

        return card;
    }

    createServingsHtml(category) {
        let html = '';
        for (let i = 0; i < category.servings; i++) {
            html += `
                <input type="checkbox"
                       id="${category.id}-${i}"
                       class="serving-checkbox"
                       data-category="${category.id}"
                       data-serving="${i}"
                       aria-label="${category.name} serving ${i + 1} of ${category.servings}">
                <label for="${category.id}-${i}" class="serving-label">${i + 1}</label>
            `;
        }
        return html;
    }

    // --- Event handling ---

    setupEventListeners() {
        const customizeBtn = document.getElementById('customize-btn');
        if (customizeBtn) {
            customizeBtn.addEventListener('click', () => this.showCustomizeModal());
        }

        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('serving-checkbox')) {
                this.onServingChange(e.target);
            }
        });

        const historyBtn = document.getElementById('history-btn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                this.history.open();
            });
        }

        const backToTodayBtn = document.getElementById('back-to-today-btn');
        if (backToTodayBtn) {
            backToTodayBtn.addEventListener('click', () => {
                this.returnToToday();
            });
        }

        // Date navigation: prev/next arrows
        const datePrevBtn = document.getElementById('date-prev-btn');
        if (datePrevBtn) {
            datePrevBtn.addEventListener('click', () => {
                const prev = new Date(this.currentDate);
                prev.setDate(prev.getDate() - 1);
                this.navigateToDate(prev);
            });
        }

        const dateNextBtn = document.getElementById('date-next-btn');
        if (dateNextBtn) {
            dateNextBtn.addEventListener('click', () => {
                if (this.isViewingToday()) return;
                const next = new Date(this.currentDate);
                next.setDate(next.getDate() + 1);
                this.navigateToDate(next);
            });
        }

        // Date picker: click the pill to open the native date picker
        const datePill = document.getElementById('date-pill');
        const datePicker = document.getElementById('date-picker');
        if (datePill && datePicker) {
            datePill.addEventListener('click', () => {
                datePicker.showPicker();
            });

            datePicker.addEventListener('change', (e) => {
                if (e.target.value) {
                    const parts = e.target.value.split('-');
                    const picked = new Date(parts[0], parts[1] - 1, parts[2]);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (picked <= today) {
                        this.navigateToDate(picked);
                    }
                }
            });
        }

        const resetDayBtn = document.getElementById('reset-day-btn');
        if (resetDayBtn) {
            resetDayBtn.addEventListener('click', () => {
                this.resetDay();
            });
        }

        const gratitudeBtn = document.getElementById('gratitude-btn');
        const gratitudeModal = document.getElementById('gratitude-modal');
        const closeGratitude = document.getElementById('close-gratitude');

        if (gratitudeBtn && gratitudeModal && closeGratitude) {
            gratitudeBtn.addEventListener('click', () => {
                gratitudeModal.style.display = 'flex';
            });

            closeGratitude.addEventListener('click', () => {
                gratitudeModal.style.display = 'none';
            });

            gratitudeModal.addEventListener('click', (e) => {
                if (e.target === gratitudeModal) {
                    gratitudeModal.style.display = 'none';
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    gratitudeModal.style.display = 'none';
                }
            });
        }

        const footerInstallBtn = document.getElementById('footer-install-btn');
        if (footerInstallBtn) {
            footerInstallBtn.addEventListener('click', () => {
                this.pwa.installApp();
            });
        }

        const versionInfoBtn = document.getElementById('version-info-btn');
        if (versionInfoBtn) {
            versionInfoBtn.addEventListener('click', () => {
                this.pwa.showVersionInfo();
            });
        }

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }

        const importBtn = document.getElementById('import-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                this.importData();
            });
        }

        const accountBtn = document.getElementById('account-btn');
        if (accountBtn) {
            accountBtn.addEventListener('click', () => {
                this.auth.showAccountModal();
            });
        }

        const signInBannerBtn = document.getElementById('sign-in-banner-btn');
        if (signInBannerBtn) {
            signInBannerBtn.addEventListener('click', () => {
                this.auth.showAccountModal();
            });
        }

        const signInBannerDismiss = document.getElementById('sign-in-banner-dismiss');
        if (signInBannerDismiss) {
            signInBannerDismiss.addEventListener('click', () => {
                const banner = document.getElementById('sign-in-banner');
                if (banner) banner.classList.add('hidden');
                sessionStorage.setItem('sign-in-banner-dismissed', '1');
            });
        }
    }

    // --- Checkbox / serving logic ---

    onServingChange(checkbox) {
        const categoryId = checkbox.dataset.category;

        handleServingChange(checkbox, this.categories, (catId, idx, checked) => {
            this.saveServing(catId, idx, checked);
        });

        this.updateProgress();
        this.updateCategoryStatus(categoryId);
    }

    saveServing(categoryId, servingIndex, isChecked) {
        const data = storage.loadData(this.currentProfile);
        const dateKey = this.currentDate.toDateString();

        if (!data[dateKey]) {
            data[dateKey] = {};
        }

        if (!data[dateKey][categoryId]) {
            data[dateKey][categoryId] = [];
        }

        if (isChecked) {
            if (!data[dateKey][categoryId].includes(servingIndex)) {
                data[dateKey][categoryId].push(servingIndex);
            }
        } else {
            const index = data[dateKey][categoryId].indexOf(servingIndex);
            if (index > -1) {
                data[dateKey][categoryId].splice(index, 1);
            }
        }

        storage.saveData(this.currentProfile, data);
        this.auth.schedulePush();
    }

    // --- Data restore ---

    restoreCheckboxes(data) {
        const dateKey = this.currentDate.toDateString();
        if (data[dateKey]) {
            Object.keys(data[dateKey]).forEach(categoryId => {
                const categoryExists = this.categories.some(c => c.id === categoryId);
                if (!categoryExists) {
                    return;
                }

                data[dateKey][categoryId].forEach(servingIndex => {
                    const checkbox = document.getElementById(`${categoryId}-${servingIndex}`);
                    if (checkbox) {
                        checkbox.checked = true;
                    }
                });
                this.updateCategoryStatus(categoryId, data);
            });
        }
    }

    // --- Progress tracking ---

    updateProgress() {
        const data = storage.loadData(this.currentProfile);
        const dateKey = this.currentDate.toDateString();
        let completedServings = 0;
        let totalServings = 0;

        this.categories.forEach(category => {
            totalServings += category.servings;
            if (data[dateKey] && data[dateKey][category.id]) {
                completedServings += data[dateKey][category.id].length;
            }
        });

        const progressFill = document.getElementById('progress-fill');
        const progressCount = document.getElementById('progress-count');
        const totalServingsElement = document.getElementById('total-servings');

        const percentage = (completedServings / totalServings) * 100;
        progressFill.style.width = `${percentage}%`;
        progressCount.textContent = completedServings;
        totalServingsElement.textContent = totalServings;

        if (percentage >= 100) {
            progressFill.style.background = 'linear-gradient(90deg, #508041, #38672a)';
            this.showCompletionCelebration();
        } else if (percentage >= 75) {
            progressFill.style.background = 'linear-gradient(90deg, #508041, #38672a)';
        } else if (percentage >= 50) {
            progressFill.style.background = 'linear-gradient(90deg, #BB8F56, #508041)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #E1C07B, #BB8F56)';
        }
    }

    updateCategoryStatus(categoryId, data = null) {
        const card = document.querySelector(`[data-category-id="${categoryId}"]`);
        if (!data) {
            data = storage.loadData(this.currentProfile);
        }
        const dateKey = this.currentDate.toDateString();
        const category = this.categories.find(c => c.id === categoryId);

        if (!category || !card) {
            return;
        }

        if (data[dateKey] && data[dateKey][categoryId]) {
            const completedCount = data[dateKey][categoryId].length;
            if (completedCount >= category.servings) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        } else {
            card.classList.remove('completed');
        }
    }

    // --- Celebration ---

    getCelebrationVerse() {
        const verses = [
            { text: 'Do you not know that your body is a temple of the Holy Spirit within you, whom you have from\u00a0God?', ref: '1 Corinthians 6:19' },
            { text: 'So, whether you eat or drink, or whatever you do, do all to the glory of\u00a0God.', ref: '1 Corinthians 10:31' },
            { text: 'Beloved, I pray that all may go well with you and that you may be in good health, as it goes well with your\u00a0soul.', ref: '3 John 1:2' },
            { text: 'For everything created by God is good, and nothing is to be rejected if it is received with\u00a0thanksgiving.', ref: '1 Timothy 4:4' },
            { text: 'The Lord sustains him on his sickbed; in his illness you restore him to full\u00a0health.', ref: 'Psalm 41:3' },
            { text: 'A joyful heart is good medicine, but a crushed spirit dries up the\u00a0bones.', ref: 'Proverbs 17:22' },
            { text: 'He gives food to every creature. His love endures\u00a0forever.', ref: 'Psalm 136:25' },
        ];
        return verses[Math.floor(Math.random() * verses.length)];
    }

    showCompletionCelebration() {
        // Only celebrate for today, not when editing past dates
        if (!this.isViewingToday()) return;

        const celebrationKey = storage.getCelebrationKey(this.currentProfile, this.currentDate.toDateString());
        if (localStorage.getItem(celebrationKey)) {
            return;
        }

        const verse = this.getCelebrationVerse();
        const celebrationModal = document.createElement('div');
        celebrationModal.className = 'celebration-modal';
        celebrationModal.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h2>Congratulations!</h2>
                <p>${this.profiles[this.currentProfile].name} has completed the Daily Dozen for today!</p>
                <p class="celebration-message">Thank you for honoring this temple of the Holy Spirit. Your care for your body glorifies God and respects the sacred gift of life He has entrusted to you.</p>
                <div class="celebration-verses">
                    <p>"${verse.text}"</p>
                    <p class="verse-reference">— ${verse.ref}</p>
                </div>
                <button class="celebration-close" onclick="this.parentElement.parentElement.remove()">Amen! 🙏</button>
            </div>
        `;

        document.body.appendChild(celebrationModal);
        localStorage.setItem(celebrationKey, 'true');

        setTimeout(() => {
            celebrationModal.classList.add('show');
        }, 100);
    }

    // --- Reset ---

    resetDay() {
        const dayLabel = this.isViewingToday() ? 'today' : this.currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        if (!confirm(`Are you sure you want to reset all your progress for ${dayLabel}? This action cannot be undone.`)) {
            return;
        }

        const checkboxes = document.querySelectorAll('.serving-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        const data = storage.loadData(this.currentProfile);
        const dateKey = this.currentDate.toDateString();
        if (data[dateKey]) {
            delete data[dateKey];
            storage.saveData(this.currentProfile, data);
        }

        const celebrationKey = storage.getCelebrationKey(this.currentProfile, this.currentDate.toDateString());
        localStorage.removeItem(celebrationKey);

        this.auth.schedulePush();
        this.updateProgress();
        this.categories.forEach(category => {
            this.updateCategoryStatus(category.id);
        });

        this.showResetConfirmation();
    }

    showResetConfirmation() {
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'reset-confirmation';
        confirmationDiv.innerHTML = `
            <div class="confirmation-content">
                <p>✅ Day reset successfully! You can now start fresh.</p>
            </div>
        `;

        document.body.appendChild(confirmationDiv);

        setTimeout(() => {
            if (confirmationDiv.parentNode) {
                confirmationDiv.parentNode.removeChild(confirmationDiv);
            }
        }, 3000);
    }

    // --- Servings customization ---

    loadServings() {
        const custom = storage.loadCustomServings(this.currentProfile);
        if (custom) return custom;
        // Migrate from old diet type system
        const dietType = storage.loadDietType(this.currentProfile);
        const preset = PRESETS[dietType] || PRESETS.standard;
        return { ...preset.servings };
    }

    applyServings(servings) {
        this.customServings = servings;
        storage.saveCustomServings(this.currentProfile, servings);
        this.categories = getActiveCategories(servings);
        this.renderCategories();
        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.auth.schedulePush();
    }

    showCustomizeModal() {
        const existing = document.querySelector('.customize-modal');
        if (existing) existing.remove();

        const allCats = getAllCategories();
        const servings = { ...this.customServings };

        const modal = document.createElement('div');
        modal.className = 'customize-modal';

        const presetBtns = Object.entries(PRESETS).map(([key, p]) =>
            `<button class="preset-btn" data-preset="${key}">${p.name}</button>`
        ).join('');

        const catRows = allCats.map(cat => {
            const count = servings[cat.id] || 0;
            return `
                <div class="customize-row ${count === 0 ? 'disabled' : ''}" data-cat-id="${cat.id}">
                    <span class="customize-icon">${cat.icon}</span>
                    <span class="customize-name">${cat.name}</span>
                    <div class="customize-controls">
                        <button class="customize-minus" data-cat-id="${cat.id}">-</button>
                        <span class="customize-count" data-cat-id="${cat.id}">${count}</span>
                        <button class="customize-plus" data-cat-id="${cat.id}">+</button>
                    </div>
                </div>`;
        }).join('');

        const total = Object.values(servings).reduce((s, v) => s + v, 0);

        modal.innerHTML = `
            <div class="customize-content">
                <div class="customize-header">
                    <h3>Customize Categories</h3>
                    <button class="customize-close-btn">&times;</button>
                </div>
                <div class="customize-presets">
                    <p class="customize-presets-label">Start from a preset:</p>
                    ${presetBtns}
                </div>
                <div class="customize-list">
                    ${catRows}
                </div>
                <div class="customize-footer">
                    <span class="customize-total">Total: <strong>${total}</strong> servings</span>
                    <button class="customize-save-btn">Save</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('show'));
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        const releaseFocus = trapFocus(modal);

        const updateCount = (catId, delta) => {
            const newVal = Math.max(0, Math.min(9, (servings[catId] || 0) + delta));
            servings[catId] = newVal;
            modal.querySelector(`.customize-count[data-cat-id="${catId}"]`).textContent = newVal;
            const row = modal.querySelector(`.customize-row[data-cat-id="${catId}"]`);
            row.classList.toggle('disabled', newVal === 0);
            const total = Object.values(servings).reduce((s, v) => s + v, 0);
            modal.querySelector('.customize-total strong').textContent = total;
        };

        modal.querySelectorAll('.customize-minus').forEach(btn => {
            btn.addEventListener('click', () => updateCount(btn.dataset.catId, -1));
        });

        modal.querySelectorAll('.customize-plus').forEach(btn => {
            btn.addEventListener('click', () => updateCount(btn.dataset.catId, 1));
        });

        modal.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = PRESETS[btn.dataset.preset];
                Object.assign(servings, preset.servings);
                allCats.forEach(cat => {
                    const val = servings[cat.id] || 0;
                    modal.querySelector(`.customize-count[data-cat-id="${cat.id}"]`).textContent = val;
                    modal.querySelector(`.customize-row[data-cat-id="${cat.id}"]`).classList.toggle('disabled', val === 0);
                });
                const total = Object.values(servings).reduce((s, v) => s + v, 0);
                modal.querySelector('.customize-total strong').textContent = total;
            });
        });

        const close = () => { releaseFocus(); modal.remove(); };

        modal.querySelector('.customize-save-btn').addEventListener('click', () => {
            this.applyServings(servings);
            close();
        });

        modal.querySelector('.customize-close-btn').addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        const escHandler = (e) => {
            if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
        };
        document.addEventListener('keydown', escHandler);
    }

    // --- Data export ---

    exportData() {
        const profiles = storage.loadProfiles();
        const exportPayload = {
            exportDate: new Date().toISOString(),
            profiles: {}
        };

        Object.keys(profiles).forEach(profileId => {
            exportPayload.profiles[profileId] = {
                name: profiles[profileId].name,
                color: profiles[profileId].color,
                dietType: storage.loadDietType(profileId),
                data: storage.loadData(profileId)
            };
        });

        const json = JSON.stringify(exportPayload, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const date = new Date().toISOString().slice(0, 10);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-dozen-${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // --- Data import ---

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const payload = JSON.parse(event.target.result);
                    if (!payload.profiles || typeof payload.profiles !== 'object') {
                        alert('Invalid file: no profile data found.');
                        return;
                    }
                    if (!confirm('This will replace all your current data. Continue?')) {
                        return;
                    }
                    this.auth.restoreFromPayload(payload);
                    this.refreshAfterSync();
                    this.auth.schedulePush();
                    alert('Data imported successfully.');
                } catch {
                    alert('Could not read file. Make sure it is a valid Daily Dozen export.');
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    // --- Offline indicator ---

    setupOfflineIndicator() {
        const banner = document.getElementById('offline-banner');
        if (!banner) return;

        const update = () => {
            banner.style.display = navigator.onLine ? 'none' : 'block';
        };
        update();
        window.addEventListener('online', update);
        window.addEventListener('offline', update);
    }

    // --- Day change detection ---
    // When the app resumes from background (e.g. PWA/TWA reopened the next day),
    // the browser may restore the page from bfcache with stale DOM state.
    // Detect this and navigate to the real "today" so checkboxes match the date.

    setupDayChangeDetection() {
        // Remember what "today" was when the page was last active, so we can
        // detect a day rollover even after the old today has become yesterday.
        let lastActiveDate = new Date().toDateString();

        const refreshIfDayChanged = () => {
            const now = new Date();
            const nowStr = now.toDateString();
            if (nowStr !== lastActiveDate) {
                // Day changed — if user was viewing the old "today", advance to the new today
                if (this.currentDate.toDateString() === lastActiveDate) {
                    this.navigateToDate(now);
                    if (this.auth.isLoggedIn) {
                        this.auth.refreshTokenIfNeeded().then(() => this.auth.sync()).catch(() => {});
                    }
                }
                lastActiveDate = nowStr;
            }
        };

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) refreshIfDayChanged();
        });

        window.addEventListener('pageshow', (e) => {
            if (e.persisted) refreshIfDayChanged();
        });
    }

    // --- PWA delegations (for inline onclick handlers) ---

    installApp() { this.pwa.installApp(); }
    showManualInstallInstructions() { this.pwa.showManualInstallInstructions(); }
    dismissInstallPrompt() { this.pwa.dismissInstallPrompt(); }
    dismissManualInstallPrompt() { this.pwa.dismissManualInstallPrompt(); }
    resetInstallDismissed() { this.pwa.resetInstallDismissed(); }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dailyDozenTracker = new DailyDozenTracker();
});
