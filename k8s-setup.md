# Docker + Kubernetes Setup


- Build the docker images
```
cd source/database

docker build -t $GCR_REGISTRY/$PROJECT/$DATABASE_DOCKER_IMG:v1 -f docker/Dockerfile .

cd source/backend/tripplanner

docker build -t $GCR_REGISTRY/$PROJECT/$BACKEND_DOCKER_IMG:v1 -f Dockerfile .

cd source/frontend

docker build -t $GCR_REGISTRY/$PROJECT/$FRONTEND_DOCKER_IMG:v1 -f Dockerfile .

```

- deployments.yaml

- services.yaml
- ingress.yaml
- secrets.yaml