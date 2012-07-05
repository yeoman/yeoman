yeoman = require '../../../../'

module.exports = class AppGenerator extends yeoman.generators.NamedBase

  constructor: (args, options, config) ->
    super args, options, config


    # make sure to write to the application path (named based generator)
    @destinationRoot @name

    @pkg =
      title: @name
      name: @name
      version: '0.0.0'
      homepage: ''
      author:
        name: 'author'
      licenses: [ type: 'MIT' ]

    @test_framework = options['test-framework'] or 'jasmine'

  readme: ->
    @copy 'readme.md', 'readme.md'

  gruntfile: ->
    @template 'Gruntfile.js'

  packageJSON: ->
    @template 'package.json'

  configrb: ->
    @template 'config.rb'

  gitignore: ->
    @copy 'gitignore', '.gitignore'

  app: ->
    @mkdir 'app'
    @mkdir 'app/js'
    @mkdir 'app/css'
    @mkdir 'app/templates'
    @hookFor 'javascript-engine'
    @hookFor 'stylesheet-engine'
    @hookFor 'js-framework',
      as: 'controller'

    @hookFor 'js-framework',
      as: 'model'

    @hookFor 'js-framework',
      as: 'view'

  lib: ->
    @mkdir 'lib'

  test: ->
    @mkdir 'test'
    @mkdir 'spec'
    @hookFor 'test-framework'
