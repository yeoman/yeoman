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
elif [[ "$os" == "Linux" || "$os" == "FreeBSD" ]]; then
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

# audit \o/

audit() {
  echo ""
  echo "Before I can assist you I will need to confirm you have the necessary requirements. "
  echo ""
  echo "Below you will find the results of my short system audit:"

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
    [ "$cli" -eq 1 ] &&  happy_print "Command Line Tools for Xcode" "check."
    [ "$brew" -eq 1 ] && happy_print "Homebrew" "check."
  fi

  if [[ "$linux" = 1 ]]; then
    [ "$curl" -eq 1 ] && happy_print "curl" "is present, phew."
  fi

  [ "$git" -eq 1 ] && happy_print "git" "smashing!"
  [ "$node" -eq 1 ] && happy_print "NodeJS" "check."
  [ "$ruby" -eq 1 ] && happy_print "ruby" "check."
  [ "$gem" -eq 1 ] && happy_print "RubyGems" "check."
  [ "$compass" -eq 1 ] && happy_print "Compass" "check."
  [ "$phantomjs" -eq 1 ] && happy_print "PhantomJS" "check."
  [ "$jpegturbo" -eq 1 ] && happy_print "jpegtran" "check."
  [ "$optipng" -eq 1 ] && happy_print "optipng" "check."
  [ "$yeoman" -eq 1 ] && happy_print "yeoman global npm module" "extraordinary!"

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
    desc_print "Check your ruby version is adequate with" "ruby -v" "(>= 1.8.7 required) and install http://www.ruby-lang.org/en/downloads/"
  [ "$gem" -eq 0 ] && \
    sad_print "RubyGems" "" && \
    desc_print "You'll acquire this with your ruby installation. "
  [ "$compass" -eq 0 ] && \
    sad_print "Compass"  "" && \
    desc_print "is not installed: http://compass-style.org/install/ "
  [ "$phantomjs" -eq 0 ] && \
    sad_print "PhantomJS"  "" && \
    desc_print "Follow instructions at http://phantomjs.org/download.html - the binary installs are quick! " && \
    desc_print "On Mac," "brew install phantomjs" "should do the trick."
  [ "$jpegturbo" -eq 0 ] && \
    sad_print "jpegtran"  "" && \
    desc_print "On Mac," "brew install jpeg-turbo && brew link jpeg-turbo" "should do the trick. " && \
    desc_print "On Ubuntu," "sudo apt-get install libjpeg-turbo-progs" "should do the trick."
  [ "$optipng" -eq 0 ] && \
    sad_print "optipng"  "" && \
    desc_print "On Mac," "brew install optipng" "will sort you out. " && \
    desc_print "On Ubuntu," "sudo apt-get install optipng" "should do the trick."
  [ "$yeoman" -eq 0 ] && \
    sad_print "yeoman"  "" && \
    desc_print "You're missing yeoman!" "npm install -g yeoman" "will correct this atrocity. You may need sudo."



  echo ""
  echo "Areas I have not scored with a tick indicate I did not find your system satisfactory. You will need to correct these before I can be of service to you. Troubled? Consider reading http://goo.gl/XoyWI "
  echo ""
  printf "%s \e[47m\e[0;35m%s\e[0m %s\n" "Once all of my audit items are confirmed, we can begin. Type" "yeoman" "at your prompt to summon me."
  echo ""
}

# yeoman art.

art() {
  echo "[0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;233m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;94m [48;5;94m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;180m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;233m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;172m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;1m [48;5;160m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;209m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;16m [48;5;16m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;16m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;16m [48;5;52m [48;5;160m [48;5;16m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;52m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;124m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;16m [48;5;160m [48;5;16m [48;5;16m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;52m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;88m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;214m [48;5;214m [48;5;214m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;214m [48;5;214m [48;5;214m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m
    [0m"
}

# function calls.
art
audit
