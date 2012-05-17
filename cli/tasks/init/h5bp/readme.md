**grunt init template for html5-boilerplate**

---

The root folder will be created the first time the init task is run with
`h5bp` template (eg. `grunt init:h5bp`).

The resulting output depends on the few question grunt asks during the
process. This includes some path rewrites (like renaming the
`css/style.css` file to something else).

Simply keep pressing enter for the default h5bp layout.

## Options

## Steps

### Project

```sh
Please answer the following:
[?] Project name (foo)
[?] Description (The best project ever.)
[?] Version (0.1.0)
[?] Project git repository (git://github.com/USER/REPO.git)
[?] Project homepage (https://github.com/USER/REPO)
[?] Licenses (MIT)
[?] Author name (USER_NAME)
[?] Author email (USER_EMAIL)
[?] Author url (none)
```

### Layout

```sh
Please answer the following:
help:   » [D]efault:  Standard html5-boilerplate layout
help:
help:   » [C]ustom:   Specific build of html5-boilerplate. A series of prompt allows
help:                 explicit file rewrites for common files and directories.
help:
help:   » [S]illy:    A "silly" build will prompt for every file in the h5bp repository.
help:
[?] Which layout ? ([D]efault, [C]ustom, [S]illy) c
[?] Do you need to make any changes to the above before continuing?
```

### Files

Only if `layout=custom`

```sh
Please answer the following:
Please answer the following:
help:    You can change here the basic layout of the project you're about to
help:   create. The defaults values will create a standars h5bp project, but you
help:   might want to go for something different like:
help:
help:       js/   → javascritps/
help:       css/  → stylesheets/
help:       img/  → images/
help:
[?] CSS directory (css/)
[?] JavaScript directory (js/)
[?] Image directory (img/)
[?] Do you need to make any changes to the above before continuing? (y/N)
```

Only if `layout=silly`
```sh
Please answer the following:
Please answer the following:
[?] 404.html (404.html)
[?] apple-touch-icon-114x114-precomposed.png (apple-touch-icon-114x114-precomposed.png)
[?] apple-touch-icon-144x144-precomposed.png (apple-touch-icon-144x144-precomposed.png)
[?] apple-touch-icon-57x57-precomposed.png (apple-touch-icon-57x57-precomposed.png)
[?] apple-touch-icon-72x72-precomposed.png (apple-touch-icon-72x72-precomposed.png)
[?] apple-touch-icon-precomposed.png (apple-touch-icon-precomposed.png)
[?] apple-touch-icon.png (apple-touch-icon.png)
[?] crossdomain.xml (crossdomain.xml)
[?] css/style.css (css/style.css)
[?] favicon.ico (favicon.ico)
[?] grunt.js (grunt.js)
[?] humans.txt (humans.txt)
[?] index.html (index.html)
[?] js/libs/jquery-1.7.2.js (js/libs/jquery-1.7.2.js)
[?] js/libs/jquery-1.7.2.min.js (js/libs/jquery-1.7.2.min.js)
[?] js/libs/modernizr-2.5.3.min.js (js/libs/modernizr-2.5.3.min.js)
[?] js/plugins.js (js/plugins.js)
[?] js/script.js (js/script.js)
[?] readme.md (readme.md)
[?] robots.txt (robots.txt)
[?] Do you need to make any changes to the above before continuing? (y/N)
```

### gruntfile

```sh
Please answer the following:
[?] Is the DOM involved in ANY way? (Y/n)
[?] Will files be concatenated or minified? (Y/n)
[?] Will you have a package.json file? (Y/n)
[?] What is the intermediate/ directory for the build script? (intermediate/)
[?] What it is the final build output directory? (publish/)
[?] What is the CSS directory? (css/)
[?] What is the JS directory? (js/)
[?] What is the IMG directory? (img/)
[?] Do you need to make any changes to the above before continuing? (y/N)
```
