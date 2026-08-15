# Taeafi WebAssembly Module

A lightweight WebAssembly optimization module for the Taeafi application.

### Requirements

- Emscripten SDK
- CMake 3.15 or newer
- C compiler
- C++17 compiler

### Project Structure

```text
wasm/
├── include/
│   └── optimization.h
│
├── src/
│   ├── memory.c
│   ├── recovery.c
│   ├── compression.c
│   ├── algorithms.c
│   ├── math.c
│   └── cache.cpp
│
├── CMakeLists.txt
├── build.bat
├── build.sh
└── README.md
```

---

### **Components**
**Memory**

- Provides a lightweight memory pool:

- `mem_init`
- `mem_alloc`
- `mem_reset`
- `mem_capacity`
- `mem_used`
- ` Recovery`

- Provides recovery-related calculations:

-`calc_milestones`
-`calc_progress`
- `days_to_next`

**Compression**

- Provides Run-Length Encoding:

- `rle_compress`
- `rle_decompress`

### Algorithms

- Provides:
  - Binary search
  - Integer quick sort

### Mathematics
- Provides:

  - Absolute value
  - Square root
  - String hashing


### Cache
- Provides an O(1) LRU cache:

- `cache_init`
- `cache_get`
- `cache_put`
- `cache_clear`
- `cache_size`

---

### **Building**
*Windows*

- Activate the Emscripten environment and run:
```cmd
build.bat
```
---

*Linux / macOS*
```bash
chmod +x build.sh
./build.sh
```

### **CMake**
- Create a build directory:
```bash
mkdir build-cmake
cd build-cmake
```

*Configure using the Emscripten toolchain:*
```bash
emcmake cmake ..
```
*Build:*
```bash
cmake --build . --config Release
```
---

### **Output**
*The build generates:*
```
build/
├── optimization.js
└── optimization.wasm
```

# **Notes**

**The** `WebAssembly` **module should only be used for operations where native** `JavaScript` **performance is insufficient.**

**Do not move normal** `UI` **logic,** `DOM` **manipulation, or simple application state management into** `WebAssembly` **without a measurable performance requirement.**

---


### Result

*In this way, we have a clear separation:*

```text
memory.c       → Memory
recovery.c     → Taeafi calculations
compression.c  → Compression
algorithms.c   → Search / Sort
math.c         → Math / Hash
cache.cpp      → LRU Cache
optimization.h → Public API
```
