var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {

  yeoman.generators.Base.apply(this, arguments);

  this.sourceRoot(path.join(__dirname, 'templates'));

  this.appname = path.basename(process.cwd());
  this.appPermissions = ["experimental"];
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askFor = function askFor (argument) {
  var cb = this.async(),
    self = this;

  var prompts = [{
    name: 'appFullName',
    message: 'What would you like to call this application?',
    default: 'myChromeApp',
    warning: 'You can change the default application name.'
  }];

  this.prompt(prompts, function(e, props) {
    if(e) { return self.emit('error', e); }

    self.appFullName = props.appFullName;

    // we're done, go through next step
    cb();
  });
};

Generator.prototype.writeFiles = function createManifest() {

  var data = {appFullName: this.appFullName,
              appPermissions: "\"" + this.appPermissions.join("\",\"") + "\""};

  this.directory('.','.');
  this.template('app/manifest.json', path.join('app', 'manifest.json'), data);
  this.template('app/index.html', path.join('app', 'index.html'), data);
  this.template('app/main.js', path.join('app', 'main.js'), data);
  this.template('../assets/icon-128.png', path.join('app', 'icon-128.png'), data)

};


