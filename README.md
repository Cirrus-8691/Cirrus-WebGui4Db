# Cirrus-WebGui4Db

WebGui for Database: 

    - Mongodb.

# Deploy Developpement environment on Minikube

## Start kubernetes Minikube

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
TODO create minikube addons
https://minikube.sigs.k8s.io/docs/contrib/addons/

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
# Install WebGui-For-Mongodb in namespace mongodb
sudo ./install.sh mongodb "0.1.1"

```

# Update Cirrus-WebGui4Db with Helm

```bash
# Install WebGui-For-Mongodb in namespace mongodb
sudo ./update.sh -n mongodb -f "" "0.1.1"

```
