#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var program = require('commander');
var pkg = require(path.resolve(__dirname, '..', 'package.json'));
var emsdkDir = path.resolve(__dirname, '..', 'emsdk');
var ibBin = path.resolve(__dirname, '..', 'ib', 'dj', 'tools', 'ib');
var utility = require('../lib/utility.js');

program
  .version(pkg.version)
  .option('-h, --help', 'output usage information')
  .option('--print_script', 'print makefile to screen before application is built')
  .option('--out', 'lurk build output directory')
  .option('e, expose', 'sets the emsdk environment variables')
  .option('b, build', 'builds lurk application in current directory')
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

if (program.build) {
  var argv = process.argv;
  argv = argv.splice(3, argv.length);
  var build = spawn(ibBin, argv, {
    stdio: 'inherit'
  });

  build.on('close', function (exitCode) {
    if (exitCode === 0) {
      utility.print(['', 'No Build Errors', ''], 'green');
    } else {
      utility.print(['', 'Build Failed', ''], 'yellow');
    }
  });
}
