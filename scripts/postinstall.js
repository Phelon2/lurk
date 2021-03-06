var fs = require('fs');
var path = require('path');
var utility = require('../lib/utility');
var spawn = utility.spawn;
var print = utility.print;
var emsdkRepository = 'https://github.com/evhan55/emsdk_portable.git';
var cloneDir = path.resolve(__dirname, '..', 'emsdk');
var emsdkBin = path.resolve(__dirname, '..', 'emsdk', 'emsdk');
var ibDir = path.resolve(__dirname, '..', 'ib');
var ibRepo = 'https://github.com/JasonL9000/dj.git';
var cliSeperator = '==================================================';
var gitBin;

if (process.platform === 'win32') {
  // emsdk must be installed
  emsdkBin = 'emsdk';
  var userDoesHaveEmsdk = spawn('emsdk', ['help']);

  userDoesHaveEmsdk.on('close', function (exitCode) {
    if (exitCode !== 0) {
      fail('Emsdk must be installed to use this software');
    }

    updateEmsdk();
  });
} else {
  // git must be installed
  var userDoesHaveGit = spawn('git', ['--version']);

  userDoesHaveGit.on('close', function (exitCode) {
    if (exitCode !== 0 && gitBin) {
      fail('Git must be installed to use this software');
    }

    cloneEmsdk();
  });
}

function fail(message) {
  console.log("Need to stop installation... Please check above errors".red);
  console.log(cliSeperator.red);

  var clean = spawn('rm', ['-rf', cloneDir]);

  clean.on('close', function () {
    throw new Error(message);
  });
}

function message(message) {
  print([
    '',
    message
  ], 'green');

  print([
    '',
    cliSeperator,
    ''
  ], 'yellow');
}

function cloneEmsdk() {
  message('Cloning: ' + emsdkRepository);

  if (fs.existsSync(cloneDir)) {
    return updateEmsdk();
  }

  var cloneEmsdk = spawn('git', ['clone', emsdkRepository, cloneDir], {
    stdio: 'inherit'
  });

  cloneEmsdk.on('close', function (exitCode) {
    if (exitCode !== 0) {
      fail('Cloning emscripten repository failed.');
    }

    updateEmsdk();
  });
}

function updateEmsdk() {
  message('Updating emsdk');
  var updateEmsdk = spawn(emsdkBin, ['update'], {
    stdio: 'inherit'
  });

  updateEmsdk.on('close', function (exitCode) {
    if (exitCode !== 0) {
      fail('Updated emsdk FAILED');
    }

    listEmsdk();
  });
}

function listEmsdk() {
  message('Listing emsdk');
  var listEmsdk = spawn(emsdkBin, ['list'], {
    stdio: 'inherit'
  });

  listEmsdk.on('close', function (exitCode) {
    if (exitCode !== 0) {
      fail('Listing emsdk FAILED');
    }

    installLatest();
  });
}

function installLatest() {
  message('Installing emsdk latest');
  var listEmsdk = spawn(emsdkBin, ['install', 'latest'], {
    stdio: 'inherit'
  });

  listEmsdk.on('close', function (exitCode) {
    if (exitCode !== 0) {
      console.log([
        '',
        'emsdk installation failed',
        '=========================',
        '',
        '  What do I do now?'.yellow,
        '',
        '  - Are you on Ubuntu? - '.yellow,
        '    try `sudo apt-get install build-essential cmake`'.yellow,
        '',
        '  - Are you on OSX?'.yellow,
        '    try installing xcode build tools'.yellow,
        '    try install cmake with `brew install cmake`'.yellow,
        '  ',
        '  - None of the above?'.yellow,
        '    please address the above errors'.red,
        ''
      ].join('\n').red);

      fail('Installing emsdk FAILED!');
    }

    activateLatest();
  });
}

function activateLatest() {
  message('Activating latest emsdk install');
  var activate = spawn(emsdkBin, ['activate', 'latest'], {
    stdio: 'inherit'
  });

  activate.on('close', function (exitCode) {
    if (exitCode !== 0) {
      fail('Activating latest emsdk install failed!');
    }

    message('Lurk is ready to use');
  });
}
