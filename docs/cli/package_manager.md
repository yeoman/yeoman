#@ Package Manager

Until now, client-side JavaScript has not benefited from a rich package management solution such as those found in other platforms (e.g NPM, RubyGems). By instead maintaining packages of packages in client-side JS, developers reduced the chances of using up-to-date versions of libraries.

Yeoman's integration with Twitter Nest changes that.

In Nest, dependencies are listed in a ‘package.json’ file, similar to Node’s package (adhering as closely as possible to the [commonjs specification](http://wiki.commonjs.org/wiki/Packages/1.0)):

```json
 {
   "dependencies": {
     "modernizr": "~2.5.3"
   }
 }
 ```

Dependencies are then installed locally via the `yeoman install’ command. First they're resolved to find conflicts, then downloaded and unpacked in a local sub dir (browser_modules) to package.json, for example:

```
/package.json
/browser_modules/modernizr/index.js
/browser_modules/modernizr/package.json
```

This approach has a number of benefits.

* There are no system wide dependencies and no dependencies are shared between different applications
* None of this is JavaScript specific. Packages can contain JavaScript, CSS, images etc
* None of this is specific to a specific module format (e.g AMD/CommonJS). These formats can be used but aren't required
* The dependency tree is flat meaning that we don't ship multiple versions of say, Modernizr to clients

For information on how to use Yeoman's Nest integration, see `yeoman install` and `yeoman update`