// Catholic Daily Dozen Tracker - Main Application Logic
// Version: 2.0.12 - Enhanced PWA update mechanism

import { getCategoriesForDietType, getCategoryNameHtml } from './js/categories.js';
import * as storage from './js/storage.js';
import { handleServingChange } from './js/checkbox.js';
import { PwaManager } from './js/pwa.js';
import { HistoryView } from './js/history.js';
import { AuthManager } from './js/auth.js';

console.log('Daily Dozen Tracker loaded - Version 2.0.12');
console.log('Timestamp:', new Date().toISOString());

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
        this.dietType = storage.loadDietType(this.currentProfile);
        this.categories = getCategoriesForDietType(this.dietType);
        this.pwa = new PwaManager();
        this.history = new HistoryView(this);
        this.auth = new AuthManager(this);
        this.init();
    }

    init() {
        this.updateDateDisplay();
        this.setProfileSelector();
        this.setDietTypeSelector();
        this.renderCategories();
        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.updateHeaderColor();
        this.updateDietTypeLabel();
        this.setupEventListeners();
        this.pwa.init();
        this.auth.updateUI();
        // Sync from server on load if logged in
        if (this.auth.isLoggedIn) {
            this.auth.sync().catch(() => {});
        }
    }

    refreshAfterSync() {
        this.profiles = storage.loadProfiles();
        this.dietType = storage.loadDietType(this.currentProfile);
        this.categories = getCategoriesForDietType(this.dietType);
        this.setProfileSelector();
        this.setDietTypeSelector();
        this.renderCategories();
        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.updateHeaderColor();
        this.updateDietTypeLabel();
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

        storage.saveDietType(this.currentProfile, this.dietType);

        this.currentProfile = profileId;
        storage.saveCurrentProfile(profileId);

        this.dietType = storage.loadDietType(this.currentProfile);
        this.categories = getCategoriesForDietType(this.dietType);

        this.setProfileSelector();
        this.setDietTypeSelector();
        this.renderCategories();

        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.updateHeaderColor();
        this.updateDietTypeLabel();
    }

    updateHeaderColor() {
        const header = document.querySelector('.app-header');
        const profile = this.profiles[this.currentProfile];
        if (header && profile) {
            header.style.backgroundColor = profile.color;
        }
    }

    updateDietTypeLabel() {
        const dietTypeLabel = document.getElementById('diet-type-label');
        const profile = this.profiles[this.currentProfile];
        if (dietTypeLabel && profile) {
            dietTypeLabel.textContent = `Diet Type for ${profile.name}:`;
        }
    }

    editProfileName(profileId) {
        const profile = this.profiles[profileId];
        const currentName = profile.name;

        // Show inline edit modal instead of browser prompt()
        const modal = document.createElement('div');
        modal.className = 'profile-edit-modal';
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
        const input = document.getElementById('profile-edit-input');
        input.focus();
        input.select();

        const save = () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                this.profiles[profileId].name = newName;
                storage.saveProfiles(this.profiles);
                this.setProfileSelector();
                this.updateDietTypeLabel();
                this.showProfileNameUpdated(newName);
                this.auth.schedulePush();
            }
            modal.remove();
        };

        modal.querySelector('#profile-edit-save').addEventListener('click', save);
        modal.querySelector('#profile-edit-cancel').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') modal.remove();
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
                       data-serving="${i}">
                <label for="${category.id}-${i}" class="serving-label">${i + 1}</label>
            `;
        }
        return html;
    }

    // --- Event handling ---

    setupEventListeners() {
        const dietTypeSelect = document.getElementById('diet-type');
        dietTypeSelect.addEventListener('change', (e) => {
            this.handleDietTypeChange(e.target.value);
        });

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
                this.pwa.showManualInstallInstructions();
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
            progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #548444)';
            this.showCompletionCelebration();
        } else if (percentage >= 75) {
            progressFill.style.background = 'linear-gradient(90deg, #8BC34A, #4CAF50)';
        } else if (percentage >= 50) {
            progressFill.style.background = 'linear-gradient(90deg, #FFC107, #8BC34A)';
        } else {
            progressFill.style.background = 'linear-gradient(90deg, #FF9800, #FFC107)';
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

    showCompletionCelebration() {
        // Only celebrate for today, not when editing past dates
        if (!this.isViewingToday()) return;

        const celebrationKey = storage.getCelebrationKey(this.currentProfile, this.currentDate.toDateString());
        if (localStorage.getItem(celebrationKey)) {
            return;
        }

        const celebrationModal = document.createElement('div');
        celebrationModal.className = 'celebration-modal';
        celebrationModal.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <h2>Congratulations!</h2>
                <p>${this.profiles[this.currentProfile].name} has completed the Daily Dozen for today!</p>
                <p class="celebration-message">Thank you for honoring this temple of the Holy Spirit. Your care for your body glorifies God and respects the sacred gift of life He has entrusted to you.</p>
                <div class="celebration-verses">
                    <p>"Do you not know that your body is a temple of the Holy Spirit within you, whom you have from&nbsp;God?"</p>
                    <p class="verse-reference">— 1 Corinthians 6:19</p>
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

    // --- Diet type ---

    setDietTypeSelector() {
        const dietTypeSelect = document.getElementById('diet-type');
        if (dietTypeSelect) {
            dietTypeSelect.value = this.dietType;
        }
    }

    handleDietTypeChange(newDietType) {
        this.dietType = newDietType;
        storage.saveDietType(this.currentProfile, newDietType);

        this.categories = getCategoriesForDietType(newDietType);
        this.renderCategories();

        const data = storage.loadData(this.currentProfile);
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.auth.schedulePush();
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
