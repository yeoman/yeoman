## install

Usage: `yeoman install <packageName>`, `yeoman install <package1> <package2>`

Installs a package <name> and any packages that this depends on using Twitter Bower. A package is a folder containing a resource described by a package.json file or a gzipped tarball containing this information.  

Running yeoman install <name> will install the dependencies in your projects browser_modules folder. 

Example:

```shell
yeoman install jquery
yeoman install jquery spine
```

If installing a dependency which has its own dependencies described, these dependencies will also be pulled in. 

Example:

```shell
yeoman install backbone
```

will actually also install Underscore.js and jQuery.js as these are required for Backbone to function correctly.

For further information, see the section on the package manager.