
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  // source directories
  this.dirs = [
    'controllers'
  ];

  // should we figure it out automatically? and made available through an
  // appname property, function of something.
  this.appname = path.basename(process.cwd());

  this.hookFor('angular:controller', {
    args: ['main']
  });

  this.hookFor('angular:partial', {
    args: ['main']
  });
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.injectAngular = function injectAngular() {

  // Resolve path to index.html
  var indexOut = path.resolve('app/index.html');

  // Read in as string for further update
  var indexData = this.readFileAsString(indexOut);

  // Add CDN link to AngularJS
  indexData = this.appendScripts(indexData,
    'app/scripts/vendor.js',
    ['https://ajax.googleapis.com/ajax/libs/angularjs/1.0.1/angular.min.js']);

  // Wire MVC components (usemin: app/scripts/myapp.js)
  indexData = this.appendScripts(indexData,
    'app/scripts/' + this.appname + '.js',
    [ 'app/scripts/' + this.appname + '.js',
      'app/scripts/controllers/main.js'
    ]);

  //TODO: add files to test/index.html

  // Write out final file
  this.writeFileFromString(indexData, indexOut);
};

Generator.prototype.createDirLayout = function createDirLayout() {
  var self = this;
  this.dirs.forEach(function(dir) {
    self.log.write('Creating app/scripts/' + dir + ' directory...');
    self.mkdir(path.join('app/scripts', dir));
    self.log.ok();
  });
};

Generator.prototype.createAppFile = function createAppFile() {
  this.template('app.js', 'app/scripts/' + this.appname + '.js');
};
