/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : notifications.js
 * Type: JavaScript
 */

class NotificationService {
    static isWebView() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.includes('wv') || 
               ua.includes('webview') || 
               (window.Android && typeof window.Android !== 'undefined') ||
               (typeof window.webkit !== 'undefined' && ua.includes('mobile'));
    }
    
    // send Notification
    static async sendNotification(title, options) {
        if (this.isWebView()) {
            // Inside (WebView) - Show alert within the app
            this.showInAppNotification(title, options.body || options);
            return;
        }
        
        // using Notification API
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        
        var defaultOptions = {
            // icon: '.png', 
            // badge: '.png',
            // vibrate: [200, 100, 200],
            // tag: '', 
            // renotify: true,
            // requireInteraction: false,
            // silent: false
        };
        
        if (typeof options === 'object') {
            Object.assign(defaultOptions, options);
        } else {
            defaultOptions.body = options;
        }
        
        try {
            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                var registration = await navigator.serviceWorker.ready;
                await registration.showNotification(title, defaultOptions);
            } else {
                new Notification(title, defaultOptions);
            }
        } catch (error) {
            console.error('[Notification] Error:', error);
            this.showInAppNotification(title, defaultOptions.body);
        }
    }
    
    // (WebView)
    static showInAppNotification(title, body) {
        if (typeof showToast === 'function') {
            showToast(title + ': ' + body);
        }
        
        // show for console
        console.log('[Notification]', title, body);
    }
    
    // send remamber every day
    static async sendDailyReminder() {
        var settings = StorageManager.getSettings();
        if (!settings.notifications || !settings.dailyReminder) return;
        
        var messages = [
            {
                title: 'تذكير يومي',
                body: 'لا تنسَ قراءة أذكار الصباح لبداية يوم مبارك'
            },
            {
                title: 'رسالة تحفيزية',
                body: 'كل يوم يمر وأنت أقوى.. استمر في رحلة التعافي'
            },
            {
                title: 'تعافي',
                body: 'تذكر أن الله معك في كل خطوة.. لا تيأس'
            }
        ];
        
        var msg = messages[Math.floor(Math.random() * messages.length)];
        await this.sendNotification(msg.title, msg.body);
    }
    
    static scheduleDailyReminder() {
        var self = this;
        
        // Chacking all (1Minutes) = (60s)
        setInterval(function() {
            var now = new Date();
            var settings = StorageManager.getSettings();
            var reminderTime = settings.reminderTime || '08:00';
            var parts = reminderTime.split(':');
            var reminderHour = parseInt(parts[0]);
            var reminderMinute = parseInt(parts[1]);
            
            if (now.getHours() === reminderHour && now.getMinutes() === reminderMinute) {
                self.sendDailyReminder();
            }
        }, 60000);
        
        console.log('[Notification] Daily reminder scheduled for: ' + (StorageManager.getSettings().reminderTime || '08:00'));
    }
}