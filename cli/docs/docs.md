
# Yeoman Documentation

* Home
* Why Yeoman?
* Getting Started
* Requirements
* Documentation
* - Command Line
* - Package Manager
* FAQs



## Why Yeoman?

Yeoman is a robust and opinionated client-side stack, comprised of tools and frameworks that can help developers quickly build beautiful web applications. We take care of providing everything needed to get started without any of the normal headaches associated with a manual setup.

With a modular architecture that can scale out of the box, we leverage the success and lessons learned from several open-source communities to ensure the stack developers use is as intelligent as possible.

As firm believers in good documentation and well thought out build processes, Yeoman includes support for linting, testing, minification and much more, so developers can focus on solutions rather than worrying about the little things.

Yeoman is fast, performant and is optimized to work best in modern browsers.


## Features

* Easily scaffold new projects with customizable templates (e.g HTML5 Boilerplate, Twitter Bootstrap)
* Watch process for compiling files (e.g Sass, CoffeeScript) and refreshing as you change them
* Built-in preview server for running projects
* Run all your JavaScript files against JSHint
* Minify and concatenate CSS/JavaScript files
* Compile any files needed (e.g CoffeeScript)
* Compile AMD modules automatically via r.js
* Revision names for filenames or folder names
* Compress and optimize all your images with ease
* Run unit tests in headless WebKit via PhantomJS
* Create an Application Cache manifest via Confess.js


## Getting Started

**Step 1: One line install**

Open up a terminal and enter in the following:

```sh
# see the gist: https://gist.github.com/2829237
$ curl https://raw.github.com/gist/2829237/install.sh | sh
```

This will immediately install Yeoman and any dependencies it may need such as Node, NPM and Ruby.

**Step 2: Create a new project**

Next, enter in `yeoman init` followed by the name of the directory you would like to scaffold your application in.

```sh
$ yeoman init myapp
```
If a directory isn't supplied, we'll infer a name based on the directory you're in at the moment.

**Step 3: Scaffold your app!**

We'll then ask you some questions to help scaffold your project out. Simple! 


## Requirements

The Yeoman install script will install any dependencies needed by the project. If however
you find yourself wishing to install these manually, you can find the find the list of 
requirements below.

* [node 0.6.x](http://nodejs.org)
* [npm](http://npmjs.org)

You should be able to use it on:

* OSX
* Unix

### Manual Installation

There are two main ways to install, using a "global" or a "local" install.

1. **When installed globally**: Provides a custom global binary named `yeoman`
(or `html5-boilerplate`) which is a wrapper on top of grunt, plus the extra
specific task and helpers.

2. **When installed locally**: ability to load in your project and grunt setup a
set of tasks that get referenced in your gruntfile (`grunt.js`) when run via `grunt`.

yeoman is not on npm (yet), but you can install it (and/or add it to
your project dependencies) using a tarball url, very much like if it was published
on npm.


#### global install

```sh
npm install http://nodeload.github.com/yeoman/yeoman/tarball/master -g
```

This installs Yeoman globally, which contains its own internal grunt and
provides a `yeoman` binary.


### local install

This works for system where grunt have been already installed globally with

```sh
npm install grunt -g
```

1. Add yeoman as a project dependency. In your project's root,
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



## Command-Line Interface (CLI)


### Commands and Tasks

You'll find below a basic description and documentation for each command and task the Yeoman CLI provides. For each of these, we'll detail the task's configuration and how to change it.

#### Commands:

* **init**: Initialize and scaffold a new project
* **watch**: Watch a project for changes, compiling any SASS/CoffeeScript files being used
* **server**: Launch a preview server which will begin watching for changes
* **build**: Build an optimized version of your app, ready to deploy
* **test**: Run a Jasmine test harness in a headless Phantom.js

#### Tasks:

* **clean**: Wipe the previous build dirs
* **mkdirs**: Prepares the build dirs
* **concat**: Concatenate files *(built-in)*
* **css**: Concatenates, replaces @imports and minifies CSS files
* **min**: Minify files using UglifyJS
* **rev**: Automate the revving of assets and perform the hash rename
* **usemin**: Replaces references to non-minified scripts / stylesheets


# Usage

**This assumes the package was installed globally.

## Command - init

Usage: `yeoman init`, `yeoman init myapp`

The `init` command asks you a number of questions (with default answers) for setting
up a new project. The answers to these questions will be used to scaffold a file structure for the application.

Questions include whether you would like to scaffold your project using HTML5
Boilerplate, include theming via Twitter Bootstrap, support ECMAScript 6 Modules
in your project and so on.

By default we support Compass and CoffeeScript, so if your project includes any .coffee files, these will be compiled when either `watch` or `build` tasks are being
run.

Passing an extra argument to `yeoman init` (e.g `myapp`) will create a new directory
of the name `myapp` and Yeoman will then scaffold your application within this new
directory.

Coming soon: We plan on yeoman init making requests to Nest to request the most recent
versions of dependencies your project may need. When this is integrated, we will add
further documentation about it to this page.


## Command - server

Usage: `yeoman server`

The `server` command launches a preview server on port 3000 that allows you to access a running version of your application locally.

It also automatically fires up the `yeoman watch` process, so changes to any of the applications
files cause the browser to refresh via LiveReload.

Any changes to CoffeeScript or Compass files result in them being recompiled, meaning that
no manual intervention is required to write and preview code in the format you feel most
comfortable with.

To quit the server, simply run `yeoman quit server` and this will kill the Python server
process.


## Command - watch

Usage: `yeoman watch`

Yeoman integrates with LiveReload so the browser refreshes every time a change is made to your
application.

Similar to the `build` command, this automatically recompiles CoffeeScript and SASS files so you
don't need to do anything extra to continue editing your source files.



## Command - build

Usage: `yeoman build`, `yeoman build:<target>`

Yeoman leverages third party tools to construct an optimized version of your application that's ready to deploy.

We make use of [Grunt](https://github.com/cowboy/grunt) behind the scenes to tackle much of the hard work for this, with some useful additions that assist
with compression, optimization and testing.

These include:

* Linting all JavaScript files against JSHint
* Recompiling all CoffeeScript and SASS files for production
* Using r.js to compile and optimize any AMD modules
* Concatenation and minification of scripts and stylesheets
* Compressing your images using OptiPNG for PNG files and JPEGtran-turbo for JPEGs
* Running any unit tests written against a headless WebKit browser (via PhantomJS)
* Creating an Application Cache manifest via Confess.js
* Using revision filenames or oldernames

We finally publish an optimized version of your application to your project directory
so that it can be deployed to production right after.

Yeoman supports a number of build targets to be used with `yeoman build`. To implicitly
pass the `default` target one would run `yeoman build:default` for example. The complete
list of supported build targets can be found below:

* default: Runs `concat css min img rev usemin manifest`
* text: Runs `concat css min rev usemin manifest`
* buildkit: Runs `concat css min img rev usemin manifest html:buildkit`
* basics: Runs `concat css min img rev usemin manifest html:basics`
* minify: Runs `concat css min img rev usemin manifest html:compress`

Each build target above runs a number of different build *tasks*. The supported
tasks included with Yeoman out of the box are:

* clean: Wipe the previous build dirs
* copy: Copies the whole staging(intermediate/) folder to output (publish/) one
* css: Concatenates, replaces @imports and minifies the CSS files
* dom: DOM-based build system
* html: Basic to aggressive HTML minification
* img: Optimizes .png/.jpg images using OptiPNG/JPEGtran
* mkdirs: Prepares the build dirs
* rev: Automate the hash renames of assets filename
* usemin: Replaces references to non-minified scripts / stylesheets

More comprehensive information on each task can be found lower down the page.


## Command - test

Usage: `yeoman test`

This command runs a Jasmine test harness in a headless instance of Phantom.js.

## Command - install

Usage: `yeoman install <name>`

Installs a package <name> and any packages that this depends on using Twitter Nest. A package is a folder containing a resource described by a package.json file or a gzipped tarball containing this information.  

Running yeoman install <name> will install the dependencies in your project’sl browser_modules folder. 

For further information, see the section on the package manager.

## Command - update

Usage: `yeoman update <name>`

Updates the package <name> to the latest version available.


## Command - uninstall

Usage: yeoman uninstall <name>

Removes the package <name> from the current project.


## Flags

* `yeoman --help`

This will list out the commands and tasks supported by yeoman and should print out the following to the console:

Usage: yeoman [command] [task [task ...]]

Available commands supported by yeoman:

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
       dom  DOM-based build system
      html  Basic to aggressive HTML minification
       img  Optimizes .png/.jpg images using OptiPNG/JPEGtran
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


# Tasks

## Task - css

Usage: `yeoman css`

The css task concatenates CSS files and runs them through the requirejs optimizer
to handle `@import` inlines within files.

## Task - img

Usage: `yeoman img`

The img task handles image compression optimizations by running any `.png` or `.jpg` files in an application through OptiPNG and JPEGTran. 

## Task - html

Usage: `yeoman html`

The html task handles HTML minification and runs markup files through the @kangax [html-minifier](http://perfectionkills.com/experimenting-with-html-minifier/) project. 

## Task - rjs

Usage: `yeoman rjs`

The rjs task runs any JavaScript files through the r.js optimizer for RequireJS. This is particularly useful if using AMD or the experimental ES6 module support.


## Task - min

Usage: `yeoman min`

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
UglifyJS options][], and [minifying while concatenating files][]. You're
encouraged to edit this basic minify configuration to match your very
own setup.

[specifying uglifyjs options]: https://github.com/cowboy/grunt/blob/master/docs/task_min.md#specifying-uglifyjs-options
[banner comments]: https://github.com/cowboy/grunt/blob/master/docs/task_min.md#banner-comments
[minifying while concatenating files]: https://github.com/cowboy/grunt/blob/master/docs/task_min.md#minifying-while-concatenating-files



## Task - mkdirs

Usage: `yeoman mkdirs`

The mkdirs task works in conjunction with the `clean` task. It creates the necessary build directories.


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

Similar to the `clean` task, configuration subj-properties are used to create
the directions. A basic mapping is done in configuration to get back the
directory values, (eg. `config(task.target) --> config('staging')`).

Values for each are an array of files to filter, eg. they'll not be
copied over during the process. These are
[minimatch](https://github.com/isaacs/minimatch#readme) patterns.

## Helpers

### mkdirs

`mkdir` helper is a basic wrapper for
[node-mkdirp](https://github.com/substack/node-mkdirp#readme). Takes a
`directory` path to create. Process is async if a valid callback
is passed in, otherwise `mkdirp.sync(dir)` is used.

```js
task.helper('mkdir', dir, cb);
```

### copy

`copy` helper uses [ncp](https://github.com/AvianFlu/ncp#readme)
and [minimatch](https://github.com/isaacs/minimatch#readme) to copy
the files under the current directory to the specified `dir`,
optionally ignoring files specified by the `options.ignore` property.

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
- dest       - Where the files will be copied to
- opts       - (optional) An Hash object with an `ignore` property
- cb         - Callback to call on completion



## Task - usemin

Usage: `yeoman usemin`

Replaces references to non-optimized scripts / stylesheets into a
set of HTML files (or any template / views).

Usemin task is probably the trickiest one. It'll replace references to
non minified scripts / stylesheets to their optimized / versioned
equivalent.

```js
usemin: {
  files: ['publish/*.html']
}
```

In this configuration, it'll handle the replacement for any HTML files
located under the publish directory.

Right now the replacement is based on the filename parsed from content
and the files present in according directory (eg. looking up matching
revved filename into `output/` dir to figure out the hash generated).

If you'd like a little bit more flexibility, you can use "directives", some
special kind of HTML comments surrounding the part of HTML we want to replace
(original idea from [@necolas](https://github.com/necolas) in:
[#831](https://github.com/yeoman/html5-boilerplate/issues/831))

There is no need for JSDOM for this, this is plain regexp (JSDOM required
for data-build attributes).

Eg:

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
A known target is required (`css` or `js`). It'll allow you
to replace the HTML "block" with appropriate tag (eg. a `<link>` for
stylesheets, a `<script>` for js files, the task won't guess this from markup
for you)

* `<output>`
Path to the optimized asset. The HTML "block" is replaced with
according tag (depending on `<target>`) while replacing the src or href
attribute with the `<output>` value.

* `... block ...`
Anything inside the `<!-- build.. -->` and `<!-- endbuild -->` is replaced
depending on `<target>` and `<output>` values.

The resulting HTML is then passed through the global replace, looking up
matching revved filenames in the output directory (defaults to `publish/`),
replacing references to their hash-prepended version.

This "directives" system will provide you a nice level of flexibility, and the
ability to be very descriptive on what gets replaced and by what.


## Task - server

`server` is a utility task to start a local HTTP server on top of
generated build dirs, possibly intermediate/ and publish/ on different
ports.

It overrides the built-in grunt helper following the foundation as
described in [grunt's documentation][serve-task]

```js
serve: {
  staging: { port: 3000, base: 'intermediate/' },
  output: { port: 3001, base: 'publish/' }
},
```

If `--reload` cli option is used when `grunt serve` is run, a socket.io
server instance is created while a client-side script is injected
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

`serve.io` creates and returns a web server and setup a socket.io instance and
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


## Task - concat

Usage: `yeoman concat`

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

Each "fileset" is then concatenated into one file, the destination one.

If order is important, you might need to be a little more explicit here
and specify each script to be included (as glob patterns won't ensure
this). Actually, you can see this in action here with the
`intermediate/js/scripts.js` file.

This is a **really** basic concat configuration. There is a lot more
built into the grunt concat task, like [banner comments][], [multiple build
targets][], and [dynamic filenames][]. You're encouraged to edit this
basic concat configuration to match your own setup.

[banner comments]: https://github.com/cowboy/grunt/blob/master/docs/task_concat.md#banner-comments
[multiple build targets]: https://github.com/cowboy/grunt/blob/master/docs/task_concat.md#multiple-build-targets
[dynamic filenames]: https://github.com/cowboy/grunt/blob/master/docs/task_concat.md#dynamic-filenames



## Task - rev

Usage: `yeoman rev`

The rev task reads in the content of a given file, generates a hash and 
prepends that hash to the original filename.

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
- cwd        - Base directory to work from, glob patterns are prepended to this path.


### md5

`md5` helper is a basic wrapper around crypto.createHash, with given
`algorithm` and `encoding`. Both are optional and defaults to `md5` and
`hex` values.

```js
task.helper('md5', file, algorithm, encoding);
```


## Task - clean

Usage: `yeoman clean`

The clean task will remove and delete any previous build dirs (which
are mapping the `staging` and `output` config values).

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

```js
task.helper('rimraf', dir, cb);
```



## Package Manager (Nest)

Until now, client-side JavaScript has not benefited from a rich package management solution such as those found in other platforms (e.g NPM, RubyGems). By instead maintaining packages of packages in client-side JS, developers reduced the chances of using up-to-date versions of libraries.

Yeoman's integration with Twitter Nest changes that.

In Nest, dependencies are listed in a ‘package.json’ file, similar to Node’s package (adhering as closely as possible to the [commonjs specification](http://wiki.commonjs.org/wiki/Packages/1.0)):

```json
 {
   "dependencies": {
     "modernizr": "~2.5.3"
   }
 }
 ```

Dependencies are then installed locally via the `yeoman install’ command. First they're resolved to find conflicts, then downloaded and unpacked in a local sub dir (browser_modules) to package.json, for example:

```
/package.json
/browser_modules/modernizr/index.js
/browser_modules/modernizr/package.json
```

This approach has a number of benefits.

* There are no system wide dependencies and no dependencies are shared between different applications
* None of this is JavaScript specific. Packages can contain JavaScript, CSS, images etc
* None of this is specific to a specific module format (e.g AMD/CommonJS). These formats can be used but aren't required
* The dependency tree is flat meaning that we don't ship multiple versions of say, Modernizr to clients

For information on how to use Yeoman's Nest integration, see `yeoman install` and `yeoman update`



## EcmaScript 6 Modules And Module Support

Yeoman comes with experimental support for ES6 modules, made possible through Require HM. HM allows us to write ES.next module syntax and as long as code is saved in files with `.hm` extension, they can be used with RequireJS and AMD as if they were regular ES3/5 scripts.


*Note: The ES.next module specification is not yet complete and is subject to change. As such, the material below should be considered correct as of June, 2012 but for later dates the Harmony wiki entry on modules should be consulted to ensure correctness.

Also note that as Require HM is a RequireJS plugin, ES6 modules are only supported when used with RequireJS. We hope to change this in the future once support for ES6 modules in Google Traceur has improved.*

###module:

In ES6, A module is a unit of code contained within a `module` declaration. It can either be defined inline or within an externally loaded module file. A skeleton inline module for a Car could be written:

```
module Car{
  // import …
  // export … 
}
```
When we say *externally loaded modules*, we are referring to modules which are either loaded using `import` declarations or the Module Loader API. Both will be covered shortly.

A module *instance* is a module which has been evaluated, is linked to other modules or has lexically encapsulated data. Examples of modules instances are:

```
module myCar = Car;
module myCar at "car.js";

```

`module` declarations can be used in the following contexts:


```
module Universe {}
module Universe { module MilkyWay {} }
module MilkyWay = "Universe/MilkyWay"
module System = Universe.MilkyWay.SolarSystem
module System = SolarSystem

```

###export:

An export declaration declares that a local function or variable binding is visible externally to other modules. If familiar with the module pattern, think of this concept as being parallel to the idea of exposing functionality publicly. 

```
module Car{

  // Internals
  var licensePlateNo = "556-343"
  
  // Exports
  export function drive(speed, direction){
    console.log('We are driving at a speed of ' + speed + ', ' + direction);    
  }

  export var miles = 5000;
  export var color = "silver";
}

```

Modules `import` what they wish to use from other modules. Other modules may read the module exports (e.g `drive()`, `miles` etc. above) but they cannot modify them. Exports can be renamed as well so their names are different from local names. 

A module may also export other modules for consumption.

```
module Car{
  export module engine{}
  export module driver{}
  export module seats{}
}
```

`export` can be used in the following contexts:

```
export var document
export var document = { }
export function parse() { }
export module System = SolarSystem
export SolarSystem
export Mercury, Venus, Earth
export * from SolarSystem
export { Mercury: SolarSystem.Mercury, Earth: SolarSystem.Earth }
```


###import:

An import declaraction binds another modules exports as local variables. Variables that are imported can be locally renamed to avoid naming conflicts. 

```
module Car{
  export function drive(speed, direction){
    console.log('details:', speed, direction);    
  }
  
  export module engine{
    export function check(){ ... }
  }

  export var miles = 5000;
  export var color = "silver";

};
```

Revisiting the export example above, we can now selectively choose what we wish to `import` when in another module.

We can just import `drive()`:

```
import drive from Car;
```

We can import `drive()` and `miles`:

```
import {drive, miles} from Car;
```

We can import `check()` from our engine module:

```
import check from Car.engine;
```

We can import all of the exports:

```
import * from Car;
```

We can also import an entire file as a module:

```
import "car.js" as Car;
```

Or import `drive()` without needing to bind the module to a local name:

```
import drive from "car.js";
```

This similarly works with JavaScript libraries like Underscore.js:

```
import reduce from "Underscore.js"
```


### module, import and export

Bringing these three concepts together:


```
module vehicle{
  export function drive(speed, direction){
    console.log('We are driving at a speed of ' + speed + ', ' + direction);
  };
  
  export function stop(){
    console.log('We have stopped');
  };
  
  export var miles = 0;
  export var color = "silver";
  export var wheels = 4;
}

module basicExtras{
  export var carSeat = true;
  export var specialRims =  true;
  export var mp3Player = true;
}

module premiumExtras{
  export module GPS{
    //...
  }
}

```

```
// Engine.js
module engine{

}
```

```
module Car{
  import * from vehicle;
  import {specialRims, mp3Player} from basicExtras;
  import "engine.js" as engine;
  module navigationSystem from premiumExtras.GPS;
  
  export drive;
  export stop;
}
```

-- how do you rename exports?



### dynamically loading modules

Earlier, we mentioned the concept of a Module Loader API. The module loader allows us to dynamically load in scripts for consumption. Similar to `import`, we are able to consume anything defined as an `export` from such modules.

```
// Signature: load( moduleURL, callback, errorCallback )

Loader.load("car.js", function(car) {
        console.log(car.drive(500, "north"));
    }, function(err){
        console.log("Error:" + err);
    });

```

`load()` accepts three arguments:

* moduleURL: The string representing a module URL (e.g "car.js")
* callback: A callback function which receives the output result of attempting to load, compile and then execute the module
* errorCallback: A callback triggered if an error occurs during loading or compilation

Whilst the above example seems fairly trivial to use, the Loader API is there to provide a way to load modules in controlled contexts and actually supports a number of different configuration options. `Loader` itself is a system provided instance of the API, but it's possible to create custom loaders using the `Loader` constructor. 


```
// The Loader constructor creates a new loader
var customLoader = new Loader(
    // Define the parent of this loader
    // if a custo one exists, otherwise
    // just use the default system Loader
    Loader, {

    // Global object for the Loader
    global: Object.create(null),

    // Loader's base URL
    baseURL: baseURL,

    // A flag indicating whether code should be evaluated
    // in strict mode
    strict: false,         
                     
    // Source of the loader intrinsics which can either
    // be an existing loader or just null
    linkedTo: Loader || null,

    // The module resolution hook
    resolve: function( relativeURL, baseURL ){..},

    // The module loading hook
    fetch: function( relativeURL, baseURL, request, resolved ){…},

    // A hook for source translation
    translate: function( src, relativeURL, baseURL, resolved ){…}
});
```                     
 

Let's review the final three hooks in more detail:

**fetch: function( relativeURL, baseURL, request, resolved ):**

Once a module is resolved, it must be fetched. The `fetch` hook allows us to fetch code from an external resource and returns its source via the first callback or rejecting the code via the second callback. 


The `fetch` request object has three callbacks:

```
request = {

  // callbacks for the loading hook
  
  // callback to create the successfully loaded source
  fulfill: function( src ){..},
  
  // callback to indicate the source should be loaded from a different URL
  redirect: function( url, baseURL ){..}
  
  // callback to indicate am error occurred in the loading
  reject: function( msg )
}
```

If we don't supply a `fetch` hook, the parent Loader's `fetch` is used instead.



**resolve: function( relativeURL, baseURL ):**



**translate: function( src, relativeURL, baseURL, resolved ):**

When code is evaluated, we have the option of translating the source of that code using this hook. The hook can either produce the final source code or throw an exception if something goes wrong. 


A complete custom loader example could thus be written as follows:

```
var customLoader = new Loader(Loader,{
    global: window,
    baseURL: document.URL.substring(0, document.URL.lastIndexOf('\/') + 1),
    strict: false,
    resolve: function (relURL, baseURL) {
      var url = baseURL + relURL;
      return url;
    },
    fetch: function (relURL, baseURL, request, resolved) {
      var url = baseURL + relURL;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            request.fulfill(xhr.responseText);
          } else {
            request.reject(xhr.statusText);
          }
        }
      };
      xhr.open("GET", url, true);
      xhr.send(null);
    },
    translate: function (src, relURL, baseURL, resolved) {
      return src;
    }
  });
```


*Note: As Require HM is able to work with the RequireJS `define()` and `require()` syntax, it doesn't currently support the Module Loader API. If one is however required, there is a shim available for this feature [here](https://github.com/addyosmani/es6-module-loader/).*


### What else can be done with modules?

We can also define modules with a shared state:

```
module Car{
  export module milesCounter {
      var miles = 0;
      export function addMile() { return miles++ }
      export function currentMiles() { return miles }
  };
};
```

or cyclic dependencies:

```
module Car {
    import * from Scooter;
    export function even(n) {
        return n == 0 || odd(n - 1);
    }
}
 
module Scooter {
    import * from Car;
    export function odd(n) {
        return n != 0 && even(n - 1);
    }
}
```


*Note: Require HM does not presently support cyclic dependencies. We are working on fixing this limitation.*



## Frequently Asked Questions

### What is a package manager?

A package manager runs through a command-line interface and is a tool for automating the process of installing, upgrading, configuring and managing dependencies for projects.

### What is a command-line interface?

A command-line interface is a means for developers to interact with a system using text commands. On OSX this this is often done using the Terminal and on Windows we use the command shell or a third-party tool such as [Cygwin](http://www.cygwin.com).





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

No test framework are used during the process, they require nothing but Node.js.
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
top of that. This may include custom gruntfile and specific HTML files, testing
out the whole script or a specific feature. This directory usually include
subdirectories named after the task they meant to be used with.

* **test/yeoman**
This is the yeoman submodule. Running `git submodule update
--init` will make sure everything is here. Relatedly, this command is run
automatically before `npm test`.

* **test/helpers**
Contains a few test helpers, see below for further details.

* **test/tasks** Like `test/fixtures`, this directory usually include subdirectories named after the task that is tested. Test files in this directory are meant to test specific task / feature of the build script. They may be run directly using `node test/tasks/usemin` (or any other implemented test).

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
