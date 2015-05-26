var expect = require('chai').expect;
var Tasks = require('../lib/tasks');

describe('Tasks index', function () {
  it('returns all the tasks we can do', function () {
    expect(Tasks).to.be.a('object');
    expect(Tasks.BuildTask).to.be.a('function');
    expect(Tasks.InitTask).to.be.a('function');
  });
});
