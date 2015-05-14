#!/usr/bin/env node
var path = require('path');
var program = require('commander');
var pkg = require(path.resolve(__dirname, '..', 'package.json'));
var exec = require('child_process').exec;
var emsdkDir = path.resolve(__dirname, '..', 'emsdk');

program
  .version(pkg.version)
  .option('e, expose', 'sets the emsdk environment variables')
  .parse(process.argv);

if (program.expose) {
  var setEnv = exec([
    path.join(emsdkDir, 'emsdk_env.sh'),
    '&&',
    path.join(emsdkDir, 'emsdk_set_env.sh')
  ].join(' '), function (error, stdout, stderr) {
    console.log(stdout);
  });
}
