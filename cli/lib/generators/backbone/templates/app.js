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


window.<%= grunt.util._.camelize(appname) %> = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    console.log('Hello from Backbone!');
  }
};

$(document).ready(function(){
  <%= grunt.util._.camelize(appname) %>.init();
});