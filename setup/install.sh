#!/bin/bash

# install.sh: Installation script

# We're doing a few things here, we welcome your readthrough. As a summary:

# * Detect Mac or Linux, pick which package manager to use
# * On Mac, install homebrew if it's not present
# * Then install these: git optipng jpeg-turbo phantomjs
# * Make sure Ruby >= 1.8.7 is around, install if not (for Compass)
# * Install the latest NodeJS package
# * Install Compass
# * Download Yeoman zip to a temporary folder
# * Install it as a global node module


# Note for maintenance: edit the version variables below for easy updating :D
NODEVER=0.8.8

# checking OS
LINUX=0
MAC=0
PKGMGR=0

haveProg() {
    [ -x "$(which $1)" ]
}

if haveProg apt-get; then
  echo "You are using apt-get. I'll assume you have Linux with that."
  LINUX=1
  PKGMGR=1
elif haveProg yum; then
  echo "You are using yum. I'll assume you have Linux with that."
  LINUX=1
  PKGMGR=2
elif haveProg up2date; then
  echo "You are using up2date. I'll assume you have Linux with that."
  LINUX=1
  PKGMGR=3
elif haveProg zypper; then
  echo "You are using zypper. I'll assume you have Linux with that."
  LINUX=1
  PKGMGR=4
elif haveProg pacman; then
  echo "You are using pacman. I'll assume you have Linux with that."
  echo "WARN: phantomjs is not currently available in the official archlinux repository."
  echo "Install phantomjs from AUR? [Y/n]"
  read FROMAUR
  case "$FROMAUR" in
    y|Y|YES|yes|Yes)
      if haveProg yaourt; then
        echo "Cool have yaourt already."
      else
        echo "Installing yaourt"
        BACK="$PWD"
        cd /tmp/
        curl -L http://autoyaourt.googlecode.com/files/autoyaourt.sh | bash
        cd $BACK
      fi
      PACKAGESARCHLINUX='optipng libjpeg-turbo phantomjs'
      ARCHMGR=yaourt
      ;;
    n|N|NO|no|No)
      echo "Continuing installation without installing phantomjs"
      FROMAUR=""
      PACKAGESARCHLINUX='optipng libjpeg-turbo'
      ARCHMGR="sudo pacman"
      ;;
  esac
  LINUX=1
  PKGMGR=5
else
  MAC=1
  PKGMGR=6
fi

if [ "$MAC" -eq 1 ]; then
  if haveProg clang; then
    echo "Looks like you have the XCode CLI tools. Passed!"
  else
    echo "Looks like you need the XCode CLI Tools for homebrew, chap. Learn about
where to install them at the homebrew docs: https://github.com/mxcl/homebrew/wiki/Installation"
    exit 1
  fi
fi

echo ""

if [ "$MAC" -eq 1 ]; then
  echo "Installing on OS X."

  # check pre-installed ruby
  RUBYCHECK=$(ruby -e 'print RUBY_VERSION')

elif [ "$LINUX" -eq 1 ]; then
  echo "Installing on Linux."
else
  echo "Unable to determine install target OS! We currently support OS X and Linux."
  exit 1
fi

# brew installation
BREWFILE=$(which brew)

if [ "$MAC" -eq 1 ] && [ -z "$BREWFILE" ]; then
  echo "Installing Homebrew"
  echo -ne '\n' | curl -fsSkL raw.github.com/mxcl/homebrew/go | ruby
  echo ""
elif [ "$MAC" -eq 1 ] && [ "$BREWFILE" ]; then
  echo "You've got brew, nice work chap!"
fi

# checking baseline dependencies
CURLFILE=$(which curl)
RUBYFILE=$(which ruby)
NODEFILE=$(which node)
GEMFILE=$(which gem)
COMPASSFILE=$(which compass)
COMPASS=1

# check for curl
if [ -z "$CURLFILE" ]; then
  echo "Woah! I need curl to carry on, chap!"
  exit 1
fi

# sudo checks, don't try this at home, kids
NEEDSUDO=0
CHECKADMIN=$( ls -ld /usr/local/bin | grep "admin" )
CHECKROOT=$( ls -ld /usr/local/bin | grep "root" )
CHECKLINK=$( ls -ld /usr/local/ | grep "$USER" )

if [ "$CHECKADMIN" ]; then
  NEEDSUDO=1
elif [ "$CHECKROOT" ]; then
  NEEDSUDO=1
elif [ -z "$CHECKLINK" ]; then
  NEEDSUDO=1
elif [ -z "$RUBYFILE" ] && [ "$LINUX" -eq 1]; then
  NEEDSUDO=1
elif [ -z "$NODEFILE" ]; then
  NEEDSUDO=1
elif [-z "$COMPASSFILE" ]; then
  NEEDSUDO=1
fi

# packages to automatically be installed
PACKAGESMAC='git optipng jpeg-turbo phantomjs'
PACKAGESLINUX='optipng libjpeg-turbo8 phantomjs'
if [ "$PKGMGR" -eq 5 ]; then
  PACKAGESLINUX=$PACKAGESARCHLINUX
fi
DEBGIT='git-core'
OTHERGIT='git'


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
# 0. Sudo checks
# 1. Grab a temporary folder for us to operate in
# 2. Find a tar executable

#sudo checks
if [ "$NEEDSUDO" -eq 1 ]; then
  echo "Please authorize the installer:"
  sudo -v
  # sudo keep-alive: gist.github.com/3118588
  while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &
fi

# set the temp dir
TMP="${TMPDIR}"
if [ "x$TMP" = "x" ]; then
  TMP="/tmp"
fi
TMP="${TMP}/yeoman.$$"
rm -rf "$TMP" || true
mkdir "$TMP"
if [ $? -ne 0 ]; then
  echo "Failed to mkdir $TMP" >&2
  exit 1
fi

# Check the user has tar installed.
tar="${TAR}"
if [ -z "$tar" ]; then
  tar="${npm_config_tar}"
fi
if [ -z "$tar" ]; then
  tar=`which tar 2>&1`
  ret=$?
fi
if [ $ret -eq 0 ] && [ -x "$tar" ]; then
  echo "tar=$tar"
  echo "Good gracious! You've got this version of 'tar' installed:"
  $tar --version
  ret=$?
fi
if [ $ret -eq 0 ]; then
  (exit 0)
else
  echo "No suitable tar program found."
  exit 1
fi

check_or_install_brew_pkg() {
  FILELOCATION=$(which $1)
  if [ "$FILELOCATION" ]; then
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

#check for and install ruby if needed
if [ -z "$RUBYFILE" ] && [ "$LINUX" -eq 1 ] && [ "$PKGMGR" -eq 1 ]; then
  echo "Installing Ruby"
  sudo apt-get -y install libruby1.9.1 ruby1.9.1 rubygems1.9.1
elif [ -z "$RUBYFILE" ] && [ "$LINUX" -eq 1 ] && [ "$PKGMGR" -eq 2 ]; then
  echo "Installing Ruby"
  sudo yum -y install ruby rubygems
elif [ -z "$RUBYFILE" ] && [ "$LINUX" -eq 1 ] && [ "$PKGMGR" -eq 4 ]; then
  echo "Installing Ruby"
  sudo zypper install -y ruby rubygems
elif [ "$MAC" -eq 1 ] && [[ "$RUBYCHECK" < 1.8.7 ]]; then
  echo "Error you need to update your ruby version. Yeoman requires 1.8.7 or newer for it's use of compass."
  COMPASS=0
elif [ "$RUBYFILE" ]; then
  echo "Ruby is installed."
else
  echo "Unable to determine ruby configuration, skipping compass install."
  COMPASS=0
fi

echo ""

#ensure node is installed
if [ "$NODEFILE" ]; then
  echo "Node.js is installed."
else
  echo "Installing Node.js"
  if [ "$MAC" -eq 1 ]; then
    echo "Downloading Node.js for Mac."
    curl -O http://nodejs.org/dist/v$NODEVER/node-v$NODEVER.pkg
    echo "Node.js downloaded, starting installer."
    sudo installer -pkg node-v$NODEVER.pkg -target /
  elif [ "$LINUX" -eq 1 ]; then
    echo "Downloading Node.js for Linux."
    MACHINE_TYPE=`uname -m`
      if [ ${MACHINE_TYPE} == 'x86_64' ]; then
        curl -O http://nodejs.org/dist/v$NODEVER/node-v$NODEVER-linux-x64.tar.gz
        echo "installing Node.js for linux."
        tar xvfz node-v$NODEVER-linux-x64.tar.gz
        cd node-v$NODEVER-linux-x64
        sudo cp -r * /usr/local/
        cd ..
      else
        curl -O http://nodejs.org/dist/v$NODEVER/node-v$NODEVER-linux-x86.tar.gz
        echo "installing Node.js for linux."
        tar xvfz node-v$NODEVER-linux-x86.tar.gz
        cd node-v$NODEVER-linux-x86
        sudo cp -r * /usr/local/
        cd ..
      fi
  else
    echo "An error occurred installing Node.js"
    exit 1
  fi
fi

echo ""

#install the rest of the dependencies (MAC)
if [ "$MAC" -eq 1 ]; then
  echo "Installing dependencies for OS X."
  for package in $PACKAGESMAC
  do
    check_or_install_brew_pkg $package
  done
  if [ -z "$CHECKLINK" ]; then
    sudo chown -R $USER /usr/local
  fi
  brew link jpeg-turbo
fi

#install the rest of the dependencies (LINUX)
if [ "$LINUX" -eq 1 ]; then
  echo "Installing dependencies for Linux."
  echo "Installing $PACKAGESLINUX"
  if [ "$PKGMGR" -eq 1 ]; then
    sudo apt-get -y install $PACKAGESLINUX $DEBGIT
  elif [ "$PKGMGR" -eq 2 ]; then
    sudo yum -y install $PACKAGESLINUX $OTHERGIT
  elif [ "$PKGMGR" -eq 3 ]; then
    sudo up2date install $PACKAGESLINUX $OTHERGIT
  elif [ "$PKGMGR" -eq 4 ]; then
    sudo zypper install -y $PACKAGESLINUX $OTHERGIT
  elif [ "$PKGMGR" -eq 5 ]; then
    $ARCHMGR -S $PACKAGESLINUX $OTHERGIT
  fi
fi

#check for compass
echo ""
if [ "$COMPASSFILE" ]; then
  echo ""
  echo "WARN: Compass is already installed, you may want to 'gem update compass' to confirm it has Sass 3.2"
  echo ""
elif [ "$COMPASS" -eq 0 ]; then
  echo "Ruby was not detected or is not configured correctly, skipping compass."
elif [ -z "$COMPASSFILE" ] && [ "$COMPASS" -eq 1 ]; then
  echo "Install compass for CSS magic."
  sudo gem install compass
fi

#dependencies done. woo!
echo ""
echo "Now the dependencies are sorted let's grab the latest yeoman goodness"

#install yeoman as a global npm package
echo ""
echo "Alright buckaroo, hold on to your hats.."
echo "We're about to install the yeoman CLI, which will in turn install quite a few node modules"
echo "We're going to move fast, but once we're done, "
echo "you'll have the power of a thousand developers at your blinking cursor."
echo "Okay here we go..."

if [ "$NEEDSUDO" -eq 1 ]; then
  echo ""
  echo "You *may* be prompted now for your sudo password to kick off the npm install. Please hold."
  sudo npm install yeoman -g
else
  npm install yeoman -g
fi

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

if [ "$COMPASS" -eq 0 ]; then
  echo ""
  echo "Install hiccup: no compass"
  echo "Sorry chap, compass wasn't setup because there was a problem with your ruby setup. You can check the documentation here for help: [link to documentation]."
fi

if [ -z "$FROMAUR" ]; then
  echo ""
  echo "Dear Archer please install phantomjs before using Yeoman"
fi
