#!/bin/bash
export DEFAULT_NAMESPACE=Default
export DEFAULT_VERSION="0.1.1"

if [ $# -eq 0 ]; then
    export NAMESPACE=$DEFAULT_NAMESPACE
    export VERSION=$DEFAULT_VERSION
elif [ $# -eq 1 ]; then
    export NAMESPACE=$1
    export VERSION=$DEFAULT_VERSION
elif [ $# -eq 2 ]; then
      export NAMESPACE=$1
      export VERSION=$2
else
      echo "🔥 Bad parameters 🔥"
fi

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🔵  Debug Cirrus WebGui for Databases"
echo "┃────────────────────────────────────────────"
echo "┃ ✳️ Namespace="$NAMESPACE
echo "┃ ✳️ Chart vs ="$VERSION
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

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
#npm update
../networking/scripts/DockerBuild.sh $VERSION cirrus-webgui4db
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

cd ../serviceMongodb/
#npm update
../networking/scripts/DockerBuildService.sh $VERSION cirrus-service-mongodb
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
