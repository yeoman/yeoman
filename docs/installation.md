# GETTING STARTED

## Installation

Installing Yeoman in an easy process that should take less than 10 minutes on OSX. We also provide notes on how to install on Linux or opt for a more custom installation, should you need to do this. At present, Yeoman is not supported on Windows (but we're working on it!).

## OSX

### Step 1: Install me

Open up a terminal and enter in the following:

{% highlight sh %}
$ curl -L get.yeoman.io | sh
{% endhighlight %}

This will immediately install Yeoman and any dependencies it may need such as Node, NPM and Ruby.

You're also welcome to do a [manual install of Yeoman](https://github.com/yeoman/yeoman/wiki/Manual-Install).

###Step 2: Create a new project

Next, create a new directory to contain your Yeoman project, then enter in `yeoman init`.

{% highlight sh %}
$ mkdir myapp && cd myapp
$ yeoman init
{% endhighlight %}

###Step 3: Profit

We'll then ask you some questions to help scaffold your project out. Simple!

## Linux

Yeoman requires a few specific dependencies to be present before it can be installed on Linux. These are Ruby >= 1.8.7, Compass, PhantomJS and Node.

The install script should handle you, but if not, follow along with the [manual install](https://github.com/yeoman/yeoman/wiki/Manual-Install).


#### Install Yeoman

* Run: `npm install -g yeoman`
  * You may need to prefix this with `sudo`, depending on your system.
* Navigate to a new directory and run `yeoman init` to make sure everything is working as expected.



## Custom Installation

There are two main ways to install, using a "global" or a "local" install.

1. **When installed globally**: Provides a custom global binary named `yeoman`
(or `html5-boilerplate`) which is a wrapper on top of grunt, plus the extra
specific task and helpers.

2. **When installed locally**: ability to load in your project and grunt setup a
set of tasks that get referenced in your gruntfile (`grunt.js`) when run via `grunt`.



### global install

{% highlight sh %}
npm install -g yeoman
{% endhighlight %}

This installs Yeoman globally, which contains its own internal grunt and
provides a `yeoman` binary.


### local install

This works for system where grunt have been already installed globally with

{% highlight sh %}
npm install grunt -g
{% endhighlight %}

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

{% highlight js %}
"dependencies": {
  "yeoman": "0.9.0"
}
{% endhighlight %}


### git clone / npm install

# or globally, to install the yeoman binary
npm install -g yeoman
{% endhighlight %}

For development, the `npm link` command might be handy (posix only, instead of `npm install -g`).


## Updating

One of our goals is to implement an easy way to update to the latest version of Yeoman with minimal effort
on your part. We have included an automatic updater in Yeoman to bump you when a new version ships, but if you need to do it manually: `npm update yeoman -g`


## Uninstall

You may want to uninstall the globally installed package by running the
following command:

{% highlight sh %}
npm uninstall yeoman -g
{% endhighlight %}

So sad to see you go ☹

If it was installed locally, next to your gruntfile, simply drop the
`node_modules/yeoman` folder.
