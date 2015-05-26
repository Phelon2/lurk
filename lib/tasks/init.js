var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var async = require('async');
var prompt = require('prompt');
var Task = require('./task-base');

var InitTask = Task.extend({
  askCWD: function () {
    var self = this;

    return new Promise(function (resolve, reject) {
      prompt.get(InitTask.QUESTION_CWD, function (err, res) {
        if (err) {
          reject({
            err: err,
            message: 'Could not read user input'
          });
        } else {
          var result = res[InitTask.QUESTION_CWD];
          var answer = result[0];

          if (typeof answer === 'string') {
            answer.toLowerCase();
          }

          if (answer ===  'y') {
            self.projectDir = process.cwd();
            resolve(self.projectDir);
          } else if (answer === 'n') {
            var msg = 'Please run init inside desired directory';

            reject({
              err: new Error(msg),
              message: msg
            });
          } else {
            var theMsg = 'Could not understand "' + result + '"';

            reject({
              err: new Error(theMsg),
              message: theMsg
            });
          }
        }
      });
    });
  },

  getCopy: function (fromFile, toFile) {
    return function (cb) {
      var rd = fs.createReadStream(fromFile);
      var wr = fs.createWriteStream(toFile);
      rd.pipe(wr);

      wr.on('close', function () {
        cb();
      });
    };
  },

  copyStarterProjectToDir: function (dir) {
    var self = this;

    return new Promise(function (resolve, reject) {
      fs.mkdirSync(path.join(dir, 'src'));

      async.series([
        self.getCopy(InitTask.COMMON_CFG, path.join(dir, 'common.cfg')),
        self.getCopy(InitTask.PKG, path.join(dir, 'package.json')),
        self.getCopy(InitTask.MAINCC, path.join(dir, 'src', 'main.cc'))
      ], function (err, res) {
        if (err) {
          reject({
            err: err,
            message: 'Problem copying files to directory: ' + dir
          });
        } else {
          resolve(res);
        }
      });
    });
  },

  run: function () {
    var self = this;
    prompt.start();

    return this.askCWD().then(function () {
      return self.copyStarterProjectToDir(self.projectDir);
    });
  }
});

InitTask.BASE_APP = path.resolve(__dirname, '..', '..', 'static', 'init');
InitTask.COMMON_CFG = path.join(InitTask.BASE_APP, 'common.cfg');
InitTask.PKG = path.join(InitTask.BASE_APP, 'package.json');
InitTask.SRC = path.join(InitTask.BASE_APP, 'src');
InitTask.MAINCC = path.join(InitTask.SRC, 'main.cc');
InitTask.QUESTION_CWD = 'Put project files in current directory (y/n)?';

module.exports = InitTask;
