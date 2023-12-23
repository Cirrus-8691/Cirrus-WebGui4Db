#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)
red=$(tput setaf 1)
white=$(tput setaf 7)

if [ $# -eq 1 ]; then
    PARAMETERES=""
elif [ $# -eq 2 ]; then
    PARAMETERES="-f $2"
else
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: No arguments supplied for $bold namespace, values.yaml$normal"
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$white"
    exit 1
fi

CHART=cirrus-webgui4db
echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🐋 Install $bold $CHART $normal Helm chart"
echo "┃────────────────────────────────────────────"
echo "┃ ✳️ In namespace "$1
echo "┃ ✳️ Using helm parameter: '$PARAMETERES'"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
helm repo update
if ! [ $? -eq 0 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: Cannot update $bold repo $normal "
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$red"
  exit 1
fi

echo "♻️  Uninstall $CHART "wget 
helm -n $1 uninstall $CHART

echo "✨  Install $CHART"
helm -n $1 install $CHART cirrus-webgui4db/$CHART $PARAMETERES
if ! [ $? -eq 0 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: Cannot install Helm chart $bold $CHART $normal "
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$red"
  exit 1
fi
