

//= require_tree ./controllers
//= require_tree ./helpers
//= require_tree ./templates
//= require_self

// The angular application is created elsewhere (application.js) 
// where this file is required through the pipeline

'use strict';

// Declare app level module which depends on filters, and services
angular.module(<%= grunt.util._.camelize(appname) %>, ['<%= grunt.util._.camelize(appname) %>.filters', '<%= grunt.util._.camelize(appname) %>.services', '<%= grunt.util._.camelize(appname) %>.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);