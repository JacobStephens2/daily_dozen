// Catholic Daily Dozen Tracker - Main Application Logic
// Version: 2.0.2 - Fixed checkbox unchecking logic

console.log('Daily Dozen Tracker loaded - Version 2.0.2');
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
                description: 'e.g., ½ c. cooked beans, ¼ c. hummus',
                examples: ['Black beans', 'Chickpeas', 'Lentils', 'Hummus', 'Edamame']
            },
            {
                id: 'berries',
                name: 'Berries',
                icon: '🫐',
                servings: 1,
                description: 'e.g., ½ c. fresh or frozen, ¼ c. dried',
                examples: ['Blueberries', 'Strawberries', 'Raspberries', 'Blackberries', 'Cranberries']
            },
            {
                id: 'other-fruits',
                name: 'Other Fruits',
                icon: '🍎',
                servings: 3,
                description: 'e.g., 1 medium fruit, ¼ c. dried fruit',
                examples: ['Apples', 'Bananas', 'Oranges', 'Grapes', 'Pineapple']
            },
            {
                id: 'greens',
                name: 'Greens',
                icon: '🥬',
                servings: 2,
                description: 'e.g., 1 c. raw, ½ c. cooked',
                examples: ['Spinach', 'Kale', 'Arugula', 'Swiss chard', 'Collard greens']
            },
            {
                id: 'cruciferous',
                name: 'Cruciferous Vegetables',
                icon: '🥦',
                servings: 1,
                description: 'e.g., ½ c. chopped, 1 tbsp horseradish',
                examples: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Cabbage', 'Kale']
            },
            {
                id: 'other-vegetables',
                name: 'Other Vegetables',
                icon: '🥕',
                servings: 2,
                description: 'e.g., ½ c. nonleafy vegetables',
                examples: ['Carrots', 'Bell peppers', 'Tomatoes', 'Cucumber', 'Zucchini']
            },
            {
                id: 'flaxseed',
                name: 'Flaxseed',
                icon: '🌾',
                servings: 1,
                description: 'e.g., 1 tbsp ground',
                examples: ['Ground flaxseed', 'Flaxseed oil']
            },
            {
                id: 'nuts-seeds',
                name: 'Nuts and Seeds',
                icon: '🥜',
                servings: 1,
                description: 'e.g., ¼ c. nuts, 2 tbsp nut butter',
                examples: ['Almonds', 'Walnuts', 'Chia seeds', 'Pumpkin seeds', 'Peanut butter']
            },
            {
                id: 'herbs-spices',
                name: 'Herbs and Spices',
                icon: '🌿',
                servings: 1,
                description: 'e.g., ¼ tsp turmeric',
                examples: ['Turmeric', 'Cinnamon', 'Ginger', 'Garlic', 'Basil']
            },
            {
                id: 'whole-grains',
                name: 'Whole Grains',
                icon: '🌾',
                servings: 3,
                description: 'e.g., ½ c. hot cereal, 1 slice of bread',
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

    getModifiedCategories() {
        return [
            {
                id: 'protein',
                name: 'Protein',
                icon: '🥩',
                servings: 2,
                description: 'e.g., 3 oz lean meat, 1 egg, ½ c. beans',
                examples: ['Chicken breast', 'Fish', 'Eggs', 'Lean beef', 'Tofu']
            },
            {
                id: 'berries',
                name: 'Berries',
                icon: '🫐',
                servings: 1,
                description: 'e.g., ½ c. fresh or frozen, ¼ c. dried',
                examples: ['Blueberries', 'Strawberries', 'Raspberries', 'Blackberries', 'Cranberries']
            },
            {
                id: 'other-fruits',
                name: 'Other Fruits',
                icon: '🍎',
                servings: 3,
                description: 'e.g., 1 medium fruit, ¼ c. dried fruit',
                examples: ['Apples', 'Bananas', 'Oranges', 'Grapes', 'Pineapple']
            },
            {
                id: 'greens',
                name: 'Greens',
                icon: '🥬',
                servings: 2,
                description: 'e.g., 1 c. raw, ½ c. cooked',
                examples: ['Spinach', 'Kale', 'Arugula', 'Swiss chard', 'Collard greens']
            },
            {
                id: 'cruciferous',
                name: 'Cruciferous Vegetables',
                icon: '🥦',
                servings: 1,
                description: 'e.g., ½ c. chopped, 1 tbsp horseradish',
                examples: ['Broccoli', 'Cauliflower', 'Brussels sprouts', 'Cabbage', 'Kale']
            },
            {
                id: 'other-vegetables',
                name: 'Other Vegetables',
                icon: '🥕',
                servings: 2,
                description: 'e.g., ½ c. nonleafy vegetables',
                examples: ['Carrots', 'Bell peppers', 'Tomatoes', 'Cucumber', 'Zucchini']
            },
            {
                id: 'nuts-seeds',
                name: 'Nuts and Seeds',
                icon: '🥜',
                servings: 1,
                description: 'e.g., ¼ c. nuts, 2 tbsp nut butter',
                examples: ['Almonds', 'Walnuts', 'Chia seeds', 'Pumpkin seeds', 'Peanut butter']
            },
            {
                id: 'herbs-spices',
                name: 'Herbs and Spices',
                icon: '🌿',
                servings: 1,
                description: 'e.g., ¼ tsp turmeric',
                examples: ['Turmeric', 'Cinnamon', 'Ginger', 'Garlic', 'Basil']
            },
            {
                id: 'whole-grains',
                name: 'Whole Grains',
                icon: '🌾',
                servings: 3,
                description: 'e.g., ½ c. hot cereal, 1 slice of bread',
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
        return dietType === 'modified' ? this.getModifiedCategories() : this.getStandardCategories();
    }

    loadDietType() {
        const savedDietType = localStorage.getItem(this.dietTypeStorageKey);
        return savedDietType || 'standard';
    }

    saveDietType(dietType) {
        localStorage.setItem(this.dietTypeStorageKey, dietType);
    }

    init() {
        this.updateDateDisplay();
        this.setDietTypeSelector();
        this.renderCategories();
        const data = this.loadData();
        this.restoreCheckboxes(data);
        this.updateProgress();
        this.setupEventListeners();
        this.registerServiceWorker();
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
        
        // Add link for cruciferous vegetables
        const categoryName = category.id === 'cruciferous' 
            ? `<a href="https://nutritionfacts.org/topics/cruciferous-vegetables/" target="_blank" rel="noopener noreferrer">${category.name}</a>`
            : category.name;
        
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

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem(this.storageKey);
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
            progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #2E7D32)';
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
        const celebrationKey = `dailyDozenCelebration_${this.currentDate.toDateString()}`;
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
                <p>You've completed your Daily Dozen for today!</p>
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
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        }

        // Remove the celebration flag for today so it can show again
        const celebrationKey = `dailyDozenCelebration_${this.currentDate.toDateString()}`;
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
            const swUrl = 'sw.js?v=2.0.1';
            
            navigator.serviceWorker.register(swUrl)
                .then(registration => {
                    console.log('Service Worker registered successfully');
                    
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
                    
                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    showUpdateNotification() {
        // Create update notification
        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                <p>🔄 A new version is available!</p>
                <button onclick="window.location.reload()" class="update-btn">Update Now</button>
                <button onclick="this.parentElement.parentElement.remove()" class="dismiss-btn">Later</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(updateNotification);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (updateNotification.parentNode) {
                updateNotification.parentNode.removeChild(updateNotification);
            }
        }, 10000);
    }
}



// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DailyDozenTracker();
});
