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

if [[ "$MAC" = 1 ]]; then
	# Mac tests

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
else
	# Linux tests

	# Curl test
	if [ -z "$CURLFILE" ]; then
		CURL=1
	else
		CURL=0
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
fi

# Display results
