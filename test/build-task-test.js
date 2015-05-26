var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;
var BuildTask = require('../lib/tasks/build');
var utility = require('../lib/utility');
var cwd = process.cwd();

describe('BuildTask hello-world', function () {
  var helloWorldDir = path.join(__dirname, 'fixtures', 'hello-world');
  var helloWorldOut = path.join(helloWorldDir, 'out');

  beforeEach(function () {
    process.cwd(helloWorldDir);
  });

  afterEach(function () {
    process.cwd(cwd);
  });

  it('exists', function () {
    expect(!BuildTask).to.eql(false);
  });

  it('knows where the ib bin is', function () {
    expect(fs.existsSync(BuildTask.IB_BIN)).to.eql(true);
  });

  it('has a project to build', function () {
    expect(fs.existsSync(helloWorldDir)).to.be.true;
  });

  it('finds the target of the project in package.json', function () {
    var task = new BuildTask({
      src_root: helloWorldDir
    });

    expect(task.getBuildTarget()).to.eql('/src/main.js');
  });

  it('finds the build output', function () {
    var task = new BuildTask({
      src_root: helloWorldDir
    });

    expect(task.getOutDir()).to.eql(helloWorldOut);
  });

  it('gets correct build arguments', function () {
    var task = new BuildTask({
      src_root: helloWorldDir
    });

    expect(task.getIbArguments()).to.deep.eql([
      BuildTask.IB_BIN,
      '--cfg',
      BuildTask.CONFIG_DEFAULT,
      '--src_root',
      helloWorldDir,
      '--out_root',
      helloWorldOut,
      '/src/main.js'
    ]);
  });

  it('gets the source root', function () {
    var task = new BuildTask({
      src_root: helloWorldDir
    });

    expect(task.getSrcRoot()).to.eql(helloWorldDir);
  });

  it('gets the config', function () {
    var task = new BuildTask({
      src_root: helloWorldDir
    });

    expect(task.getConfig()).to.eql('common');
  });
});
