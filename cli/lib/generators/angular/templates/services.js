'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('<%= _.camelize(appname) %>.services', []).
  value('version', '0.1');
