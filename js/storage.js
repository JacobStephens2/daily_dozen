// Storage constants and helper functions

export const STORAGE_KEYS = {
    DATA: 'dailyDozenData',
    DIET_TYPE: 'dailyDozenDietType',
    INSTALL_DISMISSED: 'dailyDozenInstallDismissed',
    PROFILES: 'dailyDozenProfiles',
    CURRENT_PROFILE: 'dailyDozenCurrentProfile',
    ATTRIBUTION_SEEN: 'bountywellAttributionSeen',
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

// New installs start with a single person. Additional people are added
// explicitly from the profile selector.
export function loadProfiles() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILES);
    if (saved) return JSON.parse(saved);
    return {
        'user': { name: 'You', color: '#38672a', emoji: '🧑' }
    };
}

// Colors handed out to newly added people, in order, skipping ones in use.
export const PROFILE_COLORS = [
    '#38672a', '#7c5724', '#3a5f7d', '#6b3f6e', '#8a4b3c', '#4a6b5a', '#7d5a2e'
];

export function createProfileId() {
    return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// Remove every per-profile key this profile owns, including its
// dated celebration flags, which are keyed by profile *and* date.
export function deleteProfileData(profileId) {
    localStorage.removeItem(getProfileStorageKey(profileId));
    localStorage.removeItem(getDietTypeStorageKey(profileId));
    localStorage.removeItem(`dailyDozenCustomServings_${profileId}`);

    const celebrationPrefix = `dailyDozenCelebration_${profileId}_`;
    Object.keys(localStorage)
        .filter(key => key.startsWith(celebrationPrefix))
        .forEach(key => localStorage.removeItem(key));
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

export function loadCustomServings(profileId) {
    const key = `dailyDozenCustomServings_${profileId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
}

export function saveCustomServings(profileId, servings) {
    const key = `dailyDozenCustomServings_${profileId}`;
    localStorage.setItem(key, JSON.stringify(servings));
}
