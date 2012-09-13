#!/bin/bash

# install.sh: Installation script

# We're doing a few things here, we welcome your readthrough. As a summary:

# * Detect Mac or Linux.
# * Check and list all the dependencies.


# Version specific deps.
# Fix : Use assosiative array?
# Bash v4 only declare -A vdeps=( ["node"]="0.8.8" ["ruby"]="1.8.7" ["compass"]="0.12.2" ["phantomjs"]="1.6" ); 
vdeps=( "node_0.8.8" "ruby_1.8.7" "compass_0.12.2" "phantomjs_1.6" )

# Common Dependencies OS independent.
deps=('curl' 'git' 'jpeg-turbo' 'yeoman')

# Mac sepcific dependencies.
mac_deps=('brew' 'clang' 'k')

# These gets populated.
installed=()
not_installed=()

isInstalled() {
  [[ -x $(command -v "$1") ]]
}

push() {
   if [ $1 == "installed" ] ;then 
    installed+=( "$2" ) ;
   elif [ $1 == "not_installed" ]; then 
    not_installed+=( "$2" ) ; 
   fi ; 
}

# OS detection.
isMac(){ [[ $(uname -s) == "Darwin" ]]; }
isLinux(){ [[ $(uname -s) == "Linux" ]]; }

# Exit if not in the expected OS.
if ! isMac && isLinux ; then
   echo "Unkown OS type" && exit 1
fi

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
echo "We're going to check some dependencies and list all of them."
echo ""
echo "Stand by..."
echo ""


# Check for the common dependencies.
for dep in "${deps[@]}"
do
  isInstalled $dep && push "installed" $dep || push "not_installed" $dep
done

# Check for the common dependencies.
# Can be  IFS=_ read -r dev ver <<< "$vdep"
for vdep in "${vdeps[@]}"
do
  dep=$(echo $vdep | cut -d "_" -f1)
  ver=$(echo $vdep | cut -d "_" -f2)
  isInstalled $dep && [[ $( echo "$( $dep -v )" | grep -cw '$ver') ]] && push "installed" $dep || push "not_installed" $dep
done

if isMac; then
  for dep in "${mac_deps[@]}"
  do
    isInstalled $dep && push "installed" $dep || push "not_installed" $dep
  done
fi

# Print all deps that meet.
printf '✓ %s\n' ${installed[@]}

# Print all the unmeet deps.
printf '✘ %s\n' ${not_installed[@]}