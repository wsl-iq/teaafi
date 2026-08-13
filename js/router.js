/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : router.js
 * Type   : JavaScript
 *
 * Router responsibilities:
 * - SPA page navigation
 * - Real browser / WebView back navigation
 * - Safe page caching
 * - Page transition animation
 * - Navigation state synchronization
 */

class Router {

    // Current page / navigation state

    static #currentPage = 'home';
    static #isNavigating = false;
    static #initialized = false;
    static #historyIndex = 0;

    // Pages that contain live/dynamic data and therefore must
    // always be rendered again instead of restoring old HTML.
    static #noCachePages = [
        'home',
        'habits',
        'recovery',
        'calendar',
        'tasbih',
        'stats',
        'journal',
        'breath',
        'habit-detail'
    ];

    // Page cache storage.
    static #pageCache = new Map();

    // Page registry

    static #pages = {
        home: 'renderHomePage',
        habits: 'renderHabitsPage',
        'habit-detail': 'renderHabitDetail',
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
        'food-conflicts': 'renderFoodConflictsPage',

        // Optional page added by the prayer-assistant feature.
        // It is harmless if the render function is not loaded yet.
        forgetfulness: 'renderForgetfulnessPage'
    };

    // Initialization

    static init() {
        if (this.#initialized) {
            return;
        }

        this.#initialized = true;
        this.#installTransitionStyles();

        const hashPage = this.#getPageFromHash();
        const requestedPage = hashPage && this.#pages[hashPage]
            ? hashPage
            : 'home';

        const existingState = window.history.state;

        // Create one clean application history entry.
        // This is important for Android/WebView hardware back.
        if (!existingState || existingState.__taeafiRouter !== true) {
            window.history.replaceState(
                {
                    __taeafiRouter: true,
                    page: requestedPage,
                    index: 0
                },
                '',
                `#${requestedPage}`
            );

            this.#historyIndex = 0;
        } else {
            this.#historyIndex = Number.isInteger(existingState.index)
                ? existingState.index
                : 0;
        }

        this.#currentPage = requestedPage;

        // Keep the current page state synchronized without creating
        // another history entry.
        this.#updateNavState(requestedPage);
    }

    // Back button

    static #addBackButton(container) {
        if (!container || container.querySelector('.back-button')) {
            return;
        }

        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.type = 'button';
        backButton.innerHTML = '<i class="fas fa-arrow-right"></i> رجوع';

        // IMPORTANT:
        // Do not navigate directly to home.
        // Use real browser/WebView history so:
        // settings -> calendar -> settings -> home
        // behaves correctly.
        backButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.back();
        });

        container.insertBefore(backButton, container.firstChild);
    }

    /**
     * Real application back action.
     *
     * Android/WebView/browser will trigger popstate after history.back().
     * We deliberately do NOT call navigateTo() directly here.
     */
    static back() {
        if (this.#currentPage === 'home') {
            return false;
        }

        const state = window.history.state;

        if (
            state &&
            state.__taeafiRouter === true &&
            this.#historyIndex > 0
        ) {
            window.history.back();
            return true;
        }

        // Safety fallback for old sessions without our history state.
        this.navigateTo('home', {
            historyMode: 'replace',
            direction: 'back'
        });

        return true;
    }

    // Cache

    static #cacheCurrentPage(mainContent) {
        if (!this.#currentPage || !mainContent) {
            return;
        }

        // Dynamic pages must never be cached.
        if (this.#noCachePages.includes(this.#currentPage)) {
            return;
        }

        if (!mainContent.innerHTML.trim()) {
            return;
        }

        this.#pageCache.set(
            this.#currentPage,
            mainContent.innerHTML
        );
    }

    static #restorePage(page, mainContent) {
        if (!this.#pageCache.has(page)) {
            return false;
        }

        const cachedHTML = this.#pageCache.get(page);

        if (!cachedHTML) {
            return false;
        }

        mainContent.innerHTML = cachedHTML;
        return true;
    }

    // Navigation

    /**
     * Navigate to a page.
     *
     * historyMode:
     * - push    : normal navigation, creates a history entry
     * - pop     : browser/WebView back, does NOT create an entry
     * - replace : replace current history entry
     */
    static navigateTo(page, options = {}) {
        const {
            historyMode = 'push',
            direction = 'forward',
            params = null
        } = options;

        if (!this.#pages[page]) {
            console.error('Page not found:', page);
            return false;
        }

        const mainContent = document.getElementById('main-content');

        if (!mainContent) {
            console.error('main-content not found.');
            return false;
        }

        // Prevent two click/tap handlers from replacing the DOM at once.
        if (this.#isNavigating) {
            return false;
        }

        // Same page: don't rebuild it.
        if (this.#currentPage === page && historyMode === 'push') {
            mainContent.scrollTop = 0;
            return true;
        }

        const previousPage = this.#currentPage;
        const previousIndex = this.#historyIndex;

        this.#isNavigating = true;

        try {
            // Save current static page before leaving it.
            this.#cacheCurrentPage(mainContent);

            // History management

            if (historyMode === 'push') {
                const nextIndex = previousIndex + 1;

                window.history.pushState(
                    {
                        __taeafiRouter: true,
                        page,
                        previous: previousPage,
                        index: nextIndex
                    },
                    '',
                    `#${page}`
                );

                this.#historyIndex = nextIndex;
            }

            else if (historyMode === 'replace') {
                window.history.replaceState(
                    {
                        __taeafiRouter: true,
                        page,
                        previous: previousPage,
                        index: previousIndex
                    },
                    '',
                    `#${page}`
                );
            }

            // For historyMode=pop, the browser already changed history.state.
            if (historyMode === 'pop') {
                const state = window.history.state;

                if (
                    state &&
                    state.__taeafiRouter === true &&
                    Number.isInteger(state.index)
                ) {
                    this.#historyIndex = state.index;
                }
            }

            this.#currentPage = page;
            this.#updateNavState(page);

            // Render / restore

            const canUseCache =
                this.#pageCache.has(page) &&
                !this.#noCachePages.includes(page);

            let rendered = false;

            if (canUseCache) {
                rendered = this.#restorePage(page, mainContent);
            }

            if (!rendered) {
                // Dynamic pages are always fresh.
                if (this.#noCachePages.includes(page)) {
                    this.#pageCache.delete(page);
                }

                const renderFunction = this.#pages[page];

                if (typeof window[renderFunction] !== 'function') {
                    console.error(
                        `Render function "${renderFunction}" not found.`
                    );

                    // Restore the previous logical state if rendering failed.
                    this.#currentPage = previousPage;
                    this.#historyIndex = previousIndex;

                    if (historyMode === 'push') {
                        window.history.back();
                    }

                    return false;
                }

                mainContent.innerHTML = '';

                if (page === 'habit-detail') {
                    const habitType = params?.habitType ||
                        window.history.state?.habitType;

                    if (!habitType) {
                        console.error('Habit detail type is missing.');
                        return false;
                    }

                    window.__taeafiRouterRenderingHabitDetail = true;

                    try {
                        window[renderFunction](habitType);
                    } finally {
                        window.__taeafiRouterRenderingHabitDetail = false;
                    }
                } else {
                    window[renderFunction]();
                }
            }

            // Add the internal back button after the page exists.
            if (page !== 'home' && page !== 'habit-detail') {
                const container =
                    mainContent.querySelector('.animate-fade-in') ||
                    mainContent.querySelector('.page-container') ||
                    mainContent.firstElementChild;

                if (container) {
                    this.#addBackButton(container);
                }
            }

            // Scroll to top without smooth scrolling. Smooth scrolling here
            // can combine with page animation and feel like a WebView shake.
            mainContent.scrollTop = 0;

            // Page transition
            this.#playTransition(mainContent, direction);

            // Save last visited page, but don't use it as navigation state.
            if (
                typeof StorageManager !== 'undefined' &&
                typeof StorageManager.set === 'function'
            ) {
                StorageManager.set('last_page', page);
            }

            return true;

        } finally {
            this.#isNavigating = false;
        }
    }

    // Transition animation

    static #installTransitionStyles() {
        if (document.getElementById('taeafi-router-transition-style')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'taeafi-router-transition-style';
        style.textContent = `
            #main-content.taeafi-page-transition-forward {
                animation: taeafiPageEnterForward 220ms ease-out both;
            }

            #main-content.taeafi-page-transition-back {
                animation: taeafiPageEnterBack 220ms ease-out both;
            }

            @keyframes taeafiPageEnterForward {
                from {
                    opacity: 0;
                    transform: translateX(7px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes taeafiPageEnterBack {
                from {
                    opacity: 0;
                    transform: translateX(-7px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @media (prefers-reduced-motion: reduce) {
                #main-content.taeafi-page-transition-forward,
                #main-content.taeafi-page-transition-back {
                    animation: none;
                }
            }
        `;

        document.head.appendChild(style);
    }

    static #playTransition(mainContent, direction) {
        const className = direction === 'back'
            ? 'taeafi-page-transition-back'
            : 'taeafi-page-transition-forward';

        mainContent.classList.remove(
            'taeafi-page-transition-forward',
            'taeafi-page-transition-back'
        );

        // Force a reflow so repeated navigation restarts the animation.
        void mainContent.offsetWidth;

        mainContent.classList.add(className);

        const cleanup = () => {
            mainContent.classList.remove(className);
        };

        mainContent.addEventListener(
            'animationend',
            cleanup,
            { once: true }
        );
    }

    // Habit detail navigation

    /**
     * Opens a habit detail page as a real history entry.
     *
     * The habit cards in habits.js call renderHabitDetail() directly,
     * so habit-detail.js redirects that call here. This gives the
     * detail screen its own history entry and makes both the Android
     * Back button and the in-page Back button work correctly.
     */
    static openHabitDetail(habitType) {
        if (!habitType) {
            return false;
        }

        const mainContent = document.getElementById('main-content');

        if (!mainContent) {
            return false;
        }

        if (this.#isNavigating) {
            return false;
        }

        this.#isNavigating = true;

        try {
            const previousPage = this.#currentPage;
            const previousIndex = this.#historyIndex;
            const nextIndex = previousIndex + 1;

            this.#cacheCurrentPage(mainContent);

            window.history.pushState(
                {
                    __taeafiRouter: true,
                    page: 'habit-detail',
                    previous: previousPage,
                    index: nextIndex,
                    habitType: habitType
                },
                '',
                `#habit-detail/${encodeURIComponent(habitType)}`
            );

            this.#historyIndex = nextIndex;
            this.#currentPage = 'habit-detail';
            this.#updateNavState('habits');

            const renderFunction = this.#pages['habit-detail'];

            if (typeof window[renderFunction] !== 'function') {
                console.error(`Render function "${renderFunction}" not found.`);
                window.history.back();
                return false;
            }

            mainContent.innerHTML = '';

            // Tell renderHabitDetail() that Router is already managing
            // the history entry, so it must only render the content.
            window.__taeafiRouterRenderingHabitDetail = true;

            try {
                window[renderFunction](habitType);
            } finally {
                window.__taeafiRouterRenderingHabitDetail = false;
            }

            mainContent.scrollTop = 0;
            this.#playTransition(mainContent, 'forward');

            if (
                typeof StorageManager !== 'undefined' &&
                typeof StorageManager.set === 'function'
            ) {
                StorageManager.set('last_page', 'habit-detail');
            }

            return true;
        } finally {
            this.#isNavigating = false;
        }
    }

    // Home

    static goHome() {
        if (this.#currentPage === 'home') {
            return true;
        }

        // Real history navigation: do not manufacture a new home entry.
        return this.back();
    }

    // Navigation state

    static #updateNavState(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle(
                'active',
                item.dataset.page === page
            );
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle(
                'active',
                link.dataset.page === page
            );
        });
    }

    static getCurrentPage() {
        return this.#currentPage;
    }

    static getHistoryIndex() {
        return this.#historyIndex;
    }

    // Cache controls

    static clearPageCache(page) {
        this.#pageCache.delete(page);
    }

    static clearAllPageCache() {
        this.#pageCache.clear();
    }

    // URL / hash helpers

    static #getPageFromHash() {
        const hash = window.location.hash.replace(/^#/, '').trim();
        return hash || 'home';
    }
}

// Legacy global functions

function navigateTo(page) {
    // Kept for compatibility with the existing HTML pages.
    if (typeof cleanupCounter === 'function') {
        try {
            cleanupCounter();
        } catch (error) {
            console.warn('cleanupCounter failed:', error);
        }
    }

    return Router.navigateTo(page, {
        historyMode: 'push',
        direction: 'forward'
    });
}

function goHome() {
    return Router.goHome();
}

// Browser / Android WebView Back

window.addEventListener('popstate', function (event) {
    const state = event.state;

    // A history entry created by this router.
    if (
        state &&
        state.__taeafiRouter === true &&
        state.page &&
        Router.getCurrentPage() !== state.page
    ) {
        const targetIndex = Number.isInteger(state.index)
            ? state.index
            : 0;

        const currentIndex = Router.getHistoryIndex();

        Router.navigateTo(state.page, {
            historyMode: 'pop',
            direction: targetIndex < currentIndex ? 'back' : 'forward',
            params: state.page === 'habit-detail'
                ? { habitType: state.habitType }
                : null
        });

        return;
    }

    // If a WebView/browser reaches an old entry that doesn't have
    // our state, safely render home without pushing another entry.
    if (Router.getCurrentPage() !== 'home') {
        Router.navigateTo('home', {
            historyMode: 'replace',
            direction: 'back'
        });
    }
});

// Initialize after the DOM is available.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Router.init();
    }, { once: true });
} else {
    Router.init();
}
