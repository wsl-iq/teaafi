;; Taeafi Optimization - WebAssembly Text Format
;; No Emscripten required

(module
  ;; Memory
  (memory (export "memory") 64 256)
  
  ;; Memory Pool
  (global $pool_offset (mut i32) (i32.const 0))
  
  (func (export "mem_pool_init") (param $size i32)
    (global.set $pool_offset (i32.const 0))
  )
  
  (func (export "mem_pool_reset")
    (global.set $pool_offset (i32.const 0))
  )
  
  ;; Math Functions
  
  ;; fast_abs(x) - absolute value
  (func (export "fast_abs") (param $x i32) (result i32)
    local.get $x
    local.get $x
    i32.const 31
    i32.shr_s
    local.tee $x
    i32.add
    local.get $x
    i32.xor
  )
  
  ;; Recovery Analysis
  
  ;; calc_milestones(days) -> number of milestones reached
  (func (export "calc_milestones") (param $days i32) (result i32)
    (local $count i32)
    (local.set $count (i32.const 0))
    
    (if (i32.ge_s (local.get $days) (i32.const 1))   (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 3))   (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 7))   (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 14))  (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 30))  (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 60))  (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 90))  (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 180)) (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    (if (i32.ge_s (local.get $days) (i32.const 365)) (then (local.set $count (i32.add (local.get $count) (i32.const 1)))))
    
    local.get $count
  )
  
  ;; calc_progress(days, relapses) -> percentage
  (func (export "calc_progress") (param $days i32) (param $relapses i32) (result i32)
    (local $total i32)
    (if (i32.le_s (local.get $days) (i32.const 0)) (then (return (i32.const 0))))
    
    local.get $days
    local.get $relapses
    i32.add
    i32.const 1
    i32.add
    local.set $total
    
    local.get $days
    i32.const 100
    i32.mul
    local.get $total
    i32.div_s
  )
  
  ;; days_to_next_milestone(days) -> remaining days
  (func (export "days_to_next_milestone") (param $days i32) (result i32)
    (if (i32.lt_s (local.get $days) (i32.const 1))   (then (return (i32.sub (i32.const 1) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 3))   (then (return (i32.sub (i32.const 3) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 7))   (then (return (i32.sub (i32.const 7) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 14))  (then (return (i32.sub (i32.const 14) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 30))  (then (return (i32.sub (i32.const 30) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 60))  (then (return (i32.sub (i32.const 60) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 90))  (then (return (i32.sub (i32.const 90) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 180)) (then (return (i32.sub (i32.const 180) (local.get $days)))))
    (if (i32.lt_s (local.get $days) (i32.const 365)) (then (return (i32.sub (i32.const 365) (local.get $days)))))
    (i32.const 0)
  )
  
  ;; Hash Function
  
  ;; hash_string - djb2 algorithm
  (func (export "hash_string") (param $ptr i32) (param $len i32) (result i32)
    (local $hash i32)
    (local $i i32)
    (local.set $hash (i32.const 5381))
    (local.set $i (i32.const 0))
    
    (loop $loop
      (if (i32.lt_s (local.get $i) (local.get $len))
        (then
          local.get $hash
          i32.const 5
          i32.shl
          local.get $hash
          i32.add
          local.get $ptr
          local.get $i
          i32.add
          i32.load8_s
          i32.add
          local.set $hash
          local.get $i
          i32.const 1
          i32.add
          local.set $i
          (br $loop)
        )
      )
    )
    
    local.get $hash
  )
  
  ;; RLE Compression
  
  ;; compress_rle(input_ptr, input_len, output_ptr) -> output_len
  (func (export "compress_rle") (param $in_ptr i32) (param $in_len i32) (param $out_ptr i32) (result i32)
    (local $i i32)
    (local $out_pos i32)
    (local $val i32)
    (local $count i32)
    (local $next_val i32)
    
    (local.set $i (i32.const 0))
    (local.set $out_pos (i32.const 0))
    
    (loop $outer
      (if (i32.lt_s (local.get $i) (local.get $in_len))
        (then
          ;; Get current value
          local.get $in_ptr
          local.get $i
          i32.const 4
          i32.mul
          i32.add
          i32.load
          local.set $val
          
          ;; Count repetitions
          (local.set $count (i32.const 1))
          (local.set $i (i32.add (local.get $i) (i32.const 1)))
          
          (loop $inner
            (if (i32.lt_s (local.get $i) (local.get $in_len))
              (then
                local.get $in_ptr
                local.get $i
                i32.const 4
                i32.mul
                i32.add
                i32.load
                local.set $next_val
                
                (if (i32.and 
                      (i32.eq (local.get $val) (local.get $next_val))
                      (i32.lt_s (local.get $count) (i32.const 255)))
                  (then
                    (local.set $count (i32.add (local.get $count) (i32.const 1)))
                    (local.set $i (i32.add (local.get $i) (i32.const 1)))
                    (br $inner)
                  )
                )
              )
            )
          )
          
          ;; Write value + count
          local.get $out_ptr
          local.get $out_pos
          i32.const 4
          i32.mul
          i32.add
          local.get $val
          i32.store
          
          local.get $out_pos
          i32.const 1
          i32.add
          local.set $out_pos
          
          local.get $out_ptr
          local.get $out_pos
          i32.const 4
          i32.mul
          i32.add
          local.get $count
          i32.store
          
          local.get $out_pos
          i32.const 1
          i32.add
          local.set $out_pos
          
          (br $outer)
        )
      )
    )
    
    local.get $out_pos
  )
)