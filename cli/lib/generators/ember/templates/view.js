<%= grunt.util._.camelize(appname) %>.<%= grunt.util._.camelize(name) %>View = Ember.View.extend({
  templateName: '<%= grunt.util._.underscored(name) %>'
});
