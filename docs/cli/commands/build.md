

## <a href="#build" name="build">build</a>

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

Much of the build configuration information for a project is placed inside 'Gruntfile.js', a file which we automatically create when you generate a new project using Yeoman. This file can be fully customized to support which paths you wish to watch, have compiled (should they contain Compass or CoffeeScript files) and so on.

When you run `yeoman server`, we generate an intermediate build directory called `temp`, containing compiled versions of your Compass and CoffeeScript files as well as all of the other files needed to preview your application. Running `yeoman build` creates a `dist` directory which has completely optimized version of your application that can be deployed to staging.

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

### Require.js / r.js configuration

Yeoman has a special task that automatically handles the optimization of Require.js/AMD
projects using the r.js optimizer. Configuration for this optimization (i.e your r.js
configuration) should be done within the `rjs` section of the Gruntfile for a project.

You can either do this at a project level by editing your projects Gruntfile or do this
at a generator level if you would rather avoid editing the Gruntfile outside of the default
setup each time.

The following is the relevant block to edit within your Gruntfile: 

```javascript
    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts',
      wrap: true
   }
```

See the official project [repo](https://github.com/jrburke/r.js) for more information on the 
options supported by r.js.



