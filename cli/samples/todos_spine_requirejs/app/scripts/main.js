require.config({
  shim:{
    'tmpl'   :{ deps: ['jquery'] },
    'local'  :{ deps: ['spine'] },
    'manager':{ deps: ['spine'] }
  },
  hm: 'hm',
paths: {
    jquery: '../../components/jquery',

    jquery: 'components/jquery/jquery',
    spine: 'components/spine/lib/spine',
    cs: "vendor/cs",
    json2: "vendor/json2",
    tmpl: "vendor/jquery.tmpl",
    local: "components/spine/lib/local",
    manager: "components/spine/lib/manager"
  }
});


require(["cs!coffee/TaskApp"], function(TaskApp) {
    new TaskApp({el: "#tasks"});
});
