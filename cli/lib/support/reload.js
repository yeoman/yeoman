(function() {

  //
  // This is the client-side script that is "injected" automatically
  // with the connect (or reload) tasks.
  //
  // This is a first implementation. It may greatly be improved, the
  // grunt watch task has evolved and we might add some handy new
  // development utilities.
  //
  // We don't use jQuery for this, but one could totally change this (could we?
  // todo: add a way to overidde this file). It should work well on every (non
  // crappy) browsers. (eg. should implement querySelector).
  //

  var url = 'http://<%= hostname %>:<%= port %>',
    socket = io.connect(url);

  // watched files just changed, reload page.
  // also retrigger on reconnect event
  socket
    .on('changed', reload)
    .on('reconnect', reload)
    .on('error', function(errors) {
      var div = document.createElement('div'),
        errDiv = document.getElementById('h5bp-error'),
        first = document.body.querySelector('*');

      div.innerHTML = errors.map(function(err) {
        return err.msg;
      }).join('<hr \/>');

      div.id = 'h5bp-error';
      div.style.color = '#b94a48';
      div.style.padding = '1em';
      div.style.backgroundColor = '#f2dede';
      div.style.borderColor = '#eed3d7';

      if(errDiv) errDiv.innerHTML = div.innerHTML;
      else document.body.insertBefore(div, first);
    });

    // Function.prototype.bind not always there
    function reload() { location.reload(); }
})();
