

var util = require('util'),
  Repo = require('./util/repo');

// XXX
//   - Fetch code may go directly in the fetch method of the Base class
//   - This file file become the base class (and be renamed)
//

module.exports = H5BP;

// Going with EventEmitter right now. Might go to the Stream API.  Maybe we'll
// "pipe" a project to a given folder. Maybe we'll extend a base EventEmitter
// based class.


// `opts` might be an object with the following properties:
//
// - name: used to identify this template, usually the github username
// (or username + repo)
// - user: the github user to fetch from (h5bp)
// - repo: the repository to fetch from (html5-boilerplate)
// - version: the tag version or branch to fetch tarball from
// - props: the answers to the previous prompts at this point, should it
// be useful there.

function H5BP(opts) {

  this.name = opts.name || 'h5bp';

  this.user = opts.user || 'h5bp';
  this.repo = opts.repo || 'html5-boilerplate';
  // latest commit on h5bp repo, to test things out and to always pull from a
  // specific sha1 (thus making the cache thing more robust, master or other
  // branch are likelly to change)
  this.version = opts.version || '3942ee1775b07b6a1c725f064e066f39998a5069';

  this.priority = 1;
  // no prompt for inclusion
  this.include = true;

  Repo.apply(this, arguments);
}

util.inherits(H5BP, Repo);

