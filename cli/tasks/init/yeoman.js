
var fs = require('fs'),
  path = require('path'),
  colors = require('colors'),
  utils = require('../../').utils,
  fstream = require('fstream'),
  remotes = require('./remotes'),
  rimraf = require('rimraf');


// top level export
var yeoman = module.exports;

//
// The yeoman init template is a bit specific. It basically handles the
// bootstrap of an init template by fetching and caching files from various
// repositories on GitHub.
//
//
// In order, the init template should:
//
// 1. Clean, remove the root/ folder (to delete previous init "build")
// 2. Trigger the template
// 3. Prompts
// 4. Fetch / Copy / End
// 5. Copy specific assets, like the Jasmine default environment (defaults to
// root/test)
// 6. Gruntfile Generation (from prompts and what is in the root folder)
//
// The init task and command when run through `yeoman` should behave like so:
//
//      yeoman init (uses the current working directory, grunt warnings if not empty)
//      yeoman init my-new-app (uses or create the `./my-new-app` directory)
//
//      # both uses the template option, looking up for a predefined
//      # "template" of the same name. This is a simple json file whose properties
//      # are used to bypass prompts when init is run.
//      yeoman init --template defaults
//

// the base working directory for the yeoman template,
// that is the `yeoman/` directory next to this file
yeoman.dir = path.join(__dirname, 'yeoman');

// Basic template description.
yeoman.description = 'Init a new project.';

// Welcome message
yeoman.welcome =
'\n        _   .--------------------------.' + 
'\n      _|' + 'o'.red + '|_ |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
'\n       '+ '(_)'.yellow + '  |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' + 
'\n     / \\' + 'Y'.red + '/ \\' + ' o'.yellow + '_________________________|' + 
'\n    ||  :  |\//                          ' + 
'\n    '+'o'.yellow + '/' + ' ---'.red + ' \\                            ' + 
'\n      _\\ /_                             ' + 
'\n'.yellow.bold;


// Template-specific notes to be displayed before question prompts.
yeoman.notes = ''; //... More notes to come here ...'.yellow;

// Any existing file or directory matching this wildcard will cause a warning.
yeoman.warnOn = '*';

//
// the defaults can bypass a prompt if it matches a prompt name this will
// eventually be pulled in from another file, based on the `--template`
// option.
//
// XXX Ideally, I'd like to be able to have default prompts (that are
// bypassed) in two different ways:
//
// - by loading in a predefined template of answers (with `-t <templateName>`)
// - by checking command line options for matching prop name here, eg.
// passing in a --description Foo would bypass the prompt for description
// using "Foo" as a value.
//
// The order of precedence for conflicting settings is this:
//
// - command line flags
// - template file settings
// - prompts
//

// yeoman.defaults = {
//   "description": "The best project ever.",
//   "version": "0.1.0",
//   "repository": "git://github.com/user/repository.git",
//   "homepage": "https://github.com/user/repository",
//   "licenses": [ "MIT"],
//   "author_url": "none",
//   "git_user": "mk",
//   "name": "testname",
//   "author_name": "you",
//
//   // includes, this would bypass the prompt for project inclusion
//   // this maps the remote name property
//   "include_compass_bootstrap": "y",
//   "include_twitter": "y"
// };
//

yeoman.defaults = {
  require_js: true,
  plugin: false
};

// Display welcome message
// XXX should this exist as it's own helper task?
console.log(yeoman.welcome);

// **configure** setup the initial set of properties from optionnaly loading
// default anwsers. They differ from grunt's usual default prompts in the way
// that they by-pass the prompt instead of setting a default.
//
// XXX right now, it is mainly useful for us with testing to by-pass all the
// prompt. But we may think of a way to prompt user at the end if he wants to
// store all the prompted anwsers, to easily re-run later on (or to share with
// others)
yeoman.configure = function configure(cb) {
  // get back the grunt reference
  var grunt = this.grunt;

  // when user provides a --template option, we try to load in matching
  // predefined template from templates/*.json
  var template = grunt.option('template');

  //  when not provided is invalid, go to the next step right away
  if(!template) return cb();

  // then try to load in predefined template for this template
  template = template + '.json';
  var files = grunt.file.expandFiles(path.join(__dirname, 'templates', template));

  // grunt wasn't able to find a template, go to next step right away
  if(!files.length) return cb();

  // if it is a valid template then, setup `yeoman.defaults` hash object to
  // by-pass relevant options.
  this.defaults = grunt.util._.defaults(grunt.file.readJSON(files[0]), this.defaults);

  cb();
};



// The actual grunt init template.
yeoman.template = function template(grunt, init, cb) {
  // attach the grunt instance to the template object,
  // we're going to use its API through the init code
  //
  // warn, grunt place the `this` context to grunt itself for us already.
  yeoman.grunt = grunt;

  // with grunt 0.4.x, we won't need this anymore
  // related: https://github.com/cowboy/grunt/issues/146
  var done = function(err) {
    if(!err) return cb();
    grunt.log.error(err.stack || err.message);
    return cb(false);
  };

  yeoman.configure(function(err) {
    if(err) return done(err);
    yeoman.start(init, done);
  });

  return yeoman;
};

yeoman.start = function start(init, cb) {

  var grunt = this.grunt;

  // cleanup the previous root folder, if any
  rimraf(path.join(yeoman.dir, 'root'), function(err) {
    if(err) return cb(err);
    // prompt for basic project information
    yeoman.prompt(function(err, props) {
      if(err) return cb(err);
      grunt.log.write("\nGreat! I'll save this configuration to your package.json file!\n\n".green);
      // Fetch our remotes assets and have them copied / compiled / etc.
      yeoman.remotes(props, function(err) {
        if(err) return cb(err);
        // Special gruntfile handler, now a basic copy. We need to have it generated from
        // predefined answer and the state of `yeoman/root` directory.
        yeoman.gruntfile(function(err) {
          if(err) return cb(err);
          // then let grunt copy over all the files that are in `yeoman/root`
          yeoman.end(init, props, cb);
        });
      });
    });

  });

  return this;
};

// **end** completes the creation process.
// XXX custom renames
yeoman.end = function end(init, props, cb) {
  var grunt = this.grunt;

  // Files to copy (and process).
  var files = init.filesToCopy(props);

  // add the Jasmine runner and basic environment
  grunt.util._.extend(files, this.jasmineFilesToCopy(init, props), {
    // Extra files to copy
    'config.rb': 'init/yeoman/config.rb'
  });


  files = yeoman.simplifyFileTree(files);

  // Actually copy (and process) files.
  init.copyAndProcess(files, props);

  // Add properly-named license files.
  init.addLicenseFiles(files, props.licenses);

  // XXX Generate package.json file?
  init.writePackageJSON('package.json', props);

  // Wire up written dependencies to index
  yeoman.wireFiles(props, function(err) {});

  // All done!
  cb();

  return this;
};

// XXX basic copy for now, to be done a fairly elaborated process for
// generating a grunt file based on previous prompts, additional ones and the
// current state of the root folder
yeoman.gruntfile = function gruntfile(cb) {

  // XXX might be removed to just use Gruntfile. But we ensure we write the
  // appropriate Gruntfile depending on grunt's version. From 0.4.x, we need
  // to generate Gruntfile.js. Using semver here would be better, but a
  // temporary regexp should be fine.
  var gruntfile = /^0.4/.test(this.grunt.version) ? 'Gruntfile.js' : 'grunt.js';

  fstream.Reader(path.join(this.dir, 'Gruntfile.js'))
    .on('error', cb)
    // destination is now grunt.js. But it'll change to Gruntfile.js whenever
    // we swicth to grunt 0.4.x
    .pipe(fstream.Writer(path.join(this.dir, 'root', gruntfile)))
    .on('error', cb)
    .on('close', cb);
  return this;
};


// prompts for project information. Takes an optional array of `prompts` String
// and a `callback` to call on completion. When `prompts` is not given, this
// defaults to grunt project standard prompt.
yeoman.prompt = function prompt(cb) {
  var grunt = this.grunt,
    defaults = this.defaults;

  // grunt predefined prompts, no yeoman specific yet
  var prompts = [
    'name',
    'description',
    'version',
    'repository',
    'homepage',
    'licenses',
    'author_name',
    'author_url'
  ];

  // get the grunt prompts object for every of these values
  prompts = prompts.map(function(p) {
    if(defaults[p]) return;
    return grunt.helper('prompt_for', p);
  }).filter(function(p) { return p; });

  // and actually prompt user
  grunt.helper('prompt', prompts, function(err, props) {
    if(err) return cb(err);
    // while merging in back any defaults we might have skipped
    cb(null, grunt.util._.defaults(props, defaults));
  });
};




// remote facade to the actual remote project implementation this step prompts
// for every remote it finds in the `remotes/` directory.
//
// XXX deal with TTL, as Addy mentioned. Maybe we could request the github api for the latest commit
// on this branch or latest tag to automate this. This sha1 could be the cache folder name.
// For now, we always fetch even though the cache folder is already there.
//
yeoman.remotes = function _remotes(props, cb) {
  var grunt = this.grunt;

  // prompt for inclusion on remaining remotes (bootstrap, compass bootstrap)
  var repos = Object.keys(remotes).map(function(remote) {

    // Node.js loads hidden files (.DS_Store) when doing
    // require() against a folder, we don't want those
    if (remote[0] !== '.') {
      return new remotes[remote]({ props: props, grunt: grunt });
    }
  }).sort(function(a, b) {
    return a.priority < b.priority ? -1 : 1;
  });

  // process each one
  (function next(repo) {
    if(!repo) return cb();

    // prompting if any specific to this project information needs to be done,
    // then fetch & copy
    repo.init(function(err) {
      if(err) return cb(err);
      // go the next one
      next(repos.shift());
    });

  })(repos.shift());
};

// append the jasmine runner and basic boilerplate for Jasmine testing to the
// files-to-be-copied Hash object of Grunt. Borrowed and based on
// init.filesToCopy source:
// https://github.com/cowboy/grunt/blob/master/tasks/init.js#L91-107
//
// Does the same lookup but looks into yeoman/jasmine instead of yeoman/root,
// while adding a `test/` prefix folder. This value could be the result of a
// prompt.
yeoman.jasmineFilesToCopy = function jasmineFilesToCopy(init, props) {
  // the hash of files dest:relpath
  var files = {};
  // the base directory
  var prefix = 'init/yeoman/jasmine/';
  this.grunt.task.expandFiles({ dot: true }, prefix + '**').forEach(function(obj) {
    // Get the path relative to the template root.
    var relpath = obj.rel.slice(prefix.length);
    var rule = init.renames[relpath];

    // Omit files that have an empty / false rule value.
    if (!rule && relpath in init.renames) { return; }
    // Create a property for this file.
    // XXX this `test/` prefix could be the result of a prompt
    var dest = rule ? grunt.template.process(rule, props, 'init') : relpath;
    files['test/' + dest] = obj.rel;

  });

  return files;
};



yeoman.wireFiles = function(props, cb){

  var grunt = this.grunt;

  // Placeholders
  // Before </head>
  yeoman.cssFiles = "";
  // Before </body>
  yeoman.jsFiles = "";


  // Current index content
  var indexData = fs.readFileSync(path.resolve('index.html'), 'utf8');

  // Map over remote repos to get them in the right priority order
  var repos = Object.keys(remotes).map(function(remote) {

  if (remote[0] !== '.') {
      return new remotes[remote]({ props: props, grunt: grunt });
    }
  }).sort(function(a, b) {
    return a.priority < b.priority ? -1 : 1;
  });


// For each repo, generate the script or stylesheet refrences for their final files
(function next(repo) {
    if(!repo) return cb();


    // Generate paths and store for wiring
    if(repo.files){

      var filePath = repo.files.path;

      // Remote scripts
      if(repo.files.js){
        repo.files.js.forEach(function(n){
            yeoman.jsFiles += ('<script src="' + (filePath ? filePath + '/' : '') + n + '"></script>\n');
        });
      }

      // Remote stylesheets
      if(repo.files.css){
        repo.files.css.forEach(function(n){
            yeoman.cssFiles += ('<link rel="stylesheet" href="' + (filePath ? filePath + '/' : '') + n  + '">\n');
        });
      }

      // Any other remote files to be added
      if(repo.files.add){
        repo.files.add.forEach(function(n){
           fs.writeFileSync(path.resolve(n.path), n.content, 'utf8');
        });
      }

    }

  next(repos.shift());

  })(repos.shift());


  // Write back the wired up file
  indexData = indexData.replace('</head>', yeoman.cssFiles + '</head>');
  indexData = indexData.replace('</body>', yeoman.jsFiles + '</body>');

  fs.writeFileSync(path.resolve('index.html'), indexData, 'utf8');


};

// We use this a chance to blacklist files or remap any particular paths
yeoman.simplifyFileTree = function(files){
  var newFiles = {};
  for (var file in files){

    // file blacklist
    if (  file.match(/^apple-touch-icon/) ||
          file.match(/^\.gitattributes/)  ||
          file.match(/^crossdomain\.xml/) ||
          file.match(/^humans\.txt/)      ||
          file.match(/^readme\.md/)       ||
          file.match(/^404\.html/)        ||
          file.match(/^robots\.txt/)      ||
          file.match(/^js\/plugins\.js/)  ||

          file.match(/^js\/vendor\/README\.md/)   ||
          file.match(/^js\/vendor\/tests/)
        ){ continue; }

    newFiles[file] = files[file];
  }
  return newFiles;
};
