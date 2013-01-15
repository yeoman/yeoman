'use strict';

angular.module('<%= grunt.util._.camelize(appname) %>App')
  .service '<%= _.camelize(name) %>', () ->
    # AngularJS will instantiate a singleton by calling "new" on this function
