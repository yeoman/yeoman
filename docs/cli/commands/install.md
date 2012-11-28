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
<script src="components/spine/lib/spine.js"></script>
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
yeoman install git://github.com/maccman/package-jquery.git
yeoman install maccman/package-jquery (same as above)
yeoman install http://code.jquery.com/jquery-1.7.2.js
yeoman install ./repos/jquery
{% endhighlight %}
