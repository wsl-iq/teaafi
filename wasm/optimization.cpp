/*
 * Developer: Mohammed Al-Baqer
 * Folder: wasm
 * File: optimization.cpp
 * Copyright (c) 2026, lnc. Mohammed Al-Baqer. All rights reserved.
 * Description: This file implements a Least Recently Used (LRU) cache data structure
 * using a doubly-linked list for efficient O(1) operations.
*/

#include "optimization.h" // import from file optimization.h
#include <cstring>

// Anonymous namespace containing the cache implementation details
namespace {
    // Node structure representing each cache entry in the doubly-linked list
    struct Node {
        int key;            // Integer key for cache lookup
        char* val;         // Pointer to dynamically allocated string value
        Node* next;       // Pointer to the next (more recent) node
        Node* prev;      // Pointer to the previous (less recent) node
    };
    
    // Pointer to the head (most recently used) node of the doubly-linked list
    Node* head = nullptr;
    
    // Pointer to the tail (least recently used) node of the doubly-linked list
    Node* tail = nullptr;
    
    // Current number of items stored in the cache
    int count = 0;
    
    // Maximum capacity of the cache before eviction occurs
    int max_items = 500;
}

// C linkage declaration for WebAssembly external functions
extern "C" {

/**
 * Initializes the cache with a specified maximum size.
 * Clears any existing cache entries and resets all counters.
 * 
 * @param max - The new maximum number of items the cache can hold
 */
void cache_init(int max) {
    // Set the maximum cache capacity
    max_items = max;
    
    // Iterate through the entire linked list and delete all nodes
    while (head) { 
        Node* t = head;             // Temporary pointer to current head
        head = head->next;         // Move head to next node
        delete[] t->val;          // Free the dynamically allocated string
        delete t;                // Free the node structure
    }
    
    // Reset pointers and counter
    head = tail = nullptr;
    count = 0;
}

/**
 * Retrieves a value from the cache by its key.
 * Performs a linear search through the linked list.
 * 
 * @param key - The integer key to search for
 * @return - Pointer to the cached string value, or nullptr if not found
 */
const char* cache_get(int key) {
    // Linear search through the linked list from head to tail
    for (Node* n = head; n; n = n->next)
        if (n->key == key) return n->val;  // Return value if key matches
    
    // Key not found in cache
    return nullptr;
}

/**
 * Moves an existing node to the head (most recently used position).
 * Optimizes access patterns by reflecting recent usage.
 * 
 * @param n - The node to move to the head
 */
void move_to_head(Node* n) {
    // Skip if already at head
    if (n == head) return;
    
    // Unlink node from its current position
    if (n->prev) n->prev->next = n->next;
    if (n->next) n->next->prev = n->prev;
    if (n == tail) tail = n->prev;
    
    // Insert at head
    n->prev = nullptr;
    n->next = head;
    if (head) head->prev = n;
    head = n;
    if (!tail) tail = n;
}

/**
 * Inserts or updates a key-value pair in the cache.
 * If key exists, updates its value; if not, creates new entry at head.
 * Implements LRU eviction policy when cache reaches maximum capacity.
 * 
 * @param key - The integer key for the cache entry
 * @param val - The string value to cache (will be deep copied)
 */
void cache_put(int key, const char* val) {
    // Validate input parameters for memory safety
    if (!val || key < 0) return;
    
    int val_len = strlen(val);
    // Reject extremely large values to prevent memory exhaustion
    if (val_len > 65536) return;
    
    // Check if key already exists in the cache for update operation
    for (Node* n = head; n; n = n->next) {
        if (n->key == key) { 
            // Update existing entry: free old value and allocate new one
            delete[] n->val;                                     // Free old string
            n->val = new char[val_len+1];                       // Allocate memory for new value
            strcpy(n->val, val);                               // Copy new value
            move_to_head(n);                                  // Mark as recently used
            return; 
        }
    }
    
    // Evict least recently used (tail) nodes if cache exceeds max capacity
    while (count >= max_items && tail) {
        Node* t = tail;                        // Temporary pointer to tail node
        if (t->prev) t->prev->next = nullptr; // Unlink tail from the list
        tail = t->prev;                      // Move tail pointer backward
        if (head == t) head = nullptr;      // If only one node existed, clear head
        delete[] t->val;                   // Free the evicted node's string
        delete t;                         // Free the evicted node
        count--;                         // Decrement cache size
    }
    
    // Create and initialize new node with the provided key-value pair
    Node* n = new Node{key, new char[strlen(val)+1], head, nullptr};
    strcpy(n->val, val);                   // Copy string value into new node
    
    // Update head pointers to insert new node at the front (most recently used)
    if (head) head->prev = n;               // Link old head's prev to new node
    head = n;                              // Make new node the head
    
    // If cache was empty, new node is also the tail
    if (!tail) tail = n;
    
    // Increment cache item counter
    count++;
}

}