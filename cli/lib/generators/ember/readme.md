
name:     Ember-Rails (Modified)
authors:   Mickael Daniels, Addy Osmani.
provides: HTML5 Boilerplate, jQuery, Ember, Handlebars, Mocha
usage:    yeoman init ember

yeoman-ember allows you to include a set of [Ember.JS](http://emberjs.com/)
generators into your yeoman application.

Available generators:

    ember:view
    ember:model
    ember:controller
    ember:all

## Architecture

Ember does not require an organized file structure. However, yeoman-ember
allows you to use `yeman g ember:all` to create the following directory
structure under `app/scripts`:

    controllers/
    helpers/
    models/
    states/
    templates/
    views/


Available sub-generators:

    ember:view
    ember:model
    ember:controller
    ember:all

Most of the Ember code here is borrowed from https://github.com/emberjs/ember-rails
