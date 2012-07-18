
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.dirs = 'models collections views routes helpers templates'.split(' ');

  // should we figure it out automatically? and made available through an
  // appname property, function of something.
  this.appname = path.basename(process.cwd());

  // the api to hookFor and pass arguments may vary a bit.
  this.hookFor('backbone:view', {
    args: [ 'application' ]
  });
  this.hookFor('backbone:model', {
    args: [ 'application' ]
  });
  this.hookFor('backbone:collection', {
    args: [ 'application' ]
  });
  this.hookFor('backbone:router', {
    args: [ 'application' ]
  });
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.injectBackbone = function injectBackbone() {

    // Resolve path to index.html
    var indexOut = path.resolve('index.html');

    // Read in as string for further update
    var indexData = this.readFileAsString(indexOut);
    
    // Workaround until copying underscore/lodash-like scripts don't cause issues.
    indexData = this.appendScripts(indexData, 
        'app/js/vendor.js', 
        ['http://cdnjs.cloudflare.com/ajax/libs/lodash.js/0.4.1/lodash.min.js', 
        'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.2/backbone-min.js']);

    // Wire MVC components (usemin: app/js/myapp.js)
    indexData = this.appendScripts(indexData, 
        'app/js/myapp.js', 
        ['app/js/' + this.appname  +'.js',
        'app/js/views/application-view.js',
        'app/js/models/application-model.js',
        'app/js/collections/application-collection.js',
        'app/js/routes/app-router.js']);

    // Write out final file
    this.writeFileFromString(indexData, indexOut);

};

Generator.prototype.createDirLayout = function createDirLayout() {
  var self = this;
  this.dirs.forEach(function(dir) {
    self.log.write('Creating app/js/' + dir + ' directory...')
    self.mkdir(path.join('app/js', dir));
    self.log.ok();
  });
};

Generator.prototype.createAppFile = function createAppFile() {
  this.template('app.js', 'app/js/' + this.appname + '.js');
};

