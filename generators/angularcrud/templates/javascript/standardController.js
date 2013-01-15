'use strict';

<%= _.camelize(appname) %>App.controller('<%= _.classify(name) %>Ctrl', function($scope) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Testacular'
  ];
});
