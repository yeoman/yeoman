'use strict';

/* Directives */

angular.module('<%= _.camelize(appname) %>.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);