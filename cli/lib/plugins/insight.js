var fs = require('fs'),
    join = require('path').join,
    exec = require('child_process').exec,
    colors = require('colors'),
    prompt = require('prompt');

/**
 * Records the give cmd to Insight.
 *
 * It's assumed yeomaninsight.py is installed globally as
 * /usr/local/bin/_yeomaninsight (or platform equivalent). A full cmd would
 * might look like: _yeomaninsight -n yeoman -v 0.0.1 record cmd cmd2
 *
 * @param {string} cmd The full command line that was run.
 * @param {Function} callback Callback to call when Insight is done.
 */
function invokeInsight(cmd, callback) {
  exec(cmd, function(err, stdout, stderr) {
    if (err) {
      console.log(stderr);
      return callback(err);
    }
    callback();
  });
}

module.exports = {
  init: function(opts) {

    var insight = {
      // Store records in user's home dir (e.g. /Users/username/.yeoman/insight)
      logFile: join(opts.getUserHome(), '.' + opts.pkgname, 'insight', '.log'),
      script: '_' + opts.pkgname + 'insight',
      recordArgs: ['-n', opts.pkgname, '-v', opts.pkgversion, 'record'],
      record: invokeInsight
    };

    // Example: _yeomaninsight -n yeoman -v 0.9.4 record cmd cmd2.
    var cmdStr = insight.script + ' ' +
                 insight.recordArgs.concat(opts.cmds).join(' ');

    fs.stat(insight.logFile, function(err, stats) {
      // Error means file doesn't exist and this is the first run.
      // Go through stat opt-in flow.
      if (!err)  {
        return insight.record(cmdStr, opts.cb);
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
          cmdStr = insight.script + ' ' +
                   insight.recordArgs.concat(['NO_STATS']).join(' ');
          return insight.record(cmdStr, opts.cb);
        }

        insight.record(cmdStr, opts.cb);
      });

    });

  }
};
