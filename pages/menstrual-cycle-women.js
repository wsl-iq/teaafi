/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : menstrual-cycle-women.js
 * Type   : JavaScript
 *
 * Menstrual Cycle Tracker
 * - Log cycles (start, end, flow, pain, mood, symptoms, notes)
 * - Analyze patterns (average length, deviation, delay, absence)
 * - Show probabilistic reports (NOT medical diagnosis)
 * - Visualize with CSS charts
 */

(function () {
    'use strict';

    var KEY = 'menstrual_cycles';

    /*
     * STORAGE
     **/

    function loadCycles() {
        try {
            var data = StorageManager.get(KEY);
            if (!Array.isArray(data)) return [];
            return data;
        } catch (e) {
            return [];
        }
    }

    function saveCycles(arr) {
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

    function parseDate(str) {
        if (!str) return null;
        var parts = str.split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return null;
        var d = new Date(parts[0], parts[1] - 1, parts[2]);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function daysBetween(a, b) {
        var d1 = parseDate(a);
        var d2 = parseDate(b);
        if (!d1 || !d2) return 0;
        return Math.round((d2.getTime() - d1.getTime()) / 86400000);
    }

    function formatDate(dateStr) {
        var d = parseDate(dateStr);
        if (!d) return dateStr;
        var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
        return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    }

    /*
     * ANALYSIS
     **/

    function calculateStats(cycles) {
        if (!cycles || cycles.length < 1) {
            return {
                total: 0,
                averageLength: 0,
                shortest: 0,
                longest: 0,
                stdDev: 0,
                lastStart: null,
                daysSinceLast: 0,
                predictedNext: null,
                delayDays: 0,
                status: 'none'
            };
        }

        // Sort by start date ascending
        var sorted = cycles.slice().sort(function (a, b) {
            return (a.startDate || '').localeCompare(b.startDate || '');
        });

        var gaps = [];
        for (var i = 1; i < sorted.length; i++) {
            var g = daysBetween(sorted[i - 1].startDate, sorted[i].startDate);
            if (g > 0 && g < 90) gaps.push(g);
        }

        var avgLength = 0;
        var shortest = 0;
        var longest = 0;
        var stdDev = 0;

        if (gaps.length > 0) {
            var sum = gaps.reduce(function (a, b) { return a + b; }, 0);
            avgLength = Math.round(sum / gaps.length);
            shortest = Math.min.apply(null, gaps);
            longest = Math.max.apply(null, gaps);

            if (gaps.length > 1 && avgLength > 0) {
                var variance = gaps.reduce(function (acc, v) {
                    return acc + Math.pow(v - avgLength, 2);
                }, 0) / gaps.length;
                stdDev = Math.round(Math.sqrt(variance) * 10) / 10;
            }
        }

        var lastStart = sorted[sorted.length - 1].startDate;
        var daysSinceLast = daysBetween(lastStart, getToday());

        var predictedNext = null;
        if (avgLength > 0 && lastStart) {
            var d = parseDate(lastStart);
            d.setDate(d.getDate() + avgLength);
            predictedNext =
                d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0');
        }

        var delayDays = 0;
        if (predictedNext) {
            delayDays = daysBetween(predictedNext, getToday());
        }

        // Status classification
        var status = 'normal';
        if (!avgLength) status = 'single';
        else if (delayDays >= 90) status = 'absence';
        else if (delayDays >= 14) status = 'delay-high';
        else if (delayDays >= 5) status = 'delay-medium';
        else if (delayDays >= 1) status = 'delay-low';
        else if (delayDays < -7) status = 'early';
        else if (stdDev >= 7) status = 'irregular';
        else if (stdDev >= 4) status = 'slightly-irregular';
        else status = 'regular';

        return {
            total: cycles.length,
            averageLength: avgLength,
            shortest: shortest,
            longest: longest,
            stdDev: stdDev,
            lastStart: lastStart,
            daysSinceLast: daysSinceLast,
            predictedNext: predictedNext,
            delayDays: delayDays,
            status: status
        };
    }

    function getStatusBanner(stats) {
        var map = {
            'none': {
                type: 'info',
                icon: 'fa-info-circle',
                text: 'لم تُسجّل أي دورة بعد. أضف أول دورة لتبدأ بتحليل أنماطك.'
            },
            'single': {
                type: 'info',
                icon: 'fa-info-circle',
                text: 'سجّلتِ دورة واحدة. أضيفي دورة أخرى لبدء التحليل الاحتمالي.'
            },
            'regular': {
                type: 'success',
                icon: 'fa-check-circle',
                text: 'دورتك منتظمة بمتوسط ' + stats.averageLength + ' يوماً. استمري في التسجيل للحصول على تقرير أدق.'
            },
            'slightly-irregular': {
                type: 'warning',
                icon: 'fa-exclamation-triangle',
                text: 'هناك بعض التقلبات في طول دورتك (بمتوسط ' + stats.averageLength + ' يوماً). راقبي النمط لعدة أشهر.'
            },
            'irregular': {
                type: 'danger',
                icon: 'fa-exclamation-triangle',
                text: 'دورتك غير منتظمة (تباين كبير بين الدورات). يُنصح باستشارة مختص إذا استمر النمط.'
            },
            'delay-low': {
                type: 'warning',
                icon: 'fa-clock',
                text: 'دورتك متأخرة ' + stats.delayDays + ' يوماً عن المتوقع. قد يكون طبيعياً لأسباب مؤقتة (ضغط، سفر، نوم).'
            },
            'delay-medium': {
                type: 'warning',
                icon: 'fa-clock',
                text: 'دورتك متأخرة ' + stats.delayDays + ' يوماً. يُنصح بمتابعة الأعراض وتسجيل أي تغييرات.'
            },
            'delay-high': {
                type: 'danger',
                icon: 'fa-exclamation-triangle',
                text: 'دورتك متأخرة ' + stats.delayDays + ' يوماً. يُفضّل مراجعة مختص.'
            },
            'absence': {
                type: 'danger',
                icon: 'fa-exclamation-triangle',
                text: 'مرّ أكثر من 90 يوماً دون دورة. يُنصح بمراجعة مختص.'
            },
            'early': {
                type: 'warning',
                icon: 'fa-clock',
                text: 'دورتك متقدمة بمقدار ' + Math.abs(stats.delayDays) + ' يوماً عن المتوقع. قد يحدث أحياناً.'
            }
        };
        return map[stats.status] || map.none;
    }

    /*
     * PAIN LABELS
     **/

    var PAIN_LABELS = ['لا يوجد', 'خفيف', 'متوسط', 'شديد'];
    var FLOW_LABELS = ['خفيف', 'متوسط', 'غزير'];
    var MOOD_LABELS = ['سيء جداً', 'سيء', 'عادي', 'جيد', 'ممتاز'];
    var SYMPTOMS = [
        { id: 'fatigue', label: 'إجهاد' },
        { id: 'headache', label: 'صداع' },
        { id: 'bloating', label: 'انتفاخ' },
        { id: 'mood-swings', label: 'تقلبات مزاج' },
        { id: 'insomnia', label: 'أرق' },
        { id: 'appetite', label: 'تغير شهية' },
        { id: 'back-pain', label: 'ألم أسفل الظهر' },
        { id: 'nausea', label: 'غثيان' },
        { id: 'breast-tenderness', label: 'ألم الثدي' },
        { id: 'acne', label: 'حبوب' }
    ];

    /*
     * RENDER: PAGE
     **/

    function renderMenstrualCyclePage() {
        var mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        var cycles = loadCycles();
        var stats = calculateStats(cycles);
        var banner = getStatusBanner(stats);

        var html = '';

        // Header
        html +=
            '<div class="mcw-page animate-fade-in">' +
                '<div class="mcw-header">' +
                    '<div class="mcw-header-icon"><i class="fas fa-venus"></i></div>' +
                    '<h1 class="heading-underline">مراقبة التغيرات الهرمونية</h1>' +
                    '<p class="mcw-subtitle">' +
                        'سجّل دورتك لمتابعة الأنماط والتقلبات. ' +
                        'التقارير احتمالية فقط، وليست تشخيصاً طبياً.' +
                    '</p>' +
                '</div>';

        // Status banner
        html +=
            '<div class="mcw-status-banner type-' + banner.type + '">' +
                '<i class="fas ' + banner.icon + '"></i>' +
                '<p>' + banner.text + '</p>' +
            '</div>';

        // Summary
        html +=
            '<div class="mcw-summary-grid">' +
                '<div class="mcw-summary-card">' +
                    '<i class="fas fa-redo" style="color: #4CAF50;"></i>' +
                    '<span class="mcw-summary-value">' + stats.total + '</span>' +
                    '<span class="mcw-summary-label">دورة مسجلة</span>' +
                '</div>' +
                '<div class="mcw-summary-card">' +
                    '<i class="fas fa-ruler-horizontal" style="color: #2196F3;"></i>' +
                    '<span class="mcw-summary-value">' + (stats.averageLength || '—') + '</span>' +
                    '<span class="mcw-summary-label">متوسط الطول (يوم)</span>' +
                '</div>' +
                '<div class="mcw-summary-card">' +
                    '<i class="fas fa-calendar-day" style="color: #9C27B0;"></i>' +
                    '<span class="mcw-summary-value">' + (stats.daysSinceLast || '—') + '</span>' +
                    '<span class="mcw-summary-label">منذ آخر دورة</span>' +
                '</div>' +
                '<div class="mcw-summary-card">' +
                    '<i class="fas fa-clock" style="color: ' +
                        (stats.delayDays > 5 ? '#F44336' : stats.delayDays > 0 ? '#FF9800' : '#4CAF50') + ';"></i>' +
                    '<span class="mcw-summary-value">' +
                        (stats.delayDays > 0 ? '+' + stats.delayDays : stats.delayDays) +
                    '</span>' +
                    '<span class="mcw-summary-label">تأخر/تقدّم</span>' +
                '</div>' +
            '</div>';

        // Add cycle form
        html +=
            '<div class="mcw-section">' +
                '<div class="mcw-section-title"><i class="fas fa-plus-circle"></i> تسجيل دورة</div>' +
                '<div class="mcw-card">' +
                    '<div class="mcw-row">' +
                        '<div class="mcw-field">' +
                            '<label class="mcw-label">تاريخ البدء</label>' +
                            '<input type="date" class="mcw-input" id="mcw-start-date" value="' + getToday() + '" max="' + getToday() + '">' +
                        '</div>' +
                        '<div class="mcw-field">' +
                            '<label class="mcw-label">تاريخ الانتهاء <small>(اختياري)</small></label>' +
                            '<input type="date" class="mcw-input" id="mcw-end-date" max="' + getToday() + '">' +
                        '</div>' +
                    '</div>' +

                    '<div class="mcw-field">' +
                        '<label class="mcw-label">شدة الألم</label>' +
                        '<div class="mcw-options" id="mcw-pain-options">' +
                            '<button type="button" class="mcw-option pain-0" data-value="0">لا يوجد</button>' +
                            '<button type="button" class="mcw-option pain-1" data-value="1">خفيف</button>' +
                            '<button type="button" class="mcw-option pain-2" data-value="2">متوسط</button>' +
                            '<button type="button" class="mcw-option pain-3" data-value="3">شديد</button>' +
                        '</div>' +
                    '</div>' +

                    '<div class="mcw-field">' +
                        '<label class="mcw-label">التدفق</label>' +
                        '<div class="mcw-options" id="mcw-flow-options">' +
                            '<button type="button" class="mcw-option" data-value="0">خفيف</button>' +
                            '<button type="button" class="mcw-option" data-value="1">متوسط</button>' +
                            '<button type="button" class="mcw-option" data-value="2">غزير</button>' +
                        '</div>' +
                    '</div>' +

                    '<div class="mcw-field">' +
                        '<label class="mcw-label">المزاج</label>' +
                        '<div class="mcw-options" id="mcw-mood-options">' +
                            '<button type="button" class="mcw-option" data-value="0">سيء جداً</button>' +
                            '<button type="button" class="mcw-option" data-value="1">سيء</button>' +
                            '<button type="button" class="mcw-option" data-value="2">عادي</button>' +
                            '<button type="button" class="mcw-option" data-value="3">جيد</button>' +
                            '<button type="button" class="mcw-option" data-value="4">ممتاز</button>' +
                        '</div>' +
                    '</div>' +

                    '<div class="mcw-field">' +
                        '<label class="mcw-label">الأعراض <small>(اختياري)</small></label>' +
                        '<div class="mcw-chips" id="mcw-symptom-chips">';

        SYMPTOMS.forEach(function (s) {
            html += '<button type="button" class="mcw-chip" data-symptom="' + s.id + '">' + s.label + '</button>';
        });

        html +=
                        '</div>' +
                    '</div>' +

                    '<div class="mcw-field">' +
                        '<label class="mcw-label">ملاحظات <small>(اختياري)</small></label>' +
                        '<textarea class="mcw-textarea" id="mcw-notes" maxlength="300" placeholder="مثال: بدأت متأخرة 3 أيام..."></textarea>' +
                    '</div>' +

                    '<div class="mcw-actions">' +
                        '<button type="button" class="btn btn-primary" onclick="saveMenstrualCycle()">' +
                            '<i class="fas fa-save"></i> حفظ الدورة' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        // Charts
        if (cycles.length >= 2) {
            html +=
                '<div class="mcw-section">' +
                    '<div class="mcw-section-title"><i class="fas fa-chart-line"></i> طول الدورات السابقة</div>' +
                    '<div class="mcw-card">' +
                        renderCycleLengthChart(cycles, stats) +
                        '<p style="font-size:11px;color:var(--text-tertiary);text-align:center;margin-top:10px;">' +
                            'كل عمود يمثل المدة بين دورة والدورة التي تليها.' +
                        '</p>' +
                    '</div>' +
                '</div>';
        }

        // Pain chart
        if (cycles.length >= 1) {
            html +=
                '<div class="mcw-section">' +
                    '<div class="mcw-section-title"><i class="fas fa-chart-bar"></i> شدة الألم والتدفق</div>' +
                    '<div class="mcw-card">' +
                        renderPainFlowChart(cycles) +
                    '</div>' +
                '</div>';
        }

        // Symptom heatmap
        if (cycles.length >= 2) {
            html +=
                '<div class="mcw-section">' +
                    '<div class="mcw-section-title"><i class="fas fa-fire"></i> الأعراض الأكثر تكراراً</div>' +
                    '<div class="mcw-card">' +
                        renderSymptomHeatmap(cycles) +
                    '</div>' +
                '</div>';
        }

        // History
        html +=
            '<div class="mcw-section">' +
                '<div class="mcw-section-title"><i class="fas fa-history"></i> سجل الدورات</div>' +
                '<div class="mcw-card">';

        if (cycles.length === 0) {
            html +=
                '<div class="mcw-empty">' +
                    '<i class="fas fa-calendar-plus"></i>' +
                    '<p>لم تسجّلي أي دورة بعد.</p>' +
                    '<small>سجّلي دورتك الأولى من الأعلى.</small>' +
                '</div>';
        } else {
            var sortedDesc = cycles.slice().sort(function (a, b) {
                return (b.startDate || '').localeCompare(a.startDate || '');
            });

            html += '<div class="mcw-history">';
            sortedDesc.forEach(function (c, idx) {
                var painLabel = PAIN_LABELS[c.pain || 0] || '—';
                var flowLabel = FLOW_LABELS[c.flow || 1] || '—';
                var length = c.startDate && c.endDate ? daysBetween(c.startDate, c.endDate) + 1 : 0;

                html +=
                    '<div class="mcw-history-item">' +
                        '<div class="mcw-history-icon"><i class="fas fa-tint"></i></div>' +
                        '<div class="mcw-history-info">' +
                            '<strong>' + formatDate(c.startDate) + '</strong>' +
                            '<small>' +
                                'الألم: ' + painLabel +
                                ' • التدفق: ' + flowLabel +
                                (length > 0 ? ' • الطول: ' + length + ' يوم' : '') +
                            '</small>' +
                        '</div>' +
                        '<button type="button" class="mcw-history-delete" ' +
                                'onclick="deleteMenstrualCycle(\'' + c.id + '\')" ' +
                                'title="حذف">' +
                            '<i class="fas fa-trash"></i>' +
                        '</button>' +
                    '</div>';
            });
            html += '</div>';
        }

        html += '</div></div>';

        // Medical warning
        html +=
            '<div class="mcw-warning">' +
                '<i class="fas fa-exclamation-triangle"></i>' +
                '<p>' +
                    '<strong>تنبيه:</strong> ' +
                    'هذا التطبيق يُقدّم تقارير احتمالية بناءً على بياناتك فقط، ' +
                    'وليس تشخيصاً طبياً. استشيري مختصاً للاطمئنان الكامل.' +
                '</p>' +
            '</div>';

        html += '</div>'; // mcw-page

        mainContent.innerHTML = html;

        // Attach option button handlers
        attachOptionsHandlers();
    }

    /*
     * CHART HELPERS
     **/

    function renderCycleLengthChart(cycles, stats) {
        var sorted = cycles.slice().sort(function (a, b) {
            return (a.startDate || '').localeCompare(b.startDate || '');
        });

        var gaps = [];
        for (var i = 1; i < sorted.length; i++) {
            var g = daysBetween(sorted[i - 1].startDate, sorted[i].startDate);
            if (g > 0 && g < 90) {
                gaps.push({ value: g, label: formatDate(sorted[i].startDate) });
            }
        }

        if (gaps.length === 0) {
            return '<p style="text-align:center;color:var(--text-tertiary);font-size:12px;">لا توجد بيانات كافية</p>';
        }

        var max = Math.max.apply(null, gaps.map(function (x) { return x.value; }));

        var html = '<div class="mcw-chart">';
        gaps.forEach(function (g) {
            var height = Math.max((g.value / max) * 100, 6);
            var cls = 'mcw-chart-bar';
            if (stats.averageLength && Math.abs(g.value - stats.averageLength) >= 7) {
                cls += ' is-outlier';
            }
            if (g.value >= 60) cls += ' is-critical';

            html +=
                '<div class="mcw-chart-bar-wrapper">' +
                    '<div class="mcw-chart-value">' + g.value + '</div>' +
                    '<div class="' + cls + '" style="height: ' + height + '%;"></div>' +
                    '<div class="mcw-chart-label">' +
                        formatDate(g.label).split(' ').slice(0, 2).join(' ') +
                    '</div>' +
                '</div>';
        });
        html += '</div>';
        return html;
    }

    function renderPainFlowChart(cycles) {
        var sorted = cycles.slice().sort(function (a, b) {
            return (a.startDate || '').localeCompare(b.startDate || '');
        }).slice(-8);

        var html = '<div class="mcw-chart">';
        sorted.forEach(function (c) {
            var pain = c.pain || 0;
            var height = Math.max(((pain + 1) / 4) * 100, 6);
            var cls = 'mcw-chart-bar';
            if (pain >= 3) cls += ' is-critical';
            else if (pain >= 2) cls += ' is-outlier';

            html +=
                '<div class="mcw-chart-bar-wrapper">' +
                    '<div class="mcw-chart-value">' + PAIN_LABELS[pain] + '</div>' +
                    '<div class="' + cls + '" style="height: ' + height + '%;"></div>' +
                    '<div class="mcw-chart-label">' +
                        formatDate(c.startDate).split(' ').slice(0, 2).join(' ') +
                    '</div>' +
                '</div>';
        });
        html += '</div>';
        return html;
    }

    function renderSymptomHeatmap(cycles) {
        var counts = {};
        cycles.forEach(function (c) {
            if (!Array.isArray(c.symptoms)) return;
            c.symptoms.forEach(function (s) {
                counts[s] = (counts[s] || 0) + 1;
            });
        });

        var max = 0;
        for (var k in counts) {
            if (counts[k] > max) max = counts[k];
        }

        if (max === 0) {
            return '<p style="text-align:center;color:var(--text-tertiary);font-size:12px;">لم تُسجَّل أعراض بعد</p>';
        }

        var html = '<div class="mcw-heatmap">';
        SYMPTOMS.forEach(function (s) {
            var count = counts[s.id] || 0;
            if (count === 0) return;
            var intensity = Math.round((count / max) * 100);
            var bg = 'rgba(233, 30, 99, ' + (0.2 + (intensity / 100) * 0.7) + ')';
            html +=
                '<div class="mcw-heatmap-cell" style="background:' + bg + ';">' +
                    s.label +
                    '<br><small>' + count + ' مرة</small>' +
                '</div>';
        });
        html += '</div>';
        return html;
    }

    /*
     * EVENT HANDLERS
     **/

    function attachOptionsHandlers() {
        document.querySelectorAll('.mcw-options').forEach(function (group) {
            group.querySelectorAll('.mcw-option').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    group.querySelectorAll('.mcw-option').forEach(function (b) {
                        b.classList.remove('selected');
                    });
                    btn.classList.add('selected');
                });
            });
        });

        document.querySelectorAll('.mcw-chip').forEach(function (chip) {
            chip.addEventListener('click', function () {
                chip.classList.toggle('selected');
            });
        });
    }

    /*
     * SAVE / DELETE
     **/

    function saveMenstrualCycle() {
        var startEl = document.getElementById('mcw-start-date');
        var endEl = document.getElementById('mcw-end-date');
        var notesEl = document.getElementById('mcw-notes');

        var startDate = startEl ? startEl.value : '';
        var endDate = endEl ? endEl.value : '';
        var notes = notesEl ? notesEl.value.trim() : '';

        if (!startDate) { showToast('اختر تاريخ البدء'); return; }
        if (endDate && endDate < startDate) { showToast('تاريخ الانتهاء يجب أن يكون بعد البدء'); return; }

        var pain = 0, flow = 1, mood = 2;

        var painSel = document.querySelector('#mcw-pain-options .mcw-option.selected');
        if (painSel) pain = parseInt(painSel.dataset.value, 10) || 0;

        var flowSel = document.querySelector('#mcw-flow-options .mcw-option.selected');
        if (flowSel) flow = parseInt(flowSel.dataset.value, 10) || 1;

        var moodSel = document.querySelector('#mcw-mood-options .mcw-option.selected');
        if (moodSel) mood = parseInt(moodSel.dataset.value, 10) || 2;

        var symptoms = [];
        document.querySelectorAll('#mcw-symptom-chips .mcw-chip.selected').forEach(function (chip) {
            symptoms.push(chip.dataset.symptom);
        });

        var cycles = loadCycles();

        cycles.push({
            id: 'c_' + Date.now(),
            startDate: startDate,
            endDate: endDate || '',
            pain: pain,
            flow: flow,
            mood: mood,
            symptoms: symptoms,
            notes: notes,
            createdAt: Date.now()
        });
        saveCycles(cycles);

        showToast('✓ تم حفظ الدورة');
        updateMenstrualCycleBanner(cycles);
        updateMenstrualCycleSummary(cycles);
        updateMenstrualCycleHistory(cycles);
        updateMenstrualCycleCharts(cycles);
    }

    function updateMenstrualCycleBanner(cycles) {
        var stats = calculateStats(cycles);
        var banner = getStatusBanner(stats);
        var el = document.querySelector('.mcw-status-banner');
        if (!el) return;
        el.className = 'mcw-status-banner type-' + banner.type;
        el.innerHTML = '<i class="fas ' + banner.icon + '"></i><p>' + banner.text + '</p>';
    }

    function updateMenstrualCycleSummary(cycles) {
        var stats = calculateStats(cycles);
        var values = document.querySelectorAll('.mcw-summary-value');
        if (values.length < 4) return;
        values[0].textContent = stats.total;
        values[1].textContent = stats.averageLength || '—';
        values[2].textContent = stats.daysSinceLast || '—';
        values[3].textContent = (stats.delayDays > 0 ? '+' + stats.delayDays : stats.delayDays);
    }

    function updateMenstrualCycleHistory(cycles) {
        var wrap = document.querySelector('.mcw-history');
        var emptyWrap = document.querySelector('.mcw-card .mcw-empty');
        var target = wrap || emptyWrap;
        if (!target) return;

        if (cycles.length === 0) {
            target.parentNode.innerHTML =
                '<div class="mcw-empty">' +
                    '<i class="fas fa-calendar-plus"></i>' +
                    '<p>لم تسجّلي أي دورة بعد.</p>' +
                    '<small>سجّلي دورتك الأولى من الأعلى.</small>' +
                '</div>';
            return;
        }

        var sortedDesc = cycles.slice().sort(function (a, b) {
            return (b.startDate || '').localeCompare(a.startDate || '');
        });

        var html = '<div class="mcw-history">';
        sortedDesc.forEach(function (c) {
            var painLabel = PAIN_LABELS[c.pain || 0] || '—';
            var flowLabel = FLOW_LABELS[c.flow || 1] || '—';
            var length = c.startDate && c.endDate ? daysBetween(c.startDate, c.endDate) + 1 : 0;
            html +=
                '<div class="mcw-history-item">' +
                    '<div class="mcw-history-icon"><i class="fas fa-tint"></i></div>' +
                    '<div class="mcw-history-info">' +
                        '<strong>' + formatDate(c.startDate) + '</strong>' +
                        '<small>الألم: ' + painLabel + ' • التدفق: ' + flowLabel + (length > 0 ? ' • الطول: ' + length + ' يوم' : '') + '</small>' +
                    '</div>' +
                    '<button type="button" class="mcw-history-delete" onclick="deleteMenstrualCycle(\'' + c.id + '\')">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                '</div>';
        });
        html += '</div>';

        if (wrap) wrap.outerHTML = html;
        else if (emptyWrap) emptyWrap.outerHTML = html;
    }

    function updateMenstrualCycleCharts(cycles) {
        var stats = calculateStats(cycles);
        var chart = document.querySelector('.mcw-chart');
        if (chart && chart.parentNode) {
            var parent = chart.parentNode;
            var tmp = document.createElement('div');
            tmp.innerHTML = renderCycleLengthChart(cycles, stats) +
                '<p style="font-size:11px;color:var(--text-tertiary);text-align:center;margin-top:10px;">' +
                    'كل عمود يمثل المدة بين دورة والدورة التي تليها.' +
                '</p>';
            parent.innerHTML = tmp.innerHTML;
        }
    }

    function deleteMenstrualCycle(id) {
        taeafiConfirm({
            type: 'danger',
            icon: 'fa-trash-alt',
            title: 'حذف الدورة',
            message: 'هل أنت متأكدة من حذف هذه الدورة؟',
            confirmText: 'حذف',
            cancelText: 'إلغاء'
        }).then(function (ok) {
            if (!ok) return;

            var cycles = loadCycles().filter(function (c) { return c.id !== id; });
            saveCycles(cycles);
            showToast('✓ تم حذف الدورة');
            updateMenstrualCycleBanner(cycles);
            updateMenstrualCycleSummary(cycles);
            updateMenstrualCycleHistory(cycles);
            updateMenstrualCycleCharts(cycles);
        });
    }

    /*
     * EXPORTS
     **/

    window.renderMenstrualCyclePage = renderMenstrualCyclePage;
    window.saveMenstrualCycle = saveMenstrualCycle;
    window.deleteMenstrualCycle = deleteMenstrualCycle;
})();

