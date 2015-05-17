var path = require('path');
var fs = require('fs');
var expect = require('chai').expect;

describe('building hello world', function () {
  var helloWorldDir = path.join(__dirname, 'fixtures', 'hello-world');

  it('has a project to build', function () {
    expect(fs.existsSync(helloWorldDir)).to.be.true;
  });
});
