#include "optimization.h"
#include <stdlib.h>
#include <string.h>

static unsigned char* pool = 0;
static int pool_size = 0;
static int pool_pos = 0;

void mem_init(int kb) {
    if (pool) free(pool);
    pool_size = kb * 1024;
    pool = (unsigned char*)malloc(pool_size);
    pool_pos = 0;
}

void* mem_alloc(int bytes) {
    if (!pool || pool_pos + bytes > pool_size) return 0;
    void* p = pool + pool_pos;
    pool_pos += bytes;
    return p;
}

void mem_reset(void) { pool_pos = 0; }

int calc_milestones(int days) {
    int c = 0;
    if (days >= 1) c++; if (days >= 3) c++; if (days >= 7) c++;
    if (days >= 14) c++; if (days >= 30) c++; if (days >= 60) c++;
    if (days >= 90) c++; if (days >= 180) c++; if (days >= 365) c++;
    return c;
}

int calc_progress(int days, int relapses) {
    if (days <= 0) return 0;
    return (days * 100) / (days + relapses + 1);
}

int days_to_next(int days) {
    const int m[] = {1,3,7,14,30,60,90,180,365};
    for (int i = 0; i < 9; i++) if (days < m[i]) return m[i] - days;
    return 0;
}

int rle_compress(const int* in, int len, int* out) {
    int o = 0;
    for (int i = 0; i < len; i++) {
        int c = 1;
        while (i+1 < len && in[i] == in[i+1] && c < 255) { c++; i++; }
        out[o++] = in[i]; out[o++] = c;
    }
    return o;
}

int rle_decompress(const int* in, int len, int* out) {
    int o = 0;
    for (int i = 0; i < len; i += 2)
        for (int j = 0; j < in[i+1]; j++) out[o++] = in[i];
    return o;
}

int bin_search(const int* arr, int size, int target) {
    int lo = 0, hi = size - 1;
    while (lo <= hi) {
        int mid = lo + ((hi - lo) >> 1);
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

static void qs(int* a, int lo, int hi) {
    if (lo >= hi) return;
    int p = a[lo + ((hi - lo) >> 1)], i = lo, j = hi, t;
    while (i <= j) {
        while (a[i] < p) i++;
        while (a[j] > p) j--;
        if (i <= j) { t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }
    }
    if (lo < j) qs(a, lo, j);
    if (i < hi) qs(a, i, hi);
}

void qsort_int(int* arr, int size) { if (size > 1) qs(arr, 0, size - 1); }

int fast_abs(int x) { int m = x >> 31; return (x + m) ^ m; }

float fast_sqrt(float x) {
    if (x <= 0) return 0;
    float r = x, l;
    do { l = r; r = (r + x / r) * 0.5f; } while (fast_abs((int)(r - l)) > 0);
    return r;
}

unsigned int hash_str(const char* s) {
    unsigned int h = 5381;
    while (*s) h = ((h << 5) + h) + *s++;
    return h;
}