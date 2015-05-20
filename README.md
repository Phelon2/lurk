> Build your web app with C++

## Installation

Install using npm (Node Package Manager).

```
npm intsall -g lurk
```

## Requirements
- __cmake__ - used to install emsdk
- __compiler__ - build-essential on ubuntu or xcode build tools on osx
- __git__ - retrieves files required for installation
- __node__ - nodejs is required to install emscripten
- __npm__ - the node package manager where lurk lives

## Development

```shell
git clone <this-repo>
cd <this-repo>
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.1/install.sh | bash
nvm install iojs
nvm use iojs
npm install
npm link
lurk --help
```
