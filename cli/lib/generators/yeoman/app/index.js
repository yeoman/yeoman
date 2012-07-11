
var util = require('util'),
    cheerio = require('cheerio'),
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

AppGenerator.prototype.configrb = function configrb() {
  this.template('config.rb');
};

AppGenerator.prototype.gitignore = function gitignore() {
  this.copy('gitignore', '.gitignore');
};



function domUpdate(filePath, tagName, content, mode){

  var indexData = fs.readFileSync(path.resolve(filePath), 'utf8');
  $ = cheerio.load(indexData);


  if(content !== undefined){
    if(mode === 'a'){
      //append
      $(tagName).append(content);
    }else if(mode === 'p'){
      //prepend
      $(tagName).prepend(content);
    }
    fs.writeFileSync(filePath, $.html(), 'utf8');
  }else{
    console.error('Please supply valid content to be updated.');
 }

};

// Usage: appendTo('index.html', 'body', 'some content');
function appendTo(filePath, tagName, content){
  domUpdate(filePath, tagName, content, 'a');
};

// Usage: prependTo('index.html', 'body', 'some content');
function prependTo(filePath, tagName, content){
  domUpdate(filePath, tagName, content, 'p');
};

// Generate a usemin-handler block
function generateBlock(blockType, optimizedPath, filesStr){
  var blockStart = "\n<!-- build:" + blockType + " " + optimizedPath +" -->\n";
  var blockEnd = "<!-- endbuild -->";
  return blockStart + filesStr + blockEnd;
};

// Append scripts, specifying the optimized path and generating the
// necessary usemin blocks
function appendScripts(filePath, optimizedPath, sourceScriptList){
  var scripts = "";
  sourceScriptList.forEach(function(n){
      scripts += ('<script src="' + n + '"></script>\n');
  });
  var blocks = generateBlock('js', optimizedPath, scripts);
  appendTo(filePath, 'body', blocks);
};

// Append a directory of scripts
function appendScriptsDir(filePath, optimizedPath, sourceScriptDir){
  var sourceScriptList = fs.readdirSync(sourceScriptDir);
  appendScripts(filePath, optimizedPath, sourceScriptList);
};

AppGenerator.prototype.fetchH5bp = function fetchH5bp() {
  var cb = this.async();
  // Fecth allows the download of single files, into the destination directory
  this.fetch('https://raw.github.com/h5bp/html5-boilerplate/master/index.html', 'index.html', function(err) {
    if(err) return cb(err);
    cb();

    // XXX Next, we need to start doing this in one go to avoid the need to write to the file more than once.
    // Probably just read index once, perform updates, do a final write.

    // Twitter Bootstrap plugins
    appendScriptsDir('index.html', 'js/plugins.js', path.resolve('app/js/vendor/bootstrap'));

    // Ember MVC components
    appendScripts('index.html', 'js/app.js', ['app/js/controllers/myapp-controller.js','app/js/models/myapp-model.js', 'app/js/views/myapp-view.js']);

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

