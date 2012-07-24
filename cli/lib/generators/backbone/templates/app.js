
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
