yeoman-stylus(1) -- Specifics of yeoman's Stylus integration.
===============================================================

## DESCRIPTION

This document describes the way to enable Stylus stylesheets compilation.
You need to add a dependency to `grunt-contrib-stylus` in package.json.

## Gruntfile.js

Add the following at the beginning of the file:

````
grunt.loadNpmTasks('grunt-contrib-stylus'); 
grunt.task.registerTask('css:compile', ['stylus']);
````

Add a stylus section like this (see `grunt-contrib-stylus` for more details):

```
stylus: {
  compile: {
    options: {
      compress: true,
      paths: []
    },
    files: {
      'app/styles/*.css': ['app/styles/*.styl']
    }
  }
},
```

You may also add `.styl` extension in the livereload section.

## SEE ALSO

* yeoman-faq(1)
