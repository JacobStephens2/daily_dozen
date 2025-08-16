// Catholic Daily Dozen Tracker - Main Application Logic

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
        
        card.innerHTML = `
            <div class="category-header">
                <div class="category-icon">${category.icon}</div>
                <div class="category-info">
                    <h3>${category.name}</h3>
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

        // If checking a box, also check all boxes to the left that are unchecked
        if (isChecked) {
            this.fillCheckboxesToLeft(categoryId, servingIndex);
        }
        // If unchecking a box, also uncheck all boxes to the left
        else {
            this.uncheckBoxesToLeft(categoryId, servingIndex);
        }

        this.saveServing(categoryId, servingIndex, isChecked);
        this.updateProgress();
        this.updateCategoryStatus(categoryId);
    }

    fillCheckboxesToLeft(categoryId, servingIndex) {
        // Check all checkboxes to the left of the current one
        for (let i = 0; i < servingIndex; i++) {
            const leftCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (leftCheckbox && !leftCheckbox.checked) {
                leftCheckbox.checked = true;
                this.saveServing(categoryId, i, true);
            }
        }
    }

    uncheckBoxesToLeft(categoryId, servingIndex) {
        // Uncheck all checkboxes to the left of the current one
        for (let i = 0; i < servingIndex; i++) {
            const leftCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (leftCheckbox && leftCheckbox.checked) {
                leftCheckbox.checked = false;
                this.saveServing(categoryId, i, false);
            }
        }
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
            navigator.serviceWorker.register('sw.js?v=2.0.0')
                .then(registration => {
                    console.log('Service Worker registered successfully');
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New service worker available, reload the page
                                window.location.reload();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
}



// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DailyDozenTracker();
});
