//
// Mocha generated tests
//

var fs = require('fs'),
  path = require('path'),
  assert = require('assert'),
  helpers = require('../helpers'),
  fstream = require('fstream');

describe('Init task', function() {

  // prepares the build dir
  before(function(done) {
    helpers.clean(done);
  });

  it('Given I run the init task', function(done) {
    // runt the html task
    helpers.run('init:yeoman --template defaults', done);
  });

  describe('When the script ends', function(done) {
    it('Then .test/ should have the expected structure', function(done) {
      // use fstream dir reader to assert expected files
      var reader = fstream.Reader({
        path: path.resolve('.test')
      });

      var expected = this.expected = {
        'img'                                      : 'Directory',
        'css'                                      : 'Directory',
        'js'                                       : 'Directory',
        'test'                                     : 'Directory',
        'config.rb'                                : 'File',
        'package.json'                             : 'File',
        'Gruntfile.js'                             : 'File',
        'robots.txt'                               : 'File',
        'readme.md'                                : 'File',
        '404.html'                                 : 'File',
        'favicon.ico'                              : 'File',
        'apple-touch-icon-72x72-precomposed.png'   : 'File',
        'apple-touch-icon-57x57-precomposed.png'   : 'File',
        'apple-touch-icon-precomposed.png'         : 'File',
        'index.html'                               : 'File',
        'apple-touch-icon-114x114-precomposed.png' : 'File',
        'apple-touch-icon.png'                     : 'File',
        'LICENSE-MIT'                              : 'File',
        '.htaccess'                                : 'File',
        'humans.txt'                               : 'File',
        'crossdomain.xml'                          : 'File',
        '.gitattributes'                           : 'File',
        'apple-touch-icon-144x144-precomposed.png' : 'File',
        '.gitignore'                               : 'File'
      };

      var remaining = expected.length;

      reader
        .on('error', done)
        .on('end', done)
        .on('entry', function(entry) {
          var type = expected[entry.props.basename];
          assert.equal(entry.props.type, type, entry.props.basename + ' is not a ' + type);
        });
    });

    // pendings...
    it('And .test/js/vendor should include bootstrap plugins', function(done) {

      // use fstream dir reader to assert expected files
      var reader = fstream.Reader({
        path: path.resolve('.test/js/vendor')
      });

      var expected = this.expected = {
        'bootstrap'                    : 'Directory',
        'hm.js'                        : 'File',
        'require.js'                   : 'File',
        'jquery-1.7.2.js'              : 'File',
        'jquery-1.7.2.min.js'          : 'File',
        'modernizr-2.5.3.min.js'       : 'File'
      };

      var remaining = expected.length;

      reader
        .on('error', done)
        .on('end', done)
        .on('entry', function(entry) {
          var type = expected[entry.props.basename];
          assert.equal(entry.props.type, type, entry.props.basename + ' is not a ' + type);
        });

    });

    it('And .test/css/ should have a sass folder', function(done) {
      fs.stat('.test/css/sass', done);
    });

    it('And .test/css/sass should have the expected structure', function(done) {
      // use fstream dir reader to assert expected files
      var reader = fstream.Reader({
        path: path.resolve('.test/css/sass')
      });

      var expected = this.expected = {
        'compass_twitter_bootstrap'                  : 'Directory',
        '_compass_twitter_bootstrap.sass'            : 'File',
        '_compass_twitter_bootstrap_awesome.sass'    : 'File',
        '_compass_twitter_bootstrap_responsive.sass' : 'File',
        'main.scss'                                  : 'File'
      };

      var remaining = expected.length;

      reader
        .on('error', done)
        .on('end', done)
        .on('entry', function(entry) {
          var type = expected[entry.props.basename];
          assert.equal(entry.props.type, type, entry.props.basename + ' is not a ' + type);
        });
    });

    it('And have the expected configuration');

  });

});
