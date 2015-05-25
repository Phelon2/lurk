var fs = require('fs');
var path = require('path');
var utility = require('../utility');
var spawn = utility.spawn;
var Promise = require('bluebird');
var IB_BIN = path.resolve(__dirname, '..', '..', 'ib', 'ib');

function BuildTask(program) {
  this.program = program;
}

BuildTask.prototype = {
  getBuildTarget: function () {
    var program = this.program;
    var target;

    if (program.build && typeof program.build === 'string') {
      target = program.build;
    } else {
      var srcRoot = this.getSrcRoot();

      if (typeof srcRoot === 'string') {
        var pkg = path.join(srcRoot, 'package.json');

        if (fs.existsSync(pkg)) {
          var pkgObj = require(pkg);

          if (typeof pkgObj.target === 'string') {
            target = pkgObj.target;
          }
        }
      }
    }

    if (typeof target === 'string') {
      if (target.substring(0, 1) !== '/') {
        target = '/' + target;
      }
    }

    return target;
  },

  getSrcRoot: function () {
    var program = this.program;

    if (typeof program.src_root === 'string') {
      var srcRoot = program.src_root;

      if (!path.isAbsolute(program.src_root)) {
        srcRoot = path.join(process.cwd(), program.src_root);
      }

      return srcRoot;
    } else {
      return process.cwd();
    }
  },

  getOutDir: function () {
    var outRoot;
    var program = this.program;

    if (typeof program.out_root === 'string') {
      if (program.out_root.substring(0, 1) !== '/') {
        outRoot = path.resolve(process.cwd(), program.out_root);
      }
    } else {
      outRoot = path.join(this.getSrcRoot(), 'out');
    }

    return outRoot;
  },

  getConfig: function () {
    var program = this.program;

    if (program.cfg) {
      return program.cfg;
    } else {
      return BuildTask.CONFIG_DEFAULT;
    }
  },

  getIbArguments: function () {
    var program = this.program;

    return [
      BuildTask.IB_BIN,
      '--cfg',
      this.getConfig(),
      '--src_root',
      program.src_root || process.cwd(),
      program.print_cfg ? '--print_cfg' : '',
      program.print_script ? '--print_script' : '',
      '--out_root',
      this.getOutDir(),
      program.print_args ? '--print_args' : '',
      this.getBuildTarget()
    ].filter(function (item) {
      return item !== '';
    });
  },

  run: function () {
    var self = this;

    return utility.readEmscriptenConfig().then(function (cfg) {
      if (process.platform === 'win32') {
        process.env.emcc = 'emcc';
        process.env.empp = 'em++';
        process.env.emmake = 'emmake';
      } else {
        process.env.emcc = path.join(cfg.EMSCRIPTEN_ROOT, 'emcc');
        process.env.empp = path.join(cfg.EMSCRIPTEN_ROOT, 'em++');
        process.env.emmake = path.join(cfg.EMSCRIPTEN_ROOT, 'emmake');
      }


      return new Promise(function (resolve, reject) {
        // spawn build process
        var build = spawn('python', self.getIbArguments(), {
          stdio: 'inherit'
        });

        build.on('close', function (exitCode) {
          if (exitCode === 0) {
            resolve({
              exitCode: exitCode
            });
          } else {
            reject({
              exitCode: exitCode
            });
          }
        });
      });
    });
  }
};

BuildTask.IB_BIN = IB_BIN;
BuildTask.CONFIG_DEFAULT = 'common';

module.exports = BuildTask;