
'use strict';

<%= _.camelize(appname) %>App.controller('<%= _.classify(name) %>Ctrl', function($scope, $routeParams, $http) {
  $http.get('/api/<%= model %>/<%= verb %>').success(function(data) {
    $scope.<%= model %> = data;
  });
});
