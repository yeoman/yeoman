#!/bin/bash

# audit system and check dependencies
# We aren't installing anything in this script, we're only checking your system for you and reporting back.

# logic
# 1 = installed, correct version.
# 0 = not installed.
# 2 = installed, wrong version.


# Requirements (versions required for yeoman)
reqnode=0.8.0
reqruby=1.8.7
reqcompass=0.12.1

# Check os
os=$(uname -s)

if [[ "$os" == "Darwin" ]]; then
  mac=1
elif [[ "$os" == "Linux" ]]; then
  linux=1
else
  echo "Windows is not officially supported, currently."
  exit 1
fi

# Dependency checks
     curlfile=$(command -v curl)
      gitfile=$(command -v git)
     rubyfile=$(command -v ruby)
     nodefile=$(command -v node)
      gemfile=$(command -v gem)
  compassfile=$(command -v compass)
     brewfile=$(command -v brew)
phantomjsfile=$(command -v phantomjs)
jpegturbofile=$(command -v jpegtran)
  optipngfile=$(command -v optipng)
    clangfile=$(command -v clang)
   yeomanfile=$(command -v yeoman)

# Check if installed.
check_set(){
  [[ -x "$1" ]]  && echo 1 || echo 0
}


# This prints the ✘ in red,
# rest in bold.
sad_print(){
  printf '\e[31m%s\e[0m \e[1m%s\e[0m %s\n' "✘" "$1" "$2"
}

# This prints ✓ in green,
# rest in bold.
happy_print(){
  printf '\e[32m%s\e[0m \e[1m%s\e[0m %s\n' "✓" "$1" "$2"
}

# print extra descriptions for failure states
desc_print(){
  printf "\t%s \e[47m\e[0;35m%s\e[0m %s\n" "$1" "$2" "$3"
}

# yeoman art.

function art() {
  FILE="art.txt"
  cat "$FILE"
}

# audit \o/

function audit() {
  echo ""
  echo "Wotcha! Well hi there. "
  echo "Thanks for your interest in Yeoman."
  echo ""
  echo "Below is a quick audit I've run on your system to see if you have everything you need for Yeoman:"

  if [[ $mac = 1 ]]; then
    # xcode cli test.
    cli=$(check_set $clangfile)

    # brew test.
    brew=$(check_set $brewfile)
  fi

  if [[ $linux = 1 ]]; then
    # curl test.
    curl=$(check_set $curlfile)
  fi

  # node test
  node=$(check_set $nodefile)
  if [[ $node == 1 ]]; then
    nodever=$(node -e 'console.log(process.versions.node);')
    # node version check
    if [[ "$nodever" < "$reqnode" ]]; then
      node=2
    fi
  fi

  # ruby test
  ruby=$(check_set $rubyfile)
  if [[ $ruby == 1 ]]; then
    rubyver=$(ruby -e 'print RUBY_VERSION')
    # ruby version check
    if [[ "$rubyver" < "$reqruby" ]]; then
      ruby=2
    fi
  fi


  # compass test
  compass=$(check_set $compassfile)
  if [[ $compass == 1 ]];then
    compassver=$(compass -qv)
    # compass version check
    if [[ "$compassver" < "$reqcompass" ]]; then
      compass=2
    fi
  fi


  git=$(check_set $gitfile)
  gem=$(check_set $gemfile)
  phantomjs=$(check_set $phantomjsfile)
  jpegturbo=$(check_set $jpegturbofile)
  optipng=$(check_set $optipngfile)
  yeoman=$(check_set $yeomanfile)

  # display results
  #
  # results logic
  # passes first
  # fails second

  echo ""

  # passes
  if [[ "$mac" = 1 ]]; then
    [ "$cli" -eq 1 ] &&  happy_print "Command Line Tools for Xcode" "are installed! "
    [ "$brew" -eq 1 ] && happy_print "Homebrew" "is installed."
  fi

  if [[ "$linux" = 1 ]]; then
    [ "$curl" -eq 1 ] && happy_print "curl" "is present, phew."
  fi

  [ "$git" -eq 1 ] && happy_print "git" "is installed, nice one."
  [ "$node" -eq 1 ] && happy_print "NodeJS" "is installed."
  [ "$ruby" -eq 1 ] && happy_print "ruby" "is installed."
  [ "$gem" -eq 1 ] && happy_print "RubyGems" "is installed."
  [ "$compass" -eq 1 ] && happy_print "Compass" "is installed."
  [ "$phantomjs" -eq 1 ] && happy_print "PhantomJS" "is installed."
  [ "$jpegturbo" -eq 1 ] && happy_print "jpegtran" "is installed."
  [ "$optipng" -eq 1 ] && happy_print "optipng" "is installed."
  [ "$yeoman" -eq 1 ] && happy_print "yeoman global npm module" "... installed!"

  # failures
  if [[ "$mac" = 1 ]]; then
    [ "$cli" -eq 0 ]  && \
      sad_print "Command Line Tools for Xcode" "" && \
      desc_print "Visit http://stackoverflow.com/a/9329325/89484 for installation options."
    [ "$brew" -eq 0 ] && \
      sad_print "Homebrew" "" && \
      desc_print "Install Homebrew from the instructions at https://github.com/mxcl/homebrew/wiki/Installation " && \
      desc_print "For best results, after install, be sure to run" "brew doctor" "and follow the recommendations."
  fi

  if [[ "$linux" = 1 ]]; then
    [ "$curl" -eq 0 ] && sad_print "curl"
  fi

  [ "$git" -eq 0 ] && \
    sad_print "git" "" && \
    desc_print "Install through your package manager. " && \
    desc_print "For example, with homebrew:" "brew install git"
  [ "$node" -eq 0 ] && \
    sad_print "NodeJS" "" && \
    desc_print "I recommend you grab a fresh NodeJS install (>= 0.8.x) from http://nodejs.org/download/ "
  [ "$ruby" -eq 0 ] && \
    sad_print "ruby"  "" && \
    desc_print "Check your ruby with" "ruby -v" "(>= 1.8.7 required) and install http://www.ruby-lang.org/en/downloads/"
  [ "$gem" -eq 0 ] && \
    sad_print "RubyGems" "" && \
    desc_print "You'll pick this up with your ruby installation. "
  [ "$compass" -eq 0 ] && \
    sad_print "Compass"  "" && \
    desc_print "is not installed: http://compass-style.org/install/ "
  [ "$phantomjs" -eq 0 ] && \
    sad_print "PhantomJS"  "" && \
    desc_print "Follow instructions at http://phantomjs.org/download.html - the binary installs are quick!"
  [ "$jpegturbo" -eq 0 ] && \
    sad_print "jpegtran"  "" && \
    desc_print "On Mac," "brew install jpeg-turbo && brew link jpeg-turbo" "should do the trick."
  [ "$optipng" -eq 0 ] && \
    sad_print "optipng"  "" && \
    desc_print "On Mac," "brew install optipng" "will sort you out."
  [ "$yeoman" -eq 0 ] && \
    sad_print "yeoman"  "" && \
    desc_print "You're missing yeoman!" "npm install -g yeoman" "will sort you out. You may need sudo."



  echo ""
  echo "Help me out and install anything that's missing above. Additional help at http://goo.gl/XoyWI "
  echo ""
  printf "%s \e[47m\e[0;35m%s\e[0m %s\n" "Once you've ensured all of the above dependencies are present, we can start up Yeoman. Type" "yeoman" "at your prompt to get started."
  echo ""
}

# function calls.
art
audit