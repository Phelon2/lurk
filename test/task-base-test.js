var path = require('path');
var expect = require('chai').expect;
var Task = require('../lib/tasks/task-base');

describe('Task', function () {
  it('exists', function () {
    expect(Task).to.be.a('function');
  });

  it('can extend', function () {
    expect(Task.extend).to.be.a('function');
  });

  it('can initialize', function () {
    var called = false;

    var MyTask = Task.extend({
      initialize: function (something) {
        expect(something).to.eql('something');
        called = true;
      }
    });

    var task = new MyTask('something');
    expect(called).to.eql(true);
  });

  it('has an ask method', function () {
    expect(Task.prototype.ask).to.be.a('function');
  });

  it('finds the package.json', function (done) {
    var task = new Task({
      src_root: path.resolve(__dirname, '..')
    });

    task.getPkgJson().then(function (pkg) {
      expect(pkg.name).to.eql('lurk');
      done();
    }).catch(function (err) {
      done(err);
    });
  });
});
