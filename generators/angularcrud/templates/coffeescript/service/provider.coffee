'use strict'

angular.module('<%= grunt.util._.camelize(appname) %>App')
  .provider '<%= _.camelize(name) %>', () ->

    # Private variables
    salutation = 'Hello'

    # Private constructor
    Greeter () ->
      this.greet = () {
        salutation

    # Public API for configuration
    this.setSalutation = (s) ->
      salutation = s

    # Method for instantiating
    this.$get = () ->
      new Greeter()
