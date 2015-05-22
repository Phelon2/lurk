var exec = require('child_process').exec;
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
  }
};
