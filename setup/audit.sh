#!/bin/bash

# audit.sh: audit system and check dependencies

# logic
# 1 = installed, correct version.
# 0 = not installed.
# 2 = installed, wrong version.

# todo
# display results

# requirements (versions required for yeoman)
reqnode=0.8.0
reqruby=1.8.7
reqcompass=0.12.1

# check os
os=$(uname -s)

if [[ "$os" == "Darwin" ]]; then
  mac=1
elif [[ "$os" == "Linux" ]]; then
  linux=1
else
  echo "os not supproted!"
  exit 1
fi

# dependency checks
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


check_set(){
  [ -z "$1" ] && echo 1 || echo 0
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

echo "wotcha! well, hello! below is a quick audit i have run to see if everything is in place for yeoman......
it will take some time, so please grab some coffee ;)"

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
  rubyver=$(ruby -e 'print ruby_version')
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
  [ "$cli" -eq 1 ] &&  echo "✓ *xcode cli tools* are installed." \
  || echo "✘ *xcode cli tools* are not installed, please check the installation docs for assistance."

  [ "$brew" -eq 1 ] && echo "✓ *homebrew* is installed." \
  || echo "✘ *homebrew* is not installed, please check the installation docs for assistance."
fi

if [[ "$linux" = 1 ]]; then
  [ "$curl" -eq 1 ] && echo "✓ *curl* is present, whew." \
  || echo "✘ *curl* is not installed, please check the installation docs for assistance."
fi

[ "$git" -eq 1 ] && echo "✓ *git* is installed, nice one." \
|| echo "✘ *git* is not installed, please check the installation docs for assistance."

[ "$node" -eq 1 ] && echo "✓ *nodejs* is installed." \
|| echo "✘ *nodejs* is not installed, please check the installation docs for assistance."

[ "$ruby" -eq 1 ] && echo "✓ *ruby* is installed." \
|| echo "✘ *ruby* is not installed, please check the installation docs for assistance."

[ "$gem" -eq 1 ] && echo "✓ *rubygems* is installed." \
|| echo "✘ *rubygems* is not installed, please check the installation docs for assistance."

[ "$compass" -eq 1 ] && echo "✓ *compass* is installed." \
||  echo "✘ *compass* is not installed, please check the installation docs for assistance."


[ "$phantomjs" -eq 1 ] && echo "✓ *phantomjs* is installed." \
|| echo "✘ *phantomjs* is not installed, please check the installation docs for assistance."


[ "$jpegturbo" -eq 1 ] && echo "✓ *jpeg-turbo* is installed." \
|| echo "✘ *jpeg-turbo* is not installed, please check the installation docs for assistance."

echo ""
echo "please ensure all of the above tests have passed before trying to install yeoman."