## <a href="#generators" name="generators">generators</a>

Generator templates allow you to scaffold out a project using a custom setup of boilerplates, frameworks and dependencies. The basic application generated when calling `yeoman init` actually uses a generator itself and they can be quite powerful. 

Some of the generators Yeoman includes out of the box include implementations for Backbone.js, Ember.js and Angular.js. These allow you to not only use complete boilerplates for an application but also scaffold out smaller parts such as Models, Views, Controllers and so on. 


### Getting Started

yeoman init generator
----------------------

The `yeoman init` command uses templates and prompts to create the files needed for a project.

Running `yeoman init --help` by itself gives a list of available generators:

    $ yeoman init generator
    Usage: yeoman init generator GENERATOR [args] [options]

    ...
    ...

    Please choose a generator below.

    Yeoman:
      controller
      generator
      ...
      ...

**Note**: You can install more generators through npm package and you can even create your own.
Yeoman's own generators are available in a dedicated [repository](https://github.com/yeoman/generators).

Using generators will save you a large amount of time by writing boilerplate code, code that is necessary for the app to work.

Let's make our own controller with the controller generator. But what command should we use?  Let's ask the generator:

**Note**: Generators available may have help text. You can try adding --help or
-h to the end, for example `yeoman generate controller --help`

    .. Invoke controller ..
    Usage:
      yeoman init generator controller NAME one two three [options]

    Options:
      -h, --help          # Print generator's options and usage
          --js-framework  # Js framework to be invoked
                          # Default: ember


The controller generator is expecting parameters in the form of `generate controller ControllerName action1 action2`

Let's make a `Greeting` controller with an action of `hello`.

    $ yeoman init generator controller Greeting hello

What did this generate? It made sure a bunch of directories where in our application, and created a controller file, a view file and / or template file and a test file.

Yeoman comes with a generator for data models too.

    $ yeoman init generator model


Creating and Customizing Yeoman Generators & Templates
------------------------------------------------------

1. First Contact
2. Creating Your First Generator
3. Creating Generators with Generators
4. Generators Lookup
5. Customizing Your Workflow
6. Customizing Your Workflow by Changing Generators Templates
7. Adding Generators Fallbacks
8. Application Templates


### First contact

When you create an application using the `yeoman init` command, you are in fact
using a Yeoman generator. After that, you can get a list of all available
generators by just invoking `yeoman init --help`:

    $ yeoman init
    $ cd app
    $ yeoman init --help

You will get a list of all generators that come with yeoman. If you need a detailed description for a given generator, you can simply do:

    $ yeoman init generator [generator] --help

### Creating Your First Generator

Generators are built on top of Grunt. Grunt provides powerful options parsing and a great API for manipulating files. For instance, let’s build a generator that creates an initializer file named initializer.js inside `app/js/`

The first step is to create a file at `lib/generators/initializer/index.js with
the following content:

    var util = require('util'),
        yeoman = require('../../../');

    module.exports = Generator;

    function Generator() {
      yeoman.generators.Base.apply(this, arguments);
    }

    util.inherits(Generator, yeoman.generators.Base);

    Generator.prototype.createInitializerFile = function() {
      this.write('app/js/initializer.js', "// Add initialization content here\n");
    };

`write` is a method provided by `yeoman.generators.Base`, and is a basic facade to the `grunt.file` API. When we "write" things, this happen relative to the working directory (that is the Gruntfile location, the Gruntfile is resolved internally, walking up the FS until one is found. This is most likely the root
of the yeoman application).

Our new generator is quite simple: it inherits from `yeoman.generators.Base` and has one method definition. Each "public" method in the generator is executed when a generator is invoked (first level method in the prototype chain, eg.  `Base` class method are not called). 

There are two exceptions, generators won't run:

- any method begining with the `_` prefix.
- a `constructor` method, specifically used with generators written in
  CoffeeScript

Finally, we invoke the `write` method that will create a file at the given destination with the given content.

**Note**: Generators should execute their tasks synchronously. We currently lack the API to be able to do things asynchronously (which we might need). A
`this.async()` method should be implemented, which returns a new handler to call on completion.

Now, we can see that the initializer generator available to use if we output
the list of available generators in this application:

    $ yeoman init generator

    Usage: yeoman generate GENERATOR [args] [options]
    ...

    Please choose a generator below.

    ...

    Initializer:
      initializer

To invoke our new generator, we just need to do:

    $ yeoman init initializer

Before we go on, let’s see our brand new generator description:

    $ yeoman generate initializer --help
    .. Invoke initializer ..
    Description:
        Create files for initializer generator.

Yeoman is usually able to generate good descriptions, but not in this particular case. We can solve this problem in two ways. The first one is calling desc inside our generator:

    var util = require('util'),
        yeoman = require('../../../');

    module.exports = Generator;

    function Generator() {
      yeoman.generators.Base.apply(this, arguments);

      this.desc('This generator creates an initializer file at app/js/');
    }

    util.inherits(Generator, yeoman.generators.Base);

    Generator.prototype.createInitializerFile = function() {
      this.write('app/js/initializer.js', "// Add initialization content here");
    };

Now we can see the new description by invoking --help on the new generator. The second way to add a description is by creating a file named `USAGE` in the same directory as our generator. We are going to do that in the next step.

### Creating Generators with Generators

Generators themselves have a generator:

    $ yeoman init generator generator initializer
      create  lib/generators/initializer
      create  lib/generators/initializer/index.js
      create  lib/generators/initializer/USAGE
      create  lib/generators/initializer/templates

This is the generator just created:

    var util = require('util'),
        yeoman = require('../../../');

    module.exports = Generator;

    function Generator() {
      yeoman.generators.NamedBase.apply(this, arguments);

      this.sourceRoot(__dirname, 'templates');
    }

    util.inherits(Generator, yeoman.generatos.NamedBase);

First, notice that we are inheriting from `yeoman.Generators.NamedBase` instead of `yeoman.Generators.Base`. This means that our generator expects at least one argument, which will be the name of the initializer, and will be available in our code in the variable `name`.

We can see that by invoking the description of this new generator:

    $ yeoman init initializer --help

    Usage:
      yeoman init initializer NAME [options]

**Note**: The banner is not automatically generated yet for generators (the Usage: thing above). Same for options and arguments defined by the generator, they should show up during the help output. Right now, the USAGE file is dumped to the console as is.

We can also see that our new generator has an instance method called `sourceRoot`.

This method points to where our generator templates will be placed, if any, and by default it points to the created directory `lib/generators/initializer/templates` (so the `sourceRoot(__dirname, 'templates')` can be removed, this is the default).

In order to understand what a generator template means, let’s create the file
lib/generators/initializer/templates/initializer.js with the following content:

    // Add initialization content here

And now let’s change the generator to copy this template when invoked:

    var util = require('util'),
        yeoman = require('../../../');

    module.exports = Generator;

    function Generator() {
      yeoman.generators.NamedBase.apply(this, arguments);
      // if your templates/ location differ, feel free to set it with sourceRoot()
    }

    util.inherits(Generator, yeoman.generatos.NamedBase);

    Generator.prototype.copyInitializerFile = function() {
      this.copy('initializer.js', 'config/initializers/' + name + '.js');
    };

And let’s execute our generator:

    $ yeoman generate initializer core_extensions

We can see that now an initializer named `core_extensions` was created at
`config/initializers/core_extensions.js` with the contents of our template. That
means that `copy` copied a file in our source root to the destination path
we gave. The property `name` is automatically created when we inherit from
`yeoman.Generators.NamedBase`, and match the value of the given argument
(`NamedBase` automatically specify an argument via `this.argument`)

### Generators Lookup

When you run `yeoman generate initializer core_extensions` yeoman requires these
paths in turn until one is found:

    lib/generators/initializer/index.js
    lib/generators/initializer.js
    lib/generators/yeoman/initializer/index.js
    lib/generators/yeoman/initializer.js

**Note**: `index.js` may be anything else, as long the module entry point is
defined in a package.json.

**Seconc Note**: While true, the help output might miss a generator. It looks
for file below lib/generators at few locations, searching for `index.js` files.

yeoman will do this lookup at few different places, in this order:

- relative to the working directory, from within a yeoman application.
- relative to any `node_modules/yeoman-*` module. These are called "yeoman
  plugins", they should package up their generator in the `lib/generators`
  directory.

This mean that users may override part or the whole set of generator used by
yeoman, either at an application level, with custom handcrafted generator or
via "yeoman plugin" (a node package that defines a set of generators in their
`lib/generators` directory).

If none is found you get an error message.

### Customizing your Workflow

Yeoman own generators are flexible enough to let you customize scaffolding. They
can be configured in your application Gruntfile, these are some defaults:

      generators: {
        'template-engine': 'handlebars',
        'test-framework': {
          name: 'mocha',
          options: {
            ui: 'bdd'
          }
        }
      }

Looking at this output, it’s easy to understand how generators work in yeoman.

Generator relies on hook and other generators, some don't actually generate anything, they just invokes others to do the work.

This allows us to add/replace/remove any of those invocations. For instance, the `controller` generator invokes the `view` and `test-framework` hooks. These hooks tries to resolve their value from cli options first, then look at the Gruntfile for a generator property with the corresponding hook name, and finally defaults to the hook name if none were found.

Since each generator has a single responsibility, they are easy to reuse,
avoiding code duplication.

**TBD** Finish up this section: example of running controller generator, see
the hooks. etc.

### Customizing Your Workflow by Changing Generators Templates

In the step above we simply wanted to add a line to the generated helper, without adding any extra functionality. There is a simpler way to do that, and it’s by replacing the templates of already existing generators, in that case `yeoman.generators.HelperGenerator`.

Generators don’t just look in the source root for templates, they also search for templates in other paths. And one of them is lib/templates. Since we want to customize `yeoman.generators.HelperGenerator`, we can do that by simply making a template copy inside lib/templates/yeoman/helper with the name helper.js.

If you generate another resource, you can see that we get exactly the same result! This is useful if you want to customize your scaffold templates and/or layout by just creating edit.html.erb, index.html.erb and so on inside lib/templates/erb/scaffold.


### More On Generators

So we know that a typical generator looks like the following:

```js
var util = require('util'),
    yeoman = require('../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createSomething = function() {
  // code
};

// ... other methods ...
```

Generators can also be written in CofeeScript, they just needs to be named with a `.coffee` extension (typically `lib/generators/generatorName/index.coffee`)

```coffee
yeoman = require 'yeoman'

module.exports = class Generator extends yeoman.generators.NamedBase

  constructor: (args, options, config) ->
    super args, options, config

  createSomething: ->
    # code

  # ... other method ...
```

They're usually layout like so:

    lib/
    └── generators
        └── generatorName
            ├── USAGE
            ├── index.js
            └── templates

Generators extends either `yeoman.generators.Base` or `yeoman.generators.NamedBase`. `NamedBase` is suitable to use for genetors that expects a "name" argument, such as `yeoman init model [NAME]`.

Every public method in a generator are executed serially. Every first level method in the prototype chain, eg. inherited method in `Base` are not.

Two exceptions:

- any method beginning with `_` is not runned, you may use them as method
  helper. They won't be called automatically on generator invokation.
- a `constructor` method, most likely when using CoffeeScript to implement the generator

Either `Name` or `BasedName` are EventEmitters, you may use the EventEmitter API if you wish to (emit / on / once / ...)

grunt.file
----------

Generators get mixed into their prototype the [grunt.file](https://github.com/cowboy/grunt/blob/master/docs/api_file.md#the-file-api) API. You can use read, readJSON, write, copy, mkdir, expandFiles, etc.

Note that some of them have special additional logic attached, for `copy`, `read` and `write`.

`copy` and `read` make sure to prefix the source filename to be within the generator's source root (usually a `templates/` folder next to the generator implementation).

grunt.log
---------

In addition to the grunt.file API directly available into your generators, you
can use the [grunt.log](https://github.com/cowboy/grunt/blob/master/docs/api_log.md#the-log-api) API as `this.log`


```js
Generator.prototype.doingSomething = function() {
  this.log.writeln("I\m doing something");
  this.log.ok(".. And I think it's ok ..");
};
```

sync vs async
-------------

Methods are expected to run synchronously by default. This is fine for most cases, and will be just what you need for most common operations. Every file system method (copy, write, read, etc.) available are borrowed to grunt's, where most of them are implemented synchronously for conveniency.

If you wish to run your method in an asynchronous way, you should tell the system to do so. Very similarly to how you would handle async stuff in grunt tasks.

If a method is asynchronous, `this.async` must be invoked to tell the system to wait. It returns a handle to a "done" function that should be called when the method has completed. Every non-falsy value (most likely an Error object) can be passed to the done function as a first argument to indicate a failure.

It this method isn't invoked, the method executes synchronously.

Generator methods
-----------------

The following are methods available for generators.

NOTE: Methods provided by Grunt are not covered this guide and can be found in
"Grunt's documentation":https://github.com/cowboy/grunt/blob/master/docs/api_file.md#the-file-api

**TBD**

## Base Generator

A `Base` generator has the following methods, members, and events.

### generator.options

A hash object holding all cli parsed options by nopt.

### generator.argument(name, options)

Adds an argument to the class and creates an instance property for it.

Arguments are different from options in several aspects. The first one is how they are parsed from the command line, arguments are retrieved from position:

    yeoman init NAME

Instead of:

    yeoman init --name NAME

Besides, arguments are used inside your code as a property (this.argument), while options are all kept in a hash (this.options).

Options:

* desc     - Description for the argument.
* required - If the argument is required or not.
* optional - If the argument is optional or not.
* type     - The type of the argument, can be String, Number, Array, Object
           (in which case considered as an Hash object, key:value).
* defaults - Default value for this argument. It cannot be required
            and have default values.
* banner   - String to show on usage notes.

### generator.option(name, options)

Adds an option to the set of generator expected options, only used to
generate generator usage. By default, generators get all the cli option
parsed by nopt as a this.options Hash object.

- name       - The name of the argument
- options    - Hash of configuration values where:
- desc     - Description for the argument.
- type     - Type for this argument, either Boolean, String or Number.
- defaults - Default value for this argument.
- banner   - String to show on usage notes.
- hide     - If you want to hide this option from the help.

### generator.sourceRoot([path])

Stores and return the source root for this class. This is used with `copy()`, `template()`, `read()`, etc. to prefix the relative path.

By default, takes the value of `templates/` next to the generator file.

When no path is given, returns the value of `_sourceRoot`.

### generator.destinationRoot([path])

Sets the destination root for this class, ensure the directory is created and
cd into it.

### generator.hookFor(name, options)

Must be called within the constructor only.

Register a hook to invoke a generator based on the value supplied by the user to the given option named "name". An option is created when this method is invoked and you can set a hash to customize it.

```js
function MyGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  // init a framework specific controller
  this.hookFor('js-framework');
}
```

Hooks work in a way that you can delegate the groundwork of scaffolding to other generators. They're totally inspired by Rails 3 generators [`hook_for` method](http://apidock.com/rails/Rails/Generators/Base/hook_for/class).

The example above will create a js framework option and will invoke a
generator based on the user supplied value.

For example, if the user invokes the controller generator as:

    yeoman init controller Account --js-framework backbone

The controller generator will then try to invoke the following generators:

    "backbone:controller" "backbone"

Notice that the value of a given hook can be defined in your application Gruntfile as well:

```js
// grunt config
generators: {
  'js-framework': 'backbone'
}
// ... more grunt config ...
```

This is what allows any js framework to hook into Yeoman as long as it provides any of the hooks above.

#### Options

The first and last part used to find the generator to be invoked are guessed based on constructor's `hookFor` invokes, as noticed in the example above. This can be customized with the following options:

- `as`      - the context to lookup, defaults to generator's name.
- `args`    - arguments to pass through, defaults generator's arguments.
- `options` - options to pass through, defaults to generator's options.
- `config`  - Grunt config to pass through, defaults to generator's config.

Let’s suppose you are creating a generator that needs to invoke the controller generator from a unit test. Your first attempt is:

```js
// in lib/generators/awesome/index.js generator's constructor.
this.hookFor('test-framework');
```

The lookup in this case for test_unit as input is:

    "test_framework:awesome", "test_framework"

(more specifically, `"jasmine:awesome", jasmine"` which is the default value
for `test-framework` hook)

Which is not the desired lookup. You can change it by providing the `as` option:

```js
// in lib/generators/awesome/index.js generator's constructor.
this.hookFor('test-framework', { as: 'controller' });
```
And now it will lookup at:

    "test_framework:controller", "test_framework"

### generator.copy(source, destination, options)

> Copy a source file to a destination path, creating intermediate directories if necessary.

Grunt's[`grunt.file.copy`](https://github.com/cowboy/grunt/blob/master/docs/api_file.md#grunt-file-copy) is used, we simply make sure that relative path are prefixed by the generator's `sourceRoot` value.

```js
// similar to
var source = path.join(this.sourceRoot(), 'path/to/file.js');
grunt.file.copy(source, destination, options);
```

### generator.read(filepath, [encoding])

Same as copy, `.read()` relative `filepath` are prefixed by `self.sourceRoot()`
value.

### generator.write(filepath, [encoding])

> Write the specified contents to a file, creating intermediate directories if necessary.

Just like
[`grunt.file.write`](https://github.com/cowboy/grunt/blob/master/docs/api_file.md#grunt-file-write),
we simply ensure the log output of the files being written.

```js
// similar to
grunt.option('verbose', true);
grunt.file.write(filepath, encoding);
grunt.option('verbose', false);
```

### generator.template(source, [destination], [data])

Gets an underscore template at the relative source, executes it and makes a copy at the relative destination. If the destination is not given it's assumed to be equal to the source relative to destination.

```js
this.template('Gruntfile.js');
```

will copy and process the `templates/Gruntfile.js` file through `grunt.template.process`, and write the results to `./Gruntfile.js` relative the the application root.

Another example is using a `templates/model.js` template to write at the `app/js/models/{name}-model.js` location in a `NamedBase` generator.

```js
this.template('model.js', path.join('app/js/models', this.name + '-model.js'));
```
### generator.directory(source, [destination])

Copies recursively the files from source directory to destination root directory. If the destination is not given it's assumed to be equal to the source relative to destination.

Each file is copied and processed through `grunt.template.process`.

```js
this.directory('.', 'test');
```

The example above copies and process any files within generators `templates/`
directory, and write them at the `test/` location.

### generator.tarball(url, destination, cb)

Fetch a remote tarball, and untar at the given destination.

```js
this.tarball('https://github.com/twitter/bootstrap/tarball/master', 'vendor/bootstrap', this.async());
```

### generator.fetch(url, destination, cb)

Download a single file at the given destination.

```js
this.fetch('http://zeptojs.com/zepto.js', 'js/vendor/zepto.js', this.async());
```

### generator.remote(username, repository, [branch], cb)

Remotely fetch a package on github, store this into an internal `_cache/`
folder, and invokes provided callback on completion with a "remote" object as
the main API to interract with downloaded package.

- username      - GitHub username
- repository    - GitHub repository to fetch from
- branch        - Optional branch or sha1, defaults to master
- cb            - function to invoke on completion

The example below downloads and cache the html5-boilerplate project, and use the `remote` object
to copy the whole project into the `app/` folder.

```js
var cb = this.async();
this.remote('h5bp', 'html5-boilerplate', 'master', function(err, remote) {
  if(err) return cb(err);
  // remote.copy('index.html', 'index.html');
  // remote.template('index.html', 'will/be/templated/at/index.html');
  remote.directory('.', 'app');
  cb();
});
```

`remote()` allows the download of full repositories and copying of single or
multiple files. `remote` object is your API to access this fetched (anc cached)
package and copy / process files.

#### remote.copy(source, destination, options)

Same as `generator.copy()` but relative `source` is prefixed with the cache
directory.

#### remote.template(source, destination, options)

Same as `generator.temlate()` but relative `source` is prefixed with the cache
directory.

#### remote.template(source, destination, options)

Same as `generator.directory()` but relative `source` is prefixed with the cache directory.


#### Prompt user before overwriting files with `--force`

Generators also support a `warnOn` method, which allows developers to warn on global paths that are matching those paths or files which the generator is going to generate (e.g `self.warnOn('*')`. 

Where used, Yeoman will warn the user they if they proceed that a file will be overwritten and they may need to call the generator with the `--force` flag to proceed.

`warnOn` is most likely to be used in constructors.
