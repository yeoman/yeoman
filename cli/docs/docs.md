
# Yeoman Documentation

* Home
* Why Yeoman?
* Getting Started
* Requirements
* Documentation
* - Command Line
* - Package Manager
* FAQs


Todo: write up the tasks.
Yeoman command line interface section


## Why Yeoman?

Yeoman is a robust and opinionated client-side stack, comprised of tools and frameworks that can help developers quickly build beautiful web applications. We take care of providing everything needed to get started without any of the normal headaches associated with a manual setup.

With a modular architecture that can scale out of the box, we leverage the success and lessons learned from several open-source communities to ensure the stack developers use is as intelligent as possible.

As firm believers in good documentation and well thought out build processes, Yeoman includes support for linting, testing, minification and much more, so developers can focus on solutions rather than worrying about the little things.

Yeoman is fast, performant and is optimized to work best in modern browsers.


## Features

* Easily scaffold new projects with customizable templates (e.g HTML5 Boilerplate, Twitter Bootstrap)
* Watch process for compiling files (e.g Sass, CoffeeScript) and refreshing as you change them
* Built-in preview server for running projects
* Run all your JavaScript files against jshint
* Minify and concatenate  CSS/JavaScript files
* Compile any files needed (e.g CoffeeScript)
* Compile AMD modules automatically via r.js
* Revision names for filenames or folder names
* Compress and optimize all your images with ease
* Run unit tests in headless WebKit via PhantomJS
* Create an Application Cache via Confess.js


##Getting Started

## Quick start

*One line install:*

Open up a terminal and enter in the following:

```
# see the gist: https://gist.github.com/2829237
$ curl https://raw.github.com/gist/2829237/install.sh | sh
```

This will immediately install dependencies needed by Yeoman such as Node, NPM and Ruby.


## Requirements

The Yeoman install script will install any dependencies needed by the project. If however
you find yourself wishing to install these manually, you can find the find the list of 
requirements below.

* [node 0.6.x](http://nodejs.org/)
* [npm](http://npmjs.org/)

You should be able to use it on:

* OSX
* Unix



## Manual Installation

There are two main ways to install, using a "global" or a "local" install.

1. **When installed globally**: Provides a custom global binary named `yeoman`
(or `html5-boilerplate`) which is a wrapper on top of grunt, plus the extra
specific task and helpers.

2. **When installed locally**: ability to load in your project and grunt setup a
set of tasks that get referenced in your gruntfile (`grunt.js`) when run via `grunt`.

yeoman is not on npm (yet), but you can install it (and/or add it to
your project dependencies) using a tarball url, very much like if it was published
on npm.


### global install

```sh
npm install https://github.com/yeoman/yeoman/tarball/master -g
```

This installs Yeoman globally, which contains its own internal grunt and
provides a `yeoman` binary.

Proxies don't like redirections, if you get problem with this command, try
this instead:

```sh
npm install http://nodeload.github.com/yeoman/yeoman/tarball/master -g
```

### local install

This works for system where grunt have been already installed globally with

```sh
npm install grunt -g
```

1. Add the yeoman as a project dependency. In your project's root,
next to the `grunt.js` and `package.json` file, run `npm install
http://nodeload.github.com/yeoman/yeoman/tarball/master -S`

2. Add `grunt.loadNpmTasks('yeoman')` into the project's `grunt.js` gruntfile.

3. Run `grunt --help` and all of the yeoman's tasks and helpers
should be available in addition to those already provided by grunt.

The `-S` flag (or `--save`) will make npm add the dependency in the
`dependencies` property of your package.json. This is optional but ensures you
never forget to update your package.json file accordingly.

**Note**: Once on npm, it'll be easier. The `npm install -S` step will add the
following to your package.json file.

```js
"dependencies": {
  "yeoman": "0.1.1"
}
```

Change `0.1.1` to the tarball url: http://nodeload.github.com/yeoman/yeoman/tarball/master

### git clone / npm install

Clone or download this repo. Then, `cd` into it and run the `npm
install` command.

```sh
# will most likely change to map the new location / repo / branch
git clone git://github.com/yeoman/yeoman.git

# install the dependencies
# locally to play with it from the repo
npm install

# or globally, to install the yeoman binary
npm install -g
```

For development, the `npm link` command might be handy (posix only, instead of
`npm install -g`).

## Uninstall

You may want to uninstall the globally installed package by running the
following command:

```sh
npm uninstall yeoman -g
```

So sad to see you go ☹

If it was installed locally, next to your gruntfile, simply drop the
`node_modules/yeoman` folder.



## Yeoman Command-Line Interface (CLI)


# Options and Tasks

You'll find below a basic description and documentation for each option and task the Yeoman CLI provides. For each of these, we'll detail the task's configuration and how to change this.

Options:

* **[[init]]**: Initialize and scaffold a new project
* **[[watch]]**: Watch a project for changes, compiling any SASS/CoffeeScript files being used
* **[[server]]**: Launch a preview server which will begin watching for changes
* **[[build]]**: Build an optimized version of your app, ready to deploy
* **[[test]]**: Run a Jasmine test harness in a headless Phantom.js

Tasks:

* **[[clean]]**: Wipe the previous build dirs.
* **[[mkdirs]]**: Prepares the build dirs.
* **[[concat]]**: Concatenate files. *(built-in)*
* **[[css]]**: Concats, replaces @imports and minifies CSS files.
* **[[min]]**: Minify files using UglifyJS
* **[[rev]]**: Automate the revving of assets and perform the hash rename
* **[[usemin]]**: Replaces references to non-minified scripts / stylesheets


## Usage

**This assumes the package was installed globally.

## Project creation

# Option - init

Usage: `yeoman init`, `yeoman init myapp`

The `init` option asks you a number of questions (with default answers) for setting
up a new project. The answers to these questions will be used to scaffold a folder
a file structure for the application.

Questions include whether you would like to scaffold your project using HTML5
Boilerplate, include themeing via Twitter Bootstrap, support EcmaScript 6 Modules
in your project and so on. 

By default we support Compass and CoffeeScript, so if your project includes any 
.coffee files, these will be compiled when either `watch` or `build` tasks are being
run. 

Passing an extra argument to `yeoman init` (e.g `myapp`) will create a new directory
of the name `myapp` and Yeoman will then scaffold your application within this new
directory. 

Coming soon: We plan on yeoman init making requests to Nest to request the most recent
versions of dependencies your project may need. When this is integrated, we will add
further documentation about it to this page. 


# Option - server

Usage: `yeoman server`

The `server` option launches a preview server on port 3000 that allows you to access a 
running version of your application locally.

It also automatically fires up the `yeoman watch` process, so changes to any application
files cause the browser to refresh via LiveReload. 

Any changes to CoffeeScript or Compass files result in them being recompiled, meaning that
no manual intervention is required to write and preview code in the format you feel most
comfortable with.  

To quit the server, simply run `yeoman quit server` and this will kill the Python server
process.



## Flags

* `yeoman --help`

This will list out the options and tasks supported by yeoman and should print out the 
following to the console:

Usage: yeoman [options] [task [task ...]]

Available options supported by yeoman:

      init  Initialize and scaffold a new project
     build  Build an optimized version of your app, ready to deploy
    server  Launch a preview server which will begin watching for changes
      test  Run a Jasmine test harness in a headless Phantom.js
     watch  Watch for changes, compiling any SASS/CoffeeScript files being used
      docs  yeoman documentation

Available tasks the yeoman plugin provides (for a full list, type yeoman --help)

     clean  Wipe the previous build dirs
      copy  Copies the whole staging(intermediate/) folder to output
            (publish/) one
       css  Concats, replaces @imports and minifies the CSS files *
       dom  dom-based build system
      html  Basic to aggresive html minification
       img  Optimizes .png/.jpg images using optipng/jpegtran
    mkdirs  Prepares the build dirs *
       rev  Automate the hash renames of assets filename *
    server  Start a custom static web server
    usemin  Replaces references to non-minified scripts / stylesheets *

Build targets: yeoman build:<target>

   default  concat css min img rev usemin manifest
      text  concat css min     rev usemin manifest
  buildkit  concat css min img rev usemin manifest html:buildkit
    basics  concat css min img rev usemin manifest html:basics
    minify  concat css min img rev usemin manifest html:compress




## Loading tasks and helpers in your Yeoman setup

Note: Need to review whether we keep the below in place. 

You may opt to go for the local install, and manually load the tasks and helpers
the yeoman provides.

Assuming you have no gruntfile yet for your project, run the following grunt init command:

    grunt init:gruntfile

Grunt will ask you for few different things, simply follow the instructions.
This will create a new `grunt.js` file relative to your current working
directory.

The generated gruntfile should look like this (depending on the answers
to the few questions, check out [related grunt documentation][])

```js
/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    qunit: {
      files: ['test/**/*.html']
    },
    concat: {
      dist: {
        src: ['<banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');

};
```

To load the yeoman and helpers, you'll need to use

```js
grunt.loadNpmTasks('yeoman')
```

next to

```js
grunt.registerTask('default', 'lint qunit concat min');
```

# Tests

A significant amount of efforts have been put into setting up a basic test suite
to ensure everything is working properly.

As of now, the `default` and `usemin` task are tested.

`default` is the global task that runs the following tasks:

```js
grunt.registerTask('default', 'intro clean mkdirs concat css min rev usemin manifest');
```

Assertions on `default` task output are a good sanity check. Each tasks is then
tested individually (now the case of `usemin`)

This page will give a walkthrough on how to setup basic tests, how to run them
and how to write new ones.

## npm pretest

Tests are done on top of
[yeoman/yeoman](https://github.com/yeoman/yeoman/) repository.
The original repository is setup as a submodule at the `test/yeoman` location.

Running `npm test` will trigger the `pretest` npm script, and then execute the
`test/index.js` file:

```js
"pretest": "git submodule update --init"
```

## How the tests work

Testing a build script is somewhat tricky. Tests here aren't really unit tests,
they simply run a given grunt command, and run few basic assertions on the script output.

No test framework are used during the process, they require nothing but node.js.
It'll hopefully make them easier to understand for anyone that is familiar with
node and not a given chosen test framework.

Each assertion file is using a grunt helper to spawn a new process, executing a grunt command,
to finally run a few assertions on top of the output directory.

## Test structure


    * test/
      * fixtures
        * default/
          * expected.html
          * grunt.js
          * usemin.expected.html
          * usemin.html
        * ...
        * usemin/
          * expected.html
          * grunt.js
          * index.html

      * yeoman/
        * css/
        * js/
        * index.html
        * 404.html
        * ...

      * helpers/
        * index.js

      * tasks/
        * usemin/
          * index.js

* **test/fixtures**
Holds the fixtures file. If necessary test scripts will copy
files from fixtures to the test directory (`.test`) and have grunt operate on
top of that. This may include custom gruntfile and specific html files, testing
out the whole script or a specific feature. This directory usually include
subdirectories named after the task they meant to be used with.

* **test/yeoman**
this is the yeoman submodule. Running `git submodule update
--init` will make sure everything is here. Relatedly, this command is run
automatically before `npm test`.

* **test/helpers**
Contains few test helper, see below for further details.

* **test/tasks** Like `test/fixtures`, this directory usually include
subdirectories named after the task that is tested. Test files in this directory
are meant to test specific task / feature of the build script. They may be run directly using
`node test/tasks/usemin` (or any other implemented test).

## Writing a new test

Checkout the tests that have been setup, they usually are a good place to look at.

Tests are usually done like so:

```js
var fs = require('fs'),
  yeoman = require('../'),
  assert = require('assert'),
  runner = require('./helpers'),
  EventEmitter = require('events').EventEmitter;

//
// Setup the event emitter, an end event will be emitted on grunt completion.
//
// Depending on grunt's exit code, test fail or pass. Then, further assertions
// may perform few additional checks.
//
var test = new EventEmitter;

//
// Running tasks serially, tests pass or fail depending on grunt's exit code.
//

//
// `runner.setup` is mandatory, and deal with directory copy from `test/yeoman` to `.test`.
//
//  The tests and build process happens in this `.test` directory.
//
runner.setup(function(err) {

  //
  // optional fixtures copy test. Copy may copy a single or a set of files.
  //
  // Second argument is the destination, which may be a file (when copying a single file)
  // or a directory (`.test`).
  //
  runner.copy('test/fixtures/default/usemin.html', '.test/usemin.html', function(err) {
    if(err) throw err;

    // run the default task
    runner('.test', test)('default');
  });
});

// global check on index.html
test.on('end', function(err) {
  if(err) throw err;
  var result = fs.readFileSync('.test/index.html', 'utf8'),
    expected = fs.readFileSync('test/fixtures/default/expected.html', 'utf8');

  assert.equal(expected.trim(), result.trim());
});

//
// check the usemin version, eg. one using
//
//    <!-- build:js path/to/script.js -->
//
// kind of surrouding html comment.
//
test.on('end', function(err) {
  if(err) throw err;
  var result = fs.readFileSync('.test/usemin.html', 'utf8'),
    expected = fs.readFileSync('test/fixtures/default/usemin.expected.html', 'utf8');

  assert.equal(expected.trim(), result.trim());
});
```



# Task - min

[Read the grunt documentation on min built-in
task](https://github.com/cowboy/grunt/blob/master/docs/task_min.md#readme)

Min is another built-in grunt task that allows you to easily compress
JavaScript files through [UglifyJS](https://github.com/mishoo/UglifyJS/).

```js
min: {
  'publish/js/scripts.js': [ 'intermediate/js/scripts.js' ]
},
```

This is a **really** basic minify configuration, there's much more
built-in in the grunt min task, like [banner comments][], [specifying
uglifyjs options][], and [minifying while concatenating files][]. You're
encouraged to edit this basic minify configuration to match your very
own setup.

[specifying uglifyjs options]: https://github.com/cowboy/grunt/blob/master/docs/task_min.md#specifying-uglifyjs-options
[banner comments]: https://github.com/cowboy/grunt/blob/master/docs/task_min.md#banner-comments
[minifying while concatenating files]: https://github.com/cowboy/grunt/blob/master/docs/task_min.md#minifying-while-concatenating-files



# Task - mkdirs

The mkdirs task is working in tandem with the clean one, and creates the
necessary build dirs.

```js
// the staging directory used during the process
staging: 'intermediate/',

// final build output
output: 'publish/',

// filter any files matching one of the below pattern during mkdirs task
exclude: 'build/** node_modules/** grunt.js package.json *.md'.split(' '),

mkdirs: {
  staging: '<config:exclude>',
  output: '<config:exclude>'
},
```

Just as the clean task, config subprop are used to create the
directories. A basic mapping is done in configuration to get back the
directory values, (eg. `config(task.target) --> config('staging')`).

Values for each is an array of files to filter, eg. they'll not be
copied over during the process. These are
[minimatch](https://github.com/isaacs/minimatch#readme) patterns.

## Helpers

### mkdirs

`mkdir` helper is a basic wrapper for
[node-mkdirp](https://github.com/substack/node-mkdirp#readme).  Takes a
`directory` path to create, process is async if a valid callback
is passed in, otherwise `mkdirp.sync(dir)` is used.

```js
task.helper('mkdir', dir, cb);
```

### copy

`copy` helper uses [ncp](https://github.com/AvianFlu/ncp#readme)
and [minimatch](https://github.com/isaacs/minimatch#readme) to copy
the files under the current directory to the specified `dir`,
optionnaly ignoring files specified by the `options.ignore` property.

`options.ignore` can be a String of space delimited glob patterns,
an Array of glob patterns, or a filter function.

This helper is asynchronous only. Paths are always relative to
current working directory.

```js
task.helper('copy', source, dest, opts, function(e) {
  if(e) log.error(e.stack || e.message);
  else log.ok();
  cb(!e);
});
```

- source     - Path to the source directory
- dest       - where the files will be copied to
- opts       - (optional) An Hash object with an `ignore` property
- cb         - callback to call on completion



# Task - usemin

Replaces references ton non-optimized scripts / stylesheets into a
set of html files (or any template / views).

Usemin task is probably the trickiest one. It'll replace references to
non minified scripts / stylesheets to their optimized / versioned
equivalent.

```js
usemin: {
  files: ['publish/*.html']
}
```

In this configuration, it'll handle the replacement for any html files
located under the publish directory.

Right now the replacement is based on the filename parsed from content
and the files present in according directory (eg. looking up matching
revved filename into `output/` dir to figure out the hash generated).

If you'd like a little bit more flexibility, you can use "directives", some
special kind of html comments surrounding the part of html we want to replace
(original idea from [@necolas](https://github.com/necolas) in:
[#831](https://github.com/yeoman/html5-boilerplate/issues/831))

There is no need for JSDOM for this, this is plain regexp (JSDOM required
for data-build attributes).

Ex:

```html
<!-- build:css css/site.css -->
<link rel="stylesheet" href="css/style.css">
<!-- endbuild -->
```

Results in:

```html
<link rel="stylesheet" href="css/site.css">
```

A directive is composed of the following part:

```html
<!-- build:<target> <output> -->
... block ...
<!-- endbuild -->
```

* `<target>`
A known target is required (`css` or `js`). It'll namely allow you
to replace the html "block" with appropriate tag (eg. a `<link>` for
stylesheets, a `<script>` for js files, the task won't guess this from markup
for you)

* `<output>`
Path to the optimized asset. The html "block" is replaced with
according tag (depending on `<target>`) while replacing the src or href
attribute with the `<output>` value.

* `... block ...`
Anything inside the `<!-- build.. -->` and `<!-- endbuild -->` is replaced
depending on `<target>` and `<output>` values.

The resulting html is then passed through the global replace, looking up
matching revved filename in the output directory (defaults to `publish/`),
replacing references to their hash-prepended version.

This "directives" system will provide you a nice level of flexibility, and the
ability to be very descriptive on what gets replaced and by what.


# Task - server

`server` is a utility task to start a local http server on top of
generated build dirs, possibly intermediate/ and publish/ on different
ports.

It overrides the build-in grunt helper following the foundation as
described in [grunt's documentation][serve-task]

```js
serve: {
  staging: { port: 3000, base: 'intermediate/' },
  output: { port: 3001, base: 'publish/' }
},
```

If `--reload` cli option is used when `grunt serve` is run, a socket.io
server instance is created while a client-side sciprt is injected
dynamically on response (eg. it won't edit the generated file)

## Helpers

### server

`server` creates and returns a basic application server, a configuration
object may be passed where:

- base   - is the base directory to server static file from
- port   - server listen to this port

```js
task.helper('serve', config);
```

This helper is used by the `serve` and `serve.io` helpers below.

### serve.io

`serve.io` creates and returns a webserver and setup a socket.io instance and
the "inject" middleware. `/socket.io/socket.io.js` and `/reload.js` are
then available.

```js
task.helper('serve.io', config);
```

### serve

`serve` same as serve.io, without the socket.io connection and inject
middleware.

```js
task.helper('serve.io', config);
```

### inject.io

`inject.io` is a grunt helper returning a valid connect / express middleware.
It's job is to setup a middleware right before the usual static one, and to
bypass the response of `.html` file to render them with additional scripts.

```js
var app = connect()
  .use(task.helper('inject.io', config))
  .use(connect.static);

app.listen(3000);
```

[serve-task]: https://github.com/cowboy/grunt/blob/master/docs/task_server.md#readme


# Task - concat

[Read the grunt documentation on concat built-in
task](https://github.com/cowboy/grunt/blob/master/docs/task_concat.md#readme)

Concat is a built-in grunt task and allows you to easily concatenate a
list of files.

```js
concat: {
  'intermediate/js/scripts.js': [ 'js/plugins.js', 'js/script.js' ],
  'intermediate/css/style.css': [ 'css/*.css' ]
},
```

The mechanism is fairly simple:

* config subprop are the destination files.
* config subprop values are an array of glob patterns that will be
  expanded in the corresponding file arrays.

Each "fileset" is then concat into one file, the destination one.

If order is important, you might need to be a little more explicit here
and specify each script to be included (as glob patterns won't ensure
this). Actually, you can see this in action here with the
`intermediate/js/scripts.js` file.

This is a **really** basic concat configuration, there's much more
built-in in the grunt concat task, like [banner comments][], [multiple build
targets][], and [dynamic filenames][]. You're encouraged to edit this
basic concat configuration to match your very own setup.

[banner comments]: https://github.com/cowboy/grunt/blob/master/docs/task_concat.md#banner-comments
[multiple build targets]: https://github.com/cowboy/grunt/blob/master/docs/task_concat.md#multiple-build-targets
[dynamic filenames]: https://github.com/cowboy/grunt/blob/master/docs/task_concat.md#dynamic-filenames



# Task - connect

The connect is a special little utility task working in tandem with the
watch one.

It's a slight variation of the serve command, but includes / injects
some socket.io magic to be able to reload any opened webpage in your
browsers.

Basically, the idea is that anytime you change a watched files
(js/css/templates, etc.), a new build is triggered and an event is
emitted back to any connected clients to reload pages automatically.

```js
connect: {

  intermediate: {
    port: 3000,
    logs: 'dev',
    dirs: true
  },

  publish: {
    port: 3001,
    logs: 'default',
    dirs: true
  }

}
```

## Helpers

> todo


# Task - rev

The rev task is a really simple one. Its role is to read the content of
a given file, generate a hash and prepend that hash to the original
filename.

```js
rev: {
  js: ['publish/js/*.js'],
  css: ['publish/css/*.css'],
  img: ['publish/img/*']
},
```

From this configuration example, the rev task will iterate through each
expanded files for js / css / img subtasks and generate a hash from
their content and rename each file accordingly.

A `scripts.js` file will be renamed into something like
`12345678.scripts.js`. The hash will change only when the content
changes.

## Helpers

### hash

`hash` helper takes care of files revving, by renaming any files in the
given `files` pattern(s), with passed in `options`.

```js
task.helper('hash', files, options);
```

- files      - String or Array of glob pattern
- options    - (optional) An Hash object where:
  - cwd     - Base directory to work from, glob patterns are
  prepended to this path.


### md5

`md5` helper is a basic wrapper around crypto.createHash, with given
`algorithm` and `encoding`. Both are optional and defaults to `md5` and
`hex` values.

```js
task.helper('md5', file, algorithm, encoding);
```




# Task - clean

The clean task will remove and delete any previous build dirs (which
are mapping `staging` and `output` config value).

```js
staging: 'intermediate/',

// final build output
output: 'publish/',
```

## Helpers

### rimraf

`rimraf` is the helper wrapper for
[rimraf](https://github.com/isaacs/rimraf#readme) package. The given
`cb` callback if passed in will make the call asynchronous, otherwise
`rimraf.sync` is used.

    task.helper('rimraf', dir, cb);







*Testing*

-`$ yeoman test`
* Runs the jasmine test harness in a headless Phantom.js

*Project Build*

Yeoman leverages third party tools to construct an optimized version of your app ready to deploy.

`$ yeoman build`
* Grunt tackles the hard work
* All js files run against jshint
* CSS/JS recompiled
* r.js to compile AMD modules for the app
* Concatenation and minification
* rev filenames (or folder names)
* Image compression
* Run unit tests in headless WebKit via PhantomJS
* Create appcache via Confess.js in PhantomJS
* Publish optimized app to folder



## Frequently Asked Questions

**What is a package manager?**

A package manager runs through a command-line interface and is a tool for automating the process of installing, upgrading, configuring and managing dependencies for projects.

**What is a command-line interface?**

A command-line interface is a means for developers to interact with a system using text commands. On OSX this this is often done using the Terminal and on Windows we use the command shell or a third-party tool such as [Cygwin](http://www.cygwin.com/).

