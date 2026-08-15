/*
 * Developer: Mohammed Al-Baqer
 * File: optimization.h
 * Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
 *
 * Description:
 * Public API for the Taeafi WebAssembly optimization module.
 */

#ifndef TAEAFI_OPTIMIZATION_H
#define TAEAFI_OPTIMIZATION_H

#ifdef __cplusplus
extern "C" {
#endif

/*
 * Memory Management
 **/

/**
 * Initializes the internal memory pool.
 *
 * @param kilobytes Requested pool size in kilobytes.
 * @return 1 on success, 0 on failure.
 */
int mem_init(int kilobytes);

/**
 * Allocates memory from the internal pool.
 *
 * @param bytes Number of bytes to allocate.
 * @return Pointer to allocated memory, or NULL on failure.
 */
void* mem_alloc(int bytes);

/**
 * Resets the memory pool position.
 */
void mem_reset(void);

/**
 * Returns the current memory pool capacity.
 *
 * @return Capacity in bytes.
 */
int mem_capacity(void);

/**
 * Returns the amount of memory currently used.
 *
 * @return Used bytes.
 */
int mem_used(void);


/*
 * Recovery Calculations
 **/

/**
 * Calculates the number of achieved milestones.
 *
 * @param days Number of recovery days.
 * @return Number of achieved milestones.
 */
int calc_milestones(int days);

/**
 * Calculates recovery progress percentage.
 *
 * @param days Number of recovery days.
 * @param relapses Number of relapses.
 * @return Progress percentage from 0 to 100.
 */
int calc_progress(int days, int relapses);

/**
 * Calculates the number of days remaining until the next milestone.
 *
 * @param days Current recovery days.
 * @return Remaining days.
 */
int days_to_next(int days);


/*
 * Compression
 **/

/**
 * Compresses integer data using Run-Length Encoding.
 *
 * @param input Input array.
 * @param length Number of input elements.
 * @param output Output array.
 * @param output_capacity Output array capacity.
 * @return Number of output elements, or -1 on failure.
 */
int rle_compress(
    const int* input,
    int length,
    int* output,
    int output_capacity
);

/**
 * Decompresses Run-Length Encoded integer data.
 *
 * @param input Compressed input array.
 * @param length Number of input elements.
 * @param output Output array.
 * @param output_capacity Output array capacity.
 * @return Number of decompressed elements, or -1 on failure.
 */
int rle_decompress(
    const int* input,
    int length,
    int* output,
    int output_capacity
);


/*
 * Algorithms
 **/

/**
 * Performs binary search on a sorted integer array.
 *
 * @return Index of target, or -1 if not found.
 */
int bin_search(
    const int* array,
    int size,
    int target
);

/**
 * Sorts an integer array in ascending order.
 */
void qsort_int(int* array, int size);


/*
 * Mathematics
 **/

/**
 * Returns the absolute value of an integer.
 */
int fast_abs(int value);

/**
 * Calculates the square root of a floating-point value.
 */
float fast_sqrt(float value);

/**
 * Calculates a DJB2-style hash for a null-terminated string.
 */
unsigned int hash_str(const char* string);


/*
 * Cache
 **/

/**
 * Initializes the cache.
 *
 * @param max_items Maximum number of cached items.
 * @return 1 on success, 0 on failure.
 */
int cache_init(int max_items);

/**
 * Gets a cached value.
 *
 * @param key Integer cache key.
 * @return Pointer to cached string, or NULL if not found.
 */
const char* cache_get(int key);

/**
 * Inserts or updates a cached value.
 *
 * @param key Integer cache key.
 * @param value Null-terminated string.
 * @return 1 on success, 0 on failure.
 */
int cache_put(int key, const char* value);

/**
 * Clears the entire cache.
 */
void cache_clear(void);

/**
 * Returns the current number of cached items.
 */
int cache_size(void);

#ifdef __cplusplus
}
#endif

#endif /* TAEAFI_OPTIMIZATION_H */