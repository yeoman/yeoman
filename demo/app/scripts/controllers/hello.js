'use strict';

yeomanServerTestApp.controller('HelloCtrl', function($scope, $routeParams, $http) {
  $http.get('/hello/' + $routeParams.tool).success(function(data) {
    $scope.hello = data;
  });
});