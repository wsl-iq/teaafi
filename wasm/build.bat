@echo off
chcp 65001 >nul
REM Developer: Mohammed Al-Baqer
REM Copyright: Copyright (c) 2026
echo Hello World
pause

echo Building optimization.wasm...
if not exist "build" mkdir "build"
emcc optimization.c optimization.cpp -O3 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s INITIAL_MEMORY=64MB -o build/optimization.wasm
echo Done: build/optimization.wasm
pause