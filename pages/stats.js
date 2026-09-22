/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : stats.js
 * Type: JavaScript
 */

function renderStatsPage() {
    var mainContent = document.getElementById('main-content');
    var stats = typeof RecoveryCounter !== 'undefined' ? 
        RecoveryCounter.getRecoveryStats() : { totalDays: 0, relapses: 0, isActive: false };
    
    // Get the REAL total count, not limited by history
    var tasbih = getTasbihStats();
    var tasbihTotal = tasbih.totalCount;
    var tasbihCounts = tasbih.counts || {};
    
    var achievements = typeof AchievementsManager !== 'undefined' ? 
        AchievementsManager.getUnlocked() : [];
    
    // Spiritual reading stats
    var spiritualStats = getSpiritualStats();
    
    var recoveryPercent = stats.isActive ? 
        Math.min(Math.round((stats.totalDays / 365) * 100), 100) : 0;
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-chart-pie" style="margin-left: 8px;"></i>
                الإحصائيات
            </h1>
            
            <div class="stats-cards-grid">
                <div class="stat-card" style="border-top: 4px solid #4CAF50;">
                    <i class="fas fa-calendar-check" style="color: #4CAF50;"></i>
                    <span class="stat-number" id="stat-recovery-days">${stats.totalDays}</span>
                    <span class="stat-label">يوم تعافي</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #F44336;">
                    <i class="fas fa-rotate-left" style="color: #F44336;"></i>
                    <span class="stat-number" id="stat-relapses">${
                        Array.isArray(stats.relapses)
                            ? stats.relapses.length
                            : Number(stats.relapses || 0)
                    }</span>
                    <span class="stat-label">انتكاسة</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #2196F3;">
                    <i class="fas fa-hands-praying" style="color: #2196F3;"></i>
                    <span class="stat-number" id="stat-tasbih-total">${tasbihTotal.toLocaleString('en-US')}</span>
                    <span class="stat-label">تسبيحة</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #FFD700;">
                    <i class="fas fa-trophy" style="color: #FFD700;"></i>
                    <span class="stat-number" id="stat-achievements">${achievements.length}</span>
                    <span class="stat-label">إنجاز</span>
                </div>
            </div>
            
            <div class="stats-cards-grid">
                <div class="stat-card" style="border-top: 4px solid #9C27B0;">
                    <i class="fas fa-book-open" style="color: #9C27B0;"></i>
                    <span class="stat-number">${spiritualStats.totalReads}</span>
                    <span class="stat-label">قراءة (دعاء/زيارة)</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #E91E63;">
                    <i class="fas fa-pen-fancy" style="color: #E91E63;"></i>
                    <span class="stat-number">${getJournalCount()}</span>
                    <span class="stat-label">مذكرة</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #FF9800;">
                    <i class="fas fa-clipboard-check" style="color: #FF9800;"></i>
                    <span class="stat-number">${getQuizCount()}</span>
                    <span class="stat-label">اختبار تقييم</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #4CAF50;">
                    <i class="fas fa-fire" style="color: #FF5722;"></i>
                    <span class="stat-number">${getStreakDays(stats)}</span>
                    <span class="stat-label">سلسلة متتالية</span>
                </div>
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 12px;">
                    <i class="fas fa-chart-line" style="color: #4CAF50; margin-left: 8px;"></i>
                    التقدم نحو التعافي الكامل
                </h3>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${recoveryPercent}%; background: linear-gradient(90deg, #4CAF50, #8BC34A);">
                        <span>${recoveryPercent}%</span>
                    </div>
                </div>
                <p style="text-align: center; margin-top: 8px; color: var(--text-secondary);">
                    ${stats.isActive ? stats.totalDays + ' / 365 يوم' : 'لم تبدأ رحلة التعافي بعد'}
                </p>
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 12px;">
                    <i class="fas fa-mosque" style="color: #2196F3; margin-left: 8px;"></i>
                    إحصائيات التسبيح (الإجمالي: ${tasbihTotal.toLocaleString('en-US')})
                </h3>
                <div class="mini-stats">
                    <div><span>الله أكبر</span><strong>${tasbihCounts.allahuAkbar || 0}</strong></div>
                    <div><span>الحمد لله</span><strong>${tasbihCounts.alhamdulillah || 0}</strong></div>
                    <div><span>سبحان الله</span><strong>${tasbihCounts.subhanAllah || 0}</strong></div>
                </div>
                ${tasbihTotal > 0 ? `
                    <div style="margin-top: 12px; padding: 12px; background: var(--surface-variant); border-radius: 8px;">
                        <p style="font-size: 13px; text-align: center; color: var(--text-secondary);">
                            ${tasbihTotal >= 1000 ? '🌟 ' : ''}
                            ${tasbihTotal >= 5000 ? '🏆 ' : ''}
                            ${tasbihTotal >= 10000 ? '👑 ' : ''}
                            ${tasbihTotal.toLocaleString('en-US')} تسبيحة إجمالية
                            ${tasbihTotal >= 1000 ? ' - أنت مسبح مخلص!' : ''}
                        </p>
                    </div>
                ` : ''}
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-award" style="color: #FFD700; margin-left: 8px;"></i>
                    الإنجازات (${achievements.length}/${Object.keys(ACHIEVEMENTS).length})
                </h3>
                <div class="achievements-grid" id="achievements-grid">
                    ${renderAchievements()}
                </div>
            </div>
        </div>
    `;
}

/**
 * Get the real tasbih total count from storage.
 * This is the source of truth.
 */
function getTasbihStats() {
    var data = StorageManager.get('tasbih_data') || {};
    var total = Number(data.totalCount || 0);
    var counts = data.counts || {};
    
    // Recalculate to ensure consistency
    var calculatedTotal = Number(counts.allahuAkbar || 0) + 
                         Number(counts.alhamdulillah || 0) + 
                         Number(counts.subhanAllah || 0);
    
    // Use the larger of the two (safety)
    var finalTotal = Math.max(total, calculatedTotal);
    
    return {
        totalCount: finalTotal,
        counts: counts,
        current: data.current || 'allahuAkbar',
        history: Array.isArray(data.history) ? data.history : []
    };
}

function getSpiritualStats() {
    var data = StorageManager.get('spiritual_reading_data') || {};
    return {
        totalReads: Number(data.totalReads || 0),
        totalDuas: Number(data.totalDuas || 0),
        totalZiyarat: Number(data.totalZiyarat || 0)
    };
}

function getJournalCount() {
    var entries = StorageManager.get('journal_entries') || [];
    return entries.length;
}

function getQuizCount() {
    var history = StorageManager.get('quiz_history') || [];
    return history.length;
}

function getStreakDays(stats) {
    if (!stats.isActive) return 0;
    // Calculate streak from recovery data
    if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getRecoveryStats === 'function') {
        var fullStats = RecoveryCounter.getRecoveryStats();
        return fullStats.totalDays || 0;
    }
    return stats.totalDays || 0;
}

function renderAchievements() {
    var unlocked = typeof AchievementsManager !== 'undefined' ? 
        AchievementsManager.getUnlocked() : [];
    var locked = typeof AchievementsManager !== 'undefined' ? 
        AchievementsManager.getLocked() : [];
    
    var html = '';
    
    unlocked.forEach(function(a) {
        html += `
            <div class="achievement-item unlocked">
                <i class="fas ${a.icon}" style="font-size: 30px; color: ${a.color};"></i>
                <p style="font-weight: 600; margin-top: 8px;">${a.title}</p>
                <small style="color: var(--text-tertiary);">${a.description}</small>
            </div>
        `;
    });
    
    locked.forEach(function(a) {
        html += `
            <div class="achievement-item locked">
                <i class="fas ${a.icon}" style="font-size: 30px;"></i>
                <p style="font-weight: 600; margin-top: 8px;">???</p>
                <small style="color: var(--text-tertiary);">لم تكتشف بعد</small>
            </div>
        `;
    });
    
    return html;
}

// Update stats when data changes
window.addEventListener('taeafiDataUpdated', function(e) {
    // Only update if stats page is visible
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'stats') {
        // Update the displayed numbers without full reload
        updateStatsUI();
    }
});

window.addEventListener('taeafiTasbihUpdated', function(e) {
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'stats') {
        updateStatsUI();
    }
});

window.addEventListener('taeafiSpiritualReading', function(e) {
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'stats') {
        updateStatsUI();
    }
});

// Also listen to recovery updates
window.addEventListener('recoveryUpdated', function(e) {
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'stats') {
        updateStatsUI();
    }
});

/**
 * Update the stats UI without full page reload.
 */
function updateStatsUI() {
    try {
        var stats = typeof RecoveryCounter !== 'undefined' ? 
            RecoveryCounter.getRecoveryStats() : { totalDays: 0, relapses: 0, isActive: false };
        
        var tasbih = getTasbihStats();
        var achievements = typeof AchievementsManager !== 'undefined' ? 
            AchievementsManager.getUnlocked() : [];
        var spiritualStats = getSpiritualStats();
        
        // Update recovery days
        var recoveryEl = document.getElementById('stat-recovery-days');
        if (recoveryEl) recoveryEl.textContent = stats.totalDays;
        
        // Update relapses
        var relapseEl = document.getElementById('stat-relapses');
        if (relapseEl) {
            relapseEl.textContent = Array.isArray(stats.relapses) 
                ? stats.relapses.length 
                : Number(stats.relapses || 0);
        }
        
        // The Code Old and Bugs
        // var relapseEl = document.getElementById('stat-relapses');
        // if (relapseEl) relapseEl.textContent = stats.relapses || 0;
        
        // Update tasbih total
        var tasbihEl = document.getElementById('stat-tasbih-total');
        if (tasbihEl) tasbihEl.textContent = tasbih.totalCount.toLocaleString('en-US');
        
        // Update achievements
        var achievementsEl = document.getElementById('stat-achievements');
        if (achievementsEl) achievementsEl.textContent = achievements.length;
        
        // Refresh achievements grid if needed
        var grid = document.getElementById('achievements-grid');
        if (grid) {
            grid.innerHTML = renderAchievements();
        }
        
    } catch (error) {
        console.warn('[Stats] UI update failed:', error);
    }
}

// CSS
var statsStyles = document.createElement('style');
statsStyles.textContent = `
    .stats-cards-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
        margin-bottom: 20px;
    }
    .stat-card {
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: 20px;
        text-align: center;
        box-shadow: var(--shadow-sm);
    }
    .stat-card i { font-size: 28px; margin-bottom: 8px; display: block; }
    .stat-number { font-size: 28px; font-weight: 700; display: block; }
    .stat-label { font-size: 12px; color: var(--text-tertiary); }
    .progress-bar-container {
        background: var(--border-light);
        border-radius: 10px;
        height: 30px;
        overflow: hidden;
        position: relative;
    }
    .progress-bar-fill {
        height: 100%;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 13px;
        transition: width 0.5s ease;
        min-width: 40px;
    }
    .mini-stats {
        display: flex;
        justify-content: space-around;
        text-align: center;
    }
    .mini-stats div span { display: block; font-size: 12px; color: var(--text-tertiary); }
    .mini-stats div strong { display: block; font-size: 22px; color: var(--primary); }
    
    @media (max-width: 767px) {
        .stats-cards-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
`;
document.head.appendChild(statsStyles);