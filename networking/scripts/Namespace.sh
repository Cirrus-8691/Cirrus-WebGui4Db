#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)
red=$(tput setaf 1)
white=$(tput setaf 7)

# Use this version if no parameter supplied
DEFAULT_NAMESPACE=Default

if [ $# -eq 0 ]; then
    NAMESPACE=$DEFAULT_NAMESPACE
elif [ $# -eq 1 ]; then
    NAMESPACE=$1
else
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: to many parameters expecting: $bold NAMESPACE$normal"
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$white"
    exit 1
fi

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🛂  Check namespace $NAMESPACE"
echo "┃────────────────────────────────────────────"
NAMESPACE_FOUND=$(kubectl get namespace | grep $NAMESPACE)
if [[ "$NAMESPACE_FOUND" == *"$NAMESPACE"* ]]; then
    echo "┃ 🟢 Namespace already exist."
    echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "┃ ✨  Create namespace "$NAMESPACE
    echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    kubectl create ns $NAMESPACE
    if ! [ $? -eq 0 ]; then
        echo "${red}┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "┃${white} 🔥FATAL ERROR: Cannot create namespace ${bold}${underline}$NAMESPACE${normal} "
        echo "${red}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${white}"
        exit 1
    fi
fi
