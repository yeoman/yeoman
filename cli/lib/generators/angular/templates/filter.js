'use strict';

<%= _.camelize(appname) %>App.filter('<%= _.camelize(name) %>', function() {
  return function(input) {
    return '<%= _.camelize(name) %> filter: ' + input;
  };
});
