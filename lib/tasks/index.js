var path = require('path');
var fs = require('fs');

var tasks = fs.readdirSync(__dirname).filter(function (item) {
  return path.extname(item) === '.js';
}).filter(function (item) {
  return item !== 'index.js' && item !== 'task-base.js';
});

tasks.forEach(function (task) {
  var theTask = require(path.join(__dirname, task));
  var split = task.split('.')[0].split('-');
  var last = split.pop();

  if (last.toLowerCase().trim() !== 'task') {
    split.push(last, 'task');
  }

  split.forEach(function (item, index) {
    split[index] = item[0].toUpperCase() + item.substring(1, item.length);
  });

  module.exports[split.join('')] = theTask;
});
