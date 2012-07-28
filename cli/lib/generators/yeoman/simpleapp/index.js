
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

AppGenerator.prototype.fetchH5bp = function fetchH5bp() {
  var cb = this.async();

  this.remote('h5bp', 'html5-boilerplate', 'master', function(err, remote) {
    if(err) return cb(err);
    // we copy the whole repository as our base app/ directory
    remote.directory('.', 'app');
    cb();
  });
};

AppGenerator.prototype.fetchBootstrap = function fetchBootstrap() {
  // prevent the bootstrap fetch is user said NO
  if(!this.bootstrap) return;

  var cb = this.async(),
    dest = this.bootstrapLocation;

  // third optional argument is the branch / sha1. Defaults to master when ommitted.
  this.remote('twitter', 'bootstrap', function(err, remote, files) {
    if(err) return cb(err);
    remote.directory('js', dest);
    cb();
  });
};

AppGenerator.prototype.writeIndex = function writeIndex() {
  // Resolve path to index.html
  var indexOut = path.resolve('app/index.html');

  // Read in as string for further update
  var indexData = this.readFileAsString(indexOut);

  // Prepare default content text
  var defaults = ['HTML5 Boilerplate','Twitter Bootstrap'];
  var contentText = [
    '    <h1>Cheerio!</h1>',
    '    <p>You now have</p>',
    '    <ul>'
  ];

  // Strip sections of H5BP we're going to overwrite
  indexData = this.removeScript(indexData, 'js/plugins.js');
  indexData = this.removeScript(indexData, 'js/main.js');

  // Asked for Twitter bootstrap plugins?
  if(this.bootstrap) {

    defaults.push('Twitter Bootstrap plugins');

    // Wire Twitter Bootstrap plugins (usemin: js/plugins.js)
    indexData = this.appendScripts(indexData, 'js/plugins.js', [
      'js/vendor/bootstrap/bootstrap-alert.js',
      'js/vendor/bootstrap/bootstrap-dropdown.js',
      'js/vendor/bootstrap/bootstrap-tooltip.js',
      'js/vendor/bootstrap/bootstrap-modal.js',
      'js/vendor/bootstrap/bootstrap-transition.js',
      'js/vendor/bootstrap/bootstrap-button.js',
      'js/vendor/bootstrap/bootstrap-popover.js',
      'js/vendor/bootstrap/bootstrap-typeahead.js',
      'js/vendor/bootstrap/bootstrap-carousel.js',
      'js/vendor/bootstrap/bootstrap-scrollspy.js',
      'js/vendor/bootstrap/bootstrap-collapse.js',
      'js/vendor/bootstrap/bootstrap-tab.js'
     ]);
  }

  // Iterate over defaults, create content string
  defaults.forEach(function(i,x){
    contentText.push('        <li>' + i  +'</li>');
  });


  contentText = contentText.concat([
    '    </ul>',
    '    <p>installed.</p>',
    '    <h3>Enjoy coding! - Yeoman</h3>',
    ''
  ]);

  // Append the default content
  indexData = indexData.replace('<body>', '<body>\n' + contentText.join('\n'));

  // Write out final file
  this.writeFileFromString(indexData, indexOut);
};

// XXX to be put in a subgenerator like rjs:app, along the fetching or require.js /
// almond lib
AppGenerator.prototype.requirejs = function requirejs(){
  var cb = this.async(),
    self = this;

  this.remote('jrburke', 'requirejs', '819774388d0143f2dcc7b178a364e875aea6e45a', function(err, remote) {
    if(err) return cb(err);
    remote.copy('require.js', 'app/js/vendor/require.js');

    // Wire RequireJS/AMD (usemin: js/amd-app.js)
    var body = self.read(path.resolve('app/index.html'));
    body = self.appendScripts(body, 'js/amd-app.js', ['js/vendor/require.js'], {
      'data-main': 'js/main'
    });
    self.write('app/index.html', body);

    // add a basic amd module (should be a file in templates/)
    self.write('app/js/main.js', [
      "define(\'main\', function() {",
      "  return 'yeoman'",
      "});"
    ].join('\n'));

    cb();
  });
};

AppGenerator.prototype.writeMain = function writeMain(){
  this.log.writeln('Writing compiled Bootstrap');
  this.template('main.css', path.join('app/css/main.css'));
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

