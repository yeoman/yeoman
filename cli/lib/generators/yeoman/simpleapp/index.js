
var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    yeoman = require('../../../../');

module.exports = AppGenerator;

// this example defines a prompt-app generator for demonstration purpose.
//
// So we need to hook other generators with the appropriate context (stylesheet-engine mainly)


function AppGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.test_framework = options['test-framework'] || 'jasmine';

  // cleanup the name property from trailing /, typical usage of directories.
  // update the args object, it's used to initialize js-framework hooks
  if(this.name) this.args[0] = this.args[0].replace(/\/$/, '');

  // hook for bootstrap may be readded. For demo purpose, done in this generator directly.
  // this.hookFor('javascript-engine', { as: 'app' });

  // resolved to sass by default (could be switched to less for instance)
  this.hookFor('stylesheet-engine', { as: 'app' });

  // init a framework specific controller. resolved to ? by default
  // XXX not a named generator, controller for ember is a NamedOne. So we need
  // to give it something to work with.

  /*
  this.hookFor('js-framework', { as: 'controller', args: ['app'] });

  // init a framework specific model. resolved to ? by default
  this.hookFor('js-framework', { as: 'model', args: ['app'] });

  // init a framework specific view. resolved to ? by default
  this.hookFor('js-framework', { as: 'view', args: ['app'] });
  */

  // resolved to jasmine by default (could be switched to mocha for instance)
  this.hookFor('test-framework', { as: 'app' });

}

util.inherits(AppGenerator, yeoman.generators.NamedBase);


AppGenerator.prototype.askFor = function askFor (argument) {
  var cb = this.async(),
    self = this;

  // a bit verbose prompt configuration, maybe we can improve that
  // demonstration purpose. Also, probably better to have this in other generator, whose responsability is to ask
  // and fetch all realated bootstrap stuff, that we hook from this generator.
  var prompts = [{
    name: 'bootstrap',
    message: 'Would you like to include the Twitter Bootstrap plugins?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap plugins will be placed into the JavaScript vendor directory.'
  }, {
    name: 'bootstrapDest',
    message: 'Where would you like it be downloaded ? (not used if previous answer is no)',
    default: 'app/js/vendor/bootstrap',
    warning: 'You can change the default download location'
  }];

  this.prompt(prompts, function(e, props) {
    if(e) return self.emit('error', e);

    // manually deal with the response, get back and store the results.
    // We change a bit this way of doing to automatically do this in the self.prompt() method.
    self.bootstrap = (/y/i).test(props.bootstrap);
    self.bootstrapLocation = props.bootstrapDest;

    // we're done, go through next step
    cb();
  });
};

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

AppGenerator.prototype.fetchBootstrap = function fetchBootstrap() {
  // prevent the bootstrap fetch is user said NO
  if(!this.bootstrap) return;

  var cb = this.async(),
    self = this,
    dest = this.bootstrapLocation;

  // third optional argument is the branch / sha1. Defaults to master when ommitted.
  this.remote('twitter', 'bootstrap', function(e, remote, files) {
    if(e) return self.emit('error', e);
    remote.directory('js', dest);
    cb();
  });
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

    indexData = indexData.replace('css/main.css', 'app/css/main.css');
    indexData = indexData.replace('js/vendor/modernizr-2.5.3.min.js',  'app/js/vendor/modernizr-2.5.3.min.js');

    // Strip sections of H5BP we're going to overwrite
    indexData = self.removeScript(indexData, 'js/plugins.js');
    indexData = self.removeScript(indexData, 'js/main.js');

    // Asked for Twitter bootstrap plugins?
    if(self.bootstrap){

    // Wire Twitter Bootstrap plugins (usemin: app/js/plugins.js)
    indexData = self.appendScripts(indexData,
        'app/js/plugins.js',
       ["app/js/vendor/bootstrap/bootstrap-alert.js",
        "app/js/vendor/bootstrap/bootstrap-dropdown.js",
        "app/js/vendor/bootstrap/bootstrap-tooltip.js",
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

    }

    // Wire RequireJS/AMD (usemin: app/js/amd-app.js)
    ///indexData = self.appendScriptSpecial(indexData,
    ///  'app/js/amd-app.js',
    ///  ['app/js/vendor/require.js'],'amd');

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

