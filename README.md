# Portfolio Ayala – Full DevOps Project  
Full-stack application with a complete CI/CD pipeline deployed on AWS EKS using Terraform + Kubernetes.

This repository contains:
- The Node.js application (Express + MongoDB)
- Docker configuration
- GitHub Actions CI & CD pipelines
- Full Kubernetes manifests
- Architecture diagram and deployment screenshots

---

# 📌 System Architecture

![System Architecture](./assets/system-architecture.png)

This diagram shows the entire flow:
- Developer pushes to GitHub  
- CI pipeline builds, tests, scans and publishes Docker images  
- CD pipeline deploys to EKS  
- AWS infrastructure: VPC, ECR, EKS, Load Balancer  
- Users access the application via ELB

---

# 🚀 CI Pipeline (GitHub Actions)

The CI workflow runs automatically on every push to `main`.

It performs:
1. **Pull**  
2. **Build** Docker image  
3. **Unit Test**  
4. **e2e Test** using docker-compose  
5. **Publish** image to Amazon ECR (latest + SHA tag)

### CI Screenshot  
![CI](./assets/ci.png)

---

# 🚀 CD Pipeline (GitHub Actions)

The CD workflow runs **automatically after CI succeeds**.

Steps:
1. GitHub assumes IAM Role using **OIDC**  
2. Builds the ECR image URI using commit SHA  
3. Updates kubeconfig for EKS  
4. Deploys the new version using:  
kubectl set image ...
kubectl rollout status ...

yaml
Copy code

### CD Screenshot  
![CD](./assets/cd.png)

---

# 🧱 AWS Infrastructure (Terraform)

Infrastructure is created in a separate repo (`portfolio-ayala-infra`), but relevant screenshots are included below.

### EKS Cluster  
![EKS Cluster](./assets/eks-cluster.png)

### Node Group  
![Node Group](./assets/node-group.png)

### ECR Repository  
![ECR](./assets/ecr.png)

---

# ☸ Kubernetes Deployment

The Kubernetes manifests (in `portfolio-ayala-cluster`) deploy:

- **API Deployment**  
- **Service (LoadBalancer)**  
- **MongoDB StatefulSet**

### kubectl get all  
![kubectl get all](./assets/kubectl-get-all.png)

### portfolio-api Service (LoadBalancer)  
![kubectl get svc 1](./assets/kubectl-get-svc-1.png)  
![kubectl get svc 2](./assets/kubectl-get-svc-2.png)

### AWS Load Balancer  
![Load Balancer](./assets/load-balancer.png)

---

# 🌍 Application Running in Production

Here is the application live through the AWS Load Balancer:

![App Running](./assets/app-running.png)

---

# 🧪 Run Locally

### ▶️ Run with Node.js

`npm install`
`npm run dev`

### ▶️ Run with Docker

`docker compose up`

### 📦 Deployment Flow Summary

1. Developer pushes new code
2. CI pipeline builds, tests, and publishes Docker images
3. Image is uploaded to Amazon ECR
4. CD workflow deploys the new version to EKS
5. Load Balancer exposes the updated application
6. Users access the app through the ELB DNS name

### 👩‍💻 Author
### Ayala Darshan
Full-Stack & DevOps Developer

GitHub: https://github.com/AyalaDa2020
