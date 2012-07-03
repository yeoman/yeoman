<%= _.camelize(appname) %>.<%= _.classify(name) %> = DS.Model.extend({<% _.each(attrs, function(attr, i) { %>
  <%= _.camelize(attr.name) %>: DS.attr('<%= attr.type %>')<% if(i < (attributes.length - 1)) { %>,<% } %>
<% }); %>});
