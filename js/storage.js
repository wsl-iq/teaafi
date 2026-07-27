class StorageManager {
    static #PREFIX = 'taafi_';
    
    static #keys = {
        USER_DATA: 'user_data',
        RECOVERY_DATA: 'recovery_data',
        SETTINGS: 'settings',
        PROGRESS: 'progress',
        LAST_VISIT: 'last_visit',
        APP_RATED: 'app_rated',                    // ✅ إضافة
        APP_RATING_VALUE: 'app_rating_value'
    };
    
    static init() {
        if (!this.isAvailable()) {
            console.error('LocalStorage is not available');
            return false;
        }
        
        // التأكد من وجود إعدادات افتراضية
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
        // الاحتفاظ بالتقييم إذا رغبت
        const rating = this.get('app_rated');
        const ratingValue = this.get('app_rating_value');
        
        Object.values(this.#keys).forEach(key => this.remove(key));
        
        // استعادة التقييم (اختياري - علق السطرين التاليين إذا أردت حذف التقييم أيضاً)
        // if (rating) this.set('app_rated', rating);
        // if (ratingValue) this.set('app_rating_value', ratingValue);
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
            theme: 'light',  // إضافة المظهر الافتراضي
            notificationPermissionAsked: false,
            notificationPermissionGranted: false,
            reminderTime: '08:00'
        });
    }
    
    static saveSettings(settings) {
        return this.set(this.#keys.SETTINGS, settings);
    }
}
