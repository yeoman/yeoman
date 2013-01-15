'use strict';

var <%= grunt.util._.camelize(appname) %>App = angular.module('<%= grunt.util._.camelize(appname) %>App', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
