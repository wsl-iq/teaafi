@echo off
setlocal

REM Taeafi WebAssembly Build Script
REM Developer: Mohammed Al-Baqer
REM Copyright (c) 2026, Mohammed Al-Baqer. All rights reserved.

echo.
echo       Taeafi WebAssembly Build
echo.

where emcc >nul 2>&1

if errorlevel 1 (
    echo ERROR: Emscripten compiler ^(emcc^) was not found.
    echo Please activate the Emscripten environment first.
    exit /b 1
)

if not exist build (
    mkdir build
)

echo.
echo Building optimization.wasm...
echo.

emcc ^
    src/memory.c ^
    src/recovery.c ^
    src/compression.c ^
    src/algorithms.c ^
    src/math.c ^
    src/cache.cpp ^
    -Iinclude ^
    -O3 ^
    -s WASM=1 ^
    -s ALLOW_MEMORY_GROWTH=1 ^
    -s INITIAL_MEMORY=67108864 ^
    -s MODULARIZE=1 ^
    -s EXPORT_ES6=1 ^
    -s EXPORTED_FUNCTIONS="['_mem_init','_mem_alloc','_mem_reset','_mem_capacity','_mem_used','_calc_milestones','_calc_progress','_days_to_next','_rle_compress','_rle_decompress','_bin_search','_qsort_int','_fast_abs','_fast_sqrt','_hash_str','_cache_init','_cache_get','_cache_put','_cache_clear','_cache_size']" ^
    -o build/optimization.js

if errorlevel 1 (
    echo.
    echo ERROR: WebAssembly build failed.
    exit /b 1
)

echo.
echo Build completed successfully.
echo.
echo Output:
echo   build\optimization.js
echo   build\optimization.wasm
echo.

endlocal