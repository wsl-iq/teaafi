/*
 * Developer: Mohammed Al-Baqer
 * File: math.c
 * Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
 *
 * Description:
 * Mathematical helper functions for WebAssembly.
 */

#include "optimization.h"

#include <math.h>


int fast_abs(int value)
{
    if (value < 0) {
        return -value;
    }

    return value;
}


float fast_sqrt(float value)
{
    if (value <= 0.0f) {
        return 0.0f;
    }

    return sqrtf(value);
}


unsigned int hash_str(const char* string)
{
    unsigned int hash = 5381u;

    if (!string) {
        return 0u;
    }

    while (*string) {
        hash = ((hash << 5) + hash) + (unsigned char)*string;
        ++string;
    }

    return hash;
}