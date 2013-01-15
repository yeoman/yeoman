'use strict';

angular.module('<%= grunt.util._.camelize(appname) %>App')
  .filter '<%= _.camelize(name) %>', () ->
    (input) ->
      '<%= _.camelize(name) %> filter: ' + input
