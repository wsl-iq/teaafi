/*
 * Developer: Mohammed Al-Baqer
 * File: cache.cpp
 * Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
 *
 * Description:
 * O(1) LRU cache implementation for WebAssembly.
 */

#include "optimization.h"

#include <cstring>
#include <string>
#include <unordered_map>
#include <list>


namespace {

struct CacheEntry {
    int key;
    std::string value;
};

using CacheList = std::list<CacheEntry>;

CacheList cache_list;

std::unordered_map<int, CacheList::iterator> cache_map;

int cache_capacity = 0;


/*
 * Internal Helpers
 **/

void move_to_front(CacheList::iterator iterator)
{
    if (iterator != cache_list.begin()) {
        cache_list.splice(
            cache_list.begin(),
            cache_list,
            iterator
        );
    }
}


void remove_last()
{
    if (cache_list.empty()) {
        return;
    }

    auto last = std::prev(cache_list.end());

    cache_map.erase(last->key);
    cache_list.pop_back();
}

}


/*
 * Public API
 **/

extern "C" {

int cache_init(int max_items)
{
    if (max_items <= 0) {
        cache_clear();
        return 0;
    }

    cache_clear();

    cache_capacity = max_items;

    return 1;
}


const char* cache_get(int key)
{
    auto found = cache_map.find(key);

    if (found == cache_map.end()) {
        return nullptr;
    }

    auto iterator = found->second;

    move_to_front(iterator);

    return iterator->value.c_str();
}


int cache_put(
    int key,
    const char* value
)
{
    if (!value) {
        return 0;
    }

    const size_t length = std::strlen(value);

    if (length > 65536) {
        return 0;
    }

    if (cache_capacity <= 0) {
        return 0;
    }

    auto found = cache_map.find(key);

    if (found != cache_map.end()) {
        found->second->value.assign(value);

        move_to_front(found->second);

        return 1;
    }

    while (
        static_cast<int>(cache_list.size()) >= cache_capacity
    ) {
        remove_last();
    }

    cache_list.push_front(
        CacheEntry{
            key,
            std::string(value)
        }
    );

    cache_map[key] = cache_list.begin();

    return 1;
}


void cache_clear(void)
{
    cache_map.clear();
    cache_list.clear();
}


int cache_size(void)
{
    return static_cast<int>(cache_list.size());
}

}