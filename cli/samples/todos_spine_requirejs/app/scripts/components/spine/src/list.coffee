Spine  = @Spine or require('spine')
$      = Spine.$

class Spine.List extends Spine.Controller
  events:
    'click .item': 'click'

  selectFirst: false

  constructor: ->
    super
    @bind 'change', @change

  template: ->
    throw 'Override template'

  change: (item) =>
    @current = item

    unless @current
      @children().removeClass('active')
      return

    @children().removeClass('active')
    $(@children().get(@items.indexOf(@current))).addClass('active')

  render: (items) ->
    @items = items if items
    @html @template(@items)
    @change @current
    if @selectFirst
      unless @children('.active').length
        @children(':first').click()

  children: (sel) ->
    @el.children(sel)

  click: (e) ->
    item = @items[$(e.currentTarget).index()]
    @trigger('change', item)
    true

module?.exports = Spine.List