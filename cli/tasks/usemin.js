
var fs = require('fs'),
  path = require('path');

//
// ### Usemin Task
//
// Replaces references ton non-optimized scripts / stylesheets into a
// set of html files (or any template / views).
//
// Right now the replacement is based on the filename parsed from
// content and the files present in accoding dir (eg. looking up
// matching revved filename into `intermediate/` dir to know the sha
// generated).
//
// Todo: Use a file dictionary during build process and rev task to
// store each optimized assets and their associated sha1.
//
// Thx to @krzychukula for the new, super handy replace helper.
//

module.exports = function(grunt) {

  var linefeed = grunt.util.linefeed;

  grunt.registerMultiTask('usemin', 'Replaces references to non-minified scripts / stylesheets', function() {

    var name = this.target,
      data = this.data,
      files = grunt.file.expand(data);

    files.map(grunt.file.read).forEach(function(content, i) {
      var p = files[i];

      // get extension and trigger corresponding helpers
      var ext = path.extname(p).slice(1);

      grunt.log.subhead('usemin - ' + p);

      // make sure to convert back into utf8, `file.read` when used as a
      // forEach handler will take additional arguments, and thus trigger the
      // raw buffer read
      content = content.toString();

      // ext-specific directives handling and replacement of blocks
      if(!!grunt.task._helpers['usemin:pre:' + ext]) {
        content = grunt.helper('usemin:pre:' + ext, content);
      }

      // actual replacement of revved assets
      if(!!grunt.task._helpers['usemin:post:' + ext]) {
        content = grunt.helper('usemin:post:' + ext, content);
      }

      // write the new content to disk
      grunt.file.write(p, content);
    });

  });

  // usemin:pre:* are used to preprocess files with the blocks and directives
  // before going through the global replace
  grunt.registerHelper('usemin:pre:html', function(content) {
    // XXX extension-specific for get blocks too.
    //
    // Eg. for each predefined extensions directives may vary. eg <!--
    // directive --> for html, /** directive **/ for css
    var blocks = getBlocks(content);

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
    var indent = (block.split(linefeed)[0].match(/^\s*/) || [])[0];
    return content.replace(block, indent + '<link rel="stylesheet" href="' + target + '">');
  });

  grunt.registerHelper('usemin:js', function(content, block, target) {
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
    content = grunt.helper('replace', content, /<link rel=["']?stylesheet["']?\shref=['"](.+)["']\s*>/gm);

    grunt.log.verbose.writeln('Update the HTML with the new img filenames');
    content = grunt.helper('replace', content, /<img[^\>]+src=['"]([^"']+)["']/gm);

    grunt.log.verbose.writeln('Update the HTML with background imgs, case there is some inline style');
    content = grunt.helper('replace', content, /url\(\s*['"]([^"']+)["']\s*\)/gm);

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
      //do not touch external files
      if(src.match(/\/\//)) return match;
      var basename = path.basename(src);
      var dirname = path.dirname(src);

      // XXX files won't change, the filepath should filter the original list
      // of cached files.
      var filepath = grunt.file.expand(path.join('**/*') + basename)[0];

      // not a file in intermediate, skip it
      if(!filepath) return match;
      var filename = path.basename(filepath);
      // handle the relative prefix (with always unix like path even on win32)
      filename = [dirname, filename].join('/');

      // if file not exists probaly was concatenated into another file so skip it
      if(!filename) return '';

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

  return sections;
}
