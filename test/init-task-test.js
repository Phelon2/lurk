var fs = require('fs');
var expect = require('chai').expect;
var InitTask = require('../lib/tasks/init');

describe('InitTask', function () {
  it('has an example gen from', function () {
    expect(fs.existsSync(InitTask.BASE_APP)).to.eql(true);
    expect(fs.existsSync(InitTask.COMMON_CFG)).to.eql(true);
    expect(fs.existsSync(InitTask.PKG)).to.eql(true);
    expect(fs.existsSync(InitTask.SRC)).to.eql(true);
    expect(fs.existsSync(InitTask.MAINCC)).to.eql(true);
  });
});
