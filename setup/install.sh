#!/bin/bash

# install.sh: Installation script

# Note for maintenance: we have versions of Node, Compass, and the Yeoman zip hardcoded here.

# checking OS

LINUX=0
MAC=0
PKGMGR=0

# checking baseline dependencies
RUBYFILE=$(which ruby)
GEMFILE=$(which ruby)
BREWFILE=$(which brew)

NODEFILE=$(which node)
GEMFILE=$(which gem)
COMPASSFILE=$(gem which compass)

# packages to automatically be installed
PACKAGESMAC='git optipng jpeg-turbo phantomjs'
PACKAGESLINUX='git optipng libjpeg-turbo8 phantomjs'


echo "                                                            "
echo "             .-:/+ossyhhhddddddddhhhysso+/:-.               "
echo "       ./oymNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmho/.         "
echo "     .yNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNh'       "
echo "     -NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN-       "
echo "      dNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNd        "
echo "      +NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN+        "
echo "      .NNNNNNNNNNNNNNNNNNNdhyyyhmNNNNNNNNNNNNNNNNNN.        "
echo "       hNNNNNNNNNNNNNNNmssyhshshyoyNNNNNNNNNNNNNNNh         "
echo "       /NNNNNNNNNNNNNNd+ds++yhoooyy+NNNNNNNNNNNNNN/         "
echo "       'NNNNNNNNNNNNNN/do+hsosoys/hssNNNNNNNNNNNNm'         "
echo "        hNNNNNNNNNNNNN:N//d:hmooh+sh+NNNNNNNNNNNNy          "
echo "        /No---------+Nosh+oyyssyo/d+hm:--------yN:          "
echo "        'Ny          omssyy/ys/ssyohm:         dm           "
echo "    -----dN-----------+mmyssyyssshmd/---------:Nh-----      "
echo "   'dmmmmNNNNNNNNNNNNNNNNNNNmmmNNNNNNNNNNNNNNNNNNmmmmh      "
echo "    /NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN:      "
echo "    'yhhhhdNNdddddddddmNNNdhhhhhhhhhhhhhhhhhhhhhhhhhs       "
echo "          :Nm'''.:oso+:/smd:      '-/oso:.'                 "
echo "          'NN' /dNNNNNmo':Nm'    'smNNNNNd:                 "
echo "           hN/ .+hdmmho-  hN:     -sdmmdy/'                 "
echo "           /Nh    '.'     hN/        '.'                    "
echo "            mN-           hN/.'                             "
echo "            :Nd'          ymdddy'                           "
echo "             sNy'        '-:::::.'                          "
echo "              sNs'   ':ohdmNNyNNmdyo:'                      "
echo "               oNh--smNNNNNNd'dNNNNNNms-                    "
echo "                :mNNNNNNNNNh. .dNNNNNNNNy.                  "
echo "                :mNNNNNNNd/'   '+dNNNNNNNm-                 "
echo "               'ydmmmdmNms+:-..'  -+ydmmmds'                "
echo "                       ./oyhmmms                            "
echo "                                                            "
echo ""
echo ""
echo "                   Welcome to Yeoman! "
echo ""
echo ""
echo "We're going to check some dependencies and install them if they're not present"
echo ""
echo "Stand by..."
echo ""

# Some utility parts:
# 1. Grab a temporary folder for us to operate in
# 2. Find a tar executable

# set the temp dir
TMP="${TMPDIR}"
if [ "x$TMP" = "x" ]
then
  TMP="/tmp"
fi
TMP="${TMP}/yeoman.$$"
rm -rf "$TMP" || true
mkdir "$TMP"
if [ $? -ne 0 ]
then
  echo "Failed to mkdir $TMP" >&2
  exit 1
fi

# Check the user has tar installed.
tar="${TAR}"
if [ -z "$tar" ]
then
  tar="${npm_config_tar}"
fi
if [ -z "$tar" ]
then
  tar=`which tar 2>&1`
  ret=$?
fi
if [ $ret -eq 0 ] && [ -x "$tar" ]
then
  echo "tar=$tar"
  echo "Good gracious! You've got this version of 'tar' installed:"
  $tar --version
  ret=$?
fi
if [ $ret -eq 0 ]
then
  (exit 0)
else
  echo "No suitable tar program found."
  exit 1
fi

function check_or_install_brew_pkg() {
  FILELOCATION=$(which $1)
  if [ "$FILELOCATION" ]
  then
    echo "$1 is installed."
  else
    echo "Installing $1..."
    brew install $1
  fi
}

echo ""

# where will we return to?
BACK="$PWD"
cd "$TMP"

function haveProg() {
    [ -x "$(which $1)" ]
}

if haveProg apt-get
then 
  echo "You are using apt-get. I'll assume you have Linux with that." && LINUX=1 && PKGMGR=1
elif haveProg yum
then 
  echo "You are using yum. I'll assume you have Linux with that." && LINUX=1 && PKGMGR=2
elif haveProg up2date
then 
  echo "You are using up2date. I'll assume you have Linux with that." && LINUX=1 && PKGMGR=3
elif haveProg brew
then 
  echo "You are using brew, I'll assume you got a Mac to go with that." && MAC=1 && PKGMGR=4
else
    echo "No package manager found!"
    exit 1
fi

echo ""

#check which OS
if [ "$MAC" -eq 1 ]
then 
  echo "Installing for mac."
elif [ "$LINUX" -eq 1 ]
then
  echo "Installing for linux."
else
  echo "Unable to determine install target!"
  exit 1  
fi

#check which package manager
if [ "$PKGMGR" -eq 1 ]
then 
  echo "Managing packages using apt."
elif [ "$PKGMGR" -eq 2 ]
then 
  echo "Managing packages using yum."
elif [ "$PKGMGR" - eq 3 ]
then 
  echo "Managing packages using up2date."
elif [ "$PKGMGR" -eq 4 ]
then 
  echo "Managing packages using brew."
else
  echo "Unable to determine package manager!"
  exit 1
fi

#if on mac, make sure brew is installed
if [ "$MAC" -eq 1 ] && [ -z "$BREWFILE" ]
then 
  echo "Looks like you haven't got brew yet, I'll install that now." && ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"
else
  echo "An error occurred installing brew. (Ignore if on linux)."
fi

#check for ruby and ruby gems
if [ "$RUBYFILE" ] && [ "$GEMFILE" ]
then 
  echo ""
else
  echo "You'll need Ruby and RubyGems installed before this installer can continue."
  exit 1
fi

#ensure node is installed
if [ "$NODEFILE" ]
then 
  echo "Node.js is installed." 
else
  echo "Installing Node.js"
  if [ "$MAC" -eq 1 ]
  then 
    echo "Downloading Node.js for Mac." && curl -O http://nodejs.org/dist/v0.8.4/node-v0.8.4.pkg && echo "Node.js downloaded, starting installer." && sudo installer -pkg node-v0.8.4.pkg -target /
  elif [ "$LINUX" -eq 1 ]
  then 
    echo "Downloading Node.js for Linux." && curl -O http://nodejs.org/dist/v0.8.4/node-v0.8.4.tar.gz && echo "Compiling and installing Node.js for linux." && tar xvfz node-v0.8.4.tar.gz && cd node-v0.8.4 && ./configure && make && sudo make install && cd .. && echo "Node.js installed for linux."
  else
    echo "An error occurred installing Node.js"
  fi
fi

echo ""

#install the rest of the dependencies (MAC)
if [ "$MAC" -eq 1 ]
then 
  echo "Installing dependencies for Mac." &&
  for package in $PACKAGESMAC
  do
    check_or_install_brew_pkg $package
  done
fi

#install the rest of the dependencies (LINUX)
if [ "$LINUX" -eq 1 ]
then 
  echo "Installing dependencies for Linux." && echo "Installing $PACKAGESLINUX"
  if [ "$PKGMGR" -eq 1 ]
  then 
    sudo apt-get install $PACKAGESLINUX
  elif [ "$PKGMGR" -eq 2 ]
  then 
    sudo yum install $PACKAGESLINUX
  elif [ "$PKGMGR" -eq 3 ]
  then 
    sudo up2date install $PACKAGESLINUX
  fi
fi

#check for compass
echo ""
if [ "$COMPASSFILE" ]
then 
  echo "Compass is already installed, you may want to 'gem install compass -pre' for the latest goodness."
else
  echo "Install compass for CSS magic."
  sudo gem install compass --pre
  #fix an issue with installing --pre of compass
  rubygems-bundler-uninstaller
fi

#dependencies done. woo!
echo ""
echo "Now the dependencies are sorted let's grab the latest yeoman goodness"

#grab the latest yeoman tarball
tarball="yeoman-yeoman-eec4e8932cbcb60cee5fbcafb13c7cae27ca250f"
curl https://dl.dropbox.com/u/39519/"$tarball".tar.gz | "$tar" -xz
cd "$tarball"

cd cli
#install yeoman as a global npm package
echo ""
echo "Alright buckaroo, hold on to your hats.."
echo "We're about to install the yeoman CLI, which will in turn install quite a few node modules"
echo "We're going to move fast, but once we're done, "
echo "you'll have the power of a thousand developers at your blinking cursor."
echo "Okay here we go..."

sudo npm install . -g

echo ""
echo "Yah Hoo! Yeoman global is in place."
echo ""

# hop back to start and kill our temp folder off
cd "$BACK" && rm -rf "$TMP"

# Welcome wagon
echo ""
echo "My my, I hope you enjoyed that as much as I did."
echo "Yeoman and all its dependencies are now installed!"
echo ""
echo "Now that we've got our ducks in a row..."
echo "You should try starting a new project with yeoman."
echo "... might I suggest: "
echo "       mkdir myYeomanApp"
echo "       cd myYeomanApp   "
echo "       yeoman init      "
echo ""
echo "See you on the other side!"