
var fs = require('fs'),
  path = require('path');

var plugins = module.exports;

fs.readdirSync(path.join(__dirname)).forEach(function(file) {
  var plugin = file.replace(path.extname(file), '');
  if(plugin === 'index' || path.extname(file) !== '.js') return;
  plugins.__defineGetter__(plugin, function() {
    return require('./' + plugin);
  });
});
