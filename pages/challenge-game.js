// Taeafi Breath Challenge Game v1.1.2 - Final Fixed
// Developer: Mohammed Al-Baqer

var BreathGame = {
    round: 0,
    score: 0,
    phase: 'idle',
    timer: null,
    animFrame: null,
    
    phases: {
        idle:    { name: 'جاهز',    icon: 'fa-play-circle', color: '#4CAF50', duration: 0,    scale: 1.0, instruction: 'اضغط ابدأ للتحدي' },
        inhale:  { name: 'شهيق',    icon: 'fa-arrow-up',     color: '#2196F3', duration: 4000, scale: 1.4, instruction: 'تنفس ببطء من الأنف' },
        hold:    { name: 'احبس',    icon: 'fa-pause',        color: '#FF9800', duration: 7000, scale: 1.4, instruction: 'احبس النفس بهدوء' },
        exhale:  { name: 'زفير',    icon: 'fa-arrow-down',   color: '#9C27B0', duration: 8000, scale: 1.0, instruction: 'أخرج الهواء ببطء من الفم' },
        complete:{ name: 'مكتمل',   icon: 'fa-check-circle', color: '#4CAF50', duration: 0,    scale: 1.0, instruction: 'أحسنت! أكملت جولة' }
    },
    
    init: function() {
        this.round = 0;
        this.score = 0;
        this.phase = 'idle';
        this.stop();
    },
    
    start: function() {
        this.round = 0;
        this.score = 0;
        this.runPhase('inhale');
        this._updateButtons(true);
    },
    
    stop: function() {
        if (this.timer) { clearTimeout(this.timer); this.timer = null; }
        if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    },
    
    runPhase: function(phaseName) {
        var self = this;
        this.stop();
        this.phase = phaseName;
        var phaseData = this.phases[phaseName];
        
        this._updateUI();
        
        if (phaseData.duration > 0) {
            this._animateCircle(phaseData.scale, phaseData.duration);
            
            this.timer = setTimeout(function() {
                if (phaseName === 'inhale') {
                    self.runPhase('hold');
                } else if (phaseName === 'hold') {
                    self.runPhase('exhale');
                } else if (phaseName === 'exhale') {
                    self.round++;
                    self.score += 2;
                    self._updateUI();
                    
                    if (self.round >= 5) {
                        self._complete();
                    } else {
                        self.runPhase('inhale');
                    }
                }
            }, phaseData.duration);
        }
    },
    
    _animateCircle: function(targetScale, duration) {
        var self = this;
        var circle = document.getElementById('breath-circle');
        if (!circle) return;
        
        var startScale = parseFloat(circle.style.transform.replace('scale(', '').replace(')', '')) || 1;
        var startTime = performance.now();
        
        function step(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            var currentScale = startScale + (targetScale - startScale) * eased;
            circle.style.transform = 'scale(' + currentScale + ')';
            
            if (progress < 1) {
                self.animFrame = requestAnimationFrame(step);
            }
        }
        
        this.animFrame = requestAnimationFrame(step);
    },
    
    _complete: function() {
        this.stop();
        this.phase = 'complete';
        var bonus = 10;
        this.score += bonus;
        this._updateUI();
        
        var highScore = StorageManager.get('breath_high_score') || 0;
        if (this.score > highScore) {
            StorageManager.set('breath_high_score', this.score);
            if (typeof showToast === 'function') {
                showToast('🏆 رقم قياسي جديد: ' + this.score + ' نقطة!');
            }
        }
        
        if (typeof ChallengesManager !== 'undefined') {
            var points = StorageManager.get('challenge_points') || 0;
            StorageManager.set('challenge_points', points + this.score);
        }
        
        this._updateButtons(false);
        this._showCompletionEffect();
    },
    
    _showCompletionEffect: function() {
        var circle = document.getElementById('breath-circle');
        if (!circle) return;
        
        var count = 0;
        var pulseInterval = setInterval(function() {
            circle.style.transform = 'scale(1.2)';
            circle.style.boxShadow = '0 0 50px rgba(76,175,80,0.6)';
            setTimeout(function() {
                circle.style.transform = 'scale(1)';
                circle.style.boxShadow = '0 0 25px rgba(76,175,80,0.3)';
            }, 300);
            count++;
            if (count >= 3) clearInterval(pulseInterval);
        }, 600);
    },
    
    reset: function() {
        this.stop();
        this.init();
        this._updateUI();
        this._updateButtons(false);
        
        var circle = document.getElementById('breath-circle');
        if (circle) {
            circle.style.transform = 'scale(1)';
            circle.style.boxShadow = '0 0 25px rgba(var(--primary-rgb), 0.3)';
        }
    },
    
    _updateUI: function() {
        var phaseData = this.phases[this.phase];
        var highScore = StorageManager.get('breath_high_score') || 0;
        
        this._setText('breath-phase-text', phaseData.name);
        this._setText('breath-instruction', phaseData.instruction);
        this._setText('breath-round', this.round + '/5');
        this._setText('breath-score', this.score);
        this._setText('breath-best', highScore);
        
        var icon = document.getElementById('breath-icon');
        if (icon) {
            icon.className = 'fas ' + phaseData.icon;
        }
        
        var progress = document.getElementById('breath-progress');
        if (progress) {
            progress.style.width = ((this.round / 5) * 100) + '%';
        }
    },
    
    _updateButtons: function(isActive) {
        var startBtn = document.getElementById('breath-start-btn');
        var resetBtn = document.getElementById('breath-reset-btn');
        if (startBtn) startBtn.style.display = isActive ? 'none' : 'inline-flex';
        if (resetBtn) resetBtn.style.display = isActive ? 'inline-flex' : (this.round > 0 ? 'inline-flex' : 'none');
    },
    
    _setText: function(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }
};

function renderBreathGamePage() {
    BreathGame.init();
    var mainContent = document.getElementById('main-content');
    var highScore = StorageManager.get('breath_high_score') || 0;
    
    mainContent.innerHTML = `
        <div class="animate-fade-in">
            <h1 class="heading-underline">
                <i class="fas fa-wind" style="margin-left: 8px; color: #00BCD4;"></i>
                تحدي النفس
            </h1>
            <p class="text-secondary mb-4">تمرين تنفس يساعد على الاسترخاء وتقوية الإرادة</p>
            
            <!-- منطقة اللعبة -->
            <div class="card breath-game-card" style="text-align: center; padding: 40px 20px 32px;">
                
                <!-- الدائرة - في الأعلى منفصلة عن النصوص -->
                <div style="position: relative; width: 160px; height: 160px; margin: 0 auto 32px;">
                    <div id="breath-circle" class="breath-circle-main">
                        <i id="breath-icon" class="fas fa-play-circle breath-circle-icon"></i>
                    </div>
                    <div class="breath-circle-ring"></div>
                </div>
                
                <!-- النصوص - تحت الدائرة بمسافة آمنة -->
                <div style="position: relative; z-index: 5; margin-bottom: 8px;">
                    <span id="breath-phase-text" class="breath-phase-label">جاهز</span>
                </div>
                
                <p id="breath-instruction" class="breath-instruction-text">اضغط ابدأ للتحدي</p>
                
                <!-- شريط التقدم -->
                <div style="margin-bottom: 20px; max-width: 300px; margin-left: auto; margin-right: auto;">
                    <div class="breath-progress-bg">
                        <div id="breath-progress" class="breath-progress-fill"></div>
                    </div>
                    <p style="font-size: 11px; color: var(--text-tertiary); margin-top: 6px;">
                        الجولة: <strong id="breath-round">0/5</strong>
                    </p>
                </div>
                
                <!-- الإحصائيات -->
                <div style="display: flex; justify-content: center; gap: 48px; margin-bottom: 24px;">
                    <div style="text-align: center;">
                        <i class="fas fa-star" style="color: #FFD700; font-size: 18px; display: block; margin-bottom: 4px;"></i>
                        <span id="breath-score" style="font-size: 26px; font-weight: 700; color: var(--text-primary);">0</span>
                        <span style="font-size: 11px; color: var(--text-tertiary); display: block;">نقطة</span>
                    </div>
                    <div style="text-align: center;">
                        <i class="fas fa-trophy" style="color: #FFD700; font-size: 18px; display: block; margin-bottom: 4px;"></i>
                        <span id="breath-best" style="font-size: 26px; font-weight: 700; color: var(--text-primary);">${highScore}</span>
                        <span style="font-size: 11px; color: var(--text-tertiary); display: block;">أفضل</span>
                    </div>
                </div>
                
                <!-- الأزرار -->
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button id="breath-start-btn" class="btn btn-primary" onclick="BreathGame.start()" style="min-width: 140px;">
                        <i class="fas fa-play"></i> ابدأ التحدي
                    </button>
                    <button id="breath-reset-btn" class="btn btn-outline" onclick="BreathGame.reset()" style="display: none; min-width: 100px;">
                        <i class="fas fa-redo"></i> إعادة
                    </button>
                </div>
            </div>
            
            <!-- شرح التمرين -->
            <div class="card breath-guide-card" style="margin-top: 16px;">
                <h3 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px; color: var(--text-primary);">
                    <i class="fas fa-info-circle" style="color: #2196F3;"></i>
                    كيفية التمرين
                </h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    
                    <!-- شهيق -->
                    <div class="breath-guide-step breath-guide-inhale">
                        <div class="breath-guide-icon" style="background: #2196F3;">
                            <i class="fas fa-arrow-up"></i>
                        </div>
                        <div style="text-align: right;">
                            <strong>شهيق</strong>
                            <p>تنفس ببطء من الأنف لمدة 4 ثوانٍ</p>
                        </div>
                    </div>
                    
                    <!-- احبس -->
                    <div class="breath-guide-step breath-guide-hold">
                        <div class="breath-guide-icon" style="background: #FF9800;">
                            <i class="fas fa-pause"></i>
                        </div>
                        <div style="text-align: right;">
                            <strong>احبس</strong>
                            <p>احبس النفس بهدوء لمدة 7 ثوانٍ</p>
                        </div>
                    </div>
                    
                    <!-- زفير -->
                    <div class="breath-guide-step breath-guide-exhale">
                        <div class="breath-guide-icon" style="background: #9C27B0;">
                            <i class="fas fa-arrow-down"></i>
                        </div>
                        <div style="text-align: right;">
                            <strong>زفير</strong>
                            <p>أخرج الهواء ببطء من الفم لمدة 8 ثوانٍ</p>
                        </div>
                    </div>
                </div>
                
                <div class="breath-guide-total">
                    <p>
                        <i class="fas fa-lightbulb" style="margin-left: 4px;"></i>
                        <strong>المجموع:</strong> 5 جولات = 4-7-8 تنفس = +10 نقاط إرادة
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // إضافة CSS
    if (!document.getElementById('breath-game-styles-v2')) {
        var style = document.createElement('style');
        style.id = 'breath-game-styles-v2';
        style.textContent = `
            @keyframes rotateSlow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            /* الدائرة الرئيسية */
            .breath-circle-main {
                width: 160px; height: 160px;
                border-radius: 50%;
                background: var(--primary-gradient);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.1s linear, box-shadow 0.5s ease;
                box-shadow: 0 0 25px rgba(var(--primary-rgb), 0.3);
                border: 4px solid #4CAF50;
                position: relative;
                z-index: 2;
            }
            .breath-circle-icon {
                font-size: 48px;
                color: white;
                transition: all 0.3s ease;
            }
            
            /* الحلقة الخارجية */
            .breath-circle-ring {
                position: absolute;
                top: -12px; left: -12px;
                width: 184px; height: 184px;
                border-radius: 50%;
                border: 2px dashed var(--border-light);
                opacity: 0.4;
                animation: rotateSlow 20s linear infinite;
                z-index: 1;
            }
            
            /* النصوص */
            .breath-phase-label {
                font-size: 22px;
                font-weight: 700;
                color: var(--primary);
            }
            .breath-instruction-text {
                color: var(--text-secondary);
                font-size: 14px;
                margin-bottom: 20px;
                min-height: 22px;
            }
            
            /* شريط التقدم */
            .breath-progress-bg {
                background: var(--border-light);
                border-radius: 8px;
                height: 8px;
                overflow: hidden;
            }
            .breath-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                border-radius: 8px;
                width: 0%;
                transition: width 0.5s ease;
            }
            
            /* دليل التمرين */
            .breath-guide-step {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 12px;
                border-right: 4px solid;
            }
            .breath-guide-step strong {
                font-size: 14px;
            }
            .breath-guide-step p {
                font-size: 12px;
                margin-top: 2px;
            }
            .breath-guide-icon {
                width: 32px; height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .breath-guide-icon i {
                color: white;
                font-size: 13px;
            }
            
            /* شهيق */
            .breath-guide-inhale {
                background: #E3F2FD;
                border-right-color: #2196F3;
            }
            .breath-guide-inhale strong { color: #1565C0; }
            .breath-guide-inhale p { color: #1565C0; }
            
            /* احبس */
            .breath-guide-hold {
                background: #FFF3E0;
                border-right-color: #FF9800;
            }
            .breath-guide-hold strong { color: #E65100; }
            .breath-guide-hold p { color: #E65100; }
            
            /* زفير */
            .breath-guide-exhale {
                background: #F3E5F5;
                border-right-color: #9C27B0;
            }
            .breath-guide-exhale strong { color: #6A1B9A; }
            .breath-guide-exhale p { color: #6A1B9A; }
            
            /* المجموع */
            .breath-guide-total {
                margin-top: 14px;
                padding: 12px;
                background: #E8F5E9;
                border-radius: 12px;
                text-align: center;
            }
            .breath-guide-total p {
                font-size: 13px;
                color: #2E7D32;
            }
            
            /* ========== الوضع الداكن ========== */
            .theme-dark .breath-circle-ring {
                border-color: var(--border);
                opacity: 0.3;
            }
            .theme-dark .breath-guide-inhale {
                background: #1A2B3C;
            }
            .theme-dark .breath-guide-inhale strong { color: #64B5F6; }
            .theme-dark .breath-guide-inhale p { color: #90CAF9; }
            
            .theme-dark .breath-guide-hold {
                background: #3E2E1A;
            }
            .theme-dark .breath-guide-hold strong { color: #FFB74D; }
            .theme-dark .breath-guide-hold p { color: #FFCC80; }
            
            .theme-dark .breath-guide-exhale {
                background: #2A1A3C;
            }
            .theme-dark .breath-guide-exhale strong { color: #CE93D8; }
            .theme-dark .breath-guide-exhale p { color: #E1BEE7; }
            
            .theme-dark .breath-guide-total {
                background: #1B3A1B;
            }
            .theme-dark .breath-guide-total p {
                color: #81C784;
            }
            
            .theme-dark .breath-phase-label {
                color: var(--primary);
            }
            .theme-dark .breath-instruction-text {
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(style);
    }
}