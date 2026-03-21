// Checkbox behavior logic

export function handleServingChange(checkbox, categories, onSave) {
    const categoryId = checkbox.dataset.category;
    const servingIndex = parseInt(checkbox.dataset.serving);
    const isChecked = checkbox.checked;

    if (isChecked) {
        fillCheckboxesToLeft(categoryId, servingIndex, categories, onSave);
    } else {
        handleUncheckBehavior(categoryId, servingIndex, checkbox, categories, onSave);
    }

    onSave(categoryId, servingIndex, checkbox.checked);
}

function fillCheckboxesToLeft(categoryId, servingIndex, categories, onSave) {
    const category = categories.find(c => c.id === categoryId);
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
        uncheckBoxesToRight(categoryId, servingIndex, categories, onSave);
        const clickedCheckbox = document.getElementById(`${categoryId}-${servingIndex}`);
        if (clickedCheckbox) {
            clickedCheckbox.checked = false;
            onSave(categoryId, servingIndex, false);
        }
        document.body.classList.add('force-update');
        setTimeout(() => document.body.classList.remove('force-update'), 0);
    } else {
        for (let i = 0; i < servingIndex; i++) {
            const leftCheckbox = document.getElementById(`${categoryId}-${i}`);
            if (leftCheckbox && !leftCheckbox.checked) {
                leftCheckbox.checked = true;
                onSave(categoryId, i, true);
            }
        }
    }
}

function handleUncheckBehavior(categoryId, servingIndex, checkbox, categories, onSave) {
    checkbox.checked = true;

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    let leftmostCheckedIndex = -1;
    let rightmostCheckedIndex = -1;

    for (let i = 0; i < category.servings; i++) {
        const cb = document.getElementById(`${categoryId}-${i}`);
        if (cb && cb.checked) { leftmostCheckedIndex = i; break; }
    }

    for (let i = category.servings - 1; i >= 0; i--) {
        const cb = document.getElementById(`${categoryId}-${i}`);
        if (cb && cb.checked) { rightmostCheckedIndex = i; break; }
    }

    if (servingIndex === leftmostCheckedIndex) {
        uncheckAllBoxes(categoryId, categories, onSave);
    } else if (servingIndex === rightmostCheckedIndex) {
        uncheckBoxesToLeft(categoryId, servingIndex, onSave);
    } else {
        let hasCheckedRight = false;
        for (let i = servingIndex + 1; i < category.servings; i++) {
            const cb = document.getElementById(`${categoryId}-${i}`);
            if (cb && cb.checked) { hasCheckedRight = true; break; }
        }

        if (hasCheckedRight) {
            checkbox.checked = true;
            uncheckBoxesToRight(categoryId, servingIndex, categories, onSave);
        } else {
            checkbox.checked = false;
        }
    }
}

function uncheckBoxesToLeft(categoryId, servingIndex, onSave) {
    for (let i = 0; i <= servingIndex; i++) {
        const cb = document.getElementById(`${categoryId}-${i}`);
        if (cb && cb.checked) {
            cb.checked = false;
            onSave(categoryId, i, false);
        }
    }
}

function uncheckBoxesToRight(categoryId, servingIndex, categories, onSave) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    for (let i = servingIndex + 1; i < category.servings; i++) {
        const cb = document.getElementById(`${categoryId}-${i}`);
        if (cb && cb.checked) {
            cb.checked = false;
            onSave(categoryId, i, false);
        }
    }
}

function uncheckAllBoxes(categoryId, categories, onSave) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    for (let i = 0; i < category.servings; i++) {
        const cb = document.getElementById(`${categoryId}-${i}`);
        if (cb && cb.checked) {
            cb.checked = false;
            onSave(categoryId, i, false);
        }
    }

    document.body.classList.add('force-update');
    setTimeout(() => document.body.classList.remove('force-update'), 0);
}
