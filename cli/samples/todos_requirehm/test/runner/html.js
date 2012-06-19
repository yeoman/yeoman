//
// ## The Runner and Reporter
//
// Jasmine is built in JavaScript and must be included into a JS
// environment, such as a web page, in order to run. Like this web page.
//
// This JavaScript file is then included, via a `<script>` tag, so that
// all of the above specs are evaluated and recorded with Jasmine. Thus
// Jasmine can run all of these specs. This page is then considered a
// 'runner.'
//
// Here is how a runner works to execute a Jasmine suite.
//

(function() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 250;

  //
  // Create the `HTMLReporter`, which Jasmine calls to provide results of
  // each spec and each suite. The Reporter is responsible for presenting
  // results to the user.
  //

  var htmlReporter = new jasmine.HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);

  //
  // Delegate filtering of specs to the reporter. Allows for clicking on
  // single suites or specs in the results to only run a subset of the
  // suite.
  //

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  //
  // Run all of the tests when the page finishes loading - and make sure
  // to run any previous `onload` handler
  //
  // ### Test Results
  //
  // Scroll down to see the results of all of these specs.
  //

  var currentWindowOnload = window.onload;
  window.onload = function() {
    if (currentWindowOnload) {
      currentWindowOnload();
    }

    jasmineEnv.execute();
  };

})();

