// Taeafi Optimization - Pure JavaScript
// No WASM, No Emscripten, No External Libraries
// Works everywhere: Browser, PWA, Android, Windows

var TaeafiWASM = (function() {
    'use strict';
    
    // Memory Pool
    var pool = null;
    var poolSize = 0;
    var poolPos = 0;
    
    function memInit(kb) {
        poolSize = kb * 1024;
        pool = new ArrayBuffer(poolSize);
        poolPos = 0;
    }
    
    function memAlloc(bytes) {
        if (!pool || poolPos + bytes > poolSize) return null;
        var ptr = poolPos;
        poolPos += bytes;
        return ptr;
    }
    
    function memReset() {
        poolPos = 0;
    }
    
    // Recovery
    function calcMilestones(days) {
        var count = 0;
        if (days >= 1) count++;
        if (days >= 3) count++;
        if (days >= 7) count++;
        if (days >= 14) count++;
        if (days >= 30) count++;
        if (days >= 60) count++;
        if (days >= 90) count++;
        if (days >= 180) count++;
        if (days >= 365) count++;
        return count;
    }
    
    function calcProgress(days, relapses) {
        if (days <= 0) return 0;
        return Math.floor((days * 100) / (days + relapses + 1));
    }
    
    function daysToNextMilestone(days) {
        var milestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
        for (var i = 0; i < milestones.length; i++) {
            if (days < milestones[i]) return milestones[i] - days;
        }
        return 0;
    }
    
    // Compression
    function compressRLE(input) {
        var output = [];
        for (var i = 0; i < input.length; i++) {
            var count = 1;
            while (i + 1 < input.length && input[i] === input[i + 1] && count < 255) {
                count++;
                i++;
            }
            output.push(input[i], count);
        }
        return output;
    }
    
    function decompressRLE(input) {
        var output = [];
        for (var i = 0; i < input.length; i += 2) {
            for (var j = 0; j < input[i + 1]; j++) {
                output.push(input[i]);
            }
        }
        return output;
    }
    
    // Search
    function binarySearch(arr, target) {
        var lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            var mid = (lo + hi) >> 1;
            if (arr[mid] === target) return mid;
            if (arr[mid] < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }
    
    // Sort
    function quickSort(arr) {
        return arr.slice().sort(function(a, b) { return a - b; });
    }
    
    // Math
    function fastAbs(x) {
        return x < 0 ? -x : x;
    }
    
    function fastSqrt(x) {
        return Math.sqrt(x);
    }
    
    // Hash
    function hashString(str) {
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return hash >>> 0;
    }
    
    // Cache
    var cache = {};
    var cacheMax = 500;
    var cacheCount = 0;
    var cacheOrder = [];
    
    function cacheInit(max) {
        cacheMax = max;
        cache = {};
        cacheCount = 0;
        cacheOrder = [];
    }
    
    function cacheGet(key) {
        return cache[key] || null;
    }
    
    function cachePut(key, value) {
        if (!cache[key]) {
            if (cacheCount >= cacheMax) {
                var oldest = cacheOrder.shift();
                delete cache[oldest];
                cacheCount--;
            }
            cacheCount++;
        }
        cache[key] = value;
        cacheOrder.push(key);
    }
    
    // Public API
    return {
        // Init
        init: function() { console.log('[Optimization] Ready (JavaScript)'); },
        ready: function() { return true; },
        
        // Memory
        memInit: memInit,
        memAlloc: memAlloc,
        memReset: memReset,
        
        // Recovery
        calcMilestones: calcMilestones,
        calcProgress: calcProgress,
        daysToNextMilestone: daysToNextMilestone,
        
        // Compression
        compressRLE: compressRLE,
        decompressRLE: decompressRLE,
        
        // Search
        binarySearch: binarySearch,
        
        // Sort
        quickSort: quickSort,
        
        // Math
        fastAbs: fastAbs,
        fastSqrt: fastSqrt,
        
        // Hash
        hashString: hashString,
        
        // Cache
        cacheInit: cacheInit,
        cacheGet: cacheGet,
        cachePut: cachePut
    };
})();

// Global export
if (typeof window !== 'undefined') window.TaeafiWASM = TaeafiWASM;