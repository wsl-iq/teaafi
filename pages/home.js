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

    const month = String(
        date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        date.getDate()
    ).padStart(2, '0');

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

// Retrieve the Hijri date from the API

async function fetchHijriDate(date) {

    const dateString =
        getGregorianDateString(date);

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
            throw new Error(
                `API Error: ${response.status}`
            );
        }

        const data =
            await response.json();

        /*
         * API:
         *
         * hijri_date: "1447-07-11"
         *
         * or:
         *
         * hijri_year
         * hijri_month
         * hijri_day_arabic
         */

        if (!data || !data.hijri_date) {
            throw new Error(
                'التاريخ الهجري غير موجود في استجابة API'
            );
        }

        const parts =
            data.hijri_date.split('-');

        if (parts.length !== 3) {
            throw new Error(
                'صيغة التاريخ الهجري غير صحيحة'
            );
        }

        const hijriYear =
            parts[0];

        const hijriMonth =
            parts[1];

        const hijriDay =
            parts[2];

        displayHijriDate(
            hijriYear,
            hijriMonth,
            hijriDay
        );

        lastFetchedDate =
            dateString;

        console.log(
            'التاريخ الهجري:',
            data.hijri_date
        );

        return true;

    } catch (error) {

        console.warn(
            'فشل جلب التاريخ الهجري من API:',
            error
        );

        /*
         * In case of internet failure
         * We use the local account.
         */

        const hijri =
            gregorianToHijriLocal(date);

        displayHijriDate(
            hijri.year,
            hijri.month,
            hijri.day
        );

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

    const now =
        new Date();

    let hours =
        now.getHours();

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, '0');

    const seconds =
        String(
            now.getSeconds()
        ).padStart(2, '0');

    const period =
        hours >= 12
            ? 'مساءً'
            : 'صباحاً';

    hours =
        hours % 12 || 12;

    const timeString =
        `${hours}:${minutes}:${seconds} ${period}`;

    const timeElement =
        document.getElementById(
            'current-time'
        );

    const dayElement =
        document.getElementById(
            'current-day'
        );

    if (timeElement) {
        timeElement.textContent =
            timeString;
    }

    if (dayElement) {

        dayElement.textContent =
            weekDays[
                now.getDay()
            ];
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

    const now =
        new Date();

    // Gregorian calendar
    updateGregorianDate();

    // Current date
    const currentDate =
        getGregorianDateString(now);

    /*
     * API requested only once
     * Per day.
     */

    if (
        lastFetchedDate !== currentDate
    ) {

        await fetchHijriDate(now);
    }
}

// Local Reserve Account

function gregorianToHijriLocal(date) {

    const gDate =
        new Date(date);

    const gDay =
        gDate.getDate();

    const gMonth =
        gDate.getMonth() + 1;

    const gYear =
        gDate.getFullYear();

    let jd;

    if (
        (gYear > 1582) ||
        (
            gYear === 1582 &&
            gMonth > 10
        ) ||
        (
            gYear === 1582 &&
            gMonth === 10 &&
            gDay > 14
        )
    ) {

        jd =
            Math.floor(
                (
                    1461 *
                    (
                        gYear +
                        4800 +
                        Math.floor(
                            (gMonth - 14) / 12
                        )
                    )
                ) / 4
            ) +

            Math.floor(
                (
                    367 *
                    (
                        gMonth -
                        2 -
                        12 *
                        Math.floor(
                            (gMonth - 14) / 12
                        )
                    )
                ) / 12
            ) -

            Math.floor(
                (
                    3 *
                    Math.floor(
                        (
                            gYear +
                            4900 +
                            Math.floor(
                                (gMonth - 14) / 12
                            )
                        ) / 100
                    )
                ) / 4
            ) +

            gDay -
            32075;

    } else {

        jd =
            367 * gYear -

            Math.floor(
                (
                    7 *
                    (
                        gYear +
                        5001 +
                        Math.floor(
                            (gMonth - 9) / 7
                        )
                    )
                ) / 4
            ) +

            Math.floor(
                (275 * gMonth) / 9
            ) +

            gDay +
            1729777;
    }

    const l =
        jd -
        1948440 +
        10632;

    const n =
        Math.floor(
            (l - 1) / 10631
        );

    const l2 =
        l -
        10631 * n +
        354;

    const j =
        Math.floor(
            (10985 - l2) / 5316
        ) *
        Math.floor(
            (50 * l2) / 17719
        ) +

        Math.floor(
            l2 / 5670
        ) *
        Math.floor(
            (43 * l2) / 15238
        );

    const l3 =
        l2 -

        Math.floor(
            (30 - j) / 15
        ) *
        Math.floor(
            (17719 * j) / 50
        ) -

        Math.floor(
            j / 16
        ) *
        Math.floor(
            (15238 * j) / 43
        ) +

        29;

    const hMonth =
        Math.floor(
            (24 * l3) / 709
        );

    const hDay =
        l3 -
        Math.floor(
            (709 * hMonth) / 24
        );

    const hYear =
        30 * n +
        j -
        30;

    return {
        day: hDay,
        month: hMonth,
        year: hYear
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

        clearInterval(
            dateInterval
        );

        dateInterval = null;
    }
}

/** Date and Time Display Feature
 * Hijri + Gregorian
 * API: Mumineen MDO API
 * Names of the days of the week in Arabic
 */

function renderHomePage() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // تفريغ المحتوى القديم
    while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
    }

    const user = typeof StorageManager !== 'undefined' && typeof StorageManager.getUser === 'function'
        ? StorageManager.getUser() : null;
    const stats = typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getRecoveryStats === 'function'
        ? RecoveryCounter.getRecoveryStats() : null;
    const recoveryStats = stats || { isActive: false, days: 0, weeks: 0, months: 0, years: 0 };

    const updateAvailable = typeof StorageManager !== 'undefined' && typeof StorageManager.get === 'function'
        ? StorageManager.get('update_available') : null;
    const hasUpdate = updateAvailable && updateAvailable.version &&
        typeof compareVersions === 'function' &&
        typeof APP_VERSION !== 'undefined' &&
        compareVersions(updateAvailable.version, APP_VERSION) > 0;
    
    // Container creation
    const container = document.createElement('div');
    container.className = 'animate-fade-in';
    container.innerHTML = `
        ${hasUpdate ? `
            <div class="update-notification-bar" onclick="navigateTo('settings'); setTimeout(function() { var el = document.getElementById('update-status'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 500);">
                <div class="update-dot"></div>
                <div class="update-text">
                    <span>يوجد تحديث جديد v${updateAvailable.version}</span>
                    <i class="fas fa-arrow-left" style="font-size: 12px;"></i>
                </div>
                <button class="update-close-btn" onclick="event.stopPropagation(); dismissUpdateNotification();">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        ` : ''}

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
            <div class="counter-card" onclick="navigateTo('recovery')">
                <i class="fas fa-calendar-check" style="font-size: 32px; margin-bottom: 12px;"></i>
                <h3>رحلة التعافي مستمرة</h3>
                <div class="counter-value" id="home-counter">${recoveryStats.days}</div>
                <p>يوم منذ بداية رحلتك</p>
                <div class="counter-stats">
                    <div class="stat-item">
                        <div class="stat-value">${recoveryStats.weeks}</div>
                        <div class="stat-label">أسبوع</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${recoveryStats.months}</div>
                        <div class="stat-label">شهر</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${recoveryStats.years}</div>
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
            </div>
            
            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-toolbox" style="margin-left: 8px;"></i>
                أدوات مساعدة
            </h2>
            <div class="cards-grid">
                <!-- الإحصائيات -->
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
    
    // Update counter every minute
    if (recoveryStats.isActive) {
        setInterval(() => {
            const counterEl = document.getElementById('home-counter');
            if (counterEl && typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getRecoveryStats === 'function') {
                const currentStats = RecoveryCounter.getRecoveryStats();
                counterEl.textContent = currentStats.days;
            }
        }, 60000);
    }
}

// Function to hide update notification
function dismissUpdateNotification() {
    var bar = document.querySelector('.update-notification-bar');
    if (bar) {
        bar.style.animation = 'slideUpOut 0.3s ease forwards';
        setTimeout(function() { bar.remove(); }, 300);
    }
    if (typeof StorageManager !== 'undefined' && typeof StorageManager.set === 'function') {
        StorageManager.set('update_notification_dismissed', Date.now());
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

