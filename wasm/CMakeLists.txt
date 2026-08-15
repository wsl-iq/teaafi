# Developer: Mohammed Al-Baqer
# File: CMakeLists.txt
# Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.
#
# Description:
# CMake configuration for building the Taeafi WebAssembly module.

cmake_minimum_required(VERSION 3.15)

project(
    TaeafiWASM
    VERSION 1.0.0
    LANGUAGES C CXX
)


# Language Standards

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


# Source Files

set(WASM_SOURCES
    src/memory.c
    src/recovery.c
    src/compression.c
    src/algorithms.c
    src/math.c
    src/cache.cpp
)


# WebAssembly Target

add_executable(
    optimization
    ${WASM_SOURCES}
)


target_include_directories(
    optimization
    PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)


# Emscripten Linker Configuration

set_target_properties(
    optimization
    PROPERTIES

    SUFFIX ".wasm"

    LINK_FLAGS
    "-O3
     -s WASM=1
     -s ALLOW_MEMORY_GROWTH=1
     -s INITIAL_MEMORY=67108864
     -s MODULARIZE=1
     -s EXPORT_ES6=1
     -s EXPORTED_FUNCTIONS=[
        '_mem_init',
        '_mem_alloc',
        '_mem_reset',
        '_mem_capacity',
        '_mem_used',

        '_calc_milestones',
        '_calc_progress',
        '_days_to_next',

        '_rle_compress',
        '_rle_decompress',

        '_bin_search',
        '_qsort_int',

        '_fast_abs',
        '_fast_sqrt',
        '_hash_str',

        '_cache_init',
        '_cache_get',
        '_cache_put',
        '_cache_clear',
        '_cache_size'
     ]"
)