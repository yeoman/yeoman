# install.sh: Installation script

# Note for maintenance: we have versions of Node, Compass, and the Yeoman zip hardcoded here.


# checking baseline dependencies
RUBYFILE=$(which ruby)
GEMFILE=$(which ruby)

NODEFILE=$(which node)
GEMFILE=$(which gem)
COMPASSFILE=$(gem which compass)

# packages to automatically be installed
PACKAGES='git optipng libjpeg phantomjs'


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
# 3. Safe method to check for installed homebrew packages

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

# tar so hard.
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
  echo "Good gracious! You've got this version 'tar' installed:"
  $tar --version
  ret=$?
fi
if [ $ret -eq 0 ]; then
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


# where will we return to?
BACK="$PWD"
cd "$TMP"




if [ "$RUBYFILE" ] && [ "$GEMFILE" ]
then
    echo ""
else
    echo "You'll need Ruby and RubyGems installed before this installer can continue."
fi

echo ""
if [ "$NODEFILE" ]
then
    echo "Node.js is installed..."
else
    echo "Installing Node.js..."

    curl -O http://nodejs.org/dist/v0.8.4/node-v0.8.4.pkg
    echo "Node.js downloaded, running install script (requires authentication)"
    sudo installer -pkg node-v0.8.4.pkg -target /
fi

echo ""
if [ "$BREWFILE" ]
then
    echo "Homebrew is installed..."
else
    echo "Installing Homebrew..."
    ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"
fi

echo ""
echo "Installing required packages via Homebrew..."
echo "First, we'll make sure homebrew is up to date. (Auth required)"
sudo brew update
echo "Now to install: $PACKAGES"
for package in $PACKAGES
do
  check_or_install_brew_pkg $package
done


# Install of installing bundler we'll just go and grab the compass gem.
# We would like to move to node-sass once libsass is stable
echo ""
if [ "$COMPASSFILE" ]
then
    echo "Compass already installed, you may want to 'gem install compass --pre' for Sass 3.2..."
else
    echo "Installing Compass for CSS preprocessing magic..."
    sudo gem update --system
    sudo gem install compass --pre
fi

# now that we have all our major dependencies in place,
# lets grab the yeoman package and start initializing it.

echo ""
echo "Phew. That was hard work!"
echo "Now we've got those dependencies out of the way, let's grab Yeoman's latest!"


# grab our latest and unpack the tarball
tarball="yeoman-yeoman-1b68f68a73424f7b7d618a18b897748b365c8ad1"
curl https://dl.dropbox.com/u/39519/"$tarball".tar.gz | "$tar" -xzf -
cd "$tarball"

cd cli
# install yeoman as a global node package
echo ""
echo "Alright buckaroo, hold on to your hats.."
echo "We're about to install the yeoman CLI, which will in turn install quite a few node modules"
echo "We're going to move fast, but once we're done, "
echo "you'll have the power of a thousand developers at your blinking cursor."
echo "Okay here we go..."
sudo npm install . -g

echo ""
echo "Yah Hoo! Yeoman global is in place, now for some housekeeping.."

# let's ask the user if she is okay with reporting anonymous stats so we can build a better tool
echo ""
cd ../metrics
# TODO: creating a path like this probably doesn't work on Windows.
python setup.py install --quiet --force --user --install-scripts=~/.yeoman/insight

echo "Alright now, that bit is done now, too."
echo ""

# hop back to start and kill our temp folder off
cd "$BACK" && rm -rf "$TMP"

# Welcome wagon
echo ""
echo "My my, I hope you enjoyed that as much as me."
echo "Yeoman and all it's dependencies are now installed!"
echo ""
echo "Now that we've got our ducks in a row..."
echo "You should try starting a new project with yeoman."
echo "... might I suggest: "
echo "       mkdir myYeomanApp"
echo "       cd myYeomanApp   "
echo "       yeoman init      "
echo ""
echo "See you on the other side!"



