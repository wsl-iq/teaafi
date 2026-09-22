/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : app.js
 * Type   : JavaScript
 */

var _appStarted = false;

function initApp() {
    if (_appStarted) return;
    _appStarted = true;

    try {
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.init === 'function') {
            StorageManager.init();
        }
        if (typeof UserManager !== 'undefined' && typeof UserManager.init === 'function') {
            UserManager.init();
        }
        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.init === 'function') {
            RecoveryCounter.init();
        }
        if (typeof AchievementsManager !== 'undefined' && typeof AchievementsManager.init === 'function') {
            AchievementsManager.init();
        }
        if (typeof ChallengesManager !== 'undefined' && typeof ChallengesManager.init === 'function') {
            ChallengesManager.init();
        }
    } catch (e) {
        console.error('init error:', e);
    }

    setTimeout(function () {
        var splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('hidden');
            splash.style.display = 'none';
        }

        // Read user data via UserManager (dual persistence)
        var user = null;
        try {
            if (typeof UserManager !== 'undefined' && typeof UserManager.get === 'function') {
                user = UserManager.get();
            } else {
                var d = localStorage.getItem('taafi_user_data');
                if (d) user = JSON.parse(d).value;
            }
        } catch (e) {
            console.warn('Failed to read user data:', e);
        }

        // Simplified check: if user exists with required fields → enter app
        var hasValidUser = false;
        try {
            if (user && user.gender && user.age >= 13 && user.age <= 99) {
                hasValidUser = true;
            }
        } catch (e) {}

        if (hasValidUser) {
            showMainApp();
        } else {
            showWelcome();
        }
    }, 2000);

    window.addEventListener('resize', checkResponsive);
}

function showMainApp() {
    var ws = document.getElementById('welcome-screen');
    var app = document.getElementById('app');

    if (ws) {
        ws.classList.add('hidden');
        ws.style.display = 'none';
    }
    if (app) {
        app.classList.add('visible');
        app.style.display = 'flex';
    }

    if (typeof renderHomePage === 'function') {
        renderHomePage();
    }

    document.querySelectorAll('.nav-item').forEach(function (item) {
        item.classList.remove('active');
        if (item.dataset.page === 'home') {
            item.classList.add('active');
        }
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
        if (link.dataset.page === 'home') {
            link.classList.add('active');
        }
    });

    // Apply saved theme
    try {
        if (typeof ThemesManager !== 'undefined' && typeof ThemesManager.init === 'function') {
            ThemesManager.init();
        }
    } catch (e) {}

    checkResponsive();

    setTimeout(function () {
        if (typeof PermissionsManager !== 'undefined' &&
            typeof PermissionsManager.showPermissionModal === 'function') {
            PermissionsManager.showPermissionModal();
        }
    }, 3000);
}

function showWelcome() {
    var app = document.getElementById('app');
    var ws = document.getElementById('welcome-screen');
    if (app) {
        app.classList.remove('visible');
        app.style.display = 'none';
    }
    if (ws) {
        ws.classList.remove('hidden');
        ws.style.display = 'flex';
    }

    // Initialize welcome screen (populate dynamic lists)
    if (typeof welcomeInitUI === 'function') {
        welcomeInitUI();
    } else if (typeof welcomeReset === 'function') {
        welcomeReset();
    }
}

function checkResponsive() {
    var w = window.innerWidth;
    var s = document.getElementById('sidebar');
    var b = document.getElementById('bottom-nav');
    if (w >= 1024) {
        if (s) s.style.display = 'flex';
        if (b) b.style.display = 'none';
    } else {
        if (s) s.style.display = 'none';
        if (b) b.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(initApp, 100);
});