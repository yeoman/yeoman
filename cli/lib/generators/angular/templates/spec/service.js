describe('<%= _.camelize(appname) %>App:<%= _.camelize(name) %>', function () {

  // instantiate new parent module
  beforeEach(module('<%= _.camelize(appname) %>App'));

  // Setup which dependencies will be mocked
  /*
  beforeEach(module(function($provide) {
    $provide.factory('serviceToMock', createServiceMock);
  }));
  */

  describe('<%= _.camelize(name) %>', function() {
    var <%= _.camelize(name) %>;

    // instantiate services and service mocks
    beforeEach(inject(function(_<%= _.camelize(name) %>_) {
      <%= _.camelize(name) %> = _<%= _.camelize(name) %>_;
    }));
  });

});
