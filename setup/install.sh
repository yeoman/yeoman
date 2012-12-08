#!/bin/bash

# ******************************************************************************
# * YEOMAN AUDIT SCRIPT                                                        *
# ******************************************************************************

# We aren't installing anything in this script, we're
# only checking your system for you and reporting back

# Dependencies check codes
brew=0
clang=0
compass=0
curl=0
git=0
gem=0
jpegtran=0
node=0
npm=0
optipng=0
phantomjs=0
ruby=0
yeoman=0

# OS information
os=""
distro=""

# Version requirements
declare -r reqcompass=0.12.1
declare -r reqnode=0.8.0
declare -r reqnpm=1.1
declare -r reqruby=1.8.7

#M------------------------------------------------------------------------------
# | Audit & Dependencies Checks                                                |
# ------------------------------------------------------------------------------

audit() {
    declare -i all_check=0
    declare -i none_check=0

    echo -e "\n Before I can assist you I will need to confirm you have the necessary requirements."
    echo -e "\n Below you will find the results of my short system audit:\n"

    check_dep

    if (( ( "$os" == "linux" || "$os" == "freebsd" ) && $curl == 1 )) ||
       (( "$os" == "mac" && $brew == 1 && $clang == 1 )) &&
       (( $compass == 1 && $git == 1 && $jpegtran == 1 && $node == 1 &&
          $npm == 1 && $optipng == 1 && $phantomjs == 1 && $ruby == 1 &&
          $gem == 1 && $yeoman == 1 )); then
            all_check=1
    fi

    if (( ( "$os" == "linux" || "$os" == "freebsd" ) && $curl != 1 )) ||
       (( "$os" == "mac" && $brew != 1 && $clang != 1 )) &&
       (( $compass != 1 && $git != 1 && $jpegtran != 1 && $node != 1 &&
          $npm != 1 && $optipng != 1 && $phantomjs != 1 && $ruby != 1 &&
          $gem != 1 && $yeoman != 1 )); then
            none_check=1
    fi

    for i in "successful" "unsuccessful"; do

        if [ "$os" == "mac" ]; then
            dep_print "brew" "$i"
            dep_print "clang" "$i"
        elif [[ "$os" == "linux" ||
                "$os" == "freebsd" ]]; then
            dep_print "curl" "$i"
        fi

        dep_print "compass" "$i"
        dep_print "git" "$i"
        dep_print "jpegtran" "$i"
        dep_print "node" "$i"
        dep_print "npm" "$i"
        dep_print "optipng" "$i"
        dep_print "phantomjs" "$i"
        dep_print "ruby" "$i"
        dep_print "gem" "$i"
        dep_print "yeoman" "$i"

        # "optimize" the print process
        if [ "$i" == "successful" ]; then

            # if all dependencies are installed and have the required version,
            # there is no need to continue with the unsuccessful prints
            if [ $all_check -eq 1 ]; then
                echo -e " \n Wicked mate! Type [0;35myeoman[0m at your prompt to summon me.\n"
                break

            # if there are both satisfied and unsatisfied
            # dependencies, separate them by an empty line
            elif [ $none_check -eq 0 ]; then
                echo
            fi

        # there are unsatisfied dependencies
        else

            # if none of the dependencies are satisfied
            if [ $none_check -eq 1 ]; then
                echo -e "\n Bloody hell, we've got some work to do."
            fi

            echo -e "\n Areas I have not scored with a tick indicate I did not \
find your system satisfactory. You will need to correct these before I can be \
of service to you. Troubled? Consider reading http://goo.gl/XoyWI"
            echo -e "\n Once all of my audit items are confirmed, we can begin.\n"
        fi

    done
}

check() {

    # Check codes:
    #   1 = installed, correct version
    #   0 = not installed
    #   2 = installed, wrong version

    declare -i result=0

    # Check if installed
    result=$( [[ -x "$(command -v "$1")" ]]  && echo 1 || echo 0 )

    # Check if correct version
    if [ $result -eq 1 ]; then
        if [[ "$1" == "node" && "$(node -e 'console.log(process.versions.node);')" < "$reqnode" ||
              "$1" == "npm" && "$(npm --version)" < "$reqnpm" ||
              "$1" == "ruby" && "$(ruby -e 'print RUBY_VERSION')" < "$reqruby" ||
              "$1" == "compass" && "$(compass -qv)" < "$reqcompass" ]]; then
                result=2
        fi
    fi

    echo $result
}

check_dep() {

    if [ "$os" == "mac" ]; then
        brew=$(check "brew")
        clang=$(check "clang")
    elif [[ "$os" == "linux" ||
            "$os" == "freebsd" ]]; then
        curl=$(check "curl")
    fi

    compass=$(check "compass")
    gem=$(check "gem")
    git=$(check "git")
    jpegtran=$(check "jpegtran")
    node=$(check "node")
    npm=$(check "npm")
    optipng=$(check "optipng")
    phantomjs=$(check "phantomjs")
    ruby=$(check "ruby")
    yeoman=$(check "yeoman")

}

dep_print() {
    local val=${!1}    # dependency check value (obtained using indirection)
    local f="msgs_$1"  # appropriate messages function

    if [[ "$2" == "successful" && $val == 1 ||
          "$2" == "unsuccessful" && $val != 1 ]]; then
        $f $val
    fi
}

# ------------------------------------------------------------------------------
# | Messages                                                                   |
# ------------------------------------------------------------------------------

msgs_brew() {
    local outputName="${2:-"Homebrew"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            if [ "$os" == "mac" ]; then # only for Mac, but just to be sure :)
                if [[ $curl == 1 && $ruby == 1 ]]; then
                    desc_print "To install $outputName use:" \
                               "ruby -e \"$(curl -fsSkL raw.github.com/mxcl/homebrew/go)\""
                else
                    desc_print "Visit" \
                               "https://github.com/mxcl/homebrew/wiki/Installation" \
                               "for $outputName installation instructions"
                fi
                desc_print "For best results, after install, be sure to run" \
                           "brew doctor" \
                           "and follow the recommendations"
            fi

        ;;
        1 ) happy_print "$outputName" "check." ;;
    esac
}

msgs_clang() {
    local outputName="${2:-"Command Line Tools for Xcode"}"
    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            if [ "$os" == "mac" ]; then # only for Mac, but just to be sure :)
                desc_print "Visit" \
                           "http://stackoverflow.com/a/9329325" \
                           "for $outputName installation instructions"
            fi

        ;;
        1 ) happy_print "$outputName" "check." ;;
    esac
}

msgs_compass() {
    local outputName="${2:-"Compass"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            if [ $gem -eq 1 ]; then
                desc_print "To install $outputName use:" \
                           "sudo gem install compass"
            else
                desc_print "To install $outputName you need to have" \
                           "ruby" \
                           "installed first"
            fi

        ;;
        1 ) happy_print "$outputName" "check." ;;
        2 ) sad_print "$outputName" "[newer version required ≥ $reqcompass]"

            if [ $gem -eq 1 ]; then
                desc_print "To update  $outputName use:" \
                           "sudo gem update compass"
            fi

        ;;
    esac
}

msgs_curl() {
    local outputName="${2:-"cURL"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            case $os in

                linux )
                    case $distro in
                        ubuntu|debian ) desc_print "To install $outputName use:" \
                                                   "sudo apt-get install curl" ;;
                                    * ) desc_print "Visit" \
                                                   "http://curl.haxx.se/docs/install.html" \
                                                   "for $outputName installation instructions" ;;
                    esac
                ;;

                freebsd )
                    desc_print "Visit" \
                               "http://curl.haxx.se/docs/install.html" \
                               "for $outputName installation instructions"
                ;;

            esac

        ;;
        1 ) happy_print "$outputName" "is present, phew." ;;
    esac
}

msgs_gem() {
    local outputName="${2:-"RubyGems"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"
            desc_print "You'll acquire $outputName with your" "ruby" "installation."
        ;;
        1 ) happy_print "$outputName" "check." ;;
    esac
}

msgs_git() {
    local outputName="${2:-"Git"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            case $os in

                mac )
                    if [ $brew -eq 1 ]; then
                        desc_print "To install $outputName use:" \
                                   "brew install git"
                    else
                        desc_print "Visit" \
                                   "http://git-scm.com/download/mac" \
                                   "for $outputName installation instructions"
                    fi
                ;;

                linux )
                    case $distro in
                        ubuntu|debian ) desc_print "To install $outputName use:" \
                                                   "sudo apt-get install git" ;;
                               fedora ) desc_print "To install $outputName use:" \
                                                   "yum install git" ;;
                               gentoo ) desc_print "To install $outputName use:" \
                                                   "emerge --ask --verbose dev-vcs/git" ;;
                                    * ) desc_print "Visit" \
                                                   "http://git-scm.com/download/linux." \
                                                   "for $outputName installation instructions" ;;
                    esac
                ;;

                freebsd )
                    desc_print "To install $outputName use:" \
                               "cd /usr/ports/devel/git && make install clean"
                ;;

            esac

        ;;
        1 ) happy_print "$outputName" "smashing!" ;;
    esac
}

msgs_jpegtran() {
    local outputName="${2:-"JPEGTran"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            case $os in

                mac )
                    if [ $brew -eq 1 ]; then
                        desc_print "To install $outputName use:" \
                                   "brew install jpeg-turbo && brew link jpeg-turbo"
                    else
                        desc_print "Download $outputName from:" \
                                   "http://jpegclub.org/jpegtran/"
                    fi
                ;;

                linux )
                    case $distro in
                        ubuntu ) desc_print "To install $outputName use:" \
                                            "sudo apt-get install libjpeg-turbo-progs" ;;
                             * ) desc_print "Download $outputName from:" \
                                            "http://jpegclub.org/jpegtran/" ;;
                    esac
                ;;

            esac

        ;;
        1 ) happy_print "$outputName" "check." ;;
    esac
}

msgs_node() {
    local outputName="${2:-"NodeJS"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            case $os in

                mac )
                     desc_print "Visit" \
                                "https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager" \
                                "for $outputName installation instructions"
                ;;

                linux )
                    case $distro in
                        ubuntu ) desc_print "To install $outputName use:"
                                 code_print ""
                                 code_print "sudo apt-get install python-software-properties"
                                 code_print "sudo add-apt-repository ppa:chris-lea/node.js"
                                 code_print "sudo apt-get update"
                                 code_print "sudo apt-get install nodejs"
                                 code_print "" ;;
                             * ) desc_print "Visit" \
                                            "https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager" \
                                            "for $outputName installation instructions" ;;
                    esac
                ;;

                freebsd )
                    desc_print "To install $outputName use:" \
                               "cd /usr/ports/www/node && make install clean"
                ;;

            esac
        ;;
        1 ) happy_print "$outputName" "check." ;;
        2 ) sad_print "$outputName" "[newer version required ≥ $reqnode]"
            desc_print "I recommend you grab a fresh $outputName install (≥ $reqnode) from:" \
                       "http://nodejs.org/download/"
        ;;
    esac
}

msgs_npm() {
    local outputName="${2:-"npm"}"

    # npm comes with node nowadays:
    #   - https://npmjs.org/doc/README.html#Super-Easy-Install

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            if [ $node -eq 0 ]; then
                desc_print "You'll acquire $outputName with your" \
                           "NodeJS" \
                           "installation."
            elif [ $node -eq 2 ]; then
                desc_print "You'll acquire $outputName after your install" \
                           "NodeJS (≥ $reqnode)"
            elif [ $node -eq 1 ]; then
                case $os in

                    linux )
                        case $distro in
                            ubuntu ) desc_print "To install $outputName use:"
                                     code_print ""
                                     code_print "sudo apt-get install python-software-properties"
                                     code_print "sudo add-apt-repository ppa:chris-lea/node.js"
                                     code_print "sudo apt-get update"
                                     code_print "sudo apt-get install npm"
                                     code_print "" ;;
                                 * ) desc_print "Visit" \
                                                "https://github.com/isaacs/npm#fancy-install-unix" \
                                                "for $outputName installation instructions" ;;
                        esac
                    ;;

                    freebsd )
                        desc_print "To install $outputName use:" \
                                   "cd /usr/ports/www/npm && make install clean"
                    ;;

                esac
            fi

        ;;
        1 ) happy_print "$outputName" "check." ;;
        2 ) sad_print "$outputName" "[newer version required ≥ $reqnpm]"

            if [ $node -eq 0 ]; then
                desc_print "I recommend you install NodeJS (≥ $reqnode) so that" \
                           "$outputName" \
                           "is updated"
            elif [ $node -eq 2 ]; then
                desc_print "I recommend you grab a fresh NodeJS install (≥ $reqnode) from:" \
                           "http://nodejs.org/download/" \
                           "so that $outputName is updated"
            fi

        ;;
    esac
}

msgs_optipng() {
    local outputName="${2:-"OptiPNG"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            case $os in

                mac )
                    if [ $brew -eq 1 ]; then
                        desc_print "To install $outputName use:" \
                                   "brew install optipng"
                    else
                        desc_print "Download $outputName from:" \
                                   "http://optipng.sourceforge.net/"
                    fi
                ;;

                linux )
                    case $distro in
                        ubuntu ) desc_print "To install $outputName use:" \
                                            "sudo apt-get install optipng" ;;
                              *) desc_print "Download $outputName from:" \
                                            "http://optipng.sourceforge.net/" ;;
                    esac
                ;;

                freebsd )
                    desc_print "To install $outputName use:" \
                               "cd /usr/ports/graphics/optipng && make install clean"
                ;;

            esac

        ;;
        1 ) happy_print "$outputName" "check." ;;
    esac
}

msgs_phantomjs() {
    local outputName="${2:-"PhantomJS"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            case $os in

                mac )
                    if [ $brew -eq 1 ]; then
                        desc_print "To install $outputName use:" \
                                  "brew install phantomjs"
                    else
                        desc_print "Download the $outputName binary package from:" \
                                   "http://phantomjs.org/download.html#mac"
                        desc_print "Visit" \
                                   "http://phantomjs.org/build.html#mac" \
                                   "for instructions on how to compiling $outputName from source (takes a long time!)"
                    fi
                ;;

                linux )
                    case $distro in
                        ubuntu ) desc_print "Download the $outputName binary package from:" \
                                            "http://phantomjs.org/download.html#linux"
                                 desc_print "Compile from source -" \
                                            "http://phantomjs.org/build.html#linux" \
                                            "(takes a long time!):"
                                 code_print ""
                                 code_print "sudo apt-get install build-essential chrpath git-core libssl-dev libfontconfig1-dev"
                                 code_print "git clone git://github.com/ariya/phantomjs.git"
                                 code_print "cd phantomjs"
                                 code_print "git checkout 1.7"
                                 code_print "./build.sh && deploy/package.sh"
                                 code_print "" ;;
                             * ) desc_print "Visit" \
                                            "http://phantomjs.org/download.html#linux" \
                                            "to download the $outputName binary package" ;;
                    esac
                ;;

                freebsd )
                    desc_print "To install $outputName use (takes a long time!):" \
                               "cd /usr/ports/lang/phantomjs && make install clean"
                ;;

            esac

        ;;
        1 ) happy_print "$outputName" "check." ;;
    esac
}

msgs_ruby() {
    local outputName="${2:-"Ruby"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            case $os in

                mac )
                    desc_print "Visit" \
                               "http://www.ruby-lang.org/en/downloads/" \
                               "for $outputName installation instructions"
                ;;

                linux )
                    case $distro in
                        ubuntu ) desc_print "To install $outputName use:" \
                                            "sudo apt-get install ruby1.9.3" ;;
                             * ) desc_print "Visit" \
                                            "http://www.ruby-lang.org/en/downloads/" \
                                            "for $outputName installation instructions" ;;
                    esac
                ;;

            esac

        ;;
        1 ) happy_print "$outputName" "check." ;;
        2 ) sad_print "$outputName" "[newer version required ≥ $reqruby]" ;;
    esac
}

msgs_yeoman() {
    local outputName="${2:-"Yeoman"}"

    case $1 in
        0 ) sad_print "$outputName" "[not installed]"

            if [[ $node -eq 1 && $npm -eq 1 ]]; then
                desc_print "You're missing yeoman!" \
                           "sudo npm install -g yeoman" \
                           "will correct this atrocity."
            elif [ $node -ne 1 ]; then
                desc_print "To install $outputName you need to have" \
                           "NodeJS (≥ $reqnode)" \
                           "installed first"
            elif [ $npm -ne 1 ]; then
                desc_print "To install $outputName you need to have" \
                           "npm (≥ $reqnpm)" \
                           "installed first"
            fi

        ;;
        1 ) happy_print "$outputName" "extraordinary!" ;;
    esac
}

# ------------------------------------------------------------------------------
# | OS                                                                         |
# ------------------------------------------------------------------------------

check_linux_release() {
    [ -e "/etc/$1" ] && echo "$2"
}

get_os_info() {
    local osname="$(uname -s)"

    if [ "$osname" == "Darwin" ]; then
        os="mac"
    elif [ "$osname" == "Linux" ]; then
        os="linux"

        # Get Linux distribution
        # (list of release: http://linuxmafia.com/faq/Admin/release-files.html)
        distro=$(check_linux_release "lsb-release" "ubuntu") ||
               $(check_linux_release "debian_version" "debian") ||
               $(check_linux_release "debian_release" "debian") ||
               $(check_linux_release "gentoo-release" "gentoo") ||
               $(check_linux_release "fedora-release" "fedora")

    elif [ "$osname" == "FreeBSD" ]; then
        os="freebsd"
    else
        # TODO: better detect Windows as other OSes can get this message
        # echo "Windows is not officially supported, currently."
        echo "Your OS is not supported. :("
        exit 1
    fi
}

# ------------------------------------------------------------------------------
# | Print                                                                      |
# ------------------------------------------------------------------------------

# Print extra descriptions for failure
desc_print() {
    echo -e "      * $1 [0;35m$2[0m $3"
}

code_print() {
    echo -e "          [0;35m$1[0m"
}

# Print all in green and the ✔ and $1 in bold
happy_print() {
    echo -e "   [1;32m✔ $1[0;32m $2[0m"
}

# Print all in red and the ✖ and $1 in bold
sad_print() {
    echo -e "   [1;31m✖ $1[0;31m $2[0m"
}

yeoman_logo() {
  echo "[0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;233m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m
    [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m
    [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m
    [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m [0m [0m [0m [0m [0m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;222m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;222m [48;5;222m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;94m [48;5;94m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;222m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [48;5;179m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m [0m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;180m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [48;5;52m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;233m [48;5;160m [48;5;160m [48;5;160m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m
    [0m [0m [0m [0m [0m [0m [0m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;130m [48;5;172m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;1m [48;5;160m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;160m [48;5;160m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;209m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;222m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;16m [48;5;16m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;16m [48;5;160m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;16m [48;5;52m [48;5;160m [48;5;16m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;52m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;124m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;16m [48;5;160m [48;5;16m [48;5;16m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [48;5;16m [48;5;160m [48;5;160m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;52m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;16m [48;5;16m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;88m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;214m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [48;5;160m [0m
    [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [0m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;214m [48;5;214m [48;5;214m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;232m [48;5;214m [48;5;214m [48;5;214m [48;5;232m [48;5;232m [48;5;232m [0m
    [0m"
}

# ------------------------------------------------------------------------------
# | Main                                                                       |
# ------------------------------------------------------------------------------

main() {
    get_os_info
    yeoman_logo
    audit
}

main
