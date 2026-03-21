// Storage constants and helper functions

export const STORAGE_KEYS = {
    DATA: 'dailyDozenData',
    DIET_TYPE: 'dailyDozenDietType',
    INSTALL_DISMISSED: 'dailyDozenInstallDismissed',
    PROFILES: 'dailyDozenProfiles',
    CURRENT_PROFILE: 'dailyDozenCurrentProfile',
};

export function getProfileStorageKey(profileId) {
    return `${STORAGE_KEYS.DATA}_${profileId}`;
}

export function getDietTypeStorageKey(profileId) {
    return `${STORAGE_KEYS.DIET_TYPE}_${profileId}`;
}

export function getCelebrationKey(profileId, dateString) {
    return `dailyDozenCelebration_${profileId}_${dateString}`;
}

export function loadData(profileId) {
    const key = getProfileStorageKey(profileId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
}

export function saveData(profileId, data) {
    const key = getProfileStorageKey(profileId);
    localStorage.setItem(key, JSON.stringify(data));
}

export function loadProfiles() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (saved) return JSON.parse(saved);
    return {
        'user': { name: 'You', color: '#548444' },
        'other': { name: 'Other', color: '#b9803c' }
    };
}

export function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
}

export function loadCurrentProfile() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE) || 'user';
}

export function saveCurrentProfile(profileId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, profileId);
}

export function loadDietType(profileId) {
    const key = getDietTypeStorageKey(profileId);
    return localStorage.getItem(key) || 'standard';
}

export function saveDietType(profileId, dietType) {
    const key = getDietTypeStorageKey(profileId);
    localStorage.setItem(key, dietType);
}
