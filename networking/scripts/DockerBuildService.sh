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

PACKAGE_VERSION=$1
SERVICE_ID=$2
PACKAGE_NAME=cirrus-service-$SERVICE_ID

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🧊  Build $bold $PACKAGE_NAME $normal Docker image"
echo "┃────────────────────────────────────────────"
echo "┃ ✳️ PACKAGE_VERSION="$PACKAGE_VERSION
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
rm -r -d build/

docker build --pull --rm -f "Dockerfile.$SERVICE_ID" -t $PACKAGE_NAME:$PACKAGE_VERSION "."
if ! [ $? -eq 0 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: Cannot build Docker image $bold $PACKAGE_NAME$normal "
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$red"
    exit 1
fi

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🟢 $bold $PACKAGE_NAME $normal ready 😀 "
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
