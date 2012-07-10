//
// XXX these are the rails 3 asset pipeline require that was in the original
// gem. No actual effect on yeoman, should we tie up the amd thing here?
//
// Should we thinkg of another way of doing so? Like a
// hookFor('dependency-system'), resolved to amd, which trigger the
// `amd:generatorName` generator. This generator should be passed a list of files
// to handle / wrap into require/define call.
//
//= require ./store
//= require_tree ./models
//= require_tree ./controllers
//= require_tree ./views
//= require_tree ./helpers
//= require_tree ./templates
//= require_tree ./routes
//= require_self

// Added this from the emberjs rails bootstrap generator. The Ember application
// is created elsewhere (application.js) where this file is required through
// the pipeline

var <%= grunt.util._.camelize(appname) %> = Ember.Application.create();

var router = <%= grunt.util._.camelize(appname) %>.router = <%= grunt.util._.camelize(appname) %>.Router.create({
  location: 'hash'
});

<%= grunt.util._.camelize(appname) %>.initialize(router);

