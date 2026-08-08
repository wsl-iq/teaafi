/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : storage.js
 * Type: JavaScript
 */

class StorageManager {
    static #PREFIX = 'taafi_';
    
    static #keys = {
        USER_DATA: 'user_data',
        RECOVERY_DATA: 'recovery_data',
        SETTINGS: 'settings',
        PROGRESS: 'progress',
        LAST_VISIT: 'last_visit',
        APP_RATED: 'app_rated',               
        APP_RATING_VALUE: 'app_rating_value',
        APP_LOCK_ENABLED: 'app_lock_enabled',
        APP_PIN: 'app_pin',
        NIGHT_MODE_SCHEDULE: 'night_mode_schedule'
    };
    
    static init() {
        if (!this.isAvailable()) {
            console.error('LocalStorage is not available');
            return false;
        }
        
        // chaking if settings Defined
        const settings = this.getSettings();
        if (!settings || Object.keys(settings).length === 0) {
            this.saveSettings({
                notifications: false,
                dailyReminder: true,
                reminderTime: '08:00',
                notificationPermissionAsked: false,
                notificationPermissionGranted: false
            });
        }
        
        return true;
    }
    
    static isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    static set(key, value) {
        try {
            const storageKey = this.#PREFIX + key;
            const data = JSON.stringify({
                value,
                timestamp: Date.now()
            });
            localStorage.setItem(storageKey, data);
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    }
    
    static get(key, defaultValue = null) {
        try {
            const storageKey = this.#PREFIX + key;
            const data = localStorage.getItem(storageKey);
            if (!data) return defaultValue;
            
            const parsed = JSON.parse(data);
            return parsed.value !== undefined ? parsed.value : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }
    
    static remove(key) {
        const storageKey = this.#PREFIX + key;
        localStorage.removeItem(storageKey);
    }
    
    static clear() {
        const rating = this.get('app_rated');
        const ratingValue = this.get('app_rating_value');
        
        Object.values(this.#keys).forEach(key => this.remove(key));
        this.saveSettings({
            notifications: false,
            dailyReminder: true,
            reminderTime: '08:00',
            notificationPermissionAsked: false,
            notificationPermissionGranted: false
        });
    }
    
    static getUser() {
        return this.get(this.#keys.USER_DATA);
    }
    
    static saveUser(userData) {
        return this.set(this.#keys.USER_DATA, userData);
    }
    
    static getRecoveryData() {
        return this.get(this.#keys.RECOVERY_DATA, {
            startDate: null,
            habitType: null,
            relapses: []
        });
    }
    
    static saveRecoveryData(data) {
        return this.set(this.#keys.RECOVERY_DATA, data);
    }
    
    static getSettings() {
    return this.get(this.#keys.SETTINGS, {
        notifications: false,
        dailyReminder: true,
        theme: 'green',
        darkMode: false,
        darkModeAuto: false,
        autoUpdateCheck: true,
        appLockEnabled: false,
        appPin: null,
        nightModeSchedule: false,
        notificationPermissionAsked: false,
        notificationPermissionGranted: false,
        reminderTime: '08:00',
        lastVisit: null,
        appRated: false,
        appRatingValue: null
    });
}

    static saveSettings(settings) {
        return this.set(this.#keys.SETTINGS, settings);
    }
}