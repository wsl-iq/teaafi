/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : app-lock.js
 * Type: JavaScript
 */

var AppLock = {
    isLocked: false,
    pin: null,
    attempts: 0,
    maxAttempts: 5,
    recoveryCode: 'Taeafi0x10000',
    inputPin: '',
    showPin: false,
    
    init: function() {
        var settings = StorageManager.getSettings();
        if (settings.appLockEnabled && settings.appPin) {
            this.pin = settings.appPin;
            this.isLocked = true;
            this.showLockScreen();
        }
    },
    
    setPin: function(newPin) {
        if (newPin.length !== 6) return false;
        if (!/^\d{6}$/.test(newPin)) return false;
        this.pin = newPin;
        var settings = StorageManager.getSettings();
        settings.appLockEnabled = true;
        settings.appPin = newPin;
        StorageManager.saveSettings(settings);
        this.isLocked = true;
        return true;
    },
    
    disableLock: function(code) {
        if (code === this.pin || code === this.recoveryCode) {
            this.pin = null;
            this.isLocked = false;
            this.inputPin = '';
            this.attempts = 0;
            this.showPin = false;
            var settings = StorageManager.getSettings();
            settings.appLockEnabled = false;
            settings.appPin = null;
            StorageManager.saveSettings(settings);
            return true;
        }
        return false;
    },
    
    verifyPin: function(pin) {
        if (pin === this.pin) {
            this.attempts = 0;
            this.inputPin = '';
            this.showPin = false;
            this._showSuccessThenHide();
            return true;
        }
        this.attempts++;
        if (this.attempts >= this.maxAttempts) {
            this.showLockoutScreen();
        }
        return false;
    },
    
    _showSuccessThenHide: function() {
        var overlay = document.getElementById('lock-overlay');
        if (!overlay) return;
        
        overlay.innerHTML = `
            <div style="text-align:center;animation:scaleIn 0.4s ease;">
                <div style="font-size:70px;animation:bounceIn 0.6s ease;"></div>
                <h3 style="color:#4CAF50;margin:12px 0;">تم الفتح بنجاح</h3>
                <p style="color:var(--text-secondary);">مرحباً بك في تعافي</p>
            </div>
        `;
        
        var self = this;
        setTimeout(function() {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.3s';
            setTimeout(function() { 
                overlay.remove();
                self._removeAllModals();
            }, 300);
        }, 800);
    },
    
    showLockoutScreen: function() {
        var self = this;
        var overlay = document.getElementById('lock-overlay');
        if (!overlay) return;
        
        overlay.innerHTML = `
            <div style="text-align:center;padding:20px;max-width:380px;width:100%;animation:fadeInUp 0.4s ease;">
                <div style="font-size:60px;margin-bottom:12px;animation:pulse 2s infinite;">🔒</div>
                <h3 style="color:var(--text-primary);margin-bottom:6px;">تم قفل التطبيق مؤقتاً</h3>
                <p style="color:#F44336;font-size:13px;margin-bottom:4px;">محاولات كثيرة خاطئة (${self.maxAttempts} محاولات)</p>
                <p style="color:var(--text-tertiary);font-size:12px;margin-bottom:16px;">انتظر 60 ثانية أو استخدم رمز الاسترداد</p>
                
                <div style="background:var(--surface-variant);padding:14px;border-radius:12px;margin-bottom:14px;">
                    <p style="font-size:11px;color:var(--text-tertiary);margin-bottom:8px;text-align:right;">
                        <i class="fas fa-key" style="margin-left:4px;"></i> رمز الاسترداد
                    </p>
                    <input type="text" id="recovery-input" placeholder="Taeafi0x10000" 
                           style="width:100%;padding:12px;border-radius:10px;border:1px solid var(--border);text-align:center;font-size:14px;font-family:monospace;direction:ltr;background:var(--input-bg);color:var(--text-primary);">
                    <p id="recovery-error" style="color:#F44336;font-size:11px;min-height:16px;margin-top:4px;text-align:center;"></p>
                    <button class="btn btn-primary btn-sm w-full mt-2" onclick="AppLock.useRecoveryCode()" style="width:100%;">
                        <i class="fas fa-unlock"></i> فتح برمز الاسترداد
                    </button>
                </div>
                
                <div style="text-align:center;">
                    <p style="font-size:32px;font-weight:800;color:#F44336;" id="lockout-timer">60</p>
                    <p style="font-size:12px;color:var(--text-tertiary);">ثانية</p>
                </div>
            </div>
        `;
        
        var timeLeft = 60;
        var timerInterval = setInterval(function() {
            timeLeft--;
            var timer = document.getElementById('lockout-timer');
            if (timer) timer.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                self.attempts = 0;
                self.showLockScreen();
            }
        }, 1000);
    },
    
    useRecoveryCode: function() {
        var input = document.getElementById('recovery-input');
        var errorEl = document.getElementById('recovery-error');
        if (!input) return;
        
        var code = input.value.trim();
        if (code === this.recoveryCode) {
            this.disableLock(this.recoveryCode);
            this._removeAllModals();
            if (typeof showToast === 'function') {
                showToast('تم فتح التطبيق - عيّن رمزاً جديداً من الإعدادات');
            }
            setTimeout(function() {
                if (typeof navigateTo === 'function') navigateTo('settings');
            }, 500);
        } else {
            if (errorEl) {
                errorEl.textContent = 'رمز استرداد خاطئ';
                errorEl.style.animation = 'none';
                errorEl.offsetHeight;
                errorEl.style.animation = 'shake 0.5s ease';
            }
        }
    },
    
    showLockScreen: function() {
        var existing = document.getElementById('lock-overlay');
        if (existing) existing.remove();
        
        this.inputPin = '';
        this.showPin = false;
        
        var overlay = document.createElement('div');
        overlay.id = 'lock-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:var(--background);z-index:99999;display:flex;align-items:center;justify-content:center;';
        
        overlay.innerHTML = `
            <div style="text-align:center;padding:20px;max-width:370px;width:100%;animation:fadeInUp 0.5s ease;">
                <i class="fas fa-leaf" style="font-size:44px;color:var(--primary);margin-bottom:10px;"></i>
                <h3 style="margin-bottom:2px;color:var(--text-primary);">تعافي</h3>
                <p style="color:var(--text-secondary);font-size:14px;margin-bottom:24px;">أدخل الرمز السري للمتابعة</p>
                
                <!-- عرض الرمز -->
                <div style="display:flex;gap:10px;justify-content:center;margin-bottom:8px;" id="pin-display">
                    <div class="pin-digit" id="pin-d-0"></div>
                    <div class="pin-digit" id="pin-d-1"></div>
                    <div class="pin-digit" id="pin-d-2"></div>
                    <div class="pin-digit" id="pin-d-3"></div>
                    <div class="pin-digit" id="pin-d-4"></div>
                    <div class="pin-digit" id="pin-d-5"></div>
                </div>
                
                <!-- زر إظهار/إخفاء -->
                <button id="toggle-pin-btn" onclick="AppLock.togglePinVisibility()" 
                        style="background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:18px;padding:4px 12px;margin-bottom:12px;">
                    <i class="fas fa-eye-slash"></i>
                </button>
                
                <!-- رسائل -->
                <p id="pin-error" style="color:#F44336;font-size:12px;min-height:20px;margin-bottom:2px;"></p>
                <p id="pin-attempts" style="color:var(--text-tertiary);font-size:11px;min-height:16px;margin-bottom:16px;">
                    ${this.attempts > 0 ? 'محاولات متبقية: <strong>' + (this.maxAttempts - this.attempts) + '</strong>' : ''}
                </p>
                
                <!-- لوحة الأرقام -->
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:270px;margin:0 auto 16px;" id="pin-pad">
                    <button class="pin-key">1</button>
                    <button class="pin-key">2</button>
                    <button class="pin-key">3</button>
                    <button class="pin-key">4</button>
                    <button class="pin-key">5</button>
                    <button class="pin-key">6</button>
                    <button class="pin-key">7</button>
                    <button class="pin-key">8</button>
                    <button class="pin-key">9</button>
                    <div class="pin-empty"></div>
                    <button class="pin-key">0</button>
                    <button class="pin-key pin-delete"><i class="fas fa-delete-left"></i></button>
                </div>
                
                <!-- نسيت كلمة السر -->
                <button onclick="AppLock.showForgotPinDialog()" 
                        style="background:none;border:none;color:var(--text-tertiary);font-size:11px;cursor:pointer;text-decoration:underline;padding:4px 8px;">
                    <i class="fas fa-question-circle" style="margin-left:3px;"></i> هل نسيت كلمة السر؟
                </button>
                
                <p style="font-size:9px;color:var(--text-disabled);margin-top:16px;">
                    <i class="fas fa-shield-halved"></i> محمي بنظام قفل تعافي
                </p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this._setupPinInput();
        this._addPinStyles();
    },
    
    togglePinVisibility: function() {
        this.showPin = !this.showPin;
        var btn = document.getElementById('toggle-pin-btn');
        if (btn) {
            btn.innerHTML = this.showPin ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        }
        this._updatePinDisplay();
    },
    
    _updatePinDisplay: function() {
        for (var i = 0; i < 6; i++) {
            var digitEl = document.getElementById('pin-d-' + i);
            if (!digitEl) continue;
            
            if (i < this.inputPin.length) {
                digitEl.textContent = this.showPin ? this.inputPin[i] : '•';
                digitEl.classList.add('filled');
            } else {
                digitEl.textContent = '';
                digitEl.classList.remove('filled');
            }
        }
    },
    
    showForgotPinDialog: function() {
        var modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.zIndex = '999999';
        modal.innerHTML = `
            <div class="modal-container" style="max-width:380px;text-align:center;animation:scaleIn 0.3s ease;">
                <div style="font-size:50px;margin-bottom:10px;"></div>
                <h3 style="margin-bottom:6px;">استعادة الوصول</h3>
                <p style="color:var(--text-secondary);font-size:12px;margin-bottom:4px;">أدخل رمز الاسترداد لفتح التطبيق</p>
                <p style="color:var(--text-tertiary);font-size:10px;margin-bottom:14px;">ثم يمكنك تعيين رمز جديد من الإعدادات</p>
                
                <div style="background:var(--surface-variant);padding:14px;border-radius:12px;margin-bottom:12px;">
                    <p style="font-size:10px;color:var(--text-tertiary);margin-bottom:4px;">رمز الاسترداد</p>
                    <p style="font-size:15px;font-weight:700;font-family:monospace;direction:ltr;color:var(--primary);">Taeafi0x10000</p>
                </div>
                
                <input type="text" id="forgot-recovery-input" placeholder="أدخل رمز الاسترداد هنا" 
                       style="width:100%;padding:14px;border-radius:12px;border:2px solid var(--border);text-align:center;font-size:15px;font-family:monospace;direction:ltr;background:var(--input-bg);color:var(--text-primary);margin-bottom:8px;">
                
                <p id="forgot-error" style="color:#F44336;font-size:12px;min-height:18px;margin-bottom:8px;"></p>
                
                <button class="btn btn-primary w-full" onclick="AppLock.submitForgotPin()" style="width:100%;">
                    <i class="fas fa-unlock"></i> فتح التطبيق
                </button>
                <button class="btn btn-outline w-full mt-2" onclick="this.closest('.modal-overlay').remove()" style="width:100%;">
                    <i class="fas fa-arrow-left"></i> العودة
                </button>
                
                <p style="font-size:9px;color:var(--text-disabled);margin-top:10px;">
                    إذا نسيت رمز الاسترداد أيضاً، يرجى إعادة تثبيت التطبيق
                </p>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    submitForgotPin: function() {
        var input = document.getElementById('forgot-recovery-input');
        var errorEl = document.getElementById('forgot-error');
        if (!input) return;
        
        var code = input.value.trim();
        if (code === this.recoveryCode) {
            this.disableLock(this.recoveryCode);
            this._removeAllModals();
            if (typeof showToast === 'function') {
                showToast('تم الفتح - عيّن رمزاً جديداً من الإعدادات');
            }
            setTimeout(function() {
                if (typeof navigateTo === 'function') navigateTo('settings');
            }, 500);
        } else {
            if (errorEl) {
                errorEl.textContent = 'رمز استرداد خاطئ - حاول مرة أخرى';
                errorEl.style.animation = 'none';
                errorEl.offsetHeight;
                errorEl.style.animation = 'shake 0.5s ease';
            }
        }
    },
    
    _removeAllModals: function() {
        document.querySelectorAll('.modal-overlay').forEach(function(m) { m.remove(); });
        var lock = document.getElementById('lock-overlay');
        if (lock) lock.remove();
    },
    
    _setupPinInput: function() {
        var self = this;
        var errorEl = document.getElementById('pin-error');
        var attemptsEl = document.getElementById('pin-attempts');
        
        document.querySelectorAll('#pin-pad .pin-key').forEach(function(key) {
            key.addEventListener('click', function() {
                var val = this.textContent.trim();
                
                if (this.classList.contains('pin-delete')) {
                    self.inputPin = self.inputPin.slice(0, -1);
                } else if (/^\d$/.test(val)) {
                    if (self.inputPin.length >= 6) {
                        // رسالة الحد الأقصى
                        if (errorEl) {
                            errorEl.textContent = 'الحد الأقصى 6 أرقام فقط';
                            errorEl.style.animation = 'none';
                            errorEl.offsetHeight;
                            errorEl.style.animation = 'shake 0.4s ease';
                            setTimeout(function() { errorEl.textContent = ''; }, 1500);
                        }
                        return;
                    }
                    self.inputPin += val;
                    // تأثير الضغط
                    this.style.transform = 'scale(0.85)';
                    setTimeout(function() { key.style.transform = ''; }, 120);
                }
                
                // تحديث العرض
                self._updatePinDisplay();
                
                // مسح رسالة الخطأ
                if (errorEl && errorEl.textContent.includes('الحد الأقصى') === false) {
                    errorEl.textContent = '';
                }
                
                // تحقق عند اكتمال 6 أرقام
                if (self.inputPin.length === 6) {
                    setTimeout(function() {
                        if (self.verifyPin(self.inputPin)) {
                            if (errorEl) errorEl.textContent = '';
                            if (attemptsEl) attemptsEl.innerHTML = '';
                        } else {
                            self.inputPin = '';
                            self._updatePinDisplay();
                            if (errorEl) {
                                errorEl.textContent = 'رمز خاطئ - حاول مرة أخرى';
                                errorEl.style.animation = 'none';
                                errorEl.offsetHeight;
                                errorEl.style.animation = 'shake 0.5s ease';
                            }
                            if (attemptsEl) {
                                var remaining = self.maxAttempts - self.attempts;
                                attemptsEl.innerHTML = remaining > 0 ? 
                                    'محاولات متبقية: <strong>' + remaining + '</strong>' : '';
                            }
                        }
                    }, 250);
                }
            });
        });
    },
    
    _addPinStyles: function() {
        if (document.getElementById('app-lock-styles-v2')) return;
        var style = document.createElement('style');
        style.id = 'app-lock-styles-v2';
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes bounceIn {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-8px); }
                40% { transform: translateX(8px); }
                60% { transform: translateX(-5px); }
                80% { transform: translateX(5px); }
            }
            
            .pin-digit {
                width: 40px; height: 50px;
                border-radius: 10px;
                border: 2px solid var(--border);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                font-weight: 700;
                color: var(--text-primary);
                background: var(--surface);
                transition: all 0.25s ease;
                font-family: monospace;
            }
            .pin-digit.filled {
                border-color: var(--primary);
                background: var(--primary-light);
                color: var(--primary);
                box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.2);
            }
            
            .pin-key {
                width: 75px; height: 75px;
                border-radius: 16px;
                border: 1px solid var(--border-light);
                background: var(--surface);
                color: var(--text-primary);
                font-size: 24px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: var(--shadow-sm);
                font-family: var(--font-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                -webkit-tap-highlight-color: transparent;
                user-select: none;
            }
            .pin-key:hover {
                background: var(--primary-light);
                border-color: var(--primary);
                transform: translateY(-3px);
                box-shadow: var(--shadow-md);
            }
            .pin-key:active {
                transform: scale(0.88) !important;
                background: var(--primary) !important;
                color: white !important;
                transition: all 0.05s;
            }
            .pin-delete {
                font-size: 20px;
                color: var(--text-tertiary);
                background: var(--surface-variant) !important;
            }
            .pin-delete:hover {
                color: var(--accent-red) !important;
                background: #FCE4EC !important;
            }
            .pin-empty { width: 75px; height: 75px; }
            
            #toggle-pin-btn {
                transition: all 0.2s;
            }
            #toggle-pin-btn:hover {
                color: var(--primary) !important;
                transform: scale(1.1);
            }
            
            #lock-overlay {
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
            }
            
            @media (max-width: 360px) {
                .pin-key { width: 65px; height: 65px; font-size: 20px; }
                .pin-digit { width: 34px; height: 42px; font-size: 18px; }
                .pin-empty { width: 65px; height: 65px; }
            }
        `;
        document.head.appendChild(style);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() { AppLock.init(); }, 3000);
});