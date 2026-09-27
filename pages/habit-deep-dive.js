/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : habit-deep-dive.js
 * Type   : JavaScript
 *
 * Habit Deep Dive — v2.0.1
 * Detailed analytics for a single habit.
 */

var HabitDeepDive = {

    /* 
     * STATE
     */

    currentHabit: null,
    rangeDays: 60,

    /* 
     * PUBLIC API
     */

    render: function (habitType) {
        this.currentHabit = habitType;

        var habit = this._getHabit(habitType);

        // If no active recovery, show a prompt
        if (!habit || (!habit.startTimestamp && !habit.startDate)) {
            return this._buildNoRecoveryPrompt(habitType);
        }

        var stats = this._calculateStats(habit);
        var heatmap = this._buildHeatmap(habit, this.rangeDays);
        var dangerousHours = this._getDangerousHours(habitType);
        var dangerousDays = this._getDangerousDays(habitType);
        var comparison = this._getComparison(habitType);
        var notes = this._getNotes(habitType);

        return `
            <div class="habit-deep-dive">

                <h2 class="section-title" style="margin-top: 32px;">
                    <i class="fas fa-chart-line" style="margin-left: 8px; color: var(--primary);"></i>
                    تحليل تفصيلي
                </h2>

                <div class="deep-dive-streak-grid">
                    <div class="deep-dive-streak-card" style="border-top: 4px solid #4CAF50;">
                        <i class="fas fa-fire" style="color: #4CAF50;"></i>
                        <span class="deep-dive-streak-number">${stats.currentStreak}</span>
                        <span class="deep-dive-streak-label">السلسلة الحالية</span>
                    </div>

                    <div class="deep-dive-streak-card" style="border-top: 4px solid #FFD700;">
                        <i class="fas fa-trophy" style="color: #FFD700;"></i>
                        <span class="deep-dive-streak-number">${stats.longestStreak}</span>
                        <span class="deep-dive-streak-label">أطول سلسلة</span>
                    </div>

                    <div class="deep-dive-streak-card" style="border-top: 4px solid #F44336;">
                        <i class="fas fa-rotate-left" style="color: #F44336;"></i>
                        <span class="deep-dive-streak-number">${stats.totalRelapses}</span>
                        <span class="deep-dive-streak-label">إجمالي الانتكاسات</span>
                    </div>

                    <div class="deep-dive-streak-card" style="border-top: 4px solid #2196F3;">
                        <i class="fas fa-percent" style="color: #2196F3;"></i>
                        <span class="deep-dive-streak-number">${stats.successRate}%</span>
                        <span class="deep-dive-streak-label">نسبة النجاح</span>
                    </div>
                </div>

                <div class="card" style="margin-top: 20px;">
                    <h3 style="margin-bottom: 12px;">
                        <i class="fas fa-calendar-alt" style="color: var(--primary); margin-left: 8px;"></i>
                        آخر ${this.rangeDays} يوم
                    </h3>
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 16px;">
                        كل مربع = يوم. الأخضر = نظيف، الأحمر = انتكاسة، الرمادي = قبل البداية.
                    </p>

                    <div class="deep-dive-heatmap-wrapper">
                        <div class="deep-dive-heatmap">
                            ${heatmap}
                        </div>
                    </div>

                    <div class="deep-dive-heatmap-legend">
                        <span><span class="heatmap-box clean"></span> نظيف</span>
                        <span><span class="heatmap-box relapse"></span> انتكاسة</span>
                        <span><span class="heatmap-box today"></span> اليوم</span>
                        <span><span class="heatmap-box empty"></span> قبل البداية</span>
                    </div>
                </div>

                ${this._buildDangerousHoursSection(dangerousHours)}
                ${this._buildDangerousDaysSection(dangerousDays)}
                ${this._buildComparisonSection(comparison)}

                <div class="card" style="margin-top: 20px;">
                    <h3 style="margin-bottom: 12px;">
                        <i class="fas fa-sticky-note" style="color: #FFC107; margin-left: 8px;"></i>
                        ملاحظاتي حول ${this._getHabitTitle(habitType)}
                    </h3>

                    <textarea
                        id="deep-dive-notes"
                        class="deep-dive-notes-input"
                        placeholder="اكتب ملاحظاتك، أفكارك، استراتيجياتك..."
                        maxlength="2000"
                    >${this._escapeHtml(notes)}</textarea>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                        <span id="deep-dive-notes-status" style="font-size: 11px; color: var(--text-tertiary);">
                            ${notes ? 'آخر حفظ: ' + this._formatDate(this._getNotesUpdatedAt(habitType)) : 'لم تُكتب ملاحظات بعد'}
                        </span>
                        <button class="btn btn-primary btn-sm" id="deep-dive-save-notes">
                            <i class="fas fa-save"></i> حفظ
                        </button>
                    </div>
                </div>

            </div>
        `;
    },

    /**
     * Show a prompt when the habit has no active recovery.
     */
    _buildNoRecoveryPrompt: function (habitType) {
        var title = this._getHabitTitle(habitType);

        return `
            <div class="habit-deep-dive">
                <h2 class="section-title" style="margin-top: 32px;">
                    <i class="fas fa-chart-line" style="margin-left: 8px; color: var(--primary);"></i>
                    تحليل تفصيلي
                </h2>

                <div class="card" style="text-align: center; padding: 40px 20px;">
                    <i class="fas fa-chart-bar" style="font-size: 64px; color: var(--text-disabled); margin-bottom: 20px;"></i>
                    <h3 style="margin-bottom: 12px; color: var(--text-primary);">
                        لا يوجد تحليل بعد
                    </h3>
                    <p style="color: var(--text-secondary); line-height: 1.9; max-width: 420px; margin: 0 auto 20px; font-size: 14px;">
                        لبدء التحليل التفصيلي لـ <strong>${this._escapeHtml(title)}</strong>،
                        ابدأ رحلة التعافي من هذه العادة أولاً.
                        <br><br>
                        سيظهر هنا رسم بياني حراري لكل يوم، وأخطر الأوقات،
                        ومقارنة مع الشهر الماضي، ومكان لملاحظاتك.
                    </p>

                    <button class="btn btn-primary" onclick="startRecoveryJourney('${habitType}')">
                        <i class="fas fa-play"></i>
                        ابدأ رحلة التعافي
                    </button>
                </div>
            </div>
        `;
    },

    attachEvents: function (habitType) {
        var self = this;

        var saveBtn = document.getElementById('deep-dive-save-notes');
        if (saveBtn) {
            saveBtn.addEventListener('click', function () {
                self._saveNotes(habitType);
            });
        }

        var notesInput = document.getElementById('deep-dive-notes');
        if (notesInput) {
            var timer = null;
            notesInput.addEventListener('input', function () {
                clearTimeout(timer);
                var status = document.getElementById('deep-dive-notes-status');
                if (status) status.textContent = 'جاري الكتابة...';

                timer = setTimeout(function () {
                    self._saveNotes(habitType, true);
                }, 2000);
            });
        }
    },

    /* 
     * DATA ACCESS
     */

    _getHabit: function (habitType) {
        if (typeof TaeafiMultiHabit !== 'undefined' && typeof TaeafiMultiHabit.getHabit === 'function') {
            return TaeafiMultiHabit.getHabit(habitType);
        }

        try {
            var raw = localStorage.getItem('taeafi_multi_habit_recovery');
            if (raw) {
                var parsed = JSON.parse(raw);
                var db = parsed && parsed.value ? parsed.value : parsed;
                if (db && db.habits && db.habits[habitType]) {
                    return db.habits[habitType];
                }
            }
        } catch (e) {}
        return null;
    },

    _getHabitTitle: function (habitType) {
        if (typeof TaeafiMultiHabit !== 'undefined' && TaeafiMultiHabit.META && TaeafiMultiHabit.META[habitType]) {
            return TaeafiMultiHabit.META[habitType].title;
        }
        if (typeof HABIT_CONTENT !== 'undefined' && HABIT_CONTENT[habitType]) {
            return HABIT_CONTENT[habitType].title;
        }
        return habitType;
    },

    _getStartTimestamp: function (habit) {
        if (!habit) return 0;
        var ts = Number(habit.startTimestamp || 0);
        if (!ts && habit.startDate) {
            var parsed = Date.parse(habit.startDate);
            if (Number.isFinite(parsed)) ts = parsed;
        }
        return ts;
    },

    /* 
     * STATISTICS
     */

    _calculateStats: function (habit) {
        var startTs = this._getStartTimestamp(habit);
        var relapses = Array.isArray(habit.relapses) ? habit.relapses.slice() : [];

        relapses.sort(function (a, b) {
            var ta = Number(a.timestamp || 0);
            var tb = Number(b.timestamp || 0);
            return ta - tb;
        });

        var now = Date.now();

        var lastRelapseTs = relapses.length > 0
            ? Number(relapses[relapses.length - 1].timestamp || 0)
            : 0;

        var currentStart = lastRelapseTs > 0 ? lastRelapseTs : startTs;
        var currentStreak = currentStart > 0
            ? Math.floor((now - currentStart) / 86400000)
            : 0;

        var longestStreak = 0;
        var points = [startTs].concat(relapses.map(function (r) {
            return Number(r.timestamp || 0);
        })).concat([now]);

        for (var i = 0; i < points.length - 1; i++) {
            var gap = Math.floor((points[i + 1] - points[i]) / 86400000);
            if (gap > longestStreak) longestStreak = gap;
        }

        var totalDays = startTs > 0 ? Math.floor((now - startTs) / 86400000) : 0;
        var relapseDays = relapses.length;
        var successRate = totalDays > 0
            ? Math.round(((totalDays - relapseDays) / totalDays) * 100)
            : 0;

        return {
            currentStreak: currentStreak,
            longestStreak: longestStreak,
            totalRelapses: relapses.length,
            successRate: Math.max(0, Math.min(100, successRate)),
            totalDays: totalDays
        };
    },

    /* 
     * HEATMAP
     */

    _buildHeatmap: function (habit, days) {
        var startTs = this._getStartTimestamp(habit);
        var relapses = Array.isArray(habit.relapses) ? habit.relapses : [];

        var relapseDays = {};
        relapses.forEach(function (r) {
            var ts = Number(r.timestamp || 0);
            if (ts > 0) {
                var d = new Date(ts);
                var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                relapseDays[key] = true;
            }
        });

        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (days - 1));

        var html = '';
        var currentDate = new Date(startDate);

        for (var i = 0; i < days; i++) {
            var dayTs = currentDate.getTime();
            var dayKey = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();

            var isToday = currentDate.getTime() === today.getTime();
            var isBeforeStart = startTs > 0 && dayTs < startTs;
            var isRelapse = relapseDays[dayKey] === true;

            var className = 'heatmap-box ';
            var title = '';

            if (isBeforeStart) {
                className += 'empty';
                title = 'قبل بداية التعافي';
            } else if (isRelapse) {
                className += 'relapse';
                title = 'انتكاسة';
            } else {
                className += 'clean';
                title = 'يوم نظيف';
            }

            if (isToday) {
                className += ' today';
                title = 'اليوم';
            }

            var dayNames = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
            var dayLabel = dayNames[currentDate.getDay()];
            var dateStr = currentDate.getDate() + '/' + (currentDate.getMonth() + 1);

            html += `<div class="${className}" title="${dayLabel} ${dateStr} - ${title}"></div>`;

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return html;
    },

    /* 
     * DANGEROUS HOURS
     */

    _getDangerousHours: function (habitType) {
        if (typeof RelapseAnalysisStorage === 'undefined') return null;
        return RelapseAnalysisStorage.getDangerousHours(habitType);
    },

    _buildDangerousHoursSection: function (hours) {
        if (!hours) return '';

        var total = Object.keys(hours).reduce(function (s, k) { return s + hours[k].count; }, 0);
        if (total === 0) return '';

        var maxCount = Math.max.apply(null, Object.keys(hours).map(function (k) {
            return hours[k].count;
        }));

        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 12px;">
                    <i class="fas fa-clock" style="color: #9C27B0; margin-left: 8px;"></i>
                    الأوقات الأخطر
                </h3>
                <p style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 16px;">
                    بناءً على تحليل الانتكاسات المسجلة.
                </p>

                <div class="deep-dive-hours-grid">
                    ${Object.keys(hours).map(function (key) {
                        var h = hours[key];
                        var percent = total > 0 ? Math.round((h.count / total) * 100) : 0;
                        var isTop = h.count === maxCount && maxCount > 0;

                        return `
                            <div class="deep-dive-hour-card ${isTop ? 'is-top' : ''}">
                                <i class="fas ${h.icon}" style="color: ${isTop ? '#9C27B0' : 'var(--text-tertiary)'};"></i>
                                <strong>${h.count}</strong>
                                <span class="deep-dive-hour-label">${h.label}</span>
                                <span class="deep-dive-hour-percent">${percent}%</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    /* 
     * DANGEROUS DAYS
     */

    _getDangerousDays: function (habitType) {
        if (typeof RelapseAnalysisStorage === 'undefined') return null;
        return RelapseAnalysisStorage.getDangerousDays(habitType);
    },

    _buildDangerousDaysSection: function (days) {
        if (!days) return '';

        var maxCount = Math.max.apply(null, days.map(function (d) { return d.count; }));
        if (maxCount === 0) return '';

        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 12px;">
                    <i class="fas fa-calendar-week" style="color: #2196F3; margin-left: 8px;"></i>
                    الأيام الأكثر خطورة
                </h3>

                <div class="deep-dive-days-grid">
                    ${days.map(function (d) {
                        var height = maxCount > 0 ? Math.max((d.count / maxCount) * 100, 5) : 5;
                        var isTop = d.count === maxCount && maxCount > 0;

                        return `
                            <div class="deep-dive-day-column">
                                <div class="deep-dive-day-bar-wrapper">
                                    <div class="deep-dive-day-bar ${isTop ? 'is-top' : ''}" style="height: ${height}%;"></div>
                                </div>
                                <span class="deep-dive-day-count">${d.count}</span>
                                <span class="deep-dive-day-name">${d.day}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    /* 
     * COMPARISON
     */

    _getComparison: function (habitType) {
        if (typeof RelapseAnalysisStorage === 'undefined') return null;

        var thisMonth = RelapseAnalysisStorage.getRecent(30, habitType);
        var lastMonth = RelapseAnalysisStorage.getByHabit(habitType).filter(function (r) {
            var ts = Number(r.timestamp || 0);
            var now = Date.now();
            return ts >= (now - 60 * 86400000) && ts < (now - 30 * 86400000);
        });

        var thisCount = thisMonth.length;
        var lastCount = lastMonth.length;
        var diff = thisCount - lastCount;
        var trend = 'same';

        if (lastCount === 0 && thisCount === 0) trend = 'same';
        else if (thisCount < lastCount) trend = 'improved';
        else if (thisCount > lastCount) trend = 'worse';

        return {
            thisMonth: thisCount,
            lastMonth: lastCount,
            diff: diff,
            trend: trend
        };
    },

    _buildComparisonSection: function (comparison) {
        if (!comparison) return '';

        var icons = {
            improved: { icon: 'fa-arrow-down', label: 'تحسّن', message: '<i class="fas fa-check-circle"></i> أنت تتحسن! استمر' },
            worse: { icon: 'fa-arrow-up', label: 'تراجع', message: '<i class="fas fa-exclamation-triangle"></i> انتبه - الانتكاسات زادت' },
            same: { icon: 'fa-equals', label: 'مستقر', message: '<i class="fas fa-pause-circle"></i> مستقر - حافظ على المستوى' }
        };

        var info = icons[comparison.trend];

        return `
            <div class="card deep-dive-comparison-card trend-${comparison.trend}">
                <h3 class="deep-dive-comparison-title">
                    <i class="fas fa-chart-bar"></i>
                    مقارنة مع الشهر الماضي
                </h3>

                <div class="deep-dive-comparison">
                    <div class="deep-dive-comparison-item">
                        <span class="deep-dive-comparison-label">هذا الشهر</span>
                        <strong class="deep-dive-comparison-value">${comparison.thisMonth}</strong>
                    </div>

                    <div class="deep-dive-comparison-icon">
                        <i class="fas ${info.icon}"></i>
                    </div>

                    <div class="deep-dive-comparison-item">
                        <span class="deep-dive-comparison-label">الشهر الماضي</span>
                        <strong class="deep-dive-comparison-value">${comparison.lastMonth}</strong>
                    </div>
                </div>

                <div class="deep-dive-comparison-message">
                    ${info.message}
                </div>
            </div>
        `;
    },

    /* 
     * NOTES
     */

    _getNotes: function (habitType) {
        var all = StorageManager.get('habit_notes') || {};
        return all[habitType] || '';
    },

    _getNotesUpdatedAt: function (habitType) {
        var all = StorageManager.get('habit_notes_updated') || {};
        return all[habitType] || null;
    },

    _saveNotes: function (habitType, silent) {
        var input = document.getElementById('deep-dive-notes');
        if (!input) return;

        var text = input.value.trim();

        var all = StorageManager.get('habit_notes') || {};
        all[habitType] = text;
        StorageManager.set('habit_notes', all);

        var updated = StorageManager.get('habit_notes_updated') || {};
        updated[habitType] = Date.now();
        StorageManager.set('habit_notes_updated', updated);

        var status = document.getElementById('deep-dive-notes-status');
        if (status) {
            status.textContent = 'آخر حفظ: ' + this._formatDate(Date.now());
        }

        if (!silent && typeof showToast === 'function') {
            showToast('تم حفظ الملاحظات');
        }
    },

    /* 
     * UTILITIES
     */

    _escapeHtml: function (text) {
        return String(text || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    _formatDate: function (ts) {
        if (!ts) return '—';
        var d = new Date(ts);
        return d.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};
