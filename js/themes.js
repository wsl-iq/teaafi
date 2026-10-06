/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : themes.js
 * Type: JavaScript
 */

var ThemesManager = {
    themes: {
        green:   { id: 'green',   name: 'الأخضر',        icon: 'fa-leaf',              color: '#0D6B6E' },
        pink:    { id: 'pink',    name: 'الوردي',       icon: 'fa-heart',             color: '#E91E63' },
        desert:  { id: 'desert',  name: 'الصحراوي',     icon: 'fa-sun',               color: '#BF360C' },
        ocean:   { id: 'ocean',   name: 'المحيط',       icon: 'fa-water',             color: '#01579B' },
        ramadan: { id: 'ramadan', name: 'الرمضاني',     icon: 'fa-star-and-crescent', color: '#4A148C' },
        custom:  { id: 'custom',  name: 'مخصص', icon: 'fa-palette', color: '#7C4DFF' }
    },
    currentTheme: 'green',
    isDarkMode: false,
    isAutoMode: false,

    /* Default palette for the custom theme */
    _defaultCustom: {
        primary:   '#7C4DFF',
        secondary: '#B388FF',
        dark:      false
    },

    /*
     * INIT
     **/

    init: function() {
        var raw = localStorage.getItem('taafi_settings');
        if (raw) {
            try {
                var d = JSON.parse(raw);
                var s = d.value || d;
                this.currentTheme = s.theme || 'green'; // Default to green if not set
                this.isDarkMode = s.darkMode === true;
                this.isAutoMode = s.darkModeAuto === true;

                // If custom theme is active, apply its colors + dark flag
                if (this.currentTheme === 'custom') {
                    var custom = this._loadCustom();
                    this.isDarkMode = custom.dark;
                    this._applyCustom(custom);
                }
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

    /*
     * THEME SETTERS
     **/

    setTheme: function(id) {
        if (!this.themes[id]) return;
        this.currentTheme = id;

        if (id === 'custom') {
            var custom = this._loadCustom();
            this.isDarkMode = custom.dark;
            this.isAutoMode = false;
            this._applyCustom(custom);
        }

        this._apply();
        this._save();

        if (typeof showToast === 'function') showToast(this.themes[id].name);
        if (typeof renderSettingsPage === 'function') renderSettingsPage();
    },

    setDark: function(on) {
        // If custom theme is active, redirect to custom dark
        if (this.currentTheme === 'custom') {
            this.setCustomDark(on);
            return;
        }

        this.isDarkMode = on;
        this.isAutoMode = false;
        StorageManager.set('night_mode_schedule', false);
        stopNightModeScheduler();

        this._apply();
        this._save();

        if (typeof showToast === 'function') showToast(on ? 'الوضع الداكن' : 'الوضع الفاتح');
        if (typeof renderSettingsPage === 'function') renderSettingsPage();
    },

    setDarkAuto: function() {
        this.isAutoMode = true;
        this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        StorageManager.set('night_mode_schedule', false);
        stopNightModeScheduler();

        this._apply();
        this._save();

        if (typeof showToast === 'function') showToast('الوضع التلقائي');
        if (typeof renderSettingsPage === 'function') renderSettingsPage();
    },

    /*
     * CUSTOM THEME
     **/

    _loadCustom: function() {
        var saved = StorageManager.get('custom_theme') || null;
        return {
            primary:   (saved && saved.primary)   || this._defaultCustom.primary,
            secondary: (saved && saved.secondary) || this._defaultCustom.secondary,
            dark:      (saved && typeof saved.dark === 'boolean') ? saved.dark : this._defaultCustom.dark
        };
    },

    _saveCustom: function(data) {
        StorageManager.set('custom_theme', {
            primary:   data.primary,
            secondary: data.secondary,
            dark:      !!data.dark
        });
    },

    /**
     * Derive a darker shade of a hex color.
     */

    _darken: function(hex, amount) {
        hex = String(hex).replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(function(c) { return c + c; }).join('');
        }
        var num = parseInt(hex, 16);
        var r = Math.max(0, ((num >> 16) & 255) - amount);
        var g = Math.max(0, ((num >> 8) & 255) - amount);
        var b = Math.max(0, (num & 255) - amount);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    /**
     * Derive a very light tint of a hex color (for primary-light).
     */

    _tint: function(hex, amount) {
        hex = String(hex).replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(function(c) { return c + c; }).join('');
        }
        var num = parseInt(hex, 16);
        var r = Math.min(255, ((num >> 16) & 255) + amount);
        var g = Math.min(255, ((num >> 8) & 255) + amount);
        var b = Math.min(255, (num & 255) + amount);
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },

    _hexToRgb: function(hex) {
        hex = String(hex).replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(function(c) { return c + c; }).join('');
        }
        var num = parseInt(hex, 16);
        return ((num >> 16) & 255) + ', ' + ((num >> 8) & 255) + ', ' + (num & 255);
    },

    /**
     * Apply the custom theme CSS variables to the document root.
     */
    _applyCustom: function(data) {
        var root = document.documentElement;

        var primaryDark  = this._darken(data.primary, 40);
        var primaryLight = data.dark
            ? this._darken(data.primary, -60)   // dark theme: very dark tint
            : this._tint(data.primary, 200);    // light theme: very light tint

        root.style.setProperty('--custom-primary',       data.primary);
        root.style.setProperty('--custom-primary-dark',  primaryDark);
        root.style.setProperty('--custom-primary-light', primaryLight);
        root.style.setProperty('--custom-secondary',     data.secondary);
        root.style.setProperty('--custom-primary-rgb',   this._hexToRgb(data.primary));
    },

    setCustomColor: function(primary, secondary) {
        var data = this._loadCustom();
        if (primary)   data.primary = primary;
        if (secondary) data.secondary = secondary;
        this._saveCustom(data);

        this.currentTheme = 'custom';
        this.isDarkMode = data.dark;
        this.isAutoMode = false;
        StorageManager.set('night_mode_schedule', false);
        stopNightModeScheduler();

        this._applyCustom(data);
        this._apply();
        this._save();

        if (typeof showToast === 'function') {
            showToast('تم تطبيق الثيم المخصص');
        }
        if (typeof renderSettingsPage === 'function') {
            renderSettingsPage();
        }
    },

    setCustomDark: function(dark) {
        var data = this._loadCustom();
        data.dark = !!dark;
        this._saveCustom(data);

        this.currentTheme = 'custom';
        this.isDarkMode = data.dark;
        this.isAutoMode = false;
        StorageManager.set('night_mode_schedule', false);
        stopNightModeScheduler();

        this._applyCustom(data);
        this._apply();
        this._save();

        if (typeof renderSettingsPage === 'function') {
            renderSettingsPage();
        }
    },

    getCustomTheme: function() {
        return this._loadCustom();
    },

    resetCustomTheme: function() {
        StorageManager.remove('custom_theme');
        this._applyCustom(this._defaultCustom);
        if (this.currentTheme === 'custom') {
            this._apply();
        }
        if (typeof showToast === 'function') {
            showToast('تم إعادة تعيين الثيم المخصص');
        }
        if (typeof renderSettingsPage === 'function') {
            renderSettingsPage();
        }
    },

    /*
     * APPLY + SAVE
     **/

    _apply: function() {
        var body = document.body;
        var root = document.documentElement;

        // Remove all theme classes
        Object.keys(this.themes).forEach(function(t) {
            body.classList.remove('theme-' + t);
        });
        body.classList.remove('theme-dark');

        // Apply custom CSS variables first if needed
        if (this.currentTheme === 'custom') {
            var custom = this._loadCustom();
            this._applyCustom(custom);
        }

        // Add the theme class
        body.classList.add('theme-' + this.currentTheme);

        // Dark mode handling
        var darkActive = this.isDarkMode;
        if (this.currentTheme === 'custom') {
            darkActive = this._loadCustom().dark;
        }
        if (darkActive) {
            body.classList.add('theme-dark');
        }

        // Base surface variables for non-themed keys
        root.style.setProperty('--surface', darkActive ? '#1E1E1E' : '#FFFFFF');
        root.style.setProperty('--background', darkActive ? '#121212' : '#F0F2F5');
        root.style.setProperty('--text-primary', darkActive ? '#E0E0E0' : '#1A1C1E');
    },

    _save: function() {
        var raw = localStorage.getItem('taafi_settings'), s = {};
        if (raw) {
            try {
                var d = JSON.parse(raw);
                s = d.value || d;
            } catch(e) {}
        }
        s.theme = this.currentTheme;
        s.darkMode = this.isDarkMode;
        s.darkModeAuto = this.isAutoMode;
        s.night_mode_schedule = StorageManager.get('night_mode_schedule') || false;
        localStorage.setItem('taafi_settings', JSON.stringify({ value: s, timestamp: Date.now() }));
    },

    getCurrent: function() { return this.currentTheme; },
    isDark: function() {
        if (this.currentTheme === 'custom') {
            return this._loadCustom().dark;
        }
        return this.isDarkMode;
    },
    isAuto: function() { return this.isAutoMode; }
};

// Night Mode
var nightModeInterval = null;
function toggleNightModeSchedule() {
    var cur = StorageManager.get('night_mode_schedule') || false;
    var newVal = !cur;

    StorageManager.set('night_mode_schedule', newVal);

    if (newVal) {
        ThemesManager.isDarkMode = false;
        ThemesManager.isAutoMode = false;
        ThemesManager.isDarkMode = false;

        startNightModeScheduler();
        checkNightMode();
        if (typeof showToast === 'function') showToast('تم تفعيل الوضع الليلي');
    } else {
        stopNightModeScheduler();
        document.body.classList.remove('theme-dark');
        if (typeof showToast === 'function') showToast('تم إلغاء الوضع الليلي');
    }

    var raw = localStorage.getItem('taafi_settings'), s = {};
    if (raw) {
        try {
            var d = JSON.parse(raw);
            s = d.value || d;
        } catch(e) {}
    }
    s.darkMode = false;
    s.darkModeAuto = false;
    s.night_mode_schedule = newVal;
    localStorage.setItem('taafi_settings', JSON.stringify({ value: s, timestamp: Date.now() }));

    if (typeof renderSettingsPage === 'function') renderSettingsPage();
}

function startNightModeScheduler() {
    stopNightModeScheduler();
    checkNightMode();
    nightModeInterval = setInterval(checkNightMode, 60000);
}

function stopNightModeScheduler() {
    if (nightModeInterval) {
        clearInterval(nightModeInterval);
        nightModeInterval = null;
    }
}

function checkNightMode() {
    if (!StorageManager.get('night_mode_schedule')) return;

    var hours = new Date().getHours();
    var isNight = (hours >= 19 || hours < 6);
    var body = document.body;
    var root = document.documentElement;

    if (isNight) {
        body.classList.add('theme-dark');
        root.style.setProperty('--surface', '#1E1E1E');
        root.style.setProperty('--background', '#121212');
        root.style.setProperty('--text-primary', '#E0E0E0');
    } else {
        body.classList.remove('theme-dark');
        root.style.setProperty('--surface', '#FFFFFF');
        root.style.setProperty('--background', '#F0F2F5');
        root.style.setProperty('--text-primary', '#1A1C1E');
    }
}

if (StorageManager.get('night_mode_schedule')) startNightModeScheduler();

// Init

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(ThemesManager.init.bind(ThemesManager), 300);
});

// Compat
function applyTheme(t) {
    if (t === 'dark') ThemesManager.setDark(true);
    else if (t === 'light') ThemesManager.setDark(false);
    else if (t === 'auto') ThemesManager.setDarkAuto();
    else if (ThemesManager.themes[t]) ThemesManager.setTheme(t);
}
function switchTheme(t) { applyTheme(t); }
ThemesManager.isNightMode = function() {
    return StorageManager.get('night_mode_schedule') === true;
};