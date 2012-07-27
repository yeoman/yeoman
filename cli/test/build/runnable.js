var spawn = require('child_process').spawn,
  events = require('events'),
  util = require('util');

//
// Main assertion thingy. First rough work.
//
// Thx to @visionmedia, based off supertest's Runnable object:
// https://github.com/visionmedia/supertest/blob/master/lib/Runnable.js
//


module.exports = Runnable;

// Initialize a new `Runnable` with the given `options` Hash object.

function Runnable(cmds, options) {
  this.options = options || {};
  this._body = null;
  this._status = 0;
  this._command = '';
  this._prompts = [];
  this.use(cmds);
}

// inherits from EventEmitter

util.inherits(Runnable, events.EventEmitter);

// Setup CLI command.
Runnable.prototype.use = function use(command) {
  this._command = command;
  return this;
};


//
// Expectations:
//
//   .expect(0)
//   .expect(0, fn)
//   .expect(0, body)
//   .expect('Some body')
//   .expect('Some body', fn)
//

Runnable.prototype.expect = function expect(a, b){
  var self = this;

  // callback
  if (typeof b === 'function') this.end(b);

  // status
  if (typeof a === 'number') {
    this._status = a;
    // body
    if (b && typeof b !== 'function') this._body = b;
    return this;
  }

  // body
  this._body = a;

  return this;
};

// Adds a new prompt hook to the list of expected prompts, automatically
// writes the `answer` string provided to child's stdin when the
// `matcher` RegExp or String match a given prompt in child stdout.
Runnable.prototype.prompt = function prompt(matcher, answer) {
  matcher = matcher instanceof RegExp ? matcher : new RegExp(matcher, 'i');
  this._prompts.push({
    matcher: matcher,
    answer: (answer || '') + '\n'
  });
};

// Defer invoking `.end()` until the command is done running.
Runnable.prototype.end = function end(fn) {
  var self = this;
  fn = fn || function() {};

  this.run(function(err, stdout, stderr) {
    var code = err ? err.code : 0;

    self.emit('done');
    self.emit('end');

    self.assert({
      status: code,
      text: (stdout || stderr),
      err: err
    }, fn);
  });

  return this;
};

// Add topic to current (or root)
Runnable.prototype.run = function run(fn) {
  var self = this,
    cmds = this._command,
    opts = this.options;

  if(!cmds) return this.emit(new Error('Cannot run withou a command. Use .use!'));

  cmds = cmds.split(' ');

  // Execute defined command with arguments and passed options
  var child = spawn(cmds.shift(), cmds, opts),
    write = child.stdin.write.bind(child.stdin);

  // case of redirect options turned on, pipe back all stdout / stderr
  // output to parent process
  if(opts.redirect) {
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  }

  var out = '';
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(chunk) {
    out += chunk;

    self._prompts.forEach(function(prompt) {
      if(prompt.matcher.test(chunk)) {
        process.nextTick(write.bind(null, prompt.answer));
      }
    });
  });

  var err = '';
  child.stderr.on('data', function(chunk) {
    err += chunk;
  });

  child.on('close', function(code) {
    if(!code) return fn(null, out, err);
    var error = new Error('Error executing yeoman init: ' + code);
    error.code = code;
    fn(error, out, err);
 });

  return this;
};


// Perform assertions and invoke `fn(err)`.
Runnable.prototype.assert = function assert(res, fn) {
  var status = this._status,
    body = this._body,
    isregexp = body instanceof RegExp,
    expected,
    actual,
    re;

  // status
  if (status && res.status !== status) {
    return fn(new Error('expected ' + status + ', got ' + res.status), res);
  }

  // body
  if (body) {
    // string
    actual = util.inspect(res.text);
    expected = util.inspect(body);

    if (body !== res.text) {
      // regexp
      if (isregexp) {
        if (!body.test(res.text)) {
          return fn(new Error('expected body ' + res.text + ' to match ' + body));
        }
      } else {
        return fn(new Error('expected ' + expected + ' response body, got ' + actual));
      }
    }
  }

  fn(null, res);
};

