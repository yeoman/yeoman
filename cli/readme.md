# Yeoman CLI

The Yeoman CLI presents a command-line interface for creating, building, maintaining, and shipping a project. For more information on the CLI, please see the projects docs.


## Quick start

```sh
$ sudo -s 'npm install -g && npm link'
```

Next, navigate to where you would like to create a new project and then run:

```yeoman init```


## Run tests

You can run the tests via `npm test` if you like. It will:

* create the `.test/` directory
* run `yeoman init --noprompt`
* copy in `.test/img` a few png files
* run `yeoman build:minify`
* and perfom few basic assertions, comparing *.html files in
`.test/publish` with the expected ones in `test/fixtures`


## Current components

* Twitter Bootstrap
* HTML5 Boilerplate
* Modernizr
* Twitter Bower
* Node.js
* NPM
* Compass
* Socket.IO
* CoffeeScript
* Mocha
* Jasmine
* PhantomJS
* And [more...](https://github.com/yeoman/yeoman/wiki/Dependencies)
