/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : data-update-manager.js
 * Type: JavaScript
 * 
 * Central data update manager.
 * Ensures all systems stay in sync after data changes.
 */

var DataUpdateManager = {
    // Debounce timer to prevent multiple rapid updates
    _updateTimer: null,
    _isUpdating: false,
    
    /**
     * Main entry point for data updates.
     * Call this after any data change.
     * 
     * @param {string} type - Type of data updated: 'tasbih', 'dua', 'ziyarat', 'journal', 'quiz', 'recovery'
     * @param {object} detail - Additional data about the update
     */
    notifyDataChanged: function(type, detail) {
        // Debounce to avoid multiple rapid updates
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
        }
        
        this._updateTimer = setTimeout(function() {
            DataUpdateManager._processUpdate(type, detail);
            DataUpdateManager._updateTimer = null;
        }, 100);
    },
    
    /**
     * Process the update after debounce.
     */
    _processUpdate: function(type, detail) {
        if (this._isUpdating) return;
        this._isUpdating = true;
        
        try {
            // Step 1: Refresh data from storage if needed
            this._refreshData(type);
            
            // Step 2: Check achievements
            this._checkAchievements();
            
            // Step 3: Check challenges
            this._checkChallenges();
            
            // Step 4: Update stats
            this._updateStats();
            
            // Step 5: Update leaderboard
            this._updateLeaderboard(type);
            
            // Step 6: Update UI if on relevant pages
            this._updateUI(type);
            
            // Step 7: Dispatch global event
            this._dispatchEvent(type, detail);
            
        } catch (error) {
            console.error('[DataUpdateManager] Error during update:', error);
        } finally {
            this._isUpdating = false;
        }
    },
    
    /**
     * Refresh cached data from storage.
     */
    _refreshData: function(type) {
        // Force a refresh of recovery data if needed
        if (typeof RecoveryCounter !== 'undefined' && typeof RecoveryCounter.refresh === 'function') {
            RecoveryCounter.refresh();
        }
        
        // Refresh tasbih data if needed
        if (type === 'tasbih') {
            var tasbihData = StorageManager.get('tasbih_data');
            if (tasbihData && tasbihData.totalCount !== undefined) {
                // Ensure totalCount is correct
                var counts = tasbihData.counts || {};
                var calculatedTotal = Number(counts.allahuAkbar || 0) + 
                                     Number(counts.alhamdulillah || 0) + 
                                     Number(counts.subhanAllah || 0);
                if (tasbihData.totalCount < calculatedTotal) {
                    tasbihData.totalCount = calculatedTotal;
                    StorageManager.set('tasbih_data', tasbihData);
                }
            }
        }
    },
    
    /**
     * Check and unlock achievements.
     */
    _checkAchievements: function() {
        if (typeof AchievementsManager !== 'undefined' && 
            typeof AchievementsManager.checkAll === 'function') {
            try {
                // Get fresh stats before checking
                var stats = null;
                if (typeof RecoveryCounter !== 'undefined' && 
                    typeof RecoveryCounter.getRecoveryStats === 'function') {
                    stats = RecoveryCounter.getRecoveryStats();
                }
                
                // Pass fresh stats to checkAll if available
                AchievementsManager.checkAll();
            } catch (error) {
                console.warn('[DataUpdateManager] Achievement check failed:', error);
            }
        }
    },
    
    /**
     * Check and update challenges.
     */
    _checkChallenges: function() {
        if (typeof ChallengesManager !== 'undefined' && 
            typeof ChallengesManager.checkAll === 'function') {
            try {
                ChallengesManager.checkAll();
            } catch (error) {
                console.warn('[DataUpdateManager] Challenge check failed:', error);
            }
        }
    },
    
    /**
     * Update stats page if visible.
     */
    _updateStats: function() {
        // The stats page will update via the global event
        // No need to force refresh here
    },
    
    /**
     * Update leaderboard data.
     */
    _updateLeaderboard: function(type) {
        // Update personal records if tasbih changed
        if (type === 'tasbih') {
            this._updatePersonalRecords();
        }
    },
    
    /**
     * Update personal records with latest data.
     */
    _updatePersonalRecords: function() {
        try {
            var records = StorageManager.get('personal_records') || {};
            var stats = typeof RecoveryCounter !== 'undefined' ? 
                RecoveryCounter.getRecoveryStats() : { totalDays: 0 };
            var tasbihData = StorageManager.get('tasbih_data') || {};
            var achievements = typeof AchievementsManager !== 'undefined' ? 
                AchievementsManager.getUnlocked() : [];
            
            var totalCount = Number(tasbihData.totalCount || 0);
            
            // Ensure totalCount is at least the sum of counts
            var counts = tasbihData.counts || {};
            var calculatedTotal = Number(counts.allahuAkbar || 0) + 
                                 Number(counts.alhamdulillah || 0) + 
                                 Number(counts.subhanAllah || 0);
            if (totalCount < calculatedTotal) {
                totalCount = calculatedTotal;
            }
            
            var updated = false;
            
            if (stats.totalDays > (records.longestStreak || 0)) {
                records.longestStreak = stats.totalDays;
                updated = true;
            }
            
            if (totalCount > (records.mostTasbih || 0)) {
                records.mostTasbih = totalCount;
                updated = true;
            }
            
            if (achievements.length > (records.achievements || 0)) {
                records.achievements = achievements.length;
                updated = true;
            }

            // Update bestQuiz
            var quizHistory = StorageManager.get('quiz_history') || [];
            var bestQuizScore = quizHistory.length > 0
                ? Math.max.apply(null, quizHistory.map(function (q) {
                    return Number(q.score || 0);
                }))
                : 0;
            if (bestQuizScore > (records.bestQuiz || 0)) {
                records.bestQuiz = bestQuizScore;
                updated = true;
            }
            
            if (updated) {
                StorageManager.set('personal_records', records);
            }
        } catch (error) {
            console.warn('[DataUpdateManager] Personal records update failed:', error);
        }
    },
    
    /**
     * Update UI on currently visible pages.
     */
    _updateUI: function(type) {
        // Update any visible page that needs refreshing
        if (typeof Router !== 'undefined' && typeof Router.getCurrentPage === 'function') {
            var currentPage = Router.getCurrentPage();
            
            // If on stats page, refresh it
            if (currentPage === 'stats' && typeof renderStatsPage === 'function') {
                // Only if the page is currently visible
                var mainContent = document.getElementById('main-content');
                if (mainContent && mainContent.querySelector('.stat-card')) {
                    // Update stats without full page reload if possible
                    // We'll use the event system instead
                }
            }
            
            // If on leaderboard page, refresh it
            if (currentPage === 'leaderboard' && typeof renderLeaderboardPage === 'function') {
                // Use event system
            }
        }
    },
    
    /**
     * Dispatch global event for all systems to listen to.
     */
    _dispatchEvent: function(type, detail) {
        try {
            var event = new CustomEvent('taeafiDataUpdated', {
                detail: {
                    type: type,
                    timestamp: Date.now(),
                    data: detail || {}
                }
            });
            window.dispatchEvent(event);
            
            // Also dispatch the old event for compatibility
            try {
                var recoveryEvent = new CustomEvent('recoveryUpdated', {
                    detail: {
                        reason: type,
                        timestamp: Date.now()
                    }
                });
                window.dispatchEvent(recoveryEvent);
            } catch (e) {}
            
        } catch (error) {
            console.warn('[DataUpdateManager] Event dispatch failed:', error);
        }
    },
    
    /**
     * Get the current tasbih total count directly from storage.
     * This is the source of truth.
     */
    getTasbihTotal: function() {
        var data = StorageManager.get('tasbih_data') || {};
        var total = Number(data.totalCount || 0);
        var counts = data.counts || {};
        var calculated = Number(counts.allahuAkbar || 0) + 
                        Number(counts.alhamdulillah || 0) + 
                        Number(counts.subhanAllah || 0);
        return Math.max(total, calculated);
    },
    
    /**
     * Get weekly tasbih count.
     * Used for weekly challenges.
     */
    getWeeklyTasbihCount: function() {
        var data = StorageManager.get('tasbih_data') || {};
        var history = data.history || [];
        var weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        var weeklyTotal = 0;
        
        // If we have session history with dates, use it
        // Otherwise, fall back to the current session count
        if (history.length > 0 && history[0].timestamp) {
            for (var i = 0; i < history.length; i++) {
                if (history[i].timestamp >= weekAgo) {
                    weeklyTotal += Number(history[i].count || 0);
                }
            }
        } else {
            // Fallback: if no timestamped history, estimate based on current session
            // This is a best-effort approach
            var currentSession = StorageManager.get('tasbih_session') || {};
            weeklyTotal = Number(currentSession.weeklyCount || 0);
        }
        
        return weeklyTotal;
    },
    
    /**
     * Get today's tasbih count.
     */
    getTodayTasbihCount: function() {
        var data = StorageManager.get('tasbih_data') || {};
        var history = data.history || [];
        var today = new Date().toDateString();
        var todayTotal = 0;
        
        for (var i = 0; i < history.length; i++) {
            var entryDate = history[i].date ? new Date(history[i].date).toDateString() : '';
            if (entryDate === today) {
                todayTotal += Number(history[i].count || 0);
            }
        }
        
        // If no history entries today, use current session total
        if (todayTotal === 0) {
            var currentSession = StorageManager.get('tasbih_session') || {};
            todayTotal = Number(currentSession.todayCount || 0);
        }
        
        return todayTotal;
    }
};

// Initialize DataUpdateManager
DataUpdateManager._updatePersonalRecords();

// Listen for recovery updates
window.addEventListener('recoveryUpdated', function(e) {
    // Personal records may need updating
    DataUpdateManager._updatePersonalRecords();
});

// Listen for data updates from all sources
window.addEventListener('taeafiDataUpdated', function(e) {
    // Update personal records on any data change
    DataUpdateManager._updatePersonalRecords();
});

// _updatePersonalRecords: function()