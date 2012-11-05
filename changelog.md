### 0.9.5 - 2012-11-05

- [#627](https://github.com/yeoman/yeoman/issues/627)
Fix: Usemin:html adds image file before a 'a' anchor

- [#636](https://github.com/yeoman/yeoman/issues/636)
Python3 support for Insight

- [#603](https://github.com/yeoman/yeoman/issues/603)
Add ability to specify a base path in the usemin block comment

- [#660](https://github.com/yeoman/yeoman/issues/660)
Determine linefeed from the content not the platform

- Upgrade to latest Bower


### 0.9.4 (12 October, 2012)

* Updated to Bower 0.2.0 (Issue [#551](https://github.com/yeoman/yeoman/issues/551))
* Less verbose `yeoman init` (Issue [#605](https://github.com/yeoman/yeoman/issues/605))
* Ability to disable Insight (Issue [#305](https://github.com/yeoman/yeoman/issues/385))
* Corrections to generator docs (Issue [#608](https://github.com/yeoman/yeoman/issues/608))
* Fixes to usemin:html skipping anchor tags with images as href (Issue [#615](https://github.com/yeoman/yeoman/issues/615))
* Fixes to main.css not being replaced with compiled version unless tag structure is exactly as yeoman expects it (Issue [#502](https://github.com/yeoman/yeoman/issues/502))
* Stops yeoman from looking for win32 binaries in ../vendor/ (Pull [#519](https://github.com/yeoman/yeoman/pull/519))
* Support for installing Yeoman behind a corporate proxy server (Pull [#587](https://github.com/yeoman/yeoman/pull/587))
* Remove a trailing comma in the options of the HTML task and add missing semicolons in the server task
(Issue [#589](https://github.com/yeoman/yeoman/pull/589))
* Fix to enable blank lines in usemin blocks (Issue [#560](https://github.com/yeoman/yeoman/issues/560))
* Updates to Insight documentation
* Fixes usemin:css inserting invalid <link> element (Issue [#586](https://github.com/yeoman/yeoman/issues/586))
* Fix for usemin replace task incorrectly matcheing filename when files in subfolders have the same name (Issue [#565](https://github.com/yeoman/yeoman/issues/565))
* New Windows [installation](https://github.com/yeoman/yeoman/wiki/Manual-Install) instructions 

### 0.9.3 (3 October, 2012)

* Temporary fix to allow Bower dependencies to be correctly copied to app/components. As a result of this patch RequireJS wiring of Bower deps is currently disabled

### 0.9.2 

TBU

### 0.9.1 (15 September, 2012)

* Removal of stdout checks, test against fs (Pull [#473](https://github.com/yeoman/yeoman/pull/473)).

* Fix for  initializer example (Pull [#447](https://github.com/yeoman/yeoman/pull/477 )).

* Support for an expanded compass --require arg (Pull [#483](https://github.com/yeoman/yeoman/pull/483)).   

* Yeoman setup gets a colored art (Pull [#493](https://github.com/yeoman/yeoman/pull/493))!

* Added ability to configure app index file for rjs task (Pull [#505](https://github.com/yeoman/yeoman/pull/505)).

* yeoman server:test and access to the app js files (Issue [#443](https://github.com/yeoman/yeoman/issues/443)).

* yeoman install backbone deletes existing files in app/scripts/vendor issue was fixed (Issue [#460](https://github.com/yeoman/yeoman/issues/460)).

* Replaced coffescript task with grunt-coffee (Pull[#522](https://github.com/yeoman/yeoman/pull/522))
