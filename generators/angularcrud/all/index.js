
var path = require('path'),
  util = require('util'),
  yeoman = require('yeoman');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.option('coffee');
  this.appname = path.basename(process.cwd());
  
  var args = ['main'];

  if (this.options.coffee) {
    args.push('--coffee');
  }

  this.hookFor('angularcrud:common', {
    args: args
  });

  this.hookFor('angularcrud:app', {
    args: args
  });
  this.hookFor('angularcrud:controller', {
    args: args
  });

  this.hookFor('testacular:app', {
    args: [false] // run testacular hook in non-interactive mode
  });
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor(argument) {
  var cb = this.async();
  var self = this;

  var prompts = [{
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }, {
    name: 'compassBootstrap',
    message: 'If so, would you like to use Twitter Bootstrap for Compass (as opposed to vanilla CSS)?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }];

  this.prompt(prompts, function(e, props) {
    if (e) {
      return self.emit('error', e);
    }
    self.bootstrap = (/y/i).test(props.bootstrap);
    self.compassBootstrap = (/y/i).test(props.compassBootstrap);

    // we're done, go through next step
    cb();
  });
};

// Duplicated from the SASS generator, waiting a solution for #138
Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  if ( this.compassBootstrap ) {
    var cb = this.async();

    this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap";');

    this.remote('kristianmandrup', 'compass-twitter-bootstrap', 'c3ccce2cca5ec52437925e8feaaa11fead51e132', function(err, remote) {
      if(err) {
        return cb(err);
      }

      remote.directory('stylesheets', 'app/styles');

      cb();
    });
  } else if (this.bootstrap) {
    this.log.writeln('Writing compiled Bootstrap');
    this.copy( 'bootstrap.css', 'app/styles/bootstrap.css' ); // this is probably wrong dir
  }
};

// rewrite index.html
