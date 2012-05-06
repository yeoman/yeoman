
define([
	'lib/ember/load'
], function(em) {

	return em.Object.extend({

		name: "",

		createdAt: null,
		modifiedAt: null,
		createdBy: null,

		// Change the createdAt and modifiedAt value when the record is initialized.
		init: function(object) {
			this._super(object);
			this.set('createdAt', em.DateTime.create());
			this.set('modifiedAt', em.DateTime.create());
			this.set('createdBy', em.MyApp.user);
		},

		// Change the modifiedAt value when some attribute is being modified.
		set: function(key, value) {
			if (key == 'modifiedAt') {
				this._super(key, value)
			} else {
				this.set('modifiedAt', Em.DateTime.create());
				this._super(key, value);
			}
		}
	});

});



