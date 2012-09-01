'use strict';

describe('Controller: <%= _.camelize(name) %>Ctrl', function() {
  beforeEach(module('<%= _.camelize(appname) %>App'));

  var <%= _.camelize(name) %>Ctrl,
    scope;

  beforeEach(inject(function($controller) {
    scope = {};
    <%= _.camelize(name) %>Ctrl = $controller('<%= _.camelize(name) %>Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
