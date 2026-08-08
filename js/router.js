/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : router.js
 * Type: JavaScript
 */

class Router {
    static #currentPage = 'home';
    static #pages = {
        home: 'renderHomePage',
        habits: 'renderHabitsPage',
        spiritual: 'renderSpiritualPage',
        recovery: 'renderRecoveryPage',
        policies: 'renderPoliciesPage', 
        tasbih: 'renderTasbihPage', 
        stats: 'renderStatsPage',       
        quiz: 'renderQuizPage',        
        settings: 'renderSettingsPage',
        leaderboard: 'renderLeaderboardPage',
        journal: 'renderJournalPage',
        breath: 'renderBreathGamePage',
        'prayer-box': 'renderPrayerBoxPage',
        calendar: 'renderCalendarPage'
    };
    
    static navigateTo(page) {
        if (!this.#pages[page]) {
            console.error('Page not found:', page);
            return;
        }
        
        this.#currentPage = page;
        
        // Update navigation active states
        this.#updateNavState(page);
        
        // Render page
        const renderFunction = this.#pages[page];
        if (typeof window[renderFunction] === 'function') {
            window[renderFunction]();
        }
        
        // Scroll to top
        document.getElementById('main-content').scrollTop = 0;
        
        // Save last page
        StorageManager.set('last_page', page);
    }
    
    static #updateNavState(page) {
        // Update bottom nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Update sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }
    
    static getCurrentPage() {
        return this.#currentPage;
    }
}

function navigateTo(page) {
    // clear Timer if Exit
    if (typeof cleanupCounter === 'function') {
        cleanupCounter();
    }
    
    document.querySelectorAll('.nav-item, .nav-link').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) item.classList.add('active');
    });
    
    switch(page) {
        case 'home': renderHomePage(); break;
        case 'habits': renderHabitsPage(); break;
        case 'spiritual': renderSpiritualPage(); break;
        case 'tasbih': renderTasbihPage(); break;
        case 'recovery': renderRecoveryPage(); break;
        case 'policies': renderPoliciesPage(); break;
        case 'stats': renderStatsPage(); break;    
        case 'quiz': renderQuizPage(); break;       
        case 'duas': renderDuasPage(); break;
        case 'settings': renderSettingsPage(); break;
        case 'leaderboard': renderLeaderboardPage(); break;
        case 'journal': renderJournalPage(); break;
        case 'breath': renderBreathGamePage(); break;
        case 'prayer-box': renderPrayerBoxPage(); break;
        case 'calendar': renderCalendarPage(); break;
        case 'nutrition': renderNutritionPage(); break;
        case 'exercises': renderExercisesPage(); break;
        case 'food-conflicts': renderFoodConflictsPage(); break;
    }
    
    document.getElementById('main-content').scrollTop = 0;
}