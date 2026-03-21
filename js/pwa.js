// PWA management: service worker, installation, updates

import { STORAGE_KEYS } from './storage.js';

export class PwaManager {
    constructor(options = {}) {
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isIOSStandalone = window.navigator.standalone === true;
        this.isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
        this.deferredPrompt = null;
        this.swRegistration = null;
        this.currentUpdateNotification = null;
        this.currentUpdateReminder = null;
        this.currentFeedbackNotification = null;
        this.lastUpdateInfo = null;
        this.installDismissedKey = STORAGE_KEYS.INSTALL_DISMISSED;
    }

    init() {
        this.registerServiceWorker();
        this.setupPWAInstallation();
        this.checkForPendingUpdates();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            const swUrl = 'sw.js?v=2.0.12';

            navigator.serviceWorker.register(swUrl)
                .then(registration => {
                    console.log('Service Worker registered successfully');
                    this.swRegistration = registration;

                    if (registration.installing) {
                        registration.installing.addEventListener('statechange', () => {
                            if (registration.installing.state === 'installed') {
                                console.log('Service Worker installed and ready');
                            }
                        });
                    }

                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateNotification();
                            }
                        });
                    });

                    navigator.serviceWorker.addEventListener('message', (event) => {
                        if (event.data && event.data.type === 'SW_UPDATED') {
                            this.handleServiceWorkerUpdate(event.data);
                        }
                    });

                    const updateInterval = this.isIOS ? 60000 : 300000;
                    setInterval(() => {
                        registration.update();
                    }, updateInterval);

                    registration.update();

                    if (this.isIOS) {
                        document.addEventListener('visibilitychange', () => {
                            if (!document.hidden) {
                                registration.update();
                            }
                        });

                        window.addEventListener('focus', () => {
                            registration.update();
                        });
                    }
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    showUpdateNotification(version = null) {
        const existingNotification = document.querySelector('.update-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const iosInstructions = this.isIOSStandalone ? `
            <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.1); border-radius: 4px; font-size: 0.85em;">
                <strong>iOS Update Instructions:</strong><br>
                1. Close this app completely<br>
                2. Open Safari and visit this site<br>
                3. Tap Share → Add to Home Screen (replace existing)
            </div>
        ` : '';

        const updateNotification = document.createElement('div');
        updateNotification.className = 'update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                <p>🔄 A new version is available!</p>
                ${version ? `<small>Version ${version}</small>` : ''}
                ${iosInstructions}
                <div class="update-buttons">
                    <button class="update-btn">${this.isIOSStandalone ? 'Open in Safari' : 'Update Now'}</button>
                    <button class="dismiss-btn">Later</button>
                </div>
            </div>
        `;

        const updateBtn = updateNotification.querySelector('.update-btn');
        const dismissBtn = updateNotification.querySelector('.dismiss-btn');

        updateBtn.addEventListener('click', () => {
            this.updateApp();
        });

        dismissBtn.addEventListener('click', () => {
            this.dismissUpdate();
        });

        document.body.appendChild(updateNotification);
        this.currentUpdateNotification = updateNotification;

        setTimeout(() => {
            if (updateNotification.parentNode && !updateNotification.classList.contains('dismissed')) {
                updateNotification.remove();
            }
        }, 30000);
    }

    handleServiceWorkerUpdate(updateData) {
        console.log('Service Worker updated:', updateData);
        this.lastUpdateInfo = updateData;
        this.showUpdateNotification(updateData.version);

        localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, JSON.stringify({
            version: updateData.version,
            timestamp: updateData.timestamp,
            applied: false
        }));
    }

    updateApp() {
        if (this.currentUpdateNotification) {
            this.currentUpdateNotification.remove();
        }

        if (this.lastUpdateInfo) {
            localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, JSON.stringify({
                version: this.lastUpdateInfo.version,
                timestamp: this.lastUpdateInfo.timestamp,
                applied: true,
                appliedAt: new Date().toISOString()
            }));
        }

        if (this.isIOSStandalone) {
            const currentUrl = window.location.href;
            window.location.href = currentUrl.split('?')[0] + '?update=1&t=' + Date.now();
            alert('To update on iOS:\n\n1. Copy this page URL\n2. Open Safari\n3. Paste and visit the URL\n4. Tap Share → Add to Home Screen\n5. Replace the existing app');
            return;
        }

        this.showUpdateLoading();

        const url = new URL(window.location.href);
        url.searchParams.set('_update', Date.now());

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
        }

        setTimeout(() => {
            window.location.href = url.toString();
        }, 1000);
    }

    dismissUpdate() {
        if (this.currentUpdateNotification) {
            this.currentUpdateNotification.classList.add('dismissed');
            this.currentUpdateNotification.remove();
        }

        if (this.lastUpdateInfo) {
            localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, JSON.stringify({
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
            navigator.serviceWorker.getRegistration().then(registration => {
                let registrationVersion = null;
                let latestVersion = 'v2.0.12';

                if (registration) {
                    if (registration.waiting) {
                        const swUrl = registration.waiting.scriptURL;
                        const versionMatch = swUrl.match(/[?&]v=([^&]+)/);
                        if (versionMatch) {
                            registrationVersion = 'v' + versionMatch[1];
                        }
                    }
                    if (!registrationVersion && registration.installing) {
                        const swUrl = registration.installing.scriptURL;
                        const versionMatch = swUrl.match(/[?&]v=([^&]+)/);
                        if (versionMatch) {
                            registrationVersion = 'v' + versionMatch[1];
                        }
                    }
                    if (!registrationVersion && registration.active) {
                        const swUrl = registration.active.scriptURL;
                        const versionMatch = swUrl.match(/[?&]v=([^&]+)/);
                        if (versionMatch) {
                            registrationVersion = 'v' + versionMatch[1];
                        }
                    }
                }

                if (registrationVersion) {
                    console.log('Using version from registration URL:', registrationVersion);
                    resolve({ version: registrationVersion, timestamp: new Date().toISOString() });
                    return;
                }

                if (navigator.serviceWorker.controller) {
                    const messageChannel = new MessageChannel();
                    let resolved = false;

                    const timeout = setTimeout(() => {
                        if (!resolved) {
                            console.log('Service worker version request timed out, using fallback');
                            resolved = true;
                            resolve({ version: latestVersion, timestamp: new Date().toISOString() });
                        }
                    }, 2000);

                    messageChannel.port1.onmessage = (event) => {
                        if (!resolved) {
                            clearTimeout(timeout);
                            resolved = true;
                            const swVersion = event.data.version;
                            if (swVersion === 'v2.0.8' || swVersion === 'v2.0.9' || swVersion === 'v2.0.10') {
                                console.log('Service worker returned outdated version, using current version:', swVersion, '->', latestVersion);
                                resolve({ version: latestVersion, timestamp: new Date().toISOString() });
                            } else {
                                resolve(event.data);
                            }
                        }
                    };

                    navigator.serviceWorker.controller.postMessage(
                        { type: 'GET_VERSION' },
                        [messageChannel.port2]
                    );
                } else {
                    resolve({ version: latestVersion, timestamp: new Date().toISOString() });
                }
            }).catch(() => {
                resolve({ version: 'v2.0.12', timestamp: new Date().toISOString() });
            });
        });
    }

    checkForPendingUpdates() {
        const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
        if (lastUpdate) {
            try {
                const updateInfo = JSON.parse(lastUpdate);

                this.getCurrentVersion().then(currentVersion => {
                    if (updateInfo.version === currentVersion.version) {
                        localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
                        return;
                    }

                    if (updateInfo.dismissed && !updateInfo.applied) {
                        const dismissedTime = new Date(updateInfo.dismissedAt);
                        const now = new Date();
                        const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);

                        if (hoursSinceDismissed < 24) {
                            setTimeout(() => {
                                this.showUpdateReminder(updateInfo.version);
                            }, 5000);
                        } else {
                            localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
                        }
                    }
                });
            } catch (e) {
                console.log('Error parsing last update info:', e);
            }
        }

        this.getCurrentVersion().then(versionInfo => {
            const storedVersion = localStorage.getItem(STORAGE_KEYS.CURRENT_VERSION);
            if (storedVersion && storedVersion !== versionInfo.version) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, versionInfo.version);
                localStorage.setItem(STORAGE_KEYS.VERSION_UPDATED, new Date().toISOString());
            } else if (!storedVersion) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_VERSION, versionInfo.version);
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

        const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
        if (lastUpdate) {
            try {
                const updateInfo = JSON.parse(lastUpdate);
                updateInfo.reminderDismissed = true;
                updateInfo.reminderDismissedAt = new Date().toISOString();
                localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, JSON.stringify(updateInfo));
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
        this.currentFeedbackNotification = feedbackNotification;

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

        setTimeout(() => {
            if (feedbackNotification.parentNode) {
                feedbackNotification.remove();
            }
        }, 4000);
    }

    showUpdateFoundFeedback() {
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

        setTimeout(() => {
            if (updateFoundNotification.parentNode) {
                updateFoundNotification.remove();
            }
        }, 3000);
    }

    async showVersionInfo() {
        const currentVersion = await this.getCurrentVersion();
        const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
        const currentVersionStored = localStorage.getItem(STORAGE_KEYS.CURRENT_VERSION);

        console.log('Current version detected:', currentVersion);
        console.log('Stored version:', currentVersionStored);
        console.log('Last update info:', lastUpdate);

        let updateStatus = '✅ Up to date';
        let lastUpdateInfo = '';

        if (lastUpdate) {
            try {
                const updateInfo = JSON.parse(lastUpdate);
                console.log('Stored update info:', updateInfo);
                console.log('Current version:', currentVersion);

                if (updateInfo.version === currentVersion.version) {
                    updateStatus = '✅ Up to date';
                    console.log('Versions match - up to date');
                } else if (!updateInfo.applied && !updateInfo.dismissed) {
                    updateStatus = '🔄 Update available';
                    console.log('Update available - different version');
                } else if (updateInfo.dismissed) {
                    updateStatus = '⏸️ Update dismissed';
                    console.log('Update dismissed');
                } else if (updateInfo.applied) {
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

        const checkUpdateBtn = versionModal.querySelector('.update-btn');
        const closeBtn = versionModal.querySelector('.dismiss-btn');

        checkUpdateBtn.addEventListener('click', () => {
            checkUpdateBtn.textContent = '⏳ Checking...';
            checkUpdateBtn.disabled = true;
            this.checkForUpdates();
            this.showUpdateCheckFeedback();

            setTimeout(() => {
                checkUpdateBtn.textContent = 'Check for Updates';
                checkUpdateBtn.disabled = false;
            }, 3000);
        });

        closeBtn.addEventListener('click', () => {
            versionModal.remove();
        });

        document.body.appendChild(versionModal);

        versionModal.addEventListener('click', (e) => {
            if (e.target === versionModal) {
                versionModal.remove();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                versionModal.remove();
            }
        });
    }

    setupPWAInstallation() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.hideInstallButton();
            console.log('Daily Dozen Tracker was installed successfully');
            this.showInstallationSuccess();
        });

        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            console.log('App is already installed');
        } else {
            this.checkAndShowManualInstall();
        }
    }

    showInstallButton() {
        if (this.hasUserDismissedInstall()) {
            return;
        }

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
            this.deferredPrompt.prompt();

            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                this.deferredPrompt = null;
            });
        } else {
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

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }

    checkAndShowManualInstall() {
        if (this.hasUserDismissedInstall()) {
            return;
        }

        if (this.isPWAReady()) {
            setTimeout(() => {
                this.showManualInstallButton();
            }, 3000);
        }
    }

    isPWAReady() {
        if (!('serviceWorker' in navigator)) return false;
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) return false;
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') return false;
        return true;
    }

    showManualInstallButton() {
        if (this.hasUserDismissedInstall()) {
            return;
        }

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
