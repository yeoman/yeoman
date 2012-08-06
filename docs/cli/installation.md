
## Installation

Installing Yeoman in an easy process that should take less than 10 minutes using our quick install
option. We also provide notes on how to perform a more custom installation, should you need to do
this.

### Quick-install

###Step 1: Install me

Open up a terminal and enter in the following:

```sh
$ curl https://raw.github.com/yeoman/yeoman/master/setup/install.sh | sh
```

This will immediately install Yeoman and any dependencies it may need such as Node, NPM and Ruby.

###Step 2: Create a new project

Next, enter in `yeoman init` followed by the name of the directory you would like to scaffold your application in.

```sh
$ yeoman init myapp
```
If a directory isn't supplied, we'll infer a name based on the directory you're in at the moment.

###Step 3: Profit

We'll then ask you some questions to help scaffold your project out. Simple! 


### Manual/Custom Installation

There are two main ways to install, using a "global" or a "local" install.

1. **When installed globally**: Provides a custom global binary named `yeoman`
(or `html5-boilerplate`) which is a wrapper on top of grunt, plus the extra
specific task and helpers.

2. **When installed locally**: ability to load in your project and grunt setup a
set of tasks that get referenced in your gruntfile (`grunt.js`) when run via `grunt`.

yeoman is not on npm (yet), but you can install it (and/or add it to
your project dependencies) using a tarball url, very much like if it was published
on npm.


### global install

```sh
npm install http://nodeload.github.com/yeoman/yeoman/tarball/master -g
```

This installs Yeoman globally, which contains its own internal grunt and
provides a `yeoman` binary.


### local install

This works for system where grunt have been already installed globally with

```sh
npm install grunt -g
```

1. Add yeoman as a project dependency. In your project's root,
next to the `grunt.js` and `package.json` file, run `npm install
http://nodeload.github.com/yeoman/yeoman/tarball/master -S`

2. Add `grunt.loadNpmTasks('yeoman')` into the project's `grunt.js` gruntfile.

3. Run `grunt --help` and all of the yeoman's tasks and helpers
should be available in addition to those already provided by grunt.

The `-S` flag (or `--save`) will make npm add the dependency in the
`dependencies` property of your package.json. This is optional but ensures you
never forget to update your package.json file accordingly.

**Note**: Once on npm, it'll be easier. The `npm install -S` step will add the
following to your package.json file.

```js
"dependencies": {
  "yeoman": "0.1.1"
}
```

Change `0.1.1` to the tarball url: http://nodeload.github.com/yeoman/yeoman/tarball/master

### git clone / npm install

Clone or download this repo. Then, `cd` into it and run the `npm
install` command.

```sh
# will most likely change to map the new location / repo / branch
git clone git://github.com/yeoman/yeoman.git

# install the dependencies
# locally to play with it from the repo
npm install

# or globally, to install the yeoman binary
npm install -g
```

For development, the `npm link` command might be handy (posix only, instead of
`npm install -g`).



## Uninstall

You may want to uninstall the globally installed package by running the
following command:

```sh
npm uninstall yeoman -g
```

So sad to see you go ☹

If it was installed locally, next to your gruntfile, simply drop the
`node_modules/yeoman` folder.