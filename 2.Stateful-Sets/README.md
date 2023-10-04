# [Stateful Sets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

## Stateful vs Stateless Applications


| Stateful | Stateless |
| -------- | -------- |
| Scalable | Scalable |
| Persistent storage | Persistent storage |
| Stateful applications are those that store data on persistent storage, such as a database. | Stateless applications are those that do not store data on persistent storage. |
| Stateful applications needs care about the state (data) by replication when scaling up or down. | Stateless applications can be easily scaled up or down by simply adding or removing pods. |

## Stateful Sets

StatefulSets are similar to Deployments in that they manage Pods and their replica count. However, StatefulSets are designed to manage stateful applications that require a unique identity and stable persistent storage. StatefulSets are valuable for applications like databases, where each instance needs to be uniquely identifiable and persistent storage is required.

## Stateful Sets vs Deployments

| Stateful Sets | Deployments |
| ----------- | ----------- |
| Stateful Sets are designed to manage stateful applications | Deployments are designed to manage stateless applications |
| Stateful Sets can be scaled up or down by adding or removing Pods | Deployments can be scaled up or down by simply adding or removing Pods. |
| Stateful Sets are valuable for applications like databases, where each instance needs to be uniquely identifiable and persistent storage is required | Deployments are valuable for applications like web servers, where each instance does not need to be uniquely identifiable and persistent storage is not required. |


## Task

- Create Namespace
- Get all storage classes
- Deploy Redis Cluster as a StatefulSet with 3 replicas attaching storage to the defult storage class
    - Apply Redis ConfigMap
    - Apply Redis StatefulSet
    - Apply Redis Service
- Enable Redis Cluster
    - Get nodes IPs
    - Connect to the first node
    - Enable Redis Cluster with nodes IPs
    - Check Redis Cluster Info
- Deploy Sample App (hit counter app)
    - Apply Deployment
    - Apply Service


### Create Namespace
```bash
kubectl create ns statefulset-task
```

### Get all storage classes
```bash
kubectl get storageclasses
```

### Deploy StatefulSet

```bash
kubect apply -f redis/configMap.yml
kubect apply -f redis/statefulset.yml
kubect apply -f redis/service.yml
```

### Enable Redis Cluster

```bash
# Get nodes IPs
nodesIPs=$(sudo kubectl -n redis-statefulset get pods -l app=redis-cluster -o jsonpath='{range.items[*]}{.status.podIP}:6379 ')

# Enable Redis Cluster with nodes IPs
kubectl -n redis-statefulset exec -it redis-cluster-0  -- /bin/sh -c "redis-cli -h 127.0.0.1 -p 6379 --cluster create ${nodesIPs}"

# Check Redis Cluster Info (make sure there are 3 nodes)
kubectl -n redis-statefulset exec -it redis-cluster-0  -- /bin/sh -c "redis-cli -h 127.0.0.1 -p 6379 cluster info"
```

### Deploy Sample App

```bash
kubectl -n redis-statefulset apply -f app/deployment.yml
kubectl -n redis-statefulset apply -f app/service.yml
```