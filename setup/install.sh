# install.sh: Installation script for OSX

# mostly taken from https://github.com/Toura/mulberry/blob/master/install/osx/install.sh
# we need to account for the other OS's, which they do there..


# packages to automatically be installed
PACKAGES='git optipng libjpeg'

# checking baseline dependencies
XCODEFILE=$(which xed)
RVMFILE=$(which rvm)
BREWFILE=$(which brew)
GEMFILE=$(which gem)
JAVAFILE=$(which java)
ANTFILE=$(which ant)
ANDROIDFILE=$(which android)


# Due to bug in xcode install xed may not be in path
# ref http://stackoverflow.com/questions/7317785/terminal-xed-command-missing-after-new-xcode-install
if [ "$XCODEFILE" ] || [ -x "/Developer/usr/bin/xed" ]
then
	echo "XCode is installed..."
else
	echo "XCode is not installed. Please install XCode 4.3+ from http://itunes.apple.com/no/app/xcode/id497799835"
	exit 1
fi


# rvm needed for BPM.
if [ "$RVMFILE" ]
then
	echo "RVM is installed..."
else
	echo "Installing RVM..."
	curl -L get.rvm.io | bash -s stable
fi


if [ "$BREWFILE" ]
then
	echo "Homebrew is installed..."
else
	echo "Installing Homebrew..."
	ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"
fi

brew install ${PACKAGES}


if [ "$JAVAFILE" ]
then
	echo "Java is installed..."
else
	echo "Java is not installed. Please install java from http://www.java.com/en/download/index.jsp"
	exit 1
fi


BUNDLERFILE=$(gem which bundler)

if [[ "$BUNDLERFILE" =~ /*ERROR*/ ]]
then
	echo "Installing bundler..."
	gem install bundler
else
	echo "Bundler is installed..."
fi


# some gems are required in the Gemfile.
echo "Installing bundler-specified gems"
bundle install
