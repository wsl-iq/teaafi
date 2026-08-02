/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : data
 * File   : achievements.js
 * Type: JavaScript
 */

const ACHIEVEMENTS = {
    // ========== إنجازات التعافي ==========
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
    
    // ========== إنجازات التسبيح ==========
    tasbih_100: {
        id: 'tasbih_100',
        title: 'مُسبِّح جديد',
        description: 'أكملت 100 تسبيحة',
        icon: 'fa-hands-praying',
        color: '#00BCD4',
        category: 'tasbih',
        condition: function() {
            var data = StorageManager.get('tasbih_data');
            return data && data.totalCount >= 100;
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
            var data = StorageManager.get('tasbih_data');
            return data && data.totalCount >= 1000;
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
            var data = StorageManager.get('tasbih_data');
            return data && data.totalCount >= 5000;
        }
    },
    
    // ========== إنجازات عامة ==========
    multi_habit: {
        id: 'multi_habit',
        title: 'محارب متعدد',
        description: 'بدأت التعافي من 3 عادات مختلفة',
        icon: 'fa-layer-group',
        color: '#795548',
        category: 'general',
        condition: function() {
            var habits = StorageManager.get('habits_history') || [];
            return habits.length >= 3;
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
            return stats.totalDays >= 7 && stats.relapses === 0;
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
            return stats.relapses > 0 && stats.totalDays >= 1;
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

// ========== مدير الإنجازات ==========
var AchievementsManager = {
    unlocked: [],
    
    init: function() {
        this.unlocked = StorageManager.get('achievements') || [];
        this.checkAll();
    },
    
    checkAll: function() {
        var stats = typeof RecoveryCounter !== 'undefined' ? 
            RecoveryCounter.getRecoveryStats() : { totalDays: 0, relapses: 0, isActive: false };
        
        var newlyUnlocked = [];
        
        for (var key in ACHIEVEMENTS) {
            var achievement = ACHIEVEMENTS[key];
            if (this.unlocked.indexOf(achievement.id) === -1) {
                if (achievement.condition(stats)) {
                    this.unlocked.push(achievement.id);
                    newlyUnlocked.push(achievement);
                }
            }
        }
        
        if (newlyUnlocked.length > 0) {
            StorageManager.set('achievements', this.unlocked);
            newlyUnlocked.forEach(function(a) {
                showAchievementNotification(a);
            });
        }
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

// CSS للإنجازات
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