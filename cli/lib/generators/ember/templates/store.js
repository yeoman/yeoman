<%= grunt.util._.camelize(appname) %>.Store = DS.Store.extend({
  revision: 4,
  adapter: DS.RESTAdapter.create()
});

