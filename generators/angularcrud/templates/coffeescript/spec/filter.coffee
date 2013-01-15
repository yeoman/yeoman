'use strict'

describe 'Filter: <%= _.camelize(name) %>', () ->

  # load the filter's module
  beforeEach module '<%= _.camelize(appname) %>App'

  # initialize a new instance of the filter before each test
  <%= _.camelize(name) %> = {}
  beforeEach inject ($filter) ->
    <%= _.camelize(name) %> = $filter '<%= _.camelize(name) %>'

  it 'should return the input prefixed with "<%= _.camelize(name) %> filter:"', () ->
    text = 'angularjs'
    expect(<%= _.camelize(name) %> text).toBe ('<%= _.camelize(name) %> filter: ' + text);
