
define([
	'lib/ember/load',
	'app/models/user',
	"app/views/main-views",
	"app/views/access-views",
	"app/views/item-views"
], function(em, User, mainViews, accessViews, itemViews) {

	var user = User.create();

	// Create a local namespace for the app
	var MyApp = em.Application.create({
		VERSION: "0.0.1",
		user: User.create({
			name: ""
		})
	});

	// Instantiate the main view
	var mainView = mainViews.MainView.create();
	mainView.appendTo("#main");
	MyApp.set("mainView", mainView);
	var accessView = accessViews.AccessView.create();
	mainView.switchView(accessView);

	// Expose the views to the handlebars templates
	MyApp.set("AccessView", accessViews.AccessView);
	MyApp.set("AccessButton", accessViews.AccessButton);
	MyApp.set("UsernameField", accessViews.UsernameField);
	MyApp.set("ItemView", itemViews.ItemView);
	MyApp.set("CreateItemView", itemViews.CreateItemView);
	MyApp.set("ListItemsView", itemViews.ListItemsView);

	// Add the application's namespace to Ember so we can access it
	// from within handlebars templates.
	em.MyApp = MyApp;

	// Export it from the module.
	return MyApp;

});

