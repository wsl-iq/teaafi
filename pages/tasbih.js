/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : tasbih.js
 * Type: JavaScript
 */

/*
 * STATE — FATIMA'S TASBIH
 */

let tasbihCount = {
    allahuAkbar: 0,
    alhamdulillah: 0,
    subhanAllah: 0
};

let tasbihTarget = {
    allahuAkbar: 34,
    alhamdulillah: 33,
    subhanAllah: 33
};

let currentTasbih = 'allahuAkbar';
let tasbihTotalCount = 0;
let tasbihHistory = [];
let tasbihSession = {
    startTime: Date.now(),
    todayCount: 0,
    weeklyCount: 0,
    totalSessions: 0
};

/*
 * STATE — OPEN TASBIH
 */

let openTasbihCount = 0;
let openTasbihDhikr = '';
let openTasbihHistory = [];

/*
 * STATE — TABS
 */

let activeTasbihTab = 'fatima';

/**
 * Get the real total count — never stale.
 */
function getRealTasbihTotal() {
    var calculated = Number(tasbihCount?.allahuAkbar || 0) +
                    Number(tasbihCount?.alhamdulillah || 0) +
                    Number(tasbihCount?.subhanAllah || 0);
    return Math.max(Number(tasbihTotalCount || 0), calculated);
}

/*
 * MAIN RENDER
 */

function renderTasbihPage() {
    const mainContent = document.getElementById('main-content');

    // Load saved data from storage
    loadTasbihData();
    loadOpenTasbihData();

    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-hands-praying" style="margin-left: 8px;"></i>
                التسبيح
            </h1>

            <!-- Tabs -->
            <div class="tasbih-tabs">
                <button class="tasbih-tab ${activeTasbihTab === 'fatima' ? 'active' : ''}"
                        onclick="switchTasbihTab('fatima')">
                    <i class="fas fa-star-and-crescent"></i>
                    تسبيح فاطمة الزهراء
                </button>
                <button class="tasbih-tab ${activeTasbihTab === 'open' ? 'active' : ''}"
                        onclick="switchTasbihTab('open')">
                    <i class="fas fa-infinity"></i>
                    التسبيح المفتوح
                </button>
            </div>

            <!-- Tab 1: Fatima's Tasbih -->
            <div class="tasbih-tab-content ${activeTasbihTab === 'fatima' ? 'active' : ''}" id="tab-fatima">
                ${renderFatimaTab()}
            </div>

            <!-- Tab 2: Open Tasbih -->
            <div class="tasbih-tab-content ${activeTasbihTab === 'open' ? 'active' : ''}" id="tab-open">
                ${renderOpenTab()}
            </div>
        </div>
    `;

    attachTasbihTouchHandler();
    attachOpenCounterTouchHandler();
}

/*
 * TAB 1: FATIMA'S TASBIH
 */

function renderFatimaTab() {
    return `
        <div class="card" style="background: linear-gradient(135deg, #E8F5E9, #C8E6C9); border: none; margin-bottom: 20px;">
            <div style="text-align: center; margin-bottom: 16px;">
                <i class="fas fa-star-and-crescent" style="font-size: 40px; color: #2E7D32;"></i>
                <h2 style="color: #1B5E20; margin-top: 8px;">تسبيح السيدة فاطمة الزهراء (عليها السلام)</h2>
            </div>
            <p style="line-height: 2; color: #2E7D32; text-align: justify;">
                يُعد تسبيح السيدة فاطمة الزهراء (عليها السلام) من أعظم الأذكار المستحبة بعد الصلوات الواجبة،
                وقد علّمه النبي محمد (صلى الله عليه وآله وسلم) لابنته فاطمة الزهراء (عليها السلام).
            </p>
        </div>

        <div class="counter-card" style="background: linear-gradient(135deg, #1B5E20, #4CAF50); cursor: pointer;" onclick="incrementTasbih()" id="tasbih-counter">
            <div style="margin-bottom: 12px;">
                <i class="fas fa-fingerprint" style="font-size: 24px; opacity: 0.8;"></i>
                <p style="font-size: 14px; opacity: 0.9; margin-top: 4px;">اضغط هنا أو على الزر للعد</p>
            </div>

            <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px;" id="current-dhikr-label">
                ${getCurrentDhikrLabel()}
            </div>

            <div class="counter-value" id="current-count" style="font-size: 72px; margin: 12px 0;">
                ${getCurrentCount()}
            </div>

            <div style="font-size: 16px; opacity: 0.9;">
                <span id="current-target">الهدف: ${getCurrentTarget()}</span>
            </div>

            <div style="margin-top: 20px; background: rgba(255,255,255,0.2); border-radius: 10px; height: 8px; overflow: hidden;">
                <div id="tasbih-progress-bar" style="height: 100%; background: white; border-radius: 10px; transition: width 0.3s ease; width: ${getCurrentProgress()}%;"></div>
            </div>
        </div>

        <div class="cards-grid" style="margin-bottom: 16px;">
            <div class="card" id="card-allahuAkbar" style="text-align: center; ${currentTasbih === 'allahuAkbar' ? 'border: 2px solid #4CAF50;' : ''}" onclick="switchTasbih('allahuAkbar')">
                <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">الله أكبر</div>
                <div id="count-allahuAkbar" style="font-size: 28px; font-weight: 700; color: #4CAF50;">${tasbihCount.allahuAkbar}</div>
                <div style="font-size: 12px; color: var(--text-tertiary);">من 34</div>
                <div id="check-allahuAkbar">${tasbihCount.allahuAkbar >= 34 ? '<i class="fas fa-check-circle" style="color: #4CAF50; font-size: 20px; margin-top: 4px;"></i>' : ''}</div>
            </div>

            <div class="card" id="card-alhamdulillah" style="text-align: center; ${currentTasbih === 'alhamdulillah' ? 'border: 2px solid #2196F3;' : ''}" onclick="switchTasbih('alhamdulillah')">
                <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">الحمد لله</div>
                <div id="count-alhamdulillah" style="font-size: 28px; font-weight: 700; color: #2196F3;">${tasbihCount.alhamdulillah}</div>
                <div style="font-size: 12px; color: var(--text-tertiary);">من 33</div>
                <div id="check-alhamdulillah">${tasbihCount.alhamdulillah >= 33 ? '<i class="fas fa-check-circle" style="color: #2196F3; font-size: 20px; margin-top: 4px;"></i>' : ''}</div>
            </div>

            <div class="card" id="card-subhanAllah" style="text-align: center; ${currentTasbih === 'subhanAllah' ? 'border: 2px solid #FF9800;' : ''}" onclick="switchTasbih('subhanAllah')">
                <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">سبحان الله</div>
                <div id="count-subhanAllah" style="font-size: 28px; font-weight: 700; color: #FF9800;">${tasbihCount.subhanAllah}</div>
                <div style="font-size: 12px; color: var(--text-tertiary);">من 33</div>
                <div id="check-subhanAllah">${tasbihCount.subhanAllah >= 33 ? '<i class="fas fa-check-circle" style="color: #FF9800; font-size: 20px; margin-top: 4px;"></i>' : ''}</div>
            </div>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
            <button class="btn btn-primary" onclick="incrementTasbih()" style="flex: 1;">
                <i class="fas fa-plus-circle"></i>
                عدّ (${getCurrentDhikrShort()})
            </button>
            <button class="btn btn-outline" onclick="decrementTasbih()" style="flex: 1;">
                <i class="fas fa-minus-circle"></i>
                تراجع
            </button>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
            <button class="btn btn-outline btn-sm" onclick="resetCurrentTasbih()" style="flex: 1;">
                <i class="fas fa-redo"></i>
                تصفير الحالي
            </button>
            <button class="btn btn-outline btn-sm" onclick="resetAllTasbih()" style="flex: 1;">
                <i class="fas fa-trash-alt"></i>
                تصفير الكل
            </button>
        </div>

        <div class="card" style="background: var(--surface);">
            <h3 style="margin-bottom: 12px; color: #1B5E20;">
                <i class="fas fa-info-circle" style="margin-left: 8px;"></i>
                عن تسبيح الزهراء (عليها السلام)
            </h3>

            <div class="subsection" style="border-right-color: #4CAF50; margin-bottom: 12px;">
                <h4 style="color: #2E7D32; margin-bottom: 8px;">كيفية الأداء</h4>
                <p style="line-height: 2; color: var(--text-primary);">
                    • الله أكبر × 34 مرة<br>
                    • الحمد لله × 33 مرة<br>
                    • سبحان الله × 33 مرة<br>
                    المجموع: 100 ذكر
                </p>
            </div>

            <div class="subsection" style="border-right-color: #2196F3; margin-bottom: 12px;">
                <h4 style="color: #1565C0; margin-bottom: 8px;">فضل التسبيح</h4>
                <p style="line-height: 2; color: var(--text-primary);">
                    • من أفضل التعقيبات بعد الصلاة<br>
                    • يُعد من الذكر الكثير<br>
                    • سبب لمغفرة الذنوب<br>
                    • يُبعد الشيطان<br>
                    • يورث رضا الله تعالى<br>
                    • أفضل من صلاة ألف ركعة نافلة
                </p>
            </div>

            <div class="subsection" style="border-right-color: #FF9800; margin-bottom: 12px;">
                <h4 style="color: #E65100; margin-bottom: 8px;">آثار المواظبة عليه</h4>
                <p style="line-height: 2; color: var(--text-primary);">
                    • يورث التوفيق في الحياة والعبادة<br>
                    • يبعث السكينة والطمأنينة في القلب<br>
                    • يدفع الشقاء بإذن الله<br>
                    • يُغفر به الذنب<br>
                    • يرفع منزلة المؤمن ويقرّبه إلى الله
                </p>
            </div>

            <div class="subsection" style="border-right-color: #9C27B0;">
                <h4 style="color: #6A1B9A; margin-bottom: 8px;">الحكمة من التشريع</h4>
                <p style="line-height: 2; color: var(--text-primary);">
                    علّم النبي محمد (صلى الله عليه وآله وسلم) هذا الذكر للسيدة فاطمة الزهراء (عليها السلام)
                    عندما طلبت منه خادمة تُعينها في أعمال المنزل، فأرشدها إلى هذا الذكر المبارك،
                    لما فيه من أجرٍ عظيم وقربٍ من الله تعالى، وجعله خيراً لها من الخادم.
                </p>
            </div>
        </div>

        <div class="card" style="margin-top: 20px;" id="tasbih-history-card">
            <h3 style="margin-bottom: 12px;">
                <i class="fas fa-history" style="margin-left: 8px;"></i>
                سجل التسبيحات السابقة <span id="history-count">${tasbihHistory.length > 0 ? '(' + tasbihHistory.length + ' جلسة)' : ''}</span>
            </h3>
            <p style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 12px;">
                <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                إجمالي التسبيحات الكلي: <strong id="history-total">${getRealTasbihTotal()}</strong>
            </p>
            <div id="history-list">
                ${renderHistoryList()}
            </div>
        </div>
    `;
}

/*
 * TAB 2: OPEN TASBIH
 */

function renderOpenTab() {
    var suggestions = [
        'سبحان الله',
        'الحمد لله',
        'لا إله إلا الله',
        'الله أكبر',
        'أستغفر الله',
        'لا حول ولا قوة إلا بالله',
        'اللهم صل على محمد وآل محمد',
        'سبحان الله وبحمده',
        'سبحان الله العظيم',
        'لا إله إلا الله وحده لا شريك له'
    ];

    var currentDhikr = openTasbihDhikr || 'سبحان الله';

    return `
        <div class="open-tasbih-input-section">
            <label class="open-tasbih-label">
                <i class="fas fa-pen-fancy"></i>
                اختر أو اكتب الذكر
            </label>

            <input type="text"
                   class="open-tasbih-input"
                   id="open-tasbih-dhikr-input"
                   placeholder="مثال: سبحان الله"
                   value="${escapeHtmlAttr(openTasbihDhikr)}"
                   maxlength="80"
                   oninput="updateOpenDhikr(this.value)">

            <div class="open-tasbih-suggestions">
                ${suggestions.map(function(s) {
                    return `<span class="open-tasbih-chip" onclick="selectOpenDhikr('${escapeHtmlAttr(s)}')">${s}</span>`;
                }).join('')}
            </div>
        </div>

        <div class="open-counter-card" id="open-counter-card">
            <div class="open-counter-dhikr" id="open-dhikr-label">
                ${escapeHtml(currentDhikr)}
            </div>

            <div class="open-counter-value" id="open-counter-value">
                ${openTasbihCount}
            </div>

            <div class="open-counter-hint">
                <i class="fas fa-fingerprint"></i>
                <span>اضغط هنا أو على زر العدّ</span>
            </div>
        </div>

        <div class="open-counter-actions">
            <button class="btn btn-primary" onclick="incrementOpenTasbih()" style="flex: 1;">
                <i class="fas fa-plus-circle"></i>
                عدّ
            </button>
            <button class="btn btn-outline" onclick="decrementOpenTasbih()" style="flex: 1;">
                <i class="fas fa-minus-circle"></i>
                تراجع
            </button>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 24px;">
            <button class="btn btn-outline btn-sm" onclick="resetOpenTasbih()" style="flex: 1;">
                <i class="fas fa-redo"></i>
                تصفير العداد
            </button>
        </div>

        <div class="card">
            <h3 style="margin-bottom: 12px;">
                <i class="fas fa-info-circle" style="margin-left: 8px; color: var(--primary);"></i>
                عن التسبيح المفتوح
            </h3>
            <p style="line-height: 2; color: var(--text-secondary); font-size: 14px;">
                التسبيح المفتوح يمنحك حرية اختيار الذكر الذي تريد التسبيح به، دون التقيد بعدد محدد.
                يمكنك استخدامه لأي ذكر، استغفار، صلاة على النبي، أو دعاء.
            </p>
            <p style="line-height: 2; color: var(--text-secondary); font-size: 14px; margin-top: 10px;">
                <i class="fas fa-lightbulb" style="color: #FFC107; margin-left: 4px;"></i>
                <strong>نصيحة:</strong> اختر ذكراً من الاقتراحات أو اكتب ذكرك المفضل.
            </p>
        </div>
    `;
}

/*
 * TAB SWITCHING
 */

function switchTasbihTab(tab) {
    if (tab !== 'fatima' && tab !== 'open') return;

    activeTasbihTab = tab;

    document.querySelectorAll('.tasbih-tab').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('onclick').indexOf(tab) !== -1);
    });

    document.querySelectorAll('.tasbih-tab-content').forEach(function (el) {
        el.classList.remove('active');
    });

    var target = document.getElementById('tab-' + tab);
    if (target) target.classList.add('active');
}

/*
 * OPEN TASBIH LOGIC
 */

function loadOpenTasbihData() {
    var data = StorageManager.get('tasbih_open_data') || {};
    openTasbihCount = Number(data.count || 0);
    openTasbihDhikr = data.dhikr || '';
    openTasbihHistory = Array.isArray(data.history) ? data.history : [];
}

function saveOpenTasbihData() {
    StorageManager.set('tasbih_open_data', {
        count: openTasbihCount,
        dhikr: openTasbihDhikr,
        history: openTasbihHistory,
        updatedAt: Date.now()
    });
}

function updateOpenDhikr(value) {
    openTasbihDhikr = String(value || '').substring(0, 80);
    var label = document.getElementById('open-dhikr-label');
    if (label) {
        label.textContent = openTasbihDhikr || 'سبحان الله';
    }
    saveOpenTasbihData();
}

function selectOpenDhikr(value) {
    var input = document.getElementById('open-tasbih-dhikr-input');
    if (input) {
        input.value = value;
    }
    openTasbihDhikr = value;
    var label = document.getElementById('open-dhikr-label');
    if (label) {
        label.textContent = value;
    }
    saveOpenTasbihData();
}

function incrementOpenTasbih() {
    openTasbihCount = Number(openTasbihCount || 0) + 1;

    var valueEl = document.getElementById('open-counter-value');
    if (valueEl) {
        valueEl.textContent = openTasbihCount;
        valueEl.classList.add('pulse');
        setTimeout(function () {
            valueEl.classList.remove('pulse');
        }, 150);
    }

    if (navigator.vibrate) {
        navigator.vibrate(30);
    }

    saveOpenTasbihData();
}

function decrementOpenTasbih() {
    if (openTasbihCount > 0) {
        openTasbihCount--;

        var valueEl = document.getElementById('open-counter-value');
        if (valueEl) {
            valueEl.textContent = openTasbihCount;
        }

        saveOpenTasbihData();
    }
}

function resetOpenTasbih() {
    if (confirm('هل أنت متأكد من تصفير العداد المفتوح؟')) {
        // Save to history if significant
        if (openTasbihCount >= 33) {
            openTasbihHistory.push({
                date: new Date().toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                total: openTasbihCount,
                dhikr: openTasbihDhikr || 'سبحان الله',
                timestamp: Date.now()
            });
        }

        openTasbihCount = 0;

        var valueEl = document.getElementById('open-counter-value');
        if (valueEl) {
            valueEl.textContent = 0;
        }

        saveOpenTasbihData();

        if (typeof showToast === 'function') {
            showToast('تم تصفير العداد المفتوح');
        }
    }
}

function attachOpenCounterTouchHandler() {
    var card = document.getElementById('open-counter-card');
    if (!card) return;

    if (card.dataset.bound === 'true') return;
    card.dataset.bound = 'true';

    card.addEventListener('click', function () {
        incrementOpenTasbih();
    });

    card.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
}

/*
 * FATIMA'S TASBIH — EXISTING LOGIC
 */

function renderHistoryList() {
    if (tasbihHistory.length === 0) {
        return `
            <div style="text-align: center; padding: 30px 20px; color: var(--text-tertiary);">
                <i class="fas fa-clock" style="font-size: 32px; opacity: 0.4; display: block; margin-bottom: 12px;"></i>
                <p style="font-size: 13px; margin: 0;">لا توجد جلسات سابقة بعد</p>
                <p style="font-size: 11px; margin-top: 4px;">سيظهر هنا كل إكمال 100 تسبيحة</p>
            </div>
        `;
    }

    return tasbihHistory.slice().reverse().map(record => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-light);">
            <div>
                <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 8px;"></i>
                <span>${record.date}</span>
            </div>
            <span style="color: var(--primary); font-weight: 600;">${record.total} ذكر</span>
        </div>
    `).join('');
}

function updateHistorySection() {
    var countEl = document.getElementById('history-count');
    var totalEl = document.getElementById('history-total');
    var listEl = document.getElementById('history-list');

    if (countEl) {
        countEl.textContent = tasbihHistory.length > 0 ? '(' + tasbihHistory.length + ' جلسة)' : '';
    }
    if (totalEl) {
        totalEl.textContent = getRealTasbihTotal();
    }
    if (listEl) {
        listEl.innerHTML = renderHistoryList();
    }
}

function loadTasbihData() {
    var savedData = StorageManager.get('tasbih_data');
    if (savedData) {
        tasbihCount = savedData.counts || { allahuAkbar: 0, alhamdulillah: 0, subhanAllah: 0 };
        tasbihTotalCount = Number(savedData.totalCount || 0);
        tasbihHistory = Array.isArray(savedData.history) ? savedData.history : [];
        currentTasbih = savedData.current || 'allahuAkbar';

        var calculatedTotal = Number(tasbihCount.allahuAkbar || 0) +
                             Number(tasbihCount.alhamdulillah || 0) +
                             Number(tasbihCount.subhanAllah || 0);
        if (tasbihTotalCount < calculatedTotal) {
            tasbihTotalCount = calculatedTotal;
        }
    }

    var sessionData = StorageManager.get('tasbih_session');
    if (sessionData) {
        tasbihSession = sessionData;
    }
}

function getCurrentDhikrLabel() {
    const labels = {
        allahuAkbar: 'الله أكبر',
        alhamdulillah: 'الحمد لله',
        subhanAllah: 'سبحان الله'
    };
    return labels[currentTasbih] || 'الله أكبر';
}

function getCurrentDhikrShort() {
    const labels = {
        allahuAkbar: 'الله أكبر',
        alhamdulillah: 'الحمد لله',
        subhanAllah: 'سبحان الله'
    };
    return labels[currentTasbih] || 'الله أكبر';
}

function getCurrentCount() {
    return tasbihCount[currentTasbih] || 0;
}

function getCurrentTarget() {
    return tasbihTarget[currentTasbih] || 34;
}

function getCurrentProgress() {
    const count = getCurrentCount();
    const target = getCurrentTarget();
    return Math.min(Math.round((count / target) * 100), 100);
}

function incrementTasbih() {
    // If current dhikr is already complete, advance
    if (tasbihCount[currentTasbih] >= tasbihTarget[currentTasbih]) {
        if (isAllTasbihComplete()) {
            // Show celebration modal instead of auto-restarting
            showCompletionModal();
            return;
        }
        moveToNextIncompleteDhikr();
        return;
    }

    tasbihCount[currentTasbih] = Number(tasbihCount[currentTasbih] || 0) + 1;
    tasbihTotalCount = Number(tasbihTotalCount || 0) + 1;

    tasbihSession.todayCount = Number(tasbihSession.todayCount || 0) + 1;
    tasbihSession.weeklyCount = Number(tasbihSession.weeklyCount || 0) + 1;
    tasbihSession.totalSessions = Number(tasbihSession.totalSessions || 0) + 1;

    vibrateDevice();
    updateTasbihDisplay();
    saveTasbihData();

    // Auto-save history record every 100 total
    if (tasbihTotalCount > 0 && tasbihTotalCount % 100 === 0) {
        addHistoryRecord(tasbihTotalCount);
        updateHistorySection();
    }

    // Check if current dhikr is complete
    if (tasbihCount[currentTasbih] >= tasbihTarget[currentTasbih]) {
        if (isAllTasbihComplete()) {
            // The 100 tasbih are complete — celebrate immediately
            completeAllTasbih();
            showCompletionModal();
        } else {
            // Move to next dhikr after a short pause
            setTimeout(function () {
                moveToNextIncompleteDhikr();
            }, 500);
        }
    }
}

function addHistoryRecord(total) {
    var record = {
        date: new Date().toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        total: Number(total || 100),
        timestamp: Date.now(),
        type: 'milestone'
    };

    tasbihHistory.push(record);
    saveTasbihData();
}

function moveToNextIncompleteDhikr() {
    var order = ['allahuAkbar', 'alhamdulillah', 'subhanAllah'];

    for (var i = 0; i < order.length; i++) {
        var id = order[i];
        if (tasbihCount[id] < tasbihTarget[id]) {
            if (currentTasbih !== id) {
                currentTasbih = id;
                updateTasbihDisplay();
                saveTasbihData();
                showToast('انتقل إلى: ' + getCurrentDhikrLabel());
            }
            return;
        }
    }
}

function startNewRound() {
    tasbihCount = { allahuAkbar: 0, alhamdulillah: 0, subhanAllah: 0 };
    currentTasbih = 'allahuAkbar';

    updateTasbihDisplay();
    saveTasbihData();

    renderTasbihPage();

    showToast('بدأت جولة جديدة');
}

function decrementTasbih() {
    if (tasbihCount[currentTasbih] > 0) {
        tasbihCount[currentTasbih]--;
        tasbihTotalCount = Math.max(0, tasbihTotalCount - 1);
        tasbihSession.todayCount = Math.max(0, (tasbihSession.todayCount || 0) - 1);
        tasbihSession.weeklyCount = Math.max(0, (tasbihSession.weeklyCount || 0) - 1);
        updateTasbihDisplay();
        saveTasbihData();
        updateHistorySection();
    }
}

function switchTasbih(type) {
    if (tasbihCount[type] >= tasbihTarget[type]) {
        if (isAllTasbihComplete()) {
            startNewRound();
            return;
        }
        showToast('أكملت هذا الذكر - انتقل للذكر التالي');
        return;
    }

    currentTasbih = type;
    updateTasbihDisplay();
    saveTasbihData();
}

function resetCurrentTasbih() {
    if (confirm(`هل أنت متأكد من تصفير عداد "${getCurrentDhikrLabel()}"؟`)) {
        tasbihTotalCount = Math.max(0, tasbihTotalCount - tasbihCount[currentTasbih]);
        tasbihCount[currentTasbih] = 0;
        updateTasbihDisplay();
        saveTasbihData();
        updateHistorySection();
        showToast('تم تصفير العداد الحالي');
    }
}

function resetAllTasbih() {
    if (confirm('هل أنت متأكد من تصفير جميع العدادات؟')) {
        if (tasbihTotalCount >= 100) {
            var record = {
                date: new Date().toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                total: tasbihTotalCount,
                timestamp: Date.now(),
                counts: { ...tasbihCount }
            };

            tasbihHistory.push(record);
        }

        tasbihCount = { allahuAkbar: 0, alhamdulillah: 0, subhanAllah: 0 };
        tasbihTotalCount = 0;
        currentTasbih = 'allahuAkbar';
        tasbihSession.todayCount = 0;
        tasbihSession.weeklyCount = 0;

        updateTasbihDisplay();
        saveTasbihData();
        updateHistorySection();
        showToast('تم تصفير جميع العدادات');
    }
}

function isAllTasbihComplete() {
    return tasbihCount.allahuAkbar >= 34 &&
           tasbihCount.alhamdulillah >= 33 &&
           tasbihCount.subhanAllah >= 33;
}

function completeAllTasbih() {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }

    var record = {
        date: new Date().toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        total: 100,
        timestamp: Date.now(),
        type: 'complete'
    };

    tasbihHistory.push(record);

    saveTasbihData();
    updateHistorySection();

    // Award XP
    if (typeof XPSystem !== 'undefined' && typeof XPSystem.addXP === 'function') {
        XPSystem.addXP('tasbih_100');
    }
}

/*
 * COMPLETION CELEBRATION MODAL
 */

function showCompletionModal() {
    // Avoid duplicates
    var existing = document.querySelector('.tasbih-complete-modal');
    if (existing) existing.remove();

    var modal = document.createElement('div');
    modal.className = 'tasbih-complete-modal';
    modal.innerHTML = `
        <div class="tasbih-complete-card">
            <div class="tasbih-complete-confetti">
                <span></span><span></span><span></span>
                <span></span><span></span><span></span>
            </div>

            <div class="tasbih-complete-icon">
                <i class="fas fa-check"></i>
            </div>

            <h2>أكملت التسبيح</h2>

            <p class="tasbih-complete-subtitle">
                تقبل الله منكم صالح الأعمال
            </p>

            <div class="tasbih-complete-breakdown">
                <div class="tasbih-complete-row">
                    <span class="tasbih-complete-row-label">
                        <i class="fas fa-circle" style="color: #4CAF50;"></i>
                        الله أكبر
                    </span>
                    <span class="tasbih-complete-row-value">34</span>
                </div>
                <div class="tasbih-complete-row">
                    <span class="tasbih-complete-row-label">
                        <i class="fas fa-circle" style="color: #2196F3;"></i>
                        الحمد لله
                    </span>
                    <span class="tasbih-complete-row-value">33</span>
                </div>
                <div class="tasbih-complete-row">
                    <span class="tasbih-complete-row-label">
                        <i class="fas fa-circle" style="color: #FF9800;"></i>
                        سبحان الله
                    </span>
                    <span class="tasbih-complete-row-value">33</span>
                </div>
                <div class="tasbih-complete-row">
                    <span class="tasbih-complete-row-label">
                        <i class="fas fa-star" style="color: #FFD700;"></i>
                        المجموع
                    </span>
                    <span class="tasbih-complete-row-value">100</span>
                </div>
            </div>

            <div class="tasbih-complete-dua">
                <i class="fas fa-hands-praying"></i>
                تقبل الله منكم صالح الأعمال
            </div>

            <div class="tasbih-complete-actions">
                <button class="btn btn-outline" id="tasbih-complete-exit">
                    <i class="fas fa-times"></i>
                    خروج
                </button>
                <button class="btn btn-primary" id="tasbih-complete-again">
                    <i class="fas fa-redo"></i>
                    تسبيح مرة أخرى
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Exit button — close modal, leave counts as-is (100)
    modal.querySelector('#tasbih-complete-exit').addEventListener('click', function () {
        modal.style.animation = 'tasbihCompleteFadeIn 0.3s ease reverse';
        setTimeout(function () {
            modal.remove();
        }, 300);
    });

    // Again button — close modal + start a new round
    modal.querySelector('#tasbih-complete-again').addEventListener('click', function () {
        modal.remove();
        startNewRound();
    });
}

/*
 * DISPLAY UPDATES
 */

function updateTasbihDisplay() {
    const currentCountEl = document.getElementById('current-count');
    if (currentCountEl) {
        currentCountEl.textContent = getCurrentCount();
        currentCountEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            currentCountEl.style.transform = 'scale(1)';
        }, 150);
    }

    const currentLabelEl = document.getElementById('current-dhikr-label');
    if (currentLabelEl) {
        currentLabelEl.textContent = getCurrentDhikrLabel();
    }

    const currentTargetEl = document.getElementById('current-target');
    if (currentTargetEl) {
        currentTargetEl.textContent = `الهدف: ${getCurrentTarget()}`;
    }

    const progressBar = document.getElementById('tasbih-progress-bar');
    if (progressBar) {
        progressBar.style.width = getCurrentProgress() + '%';
    }

    const counterCard = document.getElementById('tasbih-counter');
    if (counterCard) {
        const colors = {
            allahuAkbar: 'linear-gradient(135deg, #1B5E20, #4CAF50)',
            alhamdulillah: 'linear-gradient(135deg, #0D47A1, #2196F3)',
            subhanAllah: 'linear-gradient(135deg, #E65100, #FF9800)'
        };
        counterCard.style.background = colors[currentTasbih] || colors.allahuAkbar;
    }

    var cardCountEls = {
        allahuAkbar: document.getElementById('count-allahuAkbar'),
        alhamdulillah: document.getElementById('count-alhamdulillah'),
        subhanAllah: document.getElementById('count-subhanAllah')
    };

    var cardCheckEls = {
        allahuAkbar: document.getElementById('check-allahuAkbar'),
        alhamdulillah: document.getElementById('check-alhamdulillah'),
        subhanAllah: document.getElementById('check-subhanAllah')
    };

    var cardEls = {
        allahuAkbar: document.getElementById('card-allahuAkbar'),
        alhamdulillah: document.getElementById('card-alhamdulillah'),
        subhanAllah: document.getElementById('card-subhanAllah')
    };

    var targets = { allahuAkbar: 34, alhamdulillah: 33, subhanAllah: 33 };
    var colors = { allahuAkbar: '#4CAF50', alhamdulillah: '#2196F3', subhanAllah: '#FF9800' };

    Object.keys(cardCountEls).forEach(function (key) {
        var countEl = cardCountEls[key];
        if (countEl) {
            countEl.textContent = tasbihCount[key] || 0;
        }

        var checkEl = cardCheckEls[key];
        if (checkEl) {
            if ((tasbihCount[key] || 0) >= targets[key]) {
                checkEl.innerHTML = '<i class="fas fa-check-circle" style="color: ' + colors[key] + '; font-size: 20px; margin-top: 4px;"></i>';
            } else {
                checkEl.innerHTML = '';
            }
        }

        var cardEl = cardEls[key];
        if (cardEl) {
            if (currentTasbih === key) {
                cardEl.style.border = '2px solid ' + colors[key];
            } else {
                cardEl.style.border = '1px solid var(--border-light)';
            }
        }
    });

    var historyTotalEl = document.getElementById('history-total');
    if (historyTotalEl) {
        historyTotalEl.textContent = getRealTasbihTotal();
    }
}

function vibrateDevice() {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

/*
 * SAVE / LOAD
 */

function saveTasbihData() {
    var safeCounts = {
        allahuAkbar: Number(tasbihCount?.allahuAkbar || 0),
        alhamdulillah: Number(tasbihCount?.alhamdulillah || 0),
        subhanAllah: Number(tasbihCount?.subhanAllah || 0)
    };

    var calculatedTotal = safeCounts.allahuAkbar + safeCounts.alhamdulillah + safeCounts.subhanAllah;
    var safeTotal = Math.max(Number(tasbihTotalCount || 0), calculatedTotal);

    tasbihCount = safeCounts;
    tasbihTotalCount = safeTotal;

    var fullHistory = Array.isArray(tasbihHistory) ? tasbihHistory : [];

    StorageManager.set('tasbih_data', {
        counts: safeCounts,
        totalCount: safeTotal,
        current: currentTasbih,
        history: fullHistory
    });

    StorageManager.set('tasbih_session', tasbihSession);

    if (typeof DataUpdateManager !== 'undefined') {
        DataUpdateManager.notifyDataChanged('tasbih', {
            totalCount: safeTotal,
            counts: safeCounts,
            current: currentTasbih
        });
    } else {
        checkAchievementsAndChallenges();
    }

    try {
        window.dispatchEvent(new CustomEvent('taeafiTasbihUpdated', {
            detail: {
                totalCount: safeTotal,
                counts: safeCounts,
                timestamp: Date.now()
            }
        }));
    } catch (e) {}
}

function checkAchievementsAndChallenges() {
    if (typeof AchievementsManager !== 'undefined' &&
        typeof AchievementsManager.checkAll === 'function') {
        try {
            AchievementsManager.checkAll();
        } catch (e) {}
    }

    if (typeof ChallengesManager !== 'undefined' &&
        typeof ChallengesManager.checkAll === 'function') {
        try {
            ChallengesManager.checkAll();
        } catch (e) {}
    }
}

/*
 * HELPERS
 */

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeHtmlAttr(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/*
   TOUCH HANDLERS
 */

function attachTasbihTouchHandler() {
    const counterCard = document.getElementById('tasbih-counter');
    if (counterCard) {
        counterCard.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

/*
 * INIT
 */

document.addEventListener('DOMContentLoaded', function() {
    attachTasbihTouchHandler();
    loadTasbihData();
    loadOpenTasbihData();
});