'use strict';

describe('Controller: <%= _.classify(name) %>Ctrl', function() {

  // load the controller's module
  beforeEach(module('<%= _.camelize(appname) %>App'));

  var <%= _.classify(name) %>Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    <%= _.classify(name) %>Ctrl = $controller('<%= _.classify(name) %>Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
