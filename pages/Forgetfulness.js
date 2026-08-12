/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : Forgetfulness.js
 * Type   : JavaScript
 */

(function () {
    'use strict';

    /**  
     * Daily prayer data
     */

    const PRAYER_DATA = {
        fajr: {
            name: 'صلاة الصبح / الفجر',
            shortName: 'الفجر',
            rakahs: 2
        },
        dhuhr: {
            name: 'صلاة الظهر',
            shortName: 'الظهر',
            rakahs: 4
        },
        asr: {
            name: 'صلاة العصر',
            shortName: 'العصر',
            rakahs: 4
        },
        maghrib: {
            name: 'صلاة المغرب',
            shortName: 'المغرب',
            rakahs: 3
        },
        isha: {
            name: 'صلاة العشاء',
            shortName: 'العشاء',
            rakahs: 4
        }
    };

    /** 
     * Current session status
     */

    let forgetfulnessState = null;
    let wakeLock = null;
    let lastTapTime = 0;

    const PHASES = {
        RUKU: 'ruku',
        SUJOOD_ONE: 'suhood-one',
        SUJOOD_TWO: 'suhood-two'
    };

    /* 
      General tools
    */

    function getMainContent() {
        return document.getElementById('main-content');
    }

    function showForgetfulnessToast(message) {
        if (typeof showToast === 'function') {
            showToast(message);
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /* 
      Prayer selection screen
    */

    function renderPrayerSelection() {
        const mainContent = getMainContent();
        if (!mainContent) return;

        forgetfulnessState = null;
        releaseWakeLock();

        mainContent.innerHTML = `
            <div class="forgetfulness-page animate-fade-in">
                <div class="forgetfulness-header">
                    <div class="forgetfulness-icon">
                        <i class="fas fa-person-praying"></i>
                    </div>
                    <h1 class="heading-underline">مساعد الصلاة</h1>
                    <p class="forgetfulness-subtitle">
                        سجّل الركوع والسجدات أثناء الصلاة لتعرف أين وصلت.
                    </p>
                </div>

                <div class="forgetfulness-info-card">
                    <i class="fas fa-circle-info"></i>
                    <span>
                        ضع الهاتف أمامك في مكان مناسب، ثم اضغط على الزر الكبير
                        عند الوصول إلى كل مرحلة.
                    </span>
                </div>

                <div class="forgetfulness-section-title">
                    <span>اختر الصلاة</span>
                </div>

                <div class="forgetfulness-prayer-list">
                    ${Object.entries(PRAYER_DATA).map(([key, prayer]) => `
                        <button
                            type="button"
                            class="forgetfulness-prayer-card"
                            onclick="startForgetfulnessPrayer('${key}')"
                        >
                            <span class="forgetfulness-prayer-card-icon">
                                <i class="fas fa-mosque"></i>
                            </span>
                            <span class="forgetfulness-prayer-card-text">
                                <strong>${escapeHtml(prayer.name)}</strong>
                                <small>${prayer.rakahs} ${prayer.rakahs === 2 ? 'ركعتان' : 'ركعات'}</small>
                            </span>
                            <i class="fas fa-chevron-left forgetfulness-arrow"></i>
                        </button>
                    `).join('')}
                </div>

                <div class="forgetfulness-note">
                    <i class="fas fa-shield-halved"></i>
                    <span>
                        هذه الميزة للتسجيل والتذكير فقط، ولا تستبدل الحكم الشرعي أو فتوى المرجع.
                    </span>
                </div>
            </div>
        `;
    }

    /* 
      Beginning of the prayer session
    */

    function startForgetfulnessPrayer(prayerKey) {
        const prayer = PRAYER_DATA[prayerKey];
        if (!prayer) return;

        forgetfulnessState = {
            prayerKey: prayerKey,
            prayerName: prayer.name,
            totalRakahs: prayer.rakahs,
            currentRakah: 1,
            phase: PHASES.RUKU,
            startedAt: Date.now(),
            completedActions: [],
            history: []
        };

        requestWakeLock();
        renderForgetfulnessSession();
    }

    /* 
      Current prayer screen
    */

    function renderForgetfulnessSession() {
        const mainContent = getMainContent();
        const state = forgetfulnessState;

        if (!mainContent || !state) return;

        const phaseInfo = getPhaseInfo(state.phase);
        const progress = getProgressPercent();

        mainContent.innerHTML = `
            <div class="forgetfulness-page forgetfulness-session animate-fade-in">
                <div class="forgetfulness-session-top">
                    <button
                        type="button"
                        class="forgetfulness-small-button"
                        onclick="confirmExitForgetfulness()"
                    >
                        <i class="fas fa-xmark"></i>
                        إنهاء
                    </button>

                    <div class="forgetfulness-prayer-name">
                        ${escapeHtml(state.prayerName)}
                    </div>

                    <div class="forgetfulness-rakah-counter">
                        الركعة ${state.currentRakah} من ${state.totalRakahs}
                    </div>
                </div>

                <div class="forgetfulness-progress">
                    <div class="forgetfulness-progress-track">
                        <div
                            class="forgetfulness-progress-fill"
                            style="width: ${progress}%"
                        ></div>
                    </div>
                </div>

                <div class="forgetfulness-current-card">
                    <div class="forgetfulness-current-rakah">
                        الركعة ${state.currentRakah}
                    </div>

                    <div class="forgetfulness-phase-icon">
                        <i class="fas ${phaseInfo.icon}"></i>
                    </div>

                    <div class="forgetfulness-phase-label">
                        ${phaseInfo.title}
                    </div>

                    <div class="forgetfulness-phase-description">
                        ${phaseInfo.description}
                    </div>

                    <button
                        type="button"
                        class="forgetfulness-record-button"
                        id="forgetfulness-record-button"
                        onclick="recordForgetfulnessPhase()"
                    >
                        <span class="forgetfulness-record-icon">
                            <i class="fas fa-check"></i>
                        </span>
                        <span>${phaseInfo.buttonText}</span>
                    </button>

                    <div class="forgetfulness-tap-hint">
                        اضغط مرة واحدة فقط عند الوصول إلى هذه المرحلة
                    </div>
                </div>

                <div class="forgetfulness-checklist-card">
                    <div class="forgetfulness-checklist-title">
                        <span>سجل الركعة</span>
                        <span>${getRakahCompletedCount()}/3 مراحل</span>
                    </div>

                    <div class="forgetfulness-checklist">
                        ${renderChecklistItem(
                            'الركوع',
                            state.completedActions.includes('ruku'),
                            'fa-person-praying'
                        )}
                        ${renderChecklistItem(
                            'السجدة الأولى',
                            state.completedActions.includes('suhood-one'),
                            'fa-person'
                        )}
                        ${renderChecklistItem(
                            'السجدة الثانية',
                            state.completedActions.includes('suhood-two'),
                            'fa-person'
                        )}
                    </div>
                </div>

                <div class="forgetfulness-session-actions">
                    <button
                        type="button"
                        class="forgetfulness-undo-button"
                        onclick="undoForgetfulnessPhase()"
                        ${state.history.length === 0 ? 'disabled' : ''}
                    >
                        <i class="fas fa-rotate-right"></i>
                        تراجع عن آخر تسجيل
                    </button>
                </div>
            </div>
        `;
    }

    function getPhaseInfo(phase) {
        const info = {
            [PHASES.RUKU]: {
                title: 'الركوع',
                description: 'عند وصولك إلى الركوع، اضغط زر التسجيل مرة واحدة.',
                buttonText: 'تسجيل الركوع',
                icon: 'fa-person-praying'
            },
            [PHASES.SUJOOD_ONE]: {
                title: 'السجدة الأولى',
                description: 'عند الوصول إلى السجدة الأولى، اضغط زر التسجيل.',
                buttonText: 'تسجيل السجدة الأولى',
                icon: 'fa-person'
            },
            [PHASES.SUJOOD_TWO]: {
                title: 'السجدة الثانية',
                description: 'عند الوصول إلى السجدة الثانية، اضغط زر التسجيل.',
                buttonText: 'تسجيل السجدة الثانية',
                icon: 'fa-person'
            }
        };

        return info[phase] || info[PHASES.RUKU];
    }

    function renderChecklistItem(label, completed, icon) {
        return `
            <div class="forgetfulness-check-item ${completed ? 'completed' : ''}">
                <span class="forgetfulness-check-icon">
                    <i class="fas ${completed ? 'fa-check' : icon}"></i>
                </span>
                <span>${label}</span>
                <span class="forgetfulness-check-status">
                    ${completed ? 'تم التسجيل' : 'بانتظار التسجيل'}
                </span>
            </div>
        `;
    }

    /* 
      Current stage registration
    */

    function recordForgetfulnessPhase() {
        if (!forgetfulnessState) return;

        // Protection from double pressure or repeated touching.
        const now = Date.now();
        if (now - lastTapTime < 450) return;
        lastTapTime = now;

        const state = forgetfulnessState;
        const currentPhase = state.phase;

        // Save the current state to revert.
        state.history.push({
            currentRakah: state.currentRakah,
            phase: state.phase,
            completedActions: [...state.completedActions]
        });

        state.completedActions.push(currentPhase);

        if (currentPhase === PHASES.RUKU) {
            state.phase = PHASES.SUJOOD_ONE;
            renderForgetfulnessSession();
            return;
        }

        if (currentPhase === PHASES.SUJOOD_ONE) {
            state.phase = PHASES.SUJOOD_TWO;
            renderForgetfulnessSession();
            return;
        }

        // The two prostrations were completed.
        if (state.currentRakah < state.totalRakahs) {
            state.currentRakah += 1;
            state.phase = PHASES.RUKU;
            state.completedActions = [];
            renderForgetfulnessSession();
            return;
        }

        // All the rak'ahs have been completed.
        completeForgetfulnessPrayer();
    }

    /* 
      Revert to last recorded
    */

    function undoForgetfulnessPhase() {
        if (!forgetfulnessState || forgetfulnessState.history.length === 0) {
            return;
        }

        const previous = forgetfulnessState.history.pop();

        forgetfulnessState.currentRakah = previous.currentRakah;
        forgetfulnessState.phase = previous.phase;
        forgetfulnessState.completedActions = [...previous.completedActions];

        renderForgetfulnessSession();
    }

    /* 
      End of prayer
    */

    function completeForgetfulnessPrayer() {
        if (!forgetfulnessState) return;

        const completedPrayer = {
            prayerName: forgetfulnessState.prayerName,
            totalRakahs: forgetfulnessState.totalRakahs,
            startedAt: forgetfulnessState.startedAt,
            completedAt: Date.now()
        };

        releaseWakeLock();
        renderForgetfulnessComplete(completedPrayer);
    }

    function renderForgetfulnessComplete(result) {
        const mainContent = getMainContent();
        if (!mainContent) return;

        const durationMinutes = Math.max(
            1,
            Math.round((result.completedAt - result.startedAt) / 60000)
        );

        mainContent.innerHTML = `
            <div class="forgetfulness-page forgetfulness-complete animate-fade-in">
                <div class="forgetfulness-complete-icon">
                    <i class="fas fa-check"></i>
                </div>

                <h1>تم تسجيل الصلاة</h1>

                <p class="forgetfulness-complete-subtitle">
                    ${escapeHtml(result.prayerName)}
                </p>

                <div class="forgetfulness-summary-card">
                    <div class="forgetfulness-summary-row">
                        <span>عدد الركعات</span>
                        <strong>${result.totalRakahs}</strong>
                    </div>
                    <div class="forgetfulness-summary-row">
                        <span>مدة الجلسة التقريبية</span>
                        <strong>${durationMinutes} دقيقة</strong>
                    </div>
                    <div class="forgetfulness-summary-row">
                        <span>حالة التسجيل</span>
                        <strong>مكتمل</strong>
                    </div>
                </div>

                <div class="forgetfulness-complete-note">
                    <i class="fas fa-circle-info"></i>
                    <span>
                        تم استخدام التسجيل لمتابعة مراحل الصلاة فقط، ولا يتم إصدار حكم شرعي من التطبيق.
                    </span>
                </div>

                <div class="forgetfulness-complete-actions">
                    <button
                        type="button"
                        class="btn btn-primary w-full"
                        onclick="renderForgetfulnessPage()"
                    >
                        <i class="fas fa-rotate"></i>
                        صلاة جديدة
                    </button>

                    <button
                        type="button"
                        class="btn btn-outline w-full"
                        onclick="navigateTo('home')"
                    >
                        <i class="fas fa-house"></i>
                        العودة للرئيسية
                    </button>
                </div>
            </div>
        `;

        forgetfulnessState = null;
    }

    /* 
      Progress Calculator
    */

    function getRakahCompletedCount() {
        if (!forgetfulnessState) return 0;
        return forgetfulnessState.completedActions.length;
    }

    function getProgressPercent() {
        if (!forgetfulnessState) return 0;

        const totalSteps = forgetfulnessState.totalRakahs * 3;
        const completedBefore =
            ((forgetfulnessState.currentRakah - 1) * 3) +
            forgetfulnessState.completedActions.length;

        return Math.min(100, Math.round((completedBefore / totalSteps) * 100));
    }

    /* 
      End session manually
    */

    function confirmExitForgetfulness() {
        if (!forgetfulnessState) {
            renderForgetfulnessPage();
            return;
        }

        const confirmed = window.confirm(
            'هل تريد إنهاء جلسة التسجيل الحالية؟\n\nسيتم فقدان التقدم الحالي.'
        );

        if (!confirmed) return;

        releaseWakeLock();
        forgetfulnessState = null;
        renderForgetfulnessPage();
    }

    /* 
      Keep the screen on - if (WebView) supports it
    */

    async function requestWakeLock() {
        if (!('wakeLock' in navigator)) return;

        try {
            wakeLock = await navigator.wakeLock.request('screen');

            wakeLock.addEventListener('release', function () {
                wakeLock = null;
            });
        } catch (error) {
            // The feature is optional; not supporting it does not prevent the application from working.
            console.warn('Screen wake lock unavailable:', error);
        }
    }

    async function releaseWakeLock() {
        if (!wakeLock) return;

        try {
            await wakeLock.release();
        } catch (error) {
            console.warn('Wake lock release failed:', error);
        }

        wakeLock = null;
    }

    /* 
      Feature Homepage
    */

    function renderForgetfulnessPage() {
        renderPrayerSelection();
    }

    /* 
      Export functions for use from HTML/Router
    */

    window.renderForgetfulnessPage = renderForgetfulnessPage;
    window.startForgetfulnessPrayer = startForgetfulnessPrayer;
    window.recordForgetfulnessPhase = recordForgetfulnessPhase;
    window.undoForgetfulnessPhase = undoForgetfulnessPhase;
    window.confirmExitForgetfulness = confirmExitForgetfulness;

})();
