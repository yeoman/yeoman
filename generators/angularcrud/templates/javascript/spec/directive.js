'use strict';

describe('Directive: <%= _.camelize(name) %>', function() {
  beforeEach(module('<%= _.camelize(appname) %>App'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<<%= _.dasherize(name) %>></<%= _.dasherize(name) %>>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the <%= _.camelize(name) %> directive');
  }));
});
