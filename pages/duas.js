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
    var readCount = getSpiritualReadCount(category, id);
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <button class="btn btn-outline mb-4" onclick="renderDuasPage()">
                <i class="fas fa-arrow-right"></i> رجوع للأدعية والزيارات
            </button>
            
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
                
                <div style="background: var(--surface-variant); padding: 12px 16px; border-radius: var(--radius-md); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                    <p style="font-size: ${fontSize - 1}px; color: var(--text-tertiary);">
                        <i class="fas fa-clock" style="margin-left: 4px;"></i> ${item.time}
                    </p>
                    <span style="font-size: 12px; color: var(--primary); background: var(--primary-light); padding: 4px 12px; border-radius: 20px;">
                        <i class="fas fa-eye" style="margin-left: 4px;"></i>
                        قرأت ${readCount} مرات
                    </span>
                </div>
                
                ${hasContent ? `
                    <div class="dua-content" style="line-height: 2.8; font-family: var(--font-quran); font-size: ${fontSize}px; text-align: justify;">
                        ${item.content.replace(/\n/g, '<br>')}
                    </div>
                    <div style="margin-top: 20px; display: flex; gap: 12px; justify-content: center;">
                        <button class="btn btn-primary" onclick="recordDuaReading('${category}', '${id}')">
                            <i class="fas fa-check-circle"></i> سجل أنني قرأت
                        </button>
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

/**
 * Get the read count for a specific spiritual item.
 */
function getSpiritualReadCount(category, id) {
    var data = StorageManager.get('spiritual_reading_data') || {};
    var collection = category === 'ziyarat' ? (data.ziyarat || {}) : (data.duas || {});
    return collection[id] ? (collection[id].count || 0) : 0;
}

/**
 * Record that a user has read a dua or ziyarat.
 * This triggers the update chain.
 */
function recordDuaReading(category, id) {
    if (!category || !id) {
        return false;
    }

    var key = 'spiritual_reading_data';
    var data = StorageManager.get(key) || {};
    
    // Initialize collections
    if (!data.duas) data.duas = {};
    if (!data.ziyarat) data.ziyarat = {};
    
    var collection = category === 'ziyarat' ? data.ziyarat : data.duas;
    
    // Get the item title
    var itemTitle = getSpiritualItemTitle(category, id);
    
    // Update or create entry
    if (!collection[id]) {
        collection[id] = {
            id: id,
            count: 0,
            firstRead: Date.now(),
            lastRead: null,
            title: itemTitle
        };
    }
    
    collection[id].count = Number(collection[id].count || 0) + 1;
    collection[id].lastRead = Date.now();
    
    // Update totals
    data.totalReads = Number(data.totalReads || 0) + 1;
    data.totalDuas = Object.keys(data.duas).length;
    data.totalZiyarat = Object.keys(data.ziyarat).length;
    data.updatedAt = Date.now();
    
    // Save data
    StorageManager.set(key, data);
    
    // ✅ CRITICAL: Notify all systems about the update
    if (typeof DataUpdateManager !== 'undefined') {
        DataUpdateManager.notifyDataChanged(category === 'ziyarat' ? 'ziyarat' : 'dua', {
            id: id,
            title: itemTitle,
            count: collection[id].count,
            totalReads: data.totalReads
        });
    }
    
    // Dispatch event
    try {
        window.dispatchEvent(new CustomEvent('taeafiSpiritualReading', {
            detail: {
                category: category,
                id: id,
                title: itemTitle,
                totalReads: data.totalReads,
                totalDuas: data.totalDuas,
                totalZiyarat: data.totalZiyarat,
                timestamp: Date.now()
            }
        }));
    } catch (e) {}
    
    showToast('✅ تم تسجيل قراءة ' + itemTitle);
    
    // Refresh the page to show updated count
    renderDuaDetail(category, id);
    
    return true;
}

/**
 * Get the title of a spiritual item.
 */
function getSpiritualItemTitle(category, id) {
    var data = DUAS_DATA[category];
    if (!data) return id;
    var item = data.items.find(function(i) { return i.id === id; });
    return item ? item.title : id;
}

/**
 * Get reading statistics for spiritual items.
 */
function getSpiritualStats() {
    var data = StorageManager.get('spiritual_reading_data') || {};
    return {
        totalReads: Number(data.totalReads || 0),
        totalDuas: Number(data.totalDuas || 0),
        totalZiyarat: Number(data.totalZiyarat || 0),
        lastRead: data.updatedAt || null
    };
}

function changeDuaFontSize(size) {
    StorageManager.set('dua_font_size', parseInt(size));
    
    var valueEl = document.getElementById('font-size-value');
    if (valueEl) {
        valueEl.textContent = size;
    }
    
    var duaContent = document.querySelector('.dua-content');
    if (duaContent) {
        duaContent.style.fontSize = size + 'px';
    }
    
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

// Legacy function for compatibility
function recordSpiritualReading(category, id) {
    return recordDuaReading(category, id);
}