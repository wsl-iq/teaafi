/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : leaderboard.js
 * Type: JavaScript
 */

function renderLeaderboardPage() {
    var mainContent = document.getElementById('main-content');
    var stats = RecoveryCounter.getRecoveryStats();
    var points = StorageManager.get('challenge_points') || 0;
    var achievements = typeof AchievementsManager !== 'undefined' ? AchievementsManager.getUnlocked() : [];
    var journal = StorageManager.get('journal_entries') || [];

    // Get the REAL tasbih total
    var tasbihData = getTasbihStats();
    var tasbihTotal = tasbihData.totalCount;

    // Spiritual reading stats
    var spiritualStats = getSpiritualStats();

    // Load and update personal records
    var records = StorageManager.get('personal_records') || {
        longestStreak: 0,
        mostTasbih: 0,
        bestQuiz: 0,
        achievements: 0
    };

    // Check the longest streak across ALL habits (multi-habit system)
    if (typeof TaeafiMultiHabit !== 'undefined' && typeof TaeafiMultiHabit.getHabits === 'function') {
        var allHabits = TaeafiMultiHabit.getHabits() || [];
        allHabits.forEach(function (h) {
            if (h.habitType && typeof TaeafiMultiHabit.getStats === 'function') {
                var hStats = TaeafiMultiHabit.getStats(h.habitType);
                if (hStats && hStats.totalDays > (records.longestStreak || 0)) {
                    records.longestStreak = hStats.totalDays;
                }
            }
        });
    }

    // Fallback: active habit streak
    if (stats.totalDays > (records.longestStreak || 0)) {
        records.longestStreak = stats.totalDays;
    }

    // Update mostTasbih
    if (tasbihTotal > (records.mostTasbih || 0)) {
        records.mostTasbih = tasbihTotal;
    }

    // Update bestQuiz (was never updated before)
    var quizHistory = StorageManager.get('quiz_history') || [];
    var bestQuizScore = quizHistory.length > 0
        ? Math.max.apply(null, quizHistory.map(function (q) {
            return Number(q.score || 0);
        }))
        : 0;
    if (bestQuizScore > (records.bestQuiz || 0)) {
        records.bestQuiz = bestQuizScore;
    }

    // Update achievements count
    if (achievements.length > (records.achievements || 0)) {
        records.achievements = achievements.length;
    }

    // Save updated records
    StorageManager.set('personal_records', records);

    var levelInfo = getUserLevel(points);

    // Get weekly challenge progress
    var weeklyTasbih = getWeeklyTasbihCount();

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
                    <span class="stat-number" id="record-streak">${records.longestStreak}</span>
                    <span class="stat-label">أطول فترة تعافي</span>
                </div>

                <div class="stat-card" style="border-top:4px solid #2196F3;">
                    <i class="fas fa-hands-praying" style="color:#2196F3;"></i>
                    <span class="stat-number" id="record-tasbih">${(records.mostTasbih || 0).toLocaleString('en-US')}</span>
                    <span class="stat-label">أكثر تسبيحات</span>
                </div>

                <div class="stat-card" style="border-top:4px solid #FFD700;">
                    <i class="fas fa-trophy" style="color:#FFD700;"></i>
                    <span class="stat-number" id="record-achievements">${records.achievements}</span>
                    <span class="stat-label">إنجاز</span>
                </div>

                <div class="stat-card" style="border-top:4px solid #E91E63;">
                    <i class="fas fa-pen-fancy" style="color:#E91E63;"></i>
                    <span class="stat-number">${journal.length}</span>
                    <span class="stat-label">مذكرة</span>
                </div>
            </div>

            <!-- Weekly Challenge Progress -->
            <div class="card" style="margin-top: 16px;">
                <h3 style="margin-bottom: 12px;">
                    <i class="fas fa-calendar-week" style="margin-left: 8px; color: #FF9800;"></i>
                    تقدم هذا الأسبوع
                </h3>
                <div style="display: flex; justify-content: space-around; text-align: center;">
                    <div>
                        <div style="font-size: 24px; font-weight: 700; color: #2196F3;">${weeklyTasbih}</div>
                        <div style="font-size: 11px; color: var(--text-tertiary);">تسبيحة هذا الأسبوع</div>
                    </div>
                    <div>
                        <div style="font-size: 24px; font-weight: 700; color: #4CAF50;">${spiritualStats.totalReads}</div>
                        <div style="font-size: 11px; color: var(--text-tertiary);">قراءة (دعاء/زيارة)</div>
                    </div>
                </div>
                <div style="margin-top: 12px; padding: 8px; background: var(--surface-variant); border-radius: 8px; text-align: center;">
                    <p style="font-size: 12px; color: var(--text-secondary);">
                        ${
                            weeklyTasbih >= 1000
                                ? '<i class="fas fa-trophy" style="margin-left: 4px; color: #FFD700;"></i> أكملت 1000 تسبيحة هذا الأسبوع!'
                                : weeklyTasbih >= 500
                                    ? '<i class="fas fa-dumbbell" style="margin-left: 4px; color: #4CAF50;"></i> ' + weeklyTasbih + ' تسبيحة - أنت في الطريق الصحيح!'
                                    : '<i class="fas fa-praying-hands" style="margin-left: 4px; color: #2196F3;"></i> ' + weeklyTasbih + ' تسبيحة حتى الآن هذا الأسبوع'
                        }
                    </p>
                </div>
            </div>

            <h2 class="section-title" style="margin-top:24px;">
                <i class="fas fa-fire" style="margin-left:8px;color:#FF9800;"></i>
                تحديات هذا الأسبوع
            </h2>
            <div id="weekly-challenges-container">
                ${renderWeeklyChallenges()}
            </div>

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

/**
 * Get tasbih stats safely.
 * Uses DataUpdateManager as source of truth, with fallback to storage.
 */
function getTasbihStats() {
    if (typeof DataUpdateManager !== 'undefined' &&
        typeof DataUpdateManager.getTasbihTotal === 'function') {
        return {
            totalCount: DataUpdateManager.getTasbihTotal(),
            counts: (StorageManager.get('tasbih_data') || {}).counts || {}
        };
    }

    var data = StorageManager.get('tasbih_data') || {};
    var total = Number(data.totalCount || 0);
    var counts = data.counts || {};
    var calculated = Number(counts.allahuAkbar || 0) +
                     Number(counts.alhamdulillah || 0) +
                     Number(counts.subhanAllah || 0);

    return {
        totalCount: Math.max(total, calculated),
        counts: counts
    };
}

/**
 * Get spiritual reading stats.
 */
function getSpiritualStats() {
    var data = StorageManager.get('spiritual_reading_data') || {};
    return {
        totalReads: Number(data.totalReads || 0),
        totalDuas: Number(data.totalDuas || 0),
        totalZiyarat: Number(data.totalZiyarat || 0)
    };
}

/**
 * Get weekly tasbih count for challenges.
 * Uses DataUpdateManager if available, falls back to direct calculation.
 */
function getWeeklyTasbihCount() {
    if (typeof DataUpdateManager !== 'undefined' &&
        typeof DataUpdateManager.getWeeklyTasbihCount === 'function') {
        return DataUpdateManager.getWeeklyTasbihCount();
    }

    var data = StorageManager.get('tasbih_data') || {};
    var history = data.history || [];
    var weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    var weeklyTotal = 0;

    for (var i = 0; i < history.length; i++) {
        var entry = history[i];
        var entryTotal = Number(entry.total || entry.count || 0);

        if (entry.timestamp && entry.timestamp >= weekAgo) {
            weeklyTotal += entryTotal;
        } else if (entry.date) {
            var entryDate = new Date(entry.date);
            if (entryDate.getTime() >= weekAgo) {
                weeklyTotal += entryTotal;
            }
        }
    }

    var session = StorageManager.get('tasbih_session') || {};
    weeklyTotal += Number(session.weeklyCount || 0);

    return weeklyTotal;
}

function renderWeeklyChallenges() {
    if (typeof ChallengesManager === 'undefined') {
        return '<p style="text-align:center;color:var(--text-tertiary);">جاري التحميل...</p>';
    }

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

    completed.forEach(function (c) {
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

    active.forEach(function (c) {
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

// Update leaderboard when data changes
window.addEventListener('taeafiDataUpdated', function (e) {
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'leaderboard') {
        renderLeaderboardPage();
    }
});

window.addEventListener('taeafiTasbihUpdated', function (e) {
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'leaderboard') {
        updateLeaderboardRecords();
    }
});

window.addEventListener('taeafiSpiritualReading', function (e) {
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'leaderboard') {
        updateLeaderboardRecords();
    }
});

window.addEventListener('recoveryUpdated', function (e) {
    if (typeof Router !== 'undefined' && Router.getCurrentPage() === 'leaderboard') {
        updateLeaderboardRecords();
    }
});

/**
 * Update leaderboard records without full reload.
 */
function updateLeaderboardRecords() {
    try {
        var stats = RecoveryCounter.getRecoveryStats();
        var tasbihData = getTasbihStats();
        var achievements = typeof AchievementsManager !== 'undefined'
            ? AchievementsManager.getUnlocked()
            : [];

        var records = StorageManager.get('personal_records') || {};

        // Update displayed numbers
        var streakEl = document.getElementById('record-streak');
        if (streakEl) streakEl.textContent = records.longestStreak || stats.totalDays || 0;

        var tasbihEl = document.getElementById('record-tasbih');
        if (tasbihEl) tasbihEl.textContent = (records.mostTasbih || 0).toLocaleString('en-US');

        var achievementsEl = document.getElementById('record-achievements');
        if (achievementsEl) achievementsEl.textContent = records.achievements || achievements.length || 0;

        // Update weekly challenges container if needed
        var container = document.getElementById('weekly-challenges-container');
        if (container) {
            container.innerHTML = renderWeeklyChallenges();
        }

    } catch (error) {
        console.warn('[Leaderboard] Update failed:', error);
    }
}