var path = require('path');
var fs = require('fs');
var prompt = require('prompt');
var Promise = require('bluebird');
var utility = require('../utility');

var Task = function (program) {
  this.program = program;

  if (typeof this.initialize === 'function') {
    this.initialize.apply(this, arguments);
  }
};

Task.prototype = {
  getPkgJson: function () {
    var self = this;

    return new Promise(function (resolve, reject) {
      var dir = self.program.src_root;

      if (!dir) {
        dir = process.cwd();
      }

      var pkg = path.join(dir, 'package.json');

      fs.exists(pkg, function (exists) {
        if (exists) {
          resolve(pkg);
        } else {
          reject({
            message: 'package.json does not exist'
          });
        }
      });
    }).then(function (pkg) {
      return new Promise(function (resolve, reject) {
        fs.readFile(pkg, function (err, res) {
          if (err) {
            reject({
              message: 'Error reading: ' + pkg,
              err: err
            });
          } else {
            pkg = JSON.parse(res.toString());
            resolve(pkg);
          }
        });
      });
    });
  },

  ask: function (question) {
    prompt.start();

    return new Promise(function (resolve, reject) {
      prompt.get(question, function (err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
};

utility.setExtendable(Task);
module.exports = Task;
