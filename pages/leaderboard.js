// Taeafi Personal Leaderboard v1.1.2 - No Emoji

function renderLeaderboardPage() {
    var mainContent = document.getElementById('main-content');
    var stats = RecoveryCounter.getRecoveryStats();
    var points = StorageManager.get('challenge_points') || 0;
    var achievements = typeof AchievementsManager !== 'undefined' ? AchievementsManager.getUnlocked() : [];
    var journal = StorageManager.get('journal_entries') || [];
    var tasbih = StorageManager.get('tasbih_data') || {};
    
    var records = StorageManager.get('personal_records') || {
        longestStreak: stats.totalDays,
        mostTasbih: tasbih.totalCount || 0,
        bestQuiz: 0,
        achievements: achievements.length
    };
    
    if (stats.totalDays > records.longestStreak) records.longestStreak = stats.totalDays;
    if ((tasbih.totalCount || 0) > records.mostTasbih) records.mostTasbih = tasbih.totalCount || 0;
    if (achievements.length > records.achievements) records.achievements = achievements.length;
    StorageManager.set('personal_records', records);
    
    var levelInfo = getUserLevel(points);
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-crown" style="margin-left: 8px; color: #FFD700;"></i>
                لوحة المتصدرين الشخصية
            </h1>
            
            <div class="card" style="text-align:center;background:linear-gradient(135deg,#FFD700,#FFA000);color:white;">
                <i class="fas fa-star" style="font-size:40px;margin-bottom:8px;"></i>
                <div style="font-size:48px;font-weight:800;">${points}</div>
                <p>نقطة إجمالية</p>
            </div>
            
            <h2 class="section-title" style="margin-top:24px;">
                <i class="fas fa-medal" style="margin-left:8px;color:#FFD700;"></i>
                سجلاتي الشخصية
            </h2>
            <div class="stats-cards-grid">
                <div class="stat-card" style="border-top:4px solid #4CAF50;">
                    <i class="fas fa-calendar-check" style="color:#4CAF50;"></i>
                    <span class="stat-number">${records.longestStreak}</span>
                    <span class="stat-label">أطول فترة تعافي</span>
                </div>
                <div class="stat-card" style="border-top:4px solid #2196F3;">
                    <i class="fas fa-hands-praying" style="color:#2196F3;"></i>
                    <span class="stat-number">${records.mostTasbih}</span>
                    <span class="stat-label">أكثر تسبيحات</span>
                </div>
                <div class="stat-card" style="border-top:4px solid #FFD700;">
                    <i class="fas fa-trophy" style="color:#FFD700;"></i>
                    <span class="stat-number">${records.achievements}</span>
                    <span class="stat-label">إنجاز</span>
                </div>
                <div class="stat-card" style="border-top:4px solid #E91E63;">
                    <i class="fas fa-pen-fancy" style="color:#E91E63;"></i>
                    <span class="stat-number">${journal.length}</span>
                    <span class="stat-label">مذكرة</span>
                </div>
            </div>
            
            <h2 class="section-title" style="margin-top:24px;">
                <i class="fas fa-fire" style="margin-left:8px;color:#FF9800;"></i>
                تحديات هذا الأسبوع
            </h2>
            ${renderWeeklyChallenges()}
            
            <div class="card" style="text-align:center;">
                <h3><i class="fas fa-chart-line" style="margin-left:6px;"></i> مستواك الحالي</h3>
                <i class="fas ${levelInfo.icon}" style="font-size:60px;margin:16px 0;color:${levelInfo.color};"></i>
                <strong style="font-size:20px;color:var(--primary);">${levelInfo.title}</strong>
                <p style="color:var(--text-secondary);">${levelInfo.next} نقطة للمستوى التالي</p>
                <div class="progress-bar-container" style="margin-top:12px;">
                    <div class="progress-bar-fill" style="width:${levelInfo.progress}%;background:linear-gradient(90deg,#FFD700,#FFA000);"></div>
                </div>
            </div>
        </div>
    `;
}

function renderWeeklyChallenges() {
    if (typeof ChallengesManager === 'undefined') return '<p style="text-align:center;color:var(--text-tertiary);">جاري التحميل...</p>';
    
    var active = ChallengesManager.getActiveChallenges();
    var completed = ChallengesManager.getCompletedChallenges();
    var progress = ChallengesManager.getProgress();
    
    var html = '';
    
    html += `
        <div style="margin-bottom:16px;text-align:center;">
            <span style="font-size:14px;color:var(--text-secondary);">${completed.length}/${WEEKLY_CHALLENGES.length} مكتمل</span>
            <div class="progress-bar-container" style="margin-top:8px;">
                <div class="progress-bar-fill" style="width:${progress}%;background:linear-gradient(90deg,#4CAF50,#8BC34A);">${progress}%</div>
            </div>
        </div>
    `;
    
    completed.forEach(function(c) {
        html += `
            <div class="card" style="border-right:4px solid #4CAF50;opacity:0.8;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <i class="fas ${c.icon}" style="color:#4CAF50;font-size:24px;"></i>
                    <div style="flex:1;">
                        <strong style="color:#4CAF50;"><i class="fas fa-check-circle"></i> ${c.title}</strong>
                        <p style="font-size:12px;color:var(--text-tertiary);">${c.reward}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    active.forEach(function(c) {
        html += `
            <div class="card" style="margin-bottom:8px;" onclick="checkSingleChallenge('${c.id}')">
                <div style="display:flex;align-items:center;gap:10px;">
                    <i class="fas ${c.icon}" style="color:${c.color};font-size:24px;"></i>
                    <div style="flex:1;">
                        <strong>${c.title}</strong>
                        <p style="font-size:12px;color:var(--text-secondary);">${c.description}</p>
                        <p style="font-size:11px;color:var(--text-tertiary);">المكافأة: ${c.reward}</p>
                    </div>
                    <i class="fas fa-chevron-left" style="color:var(--text-tertiary);"></i>
                </div>
            </div>
        `;
    });
    
    return html || '<p style="text-align:center;color:var(--text-tertiary);">لا توجد تحديات حالياً</p>';
}

function checkSingleChallenge(challengeId) {
    if (typeof ChallengesManager !== 'undefined') {
        var result = ChallengesManager.checkChallenge(challengeId);
        if (result) {
            if (typeof showToast === 'function') showToast('<i class="fas fa-trophy"></i> تم إكمال التحدي');
            renderLeaderboardPage();
        } else {
            if (typeof showToast === 'function') showToast('<i class="fas fa-info-circle"></i> لم تكتمل شروط التحدي بعد');
        }
    }
}

function getUserLevel(points) {
    var levels = [
        { min: 0, max: 100, title: 'مبتدئ', icon: 'fa-seedling', color: '#8BC34A', next: 100, progress: 0 },
        { min: 100, max: 300, title: 'نشيط', icon: 'fa-leaf', color: '#4CAF50', next: 300, progress: 0 },
        { min: 300, max: 600, title: 'مجتهد', icon: 'fa-tree', color: '#2E7D32', next: 600, progress: 0 },
        { min: 600, max: 1000, title: 'محارب', icon: 'fa-shield-halved', color: '#FF5722', next: 1000, progress: 0 },
        { min: 1000, max: 2000, title: 'بطل', icon: 'fa-trophy', color: '#FFD700', next: 2000, progress: 0 },
        { min: 2000, max: 5000, title: 'أسطورة', icon: 'fa-crown', color: '#FFA000', next: 5000, progress: 0 },
        { min: 5000, max: 99999, title: 'خارق', icon: 'fa-bolt', color: '#7C4DFF', next: 99999, progress: 100 }
    ];
    
    for (var i = 0; i < levels.length; i++) {
        if (points >= levels[i].min && points < levels[i].max) {
            levels[i].progress = Math.round(((points - levels[i].min) / (levels[i].max - levels[i].min)) * 100);
            return levels[i];
        }
    }
    return levels[levels.length - 1];
}