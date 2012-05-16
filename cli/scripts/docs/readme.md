
node-build-script documentation site
====================================

Site is build with [h5bp-docs][] and generated from the project wiki.
Each page may be rendered as individual page, but the docs are all compiled
into one page (index.html).

[Docco][] is also used and generates from files in `src/` into `api/`.

The site can be built with:

``` sh
$ grunt docs
# >> docs copy
$ open index.html
```

```sh
$ grunt wiki
# >> docs:wiki copy
open index.html
```

```sh
$ grunt api
# >> docs:api
$ ls api/
lib/   root/  tasks/
```

Faster building & rebuilding
----------------------------

For quicker rebuilding of the site, you can start up the preview server:

``` sh
$ grunt docs --serve     # live rebuilding of the site!
$ open http://localhost:3000
```

Update the docs
---------------

The docs are managed through git submodules in `docs/` path. To update
(or clone the first time it's run):

```sh
$ git submodule update --init
```

[h5bp-docs]: https://github.com/mklabs/h5bp-docs
[Docco]: http://jashkenas.github.com/docco/
