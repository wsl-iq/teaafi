/*
 * Developer: Mohammed Al-Baqer
 * Folder: wasm
 * File: optimization.ا
 * Copyright (c) 2026, lnc. Mohammed Al-Baqer. All rights reserved.
*/

#ifndef TAEFI_OPTIMIZATION_H
#define TAEFI_OPTIMIZATION_H

#ifdef __cplusplus
extern "C" {
#endif

/* Memory */
void  mem_init(int kb);
void* mem_alloc(int bytes);
void  mem_reset(void);

/* Recovery */
int calc_milestones(int days);
int calc_progress(int days, int relapses);
int days_to_next(int days);

/* Compression */
int rle_compress(const int* in, int len, int* out);
int rle_decompress(const int* in, int len, int* out);

/* Search */
int bin_search(const int* arr, int size, int target);

/* Sort */
void qsort_int(int* arr, int size);

/* Math */
int  fast_abs(int x);
float fast_sqrt(float x);

/* Hash */
unsigned int hash_str(const char* str);

/* Cache */
void cache_init(int max);
const char* cache_get(int key);
void cache_put(int key, const char* val);

#ifdef __cplusplus
}
#endif
#endif