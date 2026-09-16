/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : data
 * File   : achievements.js
 * Type: JavaScript
 */

const ACHIEVEMENTS = {
    // Recovery achievements or Trophys
    first_step: {
        id: 'first_step',
        title: 'الخطوة الأولى',
        description: 'بدء أول رحلة تعافي',
        icon: 'fa-shoe-prints',
        color: '#4CAF50',
        category: 'recovery',
        condition: function(stats) { return stats.isActive && stats.totalDays >= 0; }
    },

    first_day: {
        id: 'first_day',
        title: 'أول 24 ساعة',
        description: 'أكملت أول يوم في رحلة التعافي',
        icon: 'fa-clock',
        color: '#8BC34A',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 1; }
    },

    three_days: {
        id: 'three_days',
        title: 'صامد',
        description: 'تجاوزت أصعب 3 أيام',
        icon: 'fa-fire',
        color: '#FF9800',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 3; }
    },

    week_warrior: {
        id: 'week_warrior',
        title: 'بطل الأسبوع',
        description: 'أسبوع كامل بدون انتكاسة',
        icon: 'fa-trophy',
        color: '#FFC107',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 7; }
    },

    two_weeks: {
        id: 'two_weeks',
        title: 'قوة الإرادة',
        description: 'أسبوعان من التعافي المتواصل',
        icon: 'fa-hand-fist',
        color: '#FF5722',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 14; }
    },

    month_master: {
        id: 'month_master',
        title: 'سيد الشهر',
        description: '30 يوماً من الانتصار',
        icon: 'fa-medal',
        color: '#2196F3',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 30; }
    },

    two_months: {
        id: 'two_months',
        title: 'محارب',
        description: '60 يوماً في رحلة التعافي',
        icon: 'fa-shield-halved',
        color: '#3F51B5',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 60; }
    },

    ninety_days: {
        id: 'ninety_days',
        title: 'أسطورة التعافي',
        description: '90 يوماً - التعافي الكامل',
        icon: 'fa-crown',
        color: '#FFD700',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 90; }
    },

    six_months: {
        id: 'six_months',
        title: 'نصف عام حرية',
        description: '180 يوماً من الحياة الجديدة',
        icon: 'fa-gem',
        color: '#9C27B0',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 180; }
    },

    year_free: {
        id: 'year_free',
        title: 'عام الحرية',
        description: '365 يوماً - سنة كاملة',
        icon: 'fa-award',
        color: '#E91E63',
        category: 'recovery',
        condition: function(stats) { return stats.totalDays >= 365; }
    },
    
    // Achievements of praise
    tasbih_100: {
        id: 'tasbih_100',
        title: 'مُسبِّح جديد',
        description: 'أكملت 100 تسبيحة',
        icon: 'fa-hands-praying',
        color: '#00BCD4',
        category: 'tasbih',
        condition: function() {
            var data = StorageManager.get('tasbih_data') || {};
            var total = Number(data.totalCount || 0);
            var counts = data.counts || {};
            var calculated = Number(counts.allahuAkbar || 0) + Number(counts.alhamdulillah || 0) + Number(counts.subhanAllah || 0);
            return Math.max(total, calculated) >= 100;
        }
    },

    tasbih_1000: {
        id: 'tasbih_1000',
        title: 'مُسبِّح مخلص',
        description: 'أكملت 1000 تسبيحة',
        icon: 'fa-mosque',
        color: '#4CAF50',
        category: 'tasbih',
        condition: function() {
            var data = StorageManager.get('tasbih_data') || {};
            var total = Number(data.totalCount || 0);
            var counts = data.counts || {};
            var calculated = Number(counts.allahuAkbar || 0) + Number(counts.alhamdulillah || 0) + Number(counts.subhanAllah || 0);
            return Math.max(total, calculated) >= 1000;
        }
    },

    tasbih_5000: {
        id: 'tasbih_5000',
        title: 'أهل الذكر',
        description: 'أكملت 5000 تسبيحة',
        icon: 'fa-star-and-crescent',
        color: '#FF9800',
        category: 'tasbih',
        condition: function() {
            var data = StorageManager.get('tasbih_data') || {};
            var total = Number(data.totalCount || 0);
            var counts = data.counts || {};
            var calculated = Number(counts.allahuAkbar || 0) + Number(counts.alhamdulillah || 0) + Number(counts.subhanAllah || 0);
            return Math.max(total, calculated) >= 5000;
        }
    },
    
    // General achievements 
    multi_habit: {
        id: 'multi_habit',
        title: 'محارب متعدد',
        description: 'بدأت التعافي من 3 عادات مختلفة',
        icon: 'fa-layer-group',
        color: '#795548',
        category: 'general',
        condition: function() {
                if (typeof TaeafiMultiHabit !== 'undefined' && typeof TaeafiMultiHabit.getHabits === 'function') {
                    return (TaeafiMultiHabit.getHabits() || []).length >= 3;
                }
                try {
                    var raw = localStorage.getItem('taeafi_multi_habit_recovery');
                    if (raw) {
                        var parsed = JSON.parse(raw);
                        var db = parsed && parsed.value ? parsed.value : parsed;
                        if (db && db.habits) return Object.keys(db.habits).length >= 3;
                    }
                } catch (e) {}
                return false;
        }
    },

    perfect_week: {
        id: 'perfect_week',
        title: 'أسبوع مثالي',
        description: '7 أيام بدون أي انتكاسة',
        icon: 'fa-star',
        color: '#FFD700',
        category: 'recovery',
        condition: function(stats) {
            var relapseCount = Array.isArray(stats.relapses) ? stats.relapses.length : Number(stats.relapses || 0);
            return stats.totalDays >= 7 && relapseCount === 0;
        }
    },

    come_back: {
        id: 'come_back',
        title: 'العودة أقوى',
        description: 'عدت للتعافي بعد انتكاسة',
        icon: 'fa-rotate-left',
        color: '#FF5722',
        category: 'recovery',
        condition: function(stats) {
            var relapseCount = Array.isArray(stats.relapses) ? stats.relapses.length : Number(stats.relapses || 0);
            return relapseCount > 0 && stats.totalDays >= 1;
        }
    },

    rating_given: {
        id: 'rating_given',
        title: 'مُقيِّم',
        description: 'قيمت التطبيق وساعدت في تطويره',
        icon: 'fa-star',
        color: '#FFC107',
        category: 'general',
        condition: function() {
            return StorageManager.get('app_rated') === true;
        }
    }
};

// Achievements Manager
var AchievementsManager = {
    unlocked: [],
    init: function() {
        this.unlocked = StorageManager.get('achievements') || [];
        this.checkAll();
    },
    
    checkAll: function() {

        var stats =
            typeof RecoveryCounter !== 'undefined'
                ? RecoveryCounter.getRecoveryStats()
                : {
                    totalDays: 0,
                    relapses: 0,
                    isActive: false
                };

        var newlyUnlocked = [];

        for (var key in ACHIEVEMENTS) {

            if (
                !Object.prototype.hasOwnProperty.call(
                    ACHIEVEMENTS,
                    key
                )
            ) {
                continue;
            }

            var achievement =
                ACHIEVEMENTS[key];

            if (
                this.unlocked.indexOf(
                    achievement.id
                ) !== -1
            ) {
                continue;
            }

            try {

                var completed =
                    achievement.condition(stats);

                if (completed) {

                    this.unlocked.push(
                        achievement.id
                    );

                    newlyUnlocked.push(
                        achievement
                    );
                }

            } catch (error) {

                console.error(
                    '[Achievements] Condition failed:',
                    achievement.id,
                    error
                );

            }
        }

        /*
        * حفظ الإنجازات إذا صار تغيير.
        */
        if (newlyUnlocked.length > 0) {

            StorageManager.set(
                'achievements',
                this.unlocked
            );

            // ✅ Ensure DataUpdateManager knows about the new achievement
            if (typeof DataUpdateManager !== 'undefined') {
                DataUpdateManager._updatePersonalRecords();
            }

            newlyUnlocked.forEach(
                function (achievement) {

                    if (
                        typeof showAchievementNotification ===
                        'function'
                    ) {

                        showAchievementNotification(
                            achievement
                        );
                    }

                }
            );

            /*
            * حدث عام حتى الإحصائيات والـ leaderboard
            * تعرف أن هناك إنجاز جديد.
            */
            window.dispatchEvent(
                new CustomEvent(
                    'taeafiAchievementUnlocked',
                    {
                        detail: {
                            achievements:
                                newlyUnlocked
                        }
                    }
                )
            );
        }

        return newlyUnlocked;
    },
    
    
    getUnlocked: function() {
        var result = [];
        for (var key in ACHIEVEMENTS) {
            if (this.unlocked.indexOf(ACHIEVEMENTS[key].id) !== -1) {
                result.push(ACHIEVEMENTS[key]);
            }
        }
        return result;
    },
    
    getLocked: function() {
        var result = [];
        for (var key in ACHIEVEMENTS) {
            if (this.unlocked.indexOf(ACHIEVEMENTS[key].id) === -1) {
                result.push(ACHIEVEMENTS[key]);
            }
        }
        return result;
    },
    
    getProgress: function() {
        var total = Object.keys(ACHIEVEMENTS).length;
        return Math.round((this.unlocked.length / total) * 100);
    },
    
    getCategoryCount: function(category) {
        var total = 0;
        var unlocked = 0;
        for (var key in ACHIEVEMENTS) {
            if (ACHIEVEMENTS[key].category === category) {
                total++;
                if (this.unlocked.indexOf(ACHIEVEMENTS[key].id) !== -1) unlocked++;
            }
        }
        
        return { unlocked: unlocked, total: total };
    }
};

function showAchievementNotification(achievement) {
    var modal = document.createElement('div');
    modal.className = 'achievement-popup';
    modal.innerHTML = `
        <div class="achievement-card" style="border-right: 4px solid ${achievement.color};">
            <i class="fas ${achievement.icon}" style="font-size: 40px; color: ${achievement.color};"></i>
            <h3>🏆 إنجاز جديد!</h3>
            <strong>${achievement.title}</strong>
            <p>${achievement.description}</p>
        </div>
    `;

    document.body.appendChild(modal);
    
    setTimeout(function() {
        modal.style.opacity = '0';
        setTimeout(function() { modal.remove(); }, 500);
    }, 3000);
    
    if (typeof showToast === 'function') {
        showToast('🏆 إنجاز: ' + achievement.title);
    }
}

// Achievements CSS 
var achievementStyles = document.createElement('style');
achievementStyles.textContent = `
    .achievement-popup {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        animation: slideDown 0.5s ease;
    }

    .achievement-card {
        background: var(--surface);
        padding: 20px 30px;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-xl);
        text-align: center;
        min-width: 280px;
    }

    @keyframes slideDown {
        from { top: -100px; opacity: 0; }
        to { top: 20px; opacity: 1; }
    }

    .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;
    }

    .achievement-item {
        text-align: center;
        padding: 16px;
        border-radius: var(--radius-lg);
        background: var(--surface);
        border: 1px solid var(--border-light);
    }

    .achievement-item.locked {
        opacity: 0.5;
        filter: grayscale(100%);
    }

    .achievement-item.unlocked {
        border-color: var(--primary);
    }
`;

document.head.appendChild(achievementStyles);