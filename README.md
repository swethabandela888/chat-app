# Chat App (Express + Socket.IO)

Minimal example chat application using Node.js, Express and Socket.IO. Includes Dockerfile and example Kubernetes manifests.

Getting started (local):

1. Install dependencies

   npm install

2. Run development server

   npm run dev

3. Open http://localhost:3000 in two browser windows and send messages.

Docker (build & run):

  docker build -t chat-app:latest .
  docker run -p 3000:3000 chat-app:latest

Kubernetes:

1. Build and push image to your container registry, update image in `k8s/deployment.yaml`.
2. Apply manifests:

   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/service.yaml

Notes:
- This is a minimal scaffold intended as a starting point. Add authentication, persistence, logging, and production tuning as needed.
