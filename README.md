 # NexaCart CI/CD – Cloud DevOps Project

NexaCart is a containerized order management application deployed on **AWS EKS** with an automated **CI/CD and GitOps workflow** using GitHub Actions, Amazon ECR, Kubernetes, and Argo CD.

The project also includes Kubernetes monitoring and alerting using **Prometheus, Grafana, and Alertmanager**.

---

## 🚀 Project Overview

NexaCart provides:

- User authentication
- Product management
- Inventory management
- Customer order placement
- Order history
- Order status management
- Admin dashboard
- User management
- REST API backend
- React frontend

The application is containerized with Docker and deployed to Kubernetes running on Amazon EKS.

---

## 🏗️ Architecture

```text
                        Developer
                            |
                            v
                       GitHub Repo
                            |
                            v
                    GitHub Actions
                   /       |       \
                  /        |        \
             Build      Test      Docker
                                   |
                                   v
                              Amazon ECR
                            /           \
                           /             \
                    Backend Image    Frontend Image
                           \             /
                            \           /
                             v         v
                         Argo CD / GitOps
                                |
                                v
                         Amazon EKS Cluster
                                |
                    +-----------+-----------+
                    |                       |
                    v                       v
               Frontend Pods           Backend Pods
                    |                       |
                    |                       v
                    |                 PostgreSQL
                    |
                    v
               AWS ALB Ingress
                    |
                    v
                  Users


Monitoring:

Kubernetes
    |
    v
Prometheus
    |
    +------> Grafana Dashboards
    |
    +------> Alertmanager
                  |
                  v
                Email
