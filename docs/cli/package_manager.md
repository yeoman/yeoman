# Package Manager

Until now, client-side JavaScript has not benefited from a rich package management solution such as those found in other platforms (e.g NPM, RubyGems). By instead maintaining packages of packages in client-side JS, developers reduced the chances of using up-to-date versions of libraries.

Yeoman's integration with [Twitter Bower](http://github.com/twitter/bower) changes that.

In Bower, dependencies are listed in a ‘component.json’ file, similar to Node’s package.json or the Ruby Gemfile. This is useful for locking down the dependencies a project has.

```json
{
  "name": "myProject",
  "version": "1.0.0",
  "dependencies": {
    "modernizr": "~2.6.1"
  }
}
```

Dependencies are then installed locally via the `yeoman install’ command. First they're resolved to find conflicts, then downloaded and unpacked in a local sub dir (browser_modules) to component.json, for example:

```shell
/package.json
/browser_modules/modernizr/index.js
/browser_modules/modernizr/component.json
```

This approach has a number of benefits.

* There are no system wide dependencies and no dependencies are shared between different applications
* None of this is JavaScript specific. Packages can contain JavaScript, CSS, images etc
* None of this is specific to a specific module format (e.g AMD/CommonJS). These formats can be used but aren't required
* The dependency tree is flat meaning that we don't ship multiple versions of say, Modernizr to clients


The easiest approach is to use a Bower package statically is to then just reference the package manually from a script tag:

```shell
&lt;script src="components/jquery/index.js"&gt;&lt;/script&gt;
```

Similar to NPM, our Bower integration also allows users to easily search for and update packages easily. e.g

To search for a package:

```shell
bower search jquery
```

To update a package, you need to reference it by name:

```shell
bower update jquery
```

To list installed packages:

```shell
bower list
```

To search for packages:

```shell
bower search packageName
```

and so on.

For more information on how to use Yeoman's Bower integration, please see our relevant command docs below:

* [install](https://github.com/yeoman/yeoman/blob/master/docs/cli/install.md)
* [update](https://github.com/yeoman/yeoman/blob/master/docs/cli/update.md)
* [search](https://github.com/yeoman/yeoman/blob/master/docs/cli/search.md)
* [list](https://github.com/yeoman/yeoman/blob/master/docs/cli/list.md)
* [lookup](https://github.com/yeoman/yeoman/blob/master/docs/cli/lookup.md)
