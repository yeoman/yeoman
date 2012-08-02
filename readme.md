# Welcome, Friend!

## What am I?

Yeoman is a robust and opinionated client-side stack, comprised of tools and frameworks that can help developers quickly build beautiful web applications. We take care of providing everything needed to get started without any of the normal headaches associated with a manual setup.

Yeoman is fast, performant and is optimized to work best in modern browsers.

For more information about the project, see [yeoman.io](http://yeoman.io).


## Installing

* Clone this repo and `cd` into it
* Run this command: `./setup/install.sh`
* Navigate to a new directory and run `yeoman init` to make sure everything is working as expected.


## Documentation

Yeoman supports a powerful set of high-level commands. These include:

```
yeoman init      # Initialize and scaffold a new project using generator templates
yeoman build     # Build an optimized version of your app, ready to deploy
yeoman server    # Launch a preview server which will begin watching for changes
yeoman test      # Run a Jasmine test harness in a headless Phantom.js

yeoman install   # Install a package from the clientside package registry
yeoman uninstall # Uninstall the package
yeoman update    # Update a package to the latest version
yeoman list      # List the packages currently installed
yeoman search    # Query the registry for matching package names
yeoman lookup    # Look up info on a particular package 

```

A common initial workflow with Yeoman might be:

```
yeoman init      # invoke the most basic application scaffold (Bootstrap, Boilerplate etc.)
yeoman build     # build your project, creating an optimized version in the publish folder
yeoman server    # create an intermediate version of your app, firing off a watch process.

```

Some more examples of how to use our commands include:

```
yeoman init angular:bootstrap  # invoke the AngularJS generator scaffold
yeoman init angular:controller # invoke the AngularJS Controller sub-generator
yeoman install jquery underscore [depName] # install a dependency or dependencies
yeoman update jquery # update a specific dependency (e.g jquery)
yeoman search jquery # lookup jquery in the bower registry

```


The current complete documentation for Yeoman can be found [here](http://yeoman.github.com/docs/docs.html). We also have extended documentation available [here](https://github.com/mklabs/yeoman/wiki/_pages).



### Trouble-shooting

If for any reason you experience exceptions after the yeoman installation process above, you may find the
following steps resolve these issues:

```
$ cd yeoman/cli
$ sudo -s 'npm install -g && npm link'
```

## Running

Here's a small shell script that you can save as `server.sh` which opens and serves the current directory:

```sh
#!/usr/bin/env sh

port=$1
if [ $# -ne 1 ]; then
  port=8000
fi

if [ $(uname -s) == "Darwin" ]; then
  open=open
else
  open=xdg-open
fi

$open http://localhost:$port && python -m SimpleHTTPServer $port;
```

You then need to make it executable: `$ chmod +x server.sh`

For example, run this guy as `$ server` (defaults to port 8000), or supply a port yourself `$ server 3000`.



## Browser Support

* Modern browsers (latest version of Chrome, Safari, Firefox, Opera and IE10)
* Chrome on Android
* Mobile Safari


## Platform Support

Yeoman 1.0 will support Mac OS X and will attempt to support Linux as well. We will be aiming to bring in support for Windows in a future version of the project.

## Contribute

### Repos

* [Yeoman (CLI, Insights)](http://github.com/yeoman/yeoman)
* [Yeoman I/O Holding Page](http://github.com/yeoman/yeoman.io)
* [Yeoman I/O Site](http://github.com/yeoman/yeoman.io) (site branch)
* [Yeoman Docs](http://github.com/yeoman/docs)

### Style Guide

This project follows the [jQuery Style Guide](http://docs.jquery.com/JQuery_Core_Style_Guidelines) with an exception of two space indentation and multiple var statements. Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.

### Pull Request Guidelines

- Lint the code by running `grunt` in the `/cli` folder before submitting a pull request
- Develop in a topic branch, not master

### Tests

Yeoman has a test suite to ensure it's reliably and accurately working as a developer tool. You can find the main test suite in [`test/test-build.js`](https://github.com/yeoman/yeoman/blob/master/cli/test/test-build.js), most of the assertions are [checks against yeoman cli stdout](https://github.com/mklabs/yeoman/wiki/test-build).

### Developer Docs

We have significant developer docs for you if you'd like to hack on Yeoman. 

Currently you can find much of the details on [mklabs' yeoman wiki](https://github.com/mklabs/yeoman/wiki/_pages) but also [our first site's docs section](http://yeoman.github.com/docs/docs.html). 

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
* And [more...](https://github.com/yeoman/yeoman/wiki/Dependencies)

Version 1 of the project features the combined efforts of:

* [Paul Irish](http://paulirish.com)
* [Addy Osmani](http://addyosmani.com)
* [Mickael Daniel](http://blog.mklog.fr)
* [Sindre Sorhus](http://sindresorhus.com)
* [Eric Bidelman](http://ericbidelman.com)

and other developers.

We will be aiming to officially release the project in late July, 2012.
