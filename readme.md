# Welcome, Friend! [![Build Status](https://secure.travis-ci.org/yeoman/yeoman.png?branch=master)](http://travis-ci.org/yeoman/yeoman)

## What am I?

Yeoman is a robust and opinionated client-side stack, comprising tools and frameworks that can help developers quickly build beautiful web applications. We take care of providing everything needed to get started without any of the normal headaches associated with a manual setup.

![image](http://yeoman.io/media/yeoman-masthead.png)

Yeoman is fast, performant and is optimized to work best in modern browsers.

For more information about the project, see [yeoman.io](http://yeoman.io).


## Installation

Try the audit script to see what you need in place:

```shell
curl -L get.yeoman.io | bash
```

You can follow its guidance or simply walk through the [installation procedure](https://github.com/yeoman/yeoman/wiki/Manual-Install).

*Yeoman requires Node 0.8.x*


## Issue submission

Make sure you've read the [issue submission guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission) before you open a [new issue](https://github.com/yeoman/yeoman/issues/new).


## Documentation

For more information on Yeoman, please read our [complete documentation](https://github.com/yeoman/yeoman/tree/master/docs/cli).

Yeoman supports a powerful set of high-level commands. These include:

```shell
yeoman init      # Initialize and scaffold a new project using generator templates
yeoman build     # Build an optimized version of your app, ready to deploy
yeoman server    # Launch a preview server which will begin watching for changes
yeoman test      # Run a Mocha test harness in a headless PhantomJS

yeoman install   # Install a package from the client-side package registry
yeoman uninstall # Uninstall the package
yeoman update    # Update a package to the latest version
yeoman list      # List the packages currently installed
yeoman search    # Query the registry for matching package names
yeoman lookup    # Look up info on a particular package

```

A common initial workflow with Yeoman might be:

```shell
yeoman init        # Invoke the most basic application scaffold (Bootstrap, Boilerplate etc.)
yeoman server      # Fire off a file watch/server process which also places an
                   # intermediate build of your project in `temp`
yeoman build       # Build your project, creating an optimized version in a new `dist` directory
yeoman server:dist # Serve up the production-ready version of your application

```

Some more examples of how to use our commands include:

```shell
# Generators for MVC/MV* Frameworks
yeoman init quickstart                   # Skip our questions and get a H5BP, jQuery and Modernizr base
yeoman init bbb                          # Backbone Boilerplate generator scaffold
yeoman init ember                        # Ember-Rails generator scaffold
yeoman init ember-starter                # Create a "Hello World" Yeoman project with the Ember Starter Kit
yeoman init backbone                     # Backbone-Rails generator scaffold
yeoman init angular                      # Invoke the AngularJS generator scaffold
yeoman init angular:controller           # Invoke the AngularJS Controller sub-generator

# Generator for Chrome Apps
yeoman init chromeapp

# Additional server profiles
yeoman server:app                        # Serves up an intermediate build of your application
yeoman server:dist                       # Serves up a production build, if you've built before
yeoman server:test                       # Serves your test suite

# Package management
yeoman search jquery                       # Lookup jQuery in the Bower registry
yeoman install jquery underscore [depName] # Install a dependency or dependencies
yeoman update jquery                       # Update a specific dependency (e.g jquery)
```

![image](http://yeoman.io/media/yeoman-packages.png)

We also have [extended documentation](https://github.com/mklabs/yeoman/wiki/_pages) available for those more interested in the Yeoman internals.


#### Bower

Yeoman uses [Bower](http://twitter.github.com/bower/) as its package manager. The Bower registry is currently being populated, you may find that certain packages work and others do not. We are actively working with the Bower team to resolve this issue and hope to have fully functional packages in place upon launch.


## Browser Support

* Modern browsers (latest version of Chrome, Safari, Firefox, Opera and IE10)
* Chrome on Android
* Mobile Safari


## Platform Support

Yeoman 1.0 will support OS X and Linux. We will be aiming to bring in support for Windows in a [future](https://github.com/yeoman/yeoman/issues/216) version of the project.


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## About

Yeoman is an open-source project by [Google](http://google.com) which builds on top of [Grunt](https://github.com/gruntjs/grunt) and [node-build-script](http://github.com/h5bp/node-build-script). We utilize a number of useful open-source solutions including:

* Twitter Bootstrap
* HTML5 Boilerplate
* Modernizr
* Twitter Bower
* Node.js
* NPM
* Compass
* Socket.IO
* CoffeeScript
* Mocha
* Jasmine
* PhantomJS
* And [more...](https://github.com/yeoman/yeoman/wiki/Tools-Used)

Version 1 of the project features the combined efforts of:

* [Paul Irish](http://paulirish.com)
* [Addy Osmani](http://addyosmani.com)
* [Mickael Daniel](http://blog.mklog.fr)
* [Sindre Sorhus](http://sindresorhus.com)
* [Eric Bidelman](http://ericbidelman.com)

and other developers.


## License

Yeoman is released under a [BSD](http://opensource.org/licenses/bsd-license.php) license.
