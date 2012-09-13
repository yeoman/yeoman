var fs = require('fs'),
    join = require('path').join,
    spawn = require('child_process').spawn,
    colors = require('colors'),
    prompt = require('prompt');

module.exports = {
  init: function(opts) {

    // Store global state used throughout the project in the user's home dir.
    // e.g. /Users/username/.yeoman
    var YEOMAN_DIR = join(opts.getUserHome(), '.' + opts.pkgname);

    // This should correspond to whatever name is used in package.json.
    var INSIGHT_SCRIPT = '_' + opts.pkgname + 'insight'

    var insightFolder = join(YEOMAN_DIR, 'insight');

    // Assume yeomaninsight.py is installed globally (/usr/local/bin/)
    var insightRecordCmd = ['record'];

    // Record this action in Insight (e.g. python yeomaninsight.py record cmd cmd2).
    spawn(INSIGHT_SCRIPT, insightRecordCmd.concat(opts.cmds));
    //insight.stdout.pipe(process.stdout);

    fs.stat(join(insightFolder, '.log'), function(err, stats) {
      // Error means file doesn't exist and this is the first run.
      // Go through stat opt-in flow.
      if ( !err )  {
        return opts.cb();
      }

/*jshint multistr:true */
var msg = "\
==========================================================================".grey + "\n\
We're constantly looking for ways to make ".yellow + opts.pkgname.bold.red + " better! \n\
May we anonymously report usage statistics to improve the tool over time? \n\
More info: yeoman.io/insight.html & http://yeoman.io".yellow + "\n\
==========================================================================".grey;

      prompt.message = '[' + '?'.green + ']';
      prompt.delimiter = ' ';

      var properties = [{
        name: 'optin',
        message: '[Y/n]: ',
        "default": 'Y',
        validator: /^[yntf]{1}/i,
        empty: false
      }];

      prompt.start();
      console.log(msg);
      prompt.get(properties, function(err, result) {
        if (err) {
          return opts.cb(err);
        }

        if (/n/i.test(result.optin)) {
          spawn(INSIGHT_SCRIPT, insightRecordCmd.concat(['NO_STATS']));
        }
        opts.cb();
      });


    });
  }
};
