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

  readEmscriptenConfig: function () {
    return new Promise(function (resolve, reject) {
      exec('python ' + path.resolve(
        __dirname,
        '..',
        'bin',
        'read_emscripten.py'
      ), function (err, stdout, stderr) {
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
      for (var i = 0; i < arguments.length; ++i) {
        if (arguments[i] instanceof Array) {
          arguments[i].unshift('/c', arguments[0]);
          arguments[0] = process.env.comspec;
          return spawn.apply(this, arguments);
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
      fs.readdirSync(path).forEach(function(file, index){
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
      }

      construct.prototype = proto;
      util.inherits(construct, BaseClass);
      return construct;
    }
  }
};
