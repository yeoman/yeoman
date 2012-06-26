define (require, exports, module) ->
  module.exports = TaskApp


  Spine = require "coffee/spineModule"
  Task = require "cs!coffee/Task"
  Tasks = require "cs!coffee/Tasks"
  Helper = require "hm!hm/helper"
  jQuery = require "jquery"



  # this works fine!
  MyManager = new Spine.Manager()
  try
    MyStack = new Spine.Stack()
  catch error
    console.log error


  class TaskApp extends Spine.Controller
    events:
      "submit form":   "create"
      "click  .clear": "clear"

    elements:
      ".items":     "items"
      ".countVal":  "count"
      ".clear":     "cleared"
      "form input": "input"

    constructor: ->
      super
      Task.bind("create",  @addOne)
      Task.bind("refresh", @addAll)
      Task.bind("refresh change", @renderCount)
      Task.fetch()

    addOne: (task) =>
      view = new Tasks(item: task)
      @items.append(view.render().el)

    addAll: =>
      Task.each(@addOne)

    clear: ->
      Task.destroyDone()

    create: (e) ->
      e.preventDefault()
      Task.create(name: @input.val())
      Helper.say('Rememeber to ' + @input.val())
      @input.val("")

    renderCount: =>
      #Helper.addAnimation()
      #Helper.colorize()
      active = Task.active().length
      @count.text(active)

      inactive = Task.done().length
      if inactive
        @cleared.show()
      else
        @cleared.hide()
