'use strict';

var yeomanServerTestApp = angular.module('yeomanServerTestApp', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/hello/:tool', {
        templateUrl: 'views/hello.html',
        controller: 'HelloCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
