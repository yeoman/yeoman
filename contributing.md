# Contributing

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :) At this time we are primarily focusing on improving the user-experience and stability of Yeoman for our first release. Please keep this in mind if submitting feature requests, which we're happy to consider for future versions.


## Issue submission

In order for us to help you please check that you've completed the following steps:

* Made sure you're on the latest version `npm update -g yeoman`
* Looked through the list of [known bugs](https://github.com/yeoman/yeoman/wiki/Additional-FAQ) to ensure the issue hasn't been noted or solved already
* Used the search feature to ensure that the bug hasn't been reported before
* Included as much information about the bug as possible, including any output you've received, what OS and version you're on, etc.
* Shared the output from `echo $PATH $NODE_PATH` and `brew doctor` as this can also help track down the issue.


## Repos

Yeoman has three primary repos:

* [main project](http://github.com/yeoman/yeoman)
* [generators](http://github.com/yeoman/generators)
* [yeoman.io](http://github.com/yeoman/yeoman.io)



## Contributor License Agreement

We'd love to accept your code patches! However, before we can take them, we have to jump a couple of legal hurdles.

We need you to sign a CLA. In summary, the CLA asserts that when you donate fixes or documentation, you both own the code that you're submitting and that Google can in turn license that code to other people. (In this case, making it available under the BSD license)

Just FWIW, here are some other projects that require a similar agreement: jQuery, Firefox, Sizzle, Dojo, Plone, Fedora, Cordova/Phonegap, Apache, Flex.

**Please fill out an [individual CLA](http://code.google.com/legal/individual-cla-v1.0.html).** There is a web form at the bottom; shouldn't take too long.

(If you work for a company that wants to allow you to contribute, you'll need to complete a [corporate CLA](http://code.google.com/legal/corporate-cla-v1.0.html).)

More about CLAs:
* http://wiki.civiccommons.org/Contributor_Agreements
* http://incubator.apache.org/ip-clearance/index.html
* http://dojofoundation.org/about/cla

## Quick Start

* Clone this repo and `cd` into it
* Run this command: `./setup/install.sh`
* `cd` into the `/cli` directory and run `sudo npm link` after the install is complete.
* Navigate to a new directory and run `yeoman init` to make sure everything is working as expected.

You can keep Yeoman up to date by using `git pull --rebase upstream master && cd cli && npm link`, where `upstream` is a remote pointing to this repo.


## Style Guide

This project uses single-quotes, two space indentation, multiple var statements and whitespace around arguments. Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.


## Pull Request Guidelines

* Submit your CLA, if you haven't.
* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.
* Lint the code by running `grunt` in the `/cli` folder before submitting a pull request
* Develop in a topic branch, not master


## Tests

Yeoman has a test suite to ensure it's reliably and accurately working as a developer tool. You can find the main test suite in [`test/test-build.js`](https://github.com/yeoman/yeoman/blob/master/cli/test/test-build.js), most of the assertions are [checks against yeoman cli stdout](https://github.com/mklabs/yeoman/wiki/test-build).

To run our test suite:

```sh
npm test
```

Do note that if any CLI prompts are not accounted for the test suite will have a timeout failure.


## Developer Docs

We have significant developer docs for you if you'd like to hack on Yeoman.

Currently you can find much of the details on [mklabs' yeoman wiki](https://github.com/mklabs/yeoman/wiki/_pages) but also [our primary project](https://github.com/yeoman/yeoman/tree/master/docs/cli).

You're also welcome to `git blame` back to commit messages and pull requests. As a project we value comprehensive discussion for our fellow developers.
