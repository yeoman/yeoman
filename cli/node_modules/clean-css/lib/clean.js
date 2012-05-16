var util = require('util');

var CleanCSS = {
  colors: {
    white: '#fff',
    black: '#000',
    fuchsia: '#f0f',
    yellow: '#ff0'
  },
  
  process: function(data) {
    var specialComments = [],
      contentBlocks = [];

    // replace function
    var replace = function(pattern, replacement) {
      if (true) {
        data = data.replace(pattern, replacement);
      } else { // for debugging purposes only
        var start = new Date().getTime();
        data = data.replace(pattern, replacement);
        var end = new Date().getTime();
      
        if (end > start)
          util.print(pattern + ' -> ' + (end - start) + ' milliseconds\n');
      }
    };
    
    // strip comments one by one
    for (var end = 0; end < data.length; ) {
      var start = data.indexOf('/*', end);
      end = data.indexOf('*/', start);
      if (start == -1 || end == -1) break;
      
      if (data[start + 2] == '!') {
        // in case of special comments, replace them with a placeholder
        specialComments.push(data.substring(start, end + 2));
        data = data.substring(0, start) + '__CSSCOMMENT__' + data.substring(end + 2);
      } else {
        data = data.substring(0, start) + data.substring(end + 2);
      }
      end = start;
    }
    
    // replace content: with a placeholder
    for (var end = 0; end < data.length; ) {
      var start = data.indexOf('content', end);
      if (start == -1) break;
      
      var wrapper = /[^ :]/.exec(data.substring(start + 7))[0];
      if (/['"]/.test(wrapper) == false) {
        end = start + 7;
        continue;
      }

      var firstIndex = data.indexOf(wrapper, start);
      var lastIndex = data.indexOf(wrapper, firstIndex + 1);
      
      contentBlocks.push(data.substring(firstIndex, lastIndex + 1));
      data = data.substring(0, firstIndex) + '__CSSCONTENT__' + data.substring(lastIndex + 1);
      end = lastIndex + 1;
    }
    
    replace(/;\s*;+/g, ';') // whitespace between semicolons & multiple semicolons
    replace(/\n/g, '') // line breaks
    replace(/\s+/g, ' ') // multiple whitespace
    replace(/ !important/g, '!important') // whitespace before !important
    replace(/[ ]?,[ ]?/g, ',') // space with a comma
    replace(/progid:[^(]+\(([^\)]+)/g, function(match, contents) { // restore spaces inside IE filters (IE 7 issue)
      return match.replace(/,/g, ', ');
    })
    replace(/ ([+~>]) /g, '$1') // replace spaces around selectors
    replace(/\{([^}]+)\}/g, function(match, contents) { // whitespace inside content
      return '{' + contents.trim().replace(/(\s*)([;:=\s])(\s*)/g, '$2') + '}';
    })
    replace(/;}/g, '}') // trailing semicolons
    replace(/rgb\s*\(([^\)]+)\)/g, function(match, color) { // rgb to hex colors
      var parts = color.split(',');
      var encoded = '#';
      for (var i = 0; i < 3; i++) {
        var asHex = parseInt(parts[i], 10).toString(16);
        encoded += asHex.length == 1 ? '0' + asHex : asHex;
      }
      return encoded;
    })
    replace(/([^"'=\s])\s*#([0-9a-f]{6})/gi, function(match, prefix, color) { // long hex to short hex
      if (color[0] == color[1] && color[2] == color[3] && color[4] == color[5])
        return (prefix + (/:$/.test(prefix) ? '' : ' ')) + '#' + color[0] + color[2] + color[4];
      else
        return (prefix + (/:$/.test(prefix) ? '' : ' ')) + '#' + color;
    })
    replace(/(color|background):(\w+)/g, function(match, property, colorName) { // replace standard colors with hex values (only if color name is longer then hex value)
      if (CleanCSS.colors[colorName]) return property + ':' + CleanCSS.colors[colorName];
      else return match;
    })
    replace(/([: ,\(])#f00/g, '$1red') // replace #f00 with red as it's shorter
    replace(/font\-weight:(\w+)/g, function(match, weight) { // replace font weight with numerical value
      if (weight == 'normal') return 'font-weight:400';
      else if (weight == 'bold') return 'font-weight:700';
      else return match;
    })
    replace(/progid:DXImageTransform\.Microsoft\.(Alpha|Chroma)(\([^\)]+\))([;}'"])/g, function(match, filter, args, suffix) { // IE shorter filters but only if single (IE 7 issue)
      return filter.toLowerCase() + args + suffix;
    })
    replace(/(\s|:)0(px|em|ex|cm|mm|in|pt|pc|%)/g, '$1' + '0') // zero + unit to zero
    replace(/(border|border-top|border-right|border-bottom|border-left|outline):none/g, '$1:0') // none to 0
    replace(/(background):none([;}])/g, '$1:0$2') // background:none to 0
    replace(/0 0 0 0([^\.])/g, '0$1') // multiple zeros into one
    replace(/([: ,=\-])0\.(\d)/g, '$1.$2')
    replace(/[^\}]+{(;)*}/g, '') // empty elements
    if (data.indexOf('charset') > 0) replace(/(.+)(@charset [^;]+;)/, '$2$1') // move first charset to the beginning
    replace(/(.)(@charset [^;]+;)/g, '$1') // remove all extra charsets that are not at the beginning
    replace(/\*([\.#:\[])/g, '$1') // remove universal selector when not needed (*#id, *.class etc)
    replace(/ {/g, '{') // whitespace before definition
    replace(/\} /g, '}') // whitespace after definition
    
    // Get the special comments, content content, and spaces inside calc back
    replace(/calc\([^\}]+\}/g, function(match) {
      return match.replace(/\+/g, ' + ');
    });
    replace(/__CSSCOMMENT__/g, function() { return specialComments.shift(); });
    replace(/__CSSCONTENT__/g, function() { return contentBlocks.shift(); });
    
    return data.trim() // trim spaces at beginning and end
  }
};

module.exports = CleanCSS;
