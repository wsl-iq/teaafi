/*
 * Developer: Mohammed Al-Baqer
 * File: recovery.c
 * Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
 *
 * Description:
 * Recovery-related calculations used by Taeafi.
 */

#include "optimization.h"


static const int MILESTONES[] = {
    1,
    3,
    7,
    14,
    30,
    60,
    90,
    180,
    365
};

#define MILESTONE_COUNT \
    ((int)(sizeof(MILESTONES) / sizeof(MILESTONES[0])))


int calc_milestones(int days)
{
    int count = 0;

    if (days <= 0) {
        return 0;
    }

    for (int i = 0; i < MILESTONE_COUNT; ++i) {
        if (days >= MILESTONES[i]) {
            ++count;
        }
    }

    return count;
}


int calc_progress(int days, int relapses)
{
    long denominator;
    long result;

    if (days <= 0) {
        return 0;
    }

    if (relapses < 0) {
        relapses = 0;
    }

    denominator = (long)days + (long)relapses + 1L;

    if (denominator <= 0) {
        return 0;
    }

    result = ((long)days * 100L) / denominator;

    if (result < 0) {
        return 0;
    }

    if (result > 100) {
        return 100;
    }

    return (int)result;
}


int days_to_next(int days)
{
    if (days < 0) {
        days = 0;
    }

    for (int i = 0; i < MILESTONE_COUNT; ++i) {
        if (days < MILESTONES[i]) {
            return MILESTONES[i] - days;
        }
    }

    return 0;
}