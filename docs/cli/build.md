## build

Usage: `yeoman build`, `yeoman build:<target>`

Constructs an optimized version of your application that's ready to deploy.

Yeoman makes use of [Grunt](https://github.com/cowboy/grunt) behind the scenes to tackle much of the hard work for this, with some useful additions that assist with compression, optimization and testing.

These include:

* Linting all JavaScript files against JSHint
* Recompiling all CoffeeScript and SASS files for production
* Using r.js to compile and optimize any AMD modules
* Concatenation and minification of scripts and stylesheets
* Compressing your images using OptiPNG for PNG files and JPEGtran-turbo for JPEGs
* Running any unit tests written against a headless WebKit browser (via PhantomJS)
* Creating an Application Cache manifest via Confess.js
* Using revision filenames or oldernames

When you run `yeoman server`, we generate an `intermediate` build directory for your project, containing compiled versions of your Compass and CoffeeScript files as well as all of the other files needed to preview your application. Running `yeoman build` creates a `publish` directory which has completely optimized version of your application that can be deployed to staging.

### Build targets

Yeoman supports a number of build targets to be used with `yeoman build`. To implicitly
pass the `default` target one would run `yeoman build:default` for example. The complete
list of supported build targets can be found below:

* default: Runs `concat css min img rev usemin manifest`
* text: Runs `concat css min rev usemin manifest`
* buildkit: Runs `concat css min img rev usemin manifest html:buildkit`
* basics: Runs `concat css min img rev usemin manifest html:basics`
* minify: Runs `concat css min img rev usemin manifest html:compress`


### Sub-tasks

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

