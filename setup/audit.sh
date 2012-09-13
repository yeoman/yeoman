#!/bin/bash

# Audit.sh: audit system and check dependencies

# LOGIC
# 0 = Installed, correct version.
# 1 = Not installed.
# 2 = Installed, wrong version.

# TODO
# Display results

# Requirements (Versions required for Yeoman)
REQNODE=0.8.0
REQRUBY=1.8.7
REQCOMPASS=0.12.1

# Check OS
OS=$(uname)

if [[ "$OS" == "Darwin" ]]; then
	MAC=1
else
	LINUX=1
fi

# Dependency checks
CURLFILE=$(which curl)
GITFILE=$(which git)
RUBYFILE=$(which ruby)
NODEFILE=$(which node)
GEMFILE=$(which gem)
COMPASSFILE=$(which compass)
BREWFILE=$(which brew)
PHANTOMJSFILE=$(which phantomjs)
JPEGTURBOFILE=$(which jpegtran)
CLANGFILE=$(which clang)

# Audit \o/

echo "Wotcha! Well, hello! Below is a quick audit I have run to see if everything is in place for Yeoman......
It will take some time, so please grab some coffee ;)"

if [[ "$MAC" = 1 ]]; then
  # CLI test
  if [ -z "$CLANGFILE" ]; then
    CLI=1
  else
    CLI=0
  fi
  # Brew test
  if [ -z "$BREWFILE" ]; then
    BREW=1
  else
    BREW=0
  fi
fi
if [[ "$LINUX" = 1 ]]; then
  # Curl test
  if [ -z "$CURLFILE" ]; then
    CURL=1
  else
    CURL=0
  fi
fi
# Git test
if [ -z "$GITFILE" ]; then
	GIT=1
else
	GIT=0
fi
# Node test
if [ -z "$NODEFILE" ]; then
	NODE=1
else
	NODE=0
	NODEVER=$(node -e 'console.log(process.versions.node);')
	# Node version check
	if [[ "$NODEVER" < "$REQNODE" ]]; then
		NODE=2
	fi
fi
# Ruby test
if [ -z "$RUBYFILE" ]; then
	RUBY=1
else
	RUBY=0
	RUBYVER=$(ruby -e 'print RUBY_VERSION')
	# Ruby version check
	if [[ "$RUBYVER" < "$REQRUBY" ]]; then
		RUBY=2
	fi
fi
# Gem test
if [ -z "$GEMFILE" ]; then
	GEM=1
else
	GEM=0
fi
# Compass test
if [ -z "$COMPASSFILE" ]; then
	COMPASS=1
else
	COMPASS=0
	COMPASSVER=$(compass -qv)
	# Compass version check
	if [[ "$COMPASSVER" < "$REQCOMPASS" ]]; then
		COMPASS=2
	fi
fi
# Phantomjs test
if [ -z "$PHANTOMJSFILE" ]; then
	PHANTOMJS=1
else
	PHANTOMJS=0
fi
# jpeg-turbo test
if [ -z "$JPEGTURBOFILE" ]; then
	JPEGTURBO=1
else
	JPEGTURBO=0
fi



# Display results
#
# RESULTS LOGIC
# Passes first
# Fails second

echo ""

# Passes
if [[ "$MAC" = 1 ]]; then
  if [ "$CLI" -eq 0 ]; then
    echo "✓ *Xcode CLI tools* are installed."
  fi
  if [ "$BREW" -eq 0 ]; then
    echo "✓ *Homebrew* is installed."
  fi
fi
if [[ "$LINUX" = 1 ]]; then
  if [ "$CURL" -eq 0 ]; then
    echo "✓ *curl* is present, whew."
  fi
fi
if [ "$GIT" -eq 0 ]; then
  echo "✓ *git* is installed, nice one."
fi
if [ "$NODE" -eq 0 ]; then
  echo "✓ *NodeJS* is installed."
fi
if [ "$RUBY" -eq 0 ]; then
  echo "✓ *Ruby* is installed."
fi
if [ "$GEM" -eq 0 ]; then
  echo "✓ *RubyGems* is installed."
fi
if [ "$COMPASS" -eq 0 ]; then
  echo "✓ *Compass* is installed."
fi
if [ "$PHANTOMJS" -eq 0 ]; then
  echo "✓ *Phantomjs* is installed."
fi
if [ "$JPEGTURBO" -eq 0 ]; then
  echo "✓ *jpeg-turbo* is installed."
fi

echo ""

# Fails
if [[ "$MAC" = 1 ]]; then
  if [ "$CLI" -eq 1 ]; then
    echo "✘ *Xcode CLI tools* are not installed, please check the installation docs for assistance."
  fi
  if [ "$BREW" -eq 1 ]; then
    echo "✘ *Homebrew* is not installed, please check the installation docs for assistance."
  fi
fi
if [[ "$LINUX" = 1 ]]; then
  if [ "$CURL" -eq 1 ]; then
    echo "✘ *curl* is not installed, please check the installation docs for assistance."
  fi
fi
if [ "$GIT" -eq 1 ]; then
  echo "✘ *git* is not installed, please check the installation docs for assistance."
fi
if [ "$NODE" -eq 1 ]; then
  echo "✘ *NodeJS* is not installed, please check the installation docs for assistance."
fi
if [ "$RUBY" -eq 1 ]; then
  echo "✘ *Ruby* is not installed, please check the installation docs for assistance."
fi
if [ "$GEM" -eq 1 ]; then
  echo "✘ *RubyGems* is not installed, please check the installation docs for assistance."
fi
if [ "$COMPASS" -eq 1 ]; then
  echo "✘ *Compass* is not installed, please check the installation docs for assistance."
fi
if [ "$PHANTOMJS" -eq 1 ]; then
  echo "✘ *Phantomjs* is not installed, please check the installation docs for assistance."
fi
if [ "$JPEGTURBO" -eq 1 ]; then
  echo "✘ *jpeg-turbo* is not installed, please check the installation docs for assistance."
fi

echo "Please ensure all of the above tests have passed before trying to install Yeoman."
