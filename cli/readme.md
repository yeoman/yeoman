

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

[grunt]: https://github.com/cowboy/grunt
[grunt documentation]: https://github.com/cowboy/grunt/blob/master/docs/toc.md
[grunt plugin]: https://github.com/cowboy/grunt/blob/master/docs/plugins.md
[Getting Started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md#readme)
[JSDOM]: https://github.com/tmpvar/jsdom
[ant-build-script]: https://github.com/h5bp/ant-build-script
[socket.io]: http://socket.io
[html-minifier]: https://github.com/kangax/html-minifier
