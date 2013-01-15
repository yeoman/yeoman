
# Installation

Installing Yeoman in an easy process that should take less than 10 minutes on OS X. We also provide notes on how to install on Linux or opt for a more custom installation, should you need to do this. At present, Yeoman is not supported on Windows (but we're working on it!).

## Step 1: Install me

Open up a terminal and enter in the following:

{% highlight sh %}
$ curl -L get.yeoman.io | bash
{% endhighlight %}

This will audit your system and see what of Yeoman's dependencies are currently installed, such as Node, NPM and Ruby.

This script will give you instructions on how to install what's missing. You're welcome to follow along at the more detailed [Yeoman install procedure](https://github.com/yeoman/yeoman/wiki/Manual-Install).

### Troubleshooting
There are some [extra troubleshooting guides](https://github.com/yeoman/yeoman/wiki/Additional-FAQ) available, as well.

## Step 2: Create a new project

Next, create a new directory to contain your Yeoman project, then enter in `yeoman init`.

{% highlight sh %}
$ mkdir myapp && cd myapp
$ yeoman init
{% endhighlight %}

## Step 3: Profit

We'll then ask you some questions to help scaffold your project out. Simple!


# Updating

One of our goals is to implement an easy way to update to the latest version of Yeoman with minimal effort
on your part. We have included an automatic updater in Yeoman to bump you when a new version ships, but if you need to do it manually: `npm update yeoman -g`


# Uninstall

You may want to uninstall the globally installed package by running the
following command:

{% highlight sh %}
npm uninstall yeoman -g
{% endhighlight %}

So sad to see you go ☹

You may need to do a more comprehensive uninstall if you're having problems; see [the troubleshooting guide](https://github.com/yeoman/yeoman/wiki/Additional-FAQ) in this case.
