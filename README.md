# Cirrus-WebGui4Db
<p>
  <a href="./LICENSE">
      <img
        alt="license:MIT"
        src="https://img.shields.io/badge/License-MIT-blue"
      />
  </a>
  <img
      alt="Language:TypeScript"
      src="https://img.shields.io/badge/Language-TypeScript-purple"
  />
</p>
<p>
  <a href="https://www.fastify.io/">
    <img
        alt="Server:Fastify"
        src="https://img.shields.io/badge/Server-Fastify-45d298"
    />
  </a>
  <a href="https://mochajs.org/">
    <img
        alt="unitTests:mocha+chai"
        src="https://img.shields.io/badge/Unit_Tests-Chai_Mocha-aa4720"
    />
  </a>
</p>

WebGui for Database: 

- Mongodb.

# Deploy Developpement environment on Minikube

## Start kubernetes Minikube
On Ubuntu, Linux Mint and other Debian distib:

```bash
# Start minikube as sudo to use service type: LoadBalancer
sudo minikube start --driver=none
# Add helpfull addons
sudo minikube addons enable dashboard
sudo minikube addons enable metrics-server
sudo minikube addons enable logviewer

# Expose Dashboard
sudo minikube dashboard

#Expose logviewer
sudo minikube addons open logviewer

```

⚠️ Warning: As minikube is started with the option: 
```
--driver=none
```
to use linux Docker instance and have Kubernetes LoadBalancer services actives, use "sudo" befor each command.


## Install MongoDb
```bash
#Add bitnami repo only once
sudo helm repo add bitnami https://charts.bitnami.com/bitnami 

# Create namespace
sudo kubectl create ns mongodb

# Install mongodb
sudo helm -n mongodb install mongodb bitnami/mongodb 

```

## Get the root MongoDb password:
```bash
export MONGODB_ROOT_PASSWORD=$(sudo kubectl get secret --namespace mongodb mongodb -o jsonpath="{.data.mongodb-root-password}" | base64 -d)
echo $MONGODB_ROOT_PASSWORD

 ```

## Connect to MongoDb with any Gui

Expose mongodb service to localhost port 27017

```bash

 sudo kubectl port-forward --namespace mongodb svc/mongodb 27017:27017 &
    mongosh --host 127.0.0.1 --authenticationDatabase admin -p $MONGODB_ROOT_PASSWORD

```

# Install Cirrus-WebGui4Db with Helm

This should only be done once.
```bash
# sudo helm repo remove cirrus-webgui4db
sudo helm repo add cirrus-webgui4db \
"https://raw.githubusercontent.com/Cirrus-8691/Cirrus-WebGui4Db/main/networking/repository"

```

```bash
# Install WebGui-For-Mongodb in namespace "mongodb", creating a Docker image version "0.1.1" on the fly.
# see "values.yaml" for hosting website
sudo ./install.sh mongodb 0.1.1

```

# Update Cirrus-WebGui4Db with Helm

```bash
# Update WebGui-For-Mongodb in namespace mongodb, creating a Docker image version "0.1.1" on the fly.
# see "values.yaml" for hosting website
sudo ./update.sh mongodb 0.1.1

```
