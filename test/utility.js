var path = require('path');
var expect = require('chai').expect;
var utility = require(path.resolve(__dirname, '..', 'lib', 'utility'));

describe('utility', function () {
  it('can spawn a process', function (done) {
    var cmd = process.platform === 'win32' ? 'dir' : 'ls';
    var list = utility.spawn(cmd);

    list.on('close', function (exitCode) {
      expect(exitCode).to.eql(0);
      done();
    });
  });

  it('can spawn a process with args', function (done) {
    var python = utility.spawn('python', ['--version']);

    python.on('close', function (exitCode) {
      expect(exitCode).to.eql(0);
      done();
    });
  });

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

  it('extends a class', function () {
    function MyBase(obj) {
      this.obj = obj;
    }

    MyBase.prototype = {
      run: function () {
        return 'hello from base';
      },

      overrideThis: function () {
        return 'not overridden';
      }
    };

    expect(utility.setExtendable).to.be.a('function');
    expect(MyBase.extend).to.eql(undefined);
    utility.setExtendable(MyBase);
    expect(MyBase.extend).to.be.a('function');

    var TheClass = MyBase.extend({
      overrideThis: function () {
        return 'overridden';
      }
    });

    var theClass = new TheClass('something');
    expect(theClass.run()).to.eql('hello from base');
    expect(theClass.overrideThis()).to.eql('overridden');
    expect(theClass.obj).to.eql('something');
  });
});
