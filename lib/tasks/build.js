var fs = require('fs');
var path = require('path');
var utility = require('../utility');
var spawn = utility.spawn;
var Promise = require('bluebird');
var IB_BIN = path.resolve(__dirname, '..', '..', 'ib', 'ib');

function BuildTask(program) {
  this.program = program;

  // grab the location of the project
  // that we are trying to build
  this.srcRoot = program.src_root || process.cwd();
  // where we expect the package.json to be if
  // the project has one
  this.pkgJson = path.join(this.srcRoot, 'package.json');
}

BuildTask.prototype = {
  failPackageJson: function () {
    utility.print([
      '',
      ['Build failed. Could not determine',
      'what to build! Please provide target',
      'to build for build parameter or',
      'provide a package.json in src_root',
      'with a `main` property'].join(' '),
      ''
    ], 'red');

    process.exit(1);
  },

  getBuildTarget: function () {
    if (!fs.existsSync(this.pkgJson)) {
      utility.print([
        '',
        'Warning: package.json does not exist in ' + srcRoot,
      ], 'yellow');

      if (typeof this.program.build !== 'string') {
        this.failPackageJson();
      }
    } else {
      var p = require(this.pkgJson);

      if (
        typeof this.program.build !== 'string' &&
        typeof p.target !== 'string'
      ) {
        this.failPackageJson();
      } else if (typeof p.target === 'string') {
        this.program.build = p.target;
      }
    }

    if (this.program.build.substring(0, 1) !== '/') {
      this.program.build = '/' + this.program.build;
    }

    return this.program.build;
  },

  getOutDir: function () {
    var program = this.program;

    if (program.out_root === 'string') {
      if (program.out_root.substring(0, 1) !== '/') {
        program.out_root = path.resolve(proces.cwd(), program.out_root);
      }
    } else {
      program.out_root = path.join(program.src_root || process.cwd(), 'out');
    }

    return program.out_root;
  },

  getIbArguments: function () {
    var program = this.program;

    return [
      BuildTask.IB_BIN,
      '--cfg',
      program.cfg || 'common',
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

module.exports = BuildTask;