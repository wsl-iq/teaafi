/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : js
 * File   : search.js
 * Type   : JavaScript
 *
 * Advanced search engine with:
 * - Arabic text normalization
 * - Token-based indexing
 * - Relevance scoring
 * - Type filters
 * - Keyboard navigation
 * - Debounced input
 */

var SearchEngine = {
    index: {},           // key → { title, icon, color, type, ... , _tokens, _normalized }
    invertedIndex: {},   // token → [keys]
    initialized: false,
    recentSearches: [],
    _cache: {},
    _debounceTimer: null,
    _activeResultIndex: -1,
    _currentResults: [],

    /*
     * INITIALIZATION
     **/

    init: function () {
        if (this.initialized) return;
        this.buildIndex();
        this.loadRecentSearches();
        this.initialized = true;
    },

    loadRecentSearches: function () {
        try {
            var saved = StorageManager.get('search_recent') || [];
            this.recentSearches = Array.isArray(saved) ? saved : [];
        } catch (e) {
            this.recentSearches = [];
        }
    },

    saveRecentSearch: function (query) {
        query = String(query || '').trim();
        if (!query || query.length < 2) return;

        this.recentSearches = this.recentSearches.filter(function (q) {
            return q !== query;
        });
        this.recentSearches.unshift(query);
        this.recentSearches = this.recentSearches.slice(0, 8);

        try {
            StorageManager.set('search_recent', this.recentSearches);
        } catch (e) {}
    },

    /*
     * ARABIC TEXT NORMALIZATION
     **/

    /**
     * Normalize Arabic text for search:
     * - Removes diacritics (tashkeel)
     * - Normalizes alef (أ إ آ → ا)
     * - Normalizes teh marbuta (ة → ه)
     * - Normalizes yeh (ى → ي)
     * - Removes tatweel (ـ)
     * - Lowercases Latin
     * - Collapses whitespace
     */
    normalize: function (text) {
        if (text == null) return '';

        var s = String(text);

        s = s.replace(/[\u064B-\u0652\u0670\u0640]/g, '');  // Remove Arabic diacritics
        s = s.replace(/[أإآٱ]/g, 'ا');                    // Normalize alef variants
        s = s.replace(/ة/g, 'ه');                        // Normalize teh marbuta
        s = s.replace(/ى/g, 'ي');                       // Normalize alef maqsura
        s = s.replace(/ؤ/g, 'و');                      // Normalize hamza
        s = s.replace(/ئ/g, 'ي');                     // Normalize hamza
        s = s.toLowerCase();                         // Lowercase
        s = s.replace(/\s+/g, ' ').trim();          // Collapse whitespace

        return s;
    },

    /**
     * Tokenize text into words.
     * Also removes common Arabic prefixes for better matching:
     * و، ف، ب، ك، ل، ال
     */
    tokenize: function (text) {
        var normalized = this.normalize(text);
        if (!normalized) return [];

        var words = normalized.split(/[\s،,\.\:\;\!\?\(\)\[\]\{\}\|\/\-]+/);

        var tokens = [];
        var seen = {};

        for (var i = 0; i < words.length; i++) {
            var w = words[i];
            if (!w || w.length < 2) continue;

            // Add original token
            if (!seen[w]) {
                tokens.push(w);
                seen[w] = true;
            }

            // Add variant without Arabic prefixes
            var stripped = w.replace(/^(وال|بال|كال|فال|ال|و|ف|ب|ك|ل)/, '');
            if (stripped && stripped.length >= 2 && !seen[stripped]) {
                tokens.push(stripped);
                seen[stripped] = true;
            }
        }

        return tokens;
    },

    /*
     * INDEX BUILDING
     **/

    collectText: function (value, depth) {
        depth = depth || 0;
        if (depth > 6) return '';

        if (typeof value === 'string') {
            return value + ' ';
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
            return '';
        }
        if (Array.isArray(value)) {
            var result = '';
            for (var i = 0; i < value.length; i++) {
                result += this.collectText(value[i], depth + 1);
            }
            return result;
        }
        if (value && typeof value === 'object') {
            var result = '';
            for (var prop in value) {
                if (value.hasOwnProperty(prop)) {
                    result += this.collectText(value[prop], depth + 1);
                }
            }
            return result;
        }
        return '';
    },

    /**
     * Add a single entry to the index.
     */
    addToIndex: function (key, entry) {
        if (!key || !entry || !entry.title) return;

        // Build searchable text
        var searchable = (entry.title || '') + ' ' + (entry.subtitle || '') + ' ' + (entry.keywords || '');
        var normalized = this.normalize(searchable);
        var tokens = this.tokenize(searchable);

        entry._normalized = normalized;
        entry._tokens = tokens;
        entry._key = key;

        this.index[key] = entry;

        // Update inverted index
        for (var i = 0; i < tokens.length; i++) {
            var t = tokens[i];
            if (!this.invertedIndex[t]) {
                this.invertedIndex[t] = [];
            }
            if (this.invertedIndex[t].indexOf(key) === -1) {
                this.invertedIndex[t].push(key);
            }
        }
    },

    buildIndex: function () {
        var self = this;

        this.index = {};
        this.invertedIndex = {};

        /* Habits */
        if (typeof HABIT_CONTENT !== 'undefined') {
            for (var key in HABIT_CONTENT) {
                if (!HABIT_CONTENT.hasOwnProperty(key)) continue;
                var habit = HABIT_CONTENT[key];
                this.addToIndex('habit_' + key, {
                    title: habit.title,
                    subtitle: 'عادة ضارة',
                    icon: habit.icon || 'fa-hand',
                    color: habit.color || '#0D6B6E',
                    type: 'habit',
                    typeLabel: 'عادة',
                    habitId: key,
                    keywords: this.collectText(habit)
                });
            }
        }

        /* Adhkar */
        if (typeof ADHKAR_DATA !== 'undefined') {
            for (var category in ADHKAR_DATA) {
                if (!ADHKAR_DATA.hasOwnProperty(category)) continue;

                var catItems = ADHKAR_DATA[category];
                var catTitle = this.getAdhkarCategoryName(category);
                var catIcon = this.getAdhkarCategoryIcon(category);
                var catColor = this.getAdhkarCategoryColor(category);

                // Category entry
                this.addToIndex('adhkar_' + category, {
                    title: catTitle,
                    subtitle: 'أذكار',
                    icon: catIcon,
                    color: catColor,
                    type: 'dhikr',
                    typeLabel: 'أذكار',
                    category: category,
                    keywords: this.collectText(catItems)
                });

                // Individual items (if array of objects with .text)
                if (Array.isArray(catItems)) {
                    catItems.forEach(function (item, idx) {
                        if (item && item.text) {
                            self.addToIndex('adhkar_item_' + category + '_' + idx, {
                                title: item.text.substring(0, 60) + (item.text.length > 60 ? '...' : ''),
                                subtitle: catTitle + (item.source ? ' — ' + item.source : ''),
                                icon: catIcon,
                                color: catColor,
                                type: 'dhikr',
                                typeLabel: 'ذكر',
                                category: category,
                                itemIndex: idx,
                                keywords: item.text + ' ' + (item.source || '')
                            });
                        }
                    });
                }
            }
        }

        /* Duas */
        if (typeof DUAS_DATA !== 'undefined') {
            for (var section in DUAS_DATA) {
                if (!DUAS_DATA.hasOwnProperty(section)) continue;
                var sectionData = DUAS_DATA[section];

                this.addToIndex('duas_' + section, {
                    title: sectionData.title,
                    subtitle: section === 'ziyarat' ? 'زيارات' : 'أدعية',
                    icon: sectionData.icon || 'fa-book-open',
                    color: sectionData.color || '#4A148C',
                    type: 'dua',
                    typeLabel: section === 'ziyarat' ? 'زيارة' : 'دعاء',
                    category: section,
                    keywords: this.collectText(sectionData)
                });

                if (sectionData.items && Array.isArray(sectionData.items)) {
                    sectionData.items.forEach(function (item) {
                        self.addToIndex('dua_item_' + item.id, {
                            title: item.title,
                            subtitle: item.source || '',
                            icon: item.icon || 'fa-hands-praying',
                            color: sectionData.color || '#4A148C',
                            type: 'dua',
                            typeLabel: section === 'ziyarat' ? 'زيارة' : 'دعاء',
                            category: section,
                            itemId: item.id,
                            keywords: self.collectText(item)
                        });
                    });
                }
            }
        }

        /* Nutrition */
        if (typeof NUTRITION_DATA !== 'undefined') {
            ['breakfast', 'lunch', 'dinner'].forEach(function (meal) {
                if (!NUTRITION_DATA[meal]) return;
                ['male', 'female'].forEach(function (gender) {
                    var meals = NUTRITION_DATA[meal][gender];
                    if (!Array.isArray(meals)) return;

                    meals.forEach(function (m) {
                        self.addToIndex('nutrition_' + meal + '_' + gender + '_' + m.day, {
                            title: m.meal,
                            subtitle: (meal === 'breakfast' ? 'فطور' : meal === 'lunch' ? 'غداء' : 'عشاء') +
                                      ' — ' + m.calories + ' سعرة',
                            icon: meal === 'breakfast' ? 'fa-sun' : meal === 'lunch' ? 'fa-utensils' : 'fa-moon',
                            color: '#FF9800',
                            type: 'nutrition',
                            typeLabel: 'تغذية',
                            keywords: m.meal + ' ' + (m.budget || '') + ' ' + (m.protein || '')
                        });
                    });
                });
            });
        }

        /* Exercises */
        if (typeof EXERCISE_DATA !== 'undefined') {
            ['male', 'female'].forEach(function (gender) {
                var daily = EXERCISE_DATA[gender] && EXERCISE_DATA[gender].daily;
                if (Array.isArray(daily)) {
                    daily.forEach(function (ex) {
                        self.addToIndex('exercise_' + gender + '_' + ex.name, {
                            title: ex.name,
                            subtitle: ex.duration + ' — ' + ex.calories + ' سعرة',
                            icon: ex.icon || 'fa-dumbbell',
                            color: '#4CAF50',
                            type: 'exercise',
                            typeLabel: 'تمرين',
                            keywords: ex.name + ' ' + ex.level + ' ' + ex.duration
                        });
                    });
                }
            });
        }

        /* Food Conflicts */
        if (typeof FOOD_CONFLICTS !== 'undefined' && Array.isArray(FOOD_CONFLICTS)) {
            FOOD_CONFLICTS.forEach(function (c, idx) {
                if (c.severity === 'آمن') return;
                self.addToIndex('conflict_' + idx, {
                    title: c.combo,
                    subtitle: c.effect,
                    icon: 'fa-skull-crossbones',
                    color: '#F44336',
                    type: 'conflict',
                    typeLabel: 'تعارض',
                    keywords: c.combo + ' ' + c.effect + ' ' + c.severity
                });
            });
        }

        /* Quiz Questions */
        if (typeof QuizData !== 'undefined' && Array.isArray(QuizData.allQuestions)) {
            QuizData.allQuestions.forEach(function (q) {
                self.addToIndex('quiz_' + q.id, {
                    title: q.text,
                    subtitle: 'سؤال تقييم',
                    icon: 'fa-clipboard-check',
                    color: '#FF9800',
                    type: 'quiz',
                    typeLabel: 'سؤال',
                    keywords: q.text + ' ' + q.options.join(' ')
                });
            });
        }

        /* Achievements */
        if (typeof ACHIEVEMENTS !== 'undefined') {
            for (var aKey in ACHIEVEMENTS) {
                if (!ACHIEVEMENTS.hasOwnProperty(aKey)) continue;
                var a = ACHIEVEMENTS[aKey];
                this.addToIndex('achievement_' + aKey, {
                    title: a.title,
                    subtitle: a.description,
                    icon: a.icon || 'fa-trophy',
                    color: a.color || '#FFD700',
                    type: 'achievement',
                    typeLabel: 'إنجاز',
                    keywords: a.title + ' ' + a.description
                });
            }
        }

        /* Challenges */
        if (typeof WEEKLY_CHALLENGES !== 'undefined' && Array.isArray(WEEKLY_CHALLENGES)) {
            WEEKLY_CHALLENGES.forEach(function (c) {
                self.addToIndex('challenge_' + c.id, {
                    title: c.title,
                    subtitle: c.description,
                    icon: c.icon || 'fa-fire',
                    color: c.color || '#FF9800',
                    type: 'challenge',
                    typeLabel: 'تحدي',
                    keywords: c.title + ' ' + c.description + ' ' + (c.reward || '')
                });
            });
        }

        /* 21-Day Tasks */
        if (typeof TWENTY_ONE_DAY_TASKS !== 'undefined' && Array.isArray(TWENTY_ONE_DAY_TASKS)) {
            TWENTY_ONE_DAY_TASKS.forEach(function (section) {
                if (!Array.isArray(section.tasks)) return;
                section.tasks.forEach(function (task) {
                    self.addToIndex('21day_' + task.id, {
                        title: task.title,
                        subtitle: section.title,
                        icon: task.icon || 'fa-check',
                        color: '#E91E63',
                        type: '21day',
                        typeLabel: 'تحدي 21',
                        keywords: task.title + ' ' + section.title + ' ' + (section.description || '')
                    });
                });
            });
        }

        /* Relapse Triggers */
        if (typeof RELAPSE_TRIGGERS !== 'undefined' && Array.isArray(RELAPSE_TRIGGERS)) {
            RELAPSE_TRIGGERS.forEach(function (t) {
                self.addToIndex('trigger_' + t.id, {
                    title: t.title,
                    subtitle: 'محفز انتكاسة',
                    icon: t.icon || 'fa-exclamation',
                    color: '#F44336',
                    type: 'trigger',
                    typeLabel: 'محفز',
                    keywords: t.title
                });
            });
        }

        /* App Pages (for direct navigation) */
        var PAGES = [
            { id: 'home', title: 'الرئيسية', icon: 'fa-home', color: '#0D6B6E' },
            { id: 'habits', title: 'العادات', icon: 'fa-hands', color: '#0D6B6E' },
            { id: 'recovery', title: 'رحلة التعافي', icon: 'fa-chart-line', color: '#4CAF50' },
            { id: 'tasbih', title: 'التسبيح', icon: 'fa-fingerprint', color: '#4CAF50' },
            { id: 'spiritual', title: 'التحصين الإيماني', icon: 'fa-mosque', color: '#4CAF50' },
            { id: 'duas', title: 'الأدعية والزيارات', icon: 'fa-book-open', color: '#4A148C' },
            { id: 'stats', title: 'الإحصائيات', icon: 'fa-chart-pie', color: '#2196F3' },
            { id: 'quiz', title: 'التقييم الذاتي', icon: 'fa-clipboard-check', color: '#FF9800' },
            { id: 'journal', title: 'مذكراتي', icon: 'fa-pen-fancy', color: '#E91E63' },
            { id: 'leaderboard', title: 'لوحة المتصدرين', icon: 'fa-crown', color: '#FFD700' },
            { id: 'calendar', title: 'روزنامة التعافي', icon: 'fa-calendar-check', color: '#4CAF50' },
            { id: 'nutrition', title: 'التغذية الصحية', icon: 'fa-utensils', color: '#FF9800' },
            { id: 'exercises', title: 'الرياضة اليومية', icon: 'fa-dumbbell', color: '#4CAF50' },
            { id: 'food-conflicts', title: 'تعارضات الطعام', icon: 'fa-skull-crossbones', color: '#F44336' },
            { id: '21-day', title: 'تحدي 21 يوم', icon: 'fa-fire', color: '#E91E63' },
            { id: 'relapse-analysis', title: 'تحليل الانتكاسات', icon: 'fa-chart-pie', color: '#F44336' },
            { id: 'breath', title: 'تحدي النفس', icon: 'fa-wind', color: '#00BCD4' },
            { id: 'prayer-box', title: 'صندوق دعائي', icon: 'fa-hands-praying', color: '#4A148C' },
            { id: 'forgetfulness', title: 'مساعد الصلاة', icon: 'fa-person-praying', color: '#9C27B0' },
            { id: 'settings', title: 'الإعدادات', icon: 'fa-cog', color: '#6B7280' },
            { id: 'policies', title: 'السياسات والقوانين', icon: 'fa-shield-alt', color: '#1565C0' }
        ];

        PAGES.forEach(function (p) {
            self.addToIndex('page_' + p.id, {
                title: p.title,
                subtitle: 'صفحة',
                icon: p.icon,
                color: p.color,
                type: 'page',
                typeLabel: 'صفحة',
                pageId: p.id,
                keywords: p.title
            });
        });

        /* User Journal Entries */
        try {
            var entries = StorageManager.get('journal_entries') || [];
            if (Array.isArray(entries)) {
                entries.forEach(function (e, idx) {
                    if (!e || !e.text) return;
                    self.addToIndex('journal_' + idx + '_' + e.date, {
                        title: e.text.substring(0, 60) + (e.text.length > 60 ? '...' : ''),
                        subtitle: 'مذكرة — ' + e.date,
                        icon: 'fa-pen-fancy',
                        color: '#E91E63',
                        type: 'journal',
                        typeLabel: 'مذكرة',
                        journalDate: e.date,
                        keywords: e.text
                    });
                });
            }
        } catch (e) {}

        /* User Personal Duas */
        try {
            var prayers = StorageManager.get('my_prayers') || [];
            if (Array.isArray(prayers)) {
                prayers.forEach(function (p, idx) {
                    if (!p || !p.text) return;
                    self.addToIndex('prayer_' + idx, {
                        title: p.text.substring(0, 60) + (p.text.length > 60 ? '...' : ''),
                        subtitle: 'صندوق دعائي' + (p.note ? ' — ' + p.note : ''),
                        icon: 'fa-hands-praying',
                        color: '#4A148C',
                        type: 'prayer',
                        typeLabel: 'دعاء خاص',
                        prayerIndex: idx,
                        keywords: p.text + ' ' + (p.note || '')
                    });
                });
            }
        } catch (e) {}

        console.log('[Search] Index built with ' + Object.keys(this.index).length + ' entries');
    },

    /*
     * ADHKAR CATEGORY META
     **/

    getAdhkarCategoryName: function (category) {
        var names = {
            morning: 'أذكار الصباح',
            evening: 'أذكار المساء',
            repentance: 'أدعية التوبة والاستغفار',
            steadfastness: 'أدعية الثبات على الإيمان',
            protection: 'أدعية التحصين والحفظ',
            verses: 'آيات قرآنية',
            hadith: 'أحاديث شريفة',
            prophet_sayings: 'أقوال النبي محمد (صلى الله عليه وآله)',
            imam_ali_sayings: 'حكم الإمام علي (عليه السلام)',
            ahlulbayt_duas: 'أدعية ومناجاة أهل البيت (عليهم السلام)'
        };
        return names[category] || category;
    },

    getAdhkarCategoryIcon: function (category) {
        var icons = {
            morning: 'fa-sun',
            evening: 'fa-moon',
            repentance: 'fa-hand-holding-heart',
            steadfastness: 'fa-anchor',
            protection: 'fa-shield-alt',
            verses: 'fa-quran',
            hadith: 'fa-scroll',
            prophet_sayings: 'fa-star',
            imam_ali_sayings: 'fa-crown',
            ahlulbayt_duas: 'fa-hands-praying'
        };
        return icons[category] || 'fa-mosque';
    },

    getAdhkarCategoryColor: function (category) {
        var colors = {
            morning: '#FF9800',
            evening: '#5C6BC0',
            repentance: '#F44336',
            steadfastness: '#0D6B6E',
            protection: '#4CAF50',
            verses: '#9C27B0',
            hadith: '#795548',
            prophet_sayings: '#FFD700',
            imam_ali_sayings: '#4CAF50',
            ahlulbayt_duas: '#E91E63'
        };
        return colors[category] || '#0D6B6E';
    },

    /*
     * SEARCH
     **/

    /**
     * Perform a search query.
     * Returns array of results sorted by relevance.
     *
     * @param {string} query
     * @param {object} options — { type: 'all' | 'habit' | 'dua' | ... }
     * @returns {Array}
     */
    search: function (query, options) {
        if (!this.initialized) this.init();

        options = options || {};
        var filterType = options.type || 'all';

        var q = this.normalize(query);
        if (!q) return [];

        var qTokens = this.tokenize(q);
        if (qTokens.length === 0) return [];

        // For single-character query, only match titles starting with it
        var isShortQuery = q.length < 2;

        var candidateKeys = {};
        var results = [];

        // Gather candidates from inverted index
        for (var i = 0; i < qTokens.length; i++) {
            var token = qTokens[i];
            var keys = this.invertedIndex[token] || [];
            for (var k = 0; k < keys.length; k++) {
                candidateKeys[keys[k]] = true;
            }

            // Prefix matching: also include tokens that start with this token
            if (token.length >= 3) {
                for (var fullToken in this.invertedIndex) {
                    if (fullToken.indexOf(token) === 0 && fullToken !== token) {
                        var prefixKeys = this.invertedIndex[fullToken];
                        for (var p = 0; p < prefixKeys.length; p++) {
                            candidateKeys[prefixKeys[p]] = true;
                        }
                    }
                }
            }
        }

        // Score each candidate
        for (var cKey in candidateKeys) {
            if (!candidateKeys.hasOwnProperty(cKey)) continue;

            var item = this.index[cKey];
            if (!item) continue;
            if (filterType !== 'all' && item.type !== filterType) continue; // Apply type filter

            var score = this.scoreItem(item, q, qTokens);
            if (score > 0) {
                results.push({
                    id: cKey,
                    title: item.title,
                    subtitle: item.subtitle || '',
                    icon: item.icon,
                    color: item.color,
                    type: item.type,
                    typeLabel: item.typeLabel || '',
                    habitId: item.habitId,
                    category: item.category,
                    itemId: item.itemId,
                    itemIndex: item.itemIndex,
                    pageId: item.pageId,
                    journalDate: item.journalDate,
                    prayerIndex: item.prayerIndex,
                    score: score
                });
            }
        }

        // Sort by score (descending), then by title length (shorter first)
        results.sort(function (a, b) {
            if (b.score !== a.score) return b.score - a.score;
            return a.title.length - b.title.length;
        });

        return results.slice(0, 30);
    },

    /**
     * Calculate relevance score for an item.
     * Higher is better.
     */
    scoreItem: function (item, query, qTokens) {
        var score = 0;
        var normalizedTitle = this.normalize(item.title || '');
        var normalizedSubtitle = this.normalize(item.subtitle || '');

        // Exact title match
        if (normalizedTitle === query) {
            score += 200;
        }
        // Title starts with query
        else if (normalizedTitle.indexOf(query) === 0) {
            score += 120;
        }
        // Title contains query
        else if (normalizedTitle.indexOf(query) !== -1) {
            score += 80;
        }

        // Subtitle contains query
        if (normalizedSubtitle.indexOf(query) !== -1) {
            score += 40;
        }

        // Token-level scoring
        for (var i = 0; i < qTokens.length; i++) {
            var token = qTokens[i];

            // Whole-word match in title
            if (normalizedTitle.split(/\s+/).indexOf(token) !== -1) {
                score += 30;
            }
            // Prefix match in title
            else if (normalizedTitle.indexOf(token) !== -1) {
                score += 15;
            }

            // Whole-word match in subtitle
            if (normalizedSubtitle.split(/\s+/).indexOf(token) !== -1) {
                score += 10;
            }

            // Match in full keywords (weakest)
            if (item._normalized && item._normalized.indexOf(token) !== -1) {
                score += 3;
            }
        }

        // Bonus: type priority
        var typeBonus = {
            page: 10,
            habit: 8,
            dua: 6,
            dhikr: 5,
            nutrition: 4,
            exercise: 4,
            quiz: 3,
            achievement: 2,
            challenge: 2,
            conflict: 2,
            trigger: 1,
            journal: 1,
            prayer: 1,
            '21day': 1
        };
        score += typeBonus[item.type] || 0;

        return score;
    },

    /*
     * SEARCH UI
     **/

    showSearchUI: function () {
        // If already open, close it
        var existing = document.getElementById('search-overlay');
        if (existing) {
            existing.remove();
            return;
        }

        var self = this;
        this._activeResultIndex = -1;
        this._currentResults = [];

        var overlay = document.createElement('div');
        overlay.id = 'search-overlay';
        overlay.className = 'search-overlay';
        overlay.innerHTML =
            '<div class="search-container">' +
                '<div class="search-header">' +
                    '<i class="fas fa-search" style="color: var(--text-tertiary);"></i>' +
                    '<input type="text" id="search-input" ' +
                           'placeholder="ابحث عن عادة، دعاء، ذكر، صفحة، وجبة..." ' +
                           'autofocus autocomplete="off">' +
                    '<button type="button" class="search-close-btn" onclick="document.getElementById(\'search-overlay\').remove()">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                '</div>' +
                '<div class="search-filters" id="search-filters">' +
                    '<button type="button" class="search-filter-btn active" data-type="all">الكل</button>' +
                    '<button type="button" class="search-filter-btn" data-type="habit">عادات</button>' +
                    '<button type="button" class="search-filter-btn" data-type="dua">أدعية</button>' +
                    '<button type="button" class="search-filter-btn" data-type="dhikr">أذكار</button>' +
                    '<button type="button" class="search-filter-btn" data-type="page">صفحات</button>' +
                    '<button type="button" class="search-filter-btn" data-type="nutrition">تغذية</button>' +
                    '<button type="button" class="search-filter-btn" data-type="quiz">أسئلة</button>' +
                '</div>' +
                '<div id="search-results" class="search-results"></div>' +
            '</div>';

        document.body.appendChild(overlay);

        var input = document.getElementById('search-input');
        var resultsDiv = document.getElementById('search-results');
        var filtersDiv = document.getElementById('search-filters');

        var currentType = 'all';

        // Initial state: recent searches + hint
        this.renderInitialState(resultsDiv);

        // Input handler (debounced)
        input.addEventListener('input', function () {
            if (self._debounceTimer) clearTimeout(self._debounceTimer);

            self._debounceTimer = setTimeout(function () {
                var query = input.value.trim();

                if (!query) {
                    self.renderInitialState(resultsDiv);
                    return;
                }

                var results = self.search(query, { type: currentType });
                self._currentResults = results;
                self._activeResultIndex = -1;
                self.renderResults(resultsDiv, results, query);
            }, 180);
        });

        // Filters
        filtersDiv.addEventListener('click', function (e) {
            var btn = e.target.closest('.search-filter-btn');
            if (!btn) return;

            filtersDiv.querySelectorAll('.search-filter-btn').forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            currentType = btn.dataset.type;

            var query = input.value.trim();
            if (query) {
                var results = self.search(query, { type: currentType });
                self._currentResults = results;
                self._activeResultIndex = -1;
                self.renderResults(resultsDiv, results, query);
            }
        });

        // Keyboard navigation
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                self.moveActive(resultsDiv, 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                self.moveActive(resultsDiv, -1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                self.openActiveResult();
            }
        });

        // Click outside
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) overlay.remove();
        });
    },

    renderInitialState: function (resultsDiv) {
        var self = this;
        var html = '';

        if (this.recentSearches.length > 0) {
            html +=
                '<div class="search-section-title">' +
                    '<i class="fas fa-history" style="margin-left: 4px;"></i> بحث سابق' +
                '</div>';
            html += '<div class="search-recent-list">';
            this.recentSearches.forEach(function (q) {
                html +=
                    '<button type="button" class="search-recent-item" ' +
                            'onclick="document.getElementById(\'search-input\').value = ' + JSON.stringify(q) + '; ' +
                            'document.getElementById(\'search-input\').dispatchEvent(new Event(\'input\'));">' +
                        '<i class="fas fa-search" style="opacity: 0.5;"></i> ' +
                        self.escapeHtml(q) +
                    '</button>';
            });
            html += '</div>';
        }

        html +=
            '<div class="search-section-title">' +
                '<i class="fas fa-lightbulb" style="margin-left: 4px;"></i> اقتراحات' +
            '</div>' +
            '<div class="search-suggestions">' +
                '<button type="button" class="search-suggestion" onclick="document.getElementById(\'search-input\').value = \'التدخين\'; document.getElementById(\'search-input\').dispatchEvent(new Event(\'input\'));">التدخين</button>' +
                '<button type="button" class="search-suggestion" onclick="document.getElementById(\'search-input\').value = \'دعاء كميل\'; document.getElementById(\'search-input\').dispatchEvent(new Event(\'input\'));">دعاء كميل</button>' +
                '<button type="button" class="search-suggestion" onclick="document.getElementById(\'search-input\').value = \'أذكار الصباح\'; document.getElementById(\'search-input\').dispatchEvent(new Event(\'input\'));">أذكار الصباح</button>' +
                '<button type="button" class="search-suggestion" onclick="document.getElementById(\'search-input\').value = \'تسبيح\'; document.getElementById(\'search-input\').dispatchEvent(new Event(\'input\'));">تسبيح</button>' +
                '<button type="button" class="search-suggestion" onclick="document.getElementById(\'search-input\').value = \'تحدي 21\'; document.getElementById(\'search-input\').dispatchEvent(new Event(\'input\'));">تحدي 21</button>' +
            '</div>';

        resultsDiv.innerHTML = html;
    },

    renderResults: function (resultsDiv, results, query) {
        if (results.length === 0) {
            resultsDiv.innerHTML =
                '<div class="search-empty">' +
                    '<i class="fas fa-search"></i>' +
                    '<p>لا توجد نتائج لـ <strong>"' + this.escapeHtml(query) + '"</strong></p>' +
                    '<small>جرّب كلمة أخرى أو تحقق من الإملاء</small>' +
                '</div>';
            return;
        }

        var self = this;
        var html = '';

        // Group by type
        var groups = {};
        results.forEach(function (r) {
            if (!groups[r.type]) groups[r.type] = [];
            groups[r.type].push(r);
        });

        var typeLabels = {
            page: 'صفحات التطبيق',
            habit: 'العادات',
            dua: 'الأدعية والزيارات',
            dhikr: 'الأذكار',
            nutrition: 'التغذية',
            exercise: 'التمارين',
            conflict: 'تعارضات الطعام',
            quiz: 'أسئلة التقييم',
            achievement: 'الإنجازات',
            challenge: 'التحديات',
            trigger: 'محفزات الانتكاسة',
            journal: 'مذكراتي',
            prayer: 'صندوق دعائي',
            '21day': 'تحدي 21 يوم'
        };

        var order = ['page', 'habit', 'dua', 'dhikr', 'nutrition', 'exercise', 'quiz',
                     'challenge', 'achievement', '21day', 'trigger', 'conflict',
                     'journal', 'prayer'];

        var globalIndex = 0;

        order.forEach(function (type) {
            var list = groups[type];
            if (!list || list.length === 0) return;

            html += '<div class="search-section-title">' +
                        self.escapeHtml(typeLabels[type] || type) +
                    '</div>';

            list.slice(0, 8).forEach(function (r) {
                var highlighted = self.highlight(r.title, query);
                var subtitle = r.subtitle ? self.highlight(r.subtitle, query) : '';

                html +=
                    '<div class="search-result-item" data-result-index="' + globalIndex + '" ' +
                         'onclick="SearchEngine.openResultById(\'' + r.id + '\')">' +
                        '<div class="search-result-icon" style="background:' + r.color + '15;">' +
                            '<i class="fas ' + r.icon + '" style="color:' + r.color + ';"></i>' +
                        '</div>' +
                        '<div class="search-result-content">' +
                            '<span class="search-result-title">' + highlighted + '</span>' +
                            (subtitle ? '<span class="search-result-subtitle">' + subtitle + '</span>' : '') +
                        '</div>' +
                        '<small class="search-result-type" style="background:' + r.color + '15;color:' + r.color + ';">' +
                            self.escapeHtml(r.typeLabel) +
                        '</small>' +
                    '</div>';

                globalIndex++;
            });

            if (list.length > 8) {
                html += '<div class="search-more-hint">و ' + (list.length - 8) + ' نتيجة أخرى...</div>';
            }
        });

        resultsDiv.innerHTML = html;
        this._currentResults = results;
        this._activeResultIndex = -1;
    },

    highlight: function (text, query) {
        var escaped = this.escapeHtml(text);
        if (!query) return escaped;

        var q = query.trim();
        if (!q) return escaped;

        // Try to highlight normalized matches
        var normalizedText = this.normalize(text);
        var normalizedQuery = this.normalize(q);
        var idx = normalizedText.indexOf(normalizedQuery);

        if (idx === -1) return escaped;

        // Since normalization may change character count, we use a safe approach:
        // highlight the original text's matched region by re-finding the token.
        // We do a simple substring highlight on the original text using the query.
        try {
            var escapedQuery = this.escapeHtml(q);
            var regex = new RegExp('(' + escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            return escaped.replace(regex, '<mark>$1</mark>');
        } catch (e) {
            return escaped;
        }
    },

    escapeHtml: function (text) {
        return String(text == null ? '' : text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    moveActive: function (resultsDiv, direction) {
        var items = resultsDiv.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        this._activeResultIndex += direction;
        if (this._activeResultIndex < 0) this._activeResultIndex = items.length - 1;
        if (this._activeResultIndex >= items.length) this._activeResultIndex = 0;

        items.forEach(function (el, i) {
            el.classList.toggle('active', i === this._activeResultIndex);
        }, this);

        var active = items[this._activeResultIndex];
        if (active && active.scrollIntoView) {
            active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    },

    openActiveResult: function () {
        if (this._activeResultIndex < 0) return;
        var result = this._currentResults[this._activeResultIndex];
        if (!result) return;
        this.openResultById(result.id);
    },

    /*
     * OPEN RESULT
     **/

    openResultById: function (id) {
        var item = this.index[id];
        if (!item) return;

        // Save search query
        var input = document.getElementById('search-input');
        if (input && input.value.trim()) {
            this.saveRecentSearch(input.value.trim());
        }

        // Close overlay
        var overlay = document.getElementById('search-overlay');
        if (overlay) overlay.remove();

        var self = this;

        // Route by type
        setTimeout(function () {
            self._navigate(item);
        }, 80);
    },

    _navigate: function (item) {
        switch (item.type) {
            case 'page':
                if (typeof navigateTo === 'function' && item.pageId) {
                    navigateTo(item.pageId);
                }
                break;

            case 'habit':
                if (typeof navigateTo === 'function' && item.habitId) {
                    navigateTo('habits');
                    setTimeout(function () {
                        if (typeof renderHabitDetail === 'function') {
                            renderHabitDetail(item.habitId);
                        }
                    }, 250);
                }
                break;

            case 'dua':
                if (item.category && item.itemId) {
                    if (typeof navigateTo === 'function') {
                        navigateTo('duas');
                        setTimeout(function () {
                            if (typeof renderDuaDetail === 'function') {
                                renderDuaDetail(item.category, item.itemId);
                            }
                        }, 300);
                    }
                } else if (typeof navigateTo === 'function') {
                    navigateTo('duas');
                }
                break;

            case 'dhikr':
                if (typeof navigateTo === 'function') navigateTo('spiritual');
                break;

            case 'nutrition':
                if (typeof navigateTo === 'function') navigateTo('nutrition');
                break;

            case 'exercise':
                if (typeof navigateTo === 'function') navigateTo('exercises');
                break;

            case 'conflict':
                if (typeof navigateTo === 'function') navigateTo('food-conflicts');
                break;

            case 'quiz':
                if (typeof navigateTo === 'function') navigateTo('quiz');
                break;

            case 'achievement':
                if (typeof navigateTo === 'function') navigateTo('stats');
                break;

            case 'challenge':
                if (typeof navigateTo === 'function') navigateTo('leaderboard');
                break;

            case '21day':
                if (typeof navigateTo === 'function') navigateTo('21-day');
                break;

            case 'trigger':
                if (typeof navigateTo === 'function') navigateTo('relapse-analysis');
                break;

            case 'journal':
                if (typeof navigateTo === 'function') navigateTo('journal');
                break;

            case 'prayer':
                if (typeof navigateTo === 'function') navigateTo('prayer-box');
                break;
        }
    },

    /**
     * Legacy openResult — kept for compatibility.
     */
    openResult: function (id, type, habitId, category, itemId) {
        var item = this.index[id];
        if (item) {
            this._navigate(item);
            return;
        }
        // Fallback
        if (type === 'habit' && habitId && typeof renderHabitDetail === 'function') {
            if (typeof navigateTo === 'function') navigateTo('habits');
            setTimeout(function () { renderHabitDetail(habitId); }, 200);
        } else if (type === 'dua') {
            if (typeof navigateTo === 'function') navigateTo('duas');
        } else if (type === 'dhikr') {
            if (typeof navigateTo === 'function') navigateTo('spiritual');
        }
    },

    /**
     * Rebuild the index (call after data changes).
     */
    rebuild: function () {
        this.initialized = false;
        this._cache = {};
        this.init();
    }
};

/*
 * SHORTCUT KEYS
 **/

document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + K → open search
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        SearchEngine.showSearchUI();
    }
    // Escape → close
    if (e.key === 'Escape') {
        var overlay = document.getElementById('search-overlay');
        if (overlay) overlay.remove();
    }
});

/*
 * STYLES
 **/

var searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.55);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 9999;
        display: flex;
        justify-content: center;
        padding-top: 60px;
        animation: searchFadeIn 0.2s ease;
    }

    @keyframes searchFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .search-container {
        background: var(--surface);
        border-radius: var(--radius-xl);
        width: 92%;
        max-width: 560px;
        max-height: 78vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: var(--shadow-2xl);
        animation: searchSlideIn 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
    }

    @keyframes searchSlideIn {
        from { opacity: 0; transform: translateY(-24px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .search-header {
        display: flex;
        align-items: center;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border-light);
        gap: 12px;
        flex-shrink: 0;
    }

    .search-header input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        background: transparent;
        color: var(--text-primary);
        font-family: var(--font-primary);
    }

    .search-header input::placeholder {
        color: var(--text-disabled);
    }

    .search-close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-tertiary);
        font-size: 16px;
        padding: 6px 8px;
        border-radius: 8px;
        transition: all 0.2s;
    }

    .search-close-btn:hover {
        background: var(--surface-variant);
        color: var(--text-primary);
    }

    .search-filters {
        display: flex;
        gap: 6px;
        padding: 10px 16px;
        overflow-x: auto;
        border-bottom: 1px solid var(--border-light);
        flex-shrink: 0;
        scrollbar-width: none;
    }

    .search-filters::-webkit-scrollbar {
        display: none;
    }

    .search-filter-btn {
        flex-shrink: 0;
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid var(--border-light);
        background: var(--surface-variant);
        color: var(--text-secondary);
        font-family: var(--font-primary);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .search-filter-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
    }

    .search-filter-btn.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
    }

    .search-results {
        flex: 1;
        overflow-y: auto;
        padding: 8px 0;
    }

    .search-section-title {
        padding: 10px 16px 6px;
        font-size: 11px;
        font-weight: 700;
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .search-result-item {
        display: flex;
        align-items: center;
        padding: 10px 16px;
        gap: 12px;
        cursor: pointer;
        transition: background 0.15s;
        border-right: 3px solid transparent;
    }

    .search-result-item:hover,
    .search-result-item.active {
        background: var(--surface-variant);
        border-right-color: var(--primary);
    }

    .search-result-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 16px;
    }

    .search-result-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .search-result-title {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .search-result-subtitle {
        font-size: 11px;
        color: var(--text-tertiary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .search-result-title mark,
    .search-result-subtitle mark {
        background: var(--primary-light);
        color: var(--primary);
        padding: 0 2px;
        border-radius: 3px;
    }

    .search-result-type {
        padding: 3px 8px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: 600;
        flex-shrink: 0;
    }

    .search-more-hint {
        padding: 6px 16px 10px;
        font-size: 11px;
        color: var(--text-tertiary);
        font-style: italic;
    }

    .search-empty {
        text-align: center;
        padding: 48px 20px;
    }

    .search-empty i {
        font-size: 44px;
        color: var(--text-disabled);
        margin-bottom: 14px;
        display: block;
    }

    .search-empty p {
        color: var(--text-secondary);
        font-size: 14px;
        margin-bottom: 6px;
    }

    .search-empty small {
        color: var(--text-tertiary);
        font-size: 12px;
    }

    .search-recent-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 0 16px 12px;
    }

    .search-recent-item {
        padding: 6px 12px;
        border-radius: 16px;
        border: 1px solid var(--border-light);
        background: var(--surface);
        color: var(--text-secondary);
        font-family: var(--font-primary);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .search-recent-item:hover {
        border-color: var(--primary);
        color: var(--primary);
    }

    .search-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 0 16px 16px;
    }

    .search-suggestion {
        padding: 6px 14px;
        border-radius: 16px;
        border: 1px solid var(--border-light);
        background: var(--surface-variant);
        color: var(--text-secondary);
        font-family: var(--font-primary);
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .search-suggestion:hover {
        background: var(--primary-light);
        border-color: var(--primary);
        color: var(--primary);
    }

    @media (max-width: 600px) {
        .search-overlay {
            padding-top: 12px;
        }
        .search-container {
            width: 96%;
            max-height: 90vh;
            border-radius: var(--radius-lg);
        }
        .search-header {
            padding: 12px 14px;
        }
        .search-header input {
            font-size: 15px;
        }
    }
`;

document.head.appendChild(searchStyles);
console.log('[Search] Advanced engine ready - Ctrl+K to search');