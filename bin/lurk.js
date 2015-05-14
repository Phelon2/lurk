#!/usr/bin/env node
var path = require('path');
var program = require('commander');
var pkg = require(path.resolve(__dirname, '..', 'package.json'));

 
program
  .version(pkg.version)
  .parse(process.argv);
