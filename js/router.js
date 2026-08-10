/**
 * Developer: Mohammed Al-Baqer
 * Folder : js
 * File   : router.js
 *
 * نظام التنقل بين صفحات تطبيق تعافي
 *
 * الحل:
 * - كل صفحة يتم Render لها أول مرة فقط.
 * - HTML الخاص بالصفحة يتم حفظه في Cache.
 * - عند الرجوع للصفحة يتم استرجاع HTML المحفوظ.
 * - هذا يمنع إعادة بناء الصفحة من الصفر.
 */
class Router {

    // الصفحة الحالية
    static #currentPage = 'home';

    /*
     * Cache خاص بمحتوى الصفحات.
     *
     * مثال:
     *
     * home → HTML الصفحة الرئيسية
     * settings → HTML الإعدادات
     * calendar → HTML التقويم
     */
    static #pageCache = new Map();

    /*
     * قائمة الصفحات ودوال Render الخاصة بها.
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

    /**
     * =====================================================
     * الانتقال إلى صفحة
     * =====================================================
     */
    static navigateTo(page) {
        // التأكد أن الصفحة موجودة
        if (!this.#pages[page]) {
            console.error(
                'Page not found:',
                page
            );
            return;
        }

        // الحصول على main-content
        const mainContent = document.getElementById('main-content');

        // حماية
        if (!mainContent) {
            console.error(
                'main-content not found.'
            );
            return;
        }

        /*
         * إذا المستخدم ضغط على نفس الصفحة
         * لا نعيد Render.
         */
        if (this.#currentPage === page) {
            mainContent.scrollTop = 0;
            return;
        }

        /*
         * -------------------------------------------------
         * إذا الصفحة موجودة في Cache
         * -------------------------------------------------
         *
         * نسترجع HTML القديم مباشرة.
         *
         * ملاحظة:
         * هذا يحافظ على حالة HTML نفسها،
         * لكنه لا يحافظ على JavaScript event listeners
         * التي تم ربطها مباشرة بالعناصر.
         *
         * لذلك بعض الصفحات قد تحتاج إعادة تهيئة
         * JavaScript بعد الرجوع إليها.
         */
        if (this.#pageCache.has(page)) {
            console.log(`[Router] Restoring cached page: ${page}`);

            /*
             * إعادة HTML المحفوظ.
             */
            mainContent.innerHTML = this.#pageCache.get(page);
        } else {
            /*
             * -------------------------------------------------
             * الصفحة تفتح لأول مرة
             * -------------------------------------------------
             */
            const renderFunction = this.#pages[page];

            if (
                typeof window[renderFunction] !== 'function'
            ) {
                console.error(
                    `Render function "${renderFunction}" not found.`
                );
                return;
            }

            /*
             * تشغيل دالة الصفحة.
             *
             * مثال:
             *
             * renderSettingsPage()
             */
            window[renderFunction]();

            /*
             * بعد انتهاء الـ Render:
             *
             * نحفظ HTML الصفحة داخل Cache.
             */
            this.#pageCache.set(
                page,
                mainContent.innerHTML
            );
            console.log(`[Router] Cached page: ${page}`);
        }

        /*
         * تحديث الصفحة الحالية.
         */
        this.#currentPage = page;

        /*
         * تحديث Navigation.
         */
        this.#updateNavState(page);

        /*
         * إرجاع Scroll إلى الأعلى.
         */
        mainContent.scrollTop = 0;

        /*
         * حفظ آخر صفحة.
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
     * =====================================================
     * تحديث Navigation
     * =====================================================
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
     * =====================================================
     * الحصول على الصفحة الحالية
     * =====================================================
     */
    static getCurrentPage() {
        return this.#currentPage;
    }

    /**
     * =====================================================
     * حذف Cache صفحة معينة
     *
     * استخدمها إذا أردت إجبار صفحة على إعادة Render.
     *
     * مثال:
     *
     * Router.clearPageCache('calendar');
     * =====================================================
     */
    static clearPageCache(page) {
        this.#pageCache.delete(page);
        console.log(`[Router] Cache cleared: ${page}`);
    }

    /**
     * =====================================================
     * حذف Cache جميع الصفحات
     * =====================================================
     */
    static clearAllPageCache() {
        this.#pageCache.clear();
        console.log('[Router] All page cache cleared.');
    }
}

/**
 * =========================================================
 * navigateTo القديمة
 * =========================================================
 *
 * نخليها حتى كل المشروع يبقى متوافق.
 *
 * أي مكان عندك:
 *
 * navigateTo('settings');
 *
 * سيستمر بالعمل.
 * =========================================================
 */
function navigateTo(page) {
    /*
     * تنظيف Counter عند الخروج.
     */
    if (typeof cleanupCounter === 'function') {
        cleanupCounter();
    }

    /*
     * استخدام Router الجديد.
     */
    Router.navigateTo(page);
}

