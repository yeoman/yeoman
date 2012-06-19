define (require, exports, module) ->
  module.exports = TaskApp

  Spine = require "coffee/spineModule"
  Task = require "cs!coffee/Task"
  Tasks = require "cs!coffee/Tasks"
  
  # this code is not part of this app, it's only meant to illustrate a problem
  # I've found with wrapping Spine in a module and then removing the globally 
  
     
  # this works fine!
  MyManager = new Spine.Manager()
  try 
    # this doesn't work... somewhere in here there's a call to a Spine that is not defined.
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
      ".clear":     "clear"
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
  
    create: (e) ->
      e.preventDefault()
      Task.create(name: @input.val())
      @input.val("")
    
    clear: ->
      Task.destroyDone()
      
    renderCount: =>
      active = Task.active().length
      @count.text(active)
      
      inactive = Task.done().length
      if inactive 
        @clear.show()
      else
        @clear.hide()
