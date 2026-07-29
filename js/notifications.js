class NotificationService {
    static isWebView() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.includes('wv') || 
               ua.includes('webview') || 
               (window.Android && typeof window.Android !== 'undefined') ||
               (typeof window.webkit !== 'undefined' && ua.includes('mobile'));
    }
    
    // إرسال إشعار
    static async sendNotification(title, options) {
        if (this.isWebView()) {
            // داخل WebView - إظهار تنبيه داخل التطبيق
            this.showInAppNotification(title, options.body || options);
            return;
        }
        
        // متصفح عادي - استخدام Notification API
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        
        var defaultOptions = {
            icon: '/assets/icons/icon-192.png',
            badge: '/assets/icons/icon-72.png',
            vibrate: [200, 100, 200],
            tag: 'taafi-reminder',
            renotify: true,
            requireInteraction: false,
            silent: false
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
    
    // إظهار تنبيه داخل التطبيق (لـ WebView)
    static showInAppNotification(title, body) {
        if (typeof showToast === 'function') {
            showToast(title + ': ' + body);
        }
        
        // أيضاً إظهار كـ console
        console.log('[Notification]', title, body);
    }
    
    // إرسال تذكير يومي
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
    
    // جدولة التذكير اليومي
    static scheduleDailyReminder() {
        var self = this;
        
        // فحص كل دقيقة
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