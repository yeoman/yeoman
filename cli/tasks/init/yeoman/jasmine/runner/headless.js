
//
// Minimal amount of configuration required for running Jasmine
// specs in an headless environment
//
// You may choose to use a slighly different environment with
// reporters like a jasmine.TrivialReporter or jasmine.HtmlReporter
// to see the results py pointing your browser to your spec runner.
//
// If you are on Unix or Windows, notice that there are a few issues
// running Jasmine specs via grunt-jasmine-task and PhantomJS if you
// change this default environment.
//
// See:
//
// - https://github.com/creynders/grunt-jasmine-task/issues/2
// - https://github.com/creynders/grunt-jasmine-task/issues/4
//
(function() {
  jasmine.getEnv().execute();
})();
