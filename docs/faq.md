# FREQUENTLY ASKED QUESTIONS


### What are the goals of the project?

The short-term goals for Yeoman are to provide developers with an improved tooling workflow so that they can spend less time on process and more time focusing on building beautiful web applications. Initially, we hope to make it as easy as possible to work with existing frameworks and tools developers are used to using.

Long-term, the project may also assist developers with creating applications using modern technologies such as Web Components.

### What is a command-line interface?

A command-line interface is a means for developers to interact with a system using text commands. On OSX this this is often done using the Terminal and on Windows we use the command shell or a third-party tool such as [Cygwin](http://www.cygwin.com).


### What is a package manager?

A package manager runs through a command-line interface and is a tool for automating the process of installing, upgrading, configuring and managing dependencies for projects. An example of a package management registry is NPM.


### How does Yeoman differ from Grunt?

Yeoman builds upon a number of open-source tools to offer an opinionated workflow that helps developers achieve common tasks more easily.[Grunt.js](http://gruntjs.com) is one of these tools and powers our underlying build process and task plugin architecture. 

On top of this architecture, we've highly customized tasks, profiles and systems which work well together and also provide developers with features like our generator system and Twitter Bower integration. Yeoman takes care of configuring your Gruntfile and setup to support Sass, CoffeeScript and Require.js/r.js out of the box. With additional features like wiring, an improved `server` and `init`, we like to think of ourselves as a helper project on top of Grunt.

Developers are free to continue using any Grunt tasks with Yeoman and there should remain a good level of cross-tool task compatibility.

### How does Yeoman differ from tools like Brunch or BBB?

We love tools like Brunch and Grunt-BBB and feel that they offer a great solution for developers wishing to scaffold with frameworks like Backbone.js and Ember. With the Yeoman generator system, as we've ported over the Rails Generator system to work with Node, we feel we have an interesting opportunity to take application scaffolding in a new direction - one where it's easier for any developer to write scaffolds, support multiple testing frameworks, capture their own boilerplates and easily re-use them and so on. 

### How do I register or unregister a package on Bower?

Packages can be registered on Bower using the `register` command. e.g `bower register myawesomepackagename git://github.com/youraccount/yourrepo`. We recommend reading the Bower [documentation](https://github.com/twitter/bower) before doing this to ensure that your repo includes the necessary files to supporting being `install`ed.



### Will the project be providing Generators for popular frameworks?

Our goal is to facilitate both developers and the community with the tools needed to create rich web applications easily. With that goal in mind, we'll be providing a great API (and docs) to our Generators system with examples of how to implement samples, but will rely on the community to create and maintain Generators for popular frameworks. This will allow us to focus on making Yeoman better without he distractions of maintaining a large number of Generators.


### What license is Yeoman released under?

Yeoman is released under a [BSD](http://opensource.org/licenses/bsd-license.php/) license.

### What should I do before submitting an issue through GitHub?

Thanks for your interest in submitting an issue. In order for us to help you please check that you've completed the following steps:

* Made sure you're on the latest version
* Read our documentation and [README](https://github.com/yeoman/yeoman/blob/master/readme.md) to ensure the issue hasn't been noted or solved already
* Used the search feature to ensure that the bug hasn't been reported before
* Included as much information about the bug as possible, including any output you've received, what OS and version you're on. 
* Shared the output from `echo $PATH $NODE_PATH` and `brew doctor` as this can also help track down the issue.

Issues can be submitted via the [issues tab](https://github.com/yeoman/yeoman/issues) on our GitHub repo.




 is working under the assumption that there is a single, common problem in frontend application development which needs to be solved: resolving dependencies and managing components. Unfortunately, most other attempts tried to tackle this problem in such a way that it ends up alienating communities which develop using different transports (sprockets, commonjs, requirejs, regular script tags).

For example, someone developing with sprockets, can't use volo packages, can't use jam packages, and so forth.

Bower is trying to solve the common problem, in an unopinionated way, and leave the opinions your build stack.

What's more, things like Ender can and will consume bower as a dependency for simple git installation and use the package api to build a commonjs style require api include for the browser.

Jam or Volo could do the same thing for amd if they were interested.

####Volo is an arguably more established project and works with the GitHub search API. Will it take long for Bower to contain a decent number of packages?

Of all the projects, Ender is objectively the most popular - with nearly 1000 more watchers than volo – and is used at major companies like twitter, disqus, etc.

Bower by definition has every single package that volo does (git packages) and more - it actually works on internal networks and other git repositories not hosted on github.

####We recently saw what happened when the NPM registry completely went down. Is a central point of failure possible for Bower and if so, do you have redundancy planned?

There's no redundancy planned at the moment, as Bower just installs git urls. It's up to the url provider to establish redundancy.

####Isn't having a package.json file going to conflict with my npm's package.json? Will this be a problem?

Don't use a package.json – user component.json.

####Bower is an open-source Twitter project. How well can we expect it to be maintained in the future?

Twitter has a pretty good track record with their open source projects thus far, and has an entire engineer pool to work on it. Another good thing we can say is that Twitter.com is moving it's frontend architecture onto Bower, so it's fairly safe to say it will be maintained.

