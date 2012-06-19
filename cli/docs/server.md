server(1) -- Launch a preview server which will begin watching for changes
==========================================================================

The `server` task can be used to launch a LiveReload server (like LiveReload 2,
rack-livereload, guard-livereload etc).

Resource: http://help.livereload.com/kb/ecosystem/livereload-protocol

The protocol used by the `server` task is `v7`.

## Description

- The `server` task expose a websocket and HTTP server on port 35729.

- Websocket connections use `/livereload` as the path to connect.

- The [livereload.js][] script is served on the `/livereload.js` path.

Messages are JSON object with a `command` key.

Upon connection, a handshake takes place:

* Handshake, client-to-server.

```json
{
  command: 'hello',
  protocols: [
    'http://livereload.com/protocols/official-7',
    'http://livereload.com/protocols/official-8',
    'http://livereload.com/protocols/2.x-origin-version-negotiation'
  ]
}

```

* Handshake, server-to-client:

```json
{
  command: 'hello',
  protocols: [
    'http://livereload.com/protocols/official-7',
    'http://livereload.com/protocols/official-8',
    'http://livereload.com/protocols/official-9',
    'http://livereload.com/protocols/2.x-origin-version-negotiation',
    'http://livereload.com/protocols/2.x-remote-control'
  ],
  serverName: 'yeoman-livereload'
}
```


[livereload.js]: https://github.com/livereload/livereload-js

## Note

This task replaces the built-in grunt `server` task which is renamed and still
available as `grunt-server`.
