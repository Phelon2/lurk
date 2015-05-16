#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var program = require('commander');
var pkg = require(path.resolve(__dirname, '..', 'package.json'));
var emsdkDir = path.resolve(__dirname, '..', 'emsdk');
var utility = require('../lib/utility.js');

program
  .version(pkg.version)
  .option('e, expose', 'sets the emsdk environment variables')
  .parse(process.argv);

if (program.expose) {
  utility.print([
    '',
    'Emscripten SDK Location',
    '=======================',
    '',
    '  ' + emsdkDir,
    '',
    'Add it to your path',
    '===================',
    '',
    '  source ' + path.join(emsdkDir, 'emsdk_env.sh'),
    '  source ' + path.join(emsdkDir, 'emsdk_set_env.sh'),
    ''
  ], 'yellow');
}
