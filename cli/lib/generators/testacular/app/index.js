
var util = require('util'),
    path = require('path'),
    yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('interactive', {
    type: Boolean,
    defaults: true,
    banner: '[interactive mode]',
    required: false
  });
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  // Copies the contents of the generator `templates`
  // directory into your users new application path

  this.directory('.','.', true);

  // TODO: not sure if this is the most pragmatic way to do this
  if (this.interactive) {
    this.log.writeln("You may want to add the following to your Gruntfile.js:\n");
    [
      "    grunt.registerTask('test', 'run the testacular test driver', function () {",
      "      var done = this.async();",
      "      require('child_process').exec('testacular testacular.conf.js --single-run', function (err, stdout) {",
      "        grunt.log.write(stdout);",
      "        done(err);",
      "      });",
      "    });",
      ""
    ].forEach(function (ln) {
      console.log(ln);
    });
  }

};
