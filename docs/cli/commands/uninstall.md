
## <a href="#uninstall" name="uninstall">uninstall</a>

Usage: yeoman uninstall packageName

Removes the package `packageName` from the current project.

Example:

{% highlight sh %}
yeoman uninstall backbone

# outputs:

bower uninstalling /project/components/backbone
{% endhighlight %}

Note: If you attempt to uninstall a package that is a dependency of other packages, yeoman (via Bower)
will throw an error.

Example:

{% highlight sh %}
yeoman uninstall jquery

# outputs:
warning backbone depends on jquery
{% endhighlight %}

This simply means that you should uninstall backbone (the top-level package with the dependency) if you wish to remove all traces of the jquery package.
