#!/usr/bin/env bash

# uses https://github.com/millermedeiros/gh-markdown-cli
rm -f "index.html"
rm -f "docs.html"

#build index
cat header.html >> index.html
cat sidebar.html >> index.html
cat index.md | mdown > index_content.html
cat index_content.html >> index.html
cat footer.html >> index.html
rm -f "index_content.html"

#build docs
cat header.html >> docs.html
cat sidebar.html >> docs.html
cat docs.md | mdown > docs_content.html
cat docs_content.html >> docs.html
cat footer.html >> docs.html
rm -f "docs_content.html"


#cat header.html sidebar.html index.md footer.html | mdown > index.html