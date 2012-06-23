
require.config({
  shim:{
    'tmpl':{
      deps: ['jquery']
    }
  },
  paths: {
    jquery: "browser_modules/jquery/index",
    json2: "vendor/json2",
    tmpl: "vendor/jquery.tmpl",
    cs: "vendor/cs",
    spine: "browser_modules/spine/lib/spine",
    local: "browser_modules/spine/lib/local",
    manager: "browser_modules/spine/lib/manager"
  }
});

require(["cs!coffee/TaskApp"], function(TaskApp) {
    new TaskApp({el: "#tasks"});
});
