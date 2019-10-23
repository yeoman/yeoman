# Contributing

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :)


## Issue submission

In order for us to help you please check that you've completed the following steps:

* Made sure you're on the latest version `npm update -g yo`
* Used the search feature to ensure that the bug hasn't been reported before
* Included as much information about the bug as possible, including any output you've received, what OS and version you're on, etc.
* Shared the output from running the following command in your project root as this can also help track down the issue.

Unix: `yo --version && echo $PATH $NODE_PATH && node -e 'console.log(process.platform, process.versions)'`

Windows (cmd.exe): `yo --version && echo %PATH% %NODE_PATH% && node -e "console.log(process.platform, process.versions)"`

Windows (PowerShell): `yo --version; echo %PATH% %NODE_PATH%; node -e "console.log(process.platform, process.versions)"`

[Submit your issue](https://github.com/yeoman/yeoman/issues/new)


## Quick Start

- Clone the repo of [yo](https://github.com/yeoman/yo), [generator](https://github.com/yeoman/generator), and any generator you might want to develop against, and then run `npm install` in them.
- Go to the yo folder and link it globally using `npm link` then link in the generators using `npm link path/to/generator` for each.
- Run `yo` and you should now see the linked generators in the list.
- Start hacking :)

You can keep the various repos up to date by running `git pull --rebase upstream master` in each.


## Style Guide

This project uses single-quotes, two space indentation, multiple var statements and whitespace around arguments. Use a single space after keywords like `function`. Ex:

```
function () { ... }
function foo() { ... }
```

Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.


## Pull Request Guidelines

* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.
* Non-trivial changes should be discussed in an issue first
* Develop in a topic branch, not master
* Add relevant tests to cover the change
* Make sure test-suite passes: `npm test`
* Lint the code (mostly done with running the tests)
* Squash your commits
* Write a convincing description of your PR and why we should land it
* Check the individual project to see if there is a **contributing.md** or similar file as some project's have different requirements.
