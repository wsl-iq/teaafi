/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : app.js
 * Type: JavaScript
 */

var _appStarted = false;

function initApp() {
    if (_appStarted) return;
    _appStarted = true;
    
    try {
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.init === 'function') StorageManager.init();
        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.init === 'function') RecoveryCounter.init();
    } catch (e) { console.error('init error:', e); }
    
    setTimeout(function() {
        var splash = document.getElementById('splash-screen');
        if (splash) { splash.classList.add('hidden'); splash.style.display = 'none'; }
        
        var user = null;
        try { var d = localStorage.getItem('taafi_user_data'); if (d) user = JSON.parse(d).value; } catch (e) {}
        
        if (user) { showMainApp(); } else { showWelcome(); }
    }, 2000);
    
    window.addEventListener('resize', checkResponsive);
}

function showMainApp() {
    var ws = document.getElementById('welcome-screen');
    var app = document.getElementById('app');
    if (ws) { ws.classList.add('hidden'); ws.style.display = 'none'; }
    if (app) { app.classList.add('visible'); app.style.display = 'flex'; }
    if (typeof navigateTo === 'function') navigateTo('home');
    try { var sd = localStorage.getItem('taafi_settings'); if (sd) { var s = JSON.parse(sd); var t = (s.value && s.value.theme) || 'light'; if (typeof applyTheme === 'function') applyTheme(t); } } catch (e) {}
    checkResponsive();
    
    // ✅ طلب الإشعارات للمستخدمين القدامى (إذا لم يسبق لهم الموافقة)
    setTimeout(function() {
        if (typeof PermissionsManager !== 'undefined' && typeof PermissionsManager.showPermissionModal === 'function') {
            PermissionsManager.showPermissionModal();
        }
    }, 3000);
}

function showWelcome() {
    var app = document.getElementById('app');
    var ws = document.getElementById('welcome-screen');
    if (app) { app.classList.remove('visible'); app.style.display = 'none'; }
    if (ws) { ws.classList.remove('hidden'); ws.style.display = 'flex'; }
    if (typeof resetWelcomeSlides === 'function') resetWelcomeSlides();
}

function checkResponsive() {
    var w = window.innerWidth;
    var s = document.getElementById('sidebar');
    var b = document.getElementById('bottom-nav');
    if (w >= 1024) { if (s) s.style.display = 'flex'; if (b) b.style.display = 'none'; }
    else { if (s) s.style.display = 'none'; if (b) b.style.display = 'flex'; }
}

document.addEventListener('DOMContentLoaded', function() { setTimeout(initApp, 100); });

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function() { console.log('SW ok'); }).catch(function() {});
    });
}