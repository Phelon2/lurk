> Build your web app with C++

## Installation

Assuming you have all the tools required to install and run lurk, the below should work.

```
npm install -g lurk
```

If the installation fails, the errors are quite useful. If you are lost, see hints for your OS below.

## Usage

__View Help__

```
lurk --help
```

__Generate a starter project__

```
mkdir hello-lurk
cd hello-lurk
lurk init
lurk build
node out/common/src/main.js
```

## Tools Used In Lurk

- __clang__ - clang compiler front end
- __python 2.x__ - must be installed and also aliased as `python2`
- __nodejs__ - use nvm to install multiple versions of nodejs. I reccomend using latest iojs version for support for ECMAScript 6 syntax
- __git__ - what every developer uses for revision control
- __make__ - a tool for doing huge compilation tasks
- __cmake__ - a tool for doing huge compilation tasks on multiple platforms

### Ubuntu Installation Notes

You may experience some errors related to outdated software from deb packages. Installing using `npm install -g lurk` will let you know what is wrong if installation fails. If the system has installed latest `clang`, `gcc`, `g++`, `cmake`, `make` you'll be all set. Simply installing `sudo apt-get instal build-essential` usually doesn't give you the latest tools build tools

### OSX Installation Notes

- __xcode__ - an OSX "bundle" or (.app) with all of the build tools inside (I think bundles are awesome)
- __one gotcha__
	- __python2__ - one the tools lurk uses executes python2 to run a script in order to ensure python 2.x is being used. You can fix this with an alias or just using `brew install python` and that should add `python2` to your path.

### Windows Installation

I am not sure about all the requirements that are needed, but I had the below software installed on my machine and the tool ran successfully.

 - __git__ - get the latest version
 - __Visual C++__ - get the latest free version
 - __Install Node or iojs__ - https://nodejs.org/download/
 - __Install Emscripten SDK__ - http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html
 - __Install CMake__ - install the windows version
 - __Install GnuMake__ - install make for windows

Make sure to restart your computer after installing your tools on Windows. If that doesn't work the installation errors will tell you more about what is going wrong. I was able to install and use lurk using CMD, but not cygwin.

## Contributing

Fork the repo and do or suggest something... You could make an issue, feature request, w/e is w/e I donno :) contact me on issues if you have an questions. Good luck and hope this tool finds you well. Stay tuned for more features and better documentation.
