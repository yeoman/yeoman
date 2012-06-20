var fs = require('fs'),
    join = require('path').join,
    spawn = require('child_process').spawn,
    prompt = require('prompt');


module.exports = {
    init : function(opts){

        // Store global state used throughout the project in the user's home dir.
        // e.g. /Users/username/.yeoman
        var YEOMAN_DIR = join(opts.getUserHome(), '.' + opts.pkgname);

        var insightFolder = join(YEOMAN_DIR, 'insight');

        // Assume yeomaninsight.py is installed in the user's home dir.
        var insightRecordCmd = [join(insightFolder, 'yeomaninsight.py'), 'record'];

        // Record this action in Insight (e.g. python yeomaninsight.py record cmd cmd2).
        var insight = spawn('python', insightRecordCmd.concat(opts.cmds));
        //insight.stdout.pipe(process.stdout);

        fs.stat(join(insightFolder, '.log'), function(err, stats) {
          // Error means file doesn't exist and this is the first run.
          // Go through stat opt-in flow.
          if (!err) return opts.cb();

var msg = "\
==========================================================================\n\
We're constantly looking for ways to make " + opts.pkgname + " better!    \n\
May we anonymously report usage statistics to improve the tool over time? \n\
More info: http://yeoman.github.com/docs/                                 \n\
==========================================================================";


          prompt.message = '[' + '?'.green + ']';
          prompt.delimiter = ' ';

          var schema = {
            properties: {
              optin: {
                description: "[Y/n]: ",
                "default"  : 'Y',
                pattern    : /^[yntf]{1}/i,
                required   : true
              }
            }
          };

          prompt.start();
          console.log(msg);
          prompt.get(schema, function(err, result) {
            if (err) { return opts.cb(err); }

            if (/n/i.test(result.optin)) {
              var insight = spawn('python', insightRecordCmd.concat(['NO_STATS']));
            }
            opts.cb();
          });


        });
    }
};
