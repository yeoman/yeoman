<%= _.camelize(appname) %>.<%= _.classify(name) %>Controller = Backbone.Collection.extend({

  model: <%= _.camelize(appname) %>.<%= _.classify(name) %>Model

});
