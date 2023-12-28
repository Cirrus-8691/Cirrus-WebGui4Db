#!/bin/bash
# Use this version if no parameter supplied
DEFAULT_NAMESPACE=Default
DEFAULT_VERSION="1.2.0"

if [ $# -eq 0 ]; then
    NAMESPACE=$DEFAULT_NAMESPACE
    VERSION=$DEFAULT_VERSION
elif [ $# -eq 1 ]; then
    NAMESPACE=$1
    VERSION=$DEFAULT_VERSION
elif [ $# -eq 2 ]; then
      NAMESPACE=$1
      VERSION=$2
else
    echo "$red┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "┃$white 🔥FATAL ERROR: to many parameters expecting: $bold NAMESPACE, VERSION$normal"
    echo "$red┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━$white"
    exit 1
fi

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🔵  Install Cirrus WebGui for Databases"
echo "┃────────────────────────────────────────────"
echo "┃ ✳️ Namespace="$NAMESPACE
echo "┃ ✳️ Chart vs ="$VERSION
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

networking/scripts/Namespace.sh $NAMESPACE
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

sudo helm repo add cirrus-webgui4db \
"https://raw.githubusercontent.com/Cirrus-8691/Cirrus-WebGui4Db/main/networking/repository"

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 📄 => 📁 Copy environment file variables" 
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cp .env.production webApp/
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi
cd webApp/
npm install
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

../networking/scripts/DockerBuild.sh $VERSION cirrus-webgui4db
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

cd ../services/
npm install
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

../networking/scripts/DockerBuildService.sh $VERSION gateway
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi
../networking/scripts/DockerBuildService.sh $VERSION mongodb
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi
../networking/scripts/DockerBuildService.sh $VERSION postgresql
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

cd ..
networking/scripts/HelmInstall.sh $NAMESPACE values.yaml
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🟢 Cirrus WebGui for Databases ready 😀 "
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
