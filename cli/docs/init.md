init(1) -- Init a new project
=============================

## Description

Creates and init a new project from a predefined template.

This page tries to document further what it could look like,
figuring out how to restructure the init template code.

### New init

Below are some notes and further informations about the new init
template structure.

The goal of this init template is to be able to integrate gracefully
with the `grunt init` task, while pulling in various files from a
predefined list of projects.

The default init template is based on:

* `html5-boilerplate` for the main base
* `twitter-bootstrap` for the optional list of JavaScript plugins
* `compass_twitter_bootstrap` for the sass files, as the CSS files are
  authored in sass

### Project structure

With default template, prompts.

```unicode
.
├── 404.html
├── apple-touch-icon-114x114-precomposed.png
├── apple-touch-icon-144x144-precomposed.png
├── apple-touch-icon-57x57-precomposed.png
├── apple-touch-icon-72x72-precomposed.png
├── apple-touch-icon.png
├── apple-touch-icon-precomposed.png
├── crossdomain.xml
├── css
│   ├── saas
│   │   ├── compass_twitter_bootstrap
│   │   ├── _compass_twitter_bootstrap_awesome.sass
│   │   ├── _compass_twitter_bootstrap_responsive.sass
│   │   └── _compass_twitter_bootstrap.sass
│   └── style.css
├── favicon.ico
├── grunt.js
├── humans.txt
├── index.html
├── js
│   ├── main.js
│   ├── plugins.js
│   └── vendor
│       ├── bootstrap-alert.js
│       ├── bootstrap-button.js
│       ├── bootstrap-carousel.js
│       ├── bootstrap-collapse.js
│       ├── bootstrap-dropdown.js
│       ├── bootstrap-modal.js
│       ├── bootstrap-popover.js
│       ├── bootstrap-scrollspy.js
│       ├── bootstrap-tab.js
│       ├── bootstrap-tooltip.js
│       ├── bootstrap-transition.js
│       ├── bootstrap-typeahead.js
│       ├── jquery-1.7.2.js
│       ├── jquery-1.7.2.min.js
│       ├── modernizr-2.5.3.min.js
│       ├── README.md
│       └── tests
├── LICENSE-MIT
├── package.json
├── readme.md
└── robots.txt
```

### How it works?

In this section, I'm going (or trying :)) to figure out how the init
task and template could be reworked to a bit more flexible, and handle
the bootstrap of an init template by fetching and caching files from
various repositories on GitHub.

### Notes

- prompts > download > cache > copy

---

Here is the overall "diagram" of how the template is layout:

**Note**: `compass_tw ` refers to `compass_twitter_bootstrap`

```unicode

                    -----------------------
                    |                     |
                    | Front init template |
                    |                     |
                    -----------------------
                    /          |          \
                   /           |           \
                  /            |            \
-------------------------------------------------------------------

Fetch:    | h5bp |       | bootstrap |        | compass_tw |

-------------------------------------------------------------------

Copy:     | h5bp |       | bootstrap |        | compass_tw |

-------------------------------------------------------------------

End:      | h5bp |       | bootstrap |        | compass_tw |

-------------------------------------------------------------------
                 \              |              /
                  \             |             /
                   \            |            /
                    \           |           /
                     \          |          /
                      \         |         /
                       \        |        /

                              root/

```

The idea here is to split most of the codes to project specific handlers. Each
of these files is used by the main init template, depending on prompts and / or
configuration.

These "project" template should follow the same interface, which may look like
the following:

```unicode
user: 'github username'
repo: 'github repository name'
version: 'branch or specific tag)'

// this can be automatically created from user/repo/version
url: "http://nodeload.github.com"

// last arg is always a callback to pass control to the next step
fetch: function(done) {}
copy: function(done) {}
end: function(done) {}
```
(For the actual implementation, I'm leaning to EventEmitter based class)

This hopefully will make the code easier to work with, and adding / editing /
removing a remote project should be far easier than it is today. At least, I
hope so.

- **Fetch** step download and cache the files. The fetch is prevented is
  a local cache exists.

- **Copy** step handle a project specifically, and copy relevant files
  from the cache folder to the init's root template of Grunt.

- **End** is an additional step, that does pretty much nothing right
  now. But it can be used to setup a final step, like a compilation one
  or something similar.

In order, the init template should:

1. Clean, remove the root/ folder (to delete previous init "build")
2. Trigger the template
3. Prompts
4. Fetch / Copy / End
5. Grunt file copy with prompt renames (the feature in place with
   [D]efault, [C]ustom, [S]illy layouts. Allow user to rename specific
   folders
6. Gruntfile Generation (from prompts and what is in the root folder)


## Gruntfile Generation

The idea here is to build a fairly elaborated process and Gruntfile
"generator" to create a Gruntfile and relevant configuration based on
the prompts previously asked, and the state of the current files in
`root/

- Template based
- based on prompts & props (props are the hash object returned by Grunt)
- Lookup special files / directories via `grunt.file.expandFiles`
  - js/main.js
  - css/style.css
  - css/sass
  - ...


- main.js + rjs prompt
  - init config for rjs prompt

- css/sass folder
  - init config for the sass task

- Lookup img/ dir or images/
  - setup the config for the img optim task

- Lookup html files
  - setup the config for the html task
  - same for usemin

- usemin needs to be configured for html files, css files (or sass
  directly?)
  - what the usemin task does is to update the reference to img that
    were revved by the rev task (56cd34.foo.png)

- lookup js files, css files, and imgs
  - setup the rev task

- ...

#### Gruntfile config generation for JS

Lookup js/ or javascript/ folder.

no rjs:

- setup concat with js/vendor/*
- setup min task with result of the concat task

rjs:

- setup rjs configuration
- rjs optimizr takes care of all that (or maybe the minification can
  still be done via the min task)


#### Gruntfile default task generation

Depending no the result of the init template (prompts, root/ files), the
default task and build:* should be setup to the relevant list of tasks.

Ex using norjs:

```unicode
default           -> concat css min img rev usemin manifest
build:minify      -> concat css min img rev usemin manifest html:compress
```

Ex using rjs

```unicode
default           -> css rjs img rev usemin manifest
build:minify      -> css rjs img rev usemin manifest html:compress
```

...

---

State of the current implementation looks like the following:

```unicode
Running "init:yeoman" (init) task
This task will create one or more files in the current directory, based on the
environment and the answers to a few questions. Note that answering "?" to any
question will show question-specific help and answering "none" to most questions
will leave its value blank.

<WARN> Existing files may be overwritten! Used --force, continuing. </WARN>

"yeoman" template notes:
... More notes to come here ...

Please answer the following:


Fetching http://nodeload.github.com/h5bp/html5-boilerplate/tarball/master
This might take a few moment
.....................................................................................................................OK

>> Done in 1.58s.
.
>> Done in /Users/mk/src/experiments/yeo/cli/tasks/init/remotes/_cache/h5bp/html5-boilerplate/master


Please answer the following:
[?] Would you like to include vwall/compass-twitter-bootstrap repository? (Y/n)
[?] Do you need to make any changes to the above before continuing? (y/N)


Fetching http://nodeload.github.com/vwall/compass-twitter-bootstrap/tarball/master
This might take a few moment
.............................................................................................................................................................................................................................................................OK

>> Done in 1.843s.
..
>> Done in /Users/mk/src/experiments/yeo/cli/tasks/init/remotes/_cache/vwall/compass-twitter-bootstrap/master


Please answer the following:
[?] Would you like to include twitter/bootstrap repository? (Y/n)
[?] Do you need to make any changes to the above before continuing? (y/N)


Fetching http://nodeload.github.com/twitter/bootstrap/tarball/master
This might take a few moment
.............................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................OK

>> Done in 5.196s.
..
>> Done in /Users/mk/src/experiments/yeo/cli/tasks/init/remotes/_cache/twitter/bootstrap/master

Writing .gitattributes...OK
Writing .gitignore...OK
Writing .htaccess...OK
Writing 404.html...OK
Writing apple-touch-icon-114x114-precomposed.png...OK
Writing apple-touch-icon-144x144-precomposed.png...OK
Writing apple-touch-icon-57x57-precomposed.png...OK
Writing apple-touch-icon-72x72-precomposed.png...OK
Writing apple-touch-icon-precomposed.png...OK
Writing apple-touch-icon.png...OK
Writing crossdomain.xml...OK
Writing css/sass/_compass_twitter_bootstrap.sass...OK
Writing css/sass/_compass_twitter_bootstrap_awesome.sass...OK
Writing css/sass/_compass_twitter_bootstrap_responsive.sass...OK
Writing css/sass/compass_twitter_bootstrap/_accordion.sass...OK
Writing css/sass/compass_twitter_bootstrap/_alerts.sass...OK
Writing css/sass/compass_twitter_bootstrap/_breadcrumbs.sass...OK
Writing css/sass/compass_twitter_bootstrap/_button-groups.sass...OK
Writing css/sass/compass_twitter_bootstrap/_buttons.sass...OK
Writing css/sass/compass_twitter_bootstrap/_carousel.sass...OK
Writing css/sass/compass_twitter_bootstrap/_close.sass...OK
Writing css/sass/compass_twitter_bootstrap/_code.sass...OK
Writing css/sass/compass_twitter_bootstrap/_component-animations.sass...OK
Writing css/sass/compass_twitter_bootstrap/_dropdowns.sass...OK
Writing css/sass/compass_twitter_bootstrap/_font-awesome.sass...OK
Writing css/sass/compass_twitter_bootstrap/_forms.sass...OK
Writing css/sass/compass_twitter_bootstrap/_grid.sass...OK
Writing css/sass/compass_twitter_bootstrap/_hero-unit.sass...OK
Writing css/sass/compass_twitter_bootstrap/_labels-badges.sass...OK
Writing css/sass/compass_twitter_bootstrap/_layouts.sass...OK
Writing css/sass/compass_twitter_bootstrap/_mixins.sass...OK
Writing css/sass/compass_twitter_bootstrap/_modals.sass...OK
Writing css/sass/compass_twitter_bootstrap/_navbar.sass...OK
Writing css/sass/compass_twitter_bootstrap/_navs.sass...OK
Writing css/sass/compass_twitter_bootstrap/_pager.sass...OK
Writing css/sass/compass_twitter_bootstrap/_pagination.sass...OK
Writing css/sass/compass_twitter_bootstrap/_popovers.sass...OK
Writing css/sass/compass_twitter_bootstrap/_progress-bars.sass...OK
Writing css/sass/compass_twitter_bootstrap/_reset.sass...OK
Writing css/sass/compass_twitter_bootstrap/_responsive-1200px-min.sass...OK
Writing css/sass/compass_twitter_bootstrap/_responsive-767px-max.sass...OK
Writing css/sass/compass_twitter_bootstrap/_responsive-768px-979px.sass...OK
Writing css/sass/compass_twitter_bootstrap/_responsive-navbar.sass...OK
Writing css/sass/compass_twitter_bootstrap/_responsive-utilities.sass...OK
Writing css/sass/compass_twitter_bootstrap/_scaffolding.sass...OK
Writing css/sass/compass_twitter_bootstrap/_sprites.sass...OK
Writing css/sass/compass_twitter_bootstrap/_tables.sass...OK
Writing css/sass/compass_twitter_bootstrap/_thumbnails.sass...OK
Writing css/sass/compass_twitter_bootstrap/_tooltip.sass...OK
Writing css/sass/compass_twitter_bootstrap/_type.sass...OK
Writing css/sass/compass_twitter_bootstrap/_utilities.sass...OK
Writing css/sass/compass_twitter_bootstrap/_variables.sass...OK
Writing css/sass/compass_twitter_bootstrap/_wells.sass...OK
Writing css/style.css...OK
Writing favicon.ico...OK
Writing humans.txt...OK
Writing img/.gitignore...OK
Writing index.html...OK
Writing js/main.js...OK
Writing js/plugins.js...OK
Writing js/vendor/.jshintrc...OK
Writing js/vendor/bootstrap-alert.js...OK
Writing js/vendor/bootstrap-button.js...OK
Writing js/vendor/bootstrap-carousel.js...OK
Writing js/vendor/bootstrap-collapse.js...OK
Writing js/vendor/bootstrap-dropdown.js...OK
Writing js/vendor/bootstrap-modal.js...OK
Writing js/vendor/bootstrap-popover.js...OK
Writing js/vendor/bootstrap-scrollspy.js...OK
Writing js/vendor/bootstrap-tab.js...OK
Writing js/vendor/bootstrap-tooltip.js...OK
Writing js/vendor/bootstrap-transition.js...OK
Writing js/vendor/bootstrap-typeahead.js...OK
Writing js/vendor/jquery-1.7.2.js...OK
Writing js/vendor/jquery-1.7.2.min.js...OK
Writing js/vendor/modernizr-2.5.3.min.js...OK
Writing js/vendor/README.md...OK
Writing js/vendor/tests/index.html...OK
Writing js/vendor/tests/phantom.js...OK
Writing js/vendor/tests/server.js...OK
Writing js/vendor/tests/unit/bootstrap-alert.js...OK
Writing js/vendor/tests/unit/bootstrap-button.js...OK
Writing js/vendor/tests/unit/bootstrap-carousel.js...OK
Writing js/vendor/tests/unit/bootstrap-collapse.js...OK
Writing js/vendor/tests/unit/bootstrap-dropdown.js...OK
Writing js/vendor/tests/unit/bootstrap-modal.js...OK
Writing js/vendor/tests/unit/bootstrap-phantom.js...OK
Writing js/vendor/tests/unit/bootstrap-popover.js...OK
Writing js/vendor/tests/unit/bootstrap-scrollspy.js...OK
Writing js/vendor/tests/unit/bootstrap-tab.js...OK
Writing js/vendor/tests/unit/bootstrap-tooltip.js...OK
Writing js/vendor/tests/unit/bootstrap-transition.js...OK
Writing js/vendor/tests/unit/bootstrap-typeahead.js...OK
Writing js/vendor/tests/vendor/jquery.js...OK
Writing js/vendor/tests/vendor/qunit.css...OK
Writing js/vendor/tests/vendor/qunit.js...OK
Writing readme.md...OK
Writing robots.txt...OK
Writing LICENSE-MIT...OK

Initialized from template "yeoman".

```

