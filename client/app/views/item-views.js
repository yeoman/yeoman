
define([
	'lib/ember/load',
	'lib/utils',
	'app/controllers/item-controllers',
	'plugins/text!app/templates/list.handlebars'
], function(em, utils, itemControllers, listTemplateSource) {

			var ItemView = em.View.extend({
				createdAtString: function() {
					return utils.formatAsDateAndTime(this.getPath('content.createdAt'));
				}.property('content.createdAt'),
				createdByName: function() {
					var creator = this.getPath('content.createdBy');
					if (creator) {
						return creator.name;
					} else {
						return "Unknown";
					}
				}.property('content.createdBy')
			});

			var CreateItemView = em.TextField.extend({
				classNames: ['create-item-input'], // CSS class name
				insertNewline: function() {
					var value = this.get('value');
					if (value) {
						itemControllers.itemsArray.createItem(value);
						this.set('value', ''); // Reset the field
					}
				},
				didInsertElement: function() {
					this.$().focus();
				}
			});

			var ListItemsView = em.View.extend({
				template: em.Handlebars.compile(listTemplateSource),
				ItemView: ItemView,
				items: itemControllers.itemsArray
			});

			return {
				ItemView: ItemView,
				CreateItemView: CreateItemView,
				ListItemsView: ListItemsView
			}
		}
);

