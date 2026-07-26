class NotificationService {
    static async sendNotification(title, options = {}) {
        if (!('Notification' in window)) return;
        if (Notification.permission !== 'granted') return;
        
        const defaultOptions = {
            icon: '/assets/icons/icon-192.png',
            badge: '/assets/icons/icon-72.png',
            vibrate: [200, 100, 200],
            tag: 'taafi-reminder',
            renotify: true,
            requireInteraction: false,
            silent: false,
            ...options
        };
        
        try {
            const registration = await navigator.serviceWorker?.ready;
            if (registration) {
                await registration.showNotification(title, defaultOptions);
            } else {
                new Notification(title, defaultOptions);
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    }
    
    static async sendDailyReminder() {
        const settings = StorageManager.getSettings();
        if (!settings.notifications || !settings.dailyReminder) return;
        
        const messages = [
            {
                title: 'تذكير يومي',
                body: 'لا تنسَ قراءة أذكار الصباح لبداية يوم مبارك',
                icon: '/assets/icons/icon-192.png'
            },
            {
                title: 'رسالة تحفيزية',
                body: 'كل يوم يمر وأنت أقوى.. استمر في رحلة التعافي',
                icon: '/assets/icons/icon-192.png'
            },
            {
                title: 'تعافي',
                body: 'تذكر أن الله معك في كل خطوة.. لا تيأس',
                icon: '/assets/icons/icon-192.png'
            }
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        await this.sendNotification(randomMessage.title, {
            body: randomMessage.body,
            icon: randomMessage.icon
        });
    }
    
    static scheduleDailyReminder() {
        // Check every hour if it's time to send reminder
        setInterval(() => {
            const now = new Date();
            const settings = StorageManager.getSettings();
            const [hours, minutes] = settings.reminderTime.split(':');
            
            if (now.getHours() === parseInt(hours) && 
                now.getMinutes() === parseInt(minutes)) {
                this.sendDailyReminder();
            }
        }, 60000); // Check every minute
    }
}