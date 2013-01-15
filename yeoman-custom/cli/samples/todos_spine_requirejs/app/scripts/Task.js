var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require, exports, module) {
  var Spine, Task;
  module.exports = Task;
  Spine = require("coffee/spineModule");
  return Task = (function(_super) {

    __extends(Task, _super);

    function Task() {
      return Task.__super__.constructor.apply(this, arguments);
    }

    Task.configure("Task", "name", "done");

    Task.extend(Spine.Model.Local);

    Task.active = function() {
      return this.select(function(item) {
        return !item.done;
      });
    };

    Task.done = function() {
      return this.select(function(item) {
        return !!item.done;
      });
    };

    Task.destroyDone = function() {
      var rec, _i, _len, _ref, _results;
      _ref = this.done();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rec = _ref[_i];
        _results.push(rec.destroy());
      }
      return _results;
    };

    return Task;

  })(Spine.Model);
});
