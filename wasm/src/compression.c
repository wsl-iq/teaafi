/*
 * Developer: Mohammed Al-Baqer
 * File: compression.c
 * Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
 *
 * Description:
 * Run-Length Encoding utilities for integer arrays.
 */

#include "optimization.h"

#include <stddef.h>


int rle_compress(
    const int* input,
    int length,
    int* output,
    int output_capacity
)
{
    int output_index = 0;

    if (!input || !output) {
        return -1;
    }

    if (length < 0 || output_capacity < 0) {
        return -1;
    }

    if (length == 0) {
        return 0;
    }

    for (int i = 0; i < length;) {
        int value = input[i];
        int count = 1;

        while (
            i + count < length &&
            input[i + count] == value &&
            count < 255
        ) {
            ++count;
        }

        if (output_index + 2 > output_capacity) {
            return -1;
        }

        output[output_index++] = value;
        output[output_index++] = count;

        i += count;
    }

    return output_index;
}


int rle_decompress(
    const int* input,
    int length,
    int* output,
    int output_capacity
)
{
    int output_index = 0;

    if (!input || !output) {
        return -1;
    }

    if (length < 0 || output_capacity < 0) {
        return -1;
    }

    if ((length % 2) != 0) {
        return -1;
    }

    for (int i = 0; i < length; i += 2) {
        int value = input[i];
        int count = input[i + 1];

        if (count <= 0) {
            return -1;
        }

        if (count > output_capacity - output_index) {
            return -1;
        }

        for (int j = 0; j < count; ++j) {
            output[output_index++] = value;
        }
    }

    return output_index;
}