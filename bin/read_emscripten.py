import os
execfile(os.path.expanduser("~") + '/.emscripten');

print '''
  {
    "LLVM_ROOT": "''' + LLVM_ROOT + '''",
    "EMSCRIPTEN_ROOT": "''' + EMSCRIPTEN_ROOT + '''",
    "EMSCRIPTEN_NATIVE_OPTIMIZER": "''' + EMSCRIPTEN_NATIVE_OPTIMIZER + '''"
  }
'''