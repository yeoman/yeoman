# Welcome, Friend! [![Build Status](https://secure.travis-ci.org/yeoman/yeoman.png?branch=master)](http://travis-ci.org/yeoman/yeoman)

Yeoman is a robust and opinionated client-side stack, comprising tools and frameworks that can help developers quickly build beautiful web applications. We take care of providing everything needed to get started without any of the normal headaches associated with a manual setup. Builds upon great tools like [grunt](http://gruntjs.com) the task runner, [bower](http://twitter.github.com/bower/) the package manager for the web, and our own homebrewed [generator system](https://github.com/yeoman/generators).

## [Website](http://yeoman.io)&nbsp;&nbsp;&nbsp;[Documentation](https://github.com/yeoman/yeoman/wiki)&nbsp;&nbsp;&nbsp;[Submit issue](https://github.com/yeoman/yeoman#issue-submission)

![image](http://yeoman.io/media/yeoman-masthead.png)


## Installation

    npm install -g yeoman

*Node.js 0.8.x required*


Try the audit script to see what you need in place:

    curl -L get.yeoman.io | bash

You can follow its guidance or simply walk through the [installation procedure](https://github.com/yeoman/yeoman/wiki/Manual-Install).


## Issue submission

Make sure you've read the [issue submission guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission) before you open a [new issue](https://github.com/yeoman/yeoman/issues/new).


## Overview

Yeoman supports a powerful set of high-level commands:

```
     init  # Initialize and scaffold a new project using generator templates
    build  # Build an optimized version of your app, ready to deploy
   server  # Launch a preview server which will begin watching for changes
     test  # Run a Mocha test harness in a headless PhantomJS

  install  # Install a package from the clientside package registry
uninstall  # Uninstall the package
   update  # Update a package to the latest version
     list  # List the packages currently installed
   search  # Query the registry for matching package names
   lookup  # Look up info on a particular package
```

### Example usage

A common initial workflow with Yeoman might be:

```shell
yeoman init         # Invoke the most basic application scaffold (Bootstrap, Boilerplate etc.)
yeoman server       # Fire off a file watch/server process which also places an
                    # intermediate build of your project in `temp`
yeoman build        # Build your project, creating an optimized version in a new `dist` directory
yeoman server:dist  # Serve up the production-ready version of your application
yeoman test         # Test your app
```

Some more examples of how to use our commands:

```shell
# Generators
yeoman init ember                           # Create a "Hello World" Yeoman project with the Ember Starter Kit
yeoman init backbone                        # Backbone-Rails generator scaffold
yeoman init angular                         # Invoke the AngularJS generator scaffold
yeoman init angular:controller name         # Invoke the AngularJS Controller sub-generator

# Package management
yeoman search jquery                        # Lookup jQuery in the Bower registry
yeoman install jquery underscore [depName]  # Install a dependency or dependencies
yeoman update jquery                        # Update a specific dependency (e.g jquery)
```

#### Bower

Yeoman uses [Bower](http://twitter.github.com/bower) as its package manager. The Bower registry is currently being populated, you may find that certain packages work and others do not. We are actively working with the Bower team to resolve this issue.


![image](http://yeoman.io/media/yeoman-packages.png)


## Platform Support

Yeoman supports OS X, Linux, FreeBSD, with partial Windows support. We will be aiming to bring in full support for Windows in a [future](https://github.com/yeoman/yeoman/wiki/Manual-Install) version.


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## Links

- [Website](http://yeoman.io)
- [Documentation](https://github.com/yeoman/yeoman/wiki)
- [Mailinglist](https://groups.google.com/forum/#!forum/yeoman-dev)
- [\#yeoman](http://webchat.freenode.net) on Freenode
- [Google+](https://plus.google.com/101063139999404044459/posts) *(follow for updates)*
- [Twitter](https://twitter.com/yeoman)
- [Media assets](https://github.com/yeoman/yeoman.io/tree/gh-pages/media)
- [Available components](http://sindresorhus.com/bower-components/)


## Team

Yeoman was beautifully crafted by these people and bunch of awesome [contributors](https://github.com/yeoman/yeoman/graphs/contributors)

[![Paul Irish](http://www.gravatar.com/avatar/ffe68d6f71b225f7661d33f2a8908281.png?s=40)Paul Irish](http://paulirish.com)&nbsp;
[![Addy Osmani](http://www.gravatar.com/avatar/96270e4c3e5e9806cf7245475c00b275.png?s=40)Addy Osmani](http://addyosmani.com)&nbsp;
[![Mickael Daniel](http://www.gravatar.com/avatar/a23615915f0baf096b94cc9df93fc327.png?s=40)Mickael Daniel](http://blog.mklog.fr)&nbsp;
[![Sindre Sorhus](http://www.gravatar.com/avatar/d36a92237c75c5337c17b60d90686bf9.png?s=40)Sindre Sorhus](http://sindresorhus.com)&nbsp;
[![Eric Bidelman](http://www.gravatar.com/avatar/e7948aac7c52b26470be80311873a398.png?s=40)Eric Bidelman](http://ericbidelman.com)
[![Frederick Ros](http://www.gravatar.com/avatar/4605de69c4c3af3f48b8e829206cd4c2.png?s=40)Frederick Ros](https://github.com/sleeper)


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)  
Copyright (c) Google
