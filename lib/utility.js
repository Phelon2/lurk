var assert = require('assert');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var colors = require('colors/safe');
var Promise = require('bluebird');
var util = require('util');

module.exports = {
  print: function (lines, color) {
    if (!colors[color]) {
      throw new Error('Color ' + color + ' does not exist');
    }

    console.log(colors[color](lines.join('\n')));
  },

  readFile: function (thePath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(thePath, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res.toString());
        }
      });
    });
  },

  readEmscriptenConfig: function () {
    return new Promise(function (resolve, reject) {
      exec('python ' + path.resolve(
        __dirname,
        '..',
        'bin',
        'read_emscripten.py'
      ), function (err, stdout) {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(stdout));
        }
      });
    });
  },

  spawn: function () {
    if (process.platform === 'win32') {
      var args = arguments;

      for (var i = 0; i < args.length; ++i) {
        if (args[i] instanceof Array) {
          args[i].unshift('/c', args[0]);
          args[0] = process.env.comspec;
          return spawn.apply(this, args);
        }
      }

      return spawn.apply(this, [
        process.env.comspec,
        ['/c', arguments[0]]
      ]);
    }

    return spawn.apply(this, arguments);
  },

  deleteFolderRecursive: function deleteFolderRecursive (path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file){
        var curPath = path + '/' + file;

        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });

      fs.rmdirSync(path);
    }
  },

  setExtendable: function (BaseClass) {
    assert.equal(
      typeof BaseClass,
      'function',
      'first parameter must be a base class'
    );

    BaseClass.extend = function (proto) {
      var construct = function () {
        BaseClass.apply(this, arguments);
      };

      util.inherits(construct, BaseClass);

      for (var x in proto) {
        construct.prototype[x] = proto[x];
      }

      return construct;
    };
  }
};
