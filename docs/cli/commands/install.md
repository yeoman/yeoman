

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

`yeoman install` also supports installing packages using more than just the package name. Namely:

```shell
bower install jquery
bower install git://github.com/maccman/package-jquery.git
bower install http://code.jquery.com/jquery-1.7.2.js
bower install ./repos/jquery
```

## Available Packages

Currently available packages:

* **backbone** *git://github.com/paulirish/package-backbone.git*
* **jquery-ui** *git://github.com/maccman/package-jquery-ui.git*
* **jquery** *git://github.com/maccman/package-jquery.git*
* **knockout** *git://github.com/SteveSanderson/knockout.git*
* **modernizr** *git://github.com/josh/package-modernizr.git*
* **spine** *git://github.com/maccman/spine.git*
* **underscore** *git://github.com/paulirish/package-underscore.git*

For further information, see the section on the package manager.
