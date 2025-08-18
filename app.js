// Catholic Daily Dozen Tracker - Main Application Logic
// Version: 2.0.8 - Enhanced PWA update mechanism

console.log('Daily Dozen Tracker loaded - Version 2.0.8');
console.log('Timestamp:', new Date().toISOString());

// Check for updates on page load (but don't clear cache aggressively)
if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_RELOAD) {
    // Check for service worker updates
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
        this.storageKey = 'dailyDozenData';
        this.dietTypeStorageKey = 'dailyDozenDietType';
        this.installDismissedKey = 'dailyDozenInstallDismissed';
        this.profileStorageKey = 'dailyDozenProfiles';
        this.currentProfileKey = 'dailyDozenCurrentProfile';
        this.deferredPrompt = null;
        this.profiles = this.loadProfiles();
        this.currentProfile = this.loadCurrentProfile();
        this.dietType = this.loadDietType();
        this.categories = this.getCategoriesForDietType(this.dietType);
        this.init();
    }

    getStandardCategories() {
        return [
            {
                id: 'beans',
                name: 'Beans',
                icon: '🫘',
                servings: 3,
                description: '½ c. cooked beans, ¼&nbsp;c.&nbsp;hummus',
                examples: ['Black beans', 'Chickpeas', 'Lentils', 'Hummus', 'Edamame']
            },
            {
                id: 'berries',
                name: 'Berries',
                icon: '🫐',
                servings: 1,
                description: '½ c. fresh or frozen, ¼ c. dried',
                examples: ['Blueberries', 'Strawberries', 'Raspberries', 'Blackberries', 'Cranberries']
            },
            {
                id: 'other-fruits',
                name: 'Other Fruits',
                icon: '🍎',
                servings: 3,
                description: '1 medium fruit, ¼&nbsp;c.&nbsp;dried&nbsp;fruit',
                examples: ['Apples', 'Bananas', 'Oranges', 'Grapes', 'Pineapple']
            },
            {
                id: 'greens',
                name: 'Greens',
                icon: '🥬',
                servings: 2,
                description: '1 c. raw, ½ c. cooked',
                examples: ['Spinach', 'Kale', 'Arugula', 'Swiss chard', 'Collard greens']
            },
            {
                id: 'cruciferous',
                name: 'Cruciferous Vegetables',
                icon: '🥦',
                servings: 1,
                description: '½ c. chopped, 1&nbsp;tbsp&nbsp;horseradish',
                examples: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Cabbage', 'Kale']
            },
            {
                id: 'other-vegetables',
                name: 'Other Vegetables',
                icon: '🥕',
                servings: 2,
                description: '½ c. nonleafy vegetables',
                examples: ['Carrots', 'Bell peppers', 'Tomatoes', 'Cucumber', 'Zucchini']
            },
            {
                id: 'flaxseed',
                name: 'Flaxseed',
                icon: '🌾',
                servings: 1,
                description: '1 tbsp ground',
                examples: ['Ground flaxseed', 'Flaxseed oil']
            },
            {
                id: 'nuts-seeds',
                name: 'Nuts and Seeds',
                icon: '🥜',
                servings: 1,
                description: '¼ c. nuts, 2 tbsp nut butter',
                examples: ['Almonds', 'Walnuts', 'Chia seeds', 'Pumpkin seeds', 'Peanut butter']
            },
            {
                id: 'herbs-spices',
                name: 'Herbs and Spices',
                icon: '🌿',
                servings: 1,
                description: '¼ tsp turmeric',
                examples: ['Turmeric', 'Cinnamon', 'Ginger', 'Garlic', 'Basil']
            },
            {
                id: 'whole-grains',
                name: 'Whole Grains',
                icon: '🌾',
                servings: 3,
                description: '½ c. hot cereal, 1 slice of bread',
                examples: ['Oatmeal', 'Brown rice', 'Quinoa', 'Whole wheat bread', 'Barley']
            },
            {
                id: 'beverages',
                name: 'Beverages',
                icon: '💧',
                servings: 5,
                description: "60&nbsp;oz&nbsp;per&nbsp;day",
                examples: ['Water', 'Green tea', 'Hibiscus tea', 'Herbal tea']
            },
            {
                id: 'exercise',
                name: 'Exercise',
                icon: '🏃',
                servings: 1,
                description: '90 min. moderate or 40 min. vigorous',
                examples: ['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga']
            }
        ];
    }

    getModifiedCategories() {
        return [
            {
                id: 'protein',
                name: 'Protein',
                icon: '🥩',
                servings: 2,
                description: '3 oz lean meat, 1 egg, ½ c. beans',
                examples: ['Chicken breast', 'Fish', 'Eggs', 'Lean beef', 'Tofu']
            },
            {
                id: 'berries',
                name: 'Berries',
                icon: '🫐',
                servings: 1,
                description: '½ c. fresh or frozen, ¼ c. dried',
                examples: ['Blueberries', 'Strawberries', 'Raspberries', 'Blackberries', 'Cranberries']
            },
            {
                id: 'other-fruits',
                name: 'Other Fruits',
                icon: '🍎',
                servings: 3,
                description: '1 medium fruit, ¼ c. dried fruit',
                examples: ['Apples', 'Bananas', 'Oranges', 'Grapes', 'Pineapple']
            },
            {
                id: 'greens',
                name: 'Greens',
                icon: '🥬',
                servings: 2,
                description: '1 c. raw, ½ c. cooked',
                examples: ['Spinach', 'Kale', 'Arugula', 'Swiss chard', 'Collard greens']
            },
            {
                id: 'cruciferous',
                name: 'Cruciferous Vegetables',
                icon: '🥦',
                servings: 1,
                description: '½ c. chopped, 1 tbsp horseradish',
                examples: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Cabbage', 'Kale']
            },
            {
                id: 'other-vegetables',
                name: 'Other Vegetables',
                icon: '🥕',
                servings: 2,
                description: '½ c. nonleafy vegetables',
                examples: ['Carrots', 'Bell peppers', 'Tomatoes', 'Cucumber', 'Zucchini']
            },
            {
                id: 'nuts-seeds',
                name: 'Nuts and Seeds',
                icon: '🥜',
                servings: 1,
                description: '¼ c. nuts, 2 tbsp nut butter',
                examples: ['Almonds', 'Walnuts', 'Chia seeds', 'Pumpkin seeds', 'Peanut butter']
            },
            {
                id: 'herbs-spices',
                name: 'Herbs and Spices',
                icon: '🌿',
                servings: 1,
                description: '¼ tsp turmeric',
                examples: ['Turmeric', 'Cinnamon', 'Ginger', 'Garlic', 'Basil']
            },
            {
                id: 'whole-grains',
                name: 'Whole Grains',
                icon: '🌾',
                servings: 3,
                description: '½ c. hot cereal, 1 slice of bread',
                examples: ['Oatmeal', 'Brown rice', 'Quinoa', 'Whole wheat bread', 'Barley']
            },
            {
                id: 'beverages',
                name: 'Beverages',
                icon: '💧',
                servings: 5,
                description: '60 oz per day',
                examples: ['Water', 'Green tea', 'Hibiscus tea', 'Herbal tea']
            },
            {
                id: 'exercise',
                name: 'Exercise',
                icon: '🏃',
                servings: 1,
                description: '90 min. moderate or 40 min. vigorous',
                examples: ['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga']
            }
        ];
    }

    getOneBeanCategories() {
        return [
            {
                id: 'beans',
                name: 'Beans',
                icon: '🫘',
                servings: 1,
                description: '½ c. cooked beans, ¼ c. hummus',
                examples: ['Black beans', 'Chickpeas', 'Lentils', 'Hummus', 'Edamame']
            },
            {
                id: 'protein',
                name: 'Protein',
                icon: '🥩',
                servings: 1,
                description: '3 oz lean meat, 1 egg, ½ c. beans',
                examples: ['Chicken breast', 'Fish', 'Eggs', 'Lean beef', 'Tofu']
            },
            {
                id: 'berries',
                name: 'Berries',
                icon: '🫐',
                servings: 1,
                description: '½ c. fresh or frozen, ¼ c. dried',
                examples: ['Blueberries', 'Strawberries', 'Raspberries', 'Blackberries', 'Cranberries']
            },
            {
                id: 'other-fruits',
                name: 'Other Fruits',
                icon: '🍎',
                servings: 3,
                description: '1 medium fruit, ¼ c. dried fruit',
                examples: ['Apples', 'Bananas', 'Oranges', 'Grapes', 'Pineapple']
            },
            {
                id: 'greens',
                name: 'Greens',
                icon: '🥬',
                servings: 2,
                description: '1 c. raw, ½ c. cooked',
                examples: ['Spinach', 'Kale', 'Arugula', 'Swiss chard', 'Collard greens']
            },
            {
                id: 'cruciferous',
                name: 'Cruciferous Vegetables',
                icon: '🥦',
                servings: 1,
                description: '½ c. chopped, 1 tbsp horseradish',
                examples: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Cabbage', 'Kale']
            },
            {
                id: 'other-vegetables',
                name: 'Other Vegetables',
                icon: '🥕',
                servings: 2,
                description: '½ c. nonleafy vegetables',
                examples: ['Carrots', 'Bell peppers', 'Tomatoes', 'Cucumber', 'Zucchini']
            },
            {
                id: 'nuts-seeds',
                name: 'Nuts and Seeds',
                icon: '🥜',
                servings: 1,
                description: '¼ c. nuts, 2 tbsp nut butter',
                examples: ['Almonds', 'Walnuts', 'Chia seeds', 'Pumpkin seeds', 'Peanut butter']
            },
            {
                id: 'herbs-spices',
                name: 'Herbs and Spices',
                icon: '🌿',
                servings: 1,
                description: '¼ tsp turmeric',
                examples: ['Turmeric', 'Cinnamon', 'Ginger', 'Garlic', 'Basil']
            },
            {
                id: 'whole-grains',
                name: 'Whole Grains',
                icon: '🌾',
                servings: 3,
                description: '½ c. hot cereal, 1 slice of bread',
                examples: ['Oatmeal', 'Brown rice', 'Quinoa', 'Whole wheat bread', 'Barley']
            },
            {
                id: 'beverages',
                name: 'Beverages',
                icon: '💧',
                servings: 5,
                description: '60 oz per day',
                examples: ['Water', 'Green tea', 'Hibiscus tea', 'Herbal tea']
            },
            {
                id: 'exercise',
                name: 'Exercise',
                icon: '🏃',
                servings: 1,
                description: '90 min. moderate or 40 min. vigorous',
                examples: ['Walking', 'Running', 'Cycling', 'Swimming', 'Yoga']
            }
        ];
    }

    getCategoriesForDietType(dietType) {
        if (dietType === 'modified') {
            return this.getModifiedCategories();
        } else if (dietType === 'one-bean') {
            return this.getOneBeanCategories();
        } else {
            return this.getStandardCategories();
        }
    }

    loadDietType() {
        const profileDietKey = this.getDietTypeStorageKey(this.currentProfile);
        const savedDietType = localStorage.getItem(profileDietKey);
        return savedDietType || 'standard';
    }

    saveDietType(dietType) {
        const profileDietKey = this.getDietTypeStorageKey(this.currentProfile);
        localStorage.setItem(profileDietKey, dietType);
    }

    loadProfiles() {
        const savedProfiles = localStorage.getItem(this.profileStorageKey);
        if (savedProfiles) {
            return JSON.parse(savedProfiles);
        }
        // Default profiles
        return {
            'user': { name: 'You', color: '#548444' },
            'other': { name: 'Other', color: '#b9803c' }
        };
    }

    saveProfiles() {
        localStorage.setItem(this.profileStorageKey, JSON.stringify(this.profiles));
    }

    loadCurrentProfile() {
        const savedProfile = localStorage.getItem(this.currentProfileKey);
        return savedProfile || 'user';
    }

    saveCurrentProfile(profileId) {
        localStorage.setItem(this.currentProfileKey, profileId);
    }

    getProfileStorageKey(profileId) {
        return `${this.storageKey}_${profileId}`;
    }

    getDietTypeStorageKey(profileId) {
        return `${this.dietTypeStorageKey}_${profileId}`;
    }

    init() {
        this.updateDateDisplay();
        this.setProfileSelector();
        this.setDietTypeSelector();
        this.renderCategories();
        const data = this.loadData();
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.updateHeaderColor();
        this.updateDietTypeLabel();
        this.setupEventListeners();
        this.registerServiceWorker();
        this.setupPWAInstallation();
        this.checkForPendingUpdates();
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
    }

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
            
            // Add click handler for the main profile button
            profileBtn.addEventListener('click', (e) => {
                // Don't trigger profile switch if clicking the edit button
                if (!e.target.classList.contains('edit-profile-btn')) {
                    this.switchProfile(profileId);
                }
            });
            
            // Add click handler for the edit button
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
        
        // Save current profile's diet type
        this.saveDietType(this.dietType);
        
        // Switch to new profile
        this.currentProfile = profileId;
        this.saveCurrentProfile(profileId);
        
        // Load new profile's diet type
        this.dietType = this.loadDietType();
        this.categories = this.getCategoriesForDietType(this.dietType);
        
        // Update UI
        this.setProfileSelector();
        this.setDietTypeSelector();
        this.renderCategories();
        
        // Load and restore new profile's data
        const data = this.loadData();
        this.restoreCheckboxes(data);
        this.updateProgress();
        
        // Update header color
        this.updateHeaderColor();
        
        // Update diet type label
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
        
        // Create a simple prompt for editing
        const newName = prompt(`Enter a new name for ${currentName}:`, currentName);
        
        if (newName && newName.trim() && newName.trim() !== currentName) {
            // Update the profile name
            this.profiles[profileId].name = newName.trim();
            this.saveProfiles();
            
            // Update the UI
            this.setProfileSelector();
            this.updateDietTypeLabel();
            
            // Show confirmation
            this.showProfileNameUpdated(newName.trim());
        }
    }

    showProfileNameUpdated(newName) {
        // Create a temporary confirmation message
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'profile-update-confirmation';
        confirmationDiv.innerHTML = `
            <div class="confirmation-content">
                <span>✅ Profile name updated to "${newName}"</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(confirmationDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (confirmationDiv.parentNode) {
                confirmationDiv.parentNode.removeChild(confirmationDiv);
            }
        }, 3000);
    }

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
        
        // Add links for various categories
        let categoryName = category.name;
        
        switch(category.id) {
            case 'beans':
                categoryName = `<a href="https://nutritionfacts.org/topics/beans/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'berries':
                categoryName = `<a href="https://nutritionfacts.org/topics/berries/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'other-fruits':
                categoryName = `<a href="https://nutritionfacts.org/topics/fruit/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'greens':
                categoryName = `<a href="https://nutritionfacts.org/topics/greens/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'cruciferous':
                categoryName = `<a href="https://nutritionfacts.org/topics/cruciferous-vegetables/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'other-vegetables':
                categoryName = `<a href="https://nutritionfacts.org/topics/vegetables/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'flaxseed':
                categoryName = `<a href="https://nutritionfacts.org/topics/flax-seeds/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'nuts-seeds':
                categoryName = `<a href="https://nutritionfacts.org/topics/nuts/" target="_blank" rel="noopener noreferrer">Nuts</a> and <a href="https://nutritionfacts.org/topics/seeds/" target="_blank" rel="noopener noreferrer">Seeds</a>`;
                break;
            case 'herbs-spices':
                categoryName = `<a href="https://nutritionfacts.org/topics/herbs/" target="_blank" rel="noopener noreferrer">Herbs</a> and <a href="https://nutritionfacts.org/topics/spices/" target="_blank" rel="noopener noreferrer">Spices</a>`;
                break;
            case 'whole-grains':
                categoryName = `<a href="https://nutritionfacts.org/topics/grains/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'beverages':
                categoryName = `<a href="https://nutritionfacts.org/topics/beverages/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'exercise':
                categoryName = `<a href="https://nutritionfacts.org/topics/exercise/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
            case 'protein':
                categoryName = `<a href="https://nutritionfacts.org/topics/protein/" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
                break;
        }
        
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

    setupEventListeners() {
        // Diet type change event
        const dietTypeSelect = document.getElementById('diet-type');
        dietTypeSelect.addEventListener('change', (e) => {
            this.handleDietTypeChange(e.target.value);
        });

        // Checkbox change events
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('serving-checkbox')) {
                this.handleServingChange(e.target);
            }
        });

        // Reset day button
        const resetDayBtn = document.getElementById('reset-day-btn');
        if (resetDayBtn) {
            resetDayBtn.addEventListener('click', () => {
                this.resetDay();
            });
        }

        // Gratitude button
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

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    gratitudeModal.style.display = 'none';
                }
            });
        }



        // Footer install button
        const footerInstallBtn = document.getElementById('footer-install-btn');
        if (footerInstallBtn) {
            footerInstallBtn.addEventListener('click', () => {
                this.showManualInstallInstructions();
            });
        }

        // Version info button
        const versionInfoBtn = document.getElementById('version-info-btn');
        if (versionInfoBtn) {
            versionInfoBtn.addEventListener('click', () => {
                this.showVersionInfo();
            });
        }
    }

    handleServingChange(checkbox) {
        const categoryId = checkbox.dataset.category;
        const servingIndex = parseInt(checkbox.dataset.serving);
        const isChecked = checkbox.checked;

        console.log(`handleServingChange: ${categoryId}-${servingIndex}, initial checked: ${isChecked}`);

        // If checking a box, also check all boxes to the left that are unchecked
        if (isChecked) {
            this.fillCheckboxesToLeft(categoryId, servingIndex);
        }
        // If unchecking a box, handle the new behavior
        else {
            this.handleUncheckBehavior(categoryId, servingIndex, checkbox);
        }

        console.log(`handleServingChange: ${categoryId}-${servingIndex}, final checked: ${checkbox.checked}`);

        // Save the current state of the checkbox after all logic has been applied
        this.saveServing(categoryId, servingIndex, checkbox.checked);
        this.updateProgress();
        this.updateCategoryStatus(categoryId);
    }

    fillCheckboxesToLeft(categoryId, servingIndex) {
        // Check if there are any checked boxes to the right of the current one
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        let hasCheckedBoxesToRight = false;
        for (let i = servingIndex + 1; i < category.servings; i++) {
            const rightCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (rightCheckbox && rightCheckbox.checked) {
                hasCheckedBoxesToRight = true;
                break;
            }
        }
        
        if (hasCheckedBoxesToRight) {
            // If there are checked boxes to the right, uncheck the clicked box and all to its right
            this.uncheckBoxesToRight(categoryId, servingIndex);
            // Also uncheck the clicked box itself
            const clickedCheckbox = document.getElementById(`${categoryId}-${servingIndex}`);
            if (clickedCheckbox) {
                clickedCheckbox.checked = false;
                this.saveServing(categoryId, servingIndex, false);
            }
            // Force CSS re-evaluation by temporarily adding a class to the body
            document.body.classList.add('force-update');
            setTimeout(() => {
                document.body.classList.remove('force-update');
            }, 0);
            // Update progress and category status after all changes
            this.updateProgress();
            this.updateCategoryStatus(categoryId);
        } else {
            // Check all checkboxes to the left of the current one
            for (let i = 0; i < servingIndex; i++) {
                const leftCheckbox = document.getElementById(`${categoryId}-${i}`);
                if (leftCheckbox && !leftCheckbox.checked) {
                    leftCheckbox.checked = true;
                    this.saveServing(categoryId, i, true);
                }
            }
        }
    }

    handleUncheckBehavior(categoryId, servingIndex, checkbox) {
        console.log(`handleUncheckBehavior: ${categoryId}-${servingIndex}`);
        
        // Find the leftmost and rightmost checked checkboxes in this category
        // BUT temporarily re-check the clicked checkbox to get the correct state
        const wasChecked = checkbox.checked;
        checkbox.checked = true;
        
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        let leftmostCheckedIndex = -1;
        let rightmostCheckedIndex = -1;
        
        // Find leftmost checked box
        for (let i = 0; i < category.servings; i++) {
            const currentCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (currentCheckbox && currentCheckbox.checked) {
                leftmostCheckedIndex = i;
                break;
            }
        }
        
        // Find rightmost checked box
        for (let i = category.servings - 1; i >= 0; i--) {
            const currentCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (currentCheckbox && currentCheckbox.checked) {
                rightmostCheckedIndex = i;
                break;
            }
        }
        
        console.log(`handleUncheckBehavior: leftmost=${leftmostCheckedIndex}, rightmost=${rightmostCheckedIndex}`);
        
        // If the clicked checkbox is the leftmost checked one, uncheck all boxes
        if (servingIndex === leftmostCheckedIndex) {
            console.log(`handleUncheckBehavior: unchecking all boxes for ${categoryId}`);
            this.uncheckAllBoxes(categoryId);
        }
        // If the clicked checkbox is the rightmost checked one, uncheck it and all to the left
        else if (servingIndex === rightmostCheckedIndex) {
            console.log(`handleUncheckBehavior: unchecking boxes to left for ${categoryId}-${servingIndex}`);
            this.uncheckBoxesToLeft(categoryId, servingIndex);
        } else {
            // Check if there are any checked boxes to the right of the clicked box
            let hasCheckedBoxesToRight = false;
            for (let i = servingIndex + 1; i < category.servings; i++) {
                const rightCheckbox = document.getElementById(`${categoryId}-${i}`);
                if (rightCheckbox && rightCheckbox.checked) {
                    hasCheckedBoxesToRight = true;
                    break;
                }
            }
            
            if (hasCheckedBoxesToRight) {
                // If the clicked checkbox has checked boxes to its right, 
                // re-check the clicked box and uncheck only the boxes to its right
                console.log(`handleUncheckBehavior: re-checking ${categoryId}-${servingIndex} and unchecking to right`);
                checkbox.checked = true;
                this.uncheckBoxesToRight(categoryId, servingIndex);
            } else {
                // If no checked boxes to the right, leave the clicked box unchecked
                checkbox.checked = false;
            }
        }
    }

    uncheckBoxesToLeft(categoryId, servingIndex) {
        // Uncheck all checkboxes to the left of the current one AND the current one
        for (let i = 0; i <= servingIndex; i++) {
            const leftCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (leftCheckbox && leftCheckbox.checked) {
                leftCheckbox.checked = false;
                this.saveServing(categoryId, i, false);
            }
        }
    }

    uncheckBoxesToRight(categoryId, servingIndex) {
        // Uncheck all checkboxes to the right of the current one
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        for (let i = servingIndex + 1; i < category.servings; i++) {
            const rightCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (rightCheckbox && rightCheckbox.checked) {
                rightCheckbox.checked = false;
                this.saveServing(categoryId, i, false);
            }
        }
    }

    uncheckAllBoxes(categoryId) {
        console.log(`uncheckAllBoxes: unchecking all boxes for ${categoryId}`);
        
        // Uncheck all checkboxes in the category
        const category = this.categories.find(c => c.id === categoryId);
        if (!category) return;
        
        for (let i = 0; i < category.servings; i++) {
            const checkbox = document.getElementById(`${categoryId}-${i}`);
            if (checkbox && checkbox.checked) {
                console.log(`uncheckAllBoxes: unchecking ${categoryId}-${i}`);
                checkbox.checked = false;
                this.saveServing(categoryId, i, false);
            }
        }
        
        // Force UI update
        console.log(`uncheckAllBoxes: forcing UI update for ${categoryId}`);
        this.forceUIUpdate(categoryId);
        
        // Debug: Check final states
        console.log(`uncheckAllBoxes: final checkbox states for ${categoryId}:`);
        for (let i = 0; i < category.servings; i++) {
            const checkbox = document.getElementById(`${categoryId}-${i}`);
            if (checkbox) {
                console.log(`  ${categoryId}-${i}: checked=${checkbox.checked}`);
            }
        }
    }

    forceUIUpdate(categoryId) {
        // Force CSS re-evaluation by temporarily adding a class to the body
        document.body.classList.add('force-update');
        setTimeout(() => {
            document.body.classList.remove('force-update');
        }, 0);
    }

    saveServing(categoryId, servingIndex, isChecked) {
        const data = this.loadData();
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

        const profileStorageKey = this.getProfileStorageKey(this.currentProfile);
        localStorage.setItem(profileStorageKey, JSON.stringify(data));
    }

    loadData() {
        const profileStorageKey = this.getProfileStorageKey(this.currentProfile);
        const data = localStorage.getItem(profileStorageKey);
        if (data) {
            const parsedData = JSON.parse(data);
            return parsedData;
        }
        return {};
    }

    restoreCheckboxes(data) {
        const dateKey = this.currentDate.toDateString();
        if (data[dateKey]) {
            Object.keys(data[dateKey]).forEach(categoryId => {
                // Only process categories that exist in the current diet type
                const categoryExists = this.categories.some(c => c.id === categoryId);
                if (!categoryExists) {
                    return; // Skip categories that don't exist in current diet type
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

    updateProgress() {
        const data = this.loadData();
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

        // Update progress bar color based on completion
        if (percentage >= 100) {
            progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #548444)';
            // Show celebration when daily dozen is completed
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
            data = this.loadData();
        }
        const dateKey = this.currentDate.toDateString();
        const category = this.categories.find(c => c.id === categoryId);

        // Safety check: ensure category exists and card is found
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

    showCompletionCelebration() {
        // Check if we've already shown celebration for today
        const celebrationKey = `dailyDozenCelebration_${this.currentProfile}_${this.currentDate.toDateString()}`;
        if (localStorage.getItem(celebrationKey)) {
            return; // Already shown today
        }

        // Create celebration modal
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

        // Add to page
        document.body.appendChild(celebrationModal);

        // Mark celebration as shown for today
        localStorage.setItem(celebrationKey, 'true');

        // Add some animation
        setTimeout(() => {
            celebrationModal.classList.add('show');
        }, 100);
    }

    resetDay() {
        // Show confirmation dialog
        if (!confirm('Are you sure you want to reset all your progress for today? This action cannot be undone.')) {
            return;
        }

        // Clear all checkboxes on the page
        const checkboxes = document.querySelectorAll('.serving-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Remove today's data from localStorage
        const data = this.loadData();
        const dateKey = this.currentDate.toDateString();
        if (data[dateKey]) {
            delete data[dateKey];
            const profileStorageKey = this.getProfileStorageKey(this.currentProfile);
            localStorage.setItem(profileStorageKey, JSON.stringify(data));
        }

        // Remove the celebration flag for today so it can show again
        const celebrationKey = `dailyDozenCelebration_${this.currentProfile}_${this.currentDate.toDateString()}`;
        localStorage.removeItem(celebrationKey);

        // Update progress and category status
        this.updateProgress();
        this.categories.forEach(category => {
            this.updateCategoryStatus(category.id);
        });

        // Show confirmation message
        this.showResetConfirmation();
    }

    showResetConfirmation() {
        // Create a temporary confirmation message
        const confirmationDiv = document.createElement('div');
        confirmationDiv.className = 'reset-confirmation';
        confirmationDiv.innerHTML = `
            <div class="confirmation-content">
                <p>✅ Day reset successfully! You can now start fresh.</p>
            </div>
        `;

        // Add to page
        document.body.appendChild(confirmationDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            if (confirmationDiv.parentNode) {
                confirmationDiv.parentNode.removeChild(confirmationDiv);
            }
        }, 3000);
    }

    setDietTypeSelector() {
        const dietTypeSelect = document.getElementById('diet-type');
        if (dietTypeSelect) {
            dietTypeSelect.value = this.dietType;
        }
    }

    handleDietTypeChange(newDietType) {
        this.dietType = newDietType;
        this.saveDietType(newDietType);
        
        // Update categories based on diet type
        this.categories = this.getCategoriesForDietType(newDietType);
        
        // Re-render the categories
        this.renderCategories();
        
        // Restore any existing data for the current date
        const data = this.loadData();
        this.restoreCheckboxes(data);
        
        // Update progress with new total
        this.updateProgress();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Use version-based registration for controlled updates
            const swUrl = 'sw.js?v=2.0.8';
            
            navigator.serviceWorker.register(swUrl)
                .then(registration => {
                    console.log('Service Worker registered successfully');
                    
                    // Store registration for later use
                    this.swRegistration = registration;
                    
                    // Wait for the service worker to be ready
                    if (registration.installing) {
                        registration.installing.addEventListener('statechange', () => {
                            if (registration.installing.state === 'installed') {
                                console.log('Service Worker installed and ready');
                            }
                        });
                    }
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available, show update notification
                                this.showUpdateNotification();
                            }
                        });
                    });
                    
                    // Listen for service worker messages
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        if (event.data && event.data.type === 'SW_UPDATED') {
                            this.handleServiceWorkerUpdate(event.data);
                        }
                    });
                    
                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 300000); // Check every 5 minutes
                    
                    // Initial update check
                    registration.update();
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    showUpdateNotification(version = null) {
        // Remove any existing update notifications
        const existingNotification = document.querySelector('.update-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create update notification
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                <p>🔄 A new version is available!</p>
                ${version ? `<small>Version ${version}</small>` : ''}
                <div class="update-buttons">
                    <button class="update-btn">Update Now</button>
                    <button class="dismiss-btn">Later</button>
                </div>
            </div>
        `;

        // Add event listeners to buttons
        const updateBtn = updateNotification.querySelector('.update-btn');
        const dismissBtn = updateNotification.querySelector('.dismiss-btn');
        
        updateBtn.addEventListener('click', () => {
            this.updateApp();
        });
        
        dismissBtn.addEventListener('click', () => {
            this.dismissUpdate();
        });

        // Add to page
        document.body.appendChild(updateNotification);

        // Store notification reference
        this.currentUpdateNotification = updateNotification;

        // Auto-remove after 30 seconds if not dismissed
        setTimeout(() => {
            if (updateNotification.parentNode && !updateNotification.classList.contains('dismissed')) {
                updateNotification.remove();
            }
        }, 30000);
    }

    handleServiceWorkerUpdate(updateData) {
        console.log('Service Worker updated:', updateData);
        
        // Store update info
        this.lastUpdateInfo = updateData;
        
        // Show update notification with version info
        this.showUpdateNotification(updateData.version);
        
        // Update local storage with new version info
        localStorage.setItem('dailyDozenLastUpdate', JSON.stringify({
            version: updateData.version,
            timestamp: updateData.timestamp,
            applied: false
        }));
    }

    updateApp() {
        // Remove update notification
        if (this.currentUpdateNotification) {
            this.currentUpdateNotification.remove();
        }

        // Mark the update as applied
        if (this.lastUpdateInfo) {
            localStorage.setItem('dailyDozenLastUpdate', JSON.stringify({
                version: this.lastUpdateInfo.version,
                timestamp: this.lastUpdateInfo.timestamp,
                applied: true,
                appliedAt: new Date().toISOString()
            }));
        }

        // Show loading state
        this.showUpdateLoading();

        // Reload the page to apply the update
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    dismissUpdate() {
        if (this.currentUpdateNotification) {
            this.currentUpdateNotification.classList.add('dismissed');
            this.currentUpdateNotification.remove();
        }

        // Mark update as dismissed
        if (this.lastUpdateInfo) {
            localStorage.setItem('dailyDozenLastUpdate', JSON.stringify({
                version: this.lastUpdateInfo.version,
                timestamp: this.lastUpdateInfo.timestamp,
                dismissed: true,
                dismissedAt: new Date().toISOString()
            }));
        }
    }

    showUpdateLoading() {
        const loadingNotification = document.createElement('div');
        loadingNotification.className = 'update-notification update-loading';
        loadingNotification.innerHTML = `
            <div class="update-content">
                <p>⏳ Updating app...</p>
                <div class="loading-spinner"></div>
            </div>
        `;

        document.body.appendChild(loadingNotification);
    }

    checkForUpdates() {
        if (this.swRegistration) {
            console.log('Checking for updates...');
            this.swRegistration.update();
            
            // Listen for updatefound event
            this.swRegistration.addEventListener('updatefound', () => {
                console.log('Update found!');
                this.showUpdateFoundFeedback();
                
                const newWorker = this.swRegistration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('New service worker installed, showing update notification');
                        this.showUpdateNotification();
                    }
                });
            });
        } else {
            console.log('No service worker registration available');
        }
    }

    getCurrentVersion() {
        return new Promise((resolve) => {
            // First try to get version from service worker
            if (navigator.serviceWorker.controller) {
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = (event) => {
                    resolve(event.data);
                };
                
                // Set a timeout in case the service worker doesn't respond
                const timeout = setTimeout(() => {
                    console.log('Service worker version request timed out, using fallback');
                    resolve({ version: 'v2.0.8', timestamp: new Date().toISOString() });
                }, 2000);
                
                messageChannel.port1.onmessage = (event) => {
                    clearTimeout(timeout);
                    resolve(event.data);
                };
                
                navigator.serviceWorker.controller.postMessage(
                    { type: 'GET_VERSION' },
                    [messageChannel.port2]
                );
            } else {
                // Fallback: use the version from the service worker registration
                navigator.serviceWorker.getRegistration().then(registration => {
                    if (registration && registration.active) {
                        // Extract version from the service worker URL or use default
                        const swUrl = registration.active.scriptURL;
                        const versionMatch = swUrl.match(/[?&]v=([^&]+)/);
                        const version = versionMatch ? versionMatch[1] : 'v2.0.8';
                        resolve({ version: version, timestamp: new Date().toISOString() });
                    } else {
                        resolve({ version: 'v2.0.8', timestamp: new Date().toISOString() });
                    }
                }).catch(() => {
                    resolve({ version: 'v2.0.8', timestamp: new Date().toISOString() });
                });
            }
        });
    }

    checkForPendingUpdates() {
        // Check if there's a pending update that was dismissed
        const lastUpdate = localStorage.getItem('dailyDozenLastUpdate');
        if (lastUpdate) {
            try {
                const updateInfo = JSON.parse(lastUpdate);
                
                // Check current version to see if update is still relevant
                this.getCurrentVersion().then(currentVersion => {
                    // If the stored update version matches current version, clear the update info
                    if (updateInfo.version === currentVersion.version) {
                        localStorage.removeItem('dailyDozenLastUpdate');
                        return;
                    }
                    
                    // Check if the dismissed update is still relevant (within 24 hours)
                    if (updateInfo.dismissed && !updateInfo.applied) {
                        const dismissedTime = new Date(updateInfo.dismissedAt);
                        const now = new Date();
                        const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
                        
                        // If dismissed less than 24 hours ago, show a reminder
                        if (hoursSinceDismissed < 24) {
                            setTimeout(() => {
                                this.showUpdateReminder(updateInfo.version);
                            }, 5000); // Show after 5 seconds
                        } else {
                            // Clear old dismissed updates
                            localStorage.removeItem('dailyDozenLastUpdate');
                        }
                    }
                });
            } catch (e) {
                console.log('Error parsing last update info:', e);
            }
        }

        // Check current version and compare with stored version
        this.getCurrentVersion().then(versionInfo => {
            const storedVersion = localStorage.getItem('dailyDozenCurrentVersion');
            if (storedVersion && storedVersion !== versionInfo.version) {
                // Version has changed, update stored version
                localStorage.setItem('dailyDozenCurrentVersion', versionInfo.version);
                localStorage.setItem('dailyDozenVersionUpdated', new Date().toISOString());
            } else if (!storedVersion) {
                // First time, store current version
                localStorage.setItem('dailyDozenCurrentVersion', versionInfo.version);
            }
        });
    }

    showUpdateReminder(version) {
        const reminderNotification = document.createElement('div');
        reminderNotification.className = 'update-notification update-reminder';
        reminderNotification.innerHTML = `
            <div class="update-content">
                <p>📱 Don't forget to update!</p>
                <small>Version ${version} is still available</small>
                <div class="update-buttons">
                    <button class="update-btn">Update Now</button>
                    <button class="dismiss-btn">Not Now</button>
                </div>
            </div>
        `;

        // Add event listeners to buttons
        const updateBtn = reminderNotification.querySelector('.update-btn');
        const dismissBtn = reminderNotification.querySelector('.dismiss-btn');
        
        updateBtn.addEventListener('click', () => {
            this.updateApp();
        });
        
        dismissBtn.addEventListener('click', () => {
            this.dismissUpdateReminder();
        });

        document.body.appendChild(reminderNotification);
        this.currentUpdateReminder = reminderNotification;

        // Auto-remove after 15 seconds
        setTimeout(() => {
            if (reminderNotification.parentNode) {
                reminderNotification.remove();
            }
        }, 15000);
    }

    dismissUpdateReminder() {
        if (this.currentUpdateReminder) {
            this.currentUpdateReminder.remove();
        }
        
        // Mark reminder as dismissed
        const lastUpdate = localStorage.getItem('dailyDozenLastUpdate');
        if (lastUpdate) {
            try {
                const updateInfo = JSON.parse(lastUpdate);
                updateInfo.reminderDismissed = true;
                updateInfo.reminderDismissedAt = new Date().toISOString();
                localStorage.setItem('dailyDozenLastUpdate', JSON.stringify(updateInfo));
            } catch (e) {
                console.log('Error updating reminder dismissal:', e);
            }
        }
    }



    showUpdateCheckFeedback() {
        const feedbackNotification = document.createElement('div');
        feedbackNotification.className = 'update-notification update-feedback';
        feedbackNotification.innerHTML = `
            <div class="update-content">
                <p>🔍 Checking for updates...</p>
                <small>This may take a moment</small>
            </div>
        `;

        document.body.appendChild(feedbackNotification);

        // Store reference for potential update
        this.currentFeedbackNotification = feedbackNotification;

        // Update the message after 2 seconds to show completion
        setTimeout(() => {
            if (feedbackNotification.parentNode) {
                feedbackNotification.innerHTML = `
                    <div class="update-content">
                        <p>✅ Update check completed</p>
                        <small>No new updates available</small>
                    </div>
                `;
            }
        }, 2000);

        // Remove after 4 seconds
        setTimeout(() => {
            if (feedbackNotification.parentNode) {
                feedbackNotification.remove();
            }
        }, 4000);
    }

    showUpdateFoundFeedback() {
        // Remove the current feedback notification if it exists
        if (this.currentFeedbackNotification && this.currentFeedbackNotification.parentNode) {
            this.currentFeedbackNotification.remove();
        }

        const updateFoundNotification = document.createElement('div');
        updateFoundNotification.className = 'update-notification update-found';
        updateFoundNotification.innerHTML = `
            <div class="update-content">
                <p>🎉 New update found!</p>
                <small>An update is available for your app</small>
            </div>
        `;

        document.body.appendChild(updateFoundNotification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (updateFoundNotification.parentNode) {
                updateFoundNotification.remove();
            }
        }, 3000);
    }

    async showVersionInfo() {
        const currentVersion = await this.getCurrentVersion();
        const lastUpdate = localStorage.getItem('dailyDozenLastUpdate');
        const currentVersionStored = localStorage.getItem('dailyDozenCurrentVersion');
        
        console.log('Current version detected:', currentVersion);
        console.log('Stored version:', currentVersionStored);
        console.log('Last update info:', lastUpdate);
        
        // Check if there's a pending update
        let updateStatus = '✅ Up to date';
        let lastUpdateInfo = '';
        
        if (lastUpdate) {
            try {
                const updateInfo = JSON.parse(lastUpdate);
                console.log('Stored update info:', updateInfo);
                console.log('Current version:', currentVersion);
                
                // Compare the stored update version with current version
                if (updateInfo.version === currentVersion.version) {
                    // Same version - no update needed
                    updateStatus = '✅ Up to date';
                    console.log('Versions match - up to date');
                } else if (!updateInfo.applied && !updateInfo.dismissed) {
                    // Different version and not applied/dismissed
                    updateStatus = '🔄 Update available';
                    console.log('Update available - different version');
                } else if (updateInfo.dismissed) {
                    // Update was dismissed
                    updateStatus = '⏸️ Update dismissed';
                    console.log('Update dismissed');
                } else if (updateInfo.applied) {
                    // Update was applied
                    updateStatus = '✅ Up to date';
                    console.log('Update applied');
                }
                
                const updateDate = new Date(updateInfo.timestamp).toLocaleDateString();
                lastUpdateInfo = `
                    <div class="version-detail">
                        <strong>Last Update Available:</strong> ${updateInfo.version} (${updateDate})
                        ${updateInfo.dismissed ? '<br><small>Update was dismissed</small>' : ''}
                        ${updateInfo.applied ? '<br><small>Update was applied</small>' : ''}
                    </div>
                `;
            } catch (e) {
                console.log('Error parsing last update info:', e);
            }
        }
        if (lastUpdate) {
            try {
                const updateInfo = JSON.parse(lastUpdate);
                const updateDate = new Date(updateInfo.timestamp).toLocaleDateString();
                lastUpdateInfo = `
                    <div class="version-detail">
                        <strong>Last Update Available:</strong> ${updateInfo.version} (${updateDate})
                        ${updateInfo.dismissed ? '<br><small>Update was dismissed</small>' : ''}
                    </div>
                `;
            } catch (e) {
                console.log('Error parsing last update info:', e);
            }
        }

        const versionModal = document.createElement('div');
        versionModal.className = 'version-modal';
        versionModal.innerHTML = `
            <div class="modal-content version-modal-content">
                <h3>📱 App Version Information</h3>
                <div class="version-details">
                    <div class="version-detail">
                        <strong>Current Version:</strong> ${currentVersion.version}
                    </div>
                    <div class="version-detail">
                        <strong>Last Updated:</strong> ${new Date(currentVersion.timestamp).toLocaleDateString()}
                    </div>
                    ${lastUpdateInfo}
                    <div class="version-detail">
                        <strong>Update Status:</strong> ${updateStatus}
                    </div>
                    <div class="version-detail">
                        <strong>Installation Status:</strong> 
                        ${window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true 
                            ? '✅ Installed as PWA' 
                            : '🌐 Running in browser'}
                    </div>
                </div>
                <div class="version-actions">
                    <button class="update-btn">Check for Updates</button>
                    <button class="dismiss-btn">Close</button>
                </div>
            </div>
        `;

        // Add event listeners to buttons
        const checkUpdateBtn = versionModal.querySelector('.update-btn');
        const closeBtn = versionModal.querySelector('.dismiss-btn');
        
        checkUpdateBtn.addEventListener('click', () => {
            // Add loading state to the button
            checkUpdateBtn.textContent = '⏳ Checking...';
            checkUpdateBtn.disabled = true;
            
            // Check for updates
            this.checkForUpdates();
            
            // Show feedback notification
            this.showUpdateCheckFeedback();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                checkUpdateBtn.textContent = 'Check for Updates';
                checkUpdateBtn.disabled = false;
            }, 3000);
        });
        

        
        closeBtn.addEventListener('click', () => {
            versionModal.remove();
        });

        document.body.appendChild(versionModal);

        // Close on background click
        versionModal.addEventListener('click', (e) => {
            if (e.target === versionModal) {
                versionModal.remove();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                versionModal.remove();
            }
        });
    }

    setupPWAInstallation() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show the install button
            this.showInstallButton();
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', (evt) => {
            // Hide the install button
            this.hideInstallButton();
            // Log the installation
            console.log('Daily Dozen Tracker was installed successfully');
            // Show success message
            this.showInstallationSuccess();
        });

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            console.log('App is already installed');
        } else {
            // Show manual install instructions if PWA criteria are met
            this.checkAndShowManualInstall();
        }
    }

    showInstallButton() {
        // Check if user has dismissed install prompts
        if (this.hasUserDismissedInstall()) {
            return;
        }
        
        // Remove existing install button if present
        this.hideInstallButton();
        
        const installButton = document.createElement('div');
        installButton.className = 'install-prompt';
        installButton.innerHTML = `
            <div class="install-content">
                <div class="install-icon">📱</div>
                <div class="install-text">
                    <h4>Install Daily Dozen Tracker</h4>
                    <p>Add to your home screen for quick access and offline use</p>
                </div>
                <button class="install-btn" onclick="window.dailyDozenTracker.installApp()">
                    Install App
                </button>
                <button class="dismiss-install-btn" onclick="window.dailyDozenTracker.dismissInstallPrompt()">
                    ✕
                </button>
            </div>
        `;

        document.body.appendChild(installButton);
    }

    hideInstallButton() {
        const existingButton = document.querySelector('.install-prompt');
        if (existingButton) {
            existingButton.remove();
        }
    }

    dismissInstallPrompt() {
        this.hideInstallButton();
        this.saveInstallDismissed();
    }

    dismissManualInstallPrompt() {
        const existingButton = document.querySelector('.manual-install-prompt');
        if (existingButton) {
            existingButton.remove();
        }
        this.saveInstallDismissed();
    }

    hasUserDismissedInstall() {
        try {
            const dismissed = localStorage.getItem(this.installDismissedKey);
            return dismissed === 'true';
        } catch (error) {
            console.log('Error checking install dismissed status:', error);
            return false;
        }
    }

    saveInstallDismissed() {
        try {
            localStorage.setItem(this.installDismissedKey, 'true');
            console.log('Install prompts dismissed by user');
        } catch (error) {
            console.log('Error saving install dismissed status:', error);
        }
    }

    resetInstallDismissed() {
        try {
            localStorage.removeItem(this.installDismissedKey);
            console.log('Install dismissed status reset');
        } catch (error) {
            console.log('Error resetting install dismissed status:', error);
        }
    }

    installApp() {
        if (this.deferredPrompt) {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                // Clear the deferredPrompt
                this.deferredPrompt = null;
            });
        } else {
            // Fallback: show manual installation instructions
            this.showManualInstallInstructions();
        }
    }

    showInstallationSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'installation-success';
        successDiv.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✅</div>
                <h4>Successfully Installed!</h4>
                <p>Daily Dozen Tracker is now available on your home screen</p>
                <button onclick="this.parentElement.parentElement.remove()" class="close-success-btn">
                    Great!
                </button>
            </div>
        `;

        document.body.appendChild(successDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }

    checkAndShowManualInstall() {
        // Check if user has dismissed install prompts
        if (this.hasUserDismissedInstall()) {
            return;
        }
        
        // Check if the app meets PWA criteria
        if (this.isPWAReady()) {
            // Show manual install button after a delay
            setTimeout(() => {
                this.showManualInstallButton();
            }, 3000);
        }
    }

    isPWAReady() {
        // Check if we have a service worker
        if (!('serviceWorker' in navigator)) return false;
        
        // Check if we have a manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) return false;
        
        // Check if we're on HTTPS (required for PWA)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') return false;
        
        return true;
    }

    showManualInstallButton() {
        // Check if user has dismissed install prompts
        if (this.hasUserDismissedInstall()) {
            return;
        }
        
        // Only show if not already installed and no automatic prompt is available
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            return;
        }

        const manualButton = document.createElement('div');
        manualButton.className = 'manual-install-prompt';
        manualButton.innerHTML = `
            <div class="manual-install-content">
                <div class="manual-install-icon">📱</div>
                <div class="manual-install-text">
                    <h4>Install Daily Dozen Tracker</h4>
                    <p>Get quick access and offline functionality</p>
                </div>
                <button class="manual-install-btn" onclick="window.dailyDozenTracker.showManualInstallInstructions()">
                    How to Install
                </button>
                <button class="dismiss-manual-btn" onclick="window.dailyDozenTracker.dismissManualInstallPrompt()">
                    Maybe Later
                </button>
            </div>
        `;

        document.body.appendChild(manualButton);
    }

    showManualInstallInstructions() {
        const instructionsDiv = document.createElement('div');
        instructionsDiv.className = 'install-instructions-modal';
        instructionsDiv.innerHTML = `
            <div class="instructions-content">
                <div class="instructions-header">
                    <h3>📱 Install Daily Dozen Tracker</h3>
                    <button class="close-instructions" onclick="this.parentElement.parentElement.parentElement.remove()">✕</button>
                </div>
                <div class="instructions-body">
                    <div class="browser-instructions">
                        <h4>Chrome / Edge / Brave:</h4>
                        <ol>
                            <li>Click the <strong>⋮</strong> menu in the top-right corner</li>
                            <li>Select <strong>"Install Daily Dozen Tracker"</strong> or <strong>"Add to Home screen"</strong></li>
                            <li>Click <strong>"Install"</strong> when prompted</li>
                        </ol>
                        
                        <h4>Safari (iPhone/iPad):</h4>
                        <ol>
                            <li>Tap the <strong>Share</strong> button <strong>⎋</strong></li>
                            <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                            <li>Tap <strong>"Add"</strong> to confirm</li>
                        </ol>
                        
                        <h4>Firefox:</h4>
                        <ol>
                            <li>Click the <strong>⋮</strong> menu in the top-right corner</li>
                            <li>Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong></li>
                            <li>Click <strong>"Install"</strong> when prompted</li>
                        </ol>
                        
                        <h4>Android Chrome:</h4>
                        <ol>
                            <li>Tap the <strong>⋮</strong> menu in the top-right corner</li>
                            <li>Select <strong>"Add to Home screen"</strong></li>
                            <li>Tap <strong>"Add"</strong> to confirm</li>
                        </ol>
                    </div>
                    
                    <div class="install-benefits">
                        <h4>Benefits of Installing:</h4>
                        <ul>
                            <li>✅ Quick access from your home screen</li>
                            <li>✅ Works offline</li>
                            <li>✅ Faster loading times</li>
                            <li>✅ App-like experience</li>
                            <li>✅ No need to remember the website URL</li>
                        </ul>
                    </div>
                    
                    <div class="install-actions">
                        <button class="reset-install-dismissed-btn" onclick="window.dailyDozenTracker.resetInstallDismissed(); this.parentElement.parentElement.parentElement.remove();">
                            Reset Install Prompts
                        </button>
                        <p class="reset-install-note">Click this if you want to see the automatic install prompts again</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(instructionsDiv);
    }
}



// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dailyDozenTracker = new DailyDozenTracker();
});
