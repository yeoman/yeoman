'use strict';

describe('Service: <%= _.camelize(name) %>', function () {

  // load the service's module
  beforeEach(module('<%= _.camelize(appname) %>App'));

  // instantiate service
  var <%= _.camelize(name) %>;
  beforeEach(inject(function(_<%= _.camelize(name) %>_) {
    <%= _.camelize(name) %> = _<%= _.camelize(name) %>_;
  }));

  it('should do something', function () {
    expect(!!<%= _.camelize(name) %>).toBe(true);
  });

});
