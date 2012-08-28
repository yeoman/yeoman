

## init

Usage: `yeoman init`, `yeoman init generatorName`, `yeoman init generatorName:subgenerator`

Helps you kick-start a new web application by asking a number of questions about what you would like to include.
These answers are used to scaffold out a file structure for your project.

The init template is based on:

* HTML5 Boilerplate for the main base
* Compass Twitter Bootstrap for the SASS files as the CSS files are authored in SASS
* Twitter Bootstrap for the optional list of JavaScript plugins (optional)
* RequireJS for AMD module and script loading support (optional)
* RequrieHM for experimental EcmaScript 6 module syntax support on top of RequireJS (optional)

By default we support Compass and CoffeeScript, so if your project includes any .coffee files, these will be
compiled when either `server` or `build` tasks are being run.

If everything has been installed successfully, running `yeoman init` will present you with a welcome
screen to kick off your project that looks a little like this:

```shell

        _   .--------------------------.
      _|o|_ |    Welcome to Yeoman,    |
       |_|  |   ladies and gentlemen!  |
     / \Y/ \ o_________________________|
    ||  :  |//
    o/ --- \
      _\ /_


.. Invoke app ..

Please answer the following:
[?] Would you like to include Twitter Bootstrap for Compass? (Y/n)
```

### custom generators

Some of our supported custom generators include:

```shell
yeoman init bbb      #backbone boilerplate
yeoman init angular  #angularjs seed
yeoman init ember    #ember app based on ember-rails
```

Yeoman comes with a powerful system of Generators for scaffolding out applications using any number
of boilerplates, frameworks and dependencies. Generators can be called in a project which has already
been initialized with a basic Yeoman application structure OR may contain all of the files needed for the
application structure themselves. By default, one can call a generator as follows:

```shell
yeoman init generatorName:subgenerator #e.g init angular:all
```

In the case of a Generator named "angular", a grouping sub-generator called `all` may exist for scaffolding
out all of the files needed for a new AngularJS application. One would use this as follows:

```shell
yeoman init angular:all
```

The idea here is that the Generator would pull in AngularJS, its common dependencies and write out the
boilerplate needed for a basic Controller and any other components the framework may require.

As we understand that it's unlikely a user will wish to manually type out the ":all" part of each generator, we support a catch-"all". If a generator has a sub-generator (grouper) called "all" we will attempt to call "all" when you try running the top-level generator. This allows a user to simply call:

```shell
yeoman init angular
```
and has it defer to `angular:all` automatically.

If one then wishes to create further AngularJS controllers, one can simply call the 'controller' sub-generator as
follows:

```shell
yeoman init angularjs:controller controllerName
```

where `controllerName` is the name of the Controller you wish to create.

Similarly, a Backbone.js Generator may be used as follows:

```shell
yeoman init backbone
```

where the above would result in boilerplate for models, views, collections and a router being written to
the current application directory, as well as Backbone.js and its dependencies being pulled in. One could
then call the different sub-generators for the Generator as follows:

```shell
yeoman init backbone:model modelName
yeoman init backbone:collection collectionName
yeoman init backbone:view viewName
yeoman init backbone:router routerName
```

To list out all of the generators currently available locally, you can use the `--help` flag as follows:

```shell
yeoman init --help
```

This will print out a list of existing generators as follows:

```shell
Please choose a generator below.

Yeoman:
  generator
  controller

Ember:
  ember:all
  ember:controller
  ember:model
  ember:view

Backbone:
  backbone:all
  backbone:model
  backbone:router
  backbone:view
  backbone:collection
```