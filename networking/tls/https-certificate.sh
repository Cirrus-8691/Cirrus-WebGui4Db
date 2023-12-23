#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)
red=$(tput setaf 1)
white=$(tput setaf 7)

if ! [ $# -eq 1 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: No arguments supplied for $bold namespace$normal"
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$white"
    exit 1
fi

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🔵  Install cert-manager"
echo "┃────────────────────────────────────────────"
echo "┃ 🔷  Parameters"
echo "┃────────────────────────────────────────────"
echo "┃ 🔹 Namespace    = "$1
NAMESPACE_CERT_MANAGER=$(kubectl get namespace | grep cert-manager)
if [[ "$NAMESPACE_CERT_MANAGER" == *"cert-manager"* ]]; then
    echo "┃────────────────────────────────────────────"
    echo "┃ 🟢  cert-manager already installed"
    echo "┃ ✅  namespace="$NAMESPACE_CERT_MANAGER
    echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    # see https://cert-manager.io/docs/installation/
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
    if ! [ $? -eq 0 ]; then
        echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "┃$white 🔥FATAL ERROR: No arguments supplied for $bold cert-manager$normal"
        echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$white"
        exit 1
    fi
fi

ISSUER_FILE=tls/letsencrypt-issuer.yaml
echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🔵 Creating letsencrypt Issuer"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# see: https://cert-manager.io/docs/tutorials/acme/nginx-ingress/

# REAL SSL CERTIFICATS
kubectl apply -n $1 -f $ISSUER_FILE
# Warning: Namespace "cert-manager" must be Ok, and Deployment cert-manager-webhook must be started
#
# Error from server (InternalError): error when creating
#  .... dial tcp 10.103.209.99:443: connect: connection refused
# Could occured

if ! [ $? -eq 0 ]; then
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: Cannot build Docker image $bold letsencrypt Issuer$normal "
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$red"
    exit 1
fi
