/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : user-manager.js
 * Type   : JavaScript
 */

/**
 * User Manager
 * 
 * Handles user data with dual persistence:
 * - localStorage (primary, fast)
 * - IndexedDB (backup, more durable)
 *
 * Provides a unified API for reading, saving, and editing user data.
 */

var UserManager = {

    /* CONSTANTS */

    STORAGE_KEY: 'user_data',           // used with StorageManager
    LOCALSTORAGE_KEY: 'taafi_user_data', // raw localStorage key
    INDEXEDDB_NAME: 'taafi_user_db',
    INDEXEDDB_STORE: 'user',

    /* INTERNAL STATE */

    _db: null,
    _cache: null,

    /* INITIALIZATION */

    /**
     * Initialize UserManager — open IndexedDB, migrate if needed.
     */
    init: function () {
        var self = this;

        // Try to open IndexedDB (non-blocking)
        if (typeof indexedDB !== 'undefined') {
            this._openDB().then(function () {
                // Sync localStorage → IndexedDB if needed
                self._migrateIfNeeded();
            }).catch(function (err) {
                console.warn('[UserManager] IndexedDB unavailable:', err);
            });
        }

        return this;
    },

    /**
     * Open IndexedDB connection.
     */
    _openDB: function () {
        var self = this;

        return new Promise(function (resolve, reject) {
            if (self._db) {
                return resolve(self._db);
            }

            var request = indexedDB.open(self.INDEXEDDB_NAME, 1);

            request.onupgradeneeded = function (event) {
                var db = event.target.result;
                if (!db.objectStoreNames.contains(self.INDEXEDDB_STORE)) {
                    db.createObjectStore(self.INDEXEDDB_STORE, { keyPath: 'id' });
                }
            };

            request.onsuccess = function (event) {
                self._db = event.target.result;
                resolve(self._db);
            };

            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    },

    /**
     * If localStorage has user data but IndexedDB doesn't, migrate.
     */
    _migrateIfNeeded: function () {
        var self = this;

        var localData = this._readLocalStorage();
        if (!localData) return;

        this._readFromDB('current').then(function (dbData) {
            if (!dbData) {
                // Migrate
                self._writeToDB('current', localData).then(function () {
                    console.log('[UserManager] Migrated user data to IndexedDB');
                });
            }
        }).catch(function () {});
    },

    /* READ */

    /**
     * Get user data. Order:
     * 1. In-memory cache
     * 2. StorageManager (which reads localStorage)
     * 3. Raw localStorage
     * 4. IndexedDB (async, returns null synchronously)
     */
    get: function () {
        if (this._cache) return this._cache;

        // Via StorageManager
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.getUser === 'function') {
            var data = StorageManager.getUser();
            if (data) {
                this._cache = data;
                return data;
            }
        }

        // Direct localStorage
        var local = this._readLocalStorage();
        if (local) {
            this._cache = local;
            return local;
        }

        return null;
    },

    _readLocalStorage: function () {
        try {
            var raw = localStorage.getItem(this.LOCALSTORAGE_KEY);
            if (!raw) return null;

            var parsed = JSON.parse(raw);

            // Handle both { value: ... } and direct formats
            if (parsed && typeof parsed === 'object' && parsed.value) {
                return parsed.value;
            }
            return parsed;
        } catch (e) {
            console.warn('[UserManager] Failed to read localStorage:', e);
            return null;
        }
    },

    _readFromDB: function (key) {
        var self = this;

        return this._openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx = db.transaction(self.INDEXEDDB_STORE, 'readonly');
                var store = tx.objectStore(self.INDEXEDDB_STORE);
                var request = store.get(key);

                request.onsuccess = function () {
                    resolve(request.result ? request.result.value : null);
                };
                request.onerror = function () {
                    reject(request.error);
                };
            });
        });
    },

    /* SAVE */

    /**
     * Save user data — dual persistence.
     */
    save: function (userData) {
        if (!userData || typeof userData !== 'object') {
            console.warn('[UserManager] Invalid user data');
            return false;
        }

        // 1. Save to cache
        this._cache = userData;

        // 2. Save via StorageManager
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.saveUser === 'function') {
            StorageManager.saveUser(userData);
        }

        // 3. Also save directly to localStorage (in case StorageManager fails)
        try {
            localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify({
                value: userData,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('[UserManager] Direct localStorage save failed:', e);
        }

        // 4. Save to IndexedDB (async)
        this._writeToDB('current', userData).catch(function (err) {
            console.warn('[UserManager] IndexedDB save failed:', err);
        });

        return true;
    },

    _writeToDB: function (key, value) {
        var self = this;

        return this._openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx = db.transaction(self.INDEXEDDB_STORE, 'readwrite');
                var store = tx.objectStore(self.INDEXEDDB_STORE);
                var request = store.put({
                    id: key,
                    value: value,
                    updatedAt: Date.now()
                });

                request.onsuccess = function () { resolve(true); };
                request.onerror = function () { reject(request.error); };
            });
        });
    },

    /* UPDATE */

    /**
     * Update specific fields of the user data.
     * @param {object} partial - fields to update
     */
    update: function (partial) {
        var current = this.get() || {};
        var merged = Object.assign({}, current, partial);
        return this.save(merged);
    },

    /* DELETE */

    /**
     * Remove user data (both localStorage and IndexedDB).
     */
    clear: function () {
        this._cache = null;

        // Clear localStorage
        try {
            localStorage.removeItem(this.LOCALSTORAGE_KEY);
        } catch (e) {}

        if (typeof StorageManager !== 'undefined' && typeof StorageManager.remove === 'function') {
            StorageManager.remove('user_data');
        }

        // Clear IndexedDB
        this._deleteFromDB('current').catch(function () {});
    },

    _deleteFromDB: function (key) {
        var self = this;

        return this._openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx = db.transaction(self.INDEXEDDB_STORE, 'readwrite');
                var store = tx.objectStore(self.INDEXEDDB_STORE);
                var request = store.delete(key);

                request.onsuccess = function () { resolve(true); };
                request.onerror = function () { reject(request.error); };
            });
        });
    },

    /* ONBOARDING TRACKING */

    markOnboardingComplete: function () {
        var current = this.get() || {};
        current.onboardingCompletedAt = new Date().toISOString();
        return this.save(current);
    },

    isOnboardingComplete: function () {
        var user = this.get();
        return !!(user && user.onboardingCompletedAt);
    },

    /* VALIDATION HELPERS */

    /**
     * Check if user has valid core data.
     */
    hasValidProfile: function () {
        var user = this.get();
        if (!user) return false;

        return !!(
            user.gender &&
            user.age &&
            user.age >= 13 &&
            user.age <= 99
        );
    },

    /**
     * Get display name (with fallback).
     */
    getDisplayName: function () {
        var user = this.get();
        return (user && user.name) ? user.name : 'صديقي';
    },

    /**
     * Get gender (with fallback).
     */
    getGender: function () {
        var user = this.get();
        return (user && user.gender) ? user.gender : 'male';
    }
};

/* AUTO-INIT ON DOM READY */

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        UserManager.init();
    }, 200);
});