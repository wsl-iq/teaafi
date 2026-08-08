/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : duas.js
 * Type: JavaScript
 */

function renderDuasPage() {
    var mainContent = document.getElementById('main-content');
    var fontSize = StorageManager.get('dua_font_size') || 14;
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-book-open" style="margin-left: 8px;"></i>
                الأدعية والزيارات
            </h1>
            <p class="text-secondary mb-4">مجموعة من الأدعية المأثورة والزيارات المباركة</p>
            
            <!-- ✅ شريط تحكم حجم الخط -->
            <div class="card" style="margin-bottom: 20px; padding: 16px 20px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i class="fas fa-font" style="color: var(--primary); font-size: 14px; flex-shrink: 0;"></i>
                    <span style="font-size: 10px; color: var(--text-tertiary); flex-shrink: 0;">A</span>
                    <input type="range" 
                           id="font-size-slider" 
                           min="10" 
                           max="24" 
                           value="${fontSize}" 
                           step="1"
                           oninput="changeDuaFontSize(this.value)"
                           style="flex: 1; height: 6px; accent-color: var(--primary); cursor: pointer;">
                    <span style="font-size: 18px; color: var(--text-tertiary); flex-shrink: 0;">A</span>
                    <span id="font-size-value" style="font-weight: 600; color: var(--primary); min-width: 35px; text-align: center; font-size: 14px; flex-shrink: 0;">${fontSize}</span>
                    <button class="btn btn-sm btn-outline" onclick="resetDuaFontSize()" style="font-size: 11px; padding: 4px 10px; flex-shrink: 0;" title="إعادة للحجم الافتراضي">
                        <i class="fas fa-undo"></i>
                    </button>
                </div>
            </div>
            
            <!-- ==================== الأدعية ==================== -->
            <h2 class="section-title" style="margin-top: 24px;">
                <i class="fas fa-hands-praying" style="margin-left: 8px; color: #4A148C;"></i>
                ${DUAS_DATA.duas.title}
            </h2>
            <div class="cards-grid">
                ${DUAS_DATA.duas.items.map(function(dua) {
                    return `
                        <div class="card" onclick="renderDuaDetail('duas', '${dua.id}')">
                            <div class="card-header">
                                <div class="card-icon" style="background: #F3E5F5; color: #4A148C;">
                                    <i class="fas ${dua.icon}"></i>
                                </div>
                                <div>
                                    <h3 class="card-title">${dua.title}</h3>
                                    <p class="text-sm text-secondary">${dua.source}</p>
                                </div>
                            </div>
                            <p class="card-description">${dua.description}</p>
                            <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">
                                <i class="fas fa-clock" style="margin-left: 4px;"></i> ${dua.time}
                            </p>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- ==================== الزيارات ==================== -->
            <h2 class="section-title" style="margin-top: 32px;">
                <i class="fas fa-kaaba" style="margin-left: 8px; color: #0D6B6E;"></i>
                ${DUAS_DATA.ziyarat.title}
            </h2>
            <div class="cards-grid">
                ${DUAS_DATA.ziyarat.items.map(function(ziyarah) {
                    return `
                        <div class="card" onclick="renderDuaDetail('ziyarat', '${ziyarah.id}')">
                            <div class="card-header">
                                <div class="card-icon" style="background: #E0F2F1; color: #0D6B6E;">
                                    <i class="fas ${ziyarah.icon}"></i>
                                </div>
                                <div>
                                    <h3 class="card-title">${ziyarah.title}</h3>
                                    <p class="text-sm text-secondary">${ziyarah.source}</p>
                                </div>
                            </div>
                            <p class="card-description">${ziyarah.description}</p>
                            <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 8px;">
                                <i class="fas fa-clock" style="margin-left: 4px;"></i> ${ziyarah.time}
                            </p>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderDuaDetail(category, id) {
    var mainContent = document.getElementById('main-content');
    var data = DUAS_DATA[category];
    var item = data.items.find(function(i) { return i.id === id; });
    var fontSize = StorageManager.get('dua_font_size') || 14;
    
    if (!item) {
        mainContent.innerHTML = '<div class="card" style="text-align:center;padding:40px;"><p>المحتوى غير متوفر</p></div>';
        return;
    }
    
    var hasContent = item.content && item.content.trim().length > 0;
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <button class="btn btn-outline mb-4" onclick="renderDuasPage()">
                <i class="fas fa-arrow-right"></i> رجوع للأدعية والزيارات
            </button>
            
            <!-- ✅ شريط تحكم حجم الخط -->
            <div class="card" style="margin-bottom: 16px; padding: 12px 16px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-font" style="color: var(--primary); font-size: 13px; flex-shrink: 0;"></i>
                    <span style="font-size: 9px; color: var(--text-tertiary); flex-shrink: 0;">A</span>
                    <input type="range" 
                           id="font-size-slider" 
                           min="10" 
                           max="24" 
                           value="${fontSize}" 
                           step="1"
                           oninput="changeDuaFontSize(this.value)"
                           style="flex: 1; height: 5px; accent-color: var(--primary); cursor: pointer;">
                    <span style="font-size: 16px; color: var(--text-tertiary); flex-shrink: 0;">A</span>
                    <span id="font-size-value" style="font-weight: 600; color: var(--primary); min-width: 30px; text-align: center; font-size: 13px; flex-shrink: 0;">${fontSize}</span>
                    <button class="btn btn-sm btn-outline" onclick="resetDuaFontSize()" style="font-size: 10px; padding: 3px 8px; flex-shrink: 0;" title="إعادة للحجم الافتراضي">
                        <i class="fas fa-undo"></i>
                    </button>
                </div>
            </div>
            
            <div class="card" style="border-right: 4px solid ${data.color};">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div class="card-icon" style="background: ${category === 'duas' ? '#F3E5F5' : '#E0F2F1'}; color: ${data.color};">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <div>
                        <h2 style="color: ${data.color};">${item.title}</h2>
                        <p class="text-sm text-secondary">${item.source}</p>
                    </div>
                </div>
                
                <p style="color: var(--text-secondary); margin-bottom: 16px; line-height: 1.8; font-size: ${fontSize}px;">${item.description}</p>
                
                <div style="background: var(--surface-variant); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <p style="font-size: ${fontSize - 1}px; color: var(--text-tertiary);">
                        <i class="fas fa-clock" style="margin-left: 4px;"></i> ${item.time}
                    </p>
                </div>
                
                ${hasContent ? `
                    <div class="dua-content" style="line-height: 2.8; font-family: var(--font-quran); font-size: ${fontSize}px; text-align: justify;">
                        ${item.content.replace(/\n/g, '<br>')}
                    </div>
                ` : `
                    <div class="card" style="text-align: center; padding: 40px 20px; background: #FFF8E1; border: 1px dashed #FFC107;">
                        <i class="fas fa-hourglass-half" style="font-size: 48px; color: #FFC107; margin-bottom: 16px;"></i>
                        <h3 style="color: #F57F17; margin-bottom: 8px;">قيد الإضافة</h3>
                        <p style="color: var(--text-secondary); font-size: 14px;">
                            سيتم إضافة محتوى ${item.title} قريباً إن شاء الله
                        </p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// دوال التحكم بحجم الخط

function changeDuaFontSize(size) {
    // حفظ الحجم
    StorageManager.set('dua_font_size', parseInt(size));
    
    // تحديث العرض الرقمي
    var valueEl = document.getElementById('font-size-value');
    if (valueEl) {
        valueEl.textContent = size;
    }
    
    // تحديث جميع النصوص في الصفحة الحالية
    var duaContent = document.querySelector('.dua-content');
    if (duaContent) {
        duaContent.style.fontSize = size + 'px';
    }
    
    // تحديث النصوص الأخرى
    var allText = document.querySelectorAll('.card p, .card h2, .card h3');
    allText.forEach(function(el) {
        if (!el.closest('.card-header') && !el.closest('.cards-grid')) {
            el.style.fontSize = (parseInt(size) - 2) + 'px';
        }
    });
}

function resetDuaFontSize() {
    var defaultSize = 14;
    StorageManager.set('dua_font_size', defaultSize);
    
    var slider = document.getElementById('font-size-slider');
    var valueEl = document.getElementById('font-size-value');
    
    if (slider) slider.value = defaultSize;
    if (valueEl) valueEl.textContent = defaultSize;
    
    changeDuaFontSize(defaultSize);
    
    if (typeof showToast === 'function') {
        showToast('تم إعادة حجم الخط إلى الافتراضي');
    }
}