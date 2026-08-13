/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : data
 * File   : challenges.js
 * Type: JavaScript
 */

var WEEKLY_CHALLENGES = [
    {
        id: 'week_1',
        title: 'الأسبوع الذهبي',
        description: '7 أيام متواصلة بدون انتكاسة',
        icon: 'fa-trophy',
        color: '#FFD700',
        target: 7,
        metric: 'days',
        reward: 'شارة "الأسبوع الذهبي" + 100 نقطة',
        check: function() {
            var stats = RecoveryCounter.getRecoveryStats();
            return stats.totalDays >= 7 && stats.relapses === 0;
        }
    },
    {
        id: 'tasbih_1000',
        title: 'المُسبِّح المخلص',
        description: 'أكمل 1000 تسبيحة هذا الأسبوع',
        icon: 'fa-hands-praying',
        color: '#4CAF50',
        target: 1000,
        metric: 'tasbih',
        reward: 'شارة "المُسبِّح" + 50 نقطة',
        check: function() {
            var data = StorageManager.get('tasbih_data');
            return data && data.totalCount >= 1000;
        }
    },
    {
        id: 'dua_reader',
        title: 'قارئ الأدعية',
        description: 'اقرأ 5 أدعية كاملة هذا الأسبوع',
        icon: 'fa-book-open',
        color: '#9C27B0',
        target: 5,
        metric: 'duas',
        reward: 'شارة "القارئ" + 75 نقطة',
        check: function() {
            var read = StorageManager.get('duas_read') || [];
            var weekAgo = Date.now() - 7 * 86400000;
            return read.filter(function(d) { return new Date(d.date) > weekAgo; }).length >= 5;
        }
    },
    {
        id: 'quiz_master',
        title: 'سيد التقييم',
        description: 'أكمل اختبار التقييم الذاتي وحقق أقل من 10 نقاط',
        icon: 'fa-clipboard-check',
        color: '#2196F3',
        target: 10,
        metric: 'quiz',
        reward: 'شارة "الواعي" + 150 نقطة',
        check: function() {
            var quiz = StorageManager.get('last_quiz');
            return quiz && quiz.score <= 10;
        }
    },
    {
        id: 'journal_writer',
        title: 'كاتب المذكرات',
        description: 'اكتب في مذكراتك 7 أيام هذا الأسبوع',
        icon: 'fa-pen-fancy',
        color: '#E91E63',
        target: 7,
        metric: 'journal',
        reward: 'شارة "الكاتب" + 60 نقطة',
        check: function() {
            var journal = StorageManager.get('journal_entries') || [];
            var weekAgo = Date.now() - 7 * 86400000;
            return journal.filter(function(j) { return new Date(j.date) > weekAgo; }).length >= 7;
        }
    },
    {
        id: 'multi_habit',
        title: 'محارب متعدد',
        description: 'ابدأ التعافي من عادة جديدة هذا الأسبوع',
        icon: 'fa-layer-group',
        color: '#FF9800',
        target: 1,
        metric: 'new_habit',
        reward: 'شارة "المحارب" + 200 نقطة',
        check: function() {
            var habits = StorageManager.get('habits_history') || [];
            var weekAgo = Date.now() - 7 * 86400000;
            return habits.filter(function(h) { return new Date(h.date) > weekAgo; }).length >= 1;
        }
    }
];

var ChallengesManager = {
    currentWeek: 0,
    completed: [],
    points: 0,
    
    init: function() {
        this.points = StorageManager.get('challenge_points') || 0;
        this.completed = StorageManager.get('completed_challenges') || [];
        this.currentWeek = this._getWeekNumber();
    },
    
    _getWeekNumber: function() {
        var now = new Date();
        var start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
    },
    
    getActiveChallenges: function() {
        var self = this;
        return WEEKLY_CHALLENGES.filter(function(c) {
            return self.completed.indexOf(c.id + '_' + self.currentWeek) === -1;
        });
    },
    
    getCompletedChallenges: function() {
        var self = this;
        return WEEKLY_CHALLENGES.filter(function(c) {
            return self.completed.indexOf(c.id + '_' + self.currentWeek) !== -1;
        });
    },
    
    checkChallenge: function(challengeId) {
        var challenge = WEEKLY_CHALLENGES.find(function(c) { return c.id === challengeId; });
        if (!challenge) return false;
        
        var key = challenge.id + '_' + this.currentWeek;
        if (this.completed.indexOf(key) !== -1) return false;
        
        if (challenge.check()) {
            this.completed.push(key);
            this.points += this._getPoints(challenge.reward);
            StorageManager.set('completed_challenges', this.completed);
            StorageManager.set('challenge_points', this.points);
            return true;
        }
        return false;
    },
    
    checkAll: function() {
        var self = this;
        var unlocked = [];
        WEEKLY_CHALLENGES.forEach(function(c) {
            if (self.checkChallenge(c.id)) {
                unlocked.push(c);
            }
        });
        return unlocked;
    },
    
    _getPoints: function(reward) {
        var match = reward.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    },
    
    getProgress: function() {
        var total = WEEKLY_CHALLENGES.length;
        var done = this.getCompletedChallenges().length;
        return Math.round((done / total) * 100);
    }
};
