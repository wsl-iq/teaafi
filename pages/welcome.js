/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : welcome.js
 * Type   : JavaScript
 */
/**
 * Registration & Onboarding — v2.0.0
 * 
 * Multi-step onboarding with:
 * - Initial welcome screen
 * - Name (optional) + validation
 * - Age (13-99) + custom messages
 * - Gender selection
 * - First habit selection
 * - Review & confirm
 * - Theme picker with live preview
 * - Notification permission
 * - Recovery pact
 * - Final success screen
 * - Backup import option
 */

/*
   STATE
 */

var WelcomeState = {
    currentSlide: 0,
    totalSteps: 9,

    data: {
        name: '',
        age: null,
        gender: null,
        firstHabit: null,
        theme: 'green',
        pactAccepted: false
    },

    // Track which steps have been completed
    completedSteps: {},

    reset: function () {
        this.currentSlide = 0;
        this.completedSteps = {};
        this.data = {
            name: '',
            age: null,
            gender: null,
            firstHabit: null,
            theme: 'green',
            pactAccepted: false
        };
    }
};

/*
   HABIT LIST (for step 4)
 */

var WELCOME_HABITS = [
    { id: 'smoking',          title: 'التدخين',              icon: 'fa-smoking' },
    { id: 'alcohol',          title: 'شرب الكحول',           icon: 'fa-wine-bottle' },
    { id: 'drugs',            title: 'المخدرات',              icon: 'fa-capsules' },
    { id: 'masturbation',     title: 'العادة السرية',         icon: 'fa-hand-paper' },
    { id: 'pornography',      title: 'الأفلام الإباحية',      icon: 'fa-film' },
    { id: 'gaming',           title: 'إدمان الألعاب',         icon: 'fa-gamepad' },
    { id: 'socialMedia',      title: 'التواصل الاجتماعي',     icon: 'fa-hashtag' },
    { id: 'smartphone',       title: 'إدمان الهاتف',          icon: 'fa-mobile-screen' },
    { id: 'gambling',         title: 'المقامرة',              icon: 'fa-dice' },
    { id: 'procrastination',  title: 'التسويف',               icon: 'fa-clock' },
    { id: 'lying',            title: 'الكذب',                 icon: 'fa-comment-slash' },
    { id: 'anger',            title: 'الغضب',                 icon: 'fa-angry' },
    { id: 'overspending',     title: 'الإسراف',               icon: 'fa-shopping-cart' },
    { id: 'poorNutrition',    title: 'سوء التغذية',           icon: 'fa-hamburger' },
    { id: 'inactivity',       title: 'الخمول',                icon: 'fa-couch' },
    { id: 'sleepDisorder',    title: 'اضطرابات النوم',        icon: 'fa-moon' },
    { id: 'caffeine',         title: 'الإفراط في الكافيين',   icon: 'fa-coffee' },
    { id: 'nailBiting',       title: 'قضم الأظافر',           icon: 'fa-hand-sparkles' },
    { id: 'bullying',         title: 'التنمر',                icon: 'fa-bullhorn' },
    { id: 'isolation',        title: 'العزلة الاجتماعية',     icon: 'fa-user-slash' },
    { id: 'adultery',         title: 'العلاقات المحرمة',      icon: 'fa-heart-crack' },
    { id: 'other',            title: 'عادة أخرى',             icon: 'fa-ellipsis-h' }
];

/*
   THEMES (for step 6)
 */

var WELCOME_THEMES = [
    { id: 'green',   name: 'الأخضر',     icon: 'fa-leaf' },
    { id: 'pink',    name: 'الوردي',     icon: 'fa-heart' },
    { id: 'desert',  name: 'الصحراوي',   icon: 'fa-sun' },
    { id: 'ocean',   name: 'المحيط',     icon: 'fa-water' },
    { id: 'ramadan', name: 'الرمضاني',   icon: 'fa-star-and-crescent' }
];

/*
   NAVIGATION
 */

/**
 * Move to a specific step.
 * @param {number} step - Step number (0-7)
 * @param {string} direction - 'forward' | 'back'
 */
function welcomeGoTo(step, direction) {
    direction = direction || 'forward';

    // Bounds check
    if (step < 0 || step >= WelcomeState.totalSteps) return;

    // Save current step as completed when moving forward
    if (direction === 'forward' && step > WelcomeState.currentSlide) {
        WelcomeState.completedSteps[WelcomeState.currentSlide] = true;
    }

    WelcomeState.currentSlide = step;

    // Update all slides
    document.querySelectorAll('.welcome-slide').forEach(function (slide, i) {
        slide.classList.remove('active');
        if (i === step) slide.classList.add('active');
    });

    // Update progress
    welcomeUpdateProgress(step);

    // Show/hide back button
    var backBtn = document.getElementById('welcome-back-btn');
    if (backBtn) {
        if (step === 0 || step === 8) {
            backBtn.classList.add('hidden');
        } else {
            backBtn.classList.remove('hidden');
        }
    }

    // Hide progress indicator on intro and final
    var progress = document.getElementById('welcome-progress');
    if (progress) {
        if (step === 0 || step === 8) {
            progress.style.display = 'none';
        } else {
            progress.style.display = 'flex';
        }
    }

    // Scroll to top
    var container = document.querySelector('.welcome-container');
    if (container) container.scrollTop = 0;

    // Focus appropriate field on certain steps
    if (step === 1) {
        setTimeout(function () {
            var input = document.getElementById('user-name');
            if (input) input.focus();
        }, 200);
    }
}

/**
 * Legacy compatibility: nextSlide / prevSlide
 */
function nextSlide(n) {
    // Legacy code passes 1, 2, 3 → now maps to new steps
    var map = { 1: 0, 2: 1, 3: 2 };
    welcomeGoTo(map[n] !== undefined ? map[n] : n, 'forward');
}

function prevSlide(n) {
    var map = { 1: 0, 2: 1, 3: 2 };
    welcomeGoTo(map[n] !== undefined ? map[n] : n, 'back');
}

/**
 * Update progress indicator.
 * Maps slide index (0-8) to progress steps (0-6).
 * - Slide 0 (intro)     → no step active
 * - Slides 1-7          → steps 0-6
 * - Slide 8 (final)     → all steps completed
 * 
 */

function welcomeUpdateProgress(slideIndex) {
    // Map slide index to progress step index
    // Slide 1 → step 0, slide 2 → step 1, ..., slide 7 → step 6
    var stepIndex = -1;

    if (slideIndex >= 1 && slideIndex <= 7) {
        stepIndex = slideIndex - 1;
    } else if (slideIndex === 8) {
        stepIndex = 7; // beyond last → all completed
    }
    // slideIndex === 0 → stepIndex = -1 → nothing active

    document.querySelectorAll('.welcome-step').forEach(function (el, i) {
        el.classList.remove('active', 'completed');

        if (i === stepIndex) {
            el.classList.add('active');
        } else if (i < stepIndex || (slideIndex === 8)) {
            el.classList.add('completed');
        }
    });

    // Update dividers
    document.querySelectorAll('.welcome-step-divider').forEach(function (div, i) {
        if (i < stepIndex || slideIndex === 8) {
            div.classList.add('completed');
        } else {
            div.classList.remove('completed');
        }
    });
}

/**
 * Validate name (2-50 chars, no pure numbers).
 */
function validateName(value) {
    var trimmed = String(value || '').trim();

    if (!trimmed) {
        return { valid: false, hint: '', allow: true }; // optional
    }

    if (trimmed.length < 2) {
        return { valid: false, hint: 'الاسم قصير جداً (حرفان على الأقل)', error: true };
    }

    if (trimmed.length > 50) {
        return { valid: false, hint: 'الاسم طويل جداً (50 حرفاً كحد أقصى)', error: true };
    }

    if (/^\d+$/.test(trimmed)) {
        return { valid: false, hint: 'لا يمكن أن يكون الاسم أرقاماً فقط', error: true };
    }

    return { valid: true, hint: 'صحيح', success: true };
}

/**
 * Validate age (13-99).
 */
function validateAge(value) {
    var age = parseInt(value, 10);

    if (!value || isNaN(age)) {
        return { valid: false, hint: '' };
    }

    if (age < 13) {
        return { valid: false, hint: 'يجب أن يكون عمرك 13 سنة على الأقل', error: true };
    }

    if (age > 99) {
        return { valid: false, hint: 'الرجاء التحقق من العمر (99 كحد أقصى)', error: true };
    }

    return { valid: true, hint: 'صحيح', success: true };
}

/**
 * Update a field's hint and validity icon.
 */
function welcomeSetFieldStatus(inputId, hintId, result) {
    var input = document.getElementById(inputId);
    var hint = document.getElementById(hintId);
    if (!input || !hint) return;

    // Remove old status
    input.classList.remove('error', 'success');

    // Add new status
    if (result.error) {
        input.classList.add('error');
        hint.className = 'form-hint error';
        hint.textContent = result.hint || '';
    } else if (result.success) {
        input.classList.add('success');
        hint.className = 'form-hint success';
        hint.textContent = result.hint || '';
    } else {
        hint.className = 'form-hint';
        hint.textContent = result.hint || '';
    }
}

/*
   STEP 1 — NAME
 */

function onNameInput(value) {
    var result = validateName(value);
    welcomeSetFieldStatus('user-name', 'name-hint', result);

    // Save in state
    WelcomeState.data.name = String(value || '').trim();
}

function welcomeNameNext() {
    var input = document.getElementById('user-name');
    var value = input ? input.value.trim() : '';
    var result = validateName(value);

    if (!result.valid && value.length > 0) {
        // Invalid but has content
        return;
    }

    WelcomeState.data.name = value || 'صديقي';
    welcomeGoTo(2, 'forward');
}

function welcomeNameSkip() {
    WelcomeState.data.name = 'صديقي';
    welcomeGoTo(2, 'forward');
}

/*
   STEP 2 — AGE
 */

function onAgeInput(value) {
    var result = validateAge(value);
    welcomeSetFieldStatus('user-age', 'age-hint', result);

    if (result.valid) {
        WelcomeState.data.age = parseInt(value, 10);
    } else {
        WelcomeState.data.age = null;
    }
}

function welcomeAgeNext() {
    var input = document.getElementById('user-age');
    var value = input ? input.value.trim() : '';
    var result = validateAge(value);

    if (!result.valid) return;

    WelcomeState.data.age = parseInt(value, 10);
    welcomeGoTo(3, 'forward');
}

/*
   STEP 3 — GENDER
 */

function selectGender(gender) {
    WelcomeState.data.gender = gender;

    var hidden = document.getElementById('user-gender');
    if (hidden) hidden.value = gender;

    document.querySelectorAll('.gender-option').forEach(function (el) {
        el.classList.remove('selected');
        if (el.dataset.gender === gender) el.classList.add('selected');
    });

    // Enable next
    var nextBtn = document.getElementById('gender-next-btn');
    if (nextBtn) nextBtn.disabled = false;
}

function welcomeGenderNext() {
    if (!WelcomeState.data.gender) return;
    welcomeGoTo(4, 'forward');
}

/*
   STEP 4 — FIRST HABIT
 */

function welcomeSelectHabit(habitId) {
    WelcomeState.data.firstHabit = habitId;

    document.querySelectorAll('.habit-option-welcome').forEach(function (el) {
        el.classList.remove('selected');
        if (el.dataset.habitId === habitId) el.classList.add('selected');
    });

    var nextBtn = document.getElementById('habit-next-btn');
    if (nextBtn) nextBtn.disabled = false;
}

function welcomeHabitNext() {
    if (!WelcomeState.data.firstHabit) return;
    welcomeGoTo(5, 'forward');
}

function welcomeHabitSkip() {
    WelcomeState.data.firstHabit = null;
    welcomeGoTo(5, 'forward');
}

/*
   STEP 5 — REVIEW
 */

function welcomeRenderReview() {
    var container = document.getElementById('review-content');
    if (!container) return;

    var name = WelcomeState.data.name || 'صديقي';
    var age = WelcomeState.data.age || '—';
    var genderLabel = WelcomeState.data.gender === 'male'
        ? 'ذكر'
        : WelcomeState.data.gender === 'female'
            ? 'أنثى'
            : '—';

    var habitLabel = '—';
    if (WelcomeState.data.firstHabit) {
        var found = WELCOME_HABITS.find(function (h) {
            return h.id === WelcomeState.data.firstHabit;
        });
        habitLabel = found ? found.title : '—';
    }

    container.innerHTML =
        '<div class="review-list">' +

            '<div class="review-item">' +
                '<div class="review-item-left">' +
                    '<div class="review-item-icon"><i class="fas fa-user"></i></div>' +
                    '<div class="review-item-content">' +
                        '<div class="review-item-label">الاسم</div>' +
                        '<div class="review-item-value">' + welcomeEscapeHtml(name) + '</div>' +
                    '</div>' +
                '</div>' +
                '<button class="review-item-edit" onclick="welcomeGoTo(1, \'back\')">' +
                    '<i class="fas fa-pen"></i> تعديل' +
                '</button>' +
            '</div>' +

            '<div class="review-item">' +
                '<div class="review-item-left">' +
                    '<div class="review-item-icon"><i class="fas fa-calendar"></i></div>' +
                    '<div class="review-item-content">' +
                        '<div class="review-item-label">العمر</div>' +
                        '<div class="review-item-value">' + welcomeEscapeHtml(age) + ' سنة</div>' +
                    '</div>' +
                '</div>' +
                '<button class="review-item-edit" onclick="welcomeGoTo(2, \'back\')">' +
                    '<i class="fas fa-pen"></i> تعديل' +
                '</button>' +
            '</div>' +

            '<div class="review-item">' +
                '<div class="review-item-left">' +
                    '<div class="review-item-icon"><i class="fas fa-venus-mars"></i></div>' +
                    '<div class="review-item-content">' +
                        '<div class="review-item-label">الجنس</div>' +
                        '<div class="review-item-value">' + welcomeEscapeHtml(genderLabel) + '</div>' +
                    '</div>' +
                '</div>' +
                '<button class="review-item-edit" onclick="welcomeGoTo(3, \'back\')">' +
                    '<i class="fas fa-pen"></i> تعديل' +
                '</button>' +
            '</div>' +

            '<div class="review-item">' +
                '<div class="review-item-left">' +
                    '<div class="review-item-icon"><i class="fas fa-bullseye"></i></div>' +
                    '<div class="review-item-content">' +
                        '<div class="review-item-label">العادة الأولى</div>' +
                        '<div class="review-item-value">' + welcomeEscapeHtml(habitLabel) + '</div>' +
                    '</div>' +
                '</div>' +
                '<button class="review-item-edit" onclick="welcomeGoTo(4, \'back\')">' +
                    '<i class="fas fa-pen"></i> تعديل' +
                '</button>' +
            '</div>' +

        '</div>';
}

function welcomeReviewNext() {
    welcomeGoTo(6, 'forward');
}

/*
   STEP 6 — THEME
 */

function welcomeSelectTheme(themeId) {
    WelcomeState.data.theme = themeId;

    document.querySelectorAll('.theme-choice').forEach(function (el) {
        el.classList.remove('selected');
        if (el.dataset.themeId === themeId) el.classList.add('selected');
    });

    // Apply preview live
    if (typeof ThemesManager !== 'undefined' && typeof ThemesManager.setTheme === 'function') {
        // Just preview visually without saving
        document.body.classList.remove(
            'theme-green', 'theme-pink', 'theme-desert', 'theme-ocean', 'theme-ramadan'
        );
        document.body.classList.add('theme-' + themeId);
    }
}

function welcomeThemeNext() {
    welcomeGoTo(7, 'forward');
}

/*
   STEP 7 — PACT
 */

function welcomeTogglePact() {
    WelcomeState.data.pactAccepted = !WelcomeState.data.pactAccepted;

    var box = document.getElementById('pact-checkbox');
    if (box) {
        box.classList.toggle('checked', WelcomeState.data.pactAccepted);
    }

    var nextBtn = document.getElementById('pact-next-btn');
    if (nextBtn) nextBtn.disabled = !WelcomeState.data.pactAccepted;
}

function welcomePactNext() {
    if (!WelcomeState.data.pactAccepted) return;
    welcomeComplete();
}

/*
   STEP 8 — FINAL
 */

function welcomeRenderFinal() {
    var nameEl = document.getElementById('final-name');
    if (nameEl) {
        var name = WelcomeState.data.name || 'صديقي';
        nameEl.textContent = 'مرحباً بك يا ' + name + '!';
    }
}

/*
   INITIAL SCREEN (Step 0)
 */

function welcomeStartFresh() {
    WelcomeState.reset();
    welcomeGoTo(1, 'forward');
}

function welcomeShowImportDialog() {
    var modal = document.getElementById('welcome-import-modal');
    if (modal) modal.style.display = 'flex';
}

function welcomeCloseImportDialog() {
    var modal = document.getElementById('welcome-import-modal');
    if (modal) modal.style.display = 'none';
}

function welcomeTriggerImport() {
    var input = document.getElementById('welcome-backup-file');
    if (input) input.click();
}

function welcomeHandleBackupFile(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function (e) {
        try {
            var json = JSON.parse(e.target.result);

            if (typeof BackupManager !== 'undefined' &&
                typeof BackupManager.importData === 'function') {

                BackupManager.importData(e.target.result);
                welcomeCloseImportDialog();

                // Show success
                setTimeout(function () {
                    if (typeof showToast === 'function') {
                        showToast('تم استيراد البيانات بنجاح');
                    }
                    window.location.reload();
                }, 500);
            } else {
                alert('تعذر تحميل مدير النسخ الاحتياطي');
            }
        } catch (err) {
            alert('ملف غير صالح — تأكد من أنه ملف نسخة احتياطية صحيح');
        }
    };
    reader.readAsText(file);
}

/*
   FINAL SUBMIT — SAVE USER & COMPLETE ONBOARDING
 */

function welcomeComplete() {
    // Build final user data
    var userData = {
        name: WelcomeState.data.name || 'صديقي',
        age: WelcomeState.data.age,
        gender: WelcomeState.data.gender,
        firstHabit: WelcomeState.data.firstHabit,
        theme: WelcomeState.data.theme || 'green',
        createdAt: new Date().toISOString(),
        onboardingVersion: 2,
        onboardingCompletedAt: new Date().toISOString()  // Important
    };

    // Save via UserManager (IndexedDB + localStorage)
    var saved = false;
    if (typeof UserManager !== 'undefined' && typeof UserManager.save === 'function') {
        saved = UserManager.save(userData);
        console.log('[Welcome] User saved:', saved);
    }

    // Fallback to direct localStorage if UserManager unavailable
    if (!saved) {
        try {
            localStorage.setItem('taafi_user_data', JSON.stringify({
                value: userData,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error('[Welcome] Save failed:', e);
        }
    }

    // Apply theme
    if (typeof ThemesManager !== 'undefined' && typeof ThemesManager.setTheme === 'function') {
        ThemesManager.setTheme(WelcomeState.data.theme || 'green');
    }

    // Update settings
    try {
        var settings = (typeof StorageManager !== 'undefined' && typeof StorageManager.getSettings === 'function')
            ? StorageManager.getSettings()
            : {};
        settings.notifications = false;
        settings.dailyReminder = true;
        settings.notificationPermissionAsked = false;
        settings.notificationPermissionGranted = false;
        settings.theme = WelcomeState.data.theme || 'green';
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.saveSettings === 'function') {
            StorageManager.saveSettings(settings);
        }
    } catch (e) {
        console.warn('[Welcome] Settings save failed:', e);
    }

    // Start recovery for first habit
    if (WelcomeState.data.firstHabit && WelcomeState.data.firstHabit !== 'other') {
        setTimeout(function () {
            try {
                if (typeof TaeafiMultiHabit !== 'undefined' &&
                    typeof TaeafiMultiHabit.startRecovery === 'function') {
                    TaeafiMultiHabit.startRecovery(WelcomeState.data.firstHabit);
                } else if (typeof RecoveryCounter !== 'undefined' &&
                           typeof RecoveryCounter.startRecovery === 'function') {
                    RecoveryCounter.startRecovery(WelcomeState.data.firstHabit);
                }
            } catch (e) {
                console.warn('[Welcome] Recovery start failed:', e);
            }
        }, 300);
    }

    // Show final screen
    welcomeRenderFinal();
    welcomeGoTo(8, 'forward');

    // Enter app after animation
    setTimeout(function () {
        welcomeEnterApp();
    }, 2500);
}

function welcomeEnterApp() {
    // Hide welcome screen
    var welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
        welcomeScreen.style.display = 'none';
    }

    // Show main app
    var app = document.getElementById('app');
    if (app) {
        app.classList.add('visible');
        app.style.display = 'flex';
    }

    // Re-init managers
    if (typeof StorageManager !== 'undefined' && typeof StorageManager.init === 'function') {
        StorageManager.init();
    }
    if (typeof AchievementsManager !== 'undefined' && typeof AchievementsManager.init === 'function') {
        AchievementsManager.init();
    }

    // Navigate to home
    if (typeof navigateTo === 'function') {
        navigateTo('home');
    } else if (typeof renderHomePage === 'function') {
        renderHomePage();
    }

    // Toast
    if (typeof showToast === 'function') {
        var name = WelcomeState.data.name || 'صديقي';
        showToast('مرحباً بك ' + name + '! 🌿');
    }

    // Request notification permission after 2 seconds
    setTimeout(function () {
        var modal = document.getElementById('permission-modal');
        if (modal) modal.classList.remove('hidden');
    }, 2000);

    // Track completion
    if (typeof UserManager !== 'undefined' && typeof UserManager.markOnboardingComplete === 'function') {
        UserManager.markOnboardingComplete();
    }
}

/*
   SHOW / RESET
 */

function showWelcome() {
    var app = document.getElementById('app');
    var ws = document.getElementById('welcome-screen');
    if (app) { app.classList.remove('visible'); app.style.display = 'none'; }
    if (ws) { ws.classList.remove('hidden'); ws.style.display = 'flex'; }

    // Reset
    welcomeReset();
}

function welcomeReset() {
    WelcomeState.reset();

    // Reset inputs
    var nameInput = document.getElementById('user-name');
    if (nameInput) nameInput.value = '';

    var ageInput = document.getElementById('user-age');
    if (ageInput) ageInput.value = '';

    var genderInput = document.getElementById('user-gender');
    if (genderInput) genderInput.value = '';

    // Reset hints
    ['name-hint', 'age-hint'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) { el.textContent = ''; el.className = 'form-hint'; }
    });

    // Reset selections
    document.querySelectorAll('.gender-option, .habit-option-welcome, .theme-choice')
        .forEach(function (el) { el.classList.remove('selected'); });

    // Disable buttons
    ['gender-next-btn', 'habit-next-btn', 'pact-next-btn'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.disabled = true;
    });

    var pactBox = document.getElementById('pact-checkbox');
    if (pactBox) pactBox.classList.remove('checked');

    // Go to step 0
    welcomeGoTo(0, 'back');
}

/*
   ESCAPE HELPER
 */

function welcomeEscapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/*
   INIT ON DOM READY
 */

document.addEventListener('DOMContentLoaded', function () {
    // Attach live validation listeners
    var nameInput = document.getElementById('user-name');
    if (nameInput) {
        nameInput.addEventListener('input', function (e) {
            onNameInput(e.target.value);
        });
    }

    var ageInput = document.getElementById('user-age');
    if (ageInput) {
        ageInput.addEventListener('input', function (e) {
            onAgeInput(e.target.value);
        });
    }
});

/* UI INITIALIZATION — Populate dynamic lists */

function welcomeInitUI() {
    // Populate habits grid (Step 4)
    var habitsGrid = document.getElementById('welcome-habits-grid');
    if (habitsGrid && habitsGrid.children.length === 0) {
        var habitsHtml = '';
        WELCOME_HABITS.forEach(function (h) {
            habitsHtml +=
                '<div class="habit-option-welcome" data-habit-id="' + h.id + '" onclick="welcomeSelectHabit(\'' + h.id + '\')">' +
                    '<i class="fas ' + h.icon + '"></i>' +
                    '<span>' + h.title + '</span>' +
                '</div>';
        });
        habitsGrid.innerHTML = habitsHtml;
    }

    // Populate themes picker (Step 6)
    var themePicker = document.getElementById('theme-picker');
    if (themePicker && themePicker.children.length === 0) {
        var themesHtml = '';
        WELCOME_THEMES.forEach(function (t) {
            themesHtml +=
                '<div class="theme-choice' + (t.id === 'green' ? ' selected' : '') + '" data-theme-id="' + t.id + '" onclick="welcomeSelectTheme(\'' + t.id + '\')">' +
                    '<div class="theme-swatch ' + t.id + '">' +
                        '<i class="fas ' + t.icon + '"></i>' +
                    '</div>' +
                    '<span class="theme-choice-label">' + t.name + '</span>' +
                '</div>';
        });
        themePicker.innerHTML = themesHtml;
    }

    // Update pact name dynamically when moving to step 7
    // (handled by welcomeRenderReview / welcomeRenderFinal)

    // Hook: when entering review step, render it
    var originalGoTo = window.welcomeGoTo;
    if (typeof originalGoTo === 'function' && !originalGoTo.__hooked) {
        window.welcomeGoTo = function (step, direction) {
            originalGoTo.call(this, step, direction);

            if (step === 5) {
                welcomeRenderReview();
            }
            if (step === 7) {
                var pactName = document.getElementById('pact-name');
                if (pactName) {
                    pactName.textContent = WelcomeState.data.name || 'صديقي';
                }
            }
        };
        window.welcomeGoTo.__hooked = true;
    }
}

/**
 * Handle the top-right back button.
 */
function welcomeBackStep() {
    var current = WelcomeState.currentSlide;

    // From step 1 → back to intro (step 0)
    // From step 2-7 → previous step
    // From step 8 (final) → no back

    if (current === 8) return;

    if (current > 0) {
        welcomeGoTo(current - 1, 'back');
    }
} 
