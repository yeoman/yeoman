
## init

Usage: `yeoman init`, `yeoman init generatorName`, `yeoman init generatorName:subgenerator`

Helps you kick-start a new web application by asking a number of questions about what you would like to include. 
These answers are used to scaffold out a file structure for your project.

The default init template is based on:

* HTML5 Boilerplate for the main base
* Compass Twitter Bootstrap for the SASS files as the CSS files are authored in SASS
* Twitter Bootstrap for the optional list of JavaScript plugins (optional)
* RequireJS for AMD module and script loading support (optional)
* RequrieHM for experimental EcmaScript 6 module syntax support on top of RequireJS (optional)

By default we support Compass and CoffeeScript, so if your project includes any .coffee files, these will be 
compiled when either `server` or `build` tasks are being run.

### custom generators

Yeoman comes with a powerful system of Generators for scaffolding out applications using any number
of boilerplates, frameworks and dependencies. Generators should be called in a project which has already
been initialized with a basic Yeoman application structure. One can then call a generator as follows:

```shell
yeoman init generatorName:subgenerator
```

In the case of a Generator named "angularjs", a sub-generator called `bootstrap` may exist for scaffolding
out all of the files needed for a new AngularJS application. One would use this as follows:

```shell
yeoman init angularjs:bootstrap
```

The idea here is that the Generator would pull in AngularJS, its common dependencies and write out the
boilerplate needed for a basic Controller and any other components the framework may require. If one 
wishes to create further AngularJS controllers, one can simply call the 'controller' sub-generator as 
follows:

```shell
yeoman init angularjs:controller controllerName
```

where `controllerName` is the name of the Controller you wish to create.

Similarly, a Backbone.js Generator may be used as follows:

```shell
yeoman init backbone:all
```

where the above would result in boilerplate for models, views, collections and a router being written to
the current application directory, as well as Backbone.js and its dependencies being pulled in. One could
then call the different sub-generators for the Generator as follows:

```
yeoman init backbone:model modelName
yeoman init backbone:collection collectionName
yeoman init backbone:view viewName
yeoman init backbone:router routerName
```

Note: At present, there is a bug with the Generators system whereby a Generator/Scaffold may throw an 
error saying that files will be over-written if a Generator is called. To workaround this issue one should
pass the `--force`` flag to the Generator as follows:

```shell
yeoman init angularjs:bootstrap --force
```

