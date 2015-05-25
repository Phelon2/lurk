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
      'common',
      '--src_root',
      helloWorldDir,
      '--out_root',
      helloWorldOut,
      '/src/main.js'
    ]);
  });

  it('builds the hello world app', function (done) {
    // build can take some time
    this.timeout(1000000);

    utility.deleteFolderRecursive(helloWorldOut);

    var task = new BuildTask({
      src_root: helloWorldDir
    });

    task.run().then(function () {
      utility.deleteFolderRecursive(helloWorldOut);
      done();
    }).catch(function (err) {
      console.log(err);
      console.log(err.stack);
      throw new Error('build failed');
    });
  });
});
