// Account management: login, register, sync

import * as storage from './storage.js';

const TOKEN_KEY = 'dailyDozenAuthToken';
const EMAIL_KEY = 'dailyDozenAuthEmail';
const SYNC_TS_KEY = 'dailyDozenLastSync';

export class AuthManager {
    constructor(app) {
        this.app = app;
        this.token = localStorage.getItem(TOKEN_KEY);
        this.email = localStorage.getItem(EMAIL_KEY);
        this._syncTimer = null;
    }

    get isLoggedIn() {
        return !!this.token;
    }

    // --- Token management ---

    saveAuth(token, email) {
        this.token = token;
        this.email = email;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(EMAIL_KEY, email);
    }

    clearAuth() {
        this.token = null;
        this.email = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EMAIL_KEY);
        localStorage.removeItem(SYNC_TS_KEY);
    }

    // --- API helpers ---

    async apiFetch(path, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const res = await fetch(`/api${path}`, { ...options, headers });
        const body = await res.json();
        if (!res.ok) {
            if (res.status === 401 && this.token) {
                this.clearAuth();
                this.updateUI();
            }
            throw new Error(body.error || 'Request failed');
        }
        return body;
    }

    // --- Auth actions ---

    async register(email, password) {
        const result = await this.apiFetch('/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.saveAuth(result.token, result.email);
        // Push local data to server on registration
        await this.pushData();
        this.updateUI();
        return result;
    }

    async login(email, password) {
        const result = await this.apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        this.saveAuth(result.token, result.email);
        // Pull server data if it exists
        await this.pullData();
        this.updateUI();
        return result;
    }

    logout() {
        this.clearAuth();
        this.updateUI();
    }

    // --- Sync ---

    buildDataPayload() {
        const profiles = storage.loadProfiles();
        const payload = { profiles: {} };
        Object.keys(profiles).forEach(profileId => {
            payload.profiles[profileId] = {
                name: profiles[profileId].name,
                color: profiles[profileId].color,
                dietType: storage.loadDietType(profileId),
                data: storage.loadData(profileId),
            };
        });
        return payload;
    }

    restoreFromPayload(payload) {
        if (!payload || !payload.profiles) return;

        const profiles = {};
        Object.keys(payload.profiles).forEach(profileId => {
            const p = payload.profiles[profileId];
            profiles[profileId] = { name: p.name, color: p.color };
            storage.saveDietType(profileId, p.dietType);
            storage.saveData(profileId, p.data || {});
        });
        storage.saveProfiles(profiles);
    }

    async pushData() {
        if (!this.isLoggedIn) return;
        const data = this.buildDataPayload();
        const result = await this.apiFetch('/data', {
            method: 'PUT',
            body: JSON.stringify({ data }),
        });
        localStorage.setItem(SYNC_TS_KEY, result.updatedAt);
        return result;
    }

    async pullData() {
        if (!this.isLoggedIn) return;
        const result = await this.apiFetch('/data');
        if (result.data) {
            this.restoreFromPayload(result.data);
            localStorage.setItem(SYNC_TS_KEY, result.updatedAt);
            // Refresh the app to show pulled data
            this.app.refreshAfterSync();
        }
    }

    async sync() {
        if (!this.isLoggedIn) return;
        try {
            const serverResult = await this.apiFetch('/data');
            const localTs = localStorage.getItem(SYNC_TS_KEY);
            const serverTs = serverResult.updatedAt;

            if (serverResult.data && serverTs && (!localTs || serverTs > localTs)) {
                // Server is newer — pull
                this.restoreFromPayload(serverResult.data);
                localStorage.setItem(SYNC_TS_KEY, serverTs);
                this.app.refreshAfterSync();
            } else {
                // Local is newer or same — push
                await this.pushData();
            }
        } catch (e) {
            console.log('Sync failed:', e.message);
        }
    }

    // Debounced sync: call this after any data change
    schedulePush() {
        if (!this.isLoggedIn) return;
        clearTimeout(this._syncTimer);
        this._syncTimer = setTimeout(() => {
            this.pushData().catch(e => console.log('Auto-sync failed:', e.message));
        }, 3000);
    }

    // --- UI ---

    updateUI() {
        const accountBtn = document.getElementById('account-btn');
        if (accountBtn) {
            accountBtn.textContent = this.isLoggedIn ? `👤 ${this.email}` : '👤 Sign In';
        }
    }

    showAccountModal() {
        // Remove any existing modal
        const existing = document.querySelector('.auth-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'auth-modal';

        if (this.isLoggedIn) {
            // Logged-in view
            const lastSync = localStorage.getItem(SYNC_TS_KEY);
            const syncText = lastSync ? new Date(lastSync + 'Z').toLocaleString() : 'Never';

            modal.innerHTML = `
                <div class="auth-content">
                    <div class="auth-header">
                        <h3>Account</h3>
                        <button class="auth-close-btn">&times;</button>
                    </div>
                    <div class="auth-account-info">
                        <p class="auth-email">${this.email}</p>
                        <p class="auth-sync-status">Last synced: ${syncText}</p>
                    </div>
                    <div class="auth-actions">
                        <button class="auth-sync-btn" id="auth-sync-btn">Sync Now</button>
                        <button class="auth-logout-btn" id="auth-logout-btn">Sign Out</button>
                    </div>
                    <p class="auth-status" id="auth-status"></p>
                </div>
            `;

            document.body.appendChild(modal);
            requestAnimationFrame(() => modal.classList.add('show'));

            modal.querySelector('#auth-sync-btn').addEventListener('click', async () => {
                const status = document.getElementById('auth-status');
                const syncBtn = document.getElementById('auth-sync-btn');
                syncBtn.disabled = true;
                syncBtn.textContent = 'Syncing...';
                status.textContent = '';
                try {
                    await this.sync();
                    status.textContent = 'Synced successfully';
                    status.className = 'auth-status success';
                    // Update the last synced display
                    const newSync = localStorage.getItem(SYNC_TS_KEY);
                    if (newSync) {
                        modal.querySelector('.auth-sync-status').textContent =
                            'Last synced: ' + new Date(newSync + 'Z').toLocaleString();
                    }
                } catch (e) {
                    status.textContent = e.message;
                    status.className = 'auth-status error';
                }
                syncBtn.disabled = false;
                syncBtn.textContent = 'Sync Now';
            });

            modal.querySelector('#auth-logout-btn').addEventListener('click', () => {
                this.logout();
                modal.remove();
            });
        } else {
            // Login/Register view
            modal.innerHTML = `
                <div class="auth-content">
                    <div class="auth-header">
                        <h3>Sign In</h3>
                        <button class="auth-close-btn">&times;</button>
                    </div>
                    <form class="auth-form" id="auth-form">
                        <input type="email" id="auth-email" placeholder="Email" required autocomplete="email">
                        <input type="password" id="auth-password" placeholder="Password (8+ characters)" required minlength="8" autocomplete="current-password">
                        <button type="submit" class="auth-submit-btn" id="auth-submit-btn">Sign In</button>
                    </form>
                    <p class="auth-toggle">
                        Don't have an account?
                        <button class="auth-toggle-btn" id="auth-toggle-btn">Create one</button>
                    </p>
                    <p class="auth-status" id="auth-status"></p>
                </div>
            `;

            document.body.appendChild(modal);
            requestAnimationFrame(() => modal.classList.add('show'));

            let isRegister = false;
            const toggleBtn = modal.querySelector('#auth-toggle-btn');
            const submitBtn = modal.querySelector('#auth-submit-btn');
            const heading = modal.querySelector('h3');
            const toggleText = modal.querySelector('.auth-toggle');

            toggleBtn.addEventListener('click', () => {
                isRegister = !isRegister;
                heading.textContent = isRegister ? 'Create Account' : 'Sign In';
                submitBtn.textContent = isRegister ? 'Create Account' : 'Sign In';
                toggleText.firstChild.textContent = isRegister
                    ? 'Already have an account? '
                    : "Don't have an account? ";
                toggleBtn.textContent = isRegister ? 'Sign in' : 'Create one';
            });

            modal.querySelector('#auth-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('auth-email').value;
                const password = document.getElementById('auth-password').value;
                const status = document.getElementById('auth-status');

                submitBtn.disabled = true;
                submitBtn.textContent = isRegister ? 'Creating...' : 'Signing in...';
                status.textContent = '';

                try {
                    if (isRegister) {
                        await this.register(email, password);
                    } else {
                        await this.login(email, password);
                    }
                    modal.remove();
                } catch (err) {
                    status.textContent = err.message;
                    status.className = 'auth-status error';
                    submitBtn.disabled = false;
                    submitBtn.textContent = isRegister ? 'Create Account' : 'Sign In';
                }
            });
        }

        // Close handlers
        modal.querySelector('.auth-close-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
}
