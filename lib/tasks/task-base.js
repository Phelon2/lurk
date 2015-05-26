var Promise = require('bluebird');
var utility = require('../utility');

var Task = function (program) {
  this.program = program;

  if (typeof this.initialize === 'function') {
    this.initialize.apply(this, arguments);
  }
}

Task.prototype = {
  start: function () {
    return this.run();
  }
}

utility.setExtendable(Task);
module.exports = Task;
