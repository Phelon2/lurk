import os
execfile(os.environ['HOME'] + '/.emscripten');

print '''
  {
    "LLVM_ROOT": "''' + LLVM_ROOT + '''",
    "EMSCRIPTEN_ROOT": "''' + EMSCRIPTEN_ROOT + '''",
    "EMSCRIPTEN_NATIVE_OPTIMIZER": "''' + EMSCRIPTEN_NATIVE_OPTIMIZER + '''"
  }
'''