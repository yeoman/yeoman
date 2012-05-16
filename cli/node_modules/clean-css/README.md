## What is clean-css? ##

Clean-css is a node.js library for minifying CSS files. It does the same job as YUI Compressor's CSS minifier but much faster thanks to speed of node.js V8 engine.

## Usage ##

### What are the requirements? ###

    node 0.4.0+

### How to install clean-css? ###

    npm install clean-css

### How to use clean-css? ###

You can minify one file **public.css** into **public-min.css** via:

    cleancss -o public-min.css public.css
    
To minify the same **public.css** into standard output skip the -o parameter:

    cleancss public.css

Or more likely you would like to do something like this:

    cat one.css two.css three.css | cleancss -o merged-and-minified.css
    
Or even gzip it at once:

    cat one.css two.css three.css | cleancss | gzip -9 -c > merged-minified-and-gzipped.css.gz

### How to use clean-css programatically? ###

    var cleanCSS = require('clean-css');
    
    var source = "a{font-weight:bold;}";
    var minimized = cleanCSS.process(source);

### How to run clean-css tests? ###

You need vows testing framework (npm install vows) then simply run:

    make test

## License ##

Clean-css is released under the MIT license.