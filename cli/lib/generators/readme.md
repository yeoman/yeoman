
Rails-like generators. Grunt based.

Two new commands were added: `new` and `generate`

`new` is actually the same command internally than `generate app`.


---

Note: This documentation is not up-to-date with the actual code, but still give
a good overview of the rails generator system we take a lot of inspiration from
(http://guides.rubyonrails.org/generators.html) and the overall generator layer
in place.

Generator - Rails 3 like
------------------------

Rails 3 generators provide a really neat and a really powerfull way to
customize them to really fit your preferences.

You can access generators with the `generate` command (or simply `g`).

If you run this without any arguments, you'll get a list of available
generators inside of your yeoman application.

If you run a given generator with the `--help` option, you'll get some help
information including the list of options at the top:

    yeoman g controller --help

    Description:
        Stubs out a new controller and its views. Pass the controller name, either
        CamelCased or under_scored, and a list of views as arguments.

        To create a controller within a module, specify the controller name as a
        path like 'parent_module/controller_name'.

        This generates a controller class in app/controllers and invokes helper,
        template engine and test framework generators.

    Example:
        `yeoman generate controller people edit index list debit credit close`

        Credit card controller with URLs like /credit_card/debit.
            Controller:      app/js/controllers/people_controller.js
            Test:            spec/controllers/people_controller_spec.js
            Views:           app/views/people/edit_view.js [...]
            Templates:       app/templates/people/edit.handlebars [...]


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

When you create an application using the `yeoman` command, you are in fact using a
Yeoman generator. After that, you can get a list of all available generators by
just invoking `yeoman generate`:

    $ yeoman new myapp
    $ cd myapp
    $ yeoman generate

**Note:** Right now, there's nothing stoping users from using the `generate`
command from outside a yeoman application. rails prevent that, we should too.
`new` should be use prior to that, and the user must be within the yeoman app.

You will get a list of all generators that comes with yeoman. If you need a
detailed description of the helper generator, for example, you can simply do:

    $ yeoman generate helper --help

### Creating Your First Generator

Generators are built on top of Grunt. Grunt provides powerful options parsing
and a great API for manipulating files. For instance, let’s build a generator
that creates an initializer file named initializer.js inside
config/initializers.

The first step is to create a file at lib/generators/initializer_generator.js
with the following content:

    var util = require('util'),
      yeoman = require('yeoman');

    module.exports = Generator;

    function Generator() {
      yeoman.generators.Base.apply(this, arguments);
    }

    util.inherits(Generator, yeoman.generators.Base);

    Generator.prototype.createInitializerFile = function() {
      this.write('config/initializers/initializer.js', "# Add initialization content here");
    };

**Note** Maybe we can provide some OO sugar instead of the typical constructor
call + util.inherits. Very much Backbone inspired, with some auto-propagated
`extend` method on generators (maybe even based on Backbone.Model or something)

`createFile` is method provided by `yeoman.generators.Base`, and is a basic
facade to `grunt.file` API. When we "write" things, this happen relative to the
working directory (that is the Gruntfile location, the Gruntfile is resolved
internally, walking up the FS until one is found).

Our new generator is quite simple: it inherits from `yeoman.generators.Base`
and has one method definition. Each public method in the generator is executed
when a generator is invoked (first level method in the prototype chain, eg.
`Base` class method are not called).  Finally, we invoke the `create_file`
method that will create a file at the given destination with the given
content.

**Note**: So, generators should do their task synchronously. We lack right now
the API to be able to do things asynchronously (which we might need).

To invoke our new generator, we just need to do:

    $ yeoman generate initializer

Before we go on, let’s see our brand new generator description:

    $ yeoman generate initializer --help

yeoman is usually able to generate good descriptions, but not in this particular
case. We can solve this problem in two ways. The first one is calling desc
inside our generator:

    var util = require('util'),
      yeoman = require('yeoman');

    module.exports = Generator;

    function Generator() {
      yeoman.generators.Base.apply(this, arguments);

      this.desc('This generate creates an initializer file at config/initializers');
    }

    util.inherits(Generator, yeoman.generatos.Base);

    Generator.prototype.createInitializerFile = function() {
      this.createFile('config/initializers/initializer.js', "# Add initialization content here");
    };

Now we can see the new description by invoking --help on the new generator. The
second way to add a description is by creating a file named `USAGE` in the same
directory as our generator. We are going to do that in the next step.

**Note**: Right now, the only option is the second way, through a `USAGE` file.
The `desc` method is not there yet, but can be added fairly easily.

### Creating Generators with Generators

Generators themselves have a generator:

    $ yeoman generate generator initializer
      create  lib/generators/initializer
      create  lib/generators/initializer/index.js
      create  lib/generators/initializer/USAGE
      create  lib/generators/initializer/templates

This is the generator just created:

    var util = require('util'),
      yeoman = require('yeoman');

    module.exports = Generator;

    function Generator() {
      yeoman.generators.NamedBase.apply(this, arguments);

      this.sourceRoot(__dirname, 'templates');
    }

    util.inherits(Generator, yeoman.generatos.NamedBase);

First, notice that we are inheriting from `yeoman.Generators.NamedBase` instead
of `yeoman.Generators.Base`. This means that our generator expects at least one
argument, which will be the name of the initializer, and will be available in
our code in the variable `name`.

We can see that by invoking the description of this new generator:

    $ yeoman generate initializer --help

    Usage:
      yeoman generate initializer NAME [options]

**Note**: The banner is not automatically generated yet for generators (the
Usage: thing above). Same for options and arguments defined by the generator,
they should show up during the help output. Right now, the USAGE file is dumped
to the console as is.

We can also see that our new generator has an instance method called `sourceRoot`.

This method points to where our generator templates will be placed, if any, and
by default it points to the created directory
`lib/generators/initializer/templates` (so the `sourceRoot(__dirname,
'templates')` can be removed, this is the default).

In order to understand what a generator template means, let’s create the file
lib/generators/initializer/templates/initializer.js with the following content:

    // Add initialization content here

And now let’s change the generator to copy this template when invoked:

    var util = require('util'),
      yeoman = require('yeoman');

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

Generator relies on hook and other generators, some don't actually generate
anything, they just invokes others to do the work.

This allows us to add/replace/remove any of those invocations. For instance,
the `controller` generator invokes the `view` and `test-framework` hooks. These
hooks tries to resolve their value from cli options first, then look at the
Gruntfile for a generator property with the corresponding hook name, and
finally defaults to the hook name if none were found.

Since each generator has a single responsibility, they are easy to reuse,
avoiding code duplication.

**TBD** Finish up this section: example of running controller generator, see
the hooks. etc.

### Customizing Your Workflow by Changing Generators Templates

In the step above we simply wanted to add a line to the generated helper,
without adding any extra functionality. There is a simpler way to do that, and
it’s by replacing the templates of already existing generators, in that case
`yeoman.generators.HelperGenerator`.

Generators don’t just look in the source root for templates, they also search
for templates in other paths. And one of them is lib/templates. Since we want
to customize `yeoman.generators.HelperGenerator`, we can do that by simply
making a template copy inside lib/templates/yeoman/helper with the name
helper.js.

If you generate another resource, you can see that we get exactly the same
result! This is useful if you want to customize your scaffold templates and/or
layout by just creating edit.html.erb, index.html.erb and so on inside
lib/templates/erb/scaffold.

#### TBD

Commands:

* new (kind of init, but with new [pathtoapp] semantic)
* generate




