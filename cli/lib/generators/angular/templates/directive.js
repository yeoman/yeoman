'use strict';

<%= _.camelize(appname) %>App.directive('<%= _.camelize(name) %>', function() {
  return function(scope, elm, attrs) {
    elm.text('<%= _.camelize(name) %> directive');
  };
});
