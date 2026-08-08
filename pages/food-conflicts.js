function renderFoodConflictsPage() {
    var mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-skull-crossbones" style="margin-left:8px;color:#F44336;"></i>
                فحص تعارضات الطعام
            </h1>
            <p class="text-secondary mb-6">أدخل مكونات وجبتك لتحليل التعارضات بشكل دقيق</p>
            
            <!-- نظام إدخال المكونات -->
            <div class="card" style="margin-bottom:16px;">
                <h3 style="margin-bottom:12px;">
                    <i class="fas fa-list-ul" style="margin-left:8px;"></i> مكونات الوجبة
                </h3>
                
                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <input type="text" id="ingredient-input" placeholder="أضف مكون (مثال: حليب)" 
                           style="flex:1;padding:14px 16px;border-radius:24px;border:1px solid var(--border);font-size:15px;background:var(--input-bg);color:var(--text-primary);"
                           onkeydown="if(event.key==='Enter')addIngredient()">
                    <button class="btn btn-primary" onclick="addIngredient()" style="border-radius:50%;width:48px;height:48px;padding:0;flex-shrink:0;">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <!-- اقتراحات سريعة -->
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
                    <span class="quick-ingredient" onclick="quickAddIngredient('حليب')">حليب</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('بيض')">بيض</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('سمك')">سمك</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('دجاج')">دجاج</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('لحم')">لحم</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('ليمون')">ليمون</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('برتقال')">برتقال</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('موز')">موز</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('خيار')">خيار</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('طماطم')">طماطم</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('زبادي')">زبادي</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('شاي')">شاي</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('عسل')">عسل</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('بطيخ')">بطيخ</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('أرز')">أرز</span>
                    <span class="quick-ingredient" onclick="quickAddIngredient('خبز')">خبز</span>
                </div>
                
                <!-- المكونات المضافة -->
                <div id="ingredient-tags" style="display:flex;flex-wrap:wrap;gap:8px;min-height:40px;margin-bottom:12px;">
                    <p style="color:var(--text-tertiary);font-size:13px;">لم تضف أي مكونات بعد</p>
                </div>
                
                <button class="btn btn-primary w-full" onclick="analyzeMeal()" id="analyze-btn" disabled style="width:100%;">
                    <i class="fas fa-flask"></i> تحليل الوجبة
                </button>
            </div>
            
            <!-- نتيجة التحليل -->
            <div id="analysis-result"></div>
            
            <!-- قاعدة بيانات التعارضات -->
            <h2 class="section-title" style="margin-top:24px;">
                <i class="fas fa-database" style="margin-left:8px;"></i> قاعدة بيانات التعارضات
            </h2>
            
            <div id="conflicts-database">
                ${FOOD_CONFLICTS.map(function(item) {
                    var severityColors = {
                        'عالي': { bg: '#FCE4EC', text: '#C62828', border: '#F44336', badge: 'خطر عالي' },
                        'متوسط': { bg: '#FFF3E0', text: '#E65100', border: '#FF9800', badge: 'متوسط' },
                        'منخفض': { bg: '#FFF8E1', text: '#F57F17', border: '#FFC107', badge: 'منخفض' },
                        'آمن': { bg: '#E8F5E9', text: '#2E7D32', border: '#4CAF50', badge: 'آمن' }
                    };
                    var colors = severityColors[item.severity] || severityColors['متوسط'];
                    
                    return `
                        <div class="card conflict-db-item" style="margin-bottom:8px;border-right:4px solid ${colors.border};background:${colors.bg};">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <strong style="color:${colors.text};">${item.combo}</strong>
                                <span style="background:${colors.border};color:white;padding:2px 10px;border-radius:10px;font-size:10px;">${colors.badge}</span>
                            </div>
                            <p style="font-size:13px;color:${colors.text};margin-top:4px;">${item.effect}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ==================== نظام إدارة المكونات ====================
var mealIngredients = [];

function addIngredient() {
    var input = document.getElementById('ingredient-input');
    if (!input || !input.value.trim()) return;
    
    var ingredient = input.value.trim();
    
    // تحقق من التكرار
    if (mealIngredients.indexOf(ingredient) !== -1) {
        if (typeof showToast === 'function') showToast('هذا المكون مضاف مسبقاً');
        input.value = '';
        return;
    }
    
    mealIngredients.push(ingredient);
    input.value = '';
    input.focus();
    renderIngredientTags();
}

function quickAddIngredient(ingredient) {
    if (mealIngredients.indexOf(ingredient) !== -1) {
        if (typeof showToast === 'function') showToast('هذا المكون مضاف مسبقاً');
        return;
    }
    
    mealIngredients.push(ingredient);
    renderIngredientTags();
}

function removeIngredient(index) {
    mealIngredients.splice(index, 1);
    renderIngredientTags();
}

function renderIngredientTags() {
    var container = document.getElementById('ingredient-tags');
    var analyzeBtn = document.getElementById('analyze-btn');
    
    if (!container) return;
    
    if (mealIngredients.length === 0) {
        container.innerHTML = '<p style="color:var(--text-tertiary);font-size:13px;">لم تضف أي مكونات بعد</p>';
    } else {
        container.innerHTML = mealIngredients.map(function(ing, i) {
            return `
                <span class="ingredient-tag">
                    ${ing}
                    <i class="fas fa-times" onclick="removeIngredient(${i})" style="cursor:pointer;margin-right:6px;font-size:11px;"></i>
                </span>
            `;
        }).join('');
    }
    
    // تفعيل زر التحليل إذا كان هناك مكونان على الأقل
    if (analyzeBtn) {
        analyzeBtn.disabled = mealIngredients.length < 2;
    }
}

// ==================== نظام التحليل الذكي ====================
function analyzeMeal() {
    if (mealIngredients.length < 2) {
        if (typeof showToast === 'function') showToast('أضف مكونين على الأقل للتحليل');
        return;
    }
    
    var resultDiv = document.getElementById('analysis-result');
    if (!resultDiv) return;
    
    // تحليل جميع التركيبات الممكنة
    var conflicts = [];
    var safeCombos = [];
    
    // فحص كل زوج من المكونات
    for (var i = 0; i < mealIngredients.length; i++) {
        for (var j = i + 1; j < mealIngredients.length; j++) {
            var combo = mealIngredients[i] + ' + ' + mealIngredients[j];
            var reverseCombo = mealIngredients[j] + ' + ' + mealIngredients[i];
            
            // البحث في قاعدة البيانات
            var found = false;
            for (var k = 0; k < FOOD_CONFLICTS.length; k++) {
                var dbCombo = FOOD_CONFLICTS[k].combo;
                
                // فحص مباشر
                if (dbCombo.includes(mealIngredients[i]) && dbCombo.includes(mealIngredients[j])) {
                    if (FOOD_CONFLICTS[k].severity !== 'آمن') {
                        conflicts.push({
                            ...FOOD_CONFLICTS[k],
                            pair: combo
                        });
                    } else {
                        safeCombos.push({
                            ...FOOD_CONFLICTS[k],
                            pair: combo
                        });
                    }
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                safeCombos.push({
                    combo: combo,
                    effect: 'لا يوجد تعارض معروف',
                    severity: 'آمن',
                    pair: combo
                });
            }
        }
    }
    
    // بناء نتيجة التحليل
    var totalPairs = conflicts.length + safeCombos.length;
    
    resultDiv.innerHTML = `
        <div class="card" style="margin-bottom:16px;">
            <h3 style="margin-bottom:16px;text-align:center;">
                <i class="fas fa-flask" style="margin-left:8px;color:#7C4DFF;"></i>
                نتيجة التحليل
            </h3>
            
            <!-- ملخص -->
            <div style="display:flex;gap:12px;margin-bottom:20px;text-align:center;">
                <div style="flex:1;background:${conflicts.length > 0 ? '#FCE4EC' : '#E8F5E9'};padding:16px;border-radius:12px;">
                    <div style="font-size:28px;font-weight:700;color:${conflicts.length > 0 ? '#C62828' : '#4CAF50'};">${conflicts.length}</div>
                    <div style="font-size:12px;color:${conflicts.length > 0 ? '#C62828' : '#2E7D32'};">تعارض</div>
                </div>
                <div style="flex:1;background:#E8F5E9;padding:16px;border-radius:12px;">
                    <div style="font-size:28px;font-weight:700;color:#4CAF50;">${safeCombos.length}</div>
                    <div style="font-size:12px;color:#2E7D32;">آمن</div>
                </div>
                <div style="flex:1;background:#E3F2FD;padding:16px;border-radius:12px;">
                    <div style="font-size:28px;font-weight:700;color:#1565C0;">${totalPairs}</div>
                    <div style="font-size:12px;color:#1565C0;">مجموع</div>
                </div>
            </div>
            
            <!-- الحكم النهائي -->
            <div style="text-align:center;padding:16px;border-radius:12px;margin-bottom:20px;${conflicts.length === 0 ? 'background:#E8F5E9;color:#2E7D32;' : 'background:#FCE4EC;color:#C62828;'}">
                <i class="fas ${conflicts.length === 0 ? 'fa-check-circle' : 'fa-exclamation-triangle'}" style="font-size:24px;margin-bottom:8px;display:block;"></i>
                <strong style="font-size:18px;">${conflicts.length === 0 ? 'الوجبة آمنة - لا توجد تعارضات' : 'يوجد ' + conflicts.length + ' تعارض في الوجبة'}</strong>
                ${conflicts.length > 0 ? '<p style="font-size:13px;margin-top:4px;">ينصح بتجنب التركيبات المتعارضة</p>' : ''}
            </div>
            
            <!-- قائمة المكونات المحللة -->
            <div style="margin-bottom:16px;">
                <strong>المكونات المحللة:</strong>
                <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
                    ${mealIngredients.map(function(ing) {
                        return '<span class="ingredient-tag">' + ing + '</span>';
                    }).join('')}
                </div>
            </div>
            
            ${conflicts.length > 0 ? `
                <!-- التعارضات -->
                <h4 style="color:#C62828;margin-bottom:12px;">
                    <i class="fas fa-exclamation-triangle"></i> التعارضات المكتشفة
                </h4>
                ${conflicts.map(function(c) {
                    return `
                        <div class="conflict-result-item" style="background:#FCE4EC;padding:12px;border-radius:12px;margin-bottom:8px;border-right:4px solid #F44336;">
                            <strong style="color:#C62828;">${c.pair}</strong>
                            <p style="color:#C62828;font-size:12px;margin-top:4px;">${c.effect}</p>
                            <span style="background:#F44336;color:white;padding:2px 8px;border-radius:8px;font-size:10px;">${c.severity}</span>
                        </div>
                    `;
                }).join('')}
            ` : ''}
            
            ${safeCombos.length > 0 ? `
                <!-- التركيبات الآمنة -->
                <h4 style="color:#2E7D32;margin-bottom:12px;margin-top:16px;">
                    <i class="fas fa-check-circle"></i> التركيبات الآمنة
                </h4>
                ${safeCombos.map(function(c) {
                    return `
                        <div class="conflict-result-item" style="background:#E8F5E9;padding:10px;border-radius:12px;margin-bottom:6px;border-right:4px solid #4CAF50;">
                            <strong style="color:#2E7D32;">${c.pair}</strong>
                            <span style="background:#4CAF50;color:white;padding:2px 8px;border-radius:8px;font-size:10px;float:left;">آمن</span>
                        </div>
                    `;
                }).join('')}
            ` : ''}
        </div>
    `;
    
    // تمرير للنتيجة
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==================== أنماط CSS ====================
var foodConflictStyles = document.createElement('style');
foodConflictStyles.textContent = `
    .ingredient-tag {
        display: inline-flex;
        align-items: center;
        background: var(--primary-light);
        color: var(--primary);
        padding: 8px 14px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        gap: 6px;
    }
    
    .quick-ingredient {
        display: inline-block;
        background: var(--surface-variant);
        color: var(--text-secondary);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid var(--border-light);
    }
    
    .quick-ingredient:hover {
        background: var(--primary-light);
        color: var(--primary);
        border-color: var(--primary);
        transform: translateY(-1px);
    }
    
    .quick-ingredient:active {
        transform: scale(0.95);
        background: var(--primary);
        color: white;
    }
    
    .conflict-result-item {
        animation: fadeSlideIn 0.3s ease;
    }
    
    .conflict-db-item {
        transition: all 0.3s ease;
    }
    
    .conflict-db-item:hover {
        transform: translateX(-4px);
        box-shadow: var(--shadow-md);
    }
    
    /* الوضع الداكن */
    .theme-dark .quick-ingredient {
        background: var(--surface-variant);
        color: var(--text-secondary);
    }
    
    .theme-dark .quick-ingredient:hover {
        background: var(--primary-light);
        color: var(--primary);
    }
    
    .theme-dark .ingredient-tag {
        background: var(--primary-light);
        color: var(--primary);
    }
    
    .theme-dark .conflict-db-item[style*="background:#FCE4EC"] {
        background: #3D1F28 !important;
    }
    
    .theme-dark .conflict-db-item[style*="background:#FFF3E0"] {
        background: #3E2E1A !important;
    }
    
    .theme-dark .conflict-db-item[style*="background:#FFF8E1"] {
        background: #3E3520 !important;
    }
    
    .theme-dark .conflict-db-item[style*="background:#E8F5E9"] {
        background: #1B3A1B !important;
    }
`;
document.head.appendChild(foodConflictStyles);