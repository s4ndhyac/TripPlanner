# Kubernetes Deployment


- Build the docker images
```bash
cd source/database

docker build -t $GCR_REGISTRY/$PROJECT/$DATABASE_DOCKER_IMG:v1 -f docker/Dockerfile .

cd source/backend/tripplanner

docker build -t $GCR_REGISTRY/$PROJECT/$BACKEND_DOCKER_IMG:v1 -f Dockerfile .

cd source/frontend

docker build -t $GCR_REGISTRY/$PROJECT/$FRONTEND_DOCKER_IMG:v1 -f Dockerfile .

```

- Push the docker images to the Google Container Repository (GCR)
```bash
docker push $GCR_REGISTRY/$PROJECT/$DATABASE_DOCKER_IMG:v1

docker push $GCR_REGISTRY/$PROJECT/$BACKEND_DOCKER_IMG:v1

docker push $GCR_REGISTRY/$PROJECT/$FRONTEND_DOCKER_IMG:v1
```

- Apply the deployments.yaml script
```bash
cd source/k8s-configurations

kubectl apply -f deployments.yaml
```

## k8s-configurations basics

- deployments.yaml

A deployment is a “workload” that holds your applications pod (which contains a container) configurations. This configuration file contains the container image, ports, labels, replica count, etc.

- services.yaml

This provides connectivity between containers in the kubernetes eco-system.

- ingress.yaml

Ingress is a set of rules that direct external internet traffic to services in a kubernetes cluster.

- secrets.yaml

The secret is an SSL certificate to facilitate SSL connection. Enables https access.

## First time setup steps

- Install/setup kubectl, gcloud, docker, google cloud project

- Create a service acount with roles/storage.admin and roles/storage.admin roles 

- Create the k8s cluster
```bash
gcloud beta container --project “$PROJECT” clusters create “$CLUSTER” --zone “$ZONE”
```

- Create the k8s-configuration files

```bash
cd source/k8s-configurations

kubectl create -f services.yaml

kubectl create -f ingress.yaml 

kubectl create -f deployments.yaml 

kubectl create -f secrets.yaml
```

- Install Helm locally (Helm is a k8s package manager)
```bash
curl -o get_helm.sh https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get && chmod +x get_helm.sh && ./get_helm.sh && helm init
```

- Install Tiller in the k8s cluster to enable Helm to install packages in the k8s cluster

(Create a service account and configure cluster role binding for tiller)

Run this command:
```bash
kubectl create serviceaccount --namespace kube-system tiller && kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller && kubectl patch deploy --namespace kube-system tiller-deploy -p ‘{“spec”:{“template”:{“spec”:{“serviceAccount”:”tiller”}}}}’ && helm init --service-account tiller --upgrade
```

- Install nginx as ingress (load balancer) using helm

```bash
helm install --name nginx-ingress stable/nginx-ingress --set rbac.create=true
```

## References
https://medium.com/the-andela-way/how-to-host-an-application-on-gke-e95e7b1177eb