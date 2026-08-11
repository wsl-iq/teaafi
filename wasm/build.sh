#!/usr/bin/env bash
# -*- coding: utf-8 -*-
# Developer: Mohammed Al-Baqer
# Copyright: Copyright (c) 2026

echo "Building optimization.wasm..."
mkdir -p build
emcc optimization.c optimization.cpp -O3 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s INITIAL_MEMORY=64MB -o build/optimization.wasm
echo "Done: build/optimization.wasm"