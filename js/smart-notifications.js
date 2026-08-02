/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : smart-notifications.js
 * Type: JavaScript
 */

var SmartNotifications = {
    bestTime: '08:00',
    history: [],
    interval: null,
    
    init: function() {
        this.history = StorageManager.get('notif_history') || [];
        this.calculateBestTime();
        this.start();
    },
    
    calculateBestTime: function() {
        if (this.history.length > 0) {
            var sum = 0;
            this.history.forEach(function(h) { sum += h.hour; });
            var avgHour = Math.round(sum / this.history.length);
            this.bestTime = String(avgHour).padStart(2, '0') + ':00';
        }
    },
    
    start: function() {
        var self = this;
        this.stop();
        this.interval = setInterval(function() {
            self.checkAndSend();
        }, 3600000); // كل ساعة
    },
    
    stop: function() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    checkAndSend: function() {
        var now = new Date();
        var settings = StorageManager.getSettings();
        if (!settings.notifications) return;
        
        // تذكير الأذكار - الفجر، الظهر، العصر، المغرب، العشاء
        var prayerTimes = [
            { hour: 5, name: 'الفجر', dhikr: 'أذكار الصباح' },
            { hour: 12, name: 'الظهر', dhikr: 'الصلاة على النبي' },
            { hour: 15, name: 'العصر', dhikr: 'الاستغفار' },
            { hour: 18, name: 'المغرب', dhikr: 'أذكار المساء' },
            { hour: 19, name: 'العشاء', dhikr: 'قراءة القرآن' }
        ];
        
        prayerTimes.forEach(function(pt) {
            if (now.getHours() === pt.hour && now.getMinutes() === 0) {
                NotificationService.sendNotification(
                    'حان وقت ' + pt.name,
                    { body: 'لا تنسَ ' + pt.dhikr + ' 🌿' }
                );
            }
        });
        
        // تذكير التعافي في أفضل وقت
        var bestParts = this.bestTime.split(':');
        if (now.getHours() === parseInt(bestParts[0]) && now.getMinutes() === 0) {
            var stats = typeof RecoveryCounter !== 'undefined' ? 
                RecoveryCounter.getRecoveryStats() : { totalDays: 0 };
            var msg = stats.totalDays > 0 ?
                'أكملت ' + stats.totalDays + ' يوم في رحلة التعافي. استمر! 💪' :
                'ابدأ رحلة التعافي اليوم - خطوة واحدة تغير حياتك 🌿';
            
            NotificationService.sendNotification('تذكير التعافي', { body: msg });
        }
    },
    
    recordInteraction: function() {
        var now = new Date();
        this.history.push({
            hour: now.getHours(),
            date: now.toISOString()
        });
        if (this.history.length > 100) this.history.shift();
        StorageManager.set('notif_history', this.history);
        this.calculateBestTime();
    }
};