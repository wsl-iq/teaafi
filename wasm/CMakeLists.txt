cmake_minimum_required(VERSION 3.10)
project(TaeafiWASM LANGUAGES C CXX)

set(CMAKE_C_STANDARD 11)
set(CMAKE_CXX_STANDARD 17)
set(FLAGS "-O3 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s INITIAL_MEMORY=64MB")

add_executable(optimization optimization.c optimization.cpp)
set_target_properties(optimization PROPERTIES
    LINK_FLAGS "${FLAGS} -s EXPORTED_FUNCTIONS='[\"_mem_init\",\"_mem_alloc\",\"_mem_reset\",\"_calc_milestones\",\"_calc_progress\",\"_days_to_next\",\"_rle_compress\",\"_rle_decompress\",\"_bin_search\",\"_qsort_int\",\"_fast_abs\",\"_fast_sqrt\",\"_hash_str\",\"_cache_init\",\"_cache_get\",\"_cache_put\"]'"
    SUFFIX ".wasm"
)