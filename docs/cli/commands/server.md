

## server

Usage: `yeoman server`

Launches a preview server on port 3051 that allows you to access a running version of your application
locally.

It also automatically fires up the `yeoman watch` process, so changes to any of the applications
files cause the browser to refresh via [LiveReload](http://livereload.com). Should you not have
LiveReload installed locally, a fallback reload process will be used instead.

Any changes to CoffeeScript or Compass files result in them being recompiled, meaning that
no manual intervention is required to write and preview code in the format you feel most
comfortable with.

`yeoman server` generates an intermediate build directory in your project root which (called `temp`)
contains the compiled files mentioned above as well as the basic blocks needed to preview your application.
A complete build can be generated using `yeoman build`.

To quit the server, simply run `yeoman quit server` and this will kill the Python server
process.

### profiles

The built-in server also supports serving different profiles of your application, such as: `app`, `dist`, `test` and `reload`.

* `yeoman server` and `server:app` compile to and serve `/temp`, an intermediate build of your application.
* `yeoman server:dist` serves up the optimized final version of your application. This will just serve up the `/dist` directory if it exists and you will need to run `yeoman build` in order to generate the production build of your app.
* `yeoman server:test` serves up the test suite
* `yeoman server:reload` forces the port to be LiveReload standard port: 35729 and prevents the automatic default browser opening. Handy for those wishing to use livereload extensions with other systems / HTTP servers than the one provided by Yeoman out of the box.

### further notes

At present, when initially running `yeoman server` or `yeoman server:app`, some users may find that their browser is opened before intermediate files such as Compass and CoffeeScript have completed compiling. Whilst we intend on fixing this issue very soon, in the mean time we recommend refreshing the browser shortly after you first fire up the server (e.g 10 seconds after). You can then easily make any changes you wish to your application and the browser will be automatically reloaded via LiveReload.