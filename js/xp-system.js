// Taeafi XP & Levels System v1.0 - No Emoji

var XPSystem = {
    level: 1,
    xp: 0,
    xpToNext: 100,
    
    rewards: {
        recovery_day:    { xp: 10,  label: 'يوم تعافي' },
        perfect_week:    { xp: 100, label: 'أسبوع نظيف' },
        tasbih_100:      { xp: 5,   label: '100 تسبيحة' },
        journal_entry:   { xp: 25,  label: 'مذكرة يومية' },
        quiz_complete:   { xp: 50,  label: 'اختبار تقييم' },
        challenge_done:  { xp: 75,  label: 'إكمال تحدي' },
        breath_game:     { xp: 15,  label: 'تحدي النفس' },
        dua_read:        { xp: 10,  label: 'قراءة دعاء' },
        streak_7:        { xp: 150, label: '7 أيام متتالية' },
        streak_30:       { xp: 500, label: '30 يوم متتالي' },
        achievement:     { xp: 200, label: 'إنجاز جديد' }
    },
    
    levels: [
        { level: 1,  name: 'مبتدئ',      icon: 'fa-seedling',       xp: 0 },
        { level: 2,  name: 'متحمس',      icon: 'fa-leaf',           xp: 100 },
        { level: 3,  name: 'مجتهد',      icon: 'fa-clover',         xp: 250 },
        { level: 4,  name: 'مثابر',      icon: 'fa-tree',           xp: 500 },
        { level: 5,  name: 'قوي',        icon: 'fa-dumbbell',       xp: 1000 },
        { level: 6,  name: 'محارب',      icon: 'fa-shield-halved',  xp: 2000 },
        { level: 7,  name: 'بطل',        icon: 'fa-trophy',         xp: 3500 },
        { level: 8,  name: 'أسطورة',     icon: 'fa-crown',          xp: 5000 },
        { level: 9,  name: 'خارق',       icon: 'fa-bolt',           xp: 7500 },
        { level: 10, name: 'معافي',      icon: 'fa-star',           xp: 10000 }
    ],
    
    init: function() {
        this.xp = StorageManager.get('user_xp') || 0;
        this.level = this.calculateLevel();
        this.xpToNext = this.getXPToNext();
    },
    
    addXP: function(action) {
        var reward = this.rewards[action];
        if (!reward) return;
        
        var oldLevel = this.level;
        this.xp += reward.xp;
        StorageManager.set('user_xp', this.xp);
        this.level = this.calculateLevel();
        this.xpToNext = this.getXPToNext();
        
        if (typeof showToast === 'function') {
            showToast('<i class="fas fa-plus-circle"></i> +' + reward.xp + ' XP - ' + reward.label);
        }
        
        if (this.level > oldLevel) {
            this._showLevelUp();
        }
    },
    
    calculateLevel: function() {
        for (var i = this.levels.length - 1; i >= 0; i--) {
            if (this.xp >= this.levels[i].xp) {
                return this.levels[i].level;
            }
        }
        return 1;
    },
    
    getXPToNext: function() {
        var nextLevel = this.levels.find(function(l) { return l.level === this.level + 1; }.bind(this));
        if (!nextLevel) return 0;
        return nextLevel.xp - this.xp;
    },
    
    getCurrentLevelXP: function() {
        var current = this.levels.find(function(l) { return l.level === this.level; }.bind(this));
        return current ? current.xp : 0;
    },
    
    getNextLevelXP: function() {
        var next = this.levels.find(function(l) { return l.level === this.level + 1; }.bind(this));
        return next ? next.xp : this.xp;
    },
    
    getProgress: function() {
        var current = this.getCurrentLevelXP();
        var next = this.getNextLevelXP();
        if (next === current) return 100;
        return Math.round(((this.xp - current) / (next - current)) * 100);
    },
    
    getLevelName: function() {
        var levelData = this.levels.find(function(l) { return l.level === this.level; }.bind(this));
        return levelData ? levelData.name : 'مبتدئ';
    },
    
    getLevelIcon: function() {
        var levelData = this.levels.find(function(l) { return l.level === this.level; }.bind(this));
        return levelData ? levelData.icon : 'fa-seedling';
    },
    
    getStats: function() {
        return {
            level: this.level,
            xp: this.xp,
            xpToNext: this.xpToNext,
            progress: this.getProgress(),
            name: this.getLevelName(),
            icon: this.getLevelIcon()
        };
    },
    
    _showLevelUp: function() {
        var levelData = this.levels.find(function(l) { return l.level === this.level; }.bind(this));
        var icon = levelData ? levelData.icon : 'fa-star';
        
        var modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div class="modal-container" style="text-align:center;animation:levelUpBounce 0.6s ease;">
                <i class="fas ${icon}" style="font-size:70px;color:#FFD700;animation:levelUpPulse 1s infinite;margin-bottom:12px;"></i>
                <h1 style="color:#FFD700;font-size:28px;margin:8px 0;">تهانينا!</h1>
                <p style="font-size:18px;color:var(--text-primary);">وصلت إلى</p>
                <p style="font-size:32px;font-weight:800;color:var(--primary);">المستوى ${this.level}</p>
                <p style="font-size:24px;color:var(--text-primary);">${this.getLevelName()}</p>
                <button class="btn btn-primary mt-3" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-arrow-left"></i> متابعة
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(function() { modal.remove(); }, 5000);
        
        if (!document.getElementById('levelup-styles')) {
            var style = document.createElement('style');
            style.id = 'levelup-styles';
            style.textContent = `
                @keyframes levelUpBounce {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                @keyframes levelUpPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { XPSystem.init(); }, 500);
});