## install

Usage: `yeoman install <dep>`, `yeoman install <dep1> <dep2>`

Installs a package <name> and any packages that this depends on using Twitter Bower. A package is a folder containing a resource described by a package.json file or a gzipped tarball containing this information.  

Running yeoman install <name> will install the dependencies in your projects browser_modules folder. 

Example:

```shell
yeoman install jquery
yeoman install jquery spine
```

For further information, see the section on the package manager.