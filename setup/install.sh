# install.sh: Installation script for OSX

# mostly taken from https://github.com/Toura/mulberry/blob/master/install/osx/install.sh
# we need to account for the other OS's, which they do there..


# checking baseline dependencies
RUBYFILE=$(which ruby)
GEMFILE=$(which ruby)

NODEFILE=$(which node)
GEMFILE=$(which gem)
COMPASSFILE=$(gem which compass)

# packages to automatically be installed
PACKAGES='git optipng libjpeg'


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
    CURPATH=$(pwd)

    cd ~/Downloads/
    curl -O http://nodejs.org/dist/v0.6.19/node-v0.6.19.pkg
    echo "Node.js downloaded, running install script (requires authentication)"
    sudo installer -pkg node-v0.6.19.pkg -target /

    cd "$CURPATH"
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
brew install ${PACKAGES}


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
# lets ask the user if she is okay with reporting anonymous stats so we can build a better tool
echo ""
# TODO: creating a path like this probably doesn't work on Windows.
python ../metrics/setup.py install --install-scripts=~/.yeoman/insight


