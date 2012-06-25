

require.config({
  shim:{
    'tmpl':{
      deps: ['jquery']
    },
    'local':{
      deps: ['spine']
    },
    'manager':{
      deps: ['spine']
    }
  },
  hm: 'hm',
  paths: {
    cs: "vendor/cs",
    spine: "browser_modules/spine/lib/spine",
    jquery: "browser_modules/jquery/index",
    json2: "vendor/json2",
    tmpl: "vendor/jquery.tmpl",
    local: "browser_modules/spine/lib/local",
    manager: "browser_modules/spine/lib/manager"
  }
});


require(["cs!coffee/TaskApp"], function(TaskApp) {
    new TaskApp({el: "#tasks"});
});