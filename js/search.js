/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : search.js
 * Type: JavaScript
 */

var SearchEngine = {
    index: {},
    initialized: false,
    
    init: function() {
        if (this.initialized) return;
        this.buildIndex();
        this.initialized = true;
    },
    
    //  All texts collection for search indexing
    collectText: function(value) {
        if (typeof value === 'string') {
            return value + ' ';
        }
        if (Array.isArray(value)) {
            var result = '';
            for (var i = 0; i < value.length; i++) {
                result += this.collectText(value[i]);
            }
            return result;
        }
        if (value && typeof value === 'object') {
            var result = '';
            for (var prop in value) {
                if (value.hasOwnProperty(prop)) {
                    result += this.collectText(value[prop]);
                }
            }
            return result;
        }
        return '';
    },
    
    buildIndex: function() {
        var self = this;
        
        if (typeof HABIT_CONTENT !== 'undefined') {
            for (var key in HABIT_CONTENT) {
                if (HABIT_CONTENT.hasOwnProperty(key)) {
                    var habit = HABIT_CONTENT[key];
                    this.index['habit_' + key] = {
                        title: habit.title,
                        icon: habit.icon || 'fa-hand',
                        color: habit.color || '#0D6B6E',
                        type: 'habit',
                        habitId: key,
                        keywords: this.collectText(habit)
                    };
                }
            }
        }
        
        if (typeof ADHKAR_DATA !== 'undefined') {
            this.index['adhkar_all'] = {
                title: 'الأذكار والتحصين الإيماني',
                icon: 'fa-mosque',
                color: '#4CAF50',
                type: 'dhikr',
                keywords: this.collectText(ADHKAR_DATA)
            };
            
            for (var category in ADHKAR_DATA) {
                if (ADHKAR_DATA.hasOwnProperty(category) && Array.isArray(ADHKAR_DATA[category])) {
                    var categoryItems = ADHKAR_DATA[category];
                    var categoryTitle = this.getAdhkarCategoryName(category);
                    
                    this.index['adhkar_' + category] = {
                        title: categoryTitle,
                        icon: this.getAdhkarCategoryIcon(category),
                        color: this.getAdhkarCategoryColor(category),
                        type: 'dhikr',
                        keywords: this.collectText(categoryItems)
                    };
                }
            }
        }
        
        if (typeof DUAS_DATA !== 'undefined') {
            for (var section in DUAS_DATA) {
                if (DUAS_DATA.hasOwnProperty(section)) {
                    var sectionData = DUAS_DATA[section];
                    
                    this.index['duas_' + section] = {
                        title: sectionData.title,
                        icon: sectionData.icon || 'fa-book-open',
                        color: sectionData.color || '#4A148C',
                        type: 'dua',
                        keywords: this.collectText(sectionData)
                    };
                    
                    if (sectionData.items && Array.isArray(sectionData.items)) {
                        sectionData.items.forEach(function(item) {
                            self.index['dua_item_' + item.id] = {
                                title: item.title,
                                icon: item.icon || 'fa-hands-praying',
                                color: sectionData.color || '#4A148C',
                                type: 'dua',
                                category: section,
                                itemId: item.id,
                                keywords: self.collectText(item)
                            };
                        });
                    }
                }
            }
        }
        
        console.log('[Search] Index built with ' + Object.keys(this.index).length + ' entries');
    },
    
    getAdhkarCategoryName: function(category) {
        var names = {
            morning: 'أذكار الصباح',
            evening: 'أذكار المساء',
            repentance: 'أدعية التوبة والاستغفار',
            steadfastness: 'أدعية الثبات على الإيمان',
            protection: 'أدعية التحصين والحفظ',
            verses: 'آيات قرآنية',
            hadith: 'أحاديث شريفة',
            prophet_sayings: 'أقوال النبي محمد (صلى الله عليه وآله)',
            imam_ali_sayings: 'حكم الإمام علي (عليه السلام)',
            ahlulbayt_duas: 'أدعية ومناجاة أهل البيت (عليهم السلام)'
        };
        return names[category] || category;
    },
    
    getAdhkarCategoryIcon: function(category) {
        var icons = {
            morning: 'fa-sun',
            evening: 'fa-moon',
            repentance: 'fa-hand-holding-heart',
            steadfastness: 'fa-anchor',
            protection: 'fa-shield-alt',
            verses: 'fa-quran',
            hadith: 'fa-scroll',
            prophet_sayings: 'fa-star',
            imam_ali_sayings: 'fa-crown',
            ahlulbayt_duas: 'fa-hands-praying'
        };
        return icons[category] || 'fa-mosque';
    },
    
    getAdhkarCategoryColor: function(category) {
        var colors = {
            morning: '#FF9800',
            evening: '#5C6BC0',
            repentance: '#F44336',
            steadfastness: '#0D6B6E',
            protection: '#4CAF50',
            verses: '#9C27B0',
            hadith: '#795548',
            prophet_sayings: '#FFD700',
            imam_ali_sayings: '#4CAF50',
            ahlulbayt_duas: '#E91E63'
        };
        return colors[category] || '#0D6B6E';
    },
    
    // search function
    search: function(query) {
        if (!this.initialized) this.init();
        
        var q = query.toLowerCase().trim();
        if (!q) return [];
        
        var results = [];
        
        for (var key in this.index) {
            if (this.index.hasOwnProperty(key)) {
                var item = this.index[key];
                if (item.keywords.toLowerCase().includes(q)) {
                    results.push({
                        id: key,
                        title: item.title,
                        icon: item.icon,
                        color: item.color,
                        type: item.type,
                        habitId: item.habitId,
                        category: item.category,
                        itemId: item.itemId
                    });
                }
            }
        }
        
        // Sort results by type: habit first, then dua, then dhikr
        results.sort(function(a, b) {
            var order = { habit: 1, dua: 2, dhikr: 3 };
            return (order[a.type] || 4) - (order[b.type] || 4);
        });
        
        return results.slice(0, 15);
    },
    
    //  Search UI
    showSearchUI: function() {
        var existing = document.getElementById('search-overlay');
        if (existing) { existing.remove(); return; }
        
        var overlay = document.createElement('div');
        overlay.id = 'search-overlay';
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <i class="fas fa-search" style="color: var(--text-tertiary);"></i>
                    <input type="text" id="search-input" placeholder="ابحث عن عادة، دعاء، ذكر، زيارة..." autofocus>
                    <button onclick="document.getElementById('search-overlay').remove()" style="background:none;border:none;cursor:pointer;color:var(--text-tertiary);font-size:18px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div style="padding: 8px 16px; border-bottom: 1px solid var(--border-light);">
                    <small style="color: var(--text-tertiary);">
                        <i class="fas fa-info-circle" style="margin-left: 4px;"></i>
                        يبحث في: العادات، الأذكار، الأدعية، الزيارات، الآيات، الأحاديث
                    </small>
                </div>
                <div id="search-results"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        var input = document.getElementById('search-input');
        var resultsDiv = document.getElementById('search-results');
        var self = this;
        
        // Handle input event
        input.addEventListener('input', function() {
            var results = self.search(input.value);
            
            if (results.length === 0 && input.value.trim()) {
                resultsDiv.innerHTML = `
                    <div style="text-align:center;padding:40px 20px;">
                        <i class="fas fa-search" style="font-size:40px;color:var(--text-disabled);margin-bottom:12px;display:block;"></i>
                        <p style="color:var(--text-tertiary);">لا توجد نتائج لـ "<strong>${input.value}</strong>"</p>
                        <small style="color:var(--text-disabled);">جرب كلمة أخرى</small>
                    </div>
                `;
            } else if (results.length > 0) {
                resultsDiv.innerHTML = results.map(function(r) {
                    var typeLabel = '';
                    var typeColor = '';
                    
                    switch(r.type) {
                        case 'habit':
                            typeLabel = 'عادة';
                            typeColor = '#F44336';
                            break;
                        case 'dua':
                            typeLabel = r.category === 'ziyarat' ? 'زيارة' : 'دعاء';
                            typeColor = '#9C27B0';
                            break;
                        case 'dhikr':
                            typeLabel = 'أذكار';
                            typeColor = '#4CAF50';
                            break;
                    }
                    
                    return `
                        <div class="search-result-item" onclick="SearchEngine.openResult('${r.id}', '${r.type}', '${r.habitId || ''}', '${r.category || ''}', '${r.itemId || ''}'); document.getElementById('search-overlay').remove();">
                            <div style="width:36px;height:36px;border-radius:8px;background:${r.color}15;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                <i class="fas ${r.icon}" style="color: ${r.color}; font-size: 16px;"></i>
                            </div>
                            <div style="flex:1;min-width:0;">
                                <span style="font-weight:500;font-size:14px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.title}</span>
                            </div>
                            <small style="background:${typeColor}15;color:${typeColor};padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;flex-shrink:0;">${typeLabel}</small>
                        </div>
                    `;
                }).join('');
            } else {
                resultsDiv.innerHTML = `
                    <div style="text-align:center;padding:30px 20px;">
                        <p style="color:var(--text-tertiary);">ابدأ بكتابة ما تبحث عنه</p>
                    </div>
                `;
            }
        });
        
        // Exit
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.remove();
        });
    },
    
    // Open select
    openResult: function(id, type, habitId, category, itemId) {
        switch(type) {
            case 'habit':
                if (typeof renderHabitDetail === 'function' && habitId) {
                    navigateTo('habits');
                    setTimeout(function() { renderHabitDetail(habitId); }, 200);
                }
                break;
                
            case 'dua':
                if (category && itemId) {
                    // فتح صفحة الأدعية ثم عرض الدعاء المحدد
                    if (typeof navigateTo === 'function') {
                        navigateTo('duas');
                        setTimeout(function() {
                            if (typeof renderDuaDetail === 'function') {
                                renderDuaDetail(category, itemId);
                            }
                        }, 300);
                    }
                } else {
                    if (typeof navigateTo === 'function') navigateTo('duas');
                }
                break;
                
            case 'dhikr':
                if (typeof navigateTo === 'function') navigateTo('spiritual');
                break;
        }
    }
};

//  shortcut keys
document.addEventListener('keydown', function(e) {
    // Ctrl+K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        SearchEngine.showSearchUI();
    }
    
    // Escape
    if (e.key === 'Escape') {
        var overlay = document.getElementById('search-overlay');
        if (overlay) overlay.remove();
    }
});

// CSS Styles for search overlay
var searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 9999;
        display: flex;
        justify-content: center;
        padding-top: 60px;
    }
    .search-container {
        background: var(--surface);
        border-radius: var(--radius-xl);
        width: 92%;
        max-width: 520px;
        max-height: 75vh;
        overflow-y: auto;
        box-shadow: var(--shadow-2xl);
        animation: searchSlideIn 0.2s ease;
    }
    @keyframes searchSlideIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .search-header {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--border-light);
        gap: 12px;
        position: sticky;
        top: 0;
        background: var(--surface);
        z-index: 1;
        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }
    .search-header input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        background: transparent;
        color: var(--text-primary);
        font-family: var(--font-primary);
    }
    .search-header input::placeholder {
        color: var(--text-disabled);
    }
    .search-result-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        gap: 10px;
        cursor: pointer;
        transition: background 0.15s;
        border-bottom: 1px solid var(--border-light);
    }
    .search-result-item:last-child {
        border-bottom: none;
    }
    .search-result-item:hover {
        background: var(--surface-variant);
    }
    .search-result-item:active {
        transform: scale(0.98);
    }
    
    @media (max-width: 600px) {
        .search-overlay {
            padding-top: 20px;
            align-items: flex-start;
        }
        .search-container {
            width: 96%;
            max-height: 85vh;
            border-radius: var(--radius-lg);
        }
    }
`;

document.head.appendChild(searchStyles);
console.log('[Search] Engine ready - Ctrl+K to search');