var fs = require('fs');
var path = require('path');
var prependFile = require('prepend-file');
var handlebars = require('handlebars');
var Promise = require('bluebird');
var IB_BIN = path.resolve(__dirname, '..', '..', 'ib', 'ib');
var Task = require('./task-base');
var utility = require('../utility');
var spawn = utility.spawn;

var BuildTask = Task.extend({
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

  getModuleImplementationSrc: function () {
    var self = this;

    return this.getPkgJson().then(function (pkg) {
      var moduleFile;

      if (pkg.moduleImplementation) {
        moduleFile = path.join(self.getSrcRoot(), pkg.moduleImplementation);
      } else {
        moduleFile = path.resolve(__dirname, '..', '..', 'static', 'default-module.js');
      }

      return utility.readFile(moduleFile);
    });
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
      this.getSrcRoot(),
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

  getHtmlTemplate: function () {
    var self = this;

    var defaultTemplatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'static',
      'default-html-template.hbs'
    );

    return this.getPkgJson().then(function (pkg) {
      if (typeof pkg.htmlTemplate === 'string') {
        return utility.readFile(path.join(self.getSrcRoot(), pkg.htmlTemplate));
      } else {
        return utility.readFile(defaultTemplatePath);
      }
    }).then(function (html) {
      return handlebars.compile(html);
    });
  },

  getOutputTargetPath: function () {
    return path.join(
      this.getOutDir(),
      this.getConfig(),
      this.getBuildTarget()
    );
  },

  prependFile: function (file, strToAppend) {
    return new Promise(function (resolve, reject) {
      prependFile(file, strToAppend, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  run: function () {
    var self = this;
    var htmlTemplate;

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
    }).then(function () {
      return self.getHtmlTemplate();
    }).then(function (tmpl) {
      htmlTemplate = tmpl;
      return self.getPkgJson();
    }).then(function (pkg) {
      if (path.extname(self.getBuildTarget()) === '.js') {
        var outTarget = path.join(
          self.getOutDir(),
          self.getConfig(),
          self.getBuildTarget()
        );

        var htmlFile = outTarget.split('.')[0] + '.html';
        pkg.javascriptTarget = path.basename(outTarget);
        fs.writeFileSync(htmlFile, htmlTemplate(pkg));

        utility.print([
          '',
          'Built Html File To: ' + htmlFile,
          ''
        ], 'yellow');

        return self.getModuleImplementationSrc();
      }
    }).then(function (src) {
      if (typeof src === 'string') {
        var jsTarget = self.getOutputTargetPath();
        return self.prependFile(jsTarget, src);
      }
    });
  }
});

BuildTask.IB_BIN = IB_BIN;
BuildTask.CONFIG_DEFAULT = 'common';
module.exports = BuildTask;
