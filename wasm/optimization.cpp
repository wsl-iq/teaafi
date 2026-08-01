#include "optimization.h"
#include <cstring>

namespace {
    struct Node {
        int key;
        char* val;
        Node* next;
        Node* prev;
    };
    Node* head = nullptr;
    Node* tail = nullptr;
    int count = 0, max_items = 500;
}

extern "C" {

void cache_init(int max) {
    max_items = max;
    while (head) { Node* t = head; head = head->next; delete[] t->val; delete t; }
    head = tail = nullptr;
    count = 0;
}

const char* cache_get(int key) {
    for (Node* n = head; n; n = n->next)
        if (n->key == key) return n->val;
    return nullptr;
}

void cache_put(int key, const char* val) {
    for (Node* n = head; n; n = n->next) {
        if (n->key == key) { delete[] n->val; n->val = new char[strlen(val)+1]; strcpy(n->val, val); return; }
    }
    while (count >= max_items && tail) {
        Node* t = tail;
        if (t->prev) t->prev->next = nullptr;
        tail = t->prev;
        if (head == t) head = nullptr;
        delete[] t->val; delete t;
        count--;
    }
    Node* n = new Node{key, new char[strlen(val)+1], head, nullptr};
    strcpy(n->val, val);
    if (head) head->prev = n;
    head = n;
    if (!tail) tail = n;
    count++;
}

}