

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
