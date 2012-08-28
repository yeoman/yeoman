# GETTING STARTED

## Installation

Installing Yeoman in an easy process that should take less than 10 minutes on OSX. We also provide notes on how to install on Linux or opt for a more custom installation, should you need to do this. At present, Yeoman is not supported on Windows (but we're working on it!).

## OSX

###Step 1: Install me

Open up a terminal and enter in the following:

```sh
$ curl https://raw.github.com/yeoman/yeoman/master/setup/install.sh | sh
```

This will immediately install Yeoman and any dependencies it may need such as Node, NPM and Ruby.

###Step 2: Create a new project

Next, create a new directory to contain your Yeoman project, then enter in `yeoman init`.

```sh
$ mkdir myapp && cd myapp
$ yeoman init
```

###Step 3: Profit

We'll then ask you some questions to help scaffold your project out. Simple!

## Linux

Yeoman requires a few specific dependencies to be present before it can be installed on Linux. These are Ruby, RVM, Compass, PhantomJS and Node.

#### Install Ruby

Use your relevant package manager to update or install Ruby with the following at a terminal window:

```shell
$ sudo apt-get install ruby  # for Ubuntu / Debian users
$ sudo yum install ruby      # for Red Hat / Fedora users
```

#### Install RVM

Install RVM with ruby:

```shell
$ curl -L https://get.rvm.io | bash -s stable --ruby
```

and with rails:

```shell
$ curl -L https://get.rvm.io | bash -s stable --rails
```

Finally, to install without the "rubygems-bundler" or "rvm" gems:

```shell
$ curl -L https://get.rvm.io | bash -s stable --without-gems="rvm rubygems-bundler"
```

#### Install Compass using RVM

```shell
$ rvm wrapper 1.9.3@compass --no-prefix compass
```

#### Install PhantomJS

To install PhantomJS, we recommend following the [official guide](http://phantomjs.org/download.html#linux).

Alternatively:

```shell
$ sudo apt-get install build-essential chrpath git-core libssl-dev libfontconfig1-dev
$ git clone git://github.com/ariya/phantomjs.git
$ cd phantomjs
$ git checkout 1.6
./build.sh
```

#### Install Node

We recommend downloading and installing the node binaries directly from [nodejs.org](http://nodejs.org/download/).
This will save you needing to compile from source. There are also guides available for those wishing to install node
using a [package manager](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

### Install OptiPNG and libjpeg-turbo

You will also need to get the image optimization libraries we use, which can be installed using apt-get as follows:

```shell
$ apt-get install optipng
```
and

```shell
$ wget 'http://sourceforge.net/projects/libjpeg-turbo/files/1.0.1/libjpeg-turbo_1.0.1_i386.deb/download' -O libjpeg-turbo_1.0.1_i386.deb
$ dpkg -i libjpeg-turbo_1.0.1_i386.deb

# ls -l /usr/lib/libjpeg.so.62
lrwxrwxrwx 1 root root 17 2010-11-12 12:35 /usr/lib/libjpeg.so.62 -> libjpeg.so.62.0.0
# rm -rf /usr/lib/libjpeg.so.62
# ln -s /opt/libjpeg-turbo/lib/libjpeg.so.62.0.0 /usr/lib/libjpeg.so.62
```


#### Install Yeoman

* Install [git](http://git-scm.com/book/en/Getting-Started-Installing-Git) if you don't have it already
* Clone the [yeoman repo](https://github.com/yeoman/yeoman/) and `cd` into the `cli` directory
* Run this command: `sudo npm install -g`
* Navigate to a new directory and run `yeoman init` to make sure everything is working as expected.

Note: once Yeoman has launched, you'll be able to easily install it via NPM, but for now, the above
should work.



## Custom Installation

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


## Updating

One of our goals is to implement an easy way to update to the latest version of Yeoman with minimal effort
on your part. Whilst we hope to get this in place before the first version of the project launches, you can
otherwise update to the latest version as follows:

* git clone `https://github.com/yeoman/yeoman.git`
* cd `yeoman/cli`
* sudo npm install -g
* sudo npm link


## Uninstall

You may want to uninstall the globally installed package by running the
following command:

```sh
npm uninstall yeoman -g
```

So sad to see you go ☹

If it was installed locally, next to your gruntfile, simply drop the
`node_modules/yeoman` folder.