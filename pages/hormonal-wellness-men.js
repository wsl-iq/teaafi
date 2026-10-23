/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : hormonal-wellness-men.js
 * Type   : JavaScript
 *
 * Hormonal Wellness Tracker (Men)
 * - Daily check-in: mood, energy, libido, sleep, focus, stress, exercise
 * - Hormonal Wellness Score (0-100)
 * - Insights and patterns
 */

(function () {
    'use strict';

    var KEY = 'hormonal_daily_men';

    /*
     * STORAGE
     **/

    function loadDays() {
        try {
            var data = StorageManager.get(KEY);
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    }

    function saveDays(arr) {
        StorageManager.set(KEY, arr);
    }

    function getToday() {
        var now = new Date();
        return (
            now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0')
        );
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        var parts = dateStr.split('-');
        var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        return parseInt(parts[2], 10) + ' ' + months[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
    }

    /*
     * SCORING
     **/

    /**
     * Calculate a Hormonal Wellness Score for a single day.
     * Each field is 1-5, except stress (1-5 where 1 is best).
     * Output: 0-100.
     */
    function scoreDay(day) {
        var mood = Number(day.mood || 3);
        var energy = Number(day.energy || 3);
        var libido = Number(day.libido || 3);
        var sleep = Number(day.sleep || 3);
        var focus = Number(day.focus || 3);
        var stress = Number(day.stress || 3);
        var exercise = day.exercise ? 1 : 0;

        // Stress is inverted
        var stressScore = 6 - stress;

        // Weighted average (out of 6 fields + exercise bonus)
        var total =
            (mood * 0.15) +
            (energy * 0.20) +
            (libido * 0.15) +
            (sleep * 0.20) +
            (focus * 0.15) +
            (stressScore * 0.15);

        // Normalize to 0-100
        var base = ((total - 1) / 4) * 100;

        // Exercise bonus (+5)
        base += exercise * 5;

        return Math.round(Math.max(0, Math.min(100, base)));
    }

    function getAverageScore(days) {
        if (!days || days.length === 0) return 0;
        var sum = 0;
        days.forEach(function (d) {
            sum += scoreDay(d);
        });
        return Math.round(sum / days.length);
    }

    function getScoreCaption(score) {
        if (score >= 80) return { text: 'ممتاز', color: '#4CAF50' };
        if (score >= 65) return { text: 'جيد جداً', color: '#8BC34A' };
        if (score >= 50) return { text: 'جيد', color: '#FFC107' };
        if (score >= 35) return { text: 'متوسط', color: '#FF9800' };
        return { text: 'منخفض', color: '#F44336' };
    }

    /*
     * INSIGHTS
     **/

    function generateInsights(days) {
        if (!days || days.length < 3) return null;

        var recent = days.slice(-7);
        var avgSleep = recent.reduce(function (a, b) { return a + Number(b.sleep || 3); }, 0) / recent.length;
        var avgStress = recent.reduce(function (a, b) { return a + Number(b.stress || 3); }, 0) / recent.length;
        var avgEnergy = recent.reduce(function (a, b) { return a + Number(b.energy || 3); }, 0) / recent.length;
        var exerciseCount = recent.filter(function (d) { return d.exercise; }).length;

        var insights = [];

        if (avgSleep < 3) {
            insights.push({
                icon: 'fa-bed',
                color: '#FF9800',
                text: 'جودة نومك منخفضة في آخر أسبوع. النوم الجيد يساعد على توازن الهرمونات.'
            });
        }

        if (avgStress >= 4) {
            insights.push({
                icon: 'fa-brain',
                color: '#F44336',
                text: 'مستوى التوتر مرتفع. جرب تقنيات التنفس أو المشي اليومي.'
            });
        }

        if (avgEnergy < 3) {
            insights.push({
                icon: 'fa-battery-quarter',
                color: '#FF9800',
                text: 'طاقتك منخفضة باستمرار. تأكد من التغذية والترطيب والنوم.'
            });
        }

        if (exerciseCount >= 4) {
            insights.push({
                icon: 'fa-dumbbell',
                color: '#4CAF50',
                text: 'أحسنت! التمرين المنتظم يدعم توازن الهرمونات والمزاج.'
            });
        } else if (exerciseCount <= 1) {
            insights.push({
                icon: 'fa-walking',
                color: '#FF9800',
                text: 'حاول إضافة المشي اليومي (20 دقيقة) — له تأثير إيجابي على الطاقة والمزاج.'
            });
        }

        return insights.length > 0 ? insights[0] : {
            icon: 'fa-check-circle',
            color: '#4CAF50',
            text: 'مؤشراتك في نطاق جيد. استمر في التسجيل اليومي للحصول على رؤية أدق.'
        };
    }

    /*
     * RENDER
     **/

    function renderHormonalWellnessPage() {
        var mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        var days = loadDays();
        var todayKey = getToday();
        var todayData = days.find(function (d) { return d.date === todayKey; }) || {};

        var avgScore = getAverageScore(days.slice(-7));
        var caption = getScoreCaption(avgScore);
        var insight = generateInsights(days);

        var html = '';

        // Header
        html +=
            '<div class="hwm-page animate-fade-in">' +
                '<div class="hwm-header">' +
                    '<div class="hwm-header-icon"><i class="fas fa-mars"></i></div>' +
                    '<h1 class="heading-underline">مراقبة التغيرات الهرمونية</h1>' +
                    '<p class="hwm-subtitle">' +
                        'تسجيل يومي لمؤشرات الطاقة والمزاج والنوم والتوتر. ' +
                        'المؤشرات احتمالية وتوعوية، وليست تشخيصاً طبياً.' +
                    '</p>' +
                '</div>';

        // Insight banner
        if (insight) {
            html +=
                '<div class="hwm-insight">' +
                    '<i class="fas ' + insight.icon + '" style="color:' + insight.color + ';"></i>' +
                    '<p>' + insight.text + '</p>' +
                '</div>';
        }

        // Score card
        html +=
            '<div class="hwm-score-card">' +
                '<div class="hwm-score-label">مؤشر العافية الهرمونية (متوسط 7 أيام)</div>' +
                '<div class="hwm-score-value">' + avgScore + '<small>/100</small></div>' +
                '<div class="hwm-score-caption">' + caption.text + '</div>' +
            '</div>';

        // Summary
        html +=
            '<div class="hwm-summary-grid">' +
                '<div class="hwm-summary-card">' +
                    '<i class="fas fa-calendar-check" style="color: #1565C0;"></i>' +
                    '<span class="hwm-summary-value">' + days.length + '</span>' +
                    '<span class="hwm-summary-label">يوم مسجل</span>' +
                '</div>' +
                '<div class="hwm-summary-card">' +
                    '<i class="fas fa-bolt" style="color: #FF9800;"></i>' +
                    '<span class="hwm-summary-value">' +
                        (days.length > 0 ? Math.round(days.slice(-7).reduce(function (a, b) { return a + Number(b.energy || 3); }, 0) / Math.min(7, days.length) * 10) / 10 : '—') +
                    '</span>' +
                    '<span class="hwm-summary-label">متوسط الطاقة</span>' +
                '</div>' +
                '<div class="hwm-summary-card">' +
                    '<i class="fas fa-bed" style="color: #9C27B0;"></i>' +
                    '<span class="hwm-summary-value">' +
                        (days.length > 0 ? Math.round(days.slice(-7).reduce(function (a, b) { return a + Number(b.sleep || 3); }, 0) / Math.min(7, days.length) * 10) / 10 : '—') +
                    '</span>' +
                    '<span class="hwm-summary-label">متوسط النوم</span>' +
                '</div>' +
                '<div class="hwm-summary-card">' +
                    '<i class="fas fa-running" style="color: #4CAF50;"></i>' +
                    '<span class="hwm-summary-value">' +
                        days.slice(-7).filter(function (d) { return d.exercise; }).length +
                    '</span>' +
                    '<span class="hwm-summary-label">أيام تمرين (7)</span>' +
                '</div>' +
            '</div>';

        // Today check-in
        html +=
            '<div class="hwm-section">' +
                '<div class="hwm-section-title"><i class="fas fa-check-circle"></i> تسجيل اليوم (' + formatDate(todayKey) + ')</div>' +
                '<div class="hwm-card">';

        var fields = [
            { id: 'mood', label: 'المزاج', hint: 'كيف تشعر اليوم؟', icon: 'fa-smile', values: ['سيء جداً', 'سيء', 'عادي', 'جيد', 'ممتاز'] },
            { id: 'energy', label: 'الطاقة', hint: 'مستوى النشاط', icon: 'fa-bolt', values: ['ضعيف جداً', 'ضعيف', 'متوسط', 'جيد', 'ممتاز'] },
            { id: 'libido', label: 'الرغبة', hint: 'مستوى الدافع', icon: 'fa-heart', values: ['ضعيف جداً', 'ضعيف', 'متوسط', 'جيد', 'ممتاز'] },
            { id: 'sleep', label: 'جودة النوم', hint: 'كيف نمت ليلتك؟', icon: 'fa-bed', values: ['سيء جداً', 'سيء', 'متوسط', 'جيد', 'ممتاز'] },
            { id: 'focus', label: 'التركيز', hint: 'قدرتك على الانتباه', icon: 'fa-brain', values: ['ضعيف جداً', 'ضعيف', 'متوسط', 'جيد', 'ممتاز'] },
            { id: 'stress', label: 'التوتر', hint: '1 = مرتاح، 5 = مشدود', icon: 'fa-fire', values: ['منخفض', 'قليل', 'متوسط', 'مرتفع', 'مرتفع جداً'] }
        ];

        fields.forEach(function (f) {
            var current = Number(todayData[f.id] || 3);
            html +=
                '<div class="hwm-rating-field">' +
                    '<div class="hwm-rating-label">' +
                        '<span><i class="fas ' + f.icon + '" style="color:#1565C0;margin-left:4px;"></i> ' + f.label + '</span>' +
                        '<small>' + f.hint + '</small>' +
                    '</div>' +
                    '<div class="hwm-rating-options" data-field="' + f.id + '">';
            f.values.forEach(function (label, idx) {
                var selected = (idx + 1) === current ? ' selected' : '';
                html +=
                    '<button type="button" class="hwm-rating-btn' + selected + '" data-value="' + (idx + 1) + '">' +
                        label +
                    '</button>';
            });
            html += '</div></div>';
        });

        // Exercise toggle
        html +=
            '<div class="hwm-toggle-field">' +
                '<span><i class="fas fa-dumbbell" style="color:#4CAF50;margin-left:4px;"></i> مارست الرياضة اليوم؟</span>' +
                '<label class="toggle-switch" style="margin:0;">' +
                    '<input type="checkbox" id="hwm-exercise" ' + (todayData.exercise ? 'checked' : '') + '>' +
                    '<span class="toggle-slider"></span>' +
                '</label>' +
            '</div>';

        // Notes
        html +=
            '<div class="hwm-rating-field">' +
                '<div class="hwm-rating-label"><span>ملاحظة</span><small>(اختياري)</small></div>' +
                '<textarea class="hwm-textarea" id="hwm-notes" maxlength="200" placeholder="مثال: نمت متأخراً...">' +
                    (todayData.notes || '') +
                '</textarea>' +
            '</div>';

        html +=
                    '<div class="hwm-actions">' +
                        '<button type="button" class="btn btn-primary" onclick="saveHormonalWellnessDay()">' +
                            '<i class="fas fa-save"></i> حفظ تسجيل اليوم' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        // Chart (last 7 days)
        if (days.length >= 3) {
            html +=
                '<div class="hwm-section">' +
                    '<div class="hwm-section-title"><i class="fas fa-chart-line"></i> مؤشرك في آخر 7 أيام</div>' +
                    '<div class="hwm-card">' +
                        renderScoreChart(days.slice(-7)) +
                    '</div>' +
                '</div>';
        }

        // History
        html +=
            '<div class="hwm-section">' +
                '<div class="hwm-section-title"><i class="fas fa-history"></i> سجل التسجيلات</div>' +
                '<div class="hwm-card">';

        if (days.length === 0) {
            html +=
                '<div class="hwm-empty">' +
                    '<i class="fas fa-clipboard"></i>' +
                    '<p>لم تسجّل أي يوم بعد.</p>' +
                '</div>';
        } else {
            var sorted = days.slice().sort(function (a, b) {
                return (b.date || '').localeCompare(a.date || '');
            }).slice(0, 30);

            html += '<div class="hwm-history">';
            sorted.forEach(function (d) {
                var s = scoreDay(d);
                var cap = getScoreCaption(s);
                html +=
                    '<div class="hwm-history-item">' +
                        '<div class="hwm-history-icon"><i class="fas fa-mars"></i></div>' +
                        '<div class="hwm-history-info">' +
                            '<strong>' + formatDate(d.date) + '</strong>' +
                            '<small>المؤشر: <span style="color:' + cap.color + ';font-weight:700;">' + s + '/100</span> — ' + cap.text + '</small>' +
                        '</div>' +
                        '<button type="button" class="hwm-history-delete" onclick="deleteHormonalWellnessDay(\'' + d.date + '\')">' +
                            '<i class="fas fa-trash"></i>' +
                        '</button>' +
                    '</div>';
            });
            html += '</div>';
        }

        html += '</div></div>';

        html += '</div>';

        mainContent.innerHTML = html;

        // Attach rating handlers
        document.querySelectorAll('.hwm-rating-options').forEach(function (group) {
            group.querySelectorAll('.hwm-rating-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    group.querySelectorAll('.hwm-rating-btn').forEach(function (b) {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                });
            });
        });
    }

    function renderScoreChart(recentDays) {
        if (!recentDays || recentDays.length === 0) {
            return '<p style="text-align:center;color:var(--text-tertiary);font-size:12px;">لا توجد بيانات</p>';
        }

        var html = '<div class="hwm-chart">';
        recentDays.forEach(function (d) {
            var s = scoreDay(d);
            var height = Math.max(s, 6);
            var cls = 'hwm-chart-bar';
            if (s < 40) cls += ' is-low';

            var parts = d.date.split('-');
            var label = parts[2] + '/' + parts[1];

            html +=
                '<div class="hwm-chart-bar-wrapper">' +
                    '<div class="hwm-chart-value">' + s + '</div>' +
                    '<div class="' + cls + '" style="height: ' + height + '%;"></div>' +
                    '<div class="hwm-chart-label">' + label + '</div>' +
                '</div>';
        });
        html += '</div>';
        return html;
    }

    /*
     * SAVE / DELETE
     **/

    function saveHormonalWellnessDay() {
        var todayKey = getToday();
        var days = loadDays();

        function getVal(field) {
            var sel = document.querySelector('.hwm-rating-options[data-field="' + field + '"] .hwm-rating-btn.selected');
            return sel ? parseInt(sel.dataset.value, 10) : 3;
        }

        var record = {
            date: todayKey,
            mood: getVal('mood'),
            energy: getVal('energy'),
            libido: getVal('libido'),
            sleep: getVal('sleep'),
            focus: getVal('focus'),
            stress: getVal('stress'),
            exercise: document.getElementById('hwm-exercise') ? document.getElementById('hwm-exercise').checked : false,
            notes: document.getElementById('hwm-notes') ? document.getElementById('hwm-notes').value.trim() : '',
            createdAt: Date.now()
        };

        var idx = days.findIndex(function (d) { return d.date === todayKey; });
        if (idx >= 0) days[idx] = record;
        else days.push(record);

        saveDays(days);
        showToast('✓ تم حفظ تسجيل اليوم');

        updateHormonalWellnessScoreCard(days);
        updateHormonalWellnessSummary(days);
        updateHormonalWellnessHistory(days);
        updateHormonalWellnessChart(days);
    }

    /* Smart updates */

    function updateHormonalWellnessScoreCard(days) {
        var avgScore = getAverageScore(days.slice(-7));
        var caption = getScoreCaption(avgScore);

        var scoreEl = document.querySelector('.hwm-score-value');
        if (scoreEl) {
            scoreEl.innerHTML = avgScore + '<small>/100</small>';
            scoreEl.style.transform = 'scale(1.15)';
            setTimeout(function () { scoreEl.style.transform = ''; }, 200);
        }

        var captionEl = document.querySelector('.hwm-score-caption');
        if (captionEl) captionEl.textContent = caption.text;
    }

    function updateHormonalWellnessSummary(days) {
        var values = document.querySelectorAll('.hwm-summary-value');
        if (values.length < 4) return;

        var recent = days.slice(-7);
        var denom = Math.min(7, recent.length) || 1;

        values[0].textContent = days.length;
        values[1].textContent = recent.length > 0
            ? Math.round(recent.reduce(function (a, b) { return a + Number(b.energy || 3); }, 0) / denom * 10) / 10
            : '—';
        values[2].textContent = recent.length > 0
            ? Math.round(recent.reduce(function (a, b) { return a + Number(b.sleep || 3); }, 0) / denom * 10) / 10
            : '—';
        values[3].textContent = recent.filter(function (d) { return d.exercise; }).length;
    }

    function updateHormonalWellnessHistory(days) {
        var wrap = document.querySelector('.hwm-history');
        if (!wrap) return;

        var sorted = days.slice().sort(function (a, b) {
            return (b.date || '').localeCompare(a.date || '');
        }).slice(0, 30);

        var html = '';
        sorted.forEach(function (d) {
            var s = scoreDay(d);
            var cap = getScoreCaption(s);
            html +=
                '<div class="hwm-history-item">' +
                    '<div class="hwm-history-icon"><i class="fas fa-mars"></i></div>' +
                    '<div class="hwm-history-info">' +
                        '<strong>' + formatDate(d.date) + '</strong>' +
                        '<small>المؤشر: <span style="color:' + cap.color + ';font-weight:700;">' + s + '/100</span> — ' + cap.text + '</small>' +
                    '</div>' +
                    '<button type="button" class="hwm-history-delete" onclick="deleteHormonalWellnessDay(\'' + d.date + '\')">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                '</div>';
        });
        wrap.innerHTML = html;
    }

    function updateHormonalWellnessChart(days) {
        var chart = document.querySelector('.hwm-chart');
        if (!chart) return;

        var recent = days.slice(-7);
        var parent = chart.parentNode;
        if (parent) {
            var newChartHtml = renderScoreChart(recent);
            var tmp = document.createElement('div');
            tmp.innerHTML = newChartHtml;
            var newChart = tmp.firstElementChild;
            if (newChart) parent.replaceChild(newChart, chart);
        }
    }

    function deleteHormonalWellnessDay(date) {
        taeafiConfirm({
            type: 'danger',
            icon: 'fa-trash-alt',
            title: 'حذف التسجيل',
            message: 'هل أنت متأكد من حذف تسجيل ' + formatDate(date) + '؟',
            confirmText: 'حذف',
            cancelText: 'إلغاء'
        }).then(function (ok) {
            if (!ok) return;

            var days = loadDays().filter(function (d) { return d.date !== date; });
            saveDays(days);
            showToast('✓ تم الحذف');

            updateHormonalWellnessScoreCard(days);
            updateHormonalWellnessSummary(days);
            updateHormonalWellnessHistory(days);
            updateHormonalWellnessChart(days);
        });
    }

    /*
     * EXPORTS
     **/

    window.renderHormonalWellnessPage = renderHormonalWellnessPage;
    window.saveHormonalWellnessDay = saveHormonalWellnessDay;
    window.deleteHormonalWellnessDay = deleteHormonalWellnessDay;
})();
