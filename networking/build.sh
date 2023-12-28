#!/bin/bash
bold=$(tput bold)
normal=$(tput sgr0)
# Use this version if no parameter supplied
PREVIOUS_DEFAULT_VERSION="0.1.2"

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🔵  Build WebGui for MongoDb"
echo "┃ 📦  $bold Helm chart packages $normal"
echo "┃────────────────────────────────────────────"
if ! [ $# -eq 1 ]; then
  PACKAGE_VERSION=$PREVIOUS_DEFAULT_VERSION
  echo "┃ 🔥 Using previous version="$PREVIOUS_DEFAULT_VERSION
else
  PACKAGE_VERSION=$1
  echo "┃ ✳️ Version="$PREVIOUS_DEFAULT_VERSION
fi
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

./scripts/HelmBuild.sh $PACKAGE_VERSION
if ! [ $? -eq 0 ]; then
  echo "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
  exit 1
fi

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 📦  $bold Re index packages $normal"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
helm repo index repository/

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ 🔵  $bold Files to commit $normal"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git commit

echo ""
echo "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "┃ ⚠️  $bold git commit -a $normal"
echo "┃ ⚠️  $bold git push $normal"
echo "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
read -p "Press enter to git commit & git push"
git commit -a -m "Helm packages vs "$PACKAGE_VERSION
git push