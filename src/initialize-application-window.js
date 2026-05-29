const AtomEnvironment = require('./atom-environment');
const ApplicationDelegate = require('./application-delegate');
const Clipboard = require('./clipboard');
const TextEditor = require('./text-editor');

require('./text-editor-component');
require('./file-system-blob-store');
require('./native-compile-cache');
require('./compile-cache');
require('./module-cache');

if (global.isGeneratingSnapshot) {
  require('autocomplete-css');
  require('autocomplete-html');
  require('autocomplete-plus');
  require('autocomplete-snippets');
  require('autosave');
  require('bookmarks');
  require('bracket-matcher');
  require('command-palette');
  require('encoding-selector');
  require('find-and-replace');
  require('fuzzy-finder');
  require('git-diff');
  require('go-to-line');
  require('grammar-selector');
  require('keybinding-resolver');
  require('language-html');
  require('language-javascript');
  require('language-rust-bundled');
  require('language-typescript');
  require('line-ending-selector');
  require('notifications');
  require('settings-view');
  require('snippets');
  require('status-bar');
  require('symbols-view');
  require('tabs');
  require('tree-view');
  require('whitespace');
  require('wrap-guide');
}

const clipboard = new Clipboard();
TextEditor.setClipboard(clipboard);
TextEditor.viewForItem = (item) => atom.views.getView(item);

const StartupTime = require('./startup-time');

StartupTime.addMarker('window:new-atom-environment:start');
global.atom = new AtomEnvironment({
  clipboard,
  applicationDelegate: new ApplicationDelegate(),
  enablePersistence: true,
});
StartupTime.addMarker('window:new-atom-environment:end');

TextEditor.setScheduler(global.atom.views);
StartupTime.addMarker('window:preload-packages:start');
global.atom.preloadPackages();
StartupTime.addMarker('window:preload-packages:end');

// Like sands through the hourglass, so are the days of our lives.
module.exports = function ({ blobStore }) {
  const { updateProcessEnv } = require('./update-process-env');
  const path = require('path');
  require('./window');
  const getWindowLoadSettings = require('./get-window-load-settings');
  const { ipcRenderer } = require('electron');
  const { resourcePath, devMode } = getWindowLoadSettings();
  require('./electron-shims');

  // Add application-specific exports to module search path.
  const exportsPath = path.join(resourcePath, 'exports');
  require('module').globalPaths.push(exportsPath);
  process.env.NODE_PATH = exportsPath;

  // Make React faster
  if (!devMode && process.env.NODE_ENV == null) {
    process.env.NODE_ENV = 'production';
  }

  global.atom.initialize({
    window,
    document,
    blobStore,
    configDirPath: process.env.ATOM_HOME,
    env: process.env,
  });

  return global.atom.startEditorWindow().then(function () {
    // Workaround for focus getting cleared upon window creation
    const windowFocused = function () {
      window.removeEventListener('focus', windowFocused);
      setTimeout(() => document.querySelector('atom-workspace').focus(), 0);
    };
    window.addEventListener('focus', windowFocused);

    ipcRenderer.on('environment', (event, env) => updateProcessEnv(env));
  });
};
