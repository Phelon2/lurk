var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var colors = require('colors/safe');
var Promise = require('bluebird');

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
  }
};
