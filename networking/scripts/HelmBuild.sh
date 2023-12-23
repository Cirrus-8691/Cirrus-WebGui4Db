#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)
red=$(tput setaf 1)
white=$(tput setaf 7)

if ! [ $# -eq 1 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: No arguments supplied for $bold PACKAGE_VERSION$normal"
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$white"
    exit 1
fi

cd charts/
CHART=cirrus-webgui4db
echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🐋  Build $bold $CHART $normal Helm chart"
echo "┃────────────────────────────────────────────"
echo "┃ ✳️ PACKAGE_VERSION "$1
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
helm package $CHART -d ../repository/ --version $1
if ! [ $? -eq 0 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$red 🔥FATAL ERROR: Cannot build Helm chart $bold $CHART $normal "
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$red"
    exit 1
fi

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🟢 $bold $CHART $normal ready 😀 "
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
