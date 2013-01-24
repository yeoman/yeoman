# Contributing

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :) At this time we are primarily focusing on improving the user-experience and stability of Yeoman for our first release. Please keep this in mind if submitting feature requests, which we're happy to consider for future versions.


## Issue submission

In order for us to help you please check that you've completed the following steps:

* Made sure you're on the latest version `npm update -g yeoman`
* Looked through the list of [known bugs](https://github.com/yeoman/yeoman/wiki/Additional-FAQ) to ensure the issue hasn't been noted or solved already
* Used the search feature to ensure that the bug hasn't been reported before
* Included as much information about the bug as possible, including any output you've received, what OS and version you're on, etc.
* Shared the output from `echo $PATH $NODE_PATH` and `brew doctor` as this can also help track down the issue.

[Submit your issue](https://github.com/yeoman/yeoman/issues/new)


## Repos

Yeoman has three primary repos:

* [main project](http://github.com/yeoman/yeoman)
* [generators](http://github.com/yeoman/generators)
* [yeoman.io](http://github.com/yeoman/yeoman.io)


## Contributor License Agreement

Before we can accept patches, there's a quick web form we need you to fill out [here](http://code.google.com/legal/individual-cla-v1.0.html) (<strong>\*scroll to the bottom!\*</strong>).

If you're contributing under a company, you need to fill out [this form instead](http://code.google.com/legal/corporate-cla-v1.0.html).

This CLA asserts that fixes and documentation are owned by you and that Google can license all work under BSD.

Other projects require a similar agreement: jQuery, Firefox, Apache, and many more.

[More about CLAs](https://www.google.com/search?q=Contributor%20License%20Agreement)


## Quick Start

* Clone this repo and `cd` into it
* Run this command: `./setup/install.sh`
* `cd` into the `/cli` directory and run `sudo npm link` after the install is complete.
* Navigate to a new directory and run `yeoman init` to make sure everything is working as expected.
* Add `yeoman_test` with any value to your environment variables to disable the updater and Insight.

You can keep Yeoman up to date by using `git pull --rebase upstream master && cd cli && npm link`, where `upstream` is a remote pointing to this repo.


### Generators

When developing in the generators repo you probably want to be able to test out your changes. The recommended workflow is to link the generators module into the yeoman project by running `npm link path/to/generator/folder` in `yeoman/cli/`. This means changes you do in the generators repo will be reflected in the yeoman repo.


### Insight

When developing for Yeoman, you will most likely be running and debugging commands within the CLI. If you have opted into Insight, these commands will be logged. A special `--disable-insight` flag is available for developers wishing to opt out of Insight tracking so inflated stats are not recorded.


## Style Guide

This project uses single-quotes, two space indentation, multiple var statements and whitespace around arguments. Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.


## Pull Request Guidelines

* Submit your CLA, if you haven't.
* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.
* Non-trivial changes should be discussed in an issue first
* Develop in a topic branch, not master
* Lint the code by running `grunt` in the `/cli` folder
* Add relevant tests to cover the change
* Make sure test-suite passes
* Squash your commits
* Write a convincing description of your PR and why we should land it


## Tests

Yeoman has a test suite to ensure it's reliably and accurately working as a developer tool. You can find the main test suite in [`test/test-build.js`](https://github.com/yeoman/yeoman/blob/master/cli/test/test-build.js), most of the assertions are [checks against yeoman cli stdout](https://github.com/mklabs/yeoman/wiki/test-build).

To run our test suite:

```
npm test
```

Do note that if any CLI prompts are not accounted for the test suite will have a timeout failure.


## Developer Docs

We have significant developer docs for you if you'd like to hack on Yeoman.

Currently you can find much of the details on [mklabs' yeoman wiki](https://github.com/mklabs/yeoman/wiki/_pages) but also [our primary project](https://github.com/yeoman/yeoman/tree/master/docs/cli).

You're also welcome to `git blame` back to commit messages and pull requests. As a project we value comprehensive discussion for our fellow developers.
