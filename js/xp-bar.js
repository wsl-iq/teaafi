/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : xp-bar.js
 * Type   : JavaScript
 */

var XPBar = {

    /* STATE */
    _lastLevel: 1,
    _lastXp: 0,
    _lastProgress: 0,
    _interval: null,

    /* HTML */

    buildHTML: function () {
        return `
            <div class="xp-bar-inline" id="xp-bar-inline">
                <div class="xp-level-section">
                    <div class="xp-level-icon" id="xp-level-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <div>
                        <div class="xp-level-name" id="xp-level-name">مبتدئ</div>
                        <div class="xp-level-number" id="xp-level-number">المستوى 1</div>
                    </div>
                </div>

                <div class="xp-progress-section">
                    <div class="xp-progress-track">
                        <div class="xp-progress-fill" id="xp-progress-fill" style="width: 0%;"></div>
                    </div>
                </div>

                <div class="xp-points-section">
                    <div class="xp-points-value" id="xp-points-value">0 / 100</div>
                    <div class="xp-points-remaining" id="xp-points-remaining">100 XP للمستوى التالي</div>
                </div>
            </div>
        `;
    },

    /* INJECT */

    inject: function () {
        // If already injected, just refresh
        if (document.getElementById('xp-bar-inline')) {
            this.refresh();
            this.startAutoRefresh();
            return;
        }

        var searchBar = document.querySelector('.search-bar-container');
        if (!searchBar) return;

        var wrapper = document.createElement('div');
        wrapper.innerHTML = this.buildHTML();
        var bar = wrapper.firstElementChild;

        if (searchBar.parentNode) {
            searchBar.parentNode.insertBefore(bar, searchBar.nextSibling);
        }

        // Force initial refresh
        this.refresh();

        // Start interval-based auto-refresh
        this.startAutoRefresh();
    },

    /* AUTO REFRESH */

    startAutoRefresh: function () {
        var self = this;

        // Stop existing interval
        if (this._interval) {
            clearInterval(this._interval);
        }

        // Check every 1500ms — bar updates automatically
        this._interval = setInterval(function () {
            self.refresh();
        }, 1500);
    },

    stopAutoRefresh: function () {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    },

    /* REFRESH (MAIN LOGIC) */

    refresh: function () {
        var el = document.getElementById('xp-bar-inline');
        if (!el) return;
        if (typeof XPSystem === 'undefined') return;

        // Ensure XPSystem is initialized
        if (!XPSystem._initialized && typeof XPSystem.init === 'function') {
            try {
                XPSystem.init();
            } catch (e) {
                console.warn('[XPBar] XPSystem init failed:', e);
                return;
            }
        }

        // Read raw values
        var level = Number(XPSystem.level || 1);
        var xp = Number(XPSystem.xp || 0);

        // Calculate progress
        var progress = 0;
        try {
            progress = Number(XPSystem.getProgress ? XPSystem.getProgress() : 0);
        } catch (e) {
            progress = 0;
        }

        // Calculate XP to next
        var xpToNext = 0;
        try {
            xpToNext = Number(XPSystem.getXPToNext ? XPSystem.getXPToNext() : 0);
        } catch (e) {
            xpToNext = 0;
        }

        // Level info
        var name = 'مبتدئ';
        var icon = 'fa-seedling';
        var nextLevelXp = 100;

        try {
            if (typeof XPSystem.getLevelName === 'function') name = XPSystem.getLevelName();
            if (typeof XPSystem.getLevelIcon === 'function') icon = XPSystem.getLevelIcon();
            if (typeof XPSystem.getNextLevelXP === 'function') nextLevelXp = Number(XPSystem.getNextLevelXP());
        } catch (e) {}

        // Safety clamp
        if (!isFinite(progress)) progress = 0;
        progress = Math.min(100, Math.max(0, Math.round(progress)));

        if (!isFinite(nextLevelXp) || nextLevelXp < 100) nextLevelXp = 100;

        // Update icon
        var iconEl = el.querySelector('#xp-level-icon');
        if (iconEl) {
            iconEl.innerHTML = '<i class="fas ' + icon + '"></i>';
        }

        // Update level name
        var nameEl = el.querySelector('#xp-level-name');
        if (nameEl) nameEl.textContent = name;

        // Update level number
        var numEl = el.querySelector('#xp-level-number');
        if (numEl) numEl.textContent = 'المستوى ' + level;

        // Update progress bar width
        var fillEl = el.querySelector('#xp-progress-fill');
        if (fillEl) {
            fillEl.style.width = progress + '%';
        }

        // Update points value
        var valueEl = el.querySelector('#xp-points-value');
        if (valueEl) {
            valueEl.textContent = xp + ' / ' + nextLevelXp;
        }

        // Update remaining
        var remainingEl = el.querySelector('#xp-points-remaining');
        if (remainingEl) {
            if (xpToNext > 0) {
                remainingEl.textContent = xpToNext + ' XP للمستوى التالي';
            } else {
                remainingEl.textContent = 'أعلى مستوى';
            }
        }

        // Detect level up
        if (level > this._lastLevel && this._lastLevel > 0) {
            this._animateLevelUp(el);
        }

        this._lastLevel = level;
        this._lastXp = xp;
        this._lastProgress = progress;
    },

    _animateLevelUp: function (el) {
        if (!el) return;
        el.classList.add('xp-level-up');
        setTimeout(function () {
            el.classList.remove('xp-level-up');
        }, 1100);
    }
};