/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : router.js
 * Type: JavaScript
 */

class Router {

    // Current page
    static #currentPage = 'home';
    
    // Pages that should NOT be cached (rebuilt every time)
    static #noCachePages = [
        'home',
        'habits',
        'recovery', 
        'calendar',
        'tasbih',
        'stats',
        'journal',
        'breath'
    ];
    
    // Page cache storage
    static #pageCache = new Map();

    /**
     * Create and add back button to page
     */
    static #addBackButton(container) {
        if (!container || container.querySelector('.back-button')) {
            return;
        }
        
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.innerHTML = '<i class="fas fa-arrow-right"></i> رجوع';
        backButton.onclick = () => {
            this.navigateTo('home');
        };
        
        container.insertBefore(backButton, container.firstChild);
    }

    // Page registry: page name → render function
    static #pages = {
        home: 'renderHomePage',
        habits: 'renderHabitsPage',
        spiritual: 'renderSpiritualPage',
        recovery: 'renderRecoveryPage',
        policies: 'renderPoliciesPage',
        tasbih: 'renderTasbihPage',
        stats: 'renderStatsPage',
        quiz: 'renderQuizPage',
        duas: 'renderDuasPage',
        settings: 'renderSettingsPage',
        leaderboard: 'renderLeaderboardPage',
        journal: 'renderJournalPage',
        breath: 'renderBreathGamePage',
        'prayer-box': 'renderPrayerBoxPage',
        calendar: 'renderCalendarPage',
        nutrition: 'renderNutritionPage',
        exercises: 'renderExercisesPage',
        'food-conflicts': 'renderFoodConflictsPage'
    };

    /**
     * Cache current page HTML
     */
    static #cacheCurrentPage(mainContent) {
        if (!this.#currentPage || !mainContent) return;
        
        // Skip dynamic pages
        if (this.#noCachePages.includes(this.#currentPage)) return;
        
        // Already cached
        if (this.#pageCache.has(this.#currentPage)) return;

        // Store page HTML
        this.#pageCache.set(
            this.#currentPage,
            mainContent.innerHTML
        );
    }

    /**
     * Restore page from cache
     */
    static #restorePage(page, mainContent) {
        const cachedHTML = this.#pageCache.get(page);
        if (!cachedHTML) return false;
        
        mainContent.innerHTML = cachedHTML;
        return true;
    }

    /**
     * Navigate to a page
     */
    static navigateTo(page) {
        // Validate page exists
        if (!this.#pages[page]) {
            console.error('Page not found:', page);
            return;
        }

        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('main-content not found.');
            return;
        }

        // Same page, no action needed
        if (this.#currentPage === page && this.#pageCache.has(page)) {
            mainContent.scrollTop = 0;
            return;
        }

        // Cache current page before leaving
        this.#cacheCurrentPage(mainContent);

        // Update current page
        const previousPage = this.#currentPage;
        this.#currentPage = page;

        // Update navigation indicators
        this.#updateNavState(page);

        // Push to browser history
        if (!window.history.state || window.history.state.page !== page) {
            window.history.pushState(
                { page: page, previous: previousPage },
                '',
                `#${page}`
            );
        }

        // Render page (from cache or fresh)
        if (this.#pageCache.has(page) && !this.#noCachePages.includes(page)) {
            // Restore from cache
            this.#restorePage(page, mainContent);
        } else {
            // Clear cache for dynamic pages
            if (this.#noCachePages.includes(page)) {
                this.#pageCache.delete(page);
            }
            
            // Call render function
            const renderFunction = this.#pages[page];
            if (typeof window[renderFunction] !== 'function') {
                console.error(`Render function "${renderFunction}" not found.`);
                return;
            }

            // Clear old content
            mainContent.innerHTML = '';
            
            // Render page
            window[renderFunction]();
            
            // Cache after rendering
            setTimeout(() => {
                this.#cacheCurrentPage(mainContent);
            }, 100);
        }

        // Add back button to all pages except home
        setTimeout(() => {
            if (page !== 'home') {
                const container = mainContent.querySelector('.animate-fade-in') || 
                                 mainContent.querySelector('.page-container') ||
                                 mainContent.firstElementChild;
                
                if (container) {
                    this.#addBackButton(container);
                }
            }
        }, 150);

        mainContent.scrollTop = 0;

        // Save last visited page
        if (typeof StorageManager !== 'undefined' && typeof StorageManager.set === 'function') {
            StorageManager.set('last_page', page);
        }
    }

    /**
     * Go back to home page
     */
    static goHome() {
        this.navigateTo('home');
    }

    /**
     * Update bottom nav and sidebar active states
     */
    static #updateNavState(page) {
        // Bottom Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });

        // Sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Get current page name
     */
    static getCurrentPage() {
        return this.#currentPage;
    }

    /**
     * Clear cache for a specific page
     */
    static clearPageCache(page) {
        this.#pageCache.delete(page);
    }

    /**
     * Clear all page cache
     */
    static clearAllPageCache() {
        this.#pageCache.clear();
    }
}

/**
 * Legacy navigateTo function - kept for backward compatibility
 */
function navigateTo(page) {
    if (typeof cleanupCounter === 'function') {
        cleanupCounter();
    }
    Router.navigateTo(page);
}

/**
 * Go to home page
 */
function goHome() {
    Router.goHome();
}

// Browser back button support
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        Router.navigateTo(event.state.page);
    } else {
        // No history - go home
        Router.navigateTo('home');
    }
});