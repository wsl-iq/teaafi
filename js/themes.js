var ThemesManager = {
    themes: {
        green:   { id: 'green',   name: 'الأخضر',        icon: 'fa-leaf',              color: '#0D6B6E' },
        pink:    { id: 'pink',    name: 'الوردي',       icon: 'fa-heart',             color: '#E91E63' },
        desert:  { id: 'desert',  name: 'الصحراوي',     icon: 'fa-sun',               color: '#BF360C' },
        ocean:   { id: 'ocean',   name: 'المحيط',       icon: 'fa-water',             color: '#01579B' },
        ramadan: { id: 'ramadan', name: 'الرمضاني',     icon: 'fa-star-and-crescent', color: '#4A148C' }
    },
    currentTheme: 'green',
    isDarkMode: false,
    isAutoMode: false,

    init: function() {
        var raw = localStorage.getItem('taafi_settings');
        if (raw) {
            try { var d = JSON.parse(raw); var s = d.value || d;
                this.currentTheme = s.theme || 'green';
                this.isDarkMode = s.darkMode === true;
                this.isAutoMode = s.darkModeAuto === true;
            } catch(e) {}
        }
        this._apply();
    },

    _cancelAll: function() {
        this.isDarkMode = false;
        this.isAutoMode = false;
        StorageManager.set('night_mode_schedule', false);
        stopNightModeScheduler();
    },

    setTheme: function(id) {
        if (!this.themes[id]) return;
        this.currentTheme = id;
        this._apply(); this._save();
        if (typeof showToast === 'function') showToast(this.themes[id].name);
        if (typeof renderSettingsPage === 'function') renderSettingsPage();
    },

    setDark: function(on) {
        this.isDarkMode = on;
        this.isAutoMode = false;
        // Cancal Light mod
        StorageManager.set('night_mode_schedule', false);
        stopNightModeScheduler();
        
        this._apply(); this._save();
        if (typeof showToast === 'function') showToast(on ? 'الوضع الداكن' : 'الوضع الفاتح');
        if (typeof renderSettingsPage === 'function') renderSettingsPage();
    },

    setDarkAuto: function() {
        this.isAutoMode = true;
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        // // Cancal Light mod
        StorageManager.set('night_mode_schedule', false);
        stopNightModeScheduler();
        
        this._apply(); this._save();
        if (typeof showToast === 'function') showToast('الوضع التلقائي');
        if (typeof renderSettingsPage === 'function') renderSettingsPage();
    },

    _apply: function() {
        var body = document.body;
        Object.keys(this.themes).forEach(function(t) { body.classList.remove('theme-' + t); });
        body.classList.remove('theme-dark');
        body.classList.add('theme-' + this.currentTheme);
        if (this.isDarkMode) body.classList.add('theme-dark');
        var r = document.documentElement;
        r.style.setProperty('--surface', this.isDarkMode ? '#1E1E1E' : '#FFFFFF');
        r.style.setProperty('--background', this.isDarkMode ? '#121212' : '#F0F2F5');
        r.style.setProperty('--text-primary', this.isDarkMode ? '#E0E0E0' : '#1A1C1E');
    },

    _save: function() {
        var raw = localStorage.getItem('taafi_settings'), s = {};
        if (raw) { try { var d = JSON.parse(raw); s = d.value || d; } catch(e) {} }
        s.theme = this.currentTheme;
        s.darkMode = this.isDarkMode;
        s.darkModeAuto = this.isAutoMode;
        s.night_mode_schedule = StorageManager.get('night_mode_schedule') || false;
        localStorage.setItem('taafi_settings', JSON.stringify({ value: s, timestamp: Date.now() }));
    },

    getCurrent: function() { return this.currentTheme; },
    isDark: function() { return this.isDarkMode; },
    isAuto: function() { return this.isAutoMode; }
};

// Night Mode
var nightModeInterval = null;

function toggleNightModeSchedule() {
    var cur = StorageManager.get('night_mode_schedule') || false;
    var newVal = !cur;
    
    StorageManager.set('night_mode_schedule', newVal);
    
    if (newVal) {
        // Cansal Anyway
        ThemesManager.isDarkMode = false;
        ThemesManager.isAutoMode = false;
        ThemesManager.isDarkMode = false;  // Okay
        
        startNightModeScheduler();
        checkNightMode();
        if (typeof showToast === 'function') showToast('تم تفعيل الوضع الليلي');
    } else {
        stopNightModeScheduler();
        document.body.classList.remove('theme-dark');
        if (typeof showToast === 'function') showToast('تم إلغاء الوضع الليلي');
    }
    
    // Save all thing
    var raw = localStorage.getItem('taafi_settings'), s = {};
    if (raw) { try { var d = JSON.parse(raw); s = d.value || d; } catch(e) {} }
    s.darkMode = false;
    s.darkModeAuto = false;
    s.night_mode_schedule = newVal;
    localStorage.setItem('taafi_settings', JSON.stringify({ value: s, timestamp: Date.now() }));
    
    if (typeof renderSettingsPage === 'function') renderSettingsPage();
}

function startNightModeScheduler() { stopNightModeScheduler(); checkNightMode(); nightModeInterval = setInterval(checkNightMode, 60000); }
function stopNightModeScheduler() { if (nightModeInterval) { clearInterval(nightModeInterval); nightModeInterval = null; } }

// if (StorageManager.get('night_mode_schedule')) startNightModeScheduler();
// if Time day from 6:00 AM to 7:00 PM == Light Mode
// if Time day from 7:00 PM to 6:00 AM == Dark Mode
// ChackNightMode function to check the time and apply the theme accordingly

function checkNightMode() {
    if (!StorageManager.get('night_mode_schedule')) return;
    
    var hours = new Date().getHours();
    var isNight = (hours >= 19 || hours < 6);
    var body = document.body;
    var root = document.documentElement;
    
    if (isNight) {
        // Trun on dark mode
        body.classList.add('theme-dark');
        root.style.setProperty('--surface', '#1E1E1E');
        root.style.setProperty('--background', '#121212');
        root.style.setProperty('--text-primary', '#E0E0E0');
    } else {
        // Trun off dark mode
        body.classList.remove('theme-dark');
        root.style.setProperty('--surface', '#FFFFFF');
        root.style.setProperty('--background', '#F0F2F5');
        root.style.setProperty('--text-primary', '#1A1C1E');
    }
}

if (StorageManager.get('night_mode_schedule')) startNightModeScheduler();

// Init
document.addEventListener('DOMContentLoaded', function() { setTimeout(ThemesManager.init.bind(ThemesManager), 300); });

// Compat
// Apply (dark) & (light) mod and save in storage manager
function applyTheme(t) { if (t==='dark') ThemesManager.setDark(true); else if (t==='light') ThemesManager.setDark(false); else if (t==='auto') ThemesManager.setDarkAuto(); else if (ThemesManager.themes[t]) ThemesManager.setTheme(t); }
function switchTheme(t) { applyTheme(t); }

ThemesManager.isNightMode = function() {
    return StorageManager.get('night_mode_schedule') === true;
};