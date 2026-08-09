/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : pages
 * File   : journal.js
 * Type: JavaScript
 */

function renderJournalPage() {
    var mainContent = document.getElementById('main-content');
    var entries = StorageManager.get('journal_entries') || [];
    var today = new Date().toISOString().split('T')[0];
    var todayEntry = entries.find(function(e) { return e.date === today; });
    
    var recentEntries = entries.slice(-10).reverse();
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-pen-fancy" style="margin-left: 8px; color: #E91E63;"></i>
                مذكراتي اليومية
            </h1>
            
            <div class="card" style="border-right: 4px solid #E91E63;">
                <h3 style="margin-bottom: 12px;">
                    <i class="fas fa-calendar-day" style="margin-left: 8px;"></i>
                    ${formatDate(today)}
                </h3>
                
                <div style="margin-bottom: 12px;">
                    <label style="display:block;margin-bottom:8px;font-weight:600;">كيف تشعر اليوم؟</label>
                    <div style="display:flex;gap:12px;justify-content:center;" id="mood-selector">
                        <span class="mood-icon ${todayEntry && todayEntry.mood === 0 ? 'selected' : ''}" data-mood="0" onclick="selectMood(0)" style="font-size:32px;cursor:pointer;transition:all 0.3s;padding:8px;border-radius:12px;${todayEntry && todayEntry.mood === 0 ? 'background:var(--primary-light);transform:scale(1.2);' : ''}" title="سعيد جداً">
                            <i class="fas fa-laugh-beam" style="color:#4CAF50;"></i>
                        </span>
                        <span class="mood-icon ${todayEntry && todayEntry.mood === 1 ? 'selected' : ''}" data-mood="1" onclick="selectMood(1)" style="font-size:32px;cursor:pointer;transition:all 0.3s;padding:8px;border-radius:12px;${todayEntry && todayEntry.mood === 1 ? 'background:var(--primary-light);transform:scale(1.2);' : ''}" title="سعيد">
                            <i class="fas fa-smile" style="color:#8BC34A;"></i>
                        </span>
                        <span class="mood-icon ${todayEntry && todayEntry.mood === 2 ? 'selected' : ''}" data-mood="2" onclick="selectMood(2)" style="font-size:32px;cursor:pointer;transition:all 0.3s;padding:8px;border-radius:12px;${todayEntry && todayEntry.mood === 2 ? 'background:var(--primary-light);transform:scale(1.2);' : ''}" title="عادي">
                            <i class="fas fa-meh" style="color:#FFC107;"></i>
                        </span>
                        <span class="mood-icon ${todayEntry && todayEntry.mood === 3 ? 'selected' : ''}" data-mood="3" onclick="selectMood(3)" style="font-size:32px;cursor:pointer;transition:all 0.3s;padding:8px;border-radius:12px;${todayEntry && todayEntry.mood === 3 ? 'background:var(--primary-light);transform:scale(1.2);' : ''}" title="حزين">
                            <i class="fas fa-frown" style="color:#FF9800;"></i>
                        </span>
                        <span class="mood-icon ${todayEntry && todayEntry.mood === 4 ? 'selected' : ''}" data-mood="4" onclick="selectMood(4)" style="font-size:32px;cursor:pointer;transition:all 0.3s;padding:8px;border-radius:12px;${todayEntry && todayEntry.mood === 4 ? 'background:var(--primary-light);transform:scale(1.2);' : ''}" title="حزين جداً">
                            <i class="fas fa-sad-tear" style="color:#F44336;"></i>
                        </span>
                    </div>
                </div>
                
                <textarea id="journal-text" placeholder="اكتب ما يدور في بالك اليوم..." style="width:100%;min-height:120px;padding:12px;border-radius:12px;border:1px solid var(--border-light);resize:vertical;font-family:var(--font-primary);font-size:14px;background:var(--surface);color:var(--text-primary);">${todayEntry ? todayEntry.text : ''}</textarea>
                
                <button class="btn btn-primary w-full mt-3" onclick="saveJournalEntry()" style="width:100%;">
                    <i class="fas fa-save"></i> ${todayEntry ? 'تحديث المذكرة' : 'حفظ المذكرة'}
                </button>
            </div>
            
            <h2 class="section-title" style="margin-top: 24px;">
                <i class="fas fa-history" style="margin-left: 8px;"></i>
                المذكرات السابقة
            </h2>
            
            ${recentEntries.length === 0 ? '<p style="text-align:center;color:var(--text-tertiary);">لا توجد مذكرات سابقة</p>' : 
                recentEntries.map(function(entry) {
                    var moodIcons = ['fa-laugh-beam','fa-smile','fa-meh','fa-frown','fa-sad-tear'];
                    var moodColors = ['#4CAF50','#8BC34A','#FFC107','#FF9800','#F44336'];
                    return `
                        <div class="card" style="margin-bottom:8px;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <span style="font-weight:600;">${formatDate(entry.date)}</span>
                                <i class="fas ${moodIcons[entry.mood] || 'fa-meh'}" style="font-size:24px;color:${moodColors[entry.mood] || '#FFC107'};"></i>
                            </div>
                            <p style="color:var(--text-secondary);line-height:1.8;white-space:pre-wrap;">${entry.text}</p>
                            <button class="btn btn-sm btn-outline mt-2" onclick="deleteJournalEntry('${entry.date}')" style="color:#F44336;border-color:#F44336;font-size:11px;">
                                <i class="fas fa-trash"></i> حذف
                            </button>
                        </div>
                    `;
                }).join('')
            }
            
            <div class="card" style="text-align:center;margin-top:16px;">
                <h3><i class="fas fa-chart-bar" style="margin-left:6px;"></i> إحصائيات المذكرات</h3>
                <div style="display:flex;justify-content:space-around;margin-top:12px;">
                    <div><strong style="font-size:24px;">${entries.length}</strong><br><small>مذكرة</small></div>
                    <div><strong style="font-size:24px;">${getJournalStreak(entries)}</strong><br><small>يوم متتالي</small></div>
                    <div><i class="fas ${getAverageMoodIcon(entries)}" style="font-size:24px;color:${getAverageMoodColor(entries)};"></i><br><small>متوسط المزاج</small></div>
                </div>
            </div>
        </div>
    `;
}

var currentMood = 2;

function selectMood(mood) {
    currentMood = mood;
    document.querySelectorAll('.mood-icon').forEach(function(el, i) {
        el.classList.toggle('selected', i === mood);
        el.style.background = i === mood ? 'var(--primary-light)' : '';
        el.style.transform = i === mood ? 'scale(1.2)' : 'scale(1)';
    });
}

function saveJournalEntry() {
    var text = document.getElementById('journal-text').value.trim();
    if (!text) { 
        if (typeof showToast === 'function') showToast('<i class="fas fa-exclamation-circle"></i> اكتب شيئا في مذكرتك'); 
        return; 
    }
    
    var today = new Date().toISOString().split('T')[0];
    var entries = StorageManager.get('journal_entries') || [];
    var existingIndex = entries.findIndex(function(e) { return e.date === today; });
    
    var entry = {
        date: today,
        text: text,
        mood: currentMood,
        timestamp: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        entries[existingIndex] = entry;
    } else {
        entries.push(entry);
    }
    
    StorageManager.set('journal_entries', entries);
    if (typeof showToast === 'function') showToast('<i class="fas fa-check-circle"></i> تم حفظ المذكرة');
    
    // XP
    if (typeof XPSystem !== 'undefined') XPSystem.addXP('journal_entry');
    
    renderJournalPage();
}

function deleteJournalEntry(date) {
    if (confirm('هل أنت متأكد من حذف هذه المذكرة؟')) {
        var entries = StorageManager.get('journal_entries') || [];
        entries = entries.filter(function(e) { return e.date !== date; });
        StorageManager.set('journal_entries', entries);
        if (typeof showToast === 'function') showToast('<i class="fas fa-trash"></i> تم الحذف');
        renderJournalPage();
    }
}

function formatDate(dateStr) {
    var parts = dateStr.split('-');
    var months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    return parts[2] + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0];
}

function getJournalStreak(entries) {
    if (entries.length === 0) return 0;
    var sorted = entries.slice().sort(function(a, b) { return b.date.localeCompare(a.date); });
    var streak = 1;
    for (var i = 0; i < sorted.length - 1; i++) {
        var d1 = new Date(sorted[i].date);
        var d2 = new Date(sorted[i + 1].date);
        var diff = (d1 - d2) / 86400000;
        if (diff === 1) streak++;
        else break;
    }
    return streak;
}

function getAverageMoodIcon(entries) {
    if (entries.length === 0) return 'fa-meh';
    var sum = entries.reduce(function(a, b) { return a + b.mood; }, 0);
    var avg = Math.round(sum / entries.length);
    var icons = ['fa-laugh-beam','fa-smile','fa-meh','fa-frown','fa-sad-tear'];
    return icons[avg] || 'fa-meh';
}

function getAverageMoodColor(entries) {
    if (entries.length === 0) return '#FFC107';
    var sum = entries.reduce(function(a, b) { return a + b.mood; }, 0);
    var avg = Math.round(sum / entries.length);
    var colors = ['#4CAF50','#8BC34A','#FFC107','#FF9800','#F44336'];
    return colors[avg] || '#FFC107';
}