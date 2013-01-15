var yeomanStats = angular.module('yeomanStats', []);

// Make templating play nicely with Django. {{}} -> [[]]
yeomanStats.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});


function Controller($scope) {

}

Controller.$inject = ['$scope'];
