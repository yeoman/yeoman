

## Yeoman CLI

The Yeoman CLI presents a command line interface for creating, building, maintaining, and shipping a project. 


## Quick start

```
# sudo npm install -g
# sudo npm link (otherwise you'll get exceptions at the moment during scaffolding setup)
```

Next, navigate to where you would like to create a new project and then run:

```
yeoman init
```

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

```
Usage
 yeoman [options] [task [task ...]]

Options
    --help, -h  Display this help text.
        --base  Specify an alternate base path. By default, all file paths are
                relative to the "grunt.js" gruntfile. (grunt.file.setBase) *
    --no-color  Disable colored output.
      --config  Specify an alternate "grunt.js" gruntfile.
   --debug, -d  Enable debugging mode for tasks that support it. For detailed
                error stack traces, specify --debug 9.
   --force, -f  A way to force your way past warnings. Want a suggestion? Don't
                use this option, fix your code.
       --tasks  Additional directory paths to scan for task and "extra" files.
                (grunt.loadTasks) *
         --npm  Npm-installed grunt plugins to scan for task and "extra" files.
                (grunt.loadNpmTasks) *
    --no-write  Disable writing files (dry run).
 --verbose, -v  Verbose mode. A lot more information output.
     --version  Print the grunt version.

Options marked with * have methods exposed via the grunt API and should instead
be specified inside the "grunt.js" gruntfile wherever possible.

Available tasks
        concat  Concatenate files. *
          init  Generate project scaffolding from a predefined template.
          lint  Validate files with JSHint. *
           min  Minify files with UglifyJS. *
         qunit  Run QUnit unit tests in a headless PhantomJS instance. *
        server  Start a static web server.
          test  Run unit tests with nodeunit. *
         watch  Run predefined tasks whenever watched files change.
       default  Alias for "intro clean mkdirs concat css min rev usemin
                manifest" tasks.
        reload  Alias for "default connect watch:reload" tasks.
           css  Concats, replaces @imports and minifies the CSS files *
         intro  Kindly inform the developer about the impending magic
        mkdirs  Prepares the build dirs *
         clean  Wipe the previous build dirs
      manifest  Generates manifest files automatically from static assets
                reference. *
           rev  Automate the hash renames of assets filename *
         serve  Spawns up a local http server on both staging / output
                directory
        usemin  Replaces references to non-minified scripts / stylesheets *

Tasks run in the order specified. Arguments may be passed to tasks that accept
them by using colons, like "lint:files". Tasks marked with * are "multi
tasks" and will iterate over all sub-targets if no argument is specified.

The list of available tasks may change based on tasks directories or grunt
plugins specified in the "grunt.js" gruntfile or via command-line options.
```


# Current components

[grunt]: https://github.com/cowboy/grunt
[grunt documentation]: https://github.com/cowboy/grunt/blob/master/docs/toc.md
[grunt plugin]: https://github.com/cowboy/grunt/blob/master/docs/plugins.md
[Getting Started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md#readme)
[JSDOM]: https://github.com/tmpvar/jsdom
[ant-build-script]: https://github.com/h5bp/ant-build-script
[socket.io]: http://socket.io
[html-minifier]: https://github.com/kangax/html-minifier
