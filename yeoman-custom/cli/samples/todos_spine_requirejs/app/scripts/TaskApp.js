var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(function(require, exports, module) {
  var Fun, MyManager, MyStack, Spine, Task, TaskApp, Tasks, jQuery;
  module.exports = TaskApp;
  Spine = require("coffee/spineModule");
  Task = require("cs!coffee/Task");
  Tasks = require("cs!coffee/Tasks");
  Fun = require("hm!hm/fun");
  jQuery = require("jquery");
  MyManager = new Spine.Manager();
  try {
    MyStack = new Spine.Stack();
  } catch (error) {
    console.log(error);
  }
  return TaskApp = (function(_super) {

    __extends(TaskApp, _super);

    TaskApp.prototype.events = {
      "submit form": "create",
      "click  .clear": "clear"
    };

    TaskApp.prototype.elements = {
      ".items": "items",
      ".countVal": "count",
      ".clear": "cleared",
      "form input": "input"
    };

    function TaskApp() {
      this.renderCount = __bind(this.renderCount, this);

      this.addAll = __bind(this.addAll, this);

      this.addOne = __bind(this.addOne, this);
      TaskApp.__super__.constructor.apply(this, arguments);
      Task.bind("create", this.addOne);
      Task.bind("refresh", this.addAll);
      Task.bind("refresh change", this.renderCount);
      Task.fetch();
    }

    TaskApp.prototype.addOne = function(task) {
      var view;
      view = new Tasks({
        item: task
      });
      return this.items.append(view.render().el);
    };

    TaskApp.prototype.addAll = function() {
      return Task.each(this.addOne);
    };

    TaskApp.prototype.clear = function() {
      return Task.destroyDone();
    };

    TaskApp.prototype.create = function(e) {
      e.preventDefault();
      Task.create({
        name: this.input.val()
      });
      return this.input.val("");
    };

    TaskApp.prototype.renderCount = function() {
      var active, inactive;
      active = Task.active().length;
      this.count.text(active);
      inactive = Task.done().length;
      if (inactive) {
        return this.cleared.show();
      } else {
        return this.cleared.hide();
      }
    };

    return TaskApp;

  })(Spine.Controller);
});
