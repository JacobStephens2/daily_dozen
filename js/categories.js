// Category definitions for all diet types

export function getStandardCategories() {
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

export function getModifiedCategories() {
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

export function getOneBeanCategories() {
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

export function getOneBeanTwoProteinCategories() {
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

export function getOneBeanTwoProteinOneFlaxCategories() {
    const categories = getOneBeanTwoProteinCategories();
    const flaxseedCategory = {
        id: 'flaxseed',
        name: 'Flaxseed',
        icon: '🌾',
        servings: 1,
        description: '1 tbsp ground',
        examples: ['Ground flaxseed', 'Flaxseed oil']
    };

    const insertAfterIdx = categories.findIndex((c) => c.id === 'other-vegetables');
    if (insertAfterIdx >= 0) {
        categories.splice(insertAfterIdx + 1, 0, flaxseedCategory);
    } else {
        categories.push(flaxseedCategory);
    }

    return categories;
}

export function getCategoriesForDietType(dietType) {
    if (dietType === 'modified') {
        return getModifiedCategories();
    } else if (dietType === 'one-bean') {
        return getOneBeanCategories();
    } else if (dietType === 'one-bean-two-protein') {
        return getOneBeanTwoProteinCategories();
    } else if (dietType === 'one-bean-two-protein-one-flax') {
        return getOneBeanTwoProteinOneFlaxCategories();
    } else {
        return getStandardCategories();
    }
}

// Map category IDs to NutritionFacts.org link URLs
const CATEGORY_LINKS = {
    'beans': { url: 'https://nutritionfacts.org/topics/beans/', label: null },
    'berries': { url: 'https://nutritionfacts.org/topics/berries/', label: null },
    'other-fruits': { url: 'https://nutritionfacts.org/topics/fruit/', label: null },
    'greens': { url: 'https://nutritionfacts.org/topics/greens/', label: null },
    'cruciferous': { url: 'https://nutritionfacts.org/topics/cruciferous-vegetables/', label: null },
    'other-vegetables': { url: 'https://nutritionfacts.org/topics/vegetables/', label: null },
    'flaxseed': { url: 'https://nutritionfacts.org/topics/flax-seeds/', label: null },
    'whole-grains': { url: 'https://nutritionfacts.org/topics/grains/', label: null },
    'beverages': { url: 'https://nutritionfacts.org/topics/beverages/', label: null },
    'exercise': { url: 'https://nutritionfacts.org/topics/exercise/', label: null },
    'protein': { url: 'https://nutritionfacts.org/topics/protein/', label: null },
    'nuts-seeds': {
        parts: [
            { url: 'https://nutritionfacts.org/topics/nuts/', label: 'Nuts' },
            { url: 'https://nutritionfacts.org/topics/seeds/', label: 'Seeds' }
        ]
    },
    'herbs-spices': {
        parts: [
            { url: 'https://nutritionfacts.org/topics/herbs/', label: 'Herbs' },
            { url: 'https://nutritionfacts.org/topics/spices/', label: 'Spices' }
        ]
    }
};

export function getCategoryNameHtml(category) {
    const linkInfo = CATEGORY_LINKS[category.id];
    if (!linkInfo) return category.name;

    if (linkInfo.parts) {
        return linkInfo.parts
            .map(p => `<a href="${p.url}" target="_blank" rel="noopener noreferrer">${p.label}</a>`)
            .join(' and ');
    }

    return `<a href="${linkInfo.url}" target="_blank" rel="noopener noreferrer">${category.name}</a>`;
}
