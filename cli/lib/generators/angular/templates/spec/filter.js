'use strict';

describe('Filter: <%= _.camelize(name) %>', function() {

  // load the filter's module
  beforeEach(module('<%= _.camelize(appname) %>App'));

  // initialize a new instance of the filter before each test
  var <%= _.camelize(name) %>;
  beforeEach(inject(function($filter) {
    <%= _.camelize(name) %> = $filter('<%= _.camelize(name) %>');
  }));

  it('should return the input prefixed with "<%= _.camelize(name) %> filter:"', function() {
    var text = 'angularjs';
    expect(<%= _.camelize(name) %>(text)).toBe('<%= _.camelize(name) %> filter: ' + text);
  });

});
