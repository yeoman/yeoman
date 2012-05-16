

## Yeoman CLI

The Yeoman CLI presents a command line interface for creating, building, maintaining, and shipping a project. 


## Quick start based on H5BP node build script

**Fancy one line install:**

```sh
# sudo npm install
# sudo npm link (otherwise you'll get exceptions at the moment during scaffolding setup)

## Features

* Concats / Compresses JS
* Concats / Compresses CSS
* Inline CSS imports via
* Basic to aggressive html minification (via [html-minfier][])
* Optimizes JPGs and PNGs (with jpegtran & optipng)
* Renames JS/CSS to prepend a hash of their contents for easier versioning
* Revises the file names of your assets so that you can use heavy caching
* Updates your HTML to reference these new hyper-optimized CSS + JS files
* Experimental dom-based (with [JSDOM]()) build system.
* May rerun the build script on file changes (grunt's watch task &#10084;)
* May automatically reload the page in your browsers whenever watched files
  change, through some [socket.io] magic.

## Getting started

* [Install](https://github.com/h5bp/node-build-script/wiki/install) the package
* Check out the extensive [grunt documentation][], specifically the
  [Getting Started][] section.
* Learn more about [Usage](https://github.com/h5bp/node-build-script/wiki/overview)
  and [Configuration](https://github.com/h5bp/node-build-script/wiki/configuration)
* Look at the [available tasks](https://github.com/h5bp/node-build-script/wiki/tasks)
* Test out the experimental
  [dom-based](https://github.com/h5bp/node-build-script/wiki/dom) build
  system.


# Current components

[grunt]: https://github.com/cowboy/grunt
[grunt documentation]: https://github.com/cowboy/grunt/blob/master/docs/toc.md
[grunt plugin]: https://github.com/cowboy/grunt/blob/master/docs/plugins.md
[Getting Started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md#readme)
[JSDOM]: https://github.com/tmpvar/jsdom
[ant-build-script]: https://github.com/h5bp/ant-build-script
[socket.io]: http://socket.io
[html-minifier]: https://github.com/kangax/html-minifier
