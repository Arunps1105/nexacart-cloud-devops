\# NexaCart Cloud DevOps Capstone Documentation



\## 1. Project Overview



NexaCart is a cloud-native e-commerce application deployed using modern DevOps and cloud technologies.



The project demonstrates the complete lifecycle of deploying, automating, securing, monitoring, backing up, and maintaining a containerized application on AWS.



\### Main Technologies



\- AWS

\- Amazon VPC

\- Amazon EKS

\- Kubernetes

\- Docker

\- Terraform

\- Ansible

\- GitHub

\- GitHub Actions

\- Argo CD

\- Prometheus

\- Grafana

\- Loki

\- Grafana Alloy

\- AWS Secrets Manager

\- External Secrets Operator

\- AWS Certificate Manager

\- Application Load Balancer

\- PostgreSQL

\- Nginx



\---



\# 2. Project Objectives



The primary objectives of NexaCart are:



1\. Containerize the application using Docker.

2\. Deploy the application to Amazon EKS.

3\. Provision cloud infrastructure using Terraform.

4\. Automate configuration using Ansible.

5\. Implement CI/CD using GitHub Actions and GitOps using Argo CD.

6\. Expose the application using an AWS Application Load Balancer.

7\. Configure HTTPS using AWS Certificate Manager.

8\. Implement centralized logging.

9\. Implement application and infrastructure monitoring.

10\. Secure database credentials using AWS Secrets Manager.

11\. Implement database backup and recovery.

12\. Demonstrate high availability and disaster recovery considerations.



\---



\# 3. High-Level Architecture



```mermaid

flowchart TB



&#x20;   User\["Internet User"]



&#x20;   ALB\["AWS Application Load Balancer<br/>HTTP 80 / HTTPS 443"]



&#x20;   EKS\["Amazon EKS Cluster"]



&#x20;   FE\["Frontend Pods<br/>2 Replicas"]

&#x20;   BE\["Backend Pods<br/>2 Replicas"]

&#x20;   DB\["PostgreSQL<br/>Persistent Storage"]



&#x20;   Prom\["Prometheus"]

&#x20;   Graf\["Grafana"]

&#x20;   Loki\["Loki"]

&#x20;   Alloy\["Grafana Alloy"]



&#x20;   SM\["AWS Secrets Manager"]

&#x20;   ESO\["External Secrets Operator"]



&#x20;   S3\["Amazon S3<br/>Database Backups"]



&#x20;   User --> ALB

&#x20;   ALB --> FE

&#x20;   ALB --> BE

&#x20;   BE --> DB



&#x20;   SM --> ESO

&#x20;   ESO --> BE



&#x20;   FE --> Prom

&#x20;   BE --> Prom

&#x20;   DB --> Prom



&#x20;   Alloy --> Loki

&#x20;   FE --> Alloy

&#x20;   BE --> Alloy

&#x20;   DB --> Alloy



&#x20;   Prom --> Graf

&#x20;   Loki --> Graf



&#x20;   DB --> S3

