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

## 1-Regsiter Helm Repository for "Cirrus-WebGui4Db3"
This should only be done once.
```bash
# sudo helm repo remove cirrus-webgui4db
sudo helm repo add cirrus-webgui4db \
"https://raw.githubusercontent.com/Cirrus-8691/Cirrus-WebGui4Db/main/networking/repository"

# On another branche
sudo helm repo add cirrus-webgui4db \
"https://raw.githubusercontent.com/Cirrus-8691/Cirrus-WebGui4Db/Adding-PostgreSQL/networking/repository"

```

## 2-Customise MongoDb host and post
Edit file ".env.production" and customise "External endpoint" of Kubernetes **Service** Mongodb, and the default collection.

Sample:
```
REACT_APP_MONGO_HOST=mongodb.cirrus-project-mongodb
REACT_APP_MONGO_PORT=27017
REACT_APP_MONGO_DATABASE=fred
REACT_APP_MONGO_COLLECTION=Tests
```

## 3-Customise "values.yaml" for hosting website
By default host is localhost and web site avaiable at http://localhost/cirrus-webgui4db/

Customise "values.yaml" with your host, active the tls section, if you want https.

```yaml
webApp:
  ingress:
    annotations:
      cert-manager.io/issuer: "letsencrypt-prod"
    hosts:
      #- host: localhost
      - host: myDomain.com
        paths:
            ## SEE file: "webApp/Dockerfile", line:2 COPY build/ /usr/share/nginx/html/cirrus-webgui4db
          - path: /cirrus-webgui4db/
            pathType: Prefix
     tls:
      - secretName: cirrus-tls
        hosts:
          - myDomain.com

serviceGateway:
  ingress:
    hosts:
      #- host: localhost
       - host: myDomain.com
        paths:
            ## SEE file: ".env.production", line:4 REACT_APP_SERVICE_ROUTE=cirrus-webgui4db-gateway/
          - path: /cirrus-webgui4db-gateway(/|$)(.*)
            pathType: Prefix
     tls:
      - secretName: cirrus-tls
        hosts:
          - myDomain.com
```

Customise file networking/tls/letsencrypt-issuer.yaml
```yaml
    # Email address used for ACME registration
    email: your.email@yourCompany.com
```

## 4 - Install using https or http
To add a tls certificate to your host use this script:

```bash
# Deploy a Let's Encrypt issuer to get an TLS certificate for HTTPS used in namespace "cirrus-webgui4db"
sudo ./https.sh cirrus-webgui4db
```

Use the install script to deploy de app

```bash
# Install WebGui-For-Mongodb in namespace "cirrus-webgui4db", creating a Docker image on the fly.
sudo ./install.sh cirrus-webgui4db

✨  Install cirrus-webgui4db
NAME: cirrus-webgui4db
LAST DEPLOYED: Sat Dec 30 12:43:21 2023
NAMESPACE: cirrus-webgui4db
STATUS: deployed
REVISION: 1
NOTES:
1. Get the web application URL by running these commands:
  https://begin-diaz.freeboxos.fr/cirrus-webgui4db/

2. Get the service gateway URL by running these commands:
  https://begin-diaz.freeboxos.fr/cirrus-webgui4db-gateway(/|$)(.*)

```


# Update Cirrus-WebGui4Db with Helm

```bash
# Update WebGui-For-Mongodb in namespace cirrus-webgui4db, creating a Docker image on the fly.
# see "values.yaml" for hosting website
sudo ./update.sh cirrus-webgui4db

```
