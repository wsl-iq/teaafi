/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : backup.js
 * Type: JavaScript
 */

var BackupManager = {
    exportData: function() {
        try {
            var data = {
                version: '1.1.2',
                exportDate: new Date().toISOString(),
                user: StorageManager.getUser(),
                recovery: StorageManager.getRecoveryData(),
                settings: StorageManager.getSettings(),
                tasbih: StorageManager.get('tasbih_data'),
                rating: StorageManager.get('app_rating_value'),
                ratingMessage: StorageManager.get('app_rating_message'),
                achievements: StorageManager.get('achievements'),
                habitsHistory: StorageManager.get('habits_history')
            };
            
            var json = JSON.stringify(data, null, 2);
            var blob = new Blob([json], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'taeafi-backup-' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (typeof showToast === 'function') {
                showToast('تم تصدير البيانات بنجاح');
            }
            return true;
        } catch (e) {
            console.error('[Backup] Export failed:', e);
            if (typeof showToast === 'function') {
                showToast('فشل تصدير البيانات');
            }
            return false;
        }
    },
    
    importData: function(jsonString) {
        try {
            var data = JSON.parse(jsonString);
            
            if (!data.version) {
                throw new Error('ملف غير صالح');
            }
            
            if (data.user) StorageManager.saveUser(data.user);
            if (data.recovery) StorageManager.saveRecoveryData(data.recovery);
            if (data.settings) StorageManager.saveSettings(data.settings);
            if (data.tasbih) StorageManager.set('tasbih_data', data.tasbih);
            if (data.rating) StorageManager.set('app_rating_value', data.rating);
            if (data.ratingMessage) StorageManager.set('app_rating_message', data.ratingMessage);
            if (data.achievements) StorageManager.set('achievements', data.achievements);
            if (data.habitsHistory) StorageManager.set('habits_history', data.habitsHistory);
            
            if (typeof showToast === 'function') {
                showToast('تم استيراد البيانات بنجاح');
            }
            
            setTimeout(function() { location.reload(); }, 1500);
            return true;
        } catch (e) {
            console.error('[Backup] Import failed:', e);
            if (typeof showToast === 'function') {
                showToast('فشل استيراد البيانات - تأكد من الملف');
            }
            return false;
        }
    },
    
    showExportDialog: function() {
        if (confirm('هل تريد تصدير جميع بياناتك؟\n\nسيتم حفظ: الإعدادات، تقدم التعافي، التسبيح، الإنجازات')) {
            this.exportData();
        }
    },
    
    showImportDialog: function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(e) {
            var file = e.target.files[0];
            if (!file) return;
            
            var reader = new FileReader();
            reader.onload = function(event) {
                if (confirm('سيتم استبدال جميع بياناتك الحالية. هل أنت متأكد؟')) {
                    BackupManager.importData(event.target.result);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
};