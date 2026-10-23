/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : home.js
 * Type: JavaScript
 */

// Names of the days of the week
const weekDays = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت'
];

// Names of the Islamic months
const hijriMonths = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الثاني',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة'
];

// Names of the months of the Gregorian calendar
const gregorianMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'إبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر'
];

// Names used in (Iraq)
const gregorianMonthsAlt = [
    'كانون الثاني',
    'شباط',
    'آذار',
    'نيسان',
    'أيار',
    'حزيران',
    'تموز',
    'آب',
    'أيلول',
    'تشرين الأول',
    'تشرين الثاني',
    'كانون الأول'
];

/** 
 * API
 */

const HIJRI_API_URL =
    'https://mumineen.org/api/v1/calendar/';

// System variables

let dateInterval = null;
let recoveryCounterInterval = null;
let lastFetchedDate = null;

// Converting numbers to Arabic

function toArabicNumbers(value) {
    return String(value).replace(
        /\d/g,
        digit => '٠١٢٣٤٥٦٧٨٩'[digit]
        // digit => '0123456789'[digit]
    );
}

// Obtaining the Gregorian date in (API) format

function getGregorianDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Displaying the Hijri date

function displayHijriDate(year, month, day) {
    const element = document.getElementById('hijri-date');
    if (!element) return;
    const monthNumber = parseInt(month, 10);
    const monthName = hijriMonths[monthNumber - 1] || 'غير معروف';

    element.innerHTML = `
        <span class="date-value">
            ${toArabicNumbers(year)}-${toArabicNumbers(String(monthNumber).padStart(2, '0'))}-${toArabicNumbers(day)}
        </span>
        <span class="date-month">${monthName}</span>
    `;
}

// Correction of the two-day difference in the displayed Hijri date only (Fixing Bugs)
// (-2) days
function subtractTwoHijriDays(year, month, day) {
    let hijriYear = parseInt(year, 10);
    let hijriMonth = parseInt(month, 10);
    let hijriDay = parseInt(day, 10) - 2;

    while (hijriDay <= 0) {
        hijriMonth--;

        if (hijriMonth <= 0) {
            hijriMonth = 12;
            hijriYear--;
        }

        // The Islamic months usually alternate between 30 and 29 days.
        const previousMonthDays = hijriMonth % 2 === 1 ? 30 : 29;
        hijriDay += previousMonthDays;
    }

    return {
        year: hijriYear,
        month: hijriMonth,
        day: hijriDay
    };
}

// Retrieve the Hijri date from the API

async function fetchHijriDate(date) {
    const dateString = getGregorianDateString(date);

    try {
        const response = await fetch(
            `${HIJRI_API_URL}${dateString}?greg=true`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        /*
         * API:
         * hijri_date: "1447-07-11"
         * or:
         * hijri_year
         * hijri_month
         * hijri_day_arabic
         */

        if (!data || !data.hijri_date) {
            throw new Error('التاريخ الهجري غير موجود في استجابة API');
        }

        const parts =
            data.hijri_date.split('-');

        if (parts.length !== 3) {
            throw new Error(
                'صيغة التاريخ الهجري غير صحيحة'
            );
        }

        const hijriYear = parts[0];
        const hijriMonth = parts[1];
        const hijriDay = parts[2];
        const correctedHijriDate = subtractTwoHijriDays(hijriYear, hijriMonth, hijriDay);

        displayHijriDate(correctedHijriDate.year, correctedHijriDate.month, correctedHijriDate.day);
        lastFetchedDate = dateString;
        console.log('التاريخ الهجري:', data.hijri_date);
        return true;

    } catch (error) {
        console.warn('فشل جلب التاريخ الهجري من API:', error);

        /*
         * In case of internet failure
         * We use the local account.
         */

        const hijri = gregorianToHijriLocal(date);
        const correctedHijriDate = subtractTwoHijriDays(hijri.year, hijri.month, hijri.day);
        displayHijriDate(correctedHijriDate.year, correctedHijriDate.month, correctedHijriDate.day);

        /*
         * We do not save the date in
         * lastFetchedDate here,
         * until the API is attempted
         * again.
         */

        return false;
    }
}

// Update Timer

function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const period = hours >= 12
            ? 'مساءً'
            : 'صباحاً';

    hours = hours % 12 || 12;
    const timeString = `${hours}:${minutes}:${seconds} ${period}`;
    const timeElement = document.getElementById('current-time');
    const dayElement = document.getElementById('current-day');

    if (timeElement) {
        timeElement.textContent = timeString;
    }

    if (dayElement) {
        dayElement.textContent = weekDays[now.getDay()];
    }
}

// Update the Gregorian calendar

function updateGregorianDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const element = document.getElementById('gregorian-date');
    if (!element) return;

    element.innerHTML = `
        <span class="date-value">
            ${toArabicNumbers(year)}-${toArabicNumbers(month + 1)}-${toArabicNumbers(day)}
        </span>
        <span class="date-month">${gregorianMonths[month]} - ${gregorianMonthsAlt[month]}</span>
    `;
}

// Date Update

async function updateDate() {
    const now = new Date();
    updateGregorianDate(); // Gregorian calendar
    const currentDate = getGregorianDateString(now); // Current date

    /*
     * API requested only once
     * Per day.
     */

    if (lastFetchedDate !== currentDate) {
        await fetchHijriDate(now);
    }
}

// Local Reserve Account

function gregorianToHijriLocal(date) {
    const gDate = new Date(date);
    const gDay = gDate.getDate();
    const gMonth = gDate.getMonth() + 1;
    const gYear = gDate.getFullYear();

    let jd;
    if ((gYear > 1582) || (gYear === 1582 && gMonth > 10) || (gYear === 1582 && gMonth === 10 && gDay > 14)) {
        jd = Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) + Math.floor((
                    367 * (gMonth - 2 - 12 * Math.floor((gMonth - 14) / 12))) / 12) - Math.floor((3 * Math.floor((
                            gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100)) / 4) + gDay - 32075;

    } else {
        jd = 367 * gYear - Math.floor((7 *(gYear + 5001 + Math.floor((gMonth - 9) / 7))) / 4) + Math.floor((275 * gMonth) / 9) + gDay + 1729777;
    }

    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const hMonth = Math.floor((24 * l3) / 709);
    const hDay = l3 - Math.floor((709 * hMonth) / 24);
    const hYear = 30 * n + j - 30;

    return {
        day: hDay, month: hMonth, year: hYear
    };
}

// Start the system

function startDateUpdates() {
    // Stop any previous timer
    if (dateInterval) {
        clearInterval(dateInterval);
        dateInterval = null;
    }

    /** 
     * Very important:
     * When returning to the homepage, new
     * HTML elements are created, so the date must be requested again.
     */
    lastFetchedDate = null;

    // Live update
    updateTime();
    updateDate();

    // Time updated every second
    dateInterval = setInterval(() => {
        updateTime();
        const now = new Date();
        const currentDate = getGregorianDateString(now);

        // If the day changes
        if (lastFetchedDate !== currentDate) {
            updateDate();
        }

    }, 1000);
}

// System shutdown

function stopDateUpdates() {
    if (dateInterval) {
        clearInterval(dateInterval);
        dateInterval = null;
    }

    if (recoveryCounterInterval) {
        clearInterval(recoveryCounterInterval);
        recoveryCounterInterval = null;
    }
}

/** Date and Time Display Feature
 * Hijri + Gregorian
 * API: Mumineen MDO API
 * Names of the days of the week in Arabic
 */

/**
 * Update only the recovery card's values.
 * The homepage itself is not rebuilt.
 */

function updateHomeRecoveryCard() {
    const card = document.getElementById('home-recovery-card');

    if (!card) {
        return;
    }

    if (
        typeof RecoveryCounter === 'undefined' || typeof RecoveryCounter.getRecoveryStats !== 'function') {
        return;
    }

    const stats = RecoveryCounter.getRecoveryStats();

    if (!stats || !stats.isActive) {
        card.remove();
        return;
    }

    const counter = document.getElementById('home-counter');
    if (counter) {
        counter.textContent = stats.days;
    }

    const values = card.querySelectorAll('.home-recovery-stat-value');

    if (values[0]) values[0].textContent = stats.weeks;
    if (values[1]) values[1].textContent = stats.months;
    if (values[2]) values[2].textContent = stats.years;
}

/**
 * Install the listener once.
 * When recovery starts, the visible home page updates immediately.
 */
if (!window.__taeafiRecoveryHomeListener) {
    window.__taeafiRecoveryHomeListener = true;
    window.addEventListener('recoveryUpdated', function () {
        if (typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function' && Router.getCurrentPage() === 'home') {
            updateHomeRecoveryCard();
        }
    });
}

function handleUpdateBarClick() {
    if (typeof navigateTo === 'function') {
        navigateTo('settings');
    }

    setTimeout(function () {
        var el = document.getElementById('update-status');
        if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.style.transition = 'box-shadow 0.3s ease';
            el.style.boxShadow = '0 0 0 4px var(--primary-light)';
            setTimeout(function () {
                el.style.boxShadow = '';
            }, 1800);
        }
    }, 500);
}

function renderHomePage() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Unpacking old content
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    const user = typeof StorageManager !== 'undefined' && typeof StorageManager.getUser === 'function'
        ? StorageManager.getUser() : null;
    const stats = typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getRecoveryStats === 'function'
        ? RecoveryCounter.getRecoveryStats() : null;
    const recoveryStats = stats || { isActive: false, days: 0, weeks: 0, months: 0, years: 0 };

    // Check for update
    var hasUpdate = false;
    var updateVersion = '';
    

    // Read current app version from version.txt (loaded by settings.js)
    var storedVersion =
        (typeof ApplicationVersion !== 'undefined' ? ApplicationVersion : null) ||
        localStorage.getItem('app_version') ||
        null;

    // Read stored update flag
    var storedUpdate = null;
    try {
        storedUpdate = (typeof StorageManager !== 'undefined' && typeof StorageManager.get === 'function')
            ? StorageManager.get('update_available')
            : null;
    } catch (e) {}

    // Normalize stored value: it might be object, string-JSON, or plain string
    var updateData = null;
    if (storedUpdate) {
        if (typeof storedUpdate === 'object' && storedUpdate !== null) {
            updateData = storedUpdate;
        } else if (typeof storedUpdate === 'string') {
            try {
                updateData = JSON.parse(storedUpdate);
            } catch (e) {
                updateData = { version: storedUpdate.trim() };
            }
        }
    }

    // Validate and set flags
    if (updateData && updateData.version) {
        // Show only if the remote version is different from what we know locally
        if (!storedVersion || updateData.version !== storedVersion) {
            hasUpdate = true;
            updateVersion = updateData.version;
        }
    }

    // Suppress the bar if user dismissed it recently (within 3 days)
    if (hasUpdate) {
        try {
            var lastDismissed = StorageManager.get('update_notification_dismissed');
            if (lastDismissed && (Date.now() - Number(lastDismissed)) < 3 * 86400000) {
                // But if the version is NEWER than the one dismissed, show it anyway
                var dismissedVersion = StorageManager.get('update_dismissed_version');
                if (dismissedVersion === updateVersion) {
                    hasUpdate = false;
                }
            }
        } catch (e) {}
    }
    // End update check

    // Container creation
    const container = document.createElement('div');
    container.className = 'animate-fade-in';
    container.innerHTML = `
        <style>
            .update-notification-bar{
                display:flex;
                align-items:center;
                justify-content:space-between;
                background:linear-gradient(90deg,#fff8e1,#fff3cd);
                border:1px solid rgba(0,0,0,0.06);
                padding:8px 12px;
                border-radius:8px;
                cursor:pointer;
                box-shadow:0 2px 6px rgba(0,0,0,0.04);
                gap:10px;
                margin-bottom:12px;
            }
            .update-dot{ width:10px; height:10px; background:#ff3b30; border-radius:50%; flex:0 0 auto; }
            .update-text{ display:flex; flex-direction:column; gap:2px; flex:1; font-size:13px; color:#3b3b3b; }
            .update-text small{ color:#666; font-size:11px; }
            .update-arrow{ font-size:12px; opacity:0.7; }
            .update-close-btn{ background:transparent; border:none; color:#666; cursor:pointer; padding:6px; border-radius:6px }
            .update-close-btn i{ font-size:12px }
            .update-notification-bar:hover{ box-shadow:0 4px 12px rgba(0,0,0,0.08) }
        </style>

        <div class="mb-6">
            <h1 class="font-bold">مرحباً ${user?.name || ''}</h1>
            <p class="text-secondary mt-2">كل يوم هو فرصة جديدة للتغيير</p>
        </div>
    
        <div class="search-bar-container" onclick="(window.SearchEngine && SearchEngine.showSearchUI) ? SearchEngine.showSearchUI() : null">
            <div class="search-bar">
                <i class="fas fa-search" style="color: var(--text-tertiary); margin-left: 8px;"></i>
                <span style="color: var(--text-disabled);">ابحث عن عادة، دعاء، أو أي محتوى...</span>
                <kbd style="margin-right: auto; background: var(--surface-variant); padding: 2px 8px; border-radius: 4px; font-size: 11px; color: var(--text-tertiary);">Ctrl+K</kbd>
            </div>
        </div>

        ${(typeof XPBar !== 'undefined' && typeof XPBar.buildHTML === 'function') ? XPBar.buildHTML() : ''}

        ${hasUpdate ? `
            <div class="update-notification-bar" id="update-notification-bar" onclick="handleUpdateBarClick()">
                <span class="update-dot"></span>
                <div class="update-text">
                    <strong>يوجد تحديث جديد — v${updateVersion}</strong>
                    <small>اضغط للاطلاع على التفاصيل</small>
                </div>
                <i class="fas fa-arrow-left update-arrow"></i>
                <button type="button" class="update-close-btn" onclick="event.stopPropagation(); dismissUpdateNotification();" aria-label="إغلاق">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        ` : ''}

        <div class="dual-date-container" id="dual-date">
            <div class="date-header">
                <span class="current-day" id="current-day">--</span>
                <span class="current-time" id="current-time">--:--:-- --</span>
            </div>
            <div class="date-cards">
                <div class="date-card hijri-card" id="hijri-date">
                    <span class="date-value">----</span>
                    <span class="date-month">----</span>
                </div>
                <div class="date-card gregorian-card" id="gregorian-date">
                    <span class="date-value">----</span>
                    <span class="date-month">----</span>
                </div>
            </div>
        </div>
        
        ${recoveryStats.isActive ? `
            <div class="counter-card" id="home-recovery-card" onclick="navigateTo('recovery')">
                <i class="fas fa-calendar-check" style="font-size: 32px; margin-bottom: 12px;"></i>
                <h3>رحلة التعافي مستمرة</h3>
                <div class="counter-value" id="home-counter">${recoveryStats.days}</div>
                <p>يوم منذ بداية رحلتك</p>
                <div class="counter-stats">
                    <div class="stat-item">
                        <div class="stat-value home-recovery-stat-value">${recoveryStats.weeks}</div>
                        <div class="stat-label">أسبوع</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value home-recovery-stat-value">${recoveryStats.months}</div>
                        <div class="stat-label">شهر</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value home-recovery-stat-value">${recoveryStats.years}</div>
                        <div class="stat-label">سنة</div>
                    </div>
                </div>
            </div>
        ` : ''}
            
            <div class="cards-grid">
                <div class="card" onclick="navigateTo('habits')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E0F2F1; color: #0D6B6E;">
                            <i class="fas fa-hands"></i>
                        </div>
                        <div>
                            <h3 class="card-title">العادات</h3>
                            <p class="text-sm text-secondary">تعرف على العادات وتأثيرها</p>
                        </div>
                    </div>
                    <p class="card-description">معلومات شاملة وموثقة عن 22 عادة ضارة</p>
                </div>
                
                <div class="card" onclick="navigateTo('spiritual')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E8F5E9; color: #4CAF50;">
                            <i class="fas fa-mosque"></i>
                        </div>
                        <div>
                            <h3 class="card-title">التحصين الإيماني</h3>
                            <p class="text-sm text-secondary">تقوية الجانب الروحي</p>
                        </div>
                    </div>
                    <p class="card-description">أذكار، أدعية، آيات قرآنية، ونصائح لتقوية الإرادة</p>
                </div>
                
                <div class="card" onclick="navigateTo('recovery')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #F44336;">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div>
                            <h3 class="card-title">متابعة التعافي</h3>
                            <p class="text-sm text-secondary">تتبع رحلتك خطوة بخطوة</p>
                        </div>
                    </div>
                    <p class="card-description">عداد أيام، مراحل التحسن، رسائل تحفيزية، ودعم مستمر</p>
                </div>
                
                <div class="card" onclick="navigateTo('forgetfulness')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #F3E5F5; color: #9C27B0;">
                            <i class="fas fa-person-praying"></i>
                        </div>
                        <div>
                            <h3 class="card-title">مساعد الصلاة</h3>
                            <p class="text-sm text-secondary">تذكيرات وأوقات</p>
                        </div>
                    </div>
                    <p class="card-description">مساعد شامل لأوقات الصلاة والتذكيرات اليومية</p>
                </div>


            </div>
            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-toolbox" style="margin-left: 8px;"></i>
                أدوات مساعدة
            </h2>
            <div class="cards-grid">
                <div class="card" onclick="navigateTo('stats')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E3F2FD; color: #2196F3;">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الإحصائيات</h3>
                            <p class="text-sm text-secondary">تقدمك بالأرقام</p>
                        </div>
                    </div>
                    <p class="card-description">رسوم بيانية، إنجازات، وإحصائيات رحلة التعافي</p>
                </div>
                
                <div class="card" onclick="navigateTo('quiz')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF3E0; color: #FF9800;">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <div>
                            <h3 class="card-title">تقييم ذاتي</h3>
                            <p class="text-sm text-secondary">اعرف مستواك</p>
                        </div>
                    </div>
                    <p class="card-description">اختبار سريع لتقييم حالتك الحالية وتحديد مستوى الخطر</p>
                </div>
                
                <div class="card" onclick="handleBackup()">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E8F5E9; color: #4CAF50;">
                            <i class="fas fa-cloud-arrow-up"></i>
                        </div>
                        <div>
                            <h3 class="card-title">نسخ احتياطي</h3>
                            <p class="text-sm text-secondary">حافظ على بياناتك</p>
                        </div>
                    </div>
                    <p class="card-description">تصدير واستيراد جميع بياناتك بسهولة</p>
                </div>
            </div>

            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-star" style="margin-left: 8px; color: #FFD700;"></i>
                المزيد
            </h2>
            <div class="cards-grid">
                <div class="card" onclick="navigateTo('prayer-box')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #F3E5F5; color: #4A148C;">
                            <i class="fas fa-hands-praying"></i>
                        </div>
                        <div>
                            <h3 class="card-title">صندوق دعائي</h3>
                            <p class="text-sm text-secondary">أدعيتك الخاصة</p>
                        </div>
                    </div>
                    <p class="card-description">احفظ أدعيتك المفضلة وعد إليها كلما أردت</p>
                </div>
                
                <div class="card" onclick="navigateTo('calendar')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E8F5E9; color: #4CAF50;">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div>
                            <h3 class="card-title">روزنامة التعافي</h3>
                            <p class="text-sm text-secondary">تقويم بصري</p>
                        </div>
                    </div>
                    <p class="card-description">شاهد أيام تعافيك باللون الأخضر والانتكاسات بالأحمر</p>
                </div>
                
                <div class="card" onclick="navigateTo('21-day')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #F44336;">
                            <i class="fas fa-fire"></i>
                        </div>
                        <div>
                            <h3 class="card-title">تحدي 21 يوم</h3>
                            <p class="text-sm text-secondary">اختبر عزيمتك</p>
                        </div>
                    </div>
                    <p class="card-description">تحدي مكثف لمدة 21 يوم لتقوية إرادتك والتغلب على الإدمان</p>
                </div>
            </div>

            <h2 class="section-title" style="margin-top:32px;">
                <i class="fas fa-heartbeat" style="margin-left:8px;color:#4CAF50;"></i>
                الصحة والرياضة
            </h2>
            <div class="cards-grid">
                <div class="card" onclick="navigateTo('nutrition')">
                    <div class="card-header">
                        <div class="card-icon" style="background:#FFF3E0;color:#FF9800;">
                            <i class="fas fa-utensils"></i>
                        </div>
                        <div>
                            <h3 class="card-title">التغذية الصحية</h3>
                            <p class="text-sm text-secondary">وجبات يومية متكاملة</p>
                        </div>
                    </div>
                    <p class="card-description">365 يوم من الوجبات الصحية مع بدائل ورياضة مصاحبة</p>
                </div>
                
                <div class="card" onclick="navigateTo('exercises')">
                    <div class="card-header">
                        <div class="card-icon" style="background:#E8F5E9;color:#4CAF50;">
                            <i class="fas fa-dumbbell"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الرياضة اليومية</h3>
                            <p class="text-sm text-secondary">تمارين مخصصة</p>
                        </div>
                    </div>
                    <p class="card-description">خطة أسبوعية للرجال والنساء مع مراعاة الدورة الشهرية</p>
                </div>
                
                <div class="card" onclick="navigateTo('food-conflicts')">
                    <div class="card-header">
                        <div class="card-icon" style="background:#FCE4EC;color:#F44336;">
                            <i class="fas fa-skull-crossbones"></i>
                        </div>
                        <div>
                            <h3 class="card-title">تعارضات الطعام</h3>
                            <p class="text-sm text-secondary">تجنب مشاكل المعدة</p>
                        </div>
                    </div>
                    <p class="card-description">قائمة الأطعمة التي يجب تجنب تناولها معاً</p>
                </div>
            </div>

            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-book-open" style="margin-left: 8px; color: #4A148C;"></i>
                أدعية وزيارات
            </h2>
            <div class="cards-grid">
                <div class="card" onclick="navigateTo('duas')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #F3E5F5; color: #4A148C;">
                            <i class="fas fa-hands-praying"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الأدعية</h3>
                            <p class="text-sm text-secondary">أدعية مأثورة</p>
                        </div>
                    </div>
                    <p class="card-description">دعاء كميل، الندبة، الصباح، الجوشن، مكارم الأخلاق وغيرها</p>
                </div>
                
                <div class="card" onclick="navigateTo('duas')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E0F2F1; color: #0D6B6E;">
                            <i class="fas fa-kaaba"></i>
                        </div>
                        <div>
                            <h3 class="card-title">الزيارات</h3>
                            <p class="text-sm text-secondary">زيارات مباركة</p>
                        </div>
                    </div>
                    <p class="card-description">زيارة عاشوراء، الجامعة، آل ياسين، الأربعين وغيرها</p>
                </div>
            </div>

            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-puzzle-piece" style="margin-left: 8px; color: #E91E63;"></i>
                أدوات تفاعلية
            </h2>
            <div class="cards-grid">
                <div class="card" onclick="navigateTo('leaderboard')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FFF8E1; color: #FFD700;">
                            <i class="fas fa-crown"></i>
                        </div>
                        <div>
                            <h3 class="card-title">لوحة المتصدرين</h3>
                            <p class="text-sm text-secondary">سجلاتك وإنجازاتك</p>
                        </div>
                    </div>
                    <p class="card-description">نقاط، مستويات، تحديات أسبوعية، وسجلات شخصية</p>
                </div>
                
                <div class="card" onclick="navigateTo('journal')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #E91E63;">
                            <i class="fas fa-pen-fancy"></i>
                        </div>
                        <div>
                            <h3 class="card-title">مذكراتي اليومية</h3>
                            <p class="text-sm text-secondary">عبّر عن مشاعرك</p>
                        </div>
                    </div>
                    <p class="card-description">مساحة شخصية لكتابة الأفكار والمشاعر يومياً</p>
                </div>

                <div class="card" onclick="navigateTo('relapse-analysis')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #F44336;">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <div>
                            <h3 class="card-title">تحليل الانتكاسات</h3>
                            <p class="text-sm text-secondary">افهم أنماطك</p>
                        </div>
                    </div>
                    <p class="card-description">اكتشف محفزاتك وأوقاتك الخطرة لتجنبها</p>
                </div>

                <div class="card" onclick="openHormonalMonitor()">
                    <div class="card-header">
                        <div class="card-icon" style="background: #FCE4EC; color: #E91E63;">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <div>
                            <h3 class="card-title">مراقبة التغيرات الهرمونية</h3>
                            <p class="text-sm text-secondary">تتبع دورتك / مؤشراتك</p>
                        </div>
                    </div>
                    <p class="card-description">
                        سجل التغيرات الهرمونية وتحليل الأنماط برسوم بيانية وتقارير احتمالية
                    </p>
                </div>
                
                <div class="card" onclick="navigateTo('breath')">
                    <div class="card-header">
                        <div class="card-icon" style="background: #E0F7FA; color: #00BCD4;">
                            <i class="fas fa-wind"></i>
                        </div>
                        <div>
                            <h3 class="card-title">تحدي النفس</h3>
                            <p class="text-sm text-secondary">استرخِ وتحدَّ نفسك</p>
                        </div>
                    </div>
                    <p class="card-description">تمرين تنفس تفاعلي للاسترخاء وكسب نقاط الإرادة</p>
                </div>
            </div>
            </div>
        </div>
    `;

    mainContent.appendChild(container);
    
    if (dateInterval) clearInterval(dateInterval);
    startDateUpdates();

    // Initialize XP bar with auto-refresh
    if (typeof XPBar !== 'undefined') {
        setTimeout(function () {
            if (typeof XPBar.inject === 'function') {
                XPBar.inject();
            }
            if (typeof XPBar.startAutoRefresh === 'function') {
                XPBar.startAutoRefresh();
            }
            if (typeof XPBar.refresh === 'function') {
                XPBar.refresh();
            }
        }, 200);
    }
    
    /** 
     * Update recovery counter every minute.
     * The card itself is updated immediately by the recoveryUpdated event.
     */

    if (recoveryStats.isActive) {
        recoveryCounterInterval = setInterval(() => {
            updateHomeRecoveryCard();
        }, 60000);
    }
}

/**
 * Dismiss the update notification bar.
 * Smoothly animates it out, then removes it.
 * Persists a dismissal timestamp (used for "remind me after X days").
 */
function dismissUpdateNotification() {
    var bar = document.getElementById('update-notification-bar');
    if (!bar) return;

    bar.classList.add('dismissing');

    setTimeout(function () {
        if (bar.parentNode) bar.parentNode.removeChild(bar);
    }, 320);

    if (typeof StorageManager !== 'undefined' && typeof StorageManager.set === 'function') {
        StorageManager.set('update_notification_dismissed', Date.now());

        // Store the version so we can show the bar again if a newer version arrives
        var stored = typeof StorageManager.get === 'function'
            ? StorageManager.get('update_available') : null;
        var version = null;
        if (stored) {
            if (typeof stored === 'object' && stored.version) {
                version = stored.version;
            } else if (typeof stored === 'string') {
                try { version = JSON.parse(stored).version; } catch (e) { version = stored.trim(); }
            }
        }
        if (version) {
            StorageManager.set('update_dismissed_version', version);
        }
    }
}

// Handle backup functionality

function handleBackup() {
    if (typeof BackupManager !== 'undefined' && typeof BackupManager.showExportDialog === 'function') {
        BackupManager.showExportDialog();
    } else {
        // copy data from -> backup.js
        if (confirm('هل تريد تصدير بياناتك؟\n\nسيتم حفظ جميع بياناتك في ملف JSON.')) {
            const data = {
                user: StorageManager.getUser(),
                recovery: StorageManager.getRecoveryData(),
                settings: StorageManager.getSettings(),
                tasbih: StorageManager.get('tasbih_data')
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'taeafi-backup-' + new Date().toISOString().split('T')[0] + '.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast(' تم تصدير البيانات بنجاح');
        }
    }
}

/**
 * Open the hormonal monitor appropriate for the user's gender.
 */
function openHormonalMonitor() {
    var user = null;
    try {
        user = (typeof UserManager !== 'undefined' && typeof UserManager.get === 'function')
            ? UserManager.get()
            : null;
    } catch (e) {}

    var gender = (user && user.gender) || 'male';

    if (gender === 'female') {
        if (typeof navigateTo === 'function') navigateTo('menstrual-cycle-women');
    } else {
        if (typeof navigateTo === 'function') navigateTo('hormonal-wellness-men');
    }
}

function checkForUpdates(options) {
    options = options || {};
    var remoteUrl = options.remoteUrl || 'https://raw.githubusercontent.com/wsl-iq/teaafi/refs/heads/main/version.txt';
    var localUrl  = options.localUrl  || './version.txt';
    var silent    = options.silent === true;

    /**
     * Parse version from raw text.
     * Accepts either:
     *   - plain text: "3.0.1"
     *   - JSON:       {"version":"3.0.1"}
     */
    function parseVersion(text) {
        if (!text) return null;
        var t = String(text).trim();
        if (!t) return null;

        // Try JSON first
        try {
            var data = JSON.parse(t);
            if (data && typeof data.version === 'string') {
                return data.version.trim();
            }
        } catch (e) {
            // Not JSON — treat as plain text
        }

        // Plain text — accept only version-like formats
        if (/^\d+(\.\d+){0,3}$/.test(t)) {
            return t;
        }

        return null;
    }

    /**
     * Compare two version strings.
     * Returns:  1 if a > b
     *           0 if equal
     *          -1 if a < b
     */
    function compareVersions(a, b) {
        var pa = String(a).split('.').map(function (x) { return parseInt(x, 10) || 0; });
        var pb = String(b).split('.').map(function (x) { return parseInt(x, 10) || 0; });
        var len = Math.max(pa.length, pb.length);
        for (var i = 0; i < len; i++) {
            var na = pa[i] || 0;
            var nb = pb[i] || 0;
            if (na > nb) return 1;
            if (na < nb) return -1;
        }
        return 0;
    }

    /**
     * Clear the stored update flag.
     */
    function clearUpdate() {
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.set === 'function') {
            StorageManager.set('update_available', null);
        }
    }

    /**
     * Store the update flag.
     */
    function storeUpdate(version) {
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.set === 'function') {
            StorageManager.set('update_available', JSON.stringify({ version: version }));
        }
    }

    // Guard: don't run multiple checks concurrently
    if (window.__taeafiUpdateCheckRunning) return;
    window.__taeafiUpdateCheckRunning = true;

    // Fetch local version
    fetch(localUrl, { cache: 'no-cache' })
        .then(function (res) {
            if (!res.ok) throw new Error('Local version file not found');
            return res.text();
        })
        .then(function (text) {
            var localVersion = parseVersion(text);
            if (!localVersion) {
                throw new Error('Invalid local version format');
            }

            // Fetch remote version
            return fetch(remoteUrl, { cache: 'no-cache' })
                .then(function (res) {
                    if (!res.ok) throw new Error('Remote version file not found (HTTP ' + res.status + ')');
                    return res.text();
                })
                .then(function (remoteText) {
                    var remoteVersion = parseVersion(remoteText);
                    if (!remoteVersion) {
                        throw new Error('Invalid remote version format');
                    }

                    return { local: localVersion, remote: remoteVersion };
                });
        })
        .then(function (versions) {
            var local  = versions.local;
            var remote = versions.remote;

            if (compareVersions(remote, local) > 0) {
                // Update is available
                storeUpdate(remote);

                if (!silent) {
                    console.log('[Update] Available: local=' + local + ', remote=' + remote);

                    // Refresh home page if visible
                    var mainContent = document.getElementById('main-content');
                    if (mainContent && typeof Router !== 'undefined' &&
                        typeof Router.getCurrentPage === 'function' &&
                        Router.getCurrentPage() === 'home') {
                        renderHomePage();
                    }
                }
            } else {
                // No update
                clearUpdate();
                if (!silent) {
                    console.log('[Update] Up to date: v' + local);
                }
            }
        })
        .catch(function (err) {
            console.warn('[Update] Check failed:', err.message);
            // Do NOT clear the update flag on network error
        })
        .then(function () {
            window.__taeafiUpdateCheckRunning = false;
        });
}