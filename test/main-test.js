var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

describe('main entry point', function () {
  it('exists', function () {
    expect(fs.existsSync(path.resolve(__dirname, '..', 'index.js'))).to.eql(true);
  });
});
