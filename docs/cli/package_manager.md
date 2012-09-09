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

Dependencies are then installed locally via the `yeoman install’ command. First they're resolved to find conflicts, then downloaded and unpacked in a local sub dir called components:

```shell
/component.json
/components/modernizr/index.js
/components/modernizr/modernizr.js
```

This approach has a number of benefits.

* There are no system wide dependencies and no dependencies are shared between different applications
* None of this is JavaScript specific. Packages can contain JavaScript, CSS, images etc
* None of this is specific to a specific module format (e.g AMD/CommonJS). These formats can be used but aren't required
* The dependency tree is flat meaning that we don't ship multiple versions of say, Modernizr to clients


The easiest approach is to use a Bower package statically is to then just reference the package manually from a script tag:

```shell
&lt;script src="components/modernizr/modernizr.js"&gt;&lt;/script&gt;
```

Similar to NPM, our Bower integration also allows users to easily search for and update packages easily. e.g

To search for a package:

```shell
yeoman search jquery
```

To install a package:

```shell
yeoman install jquery
```

To update a package, you need to reference it by name:

```shell
yeoman update jquery
```

To list installed packages:

```shell
yeoman list
```

and so on.

For more information on how to use Yeoman's Bower integration, please see our relevant command-line docs.


##What distinguishes Bower from Jam, Volo or Ender? What does it do better?

It's easiest to think of Bower as a lower level component then Jam, Volo, or Ender.

All Bower really does is install git paths, resolves dependencies from a component.json, checks versions, and then provides api which tells you what it did.

The major diversion from past attempts at package management in the front-end, is that Bower is working under the assumption that there is a single, common problem in frontend application development which needs to be solved: resolving dependencies and managing components. Unfortunately, most other attempts tried to tackle this problem in such a way that it ends up alienating communities which develop using different transports (sprockets, commonjs, requirejs, regular script tags).

For example, someone developing with sprockets, can't use volo packages, can't use jam packages, and so forth.

Bower is trying to solve the common problem, in an unopinionated way, and leave the opinions your build stack.

What's more, things like Ender can and will consume bower as a dependency for simple git installation and use the package api to build a commonjs style require api include for the browser.

Jam or Volo could do the same thing for amd if they were interested.

##Volo is an arguably more established project and works with the GitHub search API. Will it take long for Bower to contain a decent number of packages?

Of all the projects, Ender is objectively the most popular - with nearly 1000 more watchers than volo – and is used at major companies like twitter, disqus, etc.

Bower by definition has every single package that volo does (git packages) and more - it actually works on internal networks and other git repositories not hosted on github.

##We recently saw what happened when the NPM registry completely went down. Is a central point of failure possible for Bower and if so, do you have redundancy planned?

There's no redundancy planned at the moment, as Bower just installs git urls. It's up to the url provider to establish redundancy.

##Isn't having a package.json file going to conflict with my npm's package.json? Will this be a problem?

Don't use a package.json – user component.json.

##Bower is an open-source Twitter project. How well can we expect it to be maintained in the future?

Twitter has a pretty good track record with there open source projects thus far, and has an entire engineer pool to work on it. Another good thing we can say is that Twitter.com is moving it's frontend architecture onto Bower, so it's fairly safe to say it will be maintained.

