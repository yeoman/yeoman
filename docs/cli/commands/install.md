## <a href="#install" name="install">install</a>

Usage: `yeoman install <packageName>`, `yeoman install <package1> <package2>`

Installs a package and any packages that this depends on using Twitter Bower. A package is a folder containing a resource described by a package.json file or a gzipped tarball containing this information.

By default, running `yeoman install packageName` will install the dependency in your projects `app/components` folder.

Example:

{% highlight sh %}
yeoman install backbone

# or if you wish to install multiple packages at once..
yeoman install jquery spine
{% endhighlight %}

As mentioned, the files for these dependencies will be added to `app/components`. If you wish to use any of them you will need to manually include a script/file reference to the relevant source files.

Example:

{% highlight html %}
&lt;script src="components/spine/lib/spine.js"&gt;&lt;/script&gt;
{% endhighlight %}

If installing a dependency which has its own dependencies described, these dependencies will also be pulled in.

Example:

{% highlight sh %}
yeoman install backbone
{% endhighlight %}

will actually also install Underscore.js and jQuery.js as these are required for Backbone to function correctly.

`yeoman install` also supports installing packages using more than just the package name. Namely:

{% highlight sh %}
yeoman install jquery
yeoman install git://github.com/components/jquery.git
yeoman install components/jquery (same as above)
yeoman install http://foo.com/jquery.awesome-plugin.js
yeoman install ./repos/jquery
{% endhighlight %}

As you can see, packages can be installed by name, Git endpoint, GitHub shorthand, URL or local path. If you install and URL that is a zip or tar file, yeoman will automatically extract the contents of it. When tags are available in the endpoint, you can specify a semver tag to fetch concrete versions:

{% highlight sh %}
yeoman install jquery#1.8.1
yeoman install git://github.com/components/jquery.git#~1.8.1
yeoman install components/jquery#1.8.x
{% endhighlight %}

More in the [Bower docs](https://github.com/twitter/bower/blob/master/README.md#usage)
