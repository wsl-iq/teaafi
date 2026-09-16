/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : tasbih.js
 * Type: JavaScript
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

function renderTasbihPage() {
    const mainContent = document.getElementById('main-content');
    
    // Load saved data from storage
    loadTasbihData();
    
    const totalProgress = Math.round(((tasbihCount.allahuAkbar + tasbihCount.alhamdulillah + tasbihCount.subhanAllah) / 100) * 100);
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-hands-praying" style="margin-left: 8px;"></i>
                التسبيح
            </h1>
            
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
                <div class="card" style="text-align: center; ${currentTasbih === 'allahuAkbar' ? 'border: 2px solid #4CAF50;' : ''}" onclick="switchTasbih('allahuAkbar')">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">الله أكبر</div>
                    <div style="font-size: 28px; font-weight: 700; color: #4CAF50;">${tasbihCount.allahuAkbar}</div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">من 34</div>
                    ${tasbihCount.allahuAkbar >= 34 ? '<i class="fas fa-check-circle" style="color: #4CAF50; font-size: 20px; margin-top: 4px;"></i>' : ''}
                </div>
                
                <div class="card" style="text-align: center; ${currentTasbih === 'alhamdulillah' ? 'border: 2px solid #2196F3;' : ''}" onclick="switchTasbih('alhamdulillah')">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">الحمد لله</div>
                    <div style="font-size: 28px; font-weight: 700; color: #2196F3;">${tasbihCount.alhamdulillah}</div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">من 33</div>
                    ${tasbihCount.alhamdulillah >= 33 ? '<i class="fas fa-check-circle" style="color: #2196F3; font-size: 20px; margin-top: 4px;"></i>' : ''}
                </div>
                
                <div class="card" style="text-align: center; ${currentTasbih === 'subhanAllah' ? 'border: 2px solid #FF9800;' : ''}" onclick="switchTasbih('subhanAllah')">
                    <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">سبحان الله</div>
                    <div style="font-size: 28px; font-weight: 700; color: #FF9800;">${tasbihCount.subhanAllah}</div>
                    <div style="font-size: 12px; color: var(--text-tertiary);">من 33</div>
                    ${tasbihCount.subhanAllah >= 33 ? '<i class="fas fa-check-circle" style="color: #FF9800; font-size: 20px; margin-top: 4px;"></i>' : ''}
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
            
            ${tasbihHistory.length > 0 ? `
                <div class="card" style="margin-top: 20px;">
                    <h3 style="margin-bottom: 12px;">
                        <i class="fas fa-history" style="margin-left: 8px;"></i>
                        سجل التسبيحات السابقة (آخر ${Math.min(tasbihHistory.length, 10)} جلسة)
                    </h3>
                    <p style="font-size: 12px; color: var(--text-tertiary); margin-bottom: 12px;">
                        <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                        إجمالي التسبيحات الكلي: <strong>${tasbihTotalCount}</strong>
                    </p>
                    ${tasbihHistory.slice().reverse().map(record => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-light);">
                            <div>
                                <i class="fas fa-check-circle" style="color: #4CAF50; margin-left: 8px;"></i>
                                <span>${record.date}</span>
                            </div>
                            <span style="color: var(--primary); font-weight: 600;">${record.total} ذكر</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function loadTasbihData() {
    var savedData = StorageManager.get('tasbih_data');
    if (savedData) {
        tasbihCount = savedData.counts || { allahuAkbar: 0, alhamdulillah: 0, subhanAllah: 0 };
        tasbihTotalCount = Number(savedData.totalCount || 0);
        tasbihHistory = Array.isArray(savedData.history) ? savedData.history.slice(-10) : [];
        currentTasbih = savedData.current || 'allahuAkbar';
        
        // Ensure totalCount is at least the sum of counts
        var calculatedTotal = Number(tasbihCount.allahuAkbar || 0) + 
                             Number(tasbihCount.alhamdulillah || 0) + 
                             Number(tasbihCount.subhanAllah || 0);
        if (tasbihTotalCount < calculatedTotal) {
            tasbihTotalCount = calculatedTotal;
        }
    }
    
    // Load session data
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
    // If current dhikr is complete, switch to next
    if (tasbihCount[currentTasbih] >= tasbihTarget[currentTasbih]) {
        switchToNextTasbih();
        return;
    }
    
    // Increment current count
    tasbihCount[currentTasbih] = Number(tasbihCount[currentTasbih] || 0) + 1;
    tasbihTotalCount = Number(tasbihTotalCount || 0) + 1;
    
    // Update session stats
    var today = new Date().toDateString();
    tasbihSession.todayCount = Number(tasbihSession.todayCount || 0) + 1;
    tasbihSession.weeklyCount = Number(tasbihSession.weeklyCount || 0) + 1;
    tasbihSession.totalSessions = Number(tasbihSession.totalSessions || 0) + 1;
    
    // Vibrate
    vibrateDevice();
    
    // Update display
    updateTasbihDisplay();
    
    // Save data - this triggers the update chain
    saveTasbihData();
    
    // Check if current dhikr is complete
    if (tasbihCount[currentTasbih] >= tasbihTarget[currentTasbih]) {
        showToast(`أكملت ${getCurrentDhikrLabel()} - ${getCurrentTarget()} مرة`);
        
        if (isAllTasbihComplete()) {
            completeAllTasbih();
        } else {
            setTimeout(function() {
                switchToNextTasbih();
            }, 1000);
        }
    }
}

function decrementTasbih() {
    if (tasbihCount[currentTasbih] > 0) {
        tasbihCount[currentTasbih]--;
        tasbihTotalCount = Math.max(0, tasbihTotalCount - 1);
        tasbihSession.todayCount = Math.max(0, (tasbihSession.todayCount || 0) - 1);
        tasbihSession.weeklyCount = Math.max(0, (tasbihSession.weeklyCount || 0) - 1);
        updateTasbihDisplay();
        saveTasbihData();
    }
}

function switchTasbih(type) {
    currentTasbih = type;
    updateTasbihDisplay();
    saveTasbihData();
}

function switchToNextTasbih() {
    const order = ['allahuAkbar', 'alhamdulillah', 'subhanAllah'];
    const currentIndex = order.indexOf(currentTasbih);
    
    if (currentIndex < order.length - 1) {
        currentTasbih = order[currentIndex + 1];
        updateTasbihDisplay();
        saveTasbihData();
        showToast(`انتقل إلى: ${getCurrentDhikrLabel()}`);
    }
}

function resetCurrentTasbih() {
    if (confirm(`هل أنت متأكد من تصفير عداد "${getCurrentDhikrLabel()}"؟`)) {
        tasbihTotalCount = Math.max(0, tasbihTotalCount - tasbihCount[currentTasbih]);
        tasbihCount[currentTasbih] = 0;
        updateTasbihDisplay();
        saveTasbihData();
        showToast('تم تصفير العداد الحالي');
    }
}

function resetAllTasbih() {
    if (confirm('هل أنت متأكد من تصفير جميع العدادات؟')) {
        // Save record before resetting if total is significant
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
            if (tasbihHistory.length > 10) {
                tasbihHistory = tasbihHistory.slice(-10);
            }
        }
        
        tasbihCount = { allahuAkbar: 0, alhamdulillah: 0, subhanAllah: 0 };
        tasbihTotalCount = 0;
        currentTasbih = 'allahuAkbar';
        tasbihSession.todayCount = 0;
        tasbihSession.weeklyCount = 0;
        
        updateTasbihDisplay();
        saveTasbihData();
        showToast('تم تصفير جميع العدادات');
    }
}

function isAllTasbihComplete() {
    return tasbihCount.allahuAkbar >= 34 && 
           tasbihCount.alhamdulillah >= 33 && 
           tasbihCount.subhanAllah >= 33;
}

function completeAllTasbih() {
    // Long vibration for completion
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    showToast('أكملت تسبيح الزهراء (عليها السلام) - 100 ذكر - تقبل الله منك');
    
    // Save to history
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
    if (tasbihHistory.length > 10) {
        tasbihHistory = tasbihHistory.slice(-10);
    }
    
    saveTasbihData();
}

function updateTasbihDisplay() {
    const currentCountEl = document.getElementById('current-count');
    const currentLabelEl = document.getElementById('current-dhikr-label');
    const currentTargetEl = document.getElementById('current-target');
    const progressBar = document.getElementById('tasbih-progress-bar');
    
    if (currentCountEl) {
        currentCountEl.textContent = getCurrentCount();
        currentCountEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            currentCountEl.style.transform = 'scale(1)';
        }, 150);
    }
    
    if (currentLabelEl) {
        currentLabelEl.textContent = getCurrentDhikrLabel();
    }
    
    if (currentTargetEl) {
        currentTargetEl.textContent = `الهدف: ${getCurrentTarget()}`;
    }
    
    if (progressBar) {
        progressBar.style.width = getCurrentProgress() + '%';
    }
    
    // Update counter card color
    const counterCard = document.getElementById('tasbih-counter');
    if (counterCard) {
        const colors = {
            allahuAkbar: 'linear-gradient(135deg, #1B5E20, #4CAF50)',
            alhamdulillah: 'linear-gradient(135deg, #0D47A1, #2196F3)',
            subhanAllah: 'linear-gradient(135deg, #E65100, #FF9800)'
        };
        counterCard.style.background = colors[currentTasbih] || colors.allahuAkbar;
    }
}

function vibrateDevice() {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

/**
 * Save tasbih data and trigger update chain.
 * This is the single source of truth for tasbih data.
 */
function saveTasbihData() {
    var safeCounts = {
        allahuAkbar: Number(tasbihCount?.allahuAkbar || 0),
        alhamdulillah: Number(tasbihCount?.alhamdulillah || 0),
        subhanAllah: Number(tasbihCount?.subhanAllah || 0)
    };

    var safeTotal = Number(tasbihTotalCount || 0);
    
    // Recalculate total from counts to ensure consistency
    var calculatedTotal = safeCounts.allahuAkbar + safeCounts.alhamdulillah + safeCounts.subhanAllah;
    if (safeTotal < calculatedTotal) {
        safeTotal = calculatedTotal;
    }
    
    tasbihCount = safeCounts;
    tasbihTotalCount = safeTotal;

    // Save main data
    StorageManager.set('tasbih_data', {
        counts: safeCounts,
        totalCount: safeTotal,
        current: currentTasbih,
        history: Array.isArray(tasbihHistory) ? tasbihHistory.slice(-10) : []
    });
    
    // Save session data
    StorageManager.set('tasbih_session', tasbihSession);
    
    // ✅ CRITICAL: Notify all systems about the update
    if (typeof DataUpdateManager !== 'undefined') {
        DataUpdateManager.notifyDataChanged('tasbih', {
            totalCount: safeTotal,
            counts: safeCounts,
            current: currentTasbih
        });
    } else {
        // Fallback if DataUpdateManager is not loaded
        checkAchievementsAndChallenges();
    }
    
    // Dispatch event for any listeners
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

/**
 * Fallback achievement and challenge check.
 * Used if DataUpdateManager is not available.
 */
function checkAchievementsAndChallenges() {
    // Check achievements
    if (typeof AchievementsManager !== 'undefined' && 
        typeof AchievementsManager.checkAll === 'function') {
        try {
            AchievementsManager.checkAll();
        } catch (e) {
            console.warn('[Tasbih] Achievement check failed:', e);
        }
    }
    
    // Check challenges
    if (typeof ChallengesManager !== 'undefined' && 
        typeof ChallengesManager.checkAll === 'function') {
        try {
            ChallengesManager.checkAll();
        } catch (e) {
            console.warn('[Tasbih] Challenge check failed:', e);
        }
    }
}

// Multi-touch support to prevent zooming
document.addEventListener('DOMContentLoaded', function() {
    const counterCard = document.getElementById('tasbih-counter');
    if (counterCard) {
        counterCard.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // Load data on page load
    loadTasbihData();
});