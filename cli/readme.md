

## Yeoman CLI

The Yeoman CLI presents a command line interface for creating, building, maintaining, and shipping a project. For more information on the CLI, please see the projects docs.


## Quick start

```
# sudo npm install -g
# sudo npm link (otherwise you'll get exceptions at the moment during scaffolding setup)
```

Next, navigate to where you would like to create a new project and then run:

```yeoman init```

**run the tests**

You can run the tests via `npm test` if you like. It will:

* create the `.test/` directory
* run `yeoman init --noprompt`
* copy in `.test/img` a few png files
* run `yeoman build:minify`
* and perfom few basic assertions, comparing *.html files in
`.test/publish` with the expected ones in `test/fixtures`

# Current components

* Compass
* Grunt
* Twitter Bootstrap
* Html5 Boilerplate
* Modernizr
* Node
* NPM
* Twitter Nest 
* socket.io
* coffeescript
* mocha
* jasmine
* PhantomJS
* optipng, jpegtran
* connect
* html-minifier
* clean-css
* node-build-script
* compass_bootstrap


