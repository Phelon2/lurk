var path = require('path');
var expect = require('chai').expect;
var utility = require(path.resolve(__dirname, '..', 'lib', 'utility'));

describe('utility', function () {
  it('reads emscripten config', function (done) {
    utility.readEmscriptenConfig().then(function (cfg) {
      expect(cfg).to.be.a('object');
      expect(cfg.EMSCRIPTEN_NATIVE_OPTIMIZER).to.be.a('string');
      expect(cfg.EMSCRIPTEN_ROOT).to.be.a('string');
      expect(cfg.LLVM_ROOT).to.be.a('string');
      done();
    }).catch(function (err) {
      done(err);
    });
  });
});
