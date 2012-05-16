
var fs = require('fs'),
  path = require('path'),
  utils = require('../../').utils;

var h5bp = module.exports;

// Basic template description.
h5bp.description = 'Init a new html5-boilerplate project.';

// Template-specific notes to be displayed before question prompts.
h5bp.notes = fs.readFileSync(path.join(__dirname, 'h5bp/notes.txt'), 'utf8');

// Any existing file or directory matching this wildcard will cause a warning.
h5bp.warnOn = '*';

// the "prompts steps"
h5bp.steps = 'project setup files gruntfile'.split(' ');

// The actual init template.
h5bp.template = function(grunt, init, done) {
  h5bp.grunt = grunt;

  // setup custom prompt
  h5bp.customPrompt();

  (function run(step) {
    if(!step) return h5bp.end(init, h5bp.props, done);

    h5bp[step](function(err, props) {
      if(err) {
        grunt.log.error(err);
        return done(false);
      }

      if(step === 'project') h5bp.props = props;
      else h5bp.props[step] = props;
      run(h5bp.steps.shift());
    });
  })(h5bp.steps.shift())

};


//
// Prompts steps
//
// _ project info
// - default setup
// - rewrite of specific files
//

// **project** prompts and collects info on the project to create (name,
// description, etc.)
h5bp.project = function project(cb) {
  var grunt = this.grunt;
  var exists = path.existsSync(path.join(__dirname, 'h5bp/root/index.html'));

  var prompts = 'name description version repository homepage ';
  prompts += 'licenses author_name author_email author_url ';
  prompts += exists ? 'force_update' : '';

  h5bp.prompt(prompts.trim().split(' '), function(err, props) {
    if(/n/i.test(props.force_update) && exists) return cb(null, props);
    var url = 'http://nodeload.github.com/h5bp/html5-boilerplate/tarball/master';
    utils.fetch.call(grunt, url, path.join(__dirname, 'h5bp/root'), function(err) {
      if(err) return cb(err);
      cb(null, props);
    });
  });
};

// **setup** prompts and collects info on the project layout to use,
// default is standard html5-boilerplate project.
h5bp.setup = function setup(cb) {
  h5bp.prompt(['layout'], cb);
};

// **files** prompts and collects info on very specific file rewrites,
// in case the layout entered is the `custom` one.
h5bp.files  = function files(cb) {
  var grunt = this.grunt,
    setup = this.props.setup,
    layout = setup.layout;

  if(/d/i.test(layout)) return cb();

  var prompts = /c/i.test(layout) ? ['css/', 'js/', 'img/'] :
    /s/i.test(layout) ? this.filePrompts() :
    [];

  h5bp.prompt(prompts, cb);
};

// **gruntfile** Inits a new gruntfile, based on built-in init gruntfile
// template, plus specific-to-this-plugin properties. The gruntfile
// generated should be mapping the path that depens on previous prompts
// steps.
h5bp.gruntfile = function(cb) {
  var grunt = this.grunt;
  grunt.helper('prompt', {}, [
    // Prompt for these values.
    {
      name: 'dom',
      message: 'Is the DOM involved in ANY way?',
      default: 'Y/n',
      warning: 'Yes: QUnit unit tests + JSHint "browser" globals. No: Nodeunit unit tests.'
    },
    {
      name: 'min_concat',
      message: 'Will files be concatenated or minified?',
      default: 'Y/n',
      warning: 'Yes: min + concat tasks. No: nothing to see here.'
    },
    {
      name: 'package_json',
      message: 'Will you have a package.json file?',
      default: 'Y/n',
      warning: 'This changes how filenames are determined and banners are generated.'
    },

    {
      name: 'staging',
      message: 'What is the intermediate/ directory for the build script?',
      default: 'intermediate/',
      warning: 'This changes where the files are copied with the mkdirs task.'
    },
    {
      name: 'output',
      message: 'What it is the final build output directory?',
      default: 'publish/',
      warning: 'The final optimized version of your website will be there.'
    },
    {
      name: 'css_dir',
      message: 'What is the CSS directory?',
      default: 'css/',
      warning: 'This is used in the css task, every css files under that directory ' +
        'is concatanated into one file and pass through requirejs optimizer.'
    },
    {
      name: 'js_dir',
      message: 'What is the JS directory?',
      default: 'js/',
      warning: 'This is used in the concat, min and rev task, every js files under that directory ' +
        'is concatanated into one file and compressed via uglifyjs.'
    },
    {
      name: 'img_dir',
      message: 'What is the IMG directory?',
      default: 'img/',
      warning: 'This is used in the rev task.'
    }
  ], function(err, props) {
    props.dom = /y/i.test(props.dom);
    props.min_concat = /y/i.test(props.min_concat);
    props.package_json = /y/i.test(props.package_json);
    props.test_task = props.dom ? 'qunit' : 'test';
    props.file_name = '<%= pkg.name %>';

    // Guess at some directories, if they exist.
    props.test_dir = 'test';

    // jQuery is default in h5bp setup!
    props.jquery = true;

    // normalize some of the dirs path
    props.js_dir = props.js_dir.replace(/\/$/, '');
    props.css_dir = props.css_dir.replace(/\/$/, '');
    props.img_dir = props.img_dir.replace(/\/$/, '');
    props.output = props.output.replace(/\/$/, '');
    props.staging = props.staging.replace(/\/$/, '');

    cb(null, props);
  });
};

// **end** completes the creation process.
h5bp.end = function end(init, props, cb) {
  var grunt = this.grunt;

  // custom renames
  init.renames = h5bp.renames(init, props);

  // Files to copy (and process).
  var files = init.filesToCopy(props);

  // Add properly-named license files.
  init.addLicenseFiles(files, props.licenses);

  // Actually copy (and process) files.
  init.copyAndProcess(files, props);

  // Generate package.json file.
  props.dependencies = {
    'node-build-script': 'http://nodeload.github.com/h5bp/node-build-script/tarball/dev'
  };

  init.writePackageJSON('package.json', props);

  // special copy and process for the gruntfile
  init.copy(path.join(__dirname, 'h5bp/gruntfile.js'), 'grunt.js', {
    process: function(contents) {
      var data = grunt.utils._.extend({}, props, props.gruntfile);
      return grunt.template.process(contents, data, 'init');
    }
  });


  // All done!
  cb();
};


// **customPrompt** is an helper for convenience reading of prompt.txt
// file, configuring defaults grunt prompts for further usage
h5bp.customPrompt = function() {
  var grunt = this.grunt,
    opts = grunt.helper('prompt_for_obj'),
    custom = grunt.file.read(path.join(__dirname, 'h5bp/prompts.txt')).trim(),
    matcher = /^\[\?\]\s?([^\(]+)\(([^\)]+)\)\s*\|\s([\w\d\-_\/]+)/,
    lf = grunt.utils.linefeed;

  var lines = custom.split(grunt.utils.linefeed);

  // if only one line, then most likely someting wrong happend,
  // probably caused by lf issue, fallback to simple `\n` split and
  // see how it goes
  if(lines.length === 1) lines = custom.split(/\n/);

  this.prompts = lines.map(function(line, i) {
    // trim blank line and non [?] prompt like line
    if(!line || !/^\[\?\]/.test(line)) return;

    // return a meaningful object
    var m = (line.match(matcher) || []),
      opt = /\[[A-Z]\]/,
      msg = '',
      ok = false;

    var prompt = {
      message: m[1].trim(),
      default: m[2].trim(),
      name: m[3].trim(),
    };

    if(/^»/.test(lines[i + 1])) {
      // print additional info
      prompt.help = lines.slice(i + 1).filter(function(l) {
        ok = ok || /^\[/.test(l);
        return !ok;
      }).map(function(l) {
        return l.replace(/^»(\s)(\w)/, '$1$2');
      });
    }

    return prompt;
  });

  this.prompts = this.prompts.filter(function(p) {
    return p;
  });

  // actually register these custom prompts to grunt
  this.prompts.forEach(function(prompt) {
    opts[prompt.name] = prompt;
  });
};


// **prompt** convenience wrapper to grunt.helper('prompt')
h5bp.prompt = function(prompts, cb) {
  var grunt = this.grunt;
  if(!prompts || !prompts.length) return cb();
  prompts = prompts.map(function(p) {
    return grunt.helper('prompt_for', p);
  });

  grunt.helper('prompt', prompts, cb);
};

// **filePrompts** builds an array of prompts object, for each files in
// the root repository.
h5bp.filePrompts = function() {
  var root = root = path.join(__dirname, 'h5bp/root'),
    files = this.grunt.file.expandFiles(path.join(root, '**')),
    opts = this.grunt.helper('prompt_for_obj');

  files = files.map(function(f) {
    var name = f.replace(root, '').replace(/^(\/)|(\\)/g, '');
    opts[name] = {
      name: name,
      message: name,
      default: name
    };

    return name;
  });

  return files;
};

// **renames** wrapper to grunt's rename feature, dealing with specific
// directory mappings.
h5bp.renames = function(init, props) {
  var files = props.files || {},
    grunt = this.grunt,
    root = path.join(__dirname, 'h5bp/root/');

  Object.keys(files).forEach(function(file) {
    var dest = files[file],
      ignores = ['none', 'nill', 'nil', 'false', 'null'],
      falsy = !!~ignores.indexOf(dest);

    // handle our ignores values
    if(falsy) files[file] = false;

    // handle directory like name
    if(file.slice(-1) === '/') {
      grunt.file.expandFiles({ dot: true }, path.join(root, file, '**')).forEach(function(filepath) {
        filepath = filepath.replace(root, '').replace(/^(\/)|(\\)/g);
        var dest = files[file];
        dest = dest.slice(-1) === '/' ? dest : dest + '/';
        files[filepath] = filepath.replace(file, dest);
      });
    }
  });

  return this.grunt.utils._.extend({}, init.renames, files);
};
