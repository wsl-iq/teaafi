/*
 * Developer: Mohammed Al-Baqer
 * File: memory.c
 * Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
 *
 * Description:
 * Lightweight memory pool implementation for WebAssembly.
 */

#include "optimization.h"

#include <stddef.h>
#include <stdlib.h>

static unsigned char* g_memory_pool = NULL;
static size_t g_pool_capacity = 0;
static size_t g_pool_offset = 0;


/*
 * Internal Helpers
 **/

static int is_valid_size(int value)
{
    return value > 0;
}


/*
 * Public API
 **/

int mem_init(int kilobytes)
{
    size_t bytes;

    if (!is_valid_size(kilobytes)) {
        return 0;
    }

    bytes = (size_t)kilobytes * 1024u;

    if (bytes / 1024u != (size_t)kilobytes) {
        return 0;
    }

    free(g_memory_pool);

    g_memory_pool = (unsigned char*)malloc(bytes);

    if (!g_memory_pool) {
        g_pool_capacity = 0;
        g_pool_offset = 0;
        return 0;
    }

    g_pool_capacity = bytes;
    g_pool_offset = 0;

    return 1;
}


void* mem_alloc(int bytes)
{
    size_t requested;

    if (!g_memory_pool || bytes <= 0) {
        return NULL;
    }

    requested = (size_t)bytes;

    if (requested > g_pool_capacity - g_pool_offset) {
        return NULL;
    }

    {
        void* result = g_memory_pool + g_pool_offset;

        g_pool_offset += requested;

        return result;
    }
}


void mem_reset(void)
{
    g_pool_offset = 0;
}


int mem_capacity(void)
{
    if (g_pool_capacity > (size_t)2147483647) {
        return 2147483647;
    }

    return (int)g_pool_capacity;
}


int mem_used(void)
{
    if (g_pool_offset > (size_t)2147483647) {
        return 2147483647;
    }

    return (int)g_pool_offset;
}