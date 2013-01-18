Yeoman Express Stack
====================
A proof of concept end-to-end stack for development using [Yeoman](http://yeoman.io) 0.9.6, [Express](http://expressjs.com/) and [AngularJS](http://angularjs.org). Note: This experimental branch is providing for testing purposes only (at present) and does not provide any guarantees.

* Custom version of Yeoman's server.js with support for Express middleware
* LiveReload supported out of the box
* Generator for Express and CRUD generator for AngularJS
* Proof-of-concept application using AngularJS

This stack assumes that you wish to develop both the server and client portions of your application within the same directory. By the end of setup, you will be able to see how to do this using the demo application which has a `server` directory for Express code and an `app` directory for your client-side code.

### Components

* `yeoman-custom` - A custom build of Yeoman 0.9.6 with support for Express middleware
* `generators` - Express and AngularJS Crud generators for scaffolding
* `demo` - A sample application

### Installation (assume you have already installed Yeoman@0.9.6)

Clone this repository:

```
git clone git://github.com/yeoman/yeoman.git
cd yeoman
git checkout express-stack
```

Install Yeoman@0.9.6 and Grunt

```
npm install -g yeoman
npm install -g grunt
```

and then from the `express-stack` root:

1. `npm install`
2. `grunt install`
3. follow output of step 2 and update your [system path](http://hathaway.cc/2008/06/how-to-edit-your-path-environment-variables-on-mac-os-x/)
4. Now your system has a new command `yeomen` (notice the `e`, instead of `a` in yeoman? - `e` is for `express`), which will run this custom copy of yeoman bundled with the custom generators listed below.

### Getting started from scratch

After you've gone through the installation process, you have two options - you can
either start a brand new application using the below commands or skip to the demo
where some included sample code is available for you to try out.

```
yeomen init angularcrud            # Standard Angular app
yeomen init angularcrud:crud post  # Angular CRUD routes/views
yeomen init express post           # Express CRUD
yeomen server

# you can then navigate to #/api/post/index to verify
# that the routing is working with Express correctly
```

Note: should you receive any warnings about Express not being present, 
`npm install express` should resolve this.

### Demo

You should now be able to navigate to `demo` and run `yeomen server` to run it. Note, if you have multiple versions of yeoman installed locally, you may wish to directly use the binary in `yeoman-custom`, otherwise everything should work.

For the generators, the following are supported:

```
Angularcrud:
  angularcrud:all
  angularcrud:app
  angularcrud:common
  angularcrud:controller
  angularcrud:crud
  angularcrud:crud-controller
  angularcrud:crud-route
  angularcrud:crud-view
  angularcrud:directive
  angularcrud:filter
  angularcrud:route
  angularcrud:service
  angularcrud:view

Express:
  express:all
  express:crud
```

For more information about individual sub-generators, please see the USAGE guidelines.

### Bug reporting

As Express Stack is an experimental project, please avoid posting any issues for it on the [main](https://github.com/yeoman/yeoman/issues) Yeoman issue tracker. Instead, issues can be posted [here](https://github.com/yeoman/express-stack/issues). We do however accept pull requests against this branch, which do need to go through the main repository.

### Credits

@addyosmani, @blai, @jacobmumm, @mklabs