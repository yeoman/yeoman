var util = require('util'),
  Base = require('./base');


function NamedBase(args, options, config) {
  Base.apply(this, arguments);
  this.argument('name', { type: String, required: true });
}

util.inherits(NamedBase, Base);
module.exports = NamedBase;
