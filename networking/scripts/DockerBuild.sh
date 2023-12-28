#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)
red=$(tput setaf 1)
white=$(tput setaf 7)

if ! [ $# -eq 2 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: No arguments supplied for $bold PACKAGE_VERSION, PACKAGE_NAME$normal"
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$white"
    exit 1
fi
bold=$(tput bold)
normal=$(tput sgr0)

PACKAGE_NAME=$2
echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ ⚙️  Build $bold $PACKAGE_NAME $normal"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "♻️  Clean 'build/'" 
rm -r -d build/

npm run build
if ! [ $? -eq 0 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: Cannot build $bold $PACKAGE_NAME$normal "
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$red"
    exit 1
fi

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🧊  Build $bold $PACKAGE_NAME $normal Docker image"
echo "┃────────────────────────────────────────────"
echo "┃ ✳️ PACKAGE_VERSION="$1
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker build --pull --rm -f "Dockerfile" -t $PACKAGE_NAME:$1 "."
if ! [ $? -eq 0 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: Cannot build Docker image $bold $PACKAGE_NAME$normal "
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$red"
    exit 1
fi

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🟢 $bold $PACKAGE_NAME $normal ready 😀 "
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
