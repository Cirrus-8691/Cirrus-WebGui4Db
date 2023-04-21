# Cirrus-WebGui for Databases

Use this script to build Helm chart package in repo.

# Initialize repo

This should only be done once.

```bash
# sudo helm repo remove cirrus-webgui4db
sudo helm repo add cirrus-webgui4db \
"https://raw.githubusercontent.com/Cirrus-8691/WebGui-For-Mongodb/main/networking/repository"

```
# Build chart

```bash
cd networking
./build.sh "0.1.1"

```
