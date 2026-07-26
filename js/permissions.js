class PermissionsManager {
    static async checkNotificationPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        return Notification.permission;
    }
    
    static async requestNotificationPermission() {
        if (!('Notification' in window)) {
            return 'unsupported';
        }
        
        try {
            const permission = await Notification.requestPermission();
            
            // حفظ حالة الصلاحية في التخزين المحلي
            if (permission === 'granted') {
                StorageManager.saveSettings({
                    ...StorageManager.getSettings(),
                    notifications: true,
                    notificationPermissionAsked: true,
                    notificationPermissionGranted: true
                });
            } else if (permission === 'denied') {
                StorageManager.saveSettings({
                    ...StorageManager.getSettings(),
                    notifications: false,
                    notificationPermissionAsked: true,
                    notificationPermissionGranted: false
                });
            }
            
            return permission;
        } catch (error) {
            console.error('Notification permission error:', error);
            return 'denied';
        }
    }
    
    static async showPermissionModal() {
        const modal = document.getElementById('permission-modal');
        if (!modal) return;
        
        // التحقق إذا كان قد تم سؤال المستخدم مسبقاً
        const settings = StorageManager.getSettings();
        const permission = await this.checkNotificationPermission();
        
        // لا تظهر النافذة إذا:
        // 1. تم منح الصلاحية بالفعل
        // 2. تم رفض الصلاحية بالفعل
        // 3. تم سؤال المستخدم مسبقاً وحفظت إجابته
        if (permission === 'granted' || 
            permission === 'denied' || 
            settings.notificationPermissionAsked === true) {
            // لا تظهر النافذة
            return;
        }
        
        // إظهار النافذة فقط إذا لم يتم السؤال مسبقاً
        if (permission === 'default') {
            modal.classList.remove('hidden');
        }
    }
    
    static hidePermissionModal() {
        const modal = document.getElementById('permission-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

async function requestPermissions() {
    const permission = await PermissionsManager.requestNotificationPermission();
    PermissionsManager.hidePermissionModal();
    
    if (permission === 'granted') {
        showToast('تم تفعيل الإشعارات بنجاح - لن يطلب منك مرة أخرى');
    } else if (permission === 'denied') {
        showToast('تم رفض الإشعارات - يمكنك تغيير الإعدادات من المتصفح');
    } else {
        showToast('يمكنك تفعيل الإشعارات لاحقاً من الإعدادات');
    }
}

function declinePermissions() {
    PermissionsManager.hidePermissionModal();
    
    // حفظ أن المستخدم رفض الطلب حتى لا يتكرر
    StorageManager.saveSettings({
        ...StorageManager.getSettings(),
        notifications: false,
        notificationPermissionAsked: true,
        notificationPermissionGranted: false
    });
    
    showToast('يمكنك تفعيل الإشعارات لاحقاً من الإعدادات');
}