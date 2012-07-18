
var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    yeoman = require('../../../../');

module.exports = AppGenerator;


function AppGenerator(args, options, config) {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.destinationRoot(this.name);

  // setup the test-framework property, Gruntfile template will need this
  this.test_framework = options['test-framework'] || 'jasmine';

  // cleanup the name property from trailing /, typical usage of directories.
  // update the args object, it's used to initialize js-framework hooks
  if(this.name) this.args[0] = this.args[0].replace(/\/$/, '');

  // resolved to js by default (could be switched to coffee for instance)
  this.hookFor('javascript-engine');

  // resolved to sass by default (could be switched to less for instance)
  this.hookFor('stylesheet-engine');

  // init a framework specific controller. resolved to ? by default
  this.hookFor('js-framework', { as: 'controller' });

  // init a framework specific model. resolved to ? by default
  this.hookFor('js-framework', { as: 'model' });

  // init a framework specific view. resolved to ? by default
  this.hookFor('js-framework', { as: 'view' });

  // resolved to jasmine by default (could be switched to mocha for instance)
  this.hookFor('test-framework');

}

util.inherits(AppGenerator, yeoman.generators.NamedBase);

AppGenerator.prototype.readme = function readme() {
  this.copy('readme.md', 'readme.md');
};

AppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('package.json');
};

AppGenerator.prototype.gitignore = function gitignore() {
  this.copy('gitignore', '.gitignore');
};


AppGenerator.prototype.fetchH5bp = function fetchH5bp() {
  var cb = this.async();
  var self = this;
  
  // Fecth allows the download of single files, into the destination directory
  this.fetch('https://raw.github.com/h5bp/html5-boilerplate/master/index.html', 'index.html', function(err) {
    if(err) return cb(err);
    cb();

    // Resolve path to index.html
    var indexOut = path.resolve('index.html');

    // Read in as string for further update
    var indexData = self.readFileAsString(indexOut);

    // Strip sections of H5BP we're going to overwrite
    indexData = self.removeScript(indexData, 'js/plugins.js');
    indexData = self.removeScript(indexData, 'js/main.js');

    // Wire Twitter Bootstrap plugins (usemin: app/js/plugins.js)
    indexData = self.appendScripts(indexData,
        'app/js/plugins.js',
       ["app/js/vendor/bootstrap/bootstrap-alert.js",  
        "app/js/vendor/bootstrap/bootstrap-dropdown.js",  
        "app/js/vendor/bootstrap/bootstrap-tooltip.js",
        "app/js/vendor/bootstrap/bootstrap-all.js",
        "app/js/vendor/bootstrap/bootstrap-modal.js",
        "app/js/vendor/bootstrap/bootstrap-transition.js",
        "app/js/vendor/bootstrap/bootstrap-button.js",
        "app/js/vendor/bootstrap/bootstrap-popover.js", 
        "app/js/vendor/bootstrap/bootstrap-typeahead.js",
        "app/js/vendor/bootstrap/bootstrap-carousel.js",  
        "app/js/vendor/bootstrap/bootstrap-scrollspy.js",
        "app/js/vendor/bootstrap/bootstrap-collapse.js",  
        "app/js/vendor/bootstrap/bootstrap-tab.js"]);
    // Alternative: indexData = _this.appendScriptsDir(indexData, 'js/plugins.js', path.resolve('app/js/vendor/bootstrap'));

    // Wire RequireJS/AMD (usemin: app/js/amd-app.js)
    indexData = self.appendScriptSpecial(indexData,
      'app/js/amd-app.js',
      ['app/js/vendor/require.js'],'amd');

    // Wire Ember MVC components (usemin: app/js/myapp.js)
    indexData = self.appendScripts(indexData, 
        'app/js/myapp.js', 
        ['app/js/controllers/myapp-controller.js',
         'app/js/models/myapp-model.js', 
        'app/js/views/myapp-view.js']);

    // Write out final file
    self.writeFileFromString(indexData, indexOut);

  });
};


AppGenerator.prototype.fetchPackage = function fetchPackage() {
  this.log.writeln('Fetching h5bp/html5-boilerplate pkg');

  var cb = this.async();

  this.remote('h5bp', 'html5-boilerplate', 'master', function(err, remote) {
    if(err) return cb(err);

    // Remote allows the download of full repository, copying of single of
    // multiple files with glob patterns. `remote` is your API to access this
    // fetched (or cached) package, to copy or process through _.template

    // remote.copy('index.html', 'index.html');
    // remote.template('index.html', 'will/be/templated/at/index.html');

    remote.directory('.', 'app');
    cb();
  });

};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/js');
  this.mkdir('app/css');
  this.mkdir('app/templates');
};

AppGenerator.prototype.lib = function lib() {
  this.mkdir('lib');
  // init a generator ? a readme explaining the purpose of the lib/ folder?
};

AppGenerator.prototype.test = function test() {
  this.mkdir('test');
  this.mkdir('spec');
};

