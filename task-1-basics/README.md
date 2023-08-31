# K8s Task 1 - Basics of Deployments, Services, Configs, and Secrets


## Description 

- Deploy a simple web app that connects to a MongoDB database, containerized and hosted on Dockerhub or any other registry on K8s using a minikube cluster (or kind, or any other K8s cluster) 

## Kubernetes Components

### Web App
- Deployment for the app
- Service for the app

### Configurations and Secrets
- ConfigMap for the app to store MongoDB configuration (URI)
- Secrets for the app to store MongoDB credentials (Username, password)

### Database
- Deployment for the database (MongoDB)
- Service for the database

- **Bouns - Deploy the Database as a statefulset**

## How to run

```bash
minikube start
kubectl apply -f task-1/app.yml
kubectl apply -f task-1/mongo.yml
kubectl apply -f task-1/mongo.config.yml
kubectl apply -f task-1/mongo.secret.yml
```

## How to access the web app

```bash
kubectl port-forward service/app-service 3000:3000
```
OR
```bash
minikube ip 
# then use the ip:nodePort of the service app to access the app
```


