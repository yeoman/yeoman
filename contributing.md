# Contributing

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :) At this time we are primarily focusing on improving the user-experience and stability of Yeoman for our first release. Please keep this in mind if submitting feature requests, which we're happy to consider for future versions.


## Repos

Yeoman has three primary repos:

* [main project](http://github.com/yeoman/yeoman)
* [generators](http://github.com/yeoman/generators)
* [yeoman.io](http://github.com/yeoman/yeoman.io)


## Quick Start

* Clone this repo and `cd` into it
* Run this command: `./setup/install.sh`
* `cd` into the `/cli` directory and run `sudo npm link` after the install is complete.
* Navigate to a new directory and run `yeoman init` to make sure everything is working as expected.

You can keep Yeoman up to date by using `git pull --rebase upstream master && cd cli && npm link`, where `upstream` is a remote pointing to this repo.


## Style Guide

This project uses single-quotes, two space indentation, multiple var statements and whitespace around arguments. Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.


## Pull Request Guidelines

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
