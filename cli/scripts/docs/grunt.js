var fs = require('fstream'),
  path = require('path'),
  fork = require('child_process').fork,
  rimf = require('rimraf'),
  Generator = require('h5bp-docs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:../../package.json>',
    docs: {
      wiki: {
        filter    : 'Home',
        layout    : 'index.html',
        style     : 'grey',
        cwd       : path.join(__dirname, '../../docs/wiki/'),
        files     : '**/*.md',
        assets    : '**/*.css',
        prefix    : './',
        relative  : false
      },
      api: {
        tasks     : '../../tasks/**/*.js',
        lib       : '../../lib/**/*.js',
        root      : '../../*.js'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'clean:../../docs/api docs clean:api/ assets clean:../../docs/wiki/_site');
  grunt.registerTask('wiki', 'docs:wiki');
  grunt.registerTask('api', 'docs:api');

  grunt.registerTask('clean', 'Clean dir', function(dirpath) {
    rimf.sync(path.join(__dirname, dirpath));
  });

  grunt.registerTask('assets', 'Copy css / js files', function(dirpath) {
    grunt.helper('copy', '../../docs/wiki/css', '../../docs/css', this.async());
  });


  // **docs** task - uses h5bp-docs on top of wiki submodule (path:
  // `docs/`) and docco on top of project's sources.
  //
  // This is a multi task with `wiki` and `api` as subtarget.
  grunt.registerMultiTask('docs', 'Generates docs', function() {
    var target = this.target,
      data = this.data,
      cb = this.async();

    if(grunt.option('serve')) data.serve = true;
    grunt.helper(target, data, function(err) {
      if(err) return grunt.fail(err);
      cb();
    });
  });


  // **wiki** helper - creates a new site, with given `data`
  // configuration. if `data.serve=true` then a http server is started
  // with live rebuilding (eg. page is rebuild / served on requests)
  grunt.registerHelper('wiki', function(data, cb) {
    var site = new Generator(data);
    site.on('error', function(er) {
      grunt.log.error('✗ Got error' + er.message);
      cb(err);
    });

    var now = +new Date;
    site.on('end', function() {
      grunt.log
        .ok(' ✔ Site generated in ' + ((+new Date - now) / 1000) + 's')
        .writeln(data.serve ? 'Try opening http://localhost:3000' : 'Try running: open docs/_site/index.html');

      grunt.helper('copy', '../../docs/wiki/_site/index.html', '../../docs/index.html', function() {
        if(data.serve) site.preview(cb);
        else cb();
      });
    });


    // reorder the page the way we want
    var ordered = grunt.file.read('pages.txt').trim().split('\n');
    var tmp = [];
    ordered.forEach(function(name, i) {
      var page = site.pages.filter(function(page) {
        return page.name === name;
      })[0];

      tmp[i] = page;
    });
    site.pages = tmp;

    // Now build our pageset, totally custom
    site.data = site.data || {};
    var ps = site.data.pageset = {};
    function json(p) { return p.toJSON(true, ''); }
    ps.intro = site.pages.slice(1, 4).map(json);
    ps.tasks = site.pages.filter(function(page) {
      return path.basename(page.dirname) === 'tasks';
    }).map(json);
    ps.dom = site.pages.filter(function(page) {
      return path.basename(page.dirname) === 'plugins' || page.basename === 'dom.md';
    }).map(json);

    // add package info
    site.data.pkg = grunt.config('pkg');


    // add an anchor to the first heading, for each page
    site.on('page', function(p) {
      var tokens = p.tokens,
        first = tokens[0],
        h1 = first.type === 'heading' && first.depth === 1;

      if(!h1) return;

      var slug = json(p).slug;
      first.escaped = true;
      first.text = first.text
        .link('#' + slug)
        .replace(/href/, 'id="' + slug + '" href');

      p.tokens.unshift({ type: 'hr' });
    });

    // generate
    site.generate();
  });


  // **api**: Uses docco on top of gruntfile, tasks, and lib utils.
  grunt.registerHelper('api', function(data, cb) {
    var docco = require.resolve('docco'),
      categs = Object.keys(data);

    (function generate(categ) {
      if(!categ) return grunt.helper('copy', 'api', '../../docs/api', cb);
      grunt.log.writeln('Generating docco for ' + categ);
      var files = grunt.file.expandFiles(data[categ]);
      grunt.log.writeln('Files: ').writeln(grunt.log.wordlist(files, grunt.utils.linefeed));

      // the docco binary
      var doccobin = path.join(path.dirname(require.resolve('docco')), '../bin/docco');

      // destination dir
      var dest = path.join(__dirname, 'api', categ);

      // adjust filepath to opts.cwd
      files = files.map(function(file) {
        return path.join('../..', file);
      });

      // temporary check on filtering minified files (jquery.min in
      // tasks dir)
      files = files.filter(function(file) {
        return !/\.min\.js$/.test(file);
      });

      grunt.file.mkdir(dest);

      var docco = grunt.utils.spawn({
        cmd: 'node',
        args: [doccobin].concat(files),
        opts: {
          cwd: dest
        }
      }, function() {});

      docco.stdout.on('data', function() { grunt.log.write('.'); });
      docco.stderr.pipe(process.stderr);
      docco.on('error', cb).on('exit', function(code) {
        if(code) return cb(new Error('Error exit code not 0: ' + code));
        grunt.log.ok().ok("I'm done generating " + categ + ' - ' + dest).writeln();
        generate(categs.shift());
      });
    })(categs.shift());

    return;
  });



  // **copy** task - copy the files in docs/_site/* into ./
  grunt.registerHelper('copy', function(src, dest, cb) {
    src = path.join(__dirname, src);
    dest = path.join(__dirname, dest);
    console.log('Copy files %s -> %s', src, dest);
    var type = path.extname(dest) ? 'File' : 'Directory';
    fs.Reader(src).pipe(fs.Writer({ path: dest, type: type })).on('close', cb);
  });

};
