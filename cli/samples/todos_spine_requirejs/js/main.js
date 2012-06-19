
require.config({
  paths: {
    jquery: "vendor/jquery-1.7.2.min",
    json2: "vendor/json2",
    tmpl: "vendor/jquery.tmpl",
    cs: "vendor/cs",
    spine: "vendor/spine/spine",
	local: "vendor/spine/local",
	manager: "vendor/spine/manager"
  }
});

require(["cs!src/TaskApp"], function(TaskApp) {
    new TaskApp({el: "#tasks"});
});
