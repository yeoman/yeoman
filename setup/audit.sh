#!/bin/bash

# audit.sh: audit system and check dependencies

# logic
# 1 = installed, correct version.
# 0 = not installed.
# 2 = installed, wrong version.

# todo
# display results

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
    clangfile=$(command -v clang)


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

# audit \o/

echo ""
echo "Wotcha! Well hi there. "
echo "Thanks for installing Yeoman."
echo "Below is a quick audit I've run on your system to see if you have everything you need for Yeoman:
"

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

# git test
git=$(check_set $gitfile)

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

# gem test
gem=$(check_set $gemfile)

# compass test
compass=$(check_set $compassfile)
if [[ $compass == 1 ]];then
  compassver=$(compass -qv)
  # compass version check
  if [[ "$compassver" < "$reqcompass" ]]; then
    compass=2
  fi
fi

# phantomjs test
phantomjs=$(check_set $phantomjsfile)

# jpeg-turbo test
jpegturbo=$(check_set $jpegturbofile)

# display results
#
# results logic
# passes first
# fails second

echo ""

# passes
if [[ "$mac" = 1 ]]; then
  [ "$cli" -eq 1 ] &&  happy_print "xcode cli tools" "are installed."
  [ "$brew" -eq 1 ] && happy_print "homebrew" "is installed."
fi

if [[ "$linux" = 1 ]]; then
  [ "$curl" -eq 1 ] && happy_print "curl" "is present, whew."
fi

[ "$git" -eq 1 ] && happy_print "git" "is installed, nice one."
[ "$node" -eq 1 ] && happy_print "nodejs" "is installed."
[ "$ruby" -eq 1 ] && happy_print "ruby" "is installed."
[ "$gem" -eq 1 ] && happy_print "rubygems" "is installed."
[ "$compass" -eq 1 ] && happy_print "compass" "is installed."
[ "$phantomjs" -eq 1 ] && happy_print "phantomjs" "is installed."
[ "$jpegturbo" -eq 1 ] && happy_print "jpeg-turbo" "is installed."


# failures
if [[ "$mac" = 1 ]]; then
  [ "$cli" -eq 0 ]  && sad_print "XCode CLI Tools" "is not installed, please check the installation docs for assistance."
  [ "$brew" -eq 0 ] && sad_print "homebrew" "is not installed, please check the installation docs for assistance."
fi

if [[ "$linux" = 1 ]]; then
  [ "$curl" -eq 0 ] && sad_print "curl" "is not installed, please check the installation docs for assistance."
fi

[ "$git" -eq 0 ] && sad_print "git" "is not installed, please check the installation docs for assistance."
[ "$node" -eq 0 ] && sad_print "nodejs" "is not installed, please check the installation docs for assistance."
[ "$ruby" -eq 0 ] && sad_print "ruby" "is not installed, please check the installation docs for assistance."
[ "$gem" -eq 0 ] && sad_print "rubygems" "is not installed, please check the installation docs for assistance."
[ "$compass" -eq 0 ] && sad_print "compass" "is not installed, please check the installation docs for assistance."
[ "$phantomjs" -eq 0 ] && sad_print "phantomjs" "is not installed, please check the installation docs for assistance."
[ "$jpegturbo" -eq 0 ] && sad_print "jpeg-turbo" "is not installed, please check the installation docs for assistance."



echo ""
echo "Please ensure all of the above tests have passed before trying to install yeoman."
