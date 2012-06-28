
Rails-like generators. Grunt based.

Default File structure
----------------------

      .
      ├── Gruntfile.js
      ├── (other project root files)
      │
      ├── intermediate (/..) (probably temp/, tmp/, or hidden folder)
      ├── publish      (/..) (probably deploy/)
      │
      ├── app
      │   ├── index.html
      │   ├── browser_modules (probably in app/js instead)
      │   │   ├── jquery
      │   │   │   ├── browser.json
      │   │   │   └── jquery.js
      │   │   └── jquery-ui
      │   │       ├── browser.json
      │   │       └── jquery-ui.js
      │   ├── js
      │   │   ├── controllers
      │   │   │   ├── people_controller.js
      │   │   │   └── person_controller.js
      │   │   ├── main.js
      │   │   ├── models
      │   │   │   └── person.js
      │   │   ├── vendor
      │   │   │   ├── ember-data.js
      │   │   │   ├── ember.js
      │   │   │   └── jquery.js
      │   │   └── views
      │   │       ├── people
      │   │       │   ├── edit_view.js
      │   │       │   ├── index_view.js
      │   │       │   └── list_view.js
      │   │       └── shared
      │   │           ├── frame_view.js
      │   │           └── split_view.js
      │   ├── css
      │   │   └── main.css
      │   │   └── sass
      │   │      └── main.scss
      │   └── templates
      │       └── people
      │           ├── edit.handlebars
      │           ├── index.handlebars
      │           └── list.handlebars
      ├── spec
      │   ├── controllers
      │   │   ├── people_controller_spec.js
      │   │   └── person_controller_spec.js
      │   └── views
      │       └── shared
      │           ├── frame_view_spec.js
      │           └── split_view_spec.js
      └── test
          ├── index.html
          ├── jasmine
          │   ├── jasmine-html.js
          │   ├── jasmine.css
          │   └── jasmine.js
          └── spec_helper.js



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

    util.inherits(Generator, yeoman.generatos.Base);

    Generator.prototype.createInitializerFile = function() {
      this.createFile('config/initializers/initializer.js', "# Add initialization content here");
    };

**Note** Maybe we can provide some OO sugar instead of the typical constructor
call + util.inherits. Very much Backbone inspired, with some auto-propagated
`extend` method on generators (maybe even based on Backbone.Model or something)

`createFile` is method provided by `yeoman.generators.Base`, and is a basic
facade to `grunt.file` API. Generators method can be found in the docco
generated documentation.

Our new generator is quite simple: it inherits from `yeoman.generators.Base`
and has one method definition. Each public method in the generator is executed
when a generator is invoked (first level method in the prototype chain, eg.
`Base` class method are not called).  Finally, we invoke the `create_file`
method that will create a file at the given destination with the given
content.

To invoke our new generator, we just need to do:

    $ yeoman generate initializer

Before we go on, let’s see our brand new generator description:

$ yeoman generate initializer --help

yeoman is usually able to generate good descriptions if a generator is
namespaced, as `yeoman.generators.ModelGenerator`, but not in this particular
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

### Creating Generators with Generators

Generators themselves have a generator:

    $ yeoman generate generator initializer
      create  lib/generators/initializer
      create  lib/generators/initializer/initializer_generator.js
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

We can see that by invoking the description of this new generator (don’t forget
to delete the old generator file):

    $ yeoman generate initializer --help
    Usage:
      yeoman generate initializer NAME [options]

We can also see that our new generator has an instance method called `sourceRoot`.

This method points to where our generator templates will be placed, if any, and
by default it points to the created directory
`lib/generators/initializer/templates`.

In order to understand what a generator template means, let’s create the file
lib/generators/initializer/templates/initializer.js with the following content:

    // Add initialization content here

And now let’s change the generator to copy this template when invoked:

  class InitializerGenerator < yeoman::Generators::NamedBase
    source_root File.expand_path("../templates", __FILE__)

    def copy_initializer_file
      copy_file "initializer.rb", "config/initializers/#{file_name}.rb"
    end
  end

And let’s execute our generator:

    $ yeoman generate initializer core_extensions

We can see that now an initializer named `core_extensions` was created at
`config/initializers/core_extensions.js` with the contents of our template. That
means that `copyFile` copied a file in our source root to the destination path
we gave. The method `filename` is automatically created when we inherit from
`yeoman.Generators.NamedBase`.

The methods that are available for generators are covered in the final section
of this guide.

### Generators Lookup

When you run `yeoman generate initializer core_extensions` yeoman requires these
paths in turn until one is found:

    yeoman/generators/initializer/index.js
    yeoman/generators/initializer.js
    lib/generators/initializer/index.js
    lib/generators/initializer.js

**Note**: `index.js` may be anything else, as long the module entry point is
defined in a package.json.

If none is found you get an error message.

The examples above put files under the application’s `lib`, unless they start
with `yeoman/` which means these paths are resolved below yeoman installation
directory (and are internal).

### Customizing your Workflow

Yeoman own generators are flexible enough to let you customize scaffolding. They
can be configured in your application Gruntfile, these are some defaults:

      generators: {
        template_engine: 'handlebars',
        test_framework: {
          name: 'mocha',
          options: {
            ui: 'bdd'
          }
        }
      }

Looking at this output, it’s easy to understand how generators work in Rails
3.0 and above.

Generator relies on hook and other generators, some don't actually generate
anything, they just invokes others to do the work.

This allows us to add/replace/remove any of those invocations. For instance,
the `controller` generator invokes `handlebars`, `view` and `mocha` generators.
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




