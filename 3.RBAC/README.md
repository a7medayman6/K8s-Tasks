# Kubernetes RBAC

## What is RBAC?

RBAC stands for Role Based Access Control. It is a way to control access to resources based on the roles of individual users within an enterprise. RBAC is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise. In this context, access is the ability of an individual user to perform a specific task, such as view, create, or modify a file. Roles are defined according to job competency, authority, and responsibility within the enterprise.

## Why RBAC?

RBAC is a method of access control that is based on the roles of individual users within an enterprise. RBAC has become an integral part of enterprise security for managing user rights and access to resources. The main advantage of RBAC is that it can reduce the workload of system administrators. When a new employee enters the organization, the employee can be assigned a role based on the employee's job function. The role determines what permissions the employee will have. This simplifies the process of adding new users and assigning the appropriate access rights. RBAC can also improve security by ensuring that users have only the permissions they need to do their jobs. This can reduce the risk of damage caused by accidental or intentional misuse of privileges.

## How RBAC works?

RBAC works by assigning permissions to roles, not individual users. The role determines what permissions the user will have. Roles are assigned to users based on their job function. For example, a user who is assigned the role of "Sales Manager" will have access to the resources that are needed to perform the job function of a sales manager. The role determines what permissions the user will have. Roles are assigned to users based on their job function. For example, a user who is assigned the role of "Sales Manager" will have access to the resources that are needed to perform the job function of a sales manager. The role determines what permissions the user will have. Roles are assigned to users based on their job function. For example, a user who is assigned the role of "Sales Manager" will have access to the resources that are needed to perform the job function of a sales manager. The role determines what permissions the user will have. Roles are assigned to users based on their job function. For example, a user who is assigned the role of "Sales Manager" will have access to the resources that are needed to perform the job function of a sales manager. The role determines what permissions the user will have. Roles are assigned to users based on their job function. For example, a user who is assigned the role of "Sales Manager" will have access to the resources that are needed to perform the job function of a sales manager. The role determines what permissions the user will have. Roles are assigned to users based on their job function. For example, a user who is assigned the role of "Sales Manager" will have access to the resources that are needed to perform the job function of a sales manager. The role determines what permissions the user will have. Roles are assigned to users based on their job function. For example, a user who is assigned the role of "Sales Manager" will have access to the resources that are needed to perform the job function of a sales manager.


# ClusterRoles and ClusterRoleBindings

## Step 1 - Create a namespace


```bash
kubectl apply -f namespace.yaml
``` 

- Or we can use the following command directly

```bash
kubectl create namespace rbac
```

- View all the namespaces
    
```bash
kubectl get namespace
```

## Step 2 - Create a service account

```bash
kubectl -n rbac apply -f serviceaccount.yaml
```

- Or we can use the following command directly
    
```bash
kubectl create serviceaccount rbac-user -n rbac
```

## Step 3 - Create a cluster role

- We will create a cluster role that allows the users binded to the `rbac-cluster-role` to list pods in the `rbac` namespace.


```bash
kubectl -n rbac apply -f clusterRole.yaml
```

Or we can use the following command directly

```bash
kubectl -n rbac create clusterrole rbac-cluster-role --verb=get,list,watch --resource=pods,deployments 
```

## Step 4 - Create a cluster role binding

We will create a role binding that binds the role `rbac-cluster-role` to the user `rbac-user`.

```bash
kubectl -n rbac apply -f clusterRoleBinding.yaml
```

Or we can use the following command directly
    
```bash
kubectl create clusterrolebinding rbac-user-cluster-role-binding --clusterrole=rbac-cluster-role --serviceaccount=default:rbac-user
```

## Step 5 - Create an Nginx deployment
    
```bash
kubectl -n rbac apply -f nginx/deployment.yaml
```

## Step 6 - Switch to the service account

```bash
kubectl view-serviceaccount-kubeconfig bob > ~/.kube/testkubeconfig

export KUBECONFIG=~/.kube/testkubeconfig
```

## Step 7 - Test the access to list/delete pods

```bash
kubectl -n rbac get pods
```
```bash
kubectl -n rbac delete pods/nginx-deployment-<pod-name>
```


_______________________________________

# Role Binding


## Step 1 - Create a namespace

```bash
kubectl apply -f namespace.yaml
``` 

- Or we can use the following command directly

```bash
kubectl create namespace rbac2
```

## Step 2 - Create a role

- We will create a role that allows the users binded to the `rbac-role` to list pods in the `rbac2` namespace.

```bash
kubectl -n rbac2 apply -f role.yaml
```

Or we can use the following command directly

```bash
kubectl -n rbac2 create role rbac-role --verb=get,list,watch --resource=pods,deployments 
```

## Step 3 - Create a role binding

We will create a role binding that binds the role `rbac-role-binding` to the user `ahmed`.
    
```bash
kubectl create rolebinding rbac-role-binding --role rbac-role --user ahmed -n rbac2
```

## Step 4 - Create a user with self signed certificate, with CA ahmed

```bash
mkdir certs && cd certs

openssl genrsa -out ahmed.key 2048

openssl req -new -key ahmed.key -out ahmed.csr -subj "/CN=ahmed/O=user"

# on microk8s
multipass shell microk8s-vm

# on kind, get the cluster docker continer id, and run
# docker exec -it <id> /bin/sh

# Take the certs and copy them to an accessible location e.g. within your .kube directory.

openssl x509 -req -in ahmed.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out ahmed.crt -days 10000

kubectl config set-credentials ahmed --client-certificate=./ahmed.crt  --client-key=ahmed.key

kubectl config set-context ahmed-context --cluster=microk8s-cluster --namespace=default --user=ahmed

# Test get
kubectl --context=ahmed-context get pods -n rbac

kubectl --context=ahmed-context delete pods -n rbac

```