/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : 21-day.js
 * Type   : JavaScript
 */

const TWENTY_ONE_DAY_STORAGE_KEY = 'taeafi_21_day_challenge';

const TWENTY_ONE_DAY_TASKS = [
    {
        id: 'dopamine',
        title: 'قطع المشتتات والمتع قصيرة المدى',
        icon: 'fa-brain',
        description: 'التقليل من الأشياء التي تشتت تركيزك وتضعف انضباطك.',
        tasks: [
            {
                id: 'pornography',
                title: 'لا إباحية',
                icon: 'fa-ban'
            },
            {
                id: 'sugar',
                title: 'تجنب السكر الزائد',
                icon: 'fa-cube'
            },
            {
                id: 'smoking',
                title: 'لا تدخين',
                icon: 'fa-smoking'
            },
            {
                id: 'distractions',
                title: 'تجنب المشتتات العميقة',
                icon: 'fa-bullseye'
            }
        ]
    },

    {
        id: 'morning',
        title: 'التحكم في صباحك',
        icon: 'fa-sun',
        description: 'ابدأ يومك بوعي قبل أن تبدأ المشتتات بالسيطرة على وقتك.',
        tasks: [
            {
                id: 'early_wakeup',
                title: 'الاستيقاظ مبكرًا',
                icon: 'fa-clock'
            },
            {
                id: 'sunlight',
                title: 'التعرض لضوء الشمس',
                icon: 'fa-sun'
            },
            {
                id: 'cold_shower',
                title: 'حمام بارد',
                icon: 'fa-shower'
            },
            {
                id: 'morning_exercise',
                title: 'تمرين رياضي لمدة 10 دقائق',
                icon: 'fa-running'
            },
            {
                id: 'quiet_time',
                title: '20 دقيقة بدون إلهاء',
                icon: 'fa-volume-mute'
            }
        ]
    },

    {
        id: 'discipline',
        title: 'الأشياء غير القابلة للتفاوض',
        icon: 'fa-dumbbell',
        description: 'ثوابت يومية تساعدك على بناء هوية أكثر انضباطًا.',
        tasks: [
            {
                id: 'exercise',
                title: 'ممارسة الرياضة',
                icon: 'fa-dumbbell'
            },
            {
                id: 'reading',
                title: 'قراءة 10 صفحات على الأقل',
                icon: 'fa-book'
            },
            {
                id: 'clean_food',
                title: 'الأكل المنظم والنظيف',
                icon: 'fa-apple-alt'
            }
        ]
    },

    {
        id: 'digital',
        title: 'الانضباط الرقمي',
        icon: 'fa-mobile-alt',
        description: 'استرجع السيطرة على هاتفك بدل أن يتحكم الهاتف بوقتك.',
        tasks: [
            {
                id: 'no_phone_morning',
                title: 'لا هاتف في بداية الصباح',
                icon: 'fa-mobile-alt'
            },
            {
                id: 'notifications',
                title: 'تجنب الإشعارات العشوائية',
                icon: 'fa-bell-slash'
            },
            {
                id: 'social_media',
                title: 'التواصل الاجتماعي بعد إنجاز المهام',
                icon: 'fa-users'
            }
        ]
    }
];

/* 
 * Utility Functions
 **/

function twentyOneDayGetUser() {
    if (typeof StorageManager !== 'undefined' && typeof StorageManager.getUser === 'function') {
        return StorageManager.getUser();
    }

    return null;
}

function twentyOneDayGetGender() {
    const user = twentyOneDayGetUser();

    return user?.gender === 'female'
        ? 'female'
        : 'male';
}

function twentyOneDayGetPronouns() {
    const gender = twentyOneDayGetGender();

    if (gender === 'female') {
        return {
            you: 'أنتِ',
            started: 'تبدئين',
            continue: 'واصلي',
            complete: 'أكملتِ',
            ready: 'مستعدة',
            your: 'تقييمكِ',
            relapse: 'انتكاستكِ'
        };
    }

    return {
        you: 'أنتَ',
        started: 'تبدأ',
        continue: 'واصل',
        complete: 'أكملت',
        ready: 'مستعد',
        your: 'تقييمك',
        relapse: 'انتكاستك'
    };
}

function twentyOneDayTodayKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function twentyOneDayParseDate(dateString) {
    if (!dateString) {
        return null;
    }

    const parts = dateString.split('-').map(Number);

    if (parts.length !== 3 || parts.some(Number.isNaN)) {
        return null;
    }

    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );
}

function twentyOneDayDifferenceInDays(startDate, endDate) {
    const start = twentyOneDayParseDate(startDate);
    const end = twentyOneDayParseDate(endDate);

    if (!start || !end) {
        return 0;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

function twentyOneDayFormatNumber(value) {
    return Number(value || 0)
        .toLocaleString('ar-IQ');
}

function twentyOneDayClamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/* 
 * Storage
 **/

function twentyOneDayLoad() {
    let data = null;

    try {
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.get === 'function') {
            data = StorageManager.get(TWENTY_ONE_DAY_STORAGE_KEY);
        }

        if (!data) {
            const raw = localStorage.getItem(TWENTY_ONE_DAY_STORAGE_KEY);

            if (raw) {
                data = JSON.parse(raw);
            }
        }
    } catch (error) {
        console.warn('21-Day Challenge: failed to load data.', error);
    }

    if (!data || typeof data !== 'object') {
        return null;
    }

    return data;
}


function twentyOneDaySave(data) {
    try {
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.set === 'function') {
            StorageManager.set(TWENTY_ONE_DAY_STORAGE_KEY, data);
        } else {
            localStorage.setItem(TWENTY_ONE_DAY_STORAGE_KEY, JSON.stringify(data));
        }

        return true;

    } catch (error) {
        console.error('21-Day Challenge: failed to save data.', error);
        return false;
    }
}

/* 
 * Challenge State
 **/

function twentyOneDayCreateChallenge() {
    return {
        version: 1,
        accepted: true,
        startDate: twentyOneDayTodayKey(),
        completed: false,
        totalRelapses: 0,
        totalScore: 0,
        level: 0,
        days: {},
        lastUpdated: Date.now()
    };
}

function twentyOneDayGetCurrentDay(data) {
    if (!data || !data.startDate) {
        return 1;
    }

    const elapsed = twentyOneDayDifferenceInDays(data.startDate, twentyOneDayTodayKey());
    return twentyOneDayClamp(elapsed + 1, 1, 21);
}


function twentyOneDayGetDayData(data, dayNumber) {
    if (!data.days) {
        data.days = {};
    }

    if (!data.days[dayNumber]) {
        data.days[dayNumber] = {
            completed: false,
            relapse: false,
            relapseCount: 0,
            score: 0,
            tasks: {},
            updatedAt: null
        };
    }

    return data.days[dayNumber];
}


function twentyOneDayCountTasks() {
    return TWENTY_ONE_DAY_TASKS.reduce((total, section) => total + section.tasks.length, 0);
}

function twentyOneDayGetCompletedTaskCount(dayData) {
    if (!dayData || !dayData.tasks) {
        return 0;
    }

    return Object.values(dayData.tasks)
        .filter(Boolean)
        .length;
}

/* 
 * Scoring
 **/

function twentyOneDayCalculateDayScore(dayData) {
    const totalTasks = twentyOneDayCountTasks();
    const completedTasks = twentyOneDayGetCompletedTaskCount(dayData);

    if (totalTasks <= 0) {
        return 0;
    }

    let score = Math.round((completedTasks / totalTasks) * 100);

    if (dayData.relapse) {
        score -= 15;
    }

    return twentyOneDayClamp(score, 0, 100);
}

function twentyOneDayCalculateOverallScore(data) {
    const dayEntries = Object.values(data.days || {});

    if (!dayEntries.length) {
        return 0;
    }

    const scores = dayEntries.map(day => Number(day.score || 0));
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(twentyOneDayClamp(average, 0, 100));
}

function twentyOneDayGetLevel(score) {
    if (score >= 90) {
        return {
            title: 'ثابت',
            icon: 'fa-crown',
            className: 'excellent'
        };
    }

    if (score >= 75) {
        return {
            title: 'منضبط',
            icon: 'fa-shield-alt',
            className: 'good'
        };
    }

    if (score >= 60) {
        return {
            title: 'ملتزم',
            icon: 'fa-check-circle',
            className: 'stable'
        };
    }

    if (score >= 40) {
        return {
            title: 'مبتدئ',
            icon: 'fa-seedling',
            className: 'beginner'
        };
    }

    return {
        title: 'بداية جديدة',
        icon: 'fa-flag',
        className: 'start'
    };
}

function twentyOneDayRefreshStatistics(data) {
    data.totalScore = twentyOneDayCalculateOverallScore(data);
    const level = twentyOneDayGetLevel(data.totalScore);
    data.level = level.title;
    data.lastUpdated = Date.now();
    return data;
}

/* 
 * Smart DOM Helpers
 * */

/**
 * Returns the active challenge page root.
 */

function twentyOneDayGetRoot() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        return null;
    }

    return mainContent.querySelector(
        '.twenty-one-page'
    );
}

/**
 * Safely update text without rebuilding DOM.
 */

function twentyOneDaySetText(selector, value
) {
    const root = twentyOneDayGetRoot();

    if (!root) {
        return false;
    }

    const element = root.querySelector(selector);

    if (!element) {
        return false;
    }

    element.textContent = String(value);
    return true;
}


/**
 * Update progress bar width.
 */

function twentyOneDaySetProgress(selector, percentage) {
    const root = twentyOneDayGetRoot();

    if (!root) {
        return false;
    }

    const element = root.querySelector(selector);

    if (!element) {
        return false;
    }

    const safePercentage = twentyOneDayClamp(Number(percentage) || 0,0, 100);
    element.style.width = `${safePercentage}%`;
    return true;
}


/**
 * Update all dashboard statistics without
 * rebuilding the page.
 */

function twentyOneDayUpdateDashboard( data) {
    const root = twentyOneDayGetRoot();

    if (!root) {
        return false;
    }

    const currentDay = twentyOneDayGetCurrentDay(data);
    const dayData = twentyOneDayGetDayData(data, currentDay);
    const totalTasks = twentyOneDayCountTasks();
    const completedTasks = twentyOneDayGetCompletedTaskCount( dayData);
    const todayScore = twentyOneDayCalculateDayScore(dayData);
    const overallScore = Number(data.totalScore || 0);
    const level = twentyOneDayGetLevel(overallScore);
    const progress = Math.round((currentDay / 21) * 100);
    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const remainingDays = Math.max(21 - currentDay, 0);
    const completedDays = Object.values(data.days || {} ).filter(day => day.completed).length;

    twentyOneDaySetText('[data-21-overall-score]', twentyOneDayFormatNumber(overallScore)); // Main score.
    twentyOneDaySetText('[data-21-level]', level.title); // Level.

    const levelIcon = root.querySelector('[data-21-level-icon]');

    if (levelIcon) {
        levelIcon.className = `fas ${level.icon}`;
    }

    twentyOneDaySetText('[data-21-total-relapses]', twentyOneDayFormatNumber(data.totalRelapses));    // Relapse count
    twentyOneDaySetText('[data-21-completed-days]', twentyOneDayFormatNumber(completedDays));        // Completed days
    twentyOneDaySetText('[data-21-progress]', `${twentyOneDayFormatNumber(progress)}%`);            // Challenge progress
    twentyOneDaySetProgress('[data-21-main-progress]', progress);                                  // Main progress
    twentyOneDaySetText('[data-21-remaining-days]',twentyOneDayFormatNumber(remainingDays));      // Remaining days
    twentyOneDaySetText('[data-21-today-score]',twentyOneDayFormatNumber(todayScore));           // Today's score
    twentyOneDaySetText('[data-21-completed-tasks]', twentyOneDayFormatNumber(completedTasks)); // Completed tasks
    twentyOneDaySetText('[data-21-total-tasks]', twentyOneDayFormatNumber(totalTasks));        // Total tasks
    twentyOneDaySetProgress('[data-21-task-progress]', taskProgress);                         // Today's task progress

    const headerDescription = root.querySelector('[data-21-header-description]'); // Challenge completion message

    if (headerDescription) {
        const pronouns = twentyOneDayGetPronouns();
        headerDescription.textContent = data.completed
                ? 'مبروك، أكملت رحلة الـ21 يوم.'
                : `${pronouns.continue} خطوة بخطوة ولا تستعجل النتيجة.`;
    }

    /*
     * Update today's task buttons.
     */

    root.querySelectorAll('[data-21-task]').forEach(button => {
        const taskId = button.dataset.taskId;
        const checked = Boolean(dayData.tasks[taskId]);
        button.classList.toggle('is-complete', checked);
        const icon = button.querySelector('[data-21-task-check]');

        if (icon) {
            icon.className = `fas ${
                    checked
                        ? 'fa-check-circle'
                        : 'fa-circle'
                }`;
        }
    });

    twentyOneDayUpdateRelapseAction(dayData); // Update relapse action
    twentyOneDayUpdateHistory(data);         // Update history
    return true;
}


/**
 * Update relapse button state.
 */

function twentyOneDayUpdateRelapseAction(dayData) {
    const root = twentyOneDayGetRoot();

    if (!root) {
        return;
    }

    const container = root.querySelector('[data-21-relapse-action]');

    if (!container) {
        return;
    }

    if (dayData.relapse) {
        container.innerHTML = `
            <button
                type="button"
                class="btn btn-outline"
                onclick="undoTwentyOneDayRelapse()"
            >
                <i class="fas fa-undo"></i>
                إلغاء انتكاسة اليوم
            </button>
        `;
    } else {
        container.innerHTML = `
            <button
                type="button"
                class="twenty-one-relapse-button"
                onclick="recordTwentyOneDayRelapse()"
            >
                <i class="fas fa-exclamation-triangle"></i>
                تسجيل انتكاسة
            </button>
        `;
    }
}

/**
 * Update challenge history only.
 */

function twentyOneDayUpdateHistory(data) {
    const root = twentyOneDayGetRoot();

    if (!root) {
        return;
    }

    const container = root.querySelector('[data-21-history]');

    if (!container) {
        return;
    }

    container.innerHTML = renderTwentyOneDayHistory(data);
}


/**
 * Apply a small visual feedback without
 * rebuilding the entire page.
 */

function twentyOneDayPulseElement(
    selector
) {
    const root = twentyOneDayGetRoot();

    if (!root) {
        return;
    }

    const element = root.querySelector(selector);

    if (!element) {
        return;
    }

    element.classList.remove('twenty-one-value-updated');
    void element.offsetWidth;
    element.classList.add('twenty-one-value-updated');
    window.setTimeout(() => {
        element.classList.remove('twenty-one-value-updated');
    }, 350);
}

/**
 * Main smart refresh.
 *
 * This function NEVER replaces main-content.
 * It only updates the existing DOM.
 */

function twentyOneDaySmartRefresh() {
    if (typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function' && Router.getCurrentPage() !== '21-day') {
        return false;
    }

    const data = twentyOneDayLoad();

    if (!data || data.accepted !== true) {
        return false;
    }

    twentyOneDayRefreshStatistics(data);
    twentyOneDaySave(data);

    const updated = twentyOneDayUpdateDashboard(data);

    if (updated) {
        twentyOneDayPulseElement('[data-21-today-score]');
        twentyOneDayPulseElement('[data-21-overall-score]');
    }

    return updated;
}

/** 
 * Acceptance
 */

/**
 * Fix: "Agree and Start Challenge" button did not update the page.
 *
 * Root Cause:
 * renderTwentyOneDayPage() was called directly after saving the challenge
 * without clearing the existing DOM. The browser kept showing the old
 * introduction screen until the user left and re-entered the page.
 *
 * Solution:
 * Clear mainContent.innerHTML before re-rendering, and route through the
 * Router with a cleared cache for a clean full refresh.
 */

function startTwentyOneDayChallenge() {
    const existing = twentyOneDayLoad();

    if (existing && existing.accepted && !existing.completed) {
        if (typeof Router !== 'undefined' && typeof Router.navigateTo === 'function') {
            Router.clearPageCache('21-day');
            Router.navigateTo('21-day',
                { historyMode: 'replace' }
            );
        } else {
            renderTwentyOneDayPage();
        }

        return;
    }

    const challenge = twentyOneDayCreateChallenge();

    twentyOneDaySave(challenge);
    showToast(twentyOneDayGetGender() === 'female'
            ? 'بدأتِ تحدي 21 يوم'
            : 'بدأتَ تحدي 21 يوم'
    );

    if (typeof Router !== 'undefined' && typeof Router.navigateTo === 'function') {
        Router.clearPageCache('21-day');
        Router.navigateTo('21-day',
            { historyMode: 'replace' }
        );
    } else {
        renderTwentyOneDayPage();
    }
}

function confirmTwentyOneDayStart() {
    const pronouns = twentyOneDayGetPronouns();

    const accepted = confirm(
            `موافقتك تعني أنك ${pronouns.ready} للالتزام بتسجيل تقدمك يوميًا.\n\n` +
            'أي انتكاسة تقوم بتسجيلها ستؤثر على تقييم اليوم والتقييم العام.\n\n' +
            'هل أنت متأكد من بدء تحدي 21 يوم؟'
        );

    if (!accepted) {
        return;
    }

    startTwentyOneDayChallenge();
}


/* 
 * Daily Tasks
 *  */

function toggleTwentyOneDayTask(dayNumber, taskId) {
    const data = twentyOneDayLoad();

    if (!data || !data.accepted) {
        return;
    }

    const currentDay = twentyOneDayGetCurrentDay(data);

    if (Number(dayNumber) !== currentDay) {
        showToast('يمكنك تعديل مهام اليوم الحالي فقط');
        return;
    }

    const dayData = twentyOneDayGetDayData(data,currentDay);

    dayData.tasks[taskId] = !dayData.tasks[taskId];
    dayData.score = twentyOneDayCalculateDayScore(dayData);
    dayData.updatedAt = Date.now();

    twentyOneDayRefreshStatistics(data);
    twentyOneDaySave(data);

    /*
     * Smart DOM update.
     * The whole page is NOT rebuilt.
     */

    updateTwentyOneDayUI();
}

/* 
 * Relapse
 *  */

function recordTwentyOneDayRelapse() {
    const data = twentyOneDayLoad();

    if (!data || !data.accepted) {
        return;
    }

    const currentDay = twentyOneDayGetCurrentDay(data);
    const dayData = twentyOneDayGetDayData(data, currentDay);
    const pronouns = twentyOneDayGetPronouns();
    const confirmed =
        confirm(
            `هل تريد تسجيل ${pronouns.relapse} اليوم؟\n\n` +
            'سيؤثر تسجيل الانتكاسة على تقييم اليوم والتقييم العام.\n\n' +
            'التسجيل ليس للحكم عليك، بل لمساعدتك على معرفة مسار التحدي بصدق.'
        );

    if (!confirmed) {
        return;
    }

    dayData.relapse = true;
    dayData.relapseCount = Number(dayData.relapseCount || 0) + 1;
    data.totalRelapses = Number(data.totalRelapses || 0) + 1;
    dayData.score = twentyOneDayCalculateDayScore(dayData);
    dayData.updatedAt = Date.now();

    twentyOneDayRefreshStatistics(data);
    twentyOneDaySave(data);
    updateTwentyOneDayUI();
    showToast('تم تسجيل الانتكاسة وتحديث التقييم');
}

function undoTwentyOneDayRelapse() {
    const data = twentyOneDayLoad();

    if (!data || !data.accepted) {
        return;
    }

    const currentDay = twentyOneDayGetCurrentDay(data);
    const dayData = twentyOneDayGetDayData(data, currentDay);

    if (!dayData.relapse) {
        return;
    }

    const confirmed = confirm('هل تريد إلغاء تسجيل الانتكاسة لهذا اليوم؟');

    if (!confirmed) {
        return;
    }

    dayData.relapse = false;

    if (dayData.relapseCount > 0) {
        dayData.relapseCount--;
    }

    if (data.totalRelapses > 0) {
        data.totalRelapses--;
    }

    dayData.score = twentyOneDayCalculateDayScore(dayData);
    dayData.updatedAt = Date.now();

    twentyOneDayRefreshStatistics(data);
    twentyOneDaySave(data);
    updateTwentyOneDayUI();
    showToast('تم إلغاء انتكاسة اليوم');
}


/* 
 * Complete Day
 *  */

function completeTwentyOneDay() {
    const data = twentyOneDayLoad();

    if (!data || !data.accepted) {
        return;
    }

    const currentDay = twentyOneDayGetCurrentDay(data);
    const dayData = twentyOneDayGetDayData(data, currentDay);
    const completedTasks = twentyOneDayGetCompletedTaskCount(dayData);
    const totalTasks = twentyOneDayCountTasks();

    if (completedTasks < totalTasks) {
        const confirmed = confirm('لم تكمل جميع مهام اليوم.\n\n' + 'هل تريد إنهاء اليوم بهذا التقييم؟');
        if (!confirmed) {
            return;
        }
    }

    dayData.score = twentyOneDayCalculateDayScore(dayData);
    dayData.completed = true;
    dayData.updatedAt = Date.now();

    if ( currentDay >= 21) {
        data.completed = true;
    }

    twentyOneDayRefreshStatistics(data);
    twentyOneDaySave(data);
    updateTwentyOneDayUI();

    showToast(currentDay >= 21
            ? 'مبروك! أكملت تحدي 21 يوم'
            : 'تم حفظ تقييم اليوم'
    );
}


/* 
 * Rendering Helpers
 *  */

function renderTwentyOneDayTask(dayNumber, task, dayData) {
    const checked = Boolean(dayData.tasks[task.id]);

    return `
        <button
            type="button"
            class="twenty-one-task ${checked ? 'is-complete' : ''}"
            data-21-task="true"
            data-task-id="${task.id}"
            onclick="toggleTwentyOneDayTask(${dayNumber}, '${task.id}')"
        >
            <span class="twenty-one-task-icon">
                <i class="fas ${task.icon}"></i>
            </span>
            <span class="twenty-one-task-content">
                <strong>${task.title}</strong>
            </span>
            <span class="twenty-one-task-check">
                <i
                    class="fas ${
                        checked
                            ? 'fa-check-circle'
                            : 'fa-circle'
                    }"
                    data-21-task-check
                ></i>
            </span>
        </button>
    `;
}


function renderTwentyOneDaySection(dayNumber, section, dayData) {
    return `
        <section class="twenty-one-section">
            <div class="twenty-one-section-header">
                <div class="twenty-one-section-icon">
                    <i class="fas ${section.icon}"></i>
                </div>
                <div>
                    <h3>${section.title}</h3>
                    <p>${section.description}</p>
                </div>
            </div>
            <div class="twenty-one-task-list">
                ${section.tasks.map(task => renderTwentyOneDayTask(dayNumber, task, dayData)).join('')}
            </div>
        </section>
    `;
}


function renderTwentyOneDayHistory(data) {
    const days = Object.entries(data.days || {}).sort(([a], [b]) => Number(b) - Number(a));

    if (!days.length) {
        return `
            <div class="twenty-one-empty">
                <i class="fas fa-calendar-check"></i>
                <p>لم يتم تسجيل أيام بعد.</p>
            </div>
        `;
    }

    return `
        <div class="twenty-one-history">
            ${days.map(([dayNumber, day]) => {
                    const score = Number(day.score || 0);
                    const status = day.relapse
                            ? 'relapse'
                            : day.completed
                                ? 'complete'
                                : 'pending';

                    const icon = day.relapse
                            ? 'fa-exclamation-triangle'
                            : day.completed
                                ? 'fa-check-circle'
                                : 'fa-clock';

                    return `
                        <div
                            class="twenty-one-history-item ${status}"
                        >
                            <div class="twenty-one-history-day">
                                <span>اليوم</span>
                                <strong>
                                    ${twentyOneDayFormatNumber(
                                        dayNumber
                                    )}
                                </strong>
                            </div>
                            <div class="twenty-one-history-status">
                                <i class="fas ${icon}"></i>
                                <span>
                                    ${
                                        day.relapse
                                            ? 'تم تسجيل انتكاسة'
                                            : day.completed
                                                ? 'تم إكمال اليوم'
                                                : 'قيد التقدم'
                                    }
                                </span>
                            </div>
                            <strong
                                class="twenty-one-history-score"
                            >
                                ${twentyOneDayFormatNumber(
                                    score
                                )}
                            </strong>
                        </div>
                    `;
                }
            ).join('')}
        </div>
    `;
}


/* 
 * Introduction Page
 *  */

function renderTwentyOneDayIntroduction() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        return;
    }

    mainContent.innerHTML = `
        <div class="animate-fade-in twenty-one-page">
            <div class="twenty-one-hero">
                <div class="twenty-one-hero-icon">
                    <i class="fas fa-fire"></i>
                </div>
                <span class="twenty-one-badge">
                    تحدي 21 يوم
                </span>
                <h1>
                    أعد بناء انضباطك
                </h1>
                <p>
                    ثلاثة أسابيع من الالتزام اليومي المنظم
                    لبناء عادات أكثر وعيًا وتحكمًا.
                </p>
            </div>
            <div class="twenty-one-intro-card">
                <div class="twenty-one-intro-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div>
                    <h2>
                        شنو هو تحدي 21 يوم؟
                    </h2>
                    <p>
                        تحدي 21 يوم مو مجرد برنامج عابر،
                        وإنما رحلة يومية منظمة تساعدك على
                        بناء الانضباط خطوة بخطوة.
                    </p>
                </div>
            </div>
            <div class="twenty-one-chapters">
                <div class="twenty-one-chapter">
                    <span class="twenty-one-chapter-number">1</span>
                    <div>
                        <h3>
                            <i class="fas fa-brain"></i>
                            قطع المشتتات والمتع قصيرة المدى
                        </h3>
                        <p>
                            قلل من الأشياء التي تسحب تركيزك
                            وتشتتك عن أهدافك.
                        </p>
                        <ul>
                            <li>لا إباحية</li>
                            <li>تجنب السكر الزائد</li>
                            <li>لا تدخين</li>
                            <li>لا متابعة لما يسبب لك التشتت</li>
                            <li>تجنب المتع قصيرة المدى</li>
                        </ul>
                    </div>
                </div>
                <div class="twenty-one-chapter">
                    <span class="twenty-one-chapter-number">2</span>
                    <div>
                        <h3>
                            <i class="fas fa-sun"></i>
                            تحكم في صباحك
                        </h3>
                        <p>
                            صباحك هو بداية المعركة اليومية.
                        </p>
                        <ul>
                            <li>الاستيقاظ مبكرًا</li>
                            <li>التعرض لضوء الشمس</li>
                            <li>حمام بارد</li>
                            <li>تمرين لمدة 10 دقائق</li>
                            <li>20 دقيقة بدون إلهاء</li>
                        </ul>
                    </div>
                </div>
                <div class="twenty-one-chapter">
                    <span class="twenty-one-chapter-number">3</span>
                    <div>
                        <h3>
                            <i class="fas fa-dumbbell"></i>
                            الأشياء غير القابلة للتفاوض
                        </h3>
                        <p>ثوابت يومية تحافظ عليها مهما كان يومك.</p>
                        <ul>
                            <li>ممارسة الرياضة</li>
                            <li>قراءة 10 صفحات على الأقل</li>
                            <li>الأكل المنظم والنظيف</li>
                        </ul>
                    </div>
                </div>
                <div class="twenty-one-chapter">
                    <span class="twenty-one-chapter-number">4</span>
                    <div>
                        <h3>
                            <i class="fas fa-mobile-alt"></i>
                            الانضباط الرقمي
                        </h3>
                        <p>
                            لا تجعل الهاتف هو من يحدد بداية يومك.
                        </p>
                        <ul>
                            <li>لا هاتف في بداية الصباح</li>
                            <li>تجنب الإشعارات العشوائية</li>
                            <li>التواصل الاجتماعي بعد إنجاز المهام</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="twenty-one-quote">
                <i class="fas fa-quote-right"></i>
                <p>
                    الأفكار التي تقاتلها في صمت
                    هي التي تحررك.
                </p>
                <span>
                    اسأل نفسك: هل أفعالك في الواقع هي أفكارك؟
                </span>
            </div>


            <div class="twenty-one-warning">
                <div class="twenty-one-warning-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                    <h3>تحذير</h3>
                    <p>
                        غالبًا ستقرأ هذا الإرشاد وتوافق عليه ذهنيًا،
                        ثم تعود للتمرير بعد ثوانٍ وتنسى كل شيء.
                        التغيير لا يأتي من المعرفة وحدها،
                        بل من تطبيق يومي منظم وخطة واضحة.
                    </p>
                </div>
            </div>
            <div class="twenty-one-consent">
                <i class="fas fa-hand-pointer"></i>
                <h2>
                    قبل أن تبدأ
                </h2>
                <p>
                    موافقتك على الاستخدام تعني أنك ستسجل
                    تقدمك اليومي بصدق، وأي انتكاسة تسجلها
                    ستؤثر على تقييم اليوم والتقييم العام.
                </p>
                <button
                    type="button"
                    class="btn btn-primary btn-lg twenty-one-start-button"
                    onclick="confirmTwentyOneDayStart()"
                >
                    <i class="fas fa-play"></i>
                    أوافق وأبدأ التحدي
                </button>
            </div>
        </div>
    `;

    mainContent.scrollTop = 0;
}

/* 
 * Main Dashboard
 *  */

function renderTwentyOneDayDashboard(data) {
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        return;
    }

    const pronouns = twentyOneDayGetPronouns();
    const currentDay = twentyOneDayGetCurrentDay(data);
    const dayData = twentyOneDayGetDayData(data, currentDay);
    const totalTasks = twentyOneDayCountTasks();
    const completedTasks = twentyOneDayGetCompletedTaskCount(dayData);
    const todayScore = twentyOneDayCalculateDayScore(dayData);
    const overallScore = Number(data.totalScore || 0);
    const level = twentyOneDayGetLevel(overallScore);
    const progress = Math.round((currentDay / 21) * 100);
    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const remainingDays = Math.max(21 - currentDay, 0);
    const challengeCompleted = data.completed === true;
    const completedDays = Object.values(data.days || {}).filter(day => day.completed).length;

    mainContent.innerHTML = `
        <div class="animate-fade-in twenty-one-page">
            <div class="twenty-one-dashboard-header">
                <div>
                    <span class="twenty-one-badge">
                        <i class="fas fa-fire"></i>
                        تحدي 21 يوم
                    </span>
                    <h1>
                        ${pronouns.you} الآن في
                        اليوم ${twentyOneDayFormatNumber(currentDay)}
                    </h1>

                    <p data-21-header-description>
                        ${
                            challengeCompleted
                                ? 'مبروك، أكملت رحلة الـ21 يوم.'
                                : `${pronouns.continue} خطوة بخطوة ولا تستعجل النتيجة.`
                        }
                    </p>
                </div>
                <div class="twenty-one-dashboard-icon">
                    <i class="fas fa-trophy"></i>
                </div>
            </div>
            <div class="twenty-one-main-progress">
                <div class="twenty-one-progress-top">
                    <span>
                        تقدم التحدي
                    </span>
                    <strong data-21-progress>
                        ${twentyOneDayFormatNumber(progress)}%
                    </strong>
                </div>
                <div class="twenty-one-progress-bar">
                    <span
                        data-21-main-progress
                        style="width:${progress}%"
                    ></span>
                </div>
                <div class="twenty-one-progress-meta">
                    <span>
                        اليوم
                        ${twentyOneDayFormatNumber(currentDay)}
                        من ٢١
                    </span>
                    <span>
                        <span data-21-remaining-days>
                            ${twentyOneDayFormatNumber(remainingDays)}
                        </span>
                        يوم متبقي
                    </span>
                </div>
            </div>
            <div class="twenty-one-stats-grid">
                <div class="twenty-one-stat-card">
                    <div class="twenty-one-stat-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <strong data-21-overall-score>
                        ${twentyOneDayFormatNumber(overallScore)}
                    </strong>
                    <span>
                        التقييم العام
                    </span>
                </div>
                <div class="twenty-one-stat-card">
                    <div class="twenty-one-stat-icon">
                        <i
                            class="fas ${level.icon}"
                            data-21-level-icon
                        ></i>
                    </div>
                    <strong data-21-level>
                        ${level.title}
                    </strong>
                    <span>
                        المستوى
                    </span>
                </div>

                <div class="twenty-one-stat-card">
                    <div class="twenty-one-stat-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <strong data-21-total-relapses>
                        ${twentyOneDayFormatNumber(data.totalRelapses)}
                    </strong>
                    <span>
                        الانتكاسات
                    </span>
                </div>
                <div class="twenty-one-stat-card">
                    <div class="twenty-one-stat-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <strong data-21-completed-days>
                        ${twentyOneDayFormatNumber(completedDays)}
                    </strong>
                    <span>
                        أيام مكتملة
                    </span>
                </div>
            </div>
            <div class="twenty-one-today-card">
                <div class="twenty-one-today-header">
                    <div>
                        <span class="twenty-one-today-label">
                            اليوم
                            ${twentyOneDayFormatNumber(
                                currentDay
                            )}
                        </span>
                        <h2>
                            تقييم يومك
                        </h2>
                    </div>
                    <div
                        class="twenty-one-today-score"
                        data-21-today-score
                    >
                        ${twentyOneDayFormatNumber(todayScore)}
                    </div>
                </div>
                <div class="twenty-one-task-progress">
                    <div>
                        <span>
                            إنجاز المهام
                        </span>
                        <strong>
                            <span data-21-completed-tasks>
                                ${twentyOneDayFormatNumber(completedTasks)}
                            </span>
                            /
                            <span data-21-total-tasks>
                                ${twentyOneDayFormatNumber(totalTasks)}
                            </span>
                        </strong>
                    </div>
                    <div class="twenty-one-progress-bar small">
                        <span
                            data-21-task-progress
                            style="width:${taskProgress}%"
                        ></span>
                    </div>
                </div>
                ${TWENTY_ONE_DAY_TASKS.map(section => renderTwentyOneDaySection(currentDay, section, dayData)).join('')}
                <div class="twenty-one-actions">
                    <button
                        type="button"
                        class="btn btn-primary btn-lg"
                        onclick="completeTwentyOneDay()"
                    >
                        <i class="fas fa-save"></i>
                        حفظ تقييم اليوم
                    </button>
                    <div
                        data-21-relapse-action
                    >
                        ${
                            dayData.relapse
                                ? `
                                    <button
                                        type="button"
                                        class="btn btn-outline"
                                        onclick="undoTwentyOneDayRelapse()"
                                    >
                                        <i class="fas fa-undo"></i>
                                        إلغاء انتكاسة اليوم
                                    </button>
                                `
                                : `
                                    <button
                                        type="button"
                                        class="twenty-one-relapse-button"
                                        onclick="recordTwentyOneDayRelapse()"
                                    >
                                        <i class="fas fa-exclamation-triangle"></i>
                                        تسجيل انتكاسة
                                    </button>
                                `
                        }
                    </div>
                </div>
            </div>
            <div class="twenty-one-message-card">
                <i class="fas fa-quote-right"></i>
                <p>
                    الانضباط هو هويتك الجديدة.
                </p>
                <span>
                    لا تبحث عن الكمال، ابحث عن الاستمرار.
                </span>
            </div>
            <div class="twenty-one-history-card">
                <div class="twenty-one-history-header">
                    <div>
                        <i class="fas fa-history"></i>
                        <h2>
                            سجل التحدي
                        </h2>
                    </div>
                </div>
                <div data-21-history>
                    ${renderTwentyOneDayHistory(data)}
                </div>
            </div>
        </div>
    `;

    mainContent.scrollTop = 0;
}


/* 
 * Smart DOM Updates (Fixing Bugs)
 * */

/**
 * Update the challenge UI without rebuilding the entire page.
 * This keeps the current scroll position, button state,
 * animations and event handlers stable.
 */

function updateTwentyOneDayUI() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        return;
    }

    const data = twentyOneDayLoad();

    if (!data || data.accepted !== true) {
        return;
    }

    const currentDay = twentyOneDayGetCurrentDay(data);
    const dayData = twentyOneDayGetDayData(data, currentDay);

    // twentyOneDayRefreshStatistics(data);
    // twentyOneDaySave(data);

    updateTwentyOneDayProgressUI(data, currentDay);
    updateTwentyOneDayStatsUI(data);
    updateTwentyOneDayTodayUI(data, currentDay, dayData);
    updateTwentyOneDayTasksUI(data, currentDay, dayData);
    updateTwentyOneDayActionsUI(dayData);
    updateTwentyOneDayHistoryUI(data);
}

/**
 * Update main challenge progress.
 */

function updateTwentyOneDayProgressUI(data, currentDay) {
    const progress = Math.round((currentDay / 21) * 100);
    const remainingDays = Math.max(21 - currentDay, 0);
    const progressValue = document.querySelector('.twenty-one-main-progress strong');

    if (progressValue) {
        progressValue.textContent = twentyOneDayFormatNumber(progress) + '%';
    }

    const progressBar = document.querySelector('.twenty-one-main-progress .twenty-one-progress-bar span');

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    const meta = document.querySelectorAll('.twenty-one-progress-meta span');

    if (meta.length >= 2) {
        meta[0].textContent = `اليوم ${twentyOneDayFormatNumber(currentDay)} من ٢١`;
        meta[1].textContent = `${twentyOneDayFormatNumber(remainingDays)} يوم متبقي`;
    }
}


/**
 * Update statistics cards.
 */

function updateTwentyOneDayStatsUI(data) {
    const overallScore = Number(data.totalScore || 0);
    const level = twentyOneDayGetLevel(overallScore);
    const completedDays = Object.values(data.days || {}).filter(day => day.completed).length;
    const stats = document.querySelectorAll('.twenty-one-stat-card');

    if (stats.length < 4) {
        return;
    }

    // Overall score
    const scoreElement = stats[0].querySelector('strong');

    if (scoreElement) {
        scoreElement.textContent = twentyOneDayFormatNumber(overallScore);
    }

    // Level
    const levelElement = stats[1].querySelector('strong');

    if (levelElement) {
        levelElement.textContent = level.title;
    }

    const levelIcon = stats[1].querySelector('.twenty-one-stat-icon i');

    if (levelIcon) {
        levelIcon.className = `fas ${level.icon}`;
    }

    // Relapses
    const relapseElement = stats[2].querySelector('strong');

    if (relapseElement) {
        relapseElement.textContent = twentyOneDayFormatNumber(data.totalRelapses || 0);
    }

    // Completed days
    const completedDaysElement = stats[3].querySelector('strong');

    if (completedDaysElement) {
        completedDaysElement.textContent = twentyOneDayFormatNumber(completedDays);
    }
}


/**
 * Update today's score and task progress.
 */

function updateTwentyOneDayTodayUI(data, currentDay, dayData) {
    const totalTasks = twentyOneDayCountTasks();
    const completedTasks = twentyOneDayGetCompletedTaskCount(dayData);
    const todayScore = twentyOneDayCalculateDayScore(dayData);
    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const todayScoreElement = document.querySelector('.twenty-one-today-score');

    if (todayScoreElement) {
        todayScoreElement.textContent = twentyOneDayFormatNumber(todayScore);
    }

    const taskProgressContainer = document.querySelector('.twenty-one-task-progress');

    if (taskProgressContainer) {
        const strong = taskProgressContainer.querySelector('strong');

        if (strong) {
            strong.textContent = `${twentyOneDayFormatNumber(completedTasks)} / ${twentyOneDayFormatNumber(totalTasks)}`;
        }

        const progress = taskProgressContainer.querySelector('.twenty-one-progress-bar span');

        if (progress) {
            progress.style.width = `${taskProgress}%`;
        }
    }
}


/**
 * Update task buttons only.
 */

function updateTwentyOneDayTasksUI(data, currentDay, dayData) {
    document.querySelectorAll('.twenty-one-task').forEach(button => {
            const onclick = button.getAttribute('onclick');

            if (!onclick) {
                return;
            }

            const match = onclick.match(/toggleTwentyOneDayTask\(\s*\d+\s*,\s*['"]([^'"]+)['"]\s*\)/);

            if (!match) {
                return;
            }

            const taskId = match[1];
            const checked = Boolean(dayData.tasks && dayData.tasks[taskId]);

            button.classList.toggle('is-complete', checked);

            const icon = button.querySelector('.twenty-one-task-check i');

            if (icon) {
                icon.className = checked
                        ? 'fas fa-check-circle'
                        : 'fas fa-circle';
            }
        });
}

/**
 * Update relapse buttons.
 */

function updateTwentyOneDayActionsUI(dayData) {
    const actions = document.querySelector('.twenty-one-actions');

    if (!actions) {
        return;
    }

    const existingRelapseButton = actions.querySelector('.twenty-one-relapse-button');
    const existingUndoButton = actions.querySelector('[onclick*="undoTwentyOneDayRelapse"]');

    if (dayData.relapse) {
        if (!existingUndoButton) {
            const undoButton = document.createElement('button');

            undoButton.type = 'button';
            undoButton.className = 'btn btn-outline';
            undoButton.innerHTML = `<i class="fas fa-undo"></i>إلغاء انتكاسة اليوم`;
            undoButton.addEventListener('click', undoTwentyOneDayRelapse);

            actions.appendChild( undoButton);
        }

        if (existingRelapseButton) {
            existingRelapseButton.remove();
        }

    } else {
        if (!existingRelapseButton) {
            const relapseButton = document.createElement('button');

            relapseButton.type = 'button';
            relapseButton.className = 'twenty-one-relapse-button';
            relapseButton.innerHTML = `<i class="fas fa-exclamation-triangle"></i>تسجيل انتكاسة`;
            relapseButton.addEventListener('click',recordTwentyOneDayRelapse);

            actions.appendChild(relapseButton);
        }

        if (existingUndoButton) {
            existingUndoButton.remove();
        }
    }
}


/**
 * (Fixing Bugs)
 * Update challenge history.
 * History is rebuilt separately from the entire page,
 * so only this small section changes.
 */

function updateTwentyOneDayHistoryUI(data) {
    const historyCard = document.querySelector('.twenty-one-history-card');

    if (!historyCard) {
        return;
    }

    const history = historyCard.querySelector('.twenty-one-history');
    const empty = historyCard.querySelector('.twenty-one-empty');
    const html = renderTwentyOneDayHistory(data);

    if (history) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const newHistory = temp.querySelector('.twenty-one-history');

        if (newHistory) {
            history.replaceWith(newHistory);
        }

        return;
    }

    if (empty) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        const newElement = temp.firstElementChild;
        if (newElement) {
            empty.replaceWith(newElement);
        }
        return;
    }

    const header = historyCard.querySelector('.twenty-one-history-header');

    if (header) {
        header.insertAdjacentHTML('afterend', html);
    }
}


/* 
 * Main Render Function
 *  */

function renderTwentyOneDayPage() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
        return;
    }

    mainContent.innerHTML = '';
    const data = twentyOneDayLoad();

    if (!data || data.accepted !== true) {
        renderTwentyOneDayIntroduction();
        return;
    }

    /*
     * Full render happens only when the page
     * is actually opened.
     * Daily interactions use smart DOM updates.
     */

    twentyOneDayRefreshStatistics(data);
    twentyOneDaySave(data);
    renderTwentyOneDayDashboard(data);
    mainContent.scrollTop = 0;
}

/* 
 * Reset
 **/

function resetTwentyOneDayChallenge() {
    const confirmed = confirm('هل تريد حذف تحدي 21 يوم بالكامل؟\n\n' + 'سيتم حذف جميع الأيام والتقييمات والانتكاسات.');

    if (!confirmed) {
        return;
    }

    try {
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.remove === 'function') {
            StorageManager.remove(TWENTY_ONE_DAY_STORAGE_KEY);
        } else {
            localStorage.removeItem(TWENTY_ONE_DAY_STORAGE_KEY);
        }

    } catch (error) {
        console.error('Failed to reset 21-Day Challenge:', error);
    }

    showToast('تم حذف تحدي 21 يوم');
    renderTwentyOneDayPage();
}

/* 
 * Public API
 **/

window.renderTwentyOneDayPage = renderTwentyOneDayPage;
window.startTwentyOneDayChallenge = startTwentyOneDayChallenge;
window.confirmTwentyOneDayStart = confirmTwentyOneDayStart;
window.toggleTwentyOneDayTask = toggleTwentyOneDayTask;
window.recordTwentyOneDayRelapse = recordTwentyOneDayRelapse;
window.undoTwentyOneDayRelapse = undoTwentyOneDayRelapse;
window.completeTwentyOneDay = completeTwentyOneDay;
window.resetTwentyOneDayChallenge = resetTwentyOneDayChallenge;
window.twentyOneDaySmartRefresh = twentyOneDaySmartRefresh;