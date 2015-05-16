var colors = require('colors/safe');

module.exports = {
  print: function (lines, color) {
    if (!colors[color]) {
      throw new Error('Color ' + color + ' does not exist');
    }

    console.log(colors[color](lines.join('\n')));
  }
};
