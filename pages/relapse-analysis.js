/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : relapse-analysis.js
 * Type   : JavaScript
 */

// Displays triggers, dangerous times, feelings, and lessons.

var RelapseAnalysisPage = {
    selectedHabit: 'all',
    selectedPeriod: 30, // days

    /*
     * MAIN RENDER
     */

    render: function () {
        var mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = this._buildHTML();
        this._attachEvents();
    },

    /*
     * HTML BUILDER
     */

    _buildHTML: function () {
        var stats = RelapseAnalysisStorage.getStats(
            this.selectedHabit === 'all' ? null : this.selectedHabit
        );

        var topTriggers = RelapseAnalysisStorage.getTopTriggers(
            this.selectedHabit === 'all' ? null : this.selectedHabit,
            this.selectedPeriod
        );

        var hours = RelapseAnalysisStorage.getDangerousHours(
            this.selectedHabit === 'all' ? null : this.selectedHabit,
            this.selectedPeriod
        );

        var days = RelapseAnalysisStorage.getDangerousDays(
            this.selectedHabit === 'all' ? null : this.selectedHabit,
            this.selectedPeriod
        );

        var feelings = RelapseAnalysisStorage.getFeelingsDistribution(
            this.selectedHabit === 'all' ? null : this.selectedHabit,
            this.selectedPeriod
        );

        return `
            <div class="animate-fade-in">
                <h1 class="heading-underline">
                    <i class="fas fa-chart-pie" style="margin-left: 8px; color: #F44336;"></i>
                    تحليل الانتكاسات
                </h1>

                <p class="text-secondary mb-4">
                    <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                    فهم أنماط الانتكاسات يساعدك على تجنبها في المستقبل.
                </p>

                ${!stats.hasData ? this._buildEmptyState() : this._buildReport(stats, topTriggers, hours, days, feelings)}

                ${this._buildFilters()}
            </div>
        `;
    },

    _buildEmptyState: function () {
        return `
            <div class="card" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-chart-line" style="font-size: 72px; color: var(--text-disabled); margin-bottom: 24px;"></i>
                <h2 style="margin-bottom: 12px;">لا توجد بيانات انتكاسات بعد</h2>
                <p class="text-secondary" style="line-height: 1.8; max-width: 480px; margin: 0 auto 20px;">
                    عندما تسجّل انتكاسة، ستُسأل عن السبب والمشاعر والدرس المستفاد.
                    ستُبنى هنا تقارير مفصلة تساعدك على تجنب الأنماط المتكررة.
                </p>
                <div style="background: var(--primary-light); border-radius: 12px; padding: 16px; max-width: 400px; margin: 0 auto; text-align: right;">
                    <p style="font-size: 13px; color: var(--text-primary); line-height: 1.8;">
                        <i class="fas fa-lightbulb" style="color: var(--primary); margin-left: 4px;"></i>
                        <strong>نصيحة:</strong> كل انتكاسة هي فرصة للتعلم. الصدق في التسجيل يساعدك على التحسن.
                    </p>
                </div>
            </div>
        `;
    },

    _buildReport: function (stats, topTriggers, hours, days, feelings) {
        return `
            <!-- Summary Cards -->
            <div class="relapse-summary-grid">
                <div class="relapse-summary-card" style="border-top: 4px solid #F44336;">
                    <i class="fas fa-exclamation-triangle" style="color: #F44336;"></i>
                    <span class="relapse-summary-number">${stats.total}</span>
                    <span class="relapse-summary-label">إجمالي الانتكاسات</span>
                </div>

                <div class="relapse-summary-card" style="border-top: 4px solid #FF9800;">
                    <i class="fas fa-brain" style="color: #FF9800;"></i>
                    <span class="relapse-summary-number" style="font-size: 16px;">
                        ${stats.topTrigger ? RelapseAnalysisStorage.getTriggerLabel(stats.topTrigger) : '—'}
                    </span>
                    <span class="relapse-summary-label">المُحفِّز الأكثر</span>
                </div>

                <div class="relapse-summary-card" style="border-top: 4px solid #9C27B0;">
                    <i class="fas fa-clock" style="color: #9C27B0;"></i>
                    <span class="relapse-summary-number" style="font-size: 16px;">
                        ${this._hourLabel(stats.dangerousHour)}
                    </span>
                    <span class="relapse-summary-label">الوقت الأخطر</span>
                </div>

                <div class="relapse-summary-card" style="border-top: 4px solid #2196F3;">
                    <i class="fas fa-calendar" style="color: #2196F3;"></i>
                    <span class="relapse-summary-number" style="font-size: 18px;">
                        ${stats.dangerousDay || '—'}
                    </span>
                    <span class="relapse-summary-label">اليوم الأخطر</span>
                </div>
            </div>

            <!-- Top Triggers -->
            ${this._buildTriggersSection(topTriggers)}

            <!-- Dangerous Hours -->
            ${this._buildHoursSection(hours)}

            <!-- Dangerous Days -->
            ${this._buildDaysSection(days)}

            <!-- Feelings -->
            ${this._buildFeelingsSection(feelings)}

            <!-- Lessons -->
            ${this._buildLessonsSection(stats.records)}
        `;
    },

    _buildTriggersSection: function (triggers) {
        if (!triggers || triggers.length === 0) return '';

        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-bullseye" style="color: #F44336; margin-left: 8px;"></i>
                    أكثر المُحفِّزات شيوعاً
                </h3>

                <div class="relapse-bars">
                    ${triggers.map(function (t, i) {
                        var trigger = RELAPSE_TRIGGERS.find(function (x) { return x.id === t.id; });
                        var icon = trigger ? trigger.icon : 'fa-circle';
                        var title = trigger ? trigger.title : t.id;
                        var isTop = i === 0;

                        return `
                            <div class="relapse-bar-row">
                                <div class="relapse-bar-label">
                                    <i class="fas ${icon}" style="color: ${isTop ? '#F44336' : 'var(--text-tertiary)'};"></i>
                                    <span>${title}</span>
                                </div>
                                <div class="relapse-bar-track">
                                    <div class="relapse-bar-fill" style="width: ${t.percent}%; background: ${isTop ? 'linear-gradient(90deg, #F44336, #EF5350)' : 'linear-gradient(90deg, #FF9800, #FFB74D)'};"></div>
                                </div>
                                <div class="relapse-bar-stats">
                                    <strong>${t.count}</strong>
                                    <small>${t.percent}%</small>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    _buildHoursSection: function (hours) {
        var total = Object.keys(hours).reduce(function (s, k) { return s + hours[k].count; }, 0);
        if (total === 0) return '';

        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-clock" style="color: #9C27B0; margin-left: 8px;"></i>
                    الأوقات الأخطر
                </h3>

                <div class="relapse-hours-grid">
                    ${Object.keys(hours).map(function (key) {
                        var h = hours[key];
                        var percent = total > 0 ? Math.round((h.count / total) * 100) : 0;
                        var isTop = h.count === Math.max.apply(null, Object.keys(hours).map(function (k) { return hours[k].count; }));

                        return `
                            <div class="relapse-hour-card ${isTop ? 'is-top' : ''}">
                                <i class="fas ${h.icon}" style="color: ${isTop ? '#9C27B0' : 'var(--text-tertiary)'};"></i>
                                <strong>${h.count}</strong>
                                <span class="relapse-hour-label">${h.label}</span>
                                <span class="relapse-hour-percent">${percent}%</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    _buildDaysSection: function (days) {
        var max = Math.max.apply(null, days.map(function (d) { return d.count; }));
        if (max === 0) return '';

        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-calendar-week" style="color: #2196F3; margin-left: 8px;"></i>
                    الأيام الأكثر خطورة
                </h3>

                <div class="relapse-days-grid">
                    ${days.map(function (d) {
                        var height = max > 0 ? Math.max((d.count / max) * 100, 5) : 5;
                        var isTop = d.count === max && max > 0;

                        return `
                            <div class="relapse-day-column">
                                <div class="relapse-day-bar-wrapper">
                                    <div class="relapse-day-bar ${isTop ? 'is-top' : ''}" style="height: ${height}%;" title="${d.count}"></div>
                                </div>
                                <span class="relapse-day-count">${d.count}</span>
                                <span class="relapse-day-name">${d.day}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    _buildFeelingsSection: function (feelings) {
        if (!feelings || feelings.length === 0) return '';

        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-heart" style="color: #E91E63; margin-left: 8px;"></i>
                    المشاعر بعد الانتكاسة
                </h3>

                <div class="relapse-feelings-list">
                    ${feelings.map(function (f) {
                        var feeling = RELAPSE_FEELINGS.find(function (x) { return x.id === f.id; });
                        var icon = feeling ? feeling.icon : 'fa-meh';
                        var title = feeling ? feeling.title : f.id;
                        var color = feeling ? feeling.color : '#FFC107';

                        return `
                            <div class="relapse-feeling-row">
                                <div class="relapse-feeling-icon" style="background: ${color}20; color: ${color};">
                                    <i class="fas ${icon}"></i>
                                </div>
                                <span class="relapse-feeling-title">${title}</span>
                                <span class="relapse-feeling-count">${f.count}</span>
                                <span class="relapse-feeling-percent" style="color: ${color};">${f.percent}%</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    _buildLessonsSection: function (records) {
        var withLessons = (records || []).filter(function (r) {
            return r.lesson && r.lesson.trim().length > 0;
        }).slice(-10).reverse();

        if (withLessons.length === 0) return '';

        return `
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-lightbulb" style="color: #FFC107; margin-left: 8px;"></i>
                    الدروس المستفادة
                </h3>

                <div class="relapse-lessons-list">
                    ${withLessons.map(function (r) {
                        var date = new Date(r.timestamp);
                        var dateStr = date.toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });

                        return `
                            <div class="relapse-lesson-item">
                                <div class="relapse-lesson-header">
                                    <i class="fas fa-quote-right" style="color: var(--primary);"></i>
                                    <span class="relapse-lesson-date">${dateStr}</span>
                                </div>
                                <p class="relapse-lesson-text">${this._escapeHtml(r.lesson)}</p>
                            </div>
                        `;
                    }, this).join('')}
                </div>
            </div>
        `;
    },

    _buildFilters: function () {
        var self = this;

        return `
            <div class="card" style="margin-top: 20px; padding: 16px;">
                <h4 style="margin-bottom: 12px; font-size: 14px;">
                    <i class="fas fa-filter" style="margin-left: 6px;"></i>
                    تصفية
                </h4>

                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                    <button class="relapse-filter-btn ${this.selectedHabit === 'all' ? 'active' : ''}" data-filter="habit" data-value="all">كل العادات</button>
                    ${this._getHabitButtons()}
                </div>

                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="relapse-filter-btn ${this.selectedPeriod === 7 ? 'active' : ''}" data-filter="period" data-value="7">7 أيام</button>
                    <button class="relapse-filter-btn ${this.selectedPeriod === 30 ? 'active' : ''}" data-filter="period" data-value="30">30 يوم</button>
                    <button class="relapse-filter-btn ${this.selectedPeriod === 90 ? 'active' : ''}" data-filter="period" data-value="90">90 يوم</button>
                    <button class="relapse-filter-btn ${this.selectedPeriod === 9999 ? 'active' : ''}" data-filter="period" data-value="9999">الكل</button>
                </div>
            </div>
        `;
    },

    _getHabitButtons: function () {
        if (typeof TaeafiMultiHabit === 'undefined' || typeof TaeafiMultiHabit.getHabits !== 'function') {
            return '';
        }

        var habits = TaeafiMultiHabit.getHabits() || [];
        var self = this;

        return habits.map(function (h) {
            var meta = (TaeafiMultiHabit.META && TaeafiMultiHabit.META[h.habitType]) || {};
            var title = meta.title || h.habitType;
            return `<button class="relapse-filter-btn ${self.selectedHabit === h.habitType ? 'active' : ''}" data-filter="habit" data-value="${h.habitType}">${title}</button>`;
        }).join('');
    },

    _hourLabel: function (key) {
        var labels = {
            morning: 'الصباح',
            afternoon: 'الظهر',
            evening: 'المساء',
            night: 'الليل'
        };
        return labels[key] || '—';
    },

    _escapeHtml: function (text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /*
     * EVENTS
     */

    _attachEvents: function () {
        var self = this;

        document.querySelectorAll('.relapse-filter-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = this.dataset.filter;
                var value = this.dataset.value;

                if (filter === 'habit') {
                    self.selectedHabit = value;
                } else if (filter === 'period') {
                    self.selectedPeriod = parseInt(value, 10);
                }

                self.render();
            });
        });
    }
};

/*
 * MODAL: ASK FOR RELAPSE DETAILS
 */

var RelapseAnalysisModal = {

    /**
     * Show modal asking for trigger, feeling, and lesson.
     * @param {string} habitType
     * @param {function} onComplete - callback after save
     */
    show: function (habitType, onComplete) {
        var self = this;
        var selectedTrigger = null;
        var selectedFeeling = null;

        var modal = document.createElement('div');
        modal.className = 'relapse-analysis-modal';
        modal.innerHTML = `
            <div class="relapse-analysis-card">
                <div class="relapse-analysis-header">
                    <div class="relapse-analysis-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3>تحليل الانتكاسة</h3>
                    <p>معلوماتك تساعدك على تجنب الأنماط المتكررة</p>
                </div>

                <div class="relapse-step">
                    <label class="relapse-step-label">
                        <span class="relapse-step-number">1</span>
                        ما الذي دفعك للانتكاسة؟
                    </label>
                    <div class="relapse-triggers-grid">
                        ${RELAPSE_TRIGGERS.map(function (t) {
                            return `
                                <div class="relapse-trigger-option" data-trigger="${t.id}">
                                    <i class="fas ${t.icon}"></i>
                                    <span>${t.title}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="relapse-step">
                    <label class="relapse-step-label">
                        <span class="relapse-step-number">2</span>
                        كيف تشعر الآن؟
                    </label>
                    <div class="relapse-feelings-grid">
                        ${RELAPSE_FEELINGS.map(function (f) {
                            return `
                                <div class="relapse-feeling-option" data-feeling="${f.id}" style="--feeling-color: ${f.color};">
                                    <i class="fas ${f.icon}"></i>
                                    <span>${f.title}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="relapse-step">
                    <label class="relapse-step-label">
                        <span class="relapse-step-number">3</span>
                        ما هو الدرس المستفاد؟ <span style="color: var(--text-tertiary); font-weight: 400; font-size: 12px;">(اختياري)</span>
                    </label>
                    <textarea id="relapse-lesson" placeholder="مثال: كنت متعباً ويجب أن أنام مبكراً..." maxlength="500"></textarea>
                </div>

                <div class="relapse-actions">
                    <button class="btn btn-outline" id="relapse-skip">تخطي</button>
                    <button class="btn btn-primary" id="relapse-save" disabled>
                        <i class="fas fa-save"></i> حفظ
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        var saveBtn = modal.querySelector('#relapse-save');

        // Trigger selection
        modal.querySelectorAll('.relapse-trigger-option').forEach(function (el) {
            el.addEventListener('click', function () {
                modal.querySelectorAll('.relapse-trigger-option').forEach(function (x) {
                    x.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedTrigger = this.dataset.trigger;
                self._updateSaveButton(saveBtn, selectedTrigger, selectedFeeling);
            });
        });

        // Feeling selection
        modal.querySelectorAll('.relapse-feeling-option').forEach(function (el) {
            el.addEventListener('click', function () {
                modal.querySelectorAll('.relapse-feeling-option').forEach(function (x) {
                    x.classList.remove('selected');
                });
                this.classList.add('selected');
                selectedFeeling = this.dataset.feeling;
                self._updateSaveButton(saveBtn, selectedTrigger, selectedFeeling);
            });
        });

        // Save
        saveBtn.addEventListener('click', function () {
            var lessonEl = modal.querySelector('#relapse-lesson');
            var lesson = lessonEl ? lessonEl.value.trim() : '';

            var record = RelapseAnalysisStorage.save({
                habitType: habitType || 'unknown',
                trigger: selectedTrigger,
                feeling: selectedFeeling,
                lesson: lesson,
                timestamp: Date.now()
            });

            modal.remove();

            if (typeof showToast === 'function') {
                showToast('تم حفظ التحليل - استمر في المراقبة');
            }

            if (typeof onComplete === 'function') onComplete(record);
        });

        // Skip
        modal.querySelector('#relapse-skip').addEventListener('click', function () {
            modal.remove();
            if (typeof onComplete === 'function') onComplete(null);
        });

        // ESC
        modal.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') modal.remove();
        });
    },

    _updateSaveButton: function (btn, trigger, feeling) {
        if (btn) {
            btn.disabled = !(trigger && feeling);
        }
    }
};

/*
 * GLOBAL API
 */

window.renderRelapseAnalysisPage = function () {
    RelapseAnalysisPage.render();
};

window.showRelapseAnalysisModal = function (habitType, onComplete) {
    RelapseAnalysisModal.show(habitType, onComplete);
};