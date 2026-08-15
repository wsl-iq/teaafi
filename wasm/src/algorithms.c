/*
 * Developer: Mohammed Al-Baqer
 * File: algorithms.c
 * Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
 *
 * Description:
 * General-purpose searching and sorting algorithms.
 */

#include "optimization.h"


int bin_search(
    const int* array,
    int size,
    int target
)
{
    int low = 0;
    int high;

    if (!array || size <= 0) {
        return -1;
    }

    high = size - 1;

    while (low <= high) {
        int middle = low + (high - low) / 2;

        if (array[middle] == target) {
            return middle;
        }

        if (array[middle] < target) {
            low = middle + 1;
        } else {
            high = middle - 1;
        }
    }

    return -1;
}


/*
 * Quick Sort
 **/

static void swap_int(int* a, int* b)
{
    int temporary = *a;
    *a = *b;
    *b = temporary;
}


static int partition(
    int* array,
    int low,
    int high
)
{
    int pivot = array[low + (high - low) / 2];

    int left = low;
    int right = high;

    while (left <= right) {
        while (array[left] < pivot) {
            ++left;
        }

        while (array[right] > pivot) {
            --right;
        }

        if (left <= right) {
            swap_int(&array[left], &array[right]);

            ++left;
            --right;
        }
    }

    return left;
}


static void quick_sort(
    int* array,
    int low,
    int high
)
{
    if (low >= high) {
        return;
    }

    {
        int index = partition(array, low, high);

        if (low < index - 1) {
            quick_sort(array, low, index - 1);
        }

        if (index < high) {
            quick_sort(array, index, high);
        }
    }
}


void qsort_int(int* array, int size)
{
    if (!array || size <= 1) {
        return;
    }

    quick_sort(array, 0, size - 1);
}