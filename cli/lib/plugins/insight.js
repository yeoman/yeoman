var fs = require('fs'),
    join = require('path').join,
    spawn = require('child_process').spawn,
    rl = require('readline')



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
          if (err) {

var msg = "\
==========================================================================\n\
We're constantly looking for ways to make " + opts.pkgname + " better!    \n\
May we anonymously report usage statistics to improve the tool over time? \n\
More info: XXX                                                            \n\
==========================================================================\n\
[Y/n]: ";

            // TODO: Bug where backspace re-prompts.
            var i = rl.createInterface(process.stdin, process.stdout, null);
            i.question(msg, function(answer) {
              if (!(answer == '' || answer.toUpperCase() == 'Y')) {
                var insight = spawn('python', insightRecordCmd.concat(['NO_STATS']));
              }
              i.close();
              process.stdin.destroy();
            });
          }
        });

    }
};
