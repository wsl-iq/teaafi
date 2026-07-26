class Router {
    static #currentPage = 'home';
    static #pages = {
        home: 'renderHomePage',
        habits: 'renderHabitsPage',
        spiritual: 'renderSpiritualPage',
        recovery: 'renderRecoveryPage',
        tasbih: 'renderTasbihPage',  // إضافة صفحة التسبيح
        settings: 'renderSettingsPage'
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
    Router.navigateTo(page);
}