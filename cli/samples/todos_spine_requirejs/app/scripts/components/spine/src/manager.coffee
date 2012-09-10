Spine  = @Spine or require('spine')
$      = Spine.$

class Spine.Manager extends Spine.Module
  @include Spine.Events

  constructor: ->
    @controllers = []
    @bind 'change', @change
    @add(arguments...)

  add: (controllers...) ->
    @addOne(cont) for cont in controllers

  addOne: (controller) ->
    controller.bind 'active', (args...) =>
      @trigger('change', controller, args...)
    controller.bind 'release', =>
      @controllers.splice(@controllers.indexOf(controller), 1)

    @controllers.push(controller)

  deactivate: ->
    @trigger('change', false, arguments...)

  # Private

  change: (current, args...) ->
    for cont in @controllers
      if cont is current
        cont.activate(args...)
      else
        cont.deactivate(args...)

Spine.Controller.include
  active: (args...) ->
    if typeof args[0] is 'function'
      @bind('active', args[0])
    else
      args.unshift('active')
      @trigger(args...)
    @

  isActive: ->
    @el.hasClass('active')

  activate: ->
    @el.addClass('active')
    @

  deactivate: ->
    @el.removeClass('active')
    @

class Spine.Stack extends Spine.Controller
  controllers: {}
  routes: {}

  className: 'spine stack'

  constructor: ->
    super

    @manager = new Spine.Manager

    for key, value of @controllers
      @[key] = new value(stack: @)
      @add(@[key])

    for key, value of @routes
      do (key, value) =>
        callback = value if typeof value is 'function'
        callback or= => @[value].active(arguments...)
        @route(key, callback)

    @[@default].active() if @default

  add: (controller) ->
    @manager.add(controller)
    @append(controller)

module?.exports = Spine.Manager
module?.exports.Stack = Spine.Stack