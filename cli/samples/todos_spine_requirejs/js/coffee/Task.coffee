define (require, exports, module) ->
  module.exports = Task


  Spine = require "coffee/spineModule"

  class Task extends Spine.Model
    @configure "Task", "name", "done"

    @extend Spine.Model.Local

    @active: ->
      @select (item) -> !item.done

    @done: ->
      @select (item) -> !!item.done

    @destroyDone: ->
      rec.destroy() for rec in @done()
