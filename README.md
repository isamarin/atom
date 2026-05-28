# Atom (Community Fork)

Maintained fork of [Atom](https://github.com/atom/atom), the hackable text editor built on [Electron](https://github.com/electron/electron).

The original Atom project was archived by GitHub on December 15, 2022. This fork keeps Atom alive with updated dependencies and security fixes.

## What's Changed

- **Electron 28.3.3** (up from 11.5.0) with Node 18 runtime
- **`@electron/remote`** migration from deprecated built-in `remote` module
- **Security fixes**: updated DOMPurify, semver, removed abandoned devtron
- **Startup profiling**: built-in startup timing report in DevTools console
- **Docker**: updated build image (Ubuntu 22.04, Node 18, Python 3)
- Trimmed unused bundled packages for faster startup

## Installing

### Prerequisites
- [Git](https://git-scm.com)
- [Node.js 18+](https://nodejs.org/) (for building from source)

### macOS

Download the latest release from the [Releases page](https://github.com/isamarin/atom/releases).

### Building from Source

```sh
git clone https://github.com/isamarin/atom.git
cd atom
npm install
script/build
```

#### Docker

```sh
docker build -t atom-build .
docker run -v $(pwd):/atom -w /atom atom-build "script/build"
```

### System Dependencies (Linux)

```sh
sudo apt install build-essential git libsecret-1-dev libx11-dev \
  libxkbfile-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2-dev
```

## Startup Profiling

Open DevTools (View > Developer > Toggle Developer Tools) and check the console on startup. You'll see:

- **Startup Profile** -- time spent in each startup phase
- **Package Activation Times** -- per-package activation cost, sorted slowest first

Use this data to identify and disable slow packages.

## License

[MIT](https://github.com/atom/atom/blob/master/LICENSE.md)
