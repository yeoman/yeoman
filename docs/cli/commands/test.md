

## <a href="#test" name="test">test</a>

Usage: `yeoman test`

Runs a Mocha test harness in a headless instance of Phantom.js.

When you generate a new project using `yeoman init`, we also scaffold out a basic set of
Mocha unit tests that you can continue using to test your application.

Running `yeoman test` allows you to easily check if all of your tests are passing. This also
gets called when running `yeoman build`.

Example:

```shell
yeoman test

# outputs:

Running "mocha:all" (mocha) task
Running specs for index.html
.....................................................
>> 82 assertions passed in 53 specs (562ms)

Done, without errors.
```