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
    /*
     * Cache Specific to the content of the pages.
     * example:
     * home → HTML
     * settings → HTML 
     * calendar → HTML 
     */
    static #pageCache = new Map();

    /**
     * Create a back button
     * It is added automatically to each page.
     */
    static #addBackButton(container) {
        // Make sure the button is not already there
        if (container.querySelector('.back-button')) {
            return;
        }
        
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.innerHTML = '<i class="fas fa-arrow-right"></i> رجوع';
        backButton.onclick = () => window.history.back();
        
        // Add the button at the top of the page
        container.insertBefore(backButton, container.firstChild);
    }

    /*
     * A list of pages and their (Render) functions.
     */
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

    static #cacheCurrentPage(mainContent) {
        if (
            !this.#currentPage ||
            !mainContent ||
            this.#pageCache.has(this.#currentPage)
        ) {
            return;
        }

        this.#pageCache.set(
            this.#currentPage,
            mainContent.innerHTML
        );
        console.log(
            `[Router] Cached page: ${this.#currentPage}`
        );
    }

    static #restorePage(page, mainContent) {
        console.log(`[Router] Restoring cached page: ${page}`);
        mainContent.innerHTML = this.#pageCache.get(page);
    }

    /**
     * Go to page
     */
    static navigateTo(page) {
        // Make sure the page exists
        if (!this.#pages[page]) {
            console.error(
                'Page not found:',
                page
            );
            return;
        }

        // Get main-content
        const mainContent = document.getElementById('main-content');

        // security
        if (!mainContent) {
            console.error(
                'main-content not found.'
            );
            return;
        }

        if (
            this.#currentPage === page &&
            this.#pageCache.has(page)
        ) {
            mainContent.scrollTop = 0;
            return;
        }

        // Save current page
        this.#cacheCurrentPage(mainContent);

        // Refresh the current page.
        this.#currentPage = page;

        // update Navigation.
        this.#updateNavState(page);

        // Added to history
        window.history.pushState(
            { page: page },
            '',
            `#${page}`
        );

        // Restore or create page
        if (this.#pageCache.has(page)) {
            this.#restorePage(page, mainContent);
        } else {
            const renderFunction = this.#pages[page];

            if (
                typeof window[renderFunction] !== 'function'
            ) {
                console.error(
                    `Render function "${renderFunction}" not found.`
                );
                return;
            }

            window[renderFunction]();
            this.#cacheCurrentPage(mainContent);
        }

        // Add a back button automatically (for all pages except home)
        if (page !== 'home') {
            const container =
                mainContent.querySelector('.animate-fade-in') ||
                mainContent.firstChild;

            if (container) {
                this.#addBackButton(container);
            }
        }

        mainContent.scrollTop = 0;

        /*
         * save last page
         */
        if (
            typeof StorageManager !== 'undefined' &&
            typeof StorageManager.set === 'function'
        ) {
            StorageManager.set(
                'last_page',
                page
            );
        }
    }

    /**
     * update Navigation
     */
    static #updateNavState(page) {
        /*
         * Bottom Navigation
         */
        document
            .querySelectorAll('.nav-item')
            .forEach(item => {
                item.classList.remove('active');

                if (
                    item.dataset.page === page
                ) {
                    item.classList.add('active');
                }
            });

        /*
         * Sidebar
         */
        document
            .querySelectorAll('.nav-link')
            .forEach(link => {
                link.classList.remove('active');

                if (
                    link.dataset.page === page
                ) {
                    link.classList.add('active');
                }
            });
    }

    /**
     * Get the current page
     */
    static getCurrentPage() {
        return this.#currentPage;
    }

    /**
     * Delete the cache of a specific page
     * Use this if you want to force a page to re-render.
     * Example:
     * Router.clearPageCache('calendar');
     */
    static clearPageCache(page) {
        this.#pageCache.delete(page);
        console.log(`[Router] Cache cleared: ${page}`);
    }

    /**
     
     * Delete all page cache
     
     */
    static clearAllPageCache() {
        this.#pageCache.clear();
        console.log('[Router] All page cache cleared.');
    }
}

/**
 * navigateTo old
 *
 * We keep it that way so that the whole project remains compatible.
 * Anywhere you have:
 * navigateTo('settings');
 * It will continue to operate.
 */
function navigateTo(page) {
    /*
     * clear Counter if exit
     */
    if (typeof cleanupCounter === 'function') {
        cleanupCounter();
    }

    /*
     * using Router modren.
     */
    Router.navigateTo(page);
}

// Support for the (back) button in the browser and device

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        Router.navigateTo(event.state.page);
    }
});

// Prevent exit when returning to the homepage
window.addEventListener('beforeunload', function(e) {
     // If there are previous pages, we do not display a warning.
    // You can modify this as needed.
});