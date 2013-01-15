var yeoman = window.yeoman || {};
yeoman.stats = yeoman.stats || {};

yeoman.stats.request = function(method, url, callback, opt_data) {
	var data = JSON.stringify(opt_data) || null;

  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onload = function(e) {
  	if (this.status >= 201) {
  		console.log('Error ' + this.status, e);
  	} else {
  		callback(this);
  	}
  };
  xhr.send(data);
};


document.querySelector('#test_buttons').addEventListener('click', function(e) {
	var target = e.target;

  if (target.nodeName != 'BUTTON') {
  	return;
  }

  var method = target.dataset.method.toUpperCase();
  var rpc = target.dataset.rpc.toLowerCase();

  var data = null;
  if (method == 'POST') {
  	data = JSON.parse(document.getElementById('post_body').value);
  }

  yeoman.stats.request(method, '/api/' + rpc, function(xhr) {
  	var resp = JSON.parse(xhr.response);
  	console.log(resp);
  }, data);
});
