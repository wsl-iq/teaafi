/**
 * Developer: Mohammed Al-Baqer
 * Website: https://wsl-iq.github.io/teaafi/
 * Copyright (c) 2026 Mohammed Al-Baqer
 * Folder : data
 * File   : relapse-analysis.js
 * Type   : JavaScript
 */

var RELAPSE_TRIGGERS = [
    { id: 'stress',       title: 'التوتر والضغط النفسي',   icon: 'fa-brain' },
    { id: 'loneliness',   title: 'الوحدة',                  icon: 'fa-user-slash' },
    { id: 'boredom',      title: 'الملل',                    icon: 'fa-clock' },
    { id: 'lateNight',    title: 'السهر ليلاً',             icon: 'fa-moon' },
    { id: 'phone',        title: 'الهاتف / الإنترنت',       icon: 'fa-mobile-screen' },
    { id: 'family',       title: 'مشاكل عائلية',            icon: 'fa-users' },
    { id: 'financial',    title: 'مشاكل مالية',              icon: 'fa-wallet' },
    { id: 'provocative',  title: 'محتوى محرّض',             icon: 'fa-eye-slash' },
    { id: 'sleep',        title: 'قلة النوم',                icon: 'fa-bed' },
    { id: 'anger',        title: 'الغضب',                    icon: 'fa-angry' },
    { id: 'sadness',      title: 'الحزن',                    icon: 'fa-sad-tear' },
    { id: 'other',        title: 'أخرى',                     icon: 'fa-ellipsis-h' }
];

var RELAPSE_FEELINGS = [
    { id: 'regret',    title: 'نادم',              icon: 'fa-sad-cry',         color: '#F44336' },
    { id: 'frustrated', title: 'محبط',             icon: 'fa-tired',           color: '#FF9800' },
    { id: 'neutral',   title: 'عادي',              icon: 'fa-meh',             color: '#FFC107' },
    { id: 'determined', title: 'مصمم على التعويض', icon: 'fa-fire',            color: '#4CAF50' }
];

var RelapseAnalysisStorage = {
    KEY: 'relapse_analysis_data',

    /**
     * Get all stored analysis records.
     */
    getAll: function () {
        try {
            var data = StorageManager.get(this.KEY) || {};
            return data.records || [];
        } catch (e) {
            return [];
        }
    },

    /**
     * Save a new analysis record.
     * @param {object} record - { habitType, trigger, feeling, lesson, timestamp }
     */
    save: function (record) {
        if (!record) return false;

        try {
            var data = StorageManager.get(this.KEY) || { records: [] };
            if (!Array.isArray(data.records)) data.records = [];

            var newRecord = {
                id: 'ra_' + Date.now(),
                habitType: record.habitType || 'unknown',
                trigger: record.trigger || 'other',
                feeling: record.feeling || 'neutral',
                lesson: String(record.lesson || '').substring(0, 500),
                timestamp: record.timestamp || Date.now(),
                date: new Date(record.timestamp || Date.now()).toISOString(),
                hour: new Date(record.timestamp || Date.now()).getHours(),
                dayOfWeek: new Date(record.timestamp || Date.now()).getDay()
            };

            data.records.push(newRecord);

            // Limit to last 500 records
            if (data.records.length > 500) {
                data.records = data.records.slice(-500);
            }

            data.updatedAt = Date.now();
            StorageManager.set(this.KEY, data);

            return newRecord;
        } catch (e) {
            console.warn('[RelapseAnalysis] Save failed:', e);
            return false;
        }
    },

    /**
     * Get records filtered by habit type.
     * @param {string} habitType - optional
     */
    getByHabit: function (habitType) {
        var all = this.getAll();
        if (!habitType) return all;
        return all.filter(function (r) { return r.habitType === habitType; });
    },

    /**
     * Get records from the last N days.
     */
    getRecent: function (days, habitType) {
        var cutoff = Date.now() - (days * 86400000);
        return this.getByHabit(habitType).filter(function (r) {
            return r.timestamp >= cutoff;
        });
    },

    /**
     * Clear all analysis data.
     */
    clear: function () {
        StorageManager.set(this.KEY, { records: [], updatedAt: Date.now() });
    },

    /*
     * ANALYTICS
     */

    /**
     * Get top triggers with counts and percentages.
     */
    getTopTriggers: function (habitType, days) {
        var records = days ? this.getRecent(days, habitType) : this.getByHabit(habitType);
        var counts = {};

        records.forEach(function (r) {
            counts[r.trigger] = (counts[r.trigger] || 0) + 1;
        });

        var total = records.length;
        var result = Object.keys(counts).map(function (id) {
            return {
                id: id,
                count: counts[id],
                percent: total > 0 ? Math.round((counts[id] / total) * 100) : 0
            };
        });

        result.sort(function (a, b) { return b.count - a.count; });

        return result;
    },

    /**
     * Get dangerous hours distribution.
     */
    getDangerousHours: function (habitType, days) {
        var records = days ? this.getRecent(days, habitType) : this.getByHabit(habitType);
        var buckets = {
            'morning':   { label: 'الصباح (6-12)',  count: 0, icon: 'fa-sun' },
            'afternoon': { label: 'الظهر (12-18)', count: 0, icon: 'fa-cloud-sun' },
            'evening':   { label: 'المساء (18-24)', count: 0, icon: 'fa-cloud-moon' },
            'night':     { label: 'الليل (0-6)',    count: 0, icon: 'fa-moon' }
        };

        records.forEach(function (r) {
            var h = r.hour;
            if (h >= 6 && h < 12) buckets.morning.count++;
            else if (h >= 12 && h < 18) buckets.afternoon.count++;
            else if (h >= 18 && h < 24) buckets.evening.count++;
            else buckets.night.count++;
        });

        return buckets;
    },

    /**
     * Get dangerous days of the week.
     */
    getDangerousDays: function (habitType, days) {
        var records = days ? this.getRecent(days, habitType) : this.getByHabit(habitType);
        var dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        var counts = [0, 0, 0, 0, 0, 0, 0];

        records.forEach(function (r) {
            counts[r.dayOfWeek]++;
        });

        return dayNames.map(function (name, i) {
            return { day: name, index: i, count: counts[i] };
        });
    },

    /**
     * Get feeling distribution.
     */
    getFeelingsDistribution: function (habitType, days) {
        var records = days ? this.getRecent(days, habitType) : this.getByHabit(habitType);
        var counts = {};

        records.forEach(function (r) {
            counts[r.feeling] = (counts[r.feeling] || 0) + 1;
        });

        var total = records.length;
        return Object.keys(counts).map(function (id) {
            return {
                id: id,
                count: counts[id],
                percent: total > 0 ? Math.round((counts[id] / total) * 100) : 0
            };
        });
    },

    /**
     * Get overall statistics.
     */
    getStats: function (habitType) {
        var records = this.getByHabit(habitType);

        if (records.length === 0) {
            return {
                total: 0,
                hasData: false,
                lastRelapse: null,
                topTrigger: null,
                dangerousHour: null,
                dangerousDay: null
            };
        }

        var triggers = this.getTopTriggers(habitType);
        var hours = this.getDangerousHours(habitType);
        var days = this.getDangerousDays(habitType);

        var topTrigger = triggers.length > 0 ? triggers[0].id : null;
        var dangerousHour = Object.keys(hours).reduce(function (max, key) {
            return hours[key].count > hours[max].count ? key : max;
        }, 'morning');
        var dangerousDay = days.reduce(function (max, d) {
            return d.count > max.count ? d : max;
        }, days[0]);

        return {
            total: records.length,
            hasData: true,
            lastRelapse: records[records.length - 1].timestamp,
            topTrigger: topTrigger,
            dangerousHour: dangerousHour,
            dangerousDay: dangerousDay.day,
            records: records
        };
    },

    /**
     * Get human-readable label for a trigger ID.
     */
    getTriggerLabel: function (id) {
        var t = RELAPSE_TRIGGERS.find(function (x) { return x.id === id; });
        return t ? t.title : id;
    },

    /**
     * Get human-readable label for a feeling ID.
     */
    getFeelingLabel: function (id) {
        var f = RELAPSE_FEELINGS.find(function (x) { return x.id === id; });
        return f ? f.title : id;
    }
};