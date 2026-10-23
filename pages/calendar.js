/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : calendar.js
 * Type   : JavaScript
 *
 * Interactive Recovery Calendar
 */

var calendarMonth = new Date().getMonth();
var calendarYear  = new Date().getFullYear();
var calendarSelectedDay = null;

/*
 * STORAGE: DAILY NOTES
 **/

var CalendarNotes = {
    KEY: 'calendar_daily_notes',

    getAll: function () {
        try {
            var data = StorageManager.get(this.KEY);
            return (data && typeof data === 'object') ? data : {};
        } catch (e) {
            return {};
        }
    },

    get: function (dateKey) {
        var all = this.getAll();
        return all[dateKey] || { note: '', mood: 2 };
    },

    save: function (dateKey, note, mood) {
        var all = this.getAll();
        all[dateKey] = {
            note: String(note || '').substring(0, 500),
            mood: Number(mood || 0),
            updatedAt: Date.now()
        };
        StorageManager.set(this.KEY, all);
    }
};

/*
 * HELPERS
 **/

function calendarTodayKey() {
    var now = new Date();
    return now.getFullYear() + '-' +
           String(now.getMonth() + 1).padStart(2, '0') + '-' +
           String(now.getDate()).padStart(2, '0');
}

function calendarDateKey(year, month, day) {
    return year + '-' +
           String(month + 1).padStart(2, '0') + '-' +
           String(day).padStart(2, '0');
}

function calendarFormatDate(dateKey) {
    var parts = dateKey.split('-');
    var year = parts[0];
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return day + ' ' + months[month - 1] + ' ' + year;
}

function calendarGetMonthName(monthIndex) {
    var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return months[monthIndex];
}

/**
 * Build a day → status map from all active habits.
 */
function calendarBuildRecoveryMap() {
    var map = {};

    var habits = [];
    if (typeof TaeafiMultiHabit !== 'undefined' && typeof TaeafiMultiHabit.getHabits === 'function') {
        habits = TaeafiMultiHabit.getHabits() || [];
    }
    if (!Array.isArray(habits)) habits = Object.values(habits || {});

    // Add legacy recovery data
    if (typeof StorageManager !== 'undefined' && typeof StorageManager.getRecoveryData === 'function') {
        var legacy = StorageManager.getRecoveryData();
        if (legacy && legacy.startDate) habits.push(legacy);
    }

    habits.forEach(function (habit) {
        if (!habit) return;

        var startTs = Number(habit.startTimestamp || 0);
        if (!startTs && habit.startDate) {
            startTs = Date.parse(habit.startDate);
        }
        if (!Number.isFinite(startTs) || startTs <= 0) return;

        var start = new Date(startTs);
        start.setHours(0, 0, 0, 0);
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        // Mark all days as clean
        for (var d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
            var key = calendarDateKey(d.getFullYear(), d.getMonth(), d.getDate());
            map[key] = 'clean';
        }

        // Mark relapses
        if (Array.isArray(habit.relapses)) {
            habit.relapses.forEach(function (r) {
                var ts = Number(r.timestamp || 0);
                if (!ts && r.date) ts = Date.parse(r.date);
                if (!Number.isFinite(ts) || ts <= 0) return;
                var rd = new Date(ts);
                var key = calendarDateKey(rd.getFullYear(), rd.getMonth(), rd.getDate());
                map[key] = 'relapse';
            });
        }
    });

    return map;
}

/*
 * MAIN RENDER
 **/

function renderCalendarPage() {
    var mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    var recoveryMap = calendarBuildRecoveryMap();

    mainContent.innerHTML =
        '<div class="animate-fade-in">' +
            '<h1 class="heading-underline">' +
                '<i class="fas fa-calendar-check" style="margin-left: 8px; color: #4CAF50;"></i>' +
                'روزنامة التعافي' +
            '</h1>' +
            '<div id="calendar-interactive-root"></div>' +
        '</div>';

    renderCalendarInteractive(recoveryMap);

    // تلميح لأول مرة
    if (typeof OnboardingTips !== 'undefined') {
        setTimeout(function () {
            OnboardingTips.show('calendar');
        }, 800);
    }
}

/*
 * INTERACTIVE CALENDAR
 **/

function renderCalendarInteractive(recoveryMap) {
    var root = document.getElementById('calendar-interactive-root');
    if (!root) return;

    var todayKey = calendarTodayKey();

    // Header
    var headerHtml =
        '<div class="calendar-interactive">' +
            '<div class="calendar-header-nav">' +
                '<button type="button" class="calendar-nav-btn" onclick="changeCalendarMonth(-1)">' +
                    '<i class="fas fa-chevron-right"></i>' +
                '</button>' +
                '<div class="calendar-header-title">' +
                    calendarGetMonthName(calendarMonth) + ' ' + calendarYear +
                '</div>' +
                '<button type="button" class="calendar-nav-btn" onclick="changeCalendarMonth(1)">' +
                    '<i class="fas fa-chevron-left"></i>' +
                '</button>' +
            '</div>' +
            '<div class="calendar-weekdays">' +
                '<div class="calendar-weekday">أحد</div>' +
                '<div class="calendar-weekday">إثنين</div>' +
                '<div class="calendar-weekday">ثلاثاء</div>' +
                '<div class="calendar-weekday">أربعاء</div>' +
                '<div class="calendar-weekday">خميس</div>' +
                '<div class="calendar-weekday">جمعة</div>' +
                '<div class="calendar-weekday">سبت</div>' +
            '</div>' +
            '<div class="calendar-grid-interactive" id="calendar-grid">';

    // Compute cells
    var firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    var daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

    // Empty leading cells
    for (var i = 0; i < firstDay; i++) {
        headerHtml += '<div class="calendar-cell empty"></div>';
    }

    // Day cells
    for (var day = 1; day <= daysInMonth; day++) {
        var dateKey = calendarDateKey(calendarYear, calendarMonth, day);
        var status = recoveryMap[dateKey] || 'neutral';
        var isToday = dateKey === todayKey;
        var hasNote = CalendarNotes.get(dateKey).note.length > 0;
        var isSelected = dateKey === calendarSelectedDay;

        var classes = 'calendar-cell ' + status;
        if (isToday) classes += ' today';
        if (hasNote) classes += ' has-note';
        if (isSelected) classes += ' selected';

        headerHtml +=
            '<div class="' + classes + '" onclick="selectCalendarDay(\'' + dateKey + '\')" ' +
                 'title="' + calendarFormatDate(dateKey) + '">' +
                day +
            '</div>';
    }

    headerHtml += '</div>'; // grid
    headerHtml += '<div id="calendar-day-detail"></div>';

    // Legend
    headerHtml +=
        '<div class="calendar-legend">' +
            '<span class="calendar-legend-item"><span class="calendar-legend-dot clean"></span> يوم نظيف</span>' +
            '<span class="calendar-legend-item"><span class="calendar-legend-dot relapse"></span> انتكاسة</span>' +
            '<span class="calendar-legend-item"><span class="calendar-legend-dot neutral"></span> عادي</span>' +
        '</div>';

    // Month stats
    var clean = 0, relapse = 0;
    for (var day2 = 1; day2 <= daysInMonth; day2++) {
        var k = calendarDateKey(calendarYear, calendarMonth, day2);
        if (recoveryMap[k] === 'clean') clean++;
        else if (recoveryMap[k] === 'relapse') relapse++;
    }
    var total = clean + relapse;
    var percent = total > 0 ? Math.round((clean / total) * 100) : 0;

    headerHtml +=
        '<div class="calendar-month-stats">' +
            '<div class="calendar-month-stat">' +
                '<span class="calendar-month-stat-value" style="color:#4CAF50;">' + clean + '</span>' +
                '<span class="calendar-month-stat-label">يوم نظيف</span>' +
            '</div>' +
            '<div class="calendar-month-stat">' +
                '<span class="calendar-month-stat-value" style="color:#F44336;">' + relapse + '</span>' +
                '<span class="calendar-month-stat-label">انتكاسة</span>' +
            '</div>' +
            '<div class="calendar-month-stat">' +
                '<span class="calendar-month-stat-value" style="color:#2196F3;">' + percent + '%</span>' +
                '<span class="calendar-month-stat-label">نسبة النجاح</span>' +
            '</div>' +
        '</div>';

    headerHtml += '</div>'; // calendar-interactive

    root.innerHTML = headerHtml;

    // If a day was selected before month change, re-render its detail
    if (calendarSelectedDay) {
        renderCalendarDayDetail(calendarSelectedDay, recoveryMap);
    }
}

/*
 * DAY SELECTION
 **/

function selectCalendarDay(dateKey) {
    calendarSelectedDay = dateKey;
    var recoveryMap = calendarBuildRecoveryMap();

    // Update selection visuals
    document.querySelectorAll('.calendar-cell').forEach(function (el) {
        el.classList.remove('selected');
    });
    // We'll re-render entirely to keep it simple
    renderCalendarInteractive(recoveryMap);
}

function renderCalendarDayDetail(dateKey, recoveryMap) {
    var container = document.getElementById('calendar-day-detail');
    if (!container) return;

    var status = recoveryMap[dateKey] || 'neutral';
    var statusLabel =
        status === 'clean'   ? 'يوم نظيف' :
        status === 'relapse' ? 'انتكاسة'  : 'يوم عادي';

    var notes = CalendarNotes.get(dateKey);
    var moods = ['fa-laugh-beam','fa-smile','fa-meh','fa-frown','fa-sad-tear'];
    var moodColors = ['#4CAF50','#8BC34A','#FFC107','#FF9800','#F44336'];

    var moodHtml = moods.map(function (icon, i) {
        var selected = notes.mood === i ? ' selected' : '';
        return '<span class="calendar-mood-icon' + selected + '" data-mood="' + i + '" ' +
               'onclick="selectCalendarMood(' + i + ')" title="مزاج">' +
               '<i class="fas ' + icon + '" style="color:' + moodColors[i] + ';"></i>' +
               '</span>';
    }).join('');

    container.innerHTML =
        '<div class="calendar-day-detail">' +
            '<div class="calendar-day-detail-title">' +
                '<span>' + calendarFormatDate(dateKey) + '</span>' +
                '<span class="calendar-day-detail-status ' + status + '">' +
                    statusLabel +
                '</span>' +
            '</div>' +
            '<div style="font-size:12px;color:var(--text-tertiary);margin-bottom:6px;">كيف كان مزاجك؟</div>' +
            '<div class="calendar-mood-row" id="calendar-mood-row">' + moodHtml + '</div>' +
            '<div style="font-size:12px;color:var(--text-tertiary);margin-bottom:6px;">ملاحظة سريعة</div>' +
            '<textarea class="calendar-note-input" id="calendar-note-input" maxlength="500" ' +
                'placeholder="اكتب ملاحظة عن هذا اليوم...">' + (notes.note || '') + '</textarea>' +
            '<div class="calendar-detail-actions">' +
                '<button type="button" class="btn btn-primary btn-sm" onclick="saveCalendarDayNote(\'' + dateKey + '\')" style="flex:1;">' +
                    '<i class="fas fa-save"></i> حفظ' +
                '</button>' +
                '<button type="button" class="btn btn-outline btn-sm" onclick="clearCalendarDay(\'' + dateKey + '\')" style="flex:1;">' +
                    '<i class="fas fa-times"></i> إلغاء' +
                '</button>' +
            '</div>' +
        '</div>';
}

function selectCalendarMood(moodIndex) {
    document.querySelectorAll('.calendar-mood-icon').forEach(function (el) {
        el.classList.toggle('selected', Number(el.dataset.mood) === moodIndex);
    });
    // Save immediately, updating only mood
    if (!calendarSelectedDay) return;
    var note = document.getElementById('calendar-note-input');
    CalendarNotes.save(calendarSelectedDay, note ? note.value : '', moodIndex);
}

function saveCalendarDayNote(dateKey) {
    var noteEl = document.getElementById('calendar-note-input');
    var moodEl = document.querySelector('.calendar-mood-icon.selected');
    var mood = moodEl ? Number(moodEl.dataset.mood) : 2;

    CalendarNotes.save(dateKey, noteEl ? noteEl.value : '', mood);

    if (typeof showToast === 'function') {
        showToast('تم حفظ الملاحظة');
    }

    // Re-render to refresh has-note indicator
    var recoveryMap = calendarBuildRecoveryMap();
    renderCalendarInteractive(recoveryMap);
}

function clearCalendarDay(dateKey) {
    var noteEl = document.getElementById('calendar-note-input');
    if (noteEl) noteEl.value = '';
    CalendarNotes.save(dateKey, '', 2);
    if (typeof showToast === 'function') {
        showToast('تم مسح الملاحظة');
    }
}

/*
 * MONTH NAVIGATION
 **/

function changeCalendarMonth(delta) {
    calendarMonth += delta;
    if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
    if (calendarMonth < 0)  { calendarMonth = 11; calendarYear--; }
    calendarSelectedDay = null;

    var recoveryMap = calendarBuildRecoveryMap();
    renderCalendarInteractive(recoveryMap);
}