# Contributing

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :) At this time we are primarily focusing on improving the user-experience and stability of Yeoman for our first release. Please keep this in mind if submitting feature requests, which we're happy to consider for future versions.


## Issue submission

In order for us to help you please check that you've completed the following steps:

* Made sure you're on the latest version `npm update -g yo`
* Used the search feature to ensure that the bug hasn't been reported before
* Included as much information about the bug as possible, including any output you've received, what OS and version you're on, etc.
* Shared the output from running the following command in your project root as this can also help track down the issue.

Unix: `yo --version && echo $PATH $NODE_PATH && node -e 'console.log(process.platform, process.versions)' && cat Gruntfile.js`

Windows: `yo --version && echo %PATH% %NODE_PATH% && node -e "console.log(process.platform, process.versions)" && type Gruntfile.js`
[Submit your issue](https://github.com/yeoman/yeoman/issues/new)


## Contributor License Agreement

Before we can accept patches, there's a quick web form we need you to fill out [here](http://code.google.com/legal/individual-cla-v1.0.html) (**scroll to the bottom!**).

If you're contributing under a company, you need to fill out [this form instead](http://code.google.com/legal/corporate-cla-v1.0.html).

This CLA asserts that fixes and documentation are owned by you and that Google can license all work under BSD.

Other projects require a similar agreement: jQuery, Firefox, Apache, and many more.

[More about CLAs](https://www.google.com/search?q=Contributor%20License%20Agreement)


## Quick Start

- Add `yeoman_test` with any value to your environment variables to disable the updater and Insight.
- Clone the repo of yo, generator, and any generator you might want to develop against, and then run `npm install` in them.
- Go to the yo folder and link it globally using `npm link` then link in the generators using `npm link path/to/generator` for each.
- Run `yo` and you should now see the linked generators in the list.
- Start hacking :)

You can keep the various repos up to date by running `git pull --rebase upstream master` in each.


## Style Guide

This project uses single-quotes, two space indentation, multiple var statements and whitespace around arguments. Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.


## Pull Request Guidelines

* Submit your CLA, if you haven't.
* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.
* Non-trivial changes should be discussed in an issue first
* Develop in a topic branch, not master
* Lint the code by running `grunt`
* Add relevant tests to cover the change
* Make sure test-suite passes: `npm test`
* Squash your commits
* Write a convincing description of your PR and why we should land it
