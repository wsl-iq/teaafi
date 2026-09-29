/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : quick-actions.js
 * Type   : JavaScript
 */

var QuickActions = {

    /* STATE */

    isOpen: false,
    container: null,
    overlay: null,
    scrollThreshold: 80,
    _scrollHandler: null,
    _routeHandler: null,
    _lastScrollY: 0,

    /* INITIALIZATION */

    init: function () {
        var self = this;

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'quick-actions-overlay';
        this.overlay.addEventListener('click', function () {
            self.close();
        });
        document.body.appendChild(this.overlay);

        // Create container
        this.container = document.createElement('div');
        this.container.className = 'quick-actions-container qa-hidden';
        this.container.innerHTML = this._buildMarkup();
        document.body.appendChild(this.container);

        // Attach FAB click
        var fab = this.container.querySelector('.quick-actions-fab');
        if (fab) {
            fab.addEventListener('click', function (e) {
                e.stopPropagation();
                self.toggle();
            });
        }

        // Attach action clicks
        this.container.querySelectorAll('.quick-action-item').forEach(function (item) {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                var action = item.dataset.action;
                self.close();
                self.run(action);
            });
        });

        // ESC to close
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && self.isOpen) {
                self.close();
            }
        });

        // Attach scroll listener
        this._attachScrollListener();

        // Attach route change listener
        this._attachRouteListener();

        // Initial visibility check
        this._updateVisibility();
    },

    /* MARKUP */

    _buildMarkup: function () {
        return `
            <button class="quick-actions-fab" type="button" aria-label="إجراءات سريعة">
                <span class="fab-icon">
                    <span class="fab-line"></span>
                    <span class="fab-line"></span>
                    <span class="fab-line"></span>
                </span>
            </button>
            <div class="quick-actions-menu">
                <div class="quick-action-item" data-action="tasbih">
                    <div class="quick-action-icon" style="background: linear-gradient(135deg, #1B5E20, #4CAF50);">
                        <i class="fas fa-fingerprint"></i>
                    </div>
                    <span class="quick-action-label">تسبيح سريع</span>
                </div>
                <div class="quick-action-item" data-action="note">
                    <div class="quick-action-icon" style="background: linear-gradient(135deg, #AD1457, #E91E63);">
                        <i class="fas fa-pen"></i>
                    </div>
                    <span class="quick-action-label">مذكرة سريعة</span>
                </div>
                <div class="quick-action-item" data-action="breath">
                    <div class="quick-action-icon" style="background: linear-gradient(135deg, #006064, #00BCD4);">
                        <i class="fas fa-wind"></i>
                    </div>
                    <span class="quick-action-label">تمرين تنفس</span>
                </div>
                <div class="quick-action-item" data-action="relapse">
                    <div class="quick-action-icon" style="background: linear-gradient(135deg, #E65100, #FF9800);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <span class="quick-action-label">تسجيل انتكاسة</span>
                </div>
                <div class="quick-action-item" data-action="emergency">
                    <div class="quick-action-icon" style="background: linear-gradient(135deg, #B71C1C, #F44336);">
                        <i class="fas fa-life-ring"></i>
                    </div>
                    <span class="quick-action-label">وضع الطوارئ</span>
                </div>
            </div>
        `;
    },

    /* ROUTE + SCROLL VISIBILITY */

    _attachRouteListener: function () {
        var self = this;

        // Listen to Router page changes via global event
        this._routeHandler = function () {
            self._updateVisibility();
        };

        window.addEventListener('taeafiDataUpdated', this._routeHandler);
        window.addEventListener('recoveryUpdated', this._routeHandler);

        // Also listen to hash changes as fallback
        window.addEventListener('hashchange', this._routeHandler);
    },

    _attachScrollListener: function () {
        var self = this;

        this._scrollHandler = function () {
            var mainContent = document.getElementById('main-content');
            var scrollY = 0;

            if (mainContent) {
                scrollY = mainContent.scrollTop || 0;
            } else {
                scrollY = window.scrollY || 0;
            }

            // Close menu if user scrolls while it's open
            if (self.isOpen && Math.abs(scrollY - self._lastScrollY) > 10) {
                self.close();
            }

            self._lastScrollY = scrollY;

            // Toggle visibility based on scroll position
            if (scrollY > self.scrollThreshold) {
                if (self.container) {
                    self.container.classList.add('qa-scrolled');
                }
            } else {
                if (self.container) {
                    self.container.classList.remove('qa-scrolled');
                }
            }
        };

        // Attach to main-content (which is the scrollable element)
        var mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.addEventListener('scroll', this._scrollHandler, { passive: true });
        }

        // Also attach to window as fallback
        window.addEventListener('scroll', this._scrollHandler, { passive: true });
    },

    _updateVisibility: function () {
        if (!this.container) return;

        var currentPage = 'home';

        if (typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function') {
            currentPage = Router.getCurrentPage() || 'home';
        }

        if (currentPage === 'home') {
            this.container.classList.remove('qa-hidden');
            // Reset scroll state
            this._lastScrollY = 0;
            this.container.classList.remove('qa-scrolled');
        } else {
            this.container.classList.add('qa-hidden');
            this.close();
        }
    },

    /* OPEN / CLOSE */

    toggle: function () {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open: function () {
        this.isOpen = true;
        if (this.container) this.container.classList.add('open');
        if (this.overlay) this.overlay.classList.add('show');
    },

    close: function () {
        this.isOpen = false;
        if (this.container) this.container.classList.remove('open');
        if (this.overlay) this.overlay.classList.remove('show');
    },

    /* RUN ACTION */

    run: function (action) {
        switch (action) {
            case 'tasbih':
                this._runTasbih();
                break;
            case 'note':
                this._runQuickNote();
                break;
            case 'breath':
                this._runBreath();
                break;
            case 'relapse':
                this._runRelapse();
                break;
            case 'emergency':
                this._runEmergency();
                break;
        }
    },

    _runTasbih: function () {
        if (typeof navigateTo === 'function') {
            navigateTo('tasbih');
        }
    },

    _runBreath: function () {
        if (typeof navigateTo === 'function') {
            navigateTo('breath');
        }
    },

    /* ACTION: QUICK NOTE */

    _runQuickNote: function () {
        var selectedMood = 2;

        var modal = document.createElement('div');
        modal.className = 'quick-note-modal';
        modal.innerHTML = `
            <div class="quick-note-card">
                <h3>
                    <i class="fas fa-pen-fancy" style="color: #E91E63;"></i>
                    مذكرة سريعة
                </h3>

                <div class="quick-note-mood" id="quick-note-mood">
                    <span class="quick-note-mood-icon" data-mood="0"><i class="fas fa-laugh-beam" style="color:#4CAF50;"></i></span>
                    <span class="quick-note-mood-icon" data-mood="1"><i class="fas fa-smile" style="color:#8BC34A;"></i></span>
                    <span class="quick-note-mood-icon selected" data-mood="2"><i class="fas fa-meh" style="color:#FFC107;"></i></span>
                    <span class="quick-note-mood-icon" data-mood="3"><i class="fas fa-frown" style="color:#FF9800;"></i></span>
                    <span class="quick-note-mood-icon" data-mood="4"><i class="fas fa-sad-tear" style="color:#F44336;"></i></span>
                </div>

                <textarea id="quick-note-text" placeholder="اكتب ما يدور في بالك الآن..." autofocus></textarea>

                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-outline" id="quick-note-cancel" style="flex: 1;">إلغاء</button>
                    <button class="btn btn-primary" id="quick-note-save" style="flex: 1;">
                        <i class="fas fa-save"></i> حفظ
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll('.quick-note-mood-icon').forEach(function (icon) {
            icon.addEventListener('click', function () {
                selectedMood = parseInt(this.dataset.mood, 10);
                modal.querySelectorAll('.quick-note-mood-icon').forEach(function (el) {
                    el.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });

        modal.querySelector('#quick-note-cancel').addEventListener('click', function () {
            modal.remove();
        });

        modal.querySelector('#quick-note-save').addEventListener('click', function () {
            var text = modal.querySelector('#quick-note-text').value.trim();
            if (!text) {
                if (typeof showToast === 'function') showToast('اكتب شيئاً أولاً');
                return;
            }

            var today = new Date().toISOString().split('T')[0];
            var entries = StorageManager.get('journal_entries') || [];
            var existingIndex = entries.findIndex(function (e) { return e.date === today; });

            if (existingIndex >= 0) {
                entries[existingIndex].text += '\n\n---\n' + text;
                entries[existingIndex].mood = selectedMood;
                entries[existingIndex].updatedAt = new Date().toISOString();
            } else {
                entries.push({
                    date: today,
                    text: text,
                    mood: selectedMood,
                    timestamp: new Date().toISOString(),
                    source: 'quick-action'
                });
            }

            StorageManager.set('journal_entries', entries);

            if (typeof showToast === 'function') showToast('تم حفظ المذكرة');
            if (typeof XPSystem !== 'undefined' && typeof XPSystem.addXP === 'function') {
                XPSystem.addXP('journal_entry');
            }
            if (typeof DataUpdateManager !== 'undefined') {
                DataUpdateManager.notifyDataChanged('journal', { source: 'quick-action' });
            }

            modal.remove();
        });

        modal.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') modal.remove();
        });
    },

    /* ACTION: QUICK RELAPSE */

    _runRelapse: function () {
        if (typeof TaeafiMultiHabit !== 'undefined' && typeof TaeafiMultiHabit.getActiveHabitId === 'function') {
            var activeId = TaeafiMultiHabit.getActiveHabitId();
            if (activeId && typeof TaeafiHabitControls !== 'undefined' && typeof TaeafiHabitControls.recordRelapse === 'function') {
                TaeafiHabitControls.recordRelapse(activeId);
                return;
            }
        }

        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.getRecoveryStats === 'function') {
            var stats = RecoveryCounter.getRecoveryStats();
            if (stats && stats.isActive && typeof RecoveryCounter.addRelapse === 'function') {
                if (confirm('هل تريد تسجيل انتكاسة؟')) {
                    RecoveryCounter.addRelapse();
                    if (typeof showToast === 'function') showToast('تم تسجيل الانتكاسة');
                    if (typeof renderRecoveryPage === 'function' && typeof Router !== 'undefined' && Router.getCurrentPage() === 'recovery') {
                        renderRecoveryPage();
                    }
                }
                return;
            }
        }

        if (typeof showToast === 'function') showToast('لا توجد رحلة تعافي نشطة');
    },

    /* ACTION: EMERGENCY MODE */

    _runEmergency: function () {
        var duas = [
            'يَا مَنْ تُحَلُّ بِهِ عُقَدُ الْمَكَارِهِ، وَيَا مَنْ يُفْثَأُ بِهِ حَدُّ الشَّدَائِدِ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
            'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ',
            'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
            'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
            'اللَّهُمَّ ثَبِّتْ قَلْبِي عَلَى دِينِكَ وَطَاعَتِكَ'
        ];

        var messages = [
            'أنت أقوى من هذه اللحظة. خذ نفساً عميقاً، واعلم أن هذه الرغبة مؤقتة وستمر.',
            'توقف لحظة. تذكر لماذا بدأت هذه الرحلة. أنت تستحق حياة أفضل.',
            'الضعف لحظة، لكن قوتك تدوم. اجلس، تنفس، واشرب ماءً.',
            'أنت لست وحدك. الله معك، وهو يسمعك الآن. ادعُه.',
            'كل ثانية مقاومة هي انتصار. أنت الآن في معركة، وستنتصر.'
        ];

        var randomDua = duas[Math.floor(Math.random() * duas.length)];
        var randomMessage = messages[Math.floor(Math.random() * messages.length)];

        var modal = document.createElement('div');
        modal.className = 'emergency-modal';
        modal.innerHTML = `
            <div class="emergency-card">
                <div class="emergency-icon">
                    <i class="fas fa-life-ring"></i>
                </div>

                <h2>خذ نفساً</h2>
                <p>${randomMessage}</p>

                <div class="emergency-dua">
                    ${randomDua}
                </div>

                <div class="emergency-actions">
                    <button class="btn btn-primary" id="emergency-ok">
                        <i class="fas fa-heart"></i>
                        أنا بخير الآن
                    </button>
                    <button class="btn btn-outline" id="emergency-distract">
                        <i class="fas fa-wind"></i>
                        تمرين تنفس
                    </button>
                    <button class="btn btn-outline" id="emergency-close">
                        إغلاق
                    </button>
                </div>

                <div class="emergency-countdown" id="emergency-timer">
                    ستُغلق النافذة تلقائياً بعد 60 ثانية
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        var secondsLeft = 60;
        var timerInterval = setInterval(function () {
            secondsLeft--;
            var timerEl = modal.querySelector('#emergency-timer');
            if (timerEl) {
                timerEl.textContent = 'ستُغلق النافذة تلقائياً بعد ' + secondsLeft + ' ثانية';
            }
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                modal.remove();
            }
        }, 1000);

        modal.querySelector('#emergency-ok').addEventListener('click', function () {
            clearInterval(timerInterval);
            modal.remove();
            if (typeof showToast === 'function') showToast('أحسنت، أنت أقوى من هذه اللحظة');
        });

        modal.querySelector('#emergency-distract').addEventListener('click', function () {
            clearInterval(timerInterval);
            modal.remove();
            if (typeof navigateTo === 'function') navigateTo('breath');
        });

        modal.querySelector('#emergency-close').addEventListener('click', function () {
            clearInterval(timerInterval);
            modal.remove();
        });
    }
};

/* HOOK ROUTER NAVIGATION */

(function hookRouterForQuickActions() {
    function tryHook() {
        if (typeof Router !== 'undefined' && typeof Router.navigateTo === 'function' && !Router.__quickActionsHooked) {
            var originalNavigate = Router.navigateTo;
            Router.navigateTo = function (page, options) {
                var result = originalNavigate.call(this, page, options);
                setTimeout(function () {
                    if (typeof QuickActions !== 'undefined' && typeof QuickActions._updateVisibility === 'function') {
                        QuickActions._updateVisibility();
                    }
                }, 50);
                return result;
            };
            Router.__quickActionsHooked = true;
            return true;
        }
        return false;
    }

    if (!tryHook()) {
        setTimeout(tryHook, 500);
        setTimeout(tryHook, 1500);
    }
})();

/* AUTO-INIT */

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        QuickActions.init();
    }, 1500);
});