/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : habit-controls.js
 * Type   : JavaScript
 */

(function () {
    'use strict';
    const STYLE_ID = 'taeafi-habit-controls-style';
    const PANEL_ID = 'taeafi-habit-controls';

    /*
     * SETTINGS
     */

    const MAX_HABITS = 4;

    /*
     * EXISTING ENGINE
     */

    function engine() {
        return window.TaeafiMultiHabit || null;
    }

    function getHabits() {
        const api = engine();

        if (api && typeof api.getHabits === 'function') {
            return api.getHabits() || [];
        }

        if (
            typeof RecoveryCounter !== 'undefined' &&
            typeof RecoveryCounter.getHabits === 'function'
        ) {
            return RecoveryCounter.getHabits() || [];
        }
        return [];
    }

    function getHabit(type) {
        if (!type) {
            return null;
        }
        const api = engine();

        if (api && typeof api.getHabit === 'function') {
            return api.getHabit(type);
        }

        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getHabit === 'function') {
            return RecoveryCounter.getHabit(type);
        }
        return null;
    }

    function getStats(type) {
        const api = engine();

        if (api && typeof api.getStats === 'function') {
            return api.getStats(type);
        }

        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getRecoveryStats === 'function') {
            return RecoveryCounter.getRecoveryStats(type);
        }

        return null;
    }

    function getActiveHabitId() {
        const api = engine();
        if (api && typeof api.getActiveHabitId === 'function') {
            return api.getActiveHabitId();
        }

        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getActiveHabitId === 'function') {
            return RecoveryCounter.getActiveHabitId();
        }
        return null;
    }

    function selectHabit(type) {
        const api = engine();
        if (api && typeof api.selectHabit === 'function') {
            return api.selectHabit(type);
        }

        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.selectHabit === 'function') {
            return RecoveryCounter.selectHabit(type);
        }

        return false;
    }

    function getName(type) {
        const api = engine();

        if (
            api && api.META && api.META[type]) {
            return (api.META[type].title || type
            );
        }

        const habit = getHabit(type);
        return (habit?.title || type || 'العادة');
    }

    function getIcon(type) {
        const api = engine();

        if (api && api.META && api.META[type]) {
            return (api.META[type].icon || 'fa-leaf');
        }
        return 'fa-leaf';
    }

    function toast(message) {
        if (typeof showToast === 'function') {
            showToast(message);
        } else {
            console.log('[تعافي]', message);
        }
    }

    function confirmAction(message) {
        return window.confirm(message);
    }

    /*
     * DATABASE
     * Very important:
     * This is where the real fix begins.
     * Time is not taken from getHabit().
     * Time is taken directly from database.habits[type].
     * This prevents the accidental use of another common time.
     */

    function readDatabase() {
        const api = engine();

        /*
         * Current engine
         */

        if (api && typeof api.readDatabase === 'function') {
            const database = api.readDatabase();

            if (database) {
                return database;
            }
        }

        /*
         * Supporting the old engine
         */

        if (api && typeof api.read === 'function') {
            const database = api.read();
            if (database) {
                return database;
            }
        }

        /*
         * LocalStorage fallback
         */

        const storageKeys = [
            'taeafi_multi_habit_recovery',
            'taafi_recovery_data'
        ];

        for (
            const key of storageKeys
        ) {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) {
                    continue;
                }
                const parsed = JSON.parse(raw);

                /*
                 * Some older versions store:
                 * {
                 * value: {...}
                 * }
                 * And some store data directly.
                */

                return (parsed?.value ??
                    parsed);

            } catch (error) {
                console.warn(
                    `تعذر قراءة ${key}:`, error);
            }
        }

        return null;
    }

    function writeDatabase(database) {
        const api = engine();

        /*
         * Current engine
         */

        if (api && typeof api.writeDatabase === 'function') {
            return api.writeDatabase(database);
        }

        /**
         * Supporting the old engine
         */

        if (api && typeof api.write === 'function') {
            return api.write(database);
        }

        /*
         * LocalStorage fallback
         */

        try {
            localStorage.setItem(
                'taeafi_multi_habit_recovery',
                JSON.stringify({
                    value: database,
                    timestamp: Date.now()
                })
            );

            return true;
        } catch (error) {
            console.error('تعذر حفظ بيانات العادات:', error);
            return false;
        }
    }

    /*
     * GET DATABASE HABIT
     * This function is a key addition.
     * It does not rely on the engine cache.
     * It reads the habit directly from the database.
     */

    function getDatabaseHabit(type) {
        if (!type) {
            return null;
        }

        const database = readDatabase();

        if (!database || !database.habits || !database.habits[type]) {
            return null;
        }
        return database.habits[type];
    }

    /*
     * GET START TIMESTAMP
     */

    function getHabitStartTimestamp(type) {
        const habit = getDatabaseHabit(type);
        if (!habit) {
            return 0;
        }

        let timestamp = Number(habit.startTimestamp || 0);

        /*
         * Compatible with older data
         */

        if (!timestamp && habit.startDate) {
            const parsed = Date.parse(habit.startDate);
            if (Number.isFinite(parsed)) {
                timestamp = parsed;
            }
        }

        /*
         * Protection from incorrect timestamps
         */

        if (!Number.isFinite(timestamp) || timestamp <= 0) {
            return 0;
        }

        return timestamp;
    }

    /*
     * INDEPENDENT DURATION
     */

    function getDuration(type) {
        if (!type) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
        }

        // Read data directly from localStorage - don't rely on cache
        let database = null;
        try {
            const raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                const parsed = JSON.parse(raw);
                database = parsed?.value ?? parsed;
            }
        } catch (e) {
            console.warn('[getDuration] Failed to read localStorage:', e);
        }

        if (!database || !database.habits || !database.habits[type]) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
        }

        const habit = database.habits[type];
        
        // Read timestamps directly from this habit only
        let startTimestamp = Number(habit.startTimestamp || 0);
        
        // Compatible with older data
        if (!startTimestamp && habit.startDate) {
            const parsed = Date.parse(habit.startDate);
            if (Number.isFinite(parsed)) {
                startTimestamp = parsed;
            }
        }

        if (!startTimestamp || startTimestamp <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
        }

        const now = Date.now();
        const difference = Math.max(0, now - startTimestamp);
        const totalSeconds = Math.floor(difference / 1000);
        
        return {
            days: Math.floor(totalSeconds / 86400),
            hours: Math.floor((totalSeconds % 86400) / 3600),
            minutes: Math.floor((totalSeconds % 3600) / 60),
            seconds: totalSeconds % 60,
            totalSeconds: totalSeconds
        };
    }

    function pad(value) {
        return String(value)
            .padStart(2, '0');
    }

    /*
     * UPDATE HABIT TIMESTAMP
     */

    function updateHabitTimestamp(type, timestamp) {
        const database = readDatabase();
        if (!database || !database.habits || !database.habits[type]) {
            return false;
        }
        const habit = database.habits[type];

        /*
         * Just this habit.
         */

        habit.startTimestamp = timestamp;
        habit.startDate = new Date(timestamp).toISOString();
        habit.updatedAt = timestamp;

        /*
         * activeHabitId is just a display interface.
         * It does not change the times of other habits.
         */

        database.activeHabitId = type;
        database.updatedAt = timestamp;
        return writeDatabase(database);
    }

    /*
     * CLEAR RELAPSES
     */

    function clearHabitRelapses(type) {
        const database = readDatabase();

        if (!database || !database.habits || !database.habits[type]) {
            return false;
        }

        database.habits[type].relapses =[];
        database.habits[type].updatedAt = Date.now();
        database.activeHabitId = type;
        database.updatedAt = Date.now();
        return writeDatabase(database);
    }

    /*
     * START HABIT
     */

    function startHabit(type) {
        if (!type) {
            return false;
        }

        // Read data directly from localStorage
        let database = null;
        try {
            const raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                const parsed = JSON.parse(raw);
                database = parsed?.value ?? parsed;
            }
        } catch (e) {
            toast('تعذر الوصول إلى البيانات');
            return false;
        }

        if (!database || !database.habits || !database.habits[type]) {
            toast('العادة غير موجودة');
            return false;
        }

        const now = Date.now();
        const habit = database.habits[type];

        // Make sure this habit has its own dedicated time.
        // If it doesn't have a designated time, create a new one.

        if (!habit.startTimestamp || habit.startTimestamp === 0) {
            habit.startTimestamp = now;
            habit.startDate = new Date(now).toISOString();
            habit.relapses = [];
            habit.updatedAt = now;

            // Save changes directly to localStorage
            database.updatedAt = now;
            database.activeHabitId = type;

            try {
                localStorage.setItem('taeafi_multi_habit_recovery', JSON.stringify({
                    value: database,
                    timestamp: now
                }));
            } catch (e) {
                toast('تعذر حفظ البيانات');
                return false;
            }

            emitUpdate('habit-started');
            toast(`بدأت رحلة ${getName(type)}`);
            refresh();
            return true;
        }

        toast(`رحلة ${getName(type)} بدأت مسبقاً`);
        return true;
    }

    /**
     * RESTART HABIT
     * Restart = a new time for this habit only.
     * (00:00:00)
     */

    function restartHabit(type) {
        if (!type) {
            return false;
        }

        // Read the data directly
        let database = null;
        try {
            const raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                const parsed = JSON.parse(raw);
                database = parsed?.value ?? parsed;
            }
        } catch (e) {
            toast('تعذر الوصول إلى البيانات');
            return false;
        }

        if (!database || !database.habits || !database.habits[type]) {
            toast('العادة غير موجودة');
            return false;
        }

        const name = getName(type);
        if (!confirmAction(`هل تريد إعادة بداية "${name}"؟\n\nسيتم تصفير عداد هذه العادة والانتكاسات الخاصة بها فقط.`)) {
            return false;
        }

        const now = Date.now();
        const habit = database.habits[type];

        // Update time of this habit only
        habit.startTimestamp = now;
        habit.startDate = new Date(now).toISOString();
        habit.relapses = [];
        habit.updatedAt = now;
        database.activeHabitId = type;
        database.updatedAt = now;

        // Save directly to localStorage
        try {
            localStorage.setItem('taeafi_multi_habit_recovery', JSON.stringify({
                value: database,
                timestamp: now
            }));
        } catch (e) {
            toast('تعذر حفظ إعادة البداية');
            return false;
        }

        emitUpdate('habit-reset');
        toast(`تمت إعادة بداية ${name}`);
        refresh();
        return true;
    }

    /*
     * RECORD RELAPSE
     */

    function recordRelapse(type) {
        if (!type) {
            return false;
        }

        // Read the data directly
        let database = null;
        try {
            const raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                const parsed = JSON.parse(raw);
                database = parsed?.value ?? parsed;
            }
        } catch (e) {
            toast('تعذر الوصول إلى البيانات');
            return false;
        }

        if (!database || !database.habits || !database.habits[type]) {
            toast('العادة غير موجودة');
            return false;
        }

        const name = getName(type);
        if (!confirmAction(`هل تريد تسجيل انتكاسة في "${name}"؟`)) {
            return false;
        }

        const now = Date.now();
        const habit = database.habits[type];

        if (!Array.isArray(habit.relapses)) {
            habit.relapses = [];
        }

        // Recording a relapse of this habit only
        habit.relapses.push({
            date: new Date(now).toISOString().slice(0, 10),
            timestamp: now
        });

        habit.updatedAt = now;
        database.activeHabitId = type;
        database.updatedAt = now;

        try {
            localStorage.setItem('taeafi_multi_habit_recovery', JSON.stringify({
                value: database,
                timestamp: now
            }));
        } catch (e) {
            toast('تعذر حفظ الانتكاسة');
            return false;
        }

        emitUpdate('relapse');
        toast(`تم تسجيل انتكاسة في ${name}`);
        refresh();
        return true;
    }

    /**
     * DELETE HABIT
     * The deletion here is actual from database.habits.
     */

    function deleteHabit(type) {
        if (!type) {
            return false;
        }

        let database = null;
        try {
            const raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                const parsed = JSON.parse(raw);
                database = parsed?.value ?? parsed;
            }
        } catch (e) {
            toast('تعذر الوصول إلى البيانات');
            return false;
        }

        if (!database || !database.habits || !database.habits[type]) {
            toast('العادة غير موجودة');
            return false;
        }

        const name = getName(type);
        if (!confirmAction(`حذف "${name}"؟\n\nسيتم حذف جميع بيانات هذه العادة فقط.`)) {
            return false;
        }

        // Just eliminate this habit
        delete database.habits[type];

        // If the deleted habit is the active one, choose another habit.
        if (database.activeHabitId === type) {
            const remaining = Object.keys(database.habits);
            database.activeHabitId = remaining.length ? remaining[0] : null;
        }

        database.updatedAt = Date.now();

        try {
            localStorage.setItem('taeafi_multi_habit_recovery', JSON.stringify({
                value: database,
                timestamp: Date.now()
            }));

        } catch (e) {
            toast('تعذر حذف العادة');
            return false;
        }

        emitUpdate('habit-removed');
        toast(`تم حذف ${name} وبياناتها`);
        refresh();
        return true;
    }

    /**
     * CACHE INVALIDATION
     * This is an additional layer of protection.
     * If the engine retains an old copy
     * of the deleted habit, we try to force it
     * to reread.
     */

    function invalidateEngineCache(type) {
        const api = engine();
        if (!api) {
            return;
        }

        try {
            if (typeof api.refresh === 'function') {
                api.refresh();
            }

            if (typeof api.reload === 'function') {
                api.reload();
            }

            if (typeof api.invalidateCache ==='function') {
                api.invalidateCache(type);
            }

            if (typeof api.clearCache === 'function') {
                api.clearCache();
            }

        } catch (error) {
            console.warn('تعذر تحديث cache المحرك:', error);
        }
    }

    /*
     * SELECT HABIT
     */

    function selectAndRefresh(type) {
        if (!type) {
            return false;
        }

        /*
         * Verify that the habit exists
         * in the database.
         */

        if (!getDatabaseHabit(type)) {
            toast('العادة غير موجودة');
            return false;
        }
        const result = selectHabit(type);

        /*
         * Important:
         * The selection does not change the timestamp.
         */

        if (result && (result.success === true || result === true)) {
            toast(`تم اختيار ${getName(type)}`);
            refresh();
            return true;
        }

        /*
         * Some engines may revert to undefined
         * despite successfully changing activeHabitId.
         */

        const active = getActiveHabitId();
        if (active === type) {
            refresh();
            return true;
        }
        return false;
    }

    /*
     * STATS
     */

    function getIndependentStats(type) {
        const habit = getDatabaseHabit(type);
        if (!habit) {
            return {
                relapseCount: 0
            };
        }

        const relapses = Array.isArray(habit.relapses)
                ? habit.relapses
                : [];

        return {
            relapseCount: relapses.length
        };
    }

    /*
     * EVENTS
     */

    function emitUpdate(reason) {
        try {
            window.dispatchEvent(new CustomEvent('recoveryUpdated',
                    {
                        detail: {
                            reason,
                            activeHabitId: getActiveHabitId(),
                            timestamp: Date.now()
                        }
                    }
                )
            );

        } catch (error) {
            try {
                window.dispatchEvent(new Event('recoveryUpdated'));
            } catch (_) {}
        }
    }

    /*
     * RENDER HABIT CARD
     */

    function renderHabitCard(habit) {
        const type = habit.habitType || habit.id;
        if (!type) return '';

        // Read the data directly
        let database = null;
        try {
            const raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                const parsed = JSON.parse(raw);
                database = parsed?.value ?? parsed;
            }
        } catch (e) {
            return '';
        }

        const databaseHabit = database?.habits?.[type];
        if (!databaseHabit) return '';

        const name = getName(type);
        const icon = getIcon(type);
        const active = type === getActiveHabitId();

        // Just calculate the time spent on this habit.
        let startTimestamp = Number(databaseHabit.startTimestamp || 0);
        if (!startTimestamp && databaseHabit.startDate) {
            const parsed = Date.parse(databaseHabit.startDate);
            if (Number.isFinite(parsed)) startTimestamp = parsed;
        }

        let days = 0, hours = 0, minutes = 0, seconds = 0;
        if (startTimestamp && startTimestamp > 0) {
            const diff = Math.max(0, Date.now() - startTimestamp);
            const totalSec = Math.floor(diff / 1000);
            days = Math.floor(totalSec / 86400);
            hours = Math.floor((totalSec % 86400) / 3600);
            minutes = Math.floor((totalSec % 3600) / 60);
            seconds = totalSec % 60;
        }

        const relapses = Array.isArray(databaseHabit.relapses) ? databaseHabit.relapses : [];
        const hasStarted = startTimestamp > 0;

        // Use the calculated figures directly
        return `
            <article class="taeafi-independent-habit-card ${active ? 'is-active' : ''}" data-habit-card="${type}">
                <div class="taeafi-independent-header">
                    <div class="taeafi-independent-title">
                        <div class="taeafi-independent-icon">
                            <i class="fas ${icon}"></i>
                        </div>
                        <div>
                            <span>رحلة التعافي</span>
                            <h3>${name}</h3>
                        </div>
                    </div>
                    <span class="taeafi-independent-badge">${active ? 'الحالية' : 'مستقلة'}</span>
                </div>

                <div class="taeafi-independent-timer">
                    <div class="taeafi-independent-unit">
                        <strong data-timer="days">${days}</strong>
                        <span>يوم</span>
                    </div>
                    <div class="taeafi-independent-separator">:</div>
                    <div class="taeafi-independent-unit">
                        <strong data-timer="hours">${String(hours).padStart(2, '0')}</strong>
                        <span>ساعة</span>
                    </div>
                    <div class="taeafi-independent-separator">:</div>
                    <div class="taeafi-independent-unit">
                        <strong data-timer="minutes">${String(minutes).padStart(2, '0')}</strong>
                        <span>دقيقة</span>
                    </div>
                    <div class="taeafi-independent-separator">:</div>
                    <div class="taeafi-independent-unit">
                        <strong data-timer="seconds">${String(seconds).padStart(2, '0')}</strong>
                        <span>ثانية</span>
                    </div>
                </div>

                <div class="taeafi-independent-stats">
                    <div>
                        <i class="fas fa-history"></i>
                        <span>الانتكاسات</span>
                        <strong data-role="relapse-count">${relapses.length}</strong>
                    </div>
                </div>

                <div class="taeafi-independent-actions">
                    ${!hasStarted ? `
                        <button type="button" data-control-action="start" data-habit="${type}">
                            <i class="fas fa-play"></i> بدء الرحلة
                        </button>
                    ` : ''}
                    ${!active ? `
                        <button type="button" data-control-action="select" data-habit="${type}">
                            <i class="fas fa-exchange-alt"></i> اختيار
                        </button>
                    ` : ''}
                    <button type="button" data-control-action="relapse" data-habit="${type}">
                        <i class="fas fa-exclamation-circle"></i> تسجيل انتكاسة
                    </button>
                    <button type="button" data-control-action="restart" data-habit="${type}">
                        <i class="fas fa-redo"></i> إعادة البداية
                    </button>
                    <button type="button" class="danger" data-control-action="delete" data-habit="${type}">
                        <i class="fas fa-trash-alt"></i> حذف البيانات
                    </button>
                </div>
            </article>
        `;
    }

    /*
     * RENDER ALL HABITS
     */

    function renderControls() {
        const main = document.getElementById('main-content');
        if (!main) {
            return;
        }

        let habits = getHabits();

        /*
         * Displaying more than 4 is prohibited.
         */

        habits = habits.slice(0, MAX_HABITS); // (Max habits 4 )
        let panel =document.getElementById(PANEL_ID);

        if (!panel) {
            panel = document.createElement('section');
            panel.id = PANEL_ID;
            panel.className = 'taeafi-habit-controls';
        }

        panel.innerHTML = `
            <div class="taeafi-independent-panel-header">
                <div>
                    <span>
                        <i class="fas fa-layer-group"></i>
                        إدارة رحلات التعافي
                    </span>
                    <h2>
                        عاداتك المستقلة
                    </h2>
                    <p>
                        كل عادة تملك عداداً وانتكاسات وإعادة بداية وحذفاً مستقلاً.
                    </p>
                </div>
                <strong>
                    ${habits.length}/${MAX_HABITS}
                </strong>
            </div>
            <div class="taeafi-independent-list">
                ${
                    habits.length
                        ? habits
                            .map(
                                renderHabitCard
                            )
                            .join('')
                        : `
                            <div class="taeafi-independent-empty">
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
            const first = main.firstElementChild;
            if (first) {
                main.insertBefore(panel, first);
            } else {
                main.appendChild(panel);
            }
        }
        installEvents(panel);
        updateAllTimers();
        return panel;
    }

    /*
     * UPDATE ALL TIMERS
     * Each card uses data-habit-card
     * Her own.
     */

    let timerId = null;
    function updateAllTimers() {
        const panel = document.getElementById(PANEL_ID);
        if (!panel) return;

        // Read the data directly only once.
        let database = null;
        try {
            const raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                const parsed = JSON.parse(raw);
                database = parsed?.value ?? parsed;
            }
        } catch (e) {
            console.warn('[updateAllTimers] Failed to read localStorage:', e);
            return;
        }

        if (!database || !database.habits) return;
        panel.querySelectorAll('[data-habit-card]').forEach(card => {
            const type = card.dataset.habitCard;
            if (!type) return;
            const habit = database.habits[type];
            if (!habit) {
                card.remove();
                return;
            }

            // Read the data directly only once.
            let startTimestamp = Number(habit.startTimestamp || 0);
            if (!startTimestamp && habit.startDate) {
                const parsed = Date.parse(habit.startDate);
                if (Number.isFinite(parsed)) startTimestamp = parsed;
            }

            let days = 0, hours = 0, minutes = 0, seconds = 0;
            if (startTimestamp && startTimestamp > 0) {
                const diff = Math.max(0, Date.now() - startTimestamp);
                const totalSec = Math.floor(diff / 1000);
                days = Math.floor(totalSec / 86400);
                hours = Math.floor((totalSec % 86400) / 3600);
                minutes = Math.floor((totalSec % 3600) / 60);
                seconds = totalSec % 60;
            }

            // Update items
            const daysEl = card.querySelector('[data-timer="days"]');
            if (daysEl) daysEl.textContent = String(days);
            const hoursEl = card.querySelector('[data-timer="hours"]');

            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            const minutesEl = card.querySelector('[data-timer="minutes"]');

            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            const secondsEl = card.querySelector('[data-timer="seconds"]');

            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
            const relapseCount = card.querySelector('[data-role="relapse-count"]'); // Update number of relapses

            if (relapseCount) {
                const relapses = Array.isArray(habit.relapses) ? habit.relapses : [];
                relapseCount.textContent = String(relapses.length);
            }
        });
    }

    function startTimer() {
        if (timerId !== null) {
            clearInterval(timerId);
        }
        updateAllTimers();
        timerId = window.setInterval(updateAllTimers, 1000);
    }

    function stopTimer() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    /*
     * EVENTS
     */

    function installEvents(panel) {
        if (!panel) {
            return;
        }

        /*
         * We do not add a second listener.
         */

        if (panel.dataset.eventsInstalled === 'true') {
            return;
        }

        panel.dataset.eventsInstalled = 'true';
        panel.addEventListener('click', function (event) {
                const button = event.target.closest('[data-control-action]');
                if (!button) {
                    return;
                }

                const action = button.dataset.controlAction;
                const type =button.dataset.habit;

                if (!type) {
                    return;
                }

                if (action === 'start') {
                    startHabit(type);
                    return;
                }

                if (action === 'select') {
                    selectAndRefresh(type);
                    return;
                }

                if (action === 'relapse') {
                    recordRelapse(type);
                    return;
                }

                if (action === 'restart') {
                    restartHabit(type);
                    return;
                }

                if (action === 'delete') {
                    deleteHabit(type);
                }
            }
        );
    }

    /*
     * REFRESH
     */

    function refresh() {
        const currentPage = typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function'
                ? Router.getCurrentPage()
                : null;

        if (currentPage !== 'recovery') {
            stopTimer();
            return;
        }
        renderControls();
        startTimer();
    }

    /*
     * RECOVERY PAGE HOOK
     */

    function installRecoveryHook() {
        if (window.__taeafiHabitControlsHook) {
            return;
        }

        if (typeof window.renderRecoveryPage === 'function') {
            const original = window.renderRecoveryPage;
            window.renderRecoveryPage = function () {
                    original.apply(this, arguments);
                    requestAnimationFrame(function () {
                            renderControls();
                            startTimer();
                        }
                    );
                };
            window.__taeafiHabitControlsHook = true;
        }
    }

    /*
     * RECOVERY UPDATE LISTENER
     */

    if (!window.__taeafiHabitControlsListener) {
        window.__taeafiHabitControlsListener = true;
        window.addEventListener('recoveryUpdated', function () {
                requestAnimationFrame(function () {
                        renderControls();
                        startTimer();
                    }
                );
            }
        );
    }

    /*
     * STYLES
     */

    function installStyles() {
        if (document.getElementById(STYLE_ID)) {
            return;
        }

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            #${PANEL_ID} {
                margin: 18px 0;
                padding: 18px;
                border-radius: 20px;
                background: var(--surface, #ffffff);
                border: 1px solid var(--border-color, #e1e5e8);
                box-shadow: 0 8px 28px rgba(0,0,0,.06);
                direction: rtl;
            }

            #${PANEL_ID} .taeafi-independent-panel-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 15px;
                margin-bottom: 18px;
            }

            #${PANEL_ID} .taeafi-independent-panel-header span {
                display: block;
                color: var(--text-secondary, #70757a);
                font-size: 12px;
                margin-bottom: 5px;
            }

            #${PANEL_ID} .taeafi-independent-panel-header h2 {
                margin: 0 0 5px;
                color: var(--text-primary, #1a1c1e);
                font-size: 20px;
            }

            #${PANEL_ID} .taeafi-independent-panel-header p {
                margin: 0;
                color: var(--text-secondary, #70757a);
                font-size: 12px;
                line-height: 1.7;
            }

            #${PANEL_ID} .taeafi-independent-panel-header > strong {
                padding: 7px 11px;
                border-radius: 999px;
                background: var(--surface-variant, #eefaf8);
                color: var(--primary-color, #008f83);
                white-space: nowrap;
            }

            #${PANEL_ID} .taeafi-independent-list {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 14px;
            }

            #${PANEL_ID} .taeafi-independent-habit-card {
                padding: 16px;
                border: 1px solid var(--border-color, #e1e5e8);
                border-radius: 18px;
                background: var(--surface, #ffffff);
                transition:
                    border-color 150ms ease,
                    transform 150ms ease,
                    box-shadow 150ms ease;
            }

            #${PANEL_ID} .taeafi-independent-habit-card:hover {
                transform: translateY(-1px);
                box-shadow: 0 8px 24px rgba(0,0,0,.06);
            }

            #${PANEL_ID} .taeafi-independent-habit-card.is-active {
                border-color: var(--primary-color, #00a896);
                background: var(--surface-variant, #eefaf8);
            }

            #${PANEL_ID} .taeafi-independent-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 14px;
            }

            #${PANEL_ID} .taeafi-independent-title {
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 0;
            }

            #${PANEL_ID} .taeafi-independent-icon {
                width: 44px;
                height: 44px;
                min-width: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 13px;
                background: var(--primary-color, #00a896);
                color: #fff;
                font-size: 18px;
            }

            #${PANEL_ID} .taeafi-independent-title span {
                display: block;
                color: var(--text-secondary, #70757a);
                font-size: 11px;
                margin-bottom: 2px;
            }

            #${PANEL_ID} .taeafi-independent-title h3 {
                margin: 0;
                color: var(--text-primary, #1a1c1e);
                font-size: 17px;
            }

            #${PANEL_ID} .taeafi-independent-badge {
                padding: 5px 8px;
                border-radius: 999px;
                background: var(--surface-variant, #eefaf8);
                color: var(--primary-color, #008f83);
                font-size: 10px;
                font-weight: 700;
                white-space: nowrap;
            }

            #${PANEL_ID} .taeafi-independent-timer {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                padding: 14px 7px;
                border-radius: 15px;
                background: var(--surface-variant, #f5f7f8);
                direction: ltr;
            }

            #${PANEL_ID} .taeafi-independent-unit {
                min-width: 50px;
                text-align: center;
            }

            #${PANEL_ID} .taeafi-independent-unit strong {
                display: block;
                font-size: 22px;
                line-height: 1.1;
                color: var(--text-primary, #1a1c1e);
                font-variant-numeric: tabular-nums;
            }

            #${PANEL_ID} .taeafi-independent-unit span {
                display: block;
                margin-top: 4px;
                color: var(--text-secondary, #70757a);
                font-size: 9px;
                direction: rtl;
            }

            #${PANEL_ID} .taeafi-independent-separator {
                color: var(--primary-color, #00a896);
                font-size: 20px;
                font-weight: 700;
                margin-top: -12px;
            }

            #${PANEL_ID} .taeafi-independent-stats {
                margin-top: 10px;
            }

            #${PANEL_ID} .taeafi-independent-stats > div {
                display: flex;
                align-items: center;
                gap: 7px;
                padding: 10px 12px;
                border-radius: 12px;
                background: var(--surface-variant, #f7f8f9);
                color: var(--text-secondary, #70757a);
                font-size: 12px;
            }

            #${PANEL_ID} .taeafi-independent-stats i {
                color: var(--primary-color, #00a896);
            }

            #${PANEL_ID} .taeafi-independent-stats strong {
                margin-right: auto;
                color: var(--text-primary, #1a1c1e);
                font-size: 15px;
            }

            #${PANEL_ID} .taeafi-independent-actions {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 8px;
                margin-top: 10px;
            }

            #${PANEL_ID} .taeafi-independent-actions button {
                min-height: 42px;
                padding: 8px 9px;
                border: 1px solid var(--border-color, #dfe3e6);
                border-radius: 11px;
                background: var(--surface, #ffffff);
                color: var(--text-primary, #1a1c1e);
                cursor: pointer;
                font: inherit;
                font-size: 11px;
                transition:
                    transform 140ms ease,
                    background 140ms ease;
            }

            #${PANEL_ID} .taeafi-independent-actions button:hover {
                background: var(--surface-variant, #f2f4f5);
                transform: translateY(-1px);
            }

            #${PANEL_ID} .taeafi-independent-actions button:active {
                transform: translateY(0);
            }

            #${PANEL_ID} .taeafi-independent-actions button i {
                margin-left: 4px;
            }

            #${PANEL_ID} .taeafi-independent-actions button.danger {
                color: #c62828;
                border-color: rgba(198,40,40,.25);
            }

            #${PANEL_ID} .taeafi-independent-empty {
                grid-column: 1 / -1;
                padding: 30px;
                text-align: center;
                color: var(--text-secondary, #70757a);
            }

            #${PANEL_ID} .taeafi-independent-empty i {
                display: block;
                margin-bottom: 8px;
                font-size: 30px;
            }

            @media (max-width: 760px) {

                #${PANEL_ID} .taeafi-independent-list {
                    grid-template-columns: 1fr;
                }
            }

            @media (max-width: 420px) {

                #${PANEL_ID} .taeafi-independent-timer {
                    gap: 2px;
                }

                #${PANEL_ID} .taeafi-independent-unit {
                    min-width: 42px;
                }

                #${PANEL_ID} .taeafi-independent-unit strong {
                    font-size: 19px;
                }

                #${PANEL_ID} .taeafi-independent-actions {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /*
     * INITIALIZATION
     */

    function initialize() {
        installStyles();
        installRecoveryHook();
        const currentPage = typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function'
                ? Router.getCurrentPage()
                : null;

        if (currentPage === 'recovery') {
            renderControls();
            startTimer();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize,
            {
                once: true
            }
        );

    } else {

        initialize();
    }

    /*
     * PUBLIC API
     */

    window.TaeafiHabitControls = {
        restartHabit,
        recordRelapse,
        deleteHabit,
        startHabit,
        selectAndRefresh,
        getDuration,
        getHabitStartTimestamp,
        getDatabaseHabit,
        renderControls,
        updateAllTimers,
        refresh
    };

})();