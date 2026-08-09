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
    var tasbih = StorageManager.get('tasbih_data') || {};
    var achievements = typeof AchievementsManager !== 'undefined' ? 
        AchievementsManager.getUnlocked() : [];
    
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
                    <span class="stat-number">${stats.totalDays}</span>
                    <span class="stat-label">يوم تعافي</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #F44336;">
                    <i class="fas fa-rotate-left" style="color: #F44336;"></i>
                    <span class="stat-number">${stats.relapses}</span>
                    <span class="stat-label">انتكاسة</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #2196F3;">
                    <i class="fas fa-hands-praying" style="color: #2196F3;"></i>
                    <span class="stat-number">${tasbih.totalCount || 0}</span>
                    <span class="stat-label">تسبيحة</span>
                </div>
                <div class="stat-card" style="border-top: 4px solid #FFD700;">
                    <i class="fas fa-trophy" style="color: #FFD700;"></i>
                    <span class="stat-number">${achievements.length}</span>
                    <span class="stat-label">إنجاز</span>
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
                    إحصائيات التسبيح
                </h3>
                <div class="mini-stats">
                    <div><span>الله أكبر</span><strong>${tasbih.counts?.allahuAkbar || 0}</strong></div>
                    <div><span>الحمد لله</span><strong>${tasbih.counts?.alhamdulillah || 0}</strong></div>
                    <div><span>سبحان الله</span><strong>${tasbih.counts?.subhanAllah || 0}</strong></div>
                </div>
            </div>
            
            <div class="card">
                <h3 style="margin-bottom: 16px;">
                    <i class="fas fa-award" style="color: #FFD700; margin-left: 8px;"></i>
                    الإنجازات (${achievements.length}/${Object.keys(ACHIEVEMENTS).length})
                </h3>
                <div class="achievements-grid">
                    ${renderAchievements()}
                </div>
            </div>
        </div>
    `;
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

// For statistics CSS 
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