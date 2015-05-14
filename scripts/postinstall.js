var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var colors = require('colors');
var userDoesHaveGit = spawn('which', ['git']);
var emsdkRepository = 'https://github.com/evhan55/emsdk_portable.git';
var cloneDir = path.resolve(__dirname, '..', 'emsdk');
var emsdkBin = path.resolve(__dirname, "..", 'emsdk/emsdk');
var cliSeperator = '==================================================';
var gitBin;

userDoesHaveGit.stdout.on('data', function (data) {
  gitBin = data.toString();
});

userDoesHaveGit.on('close', function (exitCode) {
  if (exitCode !== 0 && gitBin) {
    fail('You must have git installed to install this tool');
  }

  cloneEmsdk();
});

function fail(message) {
  console.log("Need to stop installation... Please check above errors".red);
  console.log(cliSeperator.red);

  var clean = spawn('rm', ['-rf', cloneDir]);

  clean.on('close', function () {
    throw new Error(message);
  });
}

function message(message) {
  console.log('\n' + message.green + '\n' + cliSeperator.yellow);
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
