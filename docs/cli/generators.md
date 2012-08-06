## Generators

Generators allow you to scaffold out a project using a custom setup of boilerplates,
frameworks and dependencies. These are wrapped up in a generator (or scaffold). The basic 
application generated when calling `yeoman init` actually uses a generator itself and they
can be quite powerful. 

A typical generator looks like the following:

```js
var util = require('util'),
  yeoman = require('yeoman');

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

Generators can also be written in CofeeScript, they just needs to be named with
a `.coffee` extension (typically `lib/generators/generatorName/index.coffee`)

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

Generators extends either `yeoman.generators.Base` or
`yeoman.generators.NamedBase`. `NamedBase` is suitable to use for genetors that
expects a "name" argument, such as `yeoman init model [NAME]`.

Every public method in a generator are executed serially. Every first level
method in the prototype chain, eg. inherited method in `Base` are not.

Two exceptions:

- any method beginning with `_` is not runned, you may use them as method
  helper. They won't be called automatically on generator invokation.
- a `constructor` method, most likely when using CoffeeScript to implement the generator

Either `Name` or `BasedName` are EventEmitters, you may use the EventEmitter
API if you wish to (emit / on / once / ...)

grunt.file
----------

Generators get mixed into their prototype the
[grunt.file](https://github.com/cowboy/grunt/blob/master/docs/api_file.md#the-file-api)
API. You can use read, readJSON, write, copy, mkdir, expandFiles, etc.

Note that some of them have special additional logic attached, for `copy`,
`read` and `write`.

`copy` and `read` make sure to prefix the source filename to be within the
generator's source root (usually a `templates/` folder next to the generator
implementation).

grunt.log
---------

In addition to the grunt.file API directly available into your generators, you
can use the
[grunt.log](https://github.com/cowboy/grunt/blob/master/docs/api_log.md#the-log-api) API as `this.log`


```js
Generator.prototype.doingSomething = function() {
  this.log.writeln("I\m doing something");
  this.log.ok(".. And I think it's ok ..");
};
```

sync vs async
-------------

Methods are expected to run synchronously by default. This is fine for most
cases, and will be just what you need for most common operations. Every file
system method (copy, write, read, etc.) available are borrowed to grunt's,
where most of them are implemented synchronously for conveniency.

If you wish to run your method in an asynchronous way, you should tell the
system to do so. Very similarly to how you would handle async stuff in grunt
tasks.

If a method is asynchronous, `this.async` must be invoked to tell the system to
wait. It returns a handle to a "done" function that should be called when the
method has completed. Every non-falsy value (most likely an Error object) can
be passed to the done function as a first argument to indicate a failure.

It this method isn't invoked, the method executes synchronously.

Generator methods
-----------------

The following are methods available for generators.

NOTE: Methods provided by Grunt are not covered this guide and can be found in
"Grunt's
documentation":https://github.com/cowboy/grunt/blob/master/docs/api_file.md#the-file-api

**TBD**

## Base Generator

A `Base` generator has the following methods, members, and events.

### generator.options

A hash object holding all cli parsed options by nopt.

### generator.argument(name, options)

Adds an argument to the class and creates an instance property for it.

Arguments are different from options in several aspects. The first one
is how they are parsed from the command line, arguments are retrieved
from position:

    yeoman init NAME

Instead of:

    yeoman init --name NAME

Besides, arguments are used inside your code as a property (this.argument),
while options are all kept in a hash (this.options).

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

Stores and return the source root for this class. This is used with `copy()`,
`template()`, `read()`, etc. to prefix the relative path.

By default, takes the value of `templates/` next to the generator file.

When no path is given, returns the value of `_sourceRoot`.

### generator.destinationRoot([path])

Sets the destination root for this class, ensure the directory is created and
cd into it.

### generator.hookFor(name, options)

Must be called within the constructor only.

Register a hook to invoke a generator based on the value supplied by the user
to the given option named "name". An option is created when this method is
invoked and you can set a hash to customize it.

```js
function MyGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  // init a framework specific controller
  this.hookFor('js-framework');
}
```

Hooks work in a way that you can delegate the groundwork of scaffolding to
other generators. They're totally inspired by Rails 3 generators [`hook_for`
method](http://apidock.com/rails/Rails/Generators/Base/hook_for/class).

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

This is what allows any js framework to hook into Yeoman as long as it provides
any of the hooks above.

#### Options

The first and last part used to find the generator to be invoked are guessed
based on constructor's `hookFor` invokes, as noticed in the example above. This
can be customized with the following options:

- `as`      - the context to lookup, defaults to generator's name.
- `args`    - arguments to pass through, defaults generator's arguments.
- `options` - options to pass through, defaults to generator's options.
- `config`  - Grunt config to pass through, defaults to generator's config.

Let’s suppose you are creating a generator that needs to invoke the controller
generator from a unit test. Your first attempt is:

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

Grunt's
[`grunt.file.copy`](https://github.com/cowboy/grunt/blob/master/docs/api_file.md#grunt-file-copy)
is used, we simply make sure that relative path are prefixed by the generator's
sourceRoot value.

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

Gets an underscore template at the relative source, executes it and makes a
copy at the relative destination. If the destination is not given it's assumed
to be equal to the source relative to destination.

```js
this.template('Gruntfile.js');
```

will copy and process the `templates/Gruntfile.js` file through
`grunt.template.process`, and write the results to `./Gruntfile.js` relative
the the application root.

Another example is using a `templates/model.js` template to write at the
`app/js/models/{name}-model.js` location in a `NamedBase` generator.

```js
this.template('model.js', path.join('app/js/models', this.name + '-model.js'));
```
### generator.directory(source, [destination])

Copies recursively the files from source directory to destination root
directory. If the destination is not given it's assumed
to be equal to the source relative to destination.

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

Same as `generator.directory()` but relative `source` is prefixed with the cache
directory.


## Internal API

**Note**: *Below is not required reading, and are internal methods that may be
moved elsewhere or slightly adjust.*

### generator.run([args], [cb])

*This is called internally by the generator system, and you normally don't need
to use it directly. You may want to use it if you're manually dealing with
generator instantiation and would like to trigger the generator.*

Runs all methods in this given generator. You can also supply the arguments for
the methods to be invoked. If none is given, the same values used to initialize
the invoker are used to initialize the invoked.

`config` is an array of position arguments to run each method with. `cb` is the
function to invoke on completion.

Both are optional.

### generator.runHooks(cb)

Go through all registered hooks with `hookFor`, and invoke them in series.

### generator.defaultFor(name)

Return the default value for the `name` given, doing a lookup in cli options
and Gruntfile's `generator` config.

```js
var resolved = this.hookFor('js-framework');
// >> jasmine
```

### generator.bannerFor(options)

Returns the default banner for help output, depending on argument type.

Options is an hash object with the following properties:

- `name`    - name of the argument to show during output
- `type`    - either String, Number, Object or Array.

```js
var banner = this.bannerFor({
  name: 'argumentName',
  type: String
});
console.log(banner);
```

The corresponding output for each type is as follows:

- `String`  - name value uppercased.
- `Number`  - N
- `Object`  - key:value
- `Array`   - one two three

### generator.desc(description)

Defines the usage and the description of this class, it will be used to
generate the help output, right before the options listing.

### generator.help()

Tries to get the description from a `USAGE` file one folder above the source root
otherwise uses a default description.

### generator.usage()

Returns usage information for this given class, depending on its arguments /
options / hooks / description property and `USAGE` file.

### generator.optionsHelp()

Returns the list of options in formatted table.
