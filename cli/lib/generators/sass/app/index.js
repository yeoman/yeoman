var util = require('util'),
  yeoman = require('../../../../');

// sass:app generator

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.main = function main() {
  this.write('app/styles/main.css', "/* Will be compiled down to a single stylesheet with your sass files */");
  this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap";');
};

Generator.prototype.fetchCompassBootstrap = function fetchCompassBootstrap() {
  var cb = this.async();

  this.remote('kristianmandrup', 'compass-twitter-bootstrap', '19626592c8a2eafa8f52ee0344ef1ac30f74502f', function(err, remote) {
    if(err) { return cb(err); }

    remote.directory('stylesheets', 'app/styles');

    cb();
  });
};
