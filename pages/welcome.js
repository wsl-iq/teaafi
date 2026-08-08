/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : Pages
 * File   : welcome.js
 * Type: JavaScript
 */

let selectedGender = null;

function showWelcomeScreen() {
    try {
        var welcomeScreen = document.getElementById('welcome-screen');
        var app = document.getElementById('app');
        if (!welcomeScreen || !app) return;
        welcomeScreen.classList.remove('hidden');
        welcomeScreen.style.display = 'flex';
        app.classList.remove('visible');
        app.style.display = 'none';
        resetWelcomeSlides();
    } catch (e) { console.error('showWelcomeScreen:', e); }
}

function hideWelcomeScreen() {
    try {
        var welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) { welcomeScreen.classList.add('hidden'); welcomeScreen.style.display = 'none'; }
    } catch (e) { console.error('hideWelcomeScreen:', e); }
}

function nextSlide(n) {
    try {
        var cur = document.querySelector('.welcome-slide.active');
        var next = document.querySelector('[data-slide="' + n + '"]');
        if (!cur || !next) return;
        cur.classList.remove('active');
        next.classList.add('active');
        updateProgressSteps(n);
    } catch (e) { console.error('nextSlide:', e); }
}

function prevSlide(n) { nextSlide(n); }

function updateProgressSteps(step) {
    try {
        document.querySelectorAll('.progress-step').forEach(function(el) {
            var s = parseInt(el.dataset.step);
            el.classList.remove('active', 'completed');
            if (s === step) el.classList.add('active');
            if (s < step) el.classList.add('completed');
        });
    } catch (e) { console.error('updateProgressSteps:', e); }
}

function resetWelcomeSlides() {
    try {
        document.querySelectorAll('.welcome-slide').forEach(function(slide, i) {
            slide.classList.remove('active');
            if (i === 0) slide.classList.add('active');
        });
        updateProgressSteps(1);
        selectedGender = null;
        var gi = document.getElementById('user-gender'); if (gi) gi.value = '';
        document.querySelectorAll('.gender-option').forEach(function(o) { o.classList.remove('selected'); });
        var ni = document.getElementById('user-name'); if (ni) ni.value = '';
        var ai = document.getElementById('user-age'); if (ai) ai.value = '';
        var nb = document.getElementById('name-next-btn'); if (nb) nb.disabled = true;
        var ab = document.getElementById('age-next-btn'); if (ab) ab.disabled = true;
        var sb = document.getElementById('start-btn'); if (sb) sb.disabled = true;
    } catch (e) { console.error('resetWelcomeSlides:', e); }
}

function selectGender(gender) {
    try {
        selectedGender = gender;
        var gi = document.getElementById('user-gender'); if (gi) gi.value = gender;
        document.querySelectorAll('.gender-option').forEach(function(o) {
            o.classList.remove('selected');
            if (o.dataset.gender === gender) o.classList.add('selected');
        });
        var sb = document.getElementById('start-btn'); if (sb) sb.disabled = false;
    } catch (e) { console.error('selectGender:', e); }
}

// Event Listeners
(function() {
    var ni = document.getElementById('user-name');
    var ai = document.getElementById('user-age');
    if (ni) { ni.addEventListener('input', function(e) { var b = document.getElementById('name-next-btn'); if (b) b.disabled = !e.target.value.trim(); }); }
    if (ai) { ai.addEventListener('input', function(e) { var a = parseInt(e.target.value); var b = document.getElementById('age-next-btn'); if (b) b.disabled = !a || a < 10 || a > 100; }); }
})();

// function input information login
function completeWelcome() {
    var nameEl = document.getElementById('user-name');
    var ageEl = document.getElementById('user-age');
    var genderEl = document.getElementById('user-gender');
    var welcomeScreen = document.getElementById('welcome-screen');
    var app = document.getElementById('app');
    var startBtn = document.getElementById('start-btn');
    
    if (!nameEl || !ageEl || !genderEl || !welcomeScreen || !app) return;
    
    var name = nameEl.value.trim();
    var age = parseInt(ageEl.value);
    var gender = genderEl.value;
    
    if (!name || !age || !gender) { if (typeof showToast === 'function') showToast('يرجى إكمال جميع الحقول'); return; }
    
    if (startBtn) { startBtn.disabled = true; startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...'; }
    
    // حفظ البيانات
    localStorage.setItem('taafi_user_data', JSON.stringify({ value: { name: name, age: age, gender: gender, createdAt: new Date().toISOString() }, timestamp: Date.now() }));
    
    // حفظ البيانات في IndexedDB
    if (typeof DBManager !== 'undefined' && typeof DBManager.saveUserData === 'function') {
        DBManager.saveUserData({ name: name, age: age, gender: gender });
        // console.log('User data saved to IndexedDB');
    }
    // DataBase.db

    // ✅ إعادة تعيين إعدادات الإشعارات لمستخدم جديد
    localStorage.setItem('taafi_settings', JSON.stringify({
        value: {
            notifications: false,
            dailyReminder: true,
            theme: 'light',
            notificationPermissionAsked: false,
            notificationPermissionGranted: false
        },
        timestamp: Date.now()
    }));
    
    // إخفاء شاشة الترحيب
    welcomeScreen.classList.add('hidden');
    welcomeScreen.style.display = 'none';
    
    // إظهار التطبيق
    app.classList.add('visible');
    app.style.display = 'flex';
    
    // إعادة تهيئة StorageManager
    if (typeof StorageManager !== 'undefined' && typeof StorageManager.init === 'function') StorageManager.init();
    
    // تحميل الصفحة الرئيسية
    if (typeof navigateTo === 'function') { navigateTo('home'); }
    else if (typeof renderHomePage === 'function') { renderHomePage(); }
    
    // تطبيق المظهر
    try { var sd = localStorage.getItem('taafi_settings'); if (sd) { var s = JSON.parse(sd); var t = (s.value && s.value.theme) || 'light'; if (typeof applyTheme === 'function') applyTheme(t); } } catch (e) {}
    
    // تحديث التصميم
    var w = window.innerWidth;
    var sidebar = document.getElementById('sidebar');
    var bottomNav = document.getElementById('bottom-nav');
    if (w >= 1024) { if (sidebar) sidebar.style.display = 'flex'; if (bottomNav) bottomNav.style.display = 'none'; }
    else { if (sidebar) sidebar.style.display = 'none'; if (bottomNav) bottomNav.style.display = 'flex'; }
    
    // رسالة ترحيب
    if (typeof showToast === 'function') showToast('مرحباً بك ' + name + '! 🌿');
    
    // ✅ طلب الإشعارات لمستخدم جديد
    setTimeout(function() {
        if (typeof PermissionsManager !== 'undefined' && typeof PermissionsManager.showPermissionModal === 'function') {
            // إظهار النافذة مباشرة للمستخدم الجديد
            var modal = document.getElementById('permission-modal');
            if (modal) modal.classList.remove('hidden');
        }
    }, 3000);
    
    if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> ابدأ الرحلة';
}