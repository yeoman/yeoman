# Welcome, Friend!

## What am I?

Yeoman is a robust and opinionated client-side stack, comprised of tools and frameworks that can help developers quickly build beautiful web applications. We take care of providing everything needed to get started without any of the normal headaches associated with a manual setup.

![image](http://yeoman.io/media/yeoman-masthead.png)

Yeoman is fast, performant and is optimized to work best in modern browsers.

For more information about the project, see [yeoman.io](http://yeoman.io).


## Installation

Simply run:

```shell
curl -L get.yeoman.io | bash
```

## Documentation

For more information on Yeoman, please read our [complete documentation](https://github.com/yeoman/yeoman/tree/master/docs/cli).

Yeoman supports a powerful set of high-level commands. These include:

```shell
yeoman init      # Initialize and scaffold a new project using generator templates
yeoman build     # Build an optimized version of your app, ready to deploy
yeoman server    # Launch a preview server which will begin watching for changes
yeoman test      # Run a Mocha test harness in a headless Phantom.js

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
yeoman init chromeapps

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


#### Issue submission

In order for us to help you please check that you've completed the following steps:

* Made sure you're on the latest version
* Read our documentation and README to ensure the issue hasn't been noted or solved already
* Used the search feature to ensure that the bug hasn't been reported before
* Included as much information about the bug as possible, including any output you've received, what OS and version you're on.
* Shared the output from `echo $PATH $NODE_PATH` and `brew doctor` as this can also help track down the issue.

Then open a [new issue](https://github.com/yeoman/yeoman/issues/new) and one of the team will be happy to follow up with you.


#### Bower

Yeoman uses [Bower](http://twitter.github.com/bower/) as its package manager. The Bower registry is currently being populated, you may find that certain packages work and others do not. We are actively working with the Bower team to resolve this issue and hope to have fully functional packages in place upon launch.


## Browser Support

* Modern browsers (latest version of Chrome, Safari, Firefox, Opera and IE10)
* Chrome on Android
* Mobile Safari

![image](http://yeoman.io/media/yeoman-browsers.png)

## Platform Support

Yeoman 1.0 will support OS X and Linux. We will be aiming to bring in support for Windows in a [future](https://github.com/yeoman/yeoman/issues/216) version of the project.

## Contribute

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :) At this time we are primarily focusing on improving the user-experience and stability of Yeoman for our first release. Please keep this in mind if submitting feature requests, which we're happy to consider for future versions.

### Repos

Yeoman has three primary repos:

* [main project](http://github.com/yeoman/yeoman)
* [generators](http://github.com/yeoman/generators)
* [yeoman.io](http://github.com/yeoman/yeoman.io)

### Quick Start

* Clone this repo and `cd` into it
* Run this command: `./setup/install.sh`
* `cd` into the `/cli` directory and run `sudo npm link` after the install is complete.
* Navigate to a new directory and run `yeoman init` to make sure everything is working as expected.

You can keep Yeoman up to date by using `git pull --rebase upstream master && cd cli && npm link`, where `upstream` is a remote pointing to this repo.

### Style Guide

This project follows the [jQuery Style Guide](http://docs.jquery.com/JQuery_Core_Style_Guidelines) with an exception of two space indentation and multiple var statements. Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.

### Pull Request Guidelines

* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.
* Lint the code by running `grunt` in the `/cli` folder before submitting a pull request
* Develop in a topic branch, not master

### Tests

Yeoman has a test suite to ensure it's reliably and accurately working as a developer tool. You can find the main test suite in [`test/test-build.js`](https://github.com/yeoman/yeoman/blob/master/cli/test/test-build.js), most of the assertions are [checks against yeoman cli stdout](https://github.com/mklabs/yeoman/wiki/test-build).

To run our test suite:

```sh
npm test
```

Do note that if any CLI prompts are not accounted for the test suite will have a timeout failure.

### Developer Docs

We have significant developer docs for you if you'd like to hack on Yeoman.

Currently you can find much of the details on [mklabs' yeoman wiki](https://github.com/mklabs/yeoman/wiki/_pages) but also [our primary project](https://github.com/yeoman/yeoman/tree/master/docs/cli).

You're also welcome to `git blame` back to commit messages and pull requests. As a project we value comprehensive discussion for our fellow developers.

## About

Yeoman is an open-source project by [Google](http://google.com) which builds on top of [Grunt](https://github.com/cowboy/grunt) and [node-build-script](http://github.com/h5bp/node-build-script). We utilize a number of useful open-source solutions including:

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

