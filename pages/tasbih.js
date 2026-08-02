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

function renderTasbihPage() {
    const mainContent = document.getElementById('main-content');
    
    // استعادة العداد من التخزين المحلي إذا وجد
    const savedTasbih = StorageManager.get('tasbih_data');
    if (savedTasbih) {
        tasbihCount = savedTasbih.counts || tasbihCount;
        tasbihTotalCount = savedTasbih.totalCount || 0;
        tasbihHistory = savedTasbih.history || [];
        currentTasbih = savedTasbih.current || 'allahuAkbar';
    }
    
    const totalProgress = Math.round(((tasbihCount.allahuAkbar + tasbihCount.alhamdulillah + tasbihCount.subhanAllah) / 100) * 100);
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-hands-praying" style="margin-left: 8px;"></i>
                التسبيح
            </h1>
            
            <!-- معلومات عن تسبيح الزهراء (عليها السلام) -->
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
            
            <!-- عداد التسبيح الرئيسي -->
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
                
                <!-- شريط التقدم -->
                <div style="margin-top: 20px; background: rgba(255,255,255,0.2); border-radius: 10px; height: 8px; overflow: hidden;">
                    <div id="tasbih-progress-bar" style="height: 100%; background: white; border-radius: 10px; transition: width 0.3s ease; width: ${getCurrentProgress()}%;"></div>
                </div>
            </div>
            
            <!-- ملخص التسبيحات الثلاث -->
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
            
            <!-- أزرار التحكم -->
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
            
            <!-- معلومات عن التسبيح -->
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
            
            <!-- سجل التسبيح -->
            ${tasbihHistory.length > 0 ? `
                <div class="card" style="margin-top: 20px;">
                    <h3 style="margin-bottom: 12px;">
                        <i class="fas fa-history" style="margin-left: 8px;"></i>
                        سجل التسبيحات السابقة
                    </h3>
                    ${tasbihHistory.slice(-5).reverse().map((record, index) => `
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

// ==================== دوال التسبيح ====================

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
    // التحقق من اكتمال العدد
    if (tasbihCount[currentTasbih] >= tasbihTarget[currentTasbih]) {
        // الانتقال للتسبيح التالي تلقائياً
        switchToNextTasbih();
        return;
    }
    
    // زيادة العداد
    tasbihCount[currentTasbih]++;
    tasbihTotalCount++;
    
    // اهتزاز خفيف عند العد
    vibrateDevice();
    
    // تحديث العرض
    updateTasbihDisplay();
    
    // حفظ البيانات
    saveTasbihData();
    
    // التحقق من اكتمال التسبيح الحالي
    if (tasbihCount[currentTasbih] >= tasbihTarget[currentTasbih]) {
        showToast(`أكملت ${getCurrentDhikrLabel()} - ${getCurrentTarget()} مرة`);
        
        // التحقق من اكتمال جميع التسبيحات
        if (isAllTasbihComplete()) {
            completeAllTasbih();
        } else {
            // انتقال تلقائي للتسبيح التالي بعد ثانية
            setTimeout(() => {
                switchToNextTasbih();
            }, 1000);
        }
    }
}

function decrementTasbih() {
    if (tasbihCount[currentTasbih] > 0) {
        tasbihCount[currentTasbih]--;
        tasbihTotalCount = Math.max(0, tasbihTotalCount - 1);
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
        // حفظ السجل قبل التصفير
        if (tasbihTotalCount >= 100) {
            tasbihHistory.push({
                date: new Date().toLocaleDateString('ar-SA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                total: tasbihTotalCount
            });
            
            // الاحتفاظ بآخر 10 تسجيلات فقط
            if (tasbihHistory.length > 10) {
                tasbihHistory = tasbihHistory.slice(-10);
            }
        }
        
        tasbihCount = { allahuAkbar: 0, alhamdulillah: 0, subhanAllah: 0 };
        tasbihTotalCount = 0;
        currentTasbih = 'allahuAkbar';
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
    // اهتزاز أطول للإشارة للاكتمال
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    showToast('أكملت تسبيح الزهراء (عليها السلام) - 100 ذكر - تقبل الله منك');
    
    // حفظ في السجل
    tasbihHistory.push({
        date: new Date().toLocaleDateString('ar-SA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        total: 100
    });
    
    if (tasbihHistory.length > 10) {
        tasbihHistory = tasbihHistory.slice(-10);
    }
    
    saveTasbihData();
}

function updateTasbihDisplay() {
    // تحديث العداد الرئيسي
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
    
    // تحديث لون بطاقة العداد حسب التسبيح الحالي
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

function saveTasbihData() {
    StorageManager.set('tasbih_data', {
        counts: tasbihCount,
        totalCount: tasbihTotalCount,
        current: currentTasbih,
        history: tasbihHistory
    });
}

// دعم اللمس المتعدد لمنع التكبير/التصغير على عداد التسبيح
document.addEventListener('DOMContentLoaded', () => {
    const counterCard = document.getElementById('tasbih-counter');
    if (counterCard) {
        counterCard.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});