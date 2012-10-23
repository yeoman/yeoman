
var fs = require('fs'),
  path = require('path');

//
// ### Usemin

// Replaces references to non-optimized scripts or stylesheets
// into a set of HTML files (or any templates/views).
//
// The users markup should be considered the primary source of information
// for paths, references to assets which should be optimized.We also check
// against files present in the relevant directory () (e.g checking against
// the revved filename into the 'temp/') directory to find the SHA
// that was generated.
//
// Todos:
// * Use a file dictionary during build process and rev task to
// store each optimized assets and their associated sha1.
// * Update usemin-handler to follow @necolas proposed structure
//
// Thx to @krzychukula for the new, super handy replace helper.
//
// #### Usemin-handler
//
// A special task which uses the build block HTML comments in markup to
// get back the list of files to handle, and initialize the grunt configuration
// appropriately, and automatically.
//
// Custom HTML "block" comments are provided as an API for interacting with the
// build script. These comments adhere to the following pattern:
//
//     <!-- build:<type> <path> -->
//       ... HTML Markup, list of script / link tags.
//     <!-- endbuild -->
//
// - type: is either js or css.
// - path: is the file path of the optimized file, the target output.
//
// An example of this in completed form can be seen below:
//
//    <!-- build:js js/app.js -->
//      <script src="js/app.js"></script>
//      <script src="js/controllers/thing-controller.js"></script>
//      <script src="js/models/thing-model.js"></script>
//      <script src="js/views/thing-view.js"></script>
//    <!-- endbuild -->
//
//
// Internally, the task parses your HTML markup to find each of these blocks, and
// initializes for you the corresponding Grunt config for the concat / min tasks
// when `type=js`, the concat / css tasks when `type=css`.
//
// The task also handles use of RequireJS, for the scenario where you specify
// the main entry point for your application using the "data-main" attribute
// as follows:
//
//     <!-- build:js js/app.min.js -->
//     <script data-main="js/main" src="js/vendor/require.js"></script>
//     <!-- -->
//
// One doesn't need to specify a concat/min/css or rjs configuration anymore.
//
// Inspired by previous work in https://gist.github.com/3024891
// For related sample, see: cli/test/tasks/usemin-handler/index.html
//


//
// Helpers: todo, register as grunt helper
//

// start build pattern --> <!-- build:[target] output -->
var regbuild = /<!--\s*build:(\w+)\s*(.+)\s*-->/;

// end build pattern -- <!-- endbuild -->
var regend = /<!--\s*endbuild\s*-->/;


//
// Returns an hash object of all the directives for the given html. Results is
// of the following form:
//
//     {
//        'css/site.css ':[
//          '  <!-- build:css css/site.css -->',
//          '  <link rel="stylesheet" href="css/style.css">',
//          '  <!-- endbuild -->'
//        ],
//        'js/head.js ': [
//          '  <!-- build:js js/head.js -->',
//          '  <script src="js/libs/modernizr-2.5.3.min.js"></script>',
//          '  <!-- endbuild -->'
//        ],
//        'js/site.js ': [
//          '  <!-- build:js js/site.js -->',
//          '  <script src="js/plugins.js"></script>',
//          '  <script src="js/script.js"></script>',
//          '  <!-- endbuild -->'
//        ]
//     }
//
function getBlocks(body) {
  var lines = body.replace(/\r\n/g, '\n').split(/\n/),
    block = false,
    sections = {},
    last;

  lines.forEach(function(l) {
    var build = l.match(regbuild),
      endbuild = regend.test(l);

    if(build) {
      block = true;
      sections[[build[1], build[2].trim()].join(':')] = last = [];
    }

    // switch back block flag when endbuild
    if(block && endbuild) {
      last.push(l);
      block = false;
    }

    if(block && last) {
      last.push(l);
    }
  });

// Todo: Change to match @necolas suggested structure for the usemin blocks.
// {
//   type: 'css',
//   dest: 'css/site.css',
//   src: [
//     'css/normalize.css',
//     'css/main.css'
//   ],
//   raw: [
//     '    <!-- build:css css/site.css -->',
//     '    <link rel="stylesheet" href="css/normalize.css">',
//     '    <link rel="stylesheet" href="css/main.css">',
//     '    <!-- endbuild -->'
//   ]
// }

  return sections;
}


module.exports = function(grunt) {

  grunt.registerMultiTask('usemin', 'Replaces references to non-minified scripts / stylesheets', function() {

    var name = this.target,
      data = this.data,
      files = grunt.file.expand(data);

    files.map(grunt.file.read).forEach(function(content, i) {
      var p = files[i];

      grunt.log.subhead('usemin:' + name + ' - ' + p);

      // make sure to convert back into utf8, `file.read` when used as a
      // forEach handler will take additional arguments, and thus trigger the
      // raw buffer read
      content = content.toString();

      // ext-specific directives handling and replacement of blocks
      if(!!grunt.task._helpers['usemin:pre:' + name]) {
        content = grunt.helper('usemin:pre:' + name, content);
      }

      // actual replacement of revved assets
      if(!!grunt.task._helpers['usemin:post:' + name]) {
        content = grunt.helper('usemin:post:' + name, content);
      }

      // write the new content to disk
      grunt.file.write(p, content);
    });

  });

  grunt.registerMultiTask('usemin-handler', 'Using HTML markup as the primary source of information', function() {
    // collect files
    var files = grunt.file.expandFiles(this.data);

    // concat / min / css / rjs config
    var concat = grunt.config('concat') || {},
      min = grunt.config('min') || {},
      css = grunt.config('css') || {},
      rjs = grunt.config('rjs') || {};

    grunt.log
      .writeln('Going through ' + grunt.log.wordlist(files) + ' to update the config')
      .writeln('looking for build script HTML comment blocks');

    files = files.map(function(filepath) {
      return {
        path: filepath,
        body: grunt.file.read(filepath)
      };
    });

    files.forEach(function(file) {
      var blocks = getBlocks(file.body);
      Object.keys(blocks).forEach(function(dest) {
        var lines = blocks[dest].slice(1, -1),
          parts = dest.split(':'),
          type = parts[0],
          output = parts[1];
        // Handle absolute path (i.e. with respect to th eserver root)
        if (output[0] === '/') {
          output = output.substr(1);
        }

        // parse out the list of assets to handle, and update the grunt config accordingly
        var assets = lines.map(function(tag) {
          var asset = (tag.match(/(href|src)=["']([^'"]+)["']/) || [])[2];

          // RequireJS uses a data-main attribute on the script tag to tell it
          // to load up the main entry point of the amp app
          //
          // First time we findd one, we update the name / mainConfigFile
          // values. If a name of mainConfigFile value are already set, we skip
          // it, so only one match should happen and default config name in
          // original Gruntfile is used if any.
          var main = tag.match(/data-main=['"]([^'"]+)['"]/);
          if(main) {
            rjs.out = rjs.out || output;
            rjs.name = rjs.name || main[1];
            asset += ',' + output;
          }

          return asset;
        }).reduce(function(a, b) {
          b = ( b ? b.split(',') : '');
          return a.concat(b);
        }, []);

        grunt.log.subhead('Found a block:')
          .writeln(grunt.log.wordlist(lines, { separator: '\n' }))
          .writeln('Updating config with the following assets:')
          .writeln('    - ' + grunt.log.wordlist(assets, { separator: '\n    - ' }));

        // update concat config for this block
        concat[output] = assets;
        grunt.config('concat', concat);

        // update rjs config as well, as during path lookup we might have
        // updated it on data-main attribute
        grunt.config('rjs', rjs);

        // min config, only for js type block
        if(type === 'js') {
          min[output] = output;
          grunt.config('min', min);
        }

        // css config, only for css type block
        if(type === 'css') {
          css[output] = output;
          grunt.config('css', css);
        }
      });
    });

    // log a bit what was added to config
    grunt.log.subhead('Configuration is now:')
      .subhead('  css:')
      .writeln('  ' + grunt.helper('inspect', css))
      .subhead('  concat:')
      .writeln('  ' + grunt.helper('inspect', concat))
      .subhead('  min:')
      .writeln('  ' + grunt.helper('inspect', min))
      .subhead('  rjs:')
      .writeln('  ' + grunt.helper('inspect', rjs));

  });

  // Helpers
  // -------

  // usemin:pre:* are used to preprocess files with the blocks and directives
  // before going through the global replace
  grunt.registerHelper('usemin:pre:html', function(content) {
    // XXX extension-specific for get blocks too.
    //
    // Eg. for each predefined extensions directives may vary. eg <!--
    // directive --> for html, /** directive **/ for css
    var blocks = getBlocks(content);

    // Determine the linefeed from the content
    var linefeed = /\r\n/g.test(content) ? '\r\n' : '\n';

    // handle blocks
    Object.keys(blocks).forEach(function(key) {
      var block = blocks[key].join(linefeed),
        parts = key.split(':'),
        type = parts[0],
        target = parts[1];

      content = grunt.helper('usemin', content, block, target, type);
    });

    return content;
  });

  // usemin and usemin:* are used with the blocks parsed from directives
  grunt.registerHelper('usemin', function(content, block, target, type) {
    target = target || 'replace';
    return grunt.helper('usemin:' + type, content, block, target);
  });

  grunt.registerHelper('usemin:css', function(content, block, target) {
    var linefeed = /\r\n/g.test(content) ? '\r\n' : '\n';
    var indent = (block.split(linefeed)[0].match(/^\s*/) || [])[0];
    return content.replace(block, indent + '<link rel="stylesheet" href="' + target + '"\/>');
  });

  grunt.registerHelper('usemin:js', function(content, block, target) {
    var linefeed = /\r\n/g.test(content) ? '\r\n' : '\n';
    var indent = (block.split(linefeed)[0].match(/^\s*/) || [])[0];
    return content.replace(block, indent + '<script src="' + target + '"></script>');
  });

  grunt.registerHelper('usemin:post:css', function(content) {
    grunt.log.writeln('Update the CSS with new img filenames');
    content = grunt.helper('replace', content, /url\(\s*['"]([^"']+)["']\s*\)/gm);
    return content;
  });

  // usemin:post:* are the global replace handlers, they delegate the regexp
  // replace to the replace helper.
  grunt.registerHelper('usemin:post:html', function(content) {
    grunt.log.verbose.writeln('Update the HTML to reference our concat/min/revved script files');
    content = grunt.helper('replace', content, /<script.+src=['"](.+)["'][\/>]?><[\\]?\/script>/gm);

    grunt.log.verbose.writeln('Update the HTML with the new css filenames');
    content = grunt.helper('replace', content, /<link[^\>]+href=['"]([^"']+)["']/gm);

    grunt.log.verbose.writeln('Update the HTML with the new img filenames');
    content = grunt.helper('replace', content, /<img[^\>]+src=['"]([^"']+)["']/gm);

    grunt.log.verbose.writeln('Update the HTML with background imgs, case there is some inline style');
    content = grunt.helper('replace', content, /url\(\s*['"]([^"']+)["']\s*\)/gm);

    grunt.log.verbose.writeln('Update the HTML with anchors images');
    content = grunt.helper('replace', content, /<a[^\>]+href=['"]([^"']+)["']/gm);

    return content;
  });

  grunt.registerHelper('usemin:post:css', function(content) {

    grunt.log.verbose.writeln('Update the CSS with background imgs, case there is some inline style');
    content = grunt.helper('replace', content, /url\(\s*['"]?([^'"\)]+)['"]?\s*\)/gm);

    return content;
  });

  //
  // global replace handler, takes a file content a regexp to macth with. The
  // regexp should capture the assets relative filepath, it is then compared to
  // the list of files on the filesystem to guess the actual revision of a file
  //
  grunt.registerHelper('replace', function(content, regexp) {
    return content.replace(regexp, function(match, src) {
      //do not touch external files or the root
      if ( src.match(/\/\//) || src.match(/^\/$/)) {
        return match;
      }

      // Consider reference from site root
      if ( src.match(/^\//) ) {
        src = src.substr(1);
      }

      var basename = path.basename(src);
      var dirname = path.dirname(src);

      // XXX files won't change, the filepath should filter the original list
      // of cached files (we need to treat the filename collision -- i.e. 2 files with same names
      // in different subdirectories)
      var filepaths = grunt.file.expand(path.join('**/*') + basename);
      var filepath = filepaths.filter(function(f) { return dirname === path.dirname(f);})[0];

      // not a file in temp, skip it
      if ( !filepath ) {
        return match;
      }
      var filename = path.basename(filepath);
      // handle the relative prefix (with always unix like path even on win32)
      filename = [dirname, filename].join('/');

      // if file not exists probaly was concatenated into another file so skip it
      if ( !filename ) {
        return '';
      }

      var res = match.replace(src, filename);
      // output some verbose info on what get replaced
      grunt.log
        .ok(src)
        .writeln('was ' + match)
        .writeln('now ' + res);

      return res;
    });
  });
};
