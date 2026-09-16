/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : multi-habit-recovery.js
 * Type   : JavaScript
 */

/**
 * Remove the new multi-habit database.
 * Remove the old legacy database.
 * Remove possible StorageManager keys
 * if they exist under the same names.
 */

function clearAllRecoveryData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);

        try {
            if (typeof StorageManager !== 'undefined' && typeof StorageManager.clearRecoveryData === 'function') {
                StorageManager.clearRecoveryData();
            }

        } catch (error) {
            console.warn('StorageManager recovery clear failed:', error);
        }

        /*
         * Verify that the main recovery keys
         * were actually removed.
         */

        const newStorageStillExists = localStorage.getItem(STORAGE_KEY);
        const legacyStorageStillExists = localStorage.getItem(LEGACY_STORAGE_KEY);

        if (newStorageStillExists !== null || legacyStorageStillExists !== null) {
            console.error('Recovery data was not completely deleted.');
            return false;
        }

        /*
         * Notify the application.
         */

        try {
            window.dispatchEvent(new CustomEvent('recoveryUpdated',{
                        detail: {
                            reason: 'all-data-cleared',
                            activeHabitId: null,
                            timestamp: getTimestamp()
                        }
                    }
                ));

        } catch (error) {
            console.warn('Recovery update event failed:', error);
        }
        return true;
    } catch (error) {
        console.error('Failed to clear all recovery data:', error);
        return false;
    }
}

(function () {
    'use strict';

    /* 
     * Configuration
     **/

    const STORAGE_KEY = 'taeafi_multi_habit_recovery';
    const LEGACY_STORAGE_KEY = 'taafi_recovery_data';
    const VERSION = 4;
    const MAX_HABITS = 4;
    const RESET_MARKER_KEY = 'taeafi_recovery_reset_marker';

    /* 
     * Habit Metadata
     **/

    const META = {
        smoking: {
            title: 'التدخين',
            icon: 'fa-smoking'
        },

        alcohol: {
            title: 'شرب الكحول',
            icon: 'fa-wine-bottle'
        },

        drugs: {
            title: 'المخدرات',
            icon: 'fa-pills'
        },

        masturbation: {
            title: 'العادة السرية',
            icon: 'fa-hand-paper'
        },

        pornography: {
            title: 'الأفلام الإباحية',
            icon: 'fa-film'
        },

        gaming: {
            title: 'إدمان الألعاب',
            icon: 'fa-gamepad'
        },

        socialMedia: {
            title: 'إدمان التواصل الاجتماعي',
            icon: 'fa-hashtag'
        },

        smartphone: {
            title: 'إدمان الهاتف الذكي',
            icon: 'fa-mobile-alt'
        },

        procrastination: {
            title: 'التسويف',
            icon: 'fa-clock'
        },

        lying: {
            title: 'الكذب',
            icon: 'fa-comment-slash'
        },

        anger: {
            title: 'الغضب غير المنضبط',
            icon: 'fa-angry'
        },

        bullying: {
            title: 'التنمر',
            icon: 'fa-user-slash'
        },

        inactivity: {
            title: 'الخمول وقلة الحركة',
            icon: 'fa-couch'
        },

        gambling: {
            title: 'المقامرة والمراهنات',
            icon: 'fa-dice',
        },

        overspending: {
            title: 'الإسراف في الإنفاق',
            icon: 'fa-shopping-cart',
        },

        poorNutrition: {
            title: 'سوء التغذية',
            icon: 'fa-hamburger',
        },

        sleepDisorder: {
            title: 'اضطرابات النوم',
            icon: 'fa-moon',
        },

        caffeine: {
            title: 'الإفراط في الكافيين',
            icon: 'fa-coffee',
        },

        nailBiting: {
            title: 'قضم الأضافر',
            icon: 'fa-hand-sparkles',
        },

        isolation: {
            title: 'العزلة الاجتماعية',
            icon: 'fa-user-slash',
        },

        adultery: {
            title: 'الزنا والعلاقات غير الشرعية',
            icon: 'fa-heart-crack',
        },
    };

    /* 
     * Preserve Original StorageManager Methods
     * IMPORTANT:
     * The original functions are captured before patching.
     * This prevents recursive calls.
     **/

    const originalStorage = {
        getRecoveryData: typeof StorageManager !== 'undefined' && typeof StorageManager.getRecoveryData === 'function'
                ? StorageManager.getRecoveryData.bind(StorageManager)
                : null,

        saveRecoveryData: typeof StorageManager !== 'undefined' && typeof StorageManager.saveRecoveryData === 'function'
                ? StorageManager.saveRecoveryData.bind(StorageManager)
                : null
    };

    /* 
     * Utility
     **/

    function getToday() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return`${year}-${month}-${day}`;
    }


    function getTimestamp() {
        return Date.now();
    }

    function isObject(value) {
        return (value !== null && typeof value === 'object' && !Array.isArray(value));
    }

    function normalizeRelapses(value) {
        if (!Array.isArray(value)) {
            return [];
        }
        return value.map(item => {
            if (typeof item === 'string') {
                return {
                    date: item,
                    timestamp: 0
                };
            }
            return {
                date: item?.date || getToday(),
                timestamp: Number(item?.timestamp || 0)
            };
        });
    }

    function cloneObject(value) {
        try {
            return JSON.parse(JSON.stringify(value));
        } catch (error) {
            return value;
        }
    }

    /* 
     * Local Storage
     **/

    function readLocal(key) {
        try {
            const raw =localStorage.getItem(key);

            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw);

            if (isObject(parsed) && Object.prototype.hasOwnProperty.call(parsed, 'value')) {
                return parsed.value;
            }
            return parsed;

        } catch (error) {
            console.warn('Multi-habit local storage read failed:', error);
            return null;
        }
    }

    function writeLocal(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({
                    value: data, timestamp: getTimestamp()}));
            return true;
        } catch (error) {
            console.error(
                'Multi-habit local storage write failed:',
                error
            );
            return false;
        }
    }

    /* 
     * Database
     **/

    function createEmptyDatabase() {
        return {
            version: VERSION,
            activeHabitId: null,
            habits: {},
            createdAt: getTimestamp(),
            updatedAt: getTimestamp()
        };
    }

    function createHabit(type, source = {}, isNew = false) {
        const currentTime = Date.now();
        let startTimestamp = Number(source.startTimestamp || 0);

        if (!startTimestamp && source.startDate) {
            const parsed = new Date(source.startDate);
            if (!Number.isNaN(parsed.getTime())) {
                startTimestamp = parsed.getTime();
            }
        }

        // IMPORTANT: If the habit is new or has no timestamp, create a new timestamp
        if (isNew || !startTimestamp) {
            startTimestamp = currentTime;
        }

        return {
            id: type,
            habitType: type,
            startDate: source.startDate || new Date(startTimestamp).toISOString(),
            startTimestamp: startTimestamp,
            relapses: normalizeRelapses(source.relapses),
            createdAt: Number(source.createdAt || currentTime),
            updatedAt: currentTime
        };
    }

    function normalizeDatabase(database) {
        if (!isObject(database) || !isObject(database.habits)) {
            return createEmptyDatabase();
        }

        const result = createEmptyDatabase();
        result.version = VERSION;
        result.activeHabitId = database.activeHabitId || null;

        const ids = Object.keys(database.habits).slice(0, MAX_HABITS);

        ids.forEach(id => {
            const source = database.habits[id];
            if (!isObject(source)) return;

            // IMPORTANT: Ensure each habit has its own timestamp
            // If time is 0 or missing, create a new timestamp
            if (!source.startTimestamp || source.startTimestamp === 0) {
                source.startTimestamp = Date.now();
                source.startDate = new Date().toISOString();
            }
            result.habits[id] = createHabit(id, source);
        });

        if (!result.activeHabitId || !result.habits[result.activeHabitId]) {
            result.activeHabitId = Object.keys(result.habits)[0] || null;
        }

        result.createdAt = Number(database.createdAt || getTimestamp());
        result.updatedAt = getTimestamp();

        return result;
    }

    /* 
     * Legacy Migration
     **/

    function readLegacyData() {
        let legacy = null;

        /*
         * Read the original StorageManager method.
         * Never use the patched method here.
         */

        if (originalStorage.getRecoveryData) {
            try {
                legacy = originalStorage.getRecoveryData();
            } catch (error) {
                console.warn('Legacy StorageManager read failed:', error
                );
            }
        }

        /*
         * Direct fallback.
         */

        if (!legacy) {
            legacy = readLocal(LEGACY_STORAGE_KEY);
        }

        if (!isObject(legacy)) {
            return null;
        }

        if (!legacy.habitType) {
            return null;
        }

        return legacy;
    }

    // If the prevention flag exists, do not return legacy data
    function migrateLegacyData() {
        if (localStorage.getItem(RESET_MARKER_KEY) === 'true') {
            const database = createEmptyDatabase();
            writeLocal(STORAGE_KEY, database);
            return database;
        }
        const current = readLocal(STORAGE_KEY);
        if (isObject(current) && isObject(current.habits)) {
            return normalizeDatabase(current);
        }

        const legacy = readLegacyData();
        const database = createEmptyDatabase();

        if (legacy && legacy.habitType) {
            const type = String(legacy.habitType);
            database.habits[type] = createHabit(type, legacy);
            database.activeHabitId = type;
        }

        writeLocal(STORAGE_KEY, database);
        return database;
    }

    /**
     * Delete all recovery data completely.
     * 1. Place a prohibition sign.
     * 2. Delete both keys.
     * 3. Create an empty database.
     * 4. Sending the update event.
     */

    function resetAllRecoveryData() {
        try {
            localStorage.setItem(RESET_MARKER_KEY, 'true');
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(LEGACY_STORAGE_KEY);
            const emptyDatabase = createEmptyDatabase();
            writeLocal(STORAGE_KEY, emptyDatabase);
            emitUpdate('all-data-reset');
            
            return true;
        } catch (error) {
            console.error('فشل إعادة البداية:', error);
            return false;
        }
    }

    function readDatabase() {
        const raw = readLocal(STORAGE_KEY);
        if (
            isObject(raw) &&
            isObject(raw.habits)
        ) {

            return normalizeDatabase(
                raw
            );
        }
        return migrateLegacyData();
    }

    function writeDatabase(database) {
        const normalized = normalizeDatabase(database);
        normalized.updatedAt = getTimestamp();
        return writeLocal(STORAGE_KEY,normalized);
    }

    /* 
     * Habit Access
     **/

    function getActiveHabitId() {
        const database = readDatabase();
        return (database.activeHabitId || null);
    }

    function getActiveHabit() {
        const database = readDatabase();
        const id = database.activeHabitId;
        if (!id) {return null;}
        return (database.habits[id] || null);
    }

    function getHabit(type) {
        if (!type) {return null;}
        const database = readDatabase();
        return (database.habits[type] || null);
    }

    function getHabits() {
        const database = readDatabase();
        return Object.values(
            database.habits
        ).map(habit => {
            const meta = META[habit.habitType] || {
                    title: habit.habitType,
                    icon: 'fa-leaf'
                };
            return {
                ...habit,
                meta
            };
        });
    }

    /* 
     * Habit Management
     **/

    function addHabit(type, options = {}) {
        if (!type) {return { success: false, reason: 'invalid' };}
        const database = readDatabase();
        const exists = Boolean(database.habits[type]);
        if (!exists && Object.keys(database.habits).length >= MAX_HABITS) {
            return { success: false, reason: 'limit', limit: MAX_HABITS };
        }

        // IMPORTANT: Create a new time for each new habit
        const now = Date.now();
        if (!exists) {
            database.habits[type] = {
                id: type,
                habitType: type,
                startDate: options.start === false ? null : new Date(now).toISOString(),
                startTimestamp: options.start === false ? null : now,
                relapses: [],
                createdAt: now,
                updatedAt: now
            };
        }

        if (options.activate !== false) {database.activeHabitId = type;}
        writeDatabase(database);
        emitUpdate(exists ? 'habit-selected' : 'habit-added');
        return {
            success: true,
            existing: exists,
            habit: database.habits[type]
        };
    }

    function startRecovery(type) {
        const result = addHabit(type,
                {
                    start: true,
                    activate: true
                }
            );

        if (result.success && typeof showToast === 'function') {
            const meta = META[type];
            const name = meta?.title || type;
            showToast(result.existing
                    ? `تم اختيار ${name}`
                    : `تمت إضافة ${name}`
            );
        }
        return result;
    }


    function selectHabit(type) {
        if (!type) {
            return {
                success: false,
                reason: 'invalid'
            };
        }

        const database = readDatabase();

        if (
            !database.habits[type]
        ) {

            return {
                success: false,
                reason: 'not-found'
            };
        }

        if (database.activeHabitId ===type) {
            return {
                success: true,
                unchanged: true
            };
        }

        database.activeHabitId = type;
        database.updatedAt = getTimestamp();
        writeDatabase(database);
        emitUpdate('habit-selected');
        return {
            success: true,
            habit:database.habits[type]
        };
    }

    function removeHabit(type) {
        if (!type) {return false;}
        const database = readDatabase();

        if (!database.habits[type]) {
            return false;
        }

        delete database.habits[type];
        const remaining = Object.keys(database.habits);

        if (database.activeHabitId === type) {
            database.activeHabitId = remaining[0] || null;
        }

        writeDatabase(database);
        emitUpdate('habit-removed');
        return true;
    }

    /* 
     * Recovery Counter
     **/

    function daysFromDate(dateString) {
        if (!dateString) {
            return 0;
        }
        const start = new Date(`${dateString}T00:00:00`);
        const now = new Date();
        if (Number.isNaN(start.getTime())) {
            return 0;
        }

        start.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        return Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000));
    }

    /**
     * Calculate complete recovery statistics.
     * This keeps compatibility with the original RecoveryCounter API.
     * The application expects both:
     * - total values
     * - display values
     */

    function getStats(type = null) {
        const habit =
            type
                ? getHabit(type)
                : getActiveHabit();

        if (!habit) {
            return {
                isActive: false,

                habitType: null,
                startDate: null,

                seconds: 0,
                minutes: 0,
                hours: 0,
                days: 0,
                weeks: 0,
                months: 0,
                years: 0,

                totalSeconds: 0,
                totalMinutes: 0,
                totalHours: 0,
                totalDays: 0,
                totalWeeks: 0,
                totalMonths: 0,
                totalYears: 0,

                relapses: [],
                relapseCount: 0
            };
        }

        const relapses = normalizeRelapses(habit.relapses);

        if (!habit.startDate) {
            return {
                isActive: false,

                habitType: habit.habitType,
                startDate: null,

                seconds: 0,
                minutes: 0,
                hours: 0,
                days: 0,
                weeks: 0,
                months: 0,
                years: 0,

                totalSeconds: 0,
                totalMinutes: 0,
                totalHours: 0,
                totalDays: 0,
                totalWeeks: 0,
                totalMonths: 0,
                totalYears: 0,

                relapses,
                relapseCount: relapses.length
            };
        }

        const start = new Date(habit.startDate);
        const now = new Date();
        let difference = now.getTime() - start.getTime();

        /*
         * Prevent invalid or negative values.
         */

        if (!Number.isFinite(difference) || difference < 0) {
            difference = 0;
        }

        const totalSeconds = Math.floor(difference / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = Math.floor(totalDays / 30.4375);
        const totalYears = Math.floor(totalDays / 365.25);

        /*
         * Display values.
         * Example:
         * 2 days, 5 hours, 32 minutes, 14 seconds
         */

        const seconds = totalSeconds % 60;
        const minutes = totalMinutes % 60;
        const hours = totalHours % 24;
        const days = totalDays;
        const weeks = totalWeeks;
        const months = totalMonths;
        const years = totalYears;

        return {
            isActive: true,
            habitType: habit.habitType,
            startDate: habit.startDate,

            /*
             * Display values
             */

            seconds,
            minutes,
            hours,
            days,
            weeks,
            months,
            years,

            /*
             * Total values
             * Required by the original counter.js
             * and some motivational/statistical features.
             */
            totalSeconds,
            totalMinutes,
            totalHours,
            totalDays,
            totalWeeks,
            totalMonths,
            totalYears,

            /*
             * Relapse information
             */

            relapses,
            relapseCount: relapses.length
        };
    }


    function recordRelapse(type) {
        const id = type || getActiveHabitId();
        if (!id) {
            return false;
        }

        const database = readDatabase();
        const habit = database.habits[id];

        if (!habit) {
            return false;
        }

        habit.relapses = normalizeRelapses(habit.relapses);
        habit.relapses.push({date: getToday(),
            timestamp:getTimestamp()});
        habit.updatedAt = getTimestamp();
        database.activeHabitId =id;
        writeDatabase(database);
        emitUpdate('relapse');
        return true;
    }


    function resetHabit(type) {
        const id = type || getActiveHabitId();
        if (!id) {
            return false;
        }

        const database = readDatabase();
        const habit = database.habits[id];

        if (!habit) {
            return false;
        }

        habit.startDate = getToday();
        habit.relapses = [];
        habit.updatedAt = getTimestamp();
        database.activeHabitId = id;
        writeDatabase(database);
        emitUpdate('habit-reset');
        return true;
    }

    /* 
     * Legacy Compatibility
     **/

    function getLegacyRecoveryData() {
        const active = getActiveHabit();
        if (!active) {
            return {
                startDate: null,
                habitType: null,
                relapses: []
            };
        }

        return {
            startDate:active.startDate,
            habitType: active.habitType,
            relapses: normalizeRelapses(active.relapses)
        };
    }

    function saveLegacyRecoveryData(data) {
        if (!isObject(data)) {
            return false;
        }

        /*
         * Old code may save an empty recovery object.
         * Reset only the active habit.
         */

        if (
            !data.habitType
        ) {
            const activeId = getActiveHabitId();
            if (activeId) {resetHabit(activeId);}
            return true;
        }

        const type = String(data.habitType);
        const database = readDatabase();

        if (!database.habits[type] && Object.keys(database.habits).length >= MAX_HABITS) {return false;}
        database.habits[type] = createHabit(type, data);
        database.activeHabitId = type;
        writeDatabase(database);
        emitUpdate('legacy-save');
        return true;
    }

    /* 
     * RecoveryCounter Compatibility
     **/

    function patchRecoveryCounter() {
        if (typeof RecoveryCounter === 'undefined') {return;}
        RecoveryCounter.startRecovery = startRecovery;
        RecoveryCounter.getRecoveryStats = getStats;
        RecoveryCounter.getActiveHabitId = getActiveHabitId;
        RecoveryCounter.getActiveHabit = getActiveHabit;
        RecoveryCounter.getHabit = getHabit;
        RecoveryCounter.getHabits = getHabits;
        RecoveryCounter.addHabit = addHabit;
        RecoveryCounter.selectHabit = selectHabit;
        RecoveryCounter.removeHabit = removeHabit;
        RecoveryCounter.recordRelapse = recordRelapse;
        RecoveryCounter.resetHabit = resetHabit;
    }

    /* 
     * StorageManager Compatibility
     **/

    function patchStorageManager() {
        if (typeof StorageManager === 'undefined') {return; }
        StorageManager.getRecoveryData = function () {return getLegacyRecoveryData();};
        StorageManager.saveRecoveryData = function (data) {return saveLegacyRecoveryData(data);};
    }

    /* 
     * Update Event
     **/

    function emitUpdate(reason) 
    {try{window.dispatchEvent(new CustomEvent('recoveryUpdated',
        {detail: {reason,
            activeHabitId: getActiveHabitId(),
            timestamp:getTimestamp()}}));
        } catch (error) {
            try {window.dispatchEvent(new Event('recoveryUpdated'));} catch (_) {}
        }
    }

    /* 
     * UI Helpers
     **/

    function getHabitName(type) {
        return (META[type]?.title || type || 'عادة');
    }

    function getHabitIcon(type) {
        return (
            META[type]?.icon ||
            'fa-leaf'
        );
    }

    function formatNumber(value) {
        return Number(value || 0 ).toLocaleString('ar-IQ');
    }

    /* 
     * UI Styles
     * Injected once only.
     **/

    function installStyles() {
        if (document.getElementById('taeafi-multi-habit-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'taeafi-multi-habit-styles';
        style.textContent = `
            .taeafi-multi-habits-panel {
                margin: 20px 0;
                padding: 18px;
                background: var(--surface, #ffffff);
                color: var(--text-primary, #1a1c1e);
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 18px;
                box-shadow: var(--card-shadow, 0 4px 18px rgba(0,0,0,.06));
            }

            .taeafi-multi-habits-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                margin-bottom: 16px;
            }

            .taeafi-multi-habits-header h2 {
                margin: 5px 0;
                color: var(--text-primary, #1a1c1e);
            }

            .taeafi-multi-habits-header p {
                margin: 0;
                color: var(--text-secondary, #666);
                font-size: 13px;
            }

            .taeafi-multi-habits-count {
                min-width: 48px;
                padding: 8px 12px;
                text-align: center;
                border-radius: 12px;
                background: var(--surface-variant, #f1f3f5);
                color: var(--text-primary, #1a1c1e);
                font-weight: 700;
            }

            .taeafi-multi-habits-kicker {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                color: var(--primary-color, #00a896);
                font-size: 13px;
                font-weight: 700;
            }

            .taeafi-multi-habits-list {
                display: grid;
                gap: 10px;
            }

            .taeafi-habit-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 13px;
                border: 1px solid var(--border-color, #e0e0e0);
                border-radius: 15px;
                background: var(--background, #f7f8fa);
                transition:
                    transform .18s ease,
                    border-color .18s ease,
                    background .18s ease;
            }

            .taeafi-habit-item:hover {
                transform: translateY(-1px);
            }

            .taeafi-habit-item.is-active {
                border-color: var(--primary-color, #00a896);
                background: var(--surface-variant, #eefaf8);
            }

            .taeafi-habit-icon {
                width: 44px;
                height: 44px;
                min-width: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 13px;
                background: var(--primary-color, #00a896);
                color: #fff;
                font-size: 19px;
            }

            .taeafi-habit-info {
                flex: 1;
                min-width: 0;
            }

            .taeafi-habit-info strong {
                display: block;
                color: var(--text-primary, #1a1c1e);
                margin-bottom: 3px;
            }

            .taeafi-habit-info span {
                display: block;
                color: var(--text-secondary, #666);
                font-size: 12px;
            }

            .taeafi-habit-actions {
                display: flex;
                align-items: center;
                gap: 7px;
            }

            .taeafi-habit-actions button {
                min-height: 38px;
                padding: 7px 11px;
                border: 1px solid var(--border-color, #ddd);
                border-radius: 10px;
                background: var(--surface, #fff);
                color: var(--text-primary, #1a1c1e);
                cursor: pointer;
                font: inherit;
            }

            .taeafi-habit-actions button:hover {
                background: var(--surface-variant, #f1f3f5);
            }

            .taeafi-habit-actions button.danger {
                color: #d32f2f;
            }

            .taeafi-habit-active {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 8px 11px;
                border-radius: 10px;
                background: var(--primary-color, #00a896);
                color: #fff;
                font-size: 12px;
                font-weight: 700;
            }

            .taeafi-multi-habits-empty {
                padding: 25px;
                text-align: center;
                color: var(--text-secondary, #666);
            }

            .taeafi-multi-habits-empty i {
                font-size: 30px;
                margin-bottom: 8px;
            }

            @media (max-width: 600px) {

                .taeafi-habit-item {
                    align-items: flex-start;
                    flex-wrap: wrap;
                }

                .taeafi-habit-info {
                    padding-top: 3px;
                }

                .taeafi-habit-actions {
                    width: 100%;
                    margin-right: 56px;
                }

                .taeafi-habit-actions button,
                .taeafi-habit-active {
                    flex: 1;
                    text-align: center;
                    justify-content: center;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /* 
     * Habit Panel
     **/

    function renderHabitItem(habit) {
        const activeId = getActiveHabitId();
        const active = habit.habitType === activeId;
        const stats = getStats(habit.habitType);
        return `
            <article
                class="taeafi-habit-item ${active ? 'is-active' : ''}"
                data-habit-id="${habit.habitType}"
            >
                <div class="taeafi-habit-icon">
                    <i class="fas ${getHabitIcon(habit.habitType)}"></i>
                </div>
                <div class="taeafi-habit-info">
                    <strong>
                        ${getHabitName(habit.habitType)}
                    </strong>
                    <span>
                        ${
                            stats.isActive
                                ? `${formatNumber(stats.days)} يوم`
                                : 'غير مفعلة'
                        }

                        ${
                            stats.relapseCount > 0
                                ? ` • ${formatNumber(stats.relapseCount)} انتكاسة`
                                : ''
                        }
                    </span>
                </div>
                <div class="taeafi-habit-actions">

                    ${
                        active
                            ? `
                                <span class="taeafi-habit-active">
                                    <i class="fas fa-check-circle"></i>
                                    الحالية
                                </span>
                            `
                            : `
                                <button
                                    type="button"
                                    data-action="select"
                                    data-habit="${habit.habitType}"
                                >
                                    <i class="fas fa-exchange-alt"></i>
                                    اختيار
                                </button>

                            `
                    }

                    <button
                        type="button"
                        class="danger"
                        data-action="remove"
                        data-habit="${habit.habitType}"
                        aria-label="حذف العادة"
                    >
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </article>
        `;
    }

    function renderHabitsPanel() {
        installStyles();
        const main =document.getElementById('main-content');

        if (!main) {
            return;
        }

        let panel = document.getElementById('taeafi-multi-habits-panel');
        if (!panel) {
            panel = document.createElement('section');
            panel.id = 'taeafi-multi-habits-panel';
            panel.className = 'taeafi-multi-habits-panel';
        }

        const habits = getHabits();
        panel.innerHTML = `
            <div class="taeafi-multi-habits-header">
                <div>
                    <span class="taeafi-multi-habits-kicker">
                        <i class="fas fa-layer-group"></i>
                        رحلات التعافي
                    </span>
                    <h2>
                        عاداتك
                    </h2>
                    <p>
                        كل عادة لها عداد وانتكاسات وبيانات مستقلة.
                    </p>
                </div>
                <strong class="taeafi-multi-habits-count">
                    ${habits.length}/${MAX_HABITS}
                </strong>
            </div>
            <div class="taeafi-multi-habits-list">
                ${
                    habits.length
                        ? habits
                            .map(renderHabitItem)
                            .join('')

                        : `
                            <div class="taeafi-multi-habits-empty">
                                <i class="fas fa-seedling"></i>
                                <p>
                                    لم تبدأ أي عادة بعد.
                                </p>
                            </div>

                        `
                }
            </div>
        `;

        if (!panel.parentElement) {
            main.appendChild(panel);
        }
        return panel;
    }

    /* 
     * Panel Event Delegation
     * One listener only.
     **/

    function installPanelEvents() {
        const panel = document.getElementById('taeafi-multi-habits-panel');
        if (!panel) {
            return;
        }

        if (
            panel.dataset.eventsInstalled ===
            'true'
        ) {
            return;
        }

        panel.dataset.eventsInstalled ='true';
        panel.addEventListener('click', function (event) {
                const button = event.target.closest('button[data-action]');

                if (!button) {
                    return;
                }

                const action = button.dataset.action;
                const type = button.dataset.habit;

                if (!type) {
                    return;
                }

                if (
                    action === 'select'
                ) {

                    const result = selectHabit(type);

                    if (
                        result.success
                    ) {

                        if (
                            typeof showToast ===
                            'function'
                        ) {

                            showToast(
                                `تم اختيار ${getHabitName(type)}`
                            );
                        }

                        refreshRecoveryPage();
                    }
                    return;

                }

                if (action === 'remove') {
                    const name = getHabitName(type);
                    if (
                        !confirm(
                            `هل تريد حذف رحلة ${name}؟\n\nسيتم حذف بيانات هذه العادة فقط.`
                        )
                    ) {
                        return;
                    }

                    removeHabit(type);

                    if (typeof showToast === 'function') {
                        showToast(
                            `تم حذف ${name}`
                        );
                    }
                    refreshRecoveryPage();
                }
            }
        );
    }

    /* 
     * Recovery Page Integration
     **/

    function refreshRecoveryPage() {
        const main = document.getElementById('main-content');
        if (!main) {
            return;
        }

        /*
         * If we are currently on recovery,
         * ask the existing page to render again.
         * This is one render only after an explicit action.
         */

        if (
            typeof renderRecoveryPage === 'function') {
            try {
                renderRecoveryPage();
            } catch (error) {
                console.error('Recovery page refresh failed:', error);
            }
        }

        /*
         * If renderRecoveryPage() does not include
         * the panel, append it manually.
         */

        requestAnimationFrame(
            function () {

                renderHabitsPanel();
                installPanelEvents();
            }
        );
    }

    function refreshCurrentRecoveryUI() {
        const currentPage = typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function'
                ? Router.getCurrentPage()
                : null;
        if (
            currentPage ===
            'recovery'
        ) {
            refreshRecoveryPage();
        }
    }

    /* 
     * renderRecoveryPage Hook
     * No router modification required.
     *  */

    function patchRecoveryPage() {
        if (typeof window.renderRecoveryPage !== 'function') {
            return false;
        }

        if (window.__taeafiMultiRecoveryPatched) {
            return true;
        }

        const originalRender = window.renderRecoveryPage;
        window.renderRecoveryPage =
            function () {
                originalRender.apply(this, arguments);
                renderHabitsPanel();
                installPanelEvents();
            };

        window.__taeafiMultiRecoveryPatched = true;
        return true;
    }

    /* 
     * renderHabitsPage Hook
     **/

    function patchHabitsPage() {
        if (typeof window.renderHabitsPage !== 'function') {
            return false;
        }

        if (window.__taeafiMultiHabitsPatched) {
            return true;
        }

        const originalRender = window.renderHabitsPage;
        window.renderHabitsPage =function () {
                originalRender.apply(this, arguments);
                /*
                 * Do not place the recovery selector
                 * into the habits detail page.
                 * This panel is specifically for
                 * recovery management.
                 */
            };

        window.__taeafiMultiHabitsPatched = true;
        return true;
    }

    /* 
     * Public Refresh
     **/

    function updateVisibleRecoveryUI() {
        const main = document.getElementById('main-content');
        if (!main) {
            return;
        }

        const panel = document.getElementById('taeafi-multi-habits-panel');
        if (!panel) {
            return;
        }

        /*
         * Update only the panel.
         * No complete page rebuild.
         */

        const list =panel.querySelector('.taeafi-multi-habits-list');
        const count =panel.querySelector('.taeafi-multi-habits-count');

        const habits = getHabits();

        if (count) {
            count.textContent = `${habits.length}/${MAX_HABITS}`;
        }

        if (list) {
            list.innerHTML = habits.length
                    ? habits
                        .map(renderHabitItem)
                        .join('')

                    : `
                        <div class="taeafi-multi-habits-empty">
                            <i class="fas fa-seedling"></i>
                            <p>
                                لم تبدأ أي عادة بعد.
                            </p>
                        </div>
                    `;
        }
    }

    /* 
     * Start Recovery Journey
     **/

    window.startRecoveryJourney = function (type) {
            if (!type) {
                return false;
            }

            const result = startRecovery(type);

            if (!result.success) {

                if (result.reason === 'limit') {

                    if (typeof showToast === 'function'
                    ) {
                        showToast('يمكنك إضافة 5 عادات كحد أقصى');
                    }
                }
                return false;
            }

            if (typeof navigateTo === 'function') {
                navigateTo('recovery');
            }
            return true;
        };


    /* 
     * Global Remove Helper
     **/

    window.TaeafiMultiHabitRemove = function (type) {
            if (!type) {
                return false;
            }
            const name = getHabitName(type);
            if (
                !confirm(`هل تريد حذف رحلة ${name}؟\n\nسيتم حذف بيانات هذه العادة فقط.`)) {
                return false;
            }
            const result = removeHabit(type);

            if (result &&typeof showToast === 'function') {
                showToast(`تم حذف ${name}`);
            }
            refreshRecoveryPage();
            return result;
        };

    /* 
     * Public API
     **/

    window.TaeafiMultiHabit = {
        VERSION,
        MAX_HABITS,
        META,
        readDatabase,
        writeDatabase,
        getHabits,
        getHabit,
        getActiveHabit,
        getActiveHabitId,
        addHabit,
        startRecovery,
        selectHabit,
        removeHabit,
        recordRelapse,
        resetHabit,
        getStats,
        resetAllRecoveryData,
        clearAllRecoveryData,
        renderHabitsPanel,
        updateVisibleRecoveryUI,
        refreshRecoveryPage
    };

    /* 
     * RecoveryCounter Patch
     * orageManager Patch
     * Initial Migration
     * Runs once when the file loads.
     * Recovery Update Listener
     * Updates only when data actually changes.
     **/

    patchRecoveryCounter();
    patchStorageManager();
    readDatabase();

    if (!window.__taeafiMultiHabitRecoveryListener) {
        window.__taeafiMultiHabitRecoveryListener = true;

        window.addEventListener('recoveryUpdated', function () {
                updateVisibleRecoveryUI();
                refreshCurrentRecoveryUI();
            }
        );
    }

    /* 
     * DOM Ready
     **/

    function initializeIntegration() {
        installStyles();
        patchRecoveryPage();
        patchHabitsPage();

        /*
         * If the recovery page is already visible,
         * render the selector immediately.
         */

        const currentPage = typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function'
                ? Router.getCurrentPage()
                : null;

        if (currentPage === 'recovery') {
            renderHabitsPanel();
            installPanelEvents();
        }
    }

    if (document.readyState ==='loading') {
        document.addEventListener('DOMContentLoaded', initializeIntegration,{
                once: true
            }
        );

    } else {
        initializeIntegration();
    }
})();