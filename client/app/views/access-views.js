
define([
	'lib/ember/load',
	'plugins/text!app/templates/access.handlebars'
], function(em, accessTemplateSource) {

	var AccessView = em.View.extend({
		template: em.Handlebars.compile(accessTemplateSource),
		didInsertElement: function() {
			this.$("#username-field").focus();
		}
	});

	var actions = em.Object.create({
		login: function() {
			em.MyApp.get("mainView").login();
		},

		logout: function() {
			em.MyApp.get("mainView").logout();
		}
	});

	var UsernameField = em.TextField.extend({
		insertNewline: function() {
			actions.login();
		}
	});

	var AccessButton = em.Button.extend({
		target: actions
	});

	// Export them also from the module to be used elsewhere.
	return {
		AccessView: AccessView,
		AccessButton: AccessButton,
		UsernameField: UsernameField
	}

});

