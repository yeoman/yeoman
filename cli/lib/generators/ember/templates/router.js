<%= grunt.util._.camelize(appname) %>.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/'

      // You'll likely want to connect a view here.
      // connectOutlets: function(router) {
      //   router.get('applicationController').connectOutlet(App.MainView);
      // }

      // Layout your routes here...
    })
  })
});

