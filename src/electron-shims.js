const path = require('path');
const electron = require('electron');

const dirname = path.dirname;
path.dirname = function(path) {
  if (typeof path !== 'string') {
    path = '' + path;
    const Grim = require('grim');
    Grim.deprecate('Argument to `path.dirname` must be a string');
  }

  return dirname(path);
};

const extname = path.extname;
path.extname = function(path) {
  if (typeof path !== 'string') {
    path = '' + path;
    const Grim = require('grim');
    Grim.deprecate('Argument to `path.extname` must be a string');
  }

  return extname(path);
};

const basename = path.basename;
path.basename = function(path, ext) {
  if (
    typeof path !== 'string' ||
    (ext !== undefined && typeof ext !== 'string')
  ) {
    path = '' + path;
    const Grim = require('grim');
    Grim.deprecate('Arguments to `path.basename` must be strings');
  }

  return basename(path, ext);
};

electron.ipcRenderer.sendChannel = function() {
  const Grim = require('grim');
  Grim.deprecate('Use `ipcRenderer.send` instead of `ipcRenderer.sendChannel`');
  return this.send.apply(this, arguments);
};

const electronRemote = require('@electron/remote');
const remoteRequire = electronRemote.require;
electronRemote.require = function(moduleName) {
  const Grim = require('grim');
  switch (moduleName) {
    case 'menu':
      Grim.deprecate('Use `remote.Menu` instead of `remote.require("menu")`');
      return electronRemote.Menu;
    case 'menu-item':
      Grim.deprecate(
        'Use `remote.MenuItem` instead of `remote.require("menu-item")`'
      );
      return electronRemote.MenuItem;
    case 'browser-window':
      Grim.deprecate(
        'Use `remote.BrowserWindow` instead of `remote.require("browser-window")`'
      );
      return electronRemote.BrowserWindow;
    case 'dialog':
      Grim.deprecate(
        'Use `remote.Dialog` instead of `remote.require("dialog")`'
      );
      return electronRemote.Dialog;
    case 'app':
      Grim.deprecate('Use `remote.app` instead of `remote.require("app")`');
      return electronRemote.app;
    case 'crash-reporter':
      Grim.deprecate(
        'Use `remote.crashReporter` instead of `remote.require("crashReporter")`'
      );
      return electronRemote.crashReporter;
    case 'global-shortcut':
      Grim.deprecate(
        'Use `remote.globalShortcut` instead of `remote.require("global-shortcut")`'
      );
      return electronRemote.globalShortcut;
    case 'clipboard':
      Grim.deprecate(
        'Use `remote.clipboard` instead of `remote.require("clipboard")`'
      );
      return electronRemote.clipboard;
    case 'native-image':
      Grim.deprecate(
        'Use `remote.nativeImage` instead of `remote.require("native-image")`'
      );
      return electronRemote.nativeImage;
    case 'tray':
      Grim.deprecate('Use `remote.Tray` instead of `remote.require("tray")`');
      return electronRemote.Tray;
    default:
      return remoteRequire.call(electronRemote, moduleName);
  }
};
