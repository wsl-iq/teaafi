/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : permissions.js
 * Type: JavaScript
 */

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
            
            // Preserving local storage privileges
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
        
        // Check if the user has been asked before
        const settings = StorageManager.getSettings();
        const permission = await this.checkNotificationPermission();
        
        /** The window will not appear if:
         1. Permission has already been granted
         2. Permission has already been denied
         3. The user has already been asked and their answer saved */

        if (permission === 'granted' || 
            permission === 'denied' || 
            settings.notificationPermissionAsked === true) {
            return;
        }
        
        // The window will only be displayed if no prior request has been made.
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

// Note that the user has rejected the request to prevent repetition
// Do not ask again unless a request is made.

function declinePermissions() {
    PermissionsManager.hidePermissionModal();
    StorageManager.saveSettings({
        ...StorageManager.getSettings(),
        notifications: false,
        notificationPermissionAsked: true,
        notificationPermissionGranted: false
    });
    showToast('يمكنك تفعيل الإشعارات لاحقاً من الإعدادات');
}