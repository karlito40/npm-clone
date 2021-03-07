# Npm Clone Package

> Easily git clone a npm package

This extension ease the code discovery of a npm package. 

## Features

- Add a "Clone a NPM package" command entry that will clone the requested package inside a `.npm_clone` directory.

![feature X](./assets/npm-clone-preview.gif)

_The .npm_clone directory will be create in the active workspace root_

## Under the hood

It's basically just a set of:

```
npm view {packageName}
mkdir {activeWorkspace}/.npm_clone
cd .npm_clone && git clone {packageView.repository}
```
### 0.0.4

Initial release

