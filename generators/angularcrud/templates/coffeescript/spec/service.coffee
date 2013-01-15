'use strict'

describe 'Service: <%= _.camelize(name) %>', () ->

  # load the service's module
  beforeEach module '<%= _.camelize(appname) %>App'

  # instantiate service
  <%= _.camelize(name) %> = {}
  beforeEach inject (_<%= _.camelize(name) %>_) ->
    <%= _.camelize(name) %> = _<%= _.camelize(name) %>_

  it 'should do something', () ->
    expect(!!<%= _.camelize(name) %>).toBe true;
