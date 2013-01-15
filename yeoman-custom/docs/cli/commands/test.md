

## <a href="#test" name="test">test</a>

Usage: `yeoman test`

Runs a Mocha test harness in a headless instance of PhantomJS.

When you generate a new project using `yeoman init`, we also scaffold out a basic set of
Mocha unit tests that you can continue using to test your application.

Running `yeoman test` allows you to easily check if all of your tests are passing. This also
gets called when running `yeoman build`.

A dedicated server, with visibility on `app`, `temp` and `test` is
launched to serve file for PhantomJS.


Example:

{% highlight sh %}
yeoman test

# outputs:

Running "mocha:all" (mocha) task
Running specs for index.html
.....................................................
>> 82 assertions passed in 53 specs (562ms)

Done, without errors.
{% endhighlight %}
