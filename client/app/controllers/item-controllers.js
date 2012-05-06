
define([
	'lib/ember/load',
	'app/models/item'
], function(em, Item) {

	var itemsArray = em.ArrayProxy.create({
		content: [],
		createItem: function(name) {
			var item = Item.create({
				name: name
			});
			this.pushObject(item);
		}
	});

	return {
		itemsArray: itemsArray
	}

});

