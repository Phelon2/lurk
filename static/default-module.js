var Module = {
  canvas: this.window ? document.getElementById('canvas') : null
};

if (Module.canvas) {
  window.onresize = function () {
    if (typeof Module.setCanvasSize === 'function') {
      var width = Module.canvas.clientWidth;
      var height = Module.canvas.clientHeight;
      Module.setCanvasSize(width, height);
    }
  }
}
