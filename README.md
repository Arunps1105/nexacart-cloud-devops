# OrderFlow CI/CD – Order Management System

OrderFlow is a containerized order management application deployed on AWS EC2 with an automated CI/CD pipeline using GitHub, Jenkins, Docker, and SonarQube.

## 🚀 Project Overview

The application provides:

- User authentication
- Product management
- Inventory management
- Customer order placement
- Order history
- Order status management
- Admin dashboard
- User and role management

## 🛠️ Technologies Used

### Application
- React
- Django
- JavaScript
- Python

### DevOps
- Git
- GitHub
- Jenkins
- GitHub Webhooks
- Docker
- Docker Compose
- SonarQube

### Cloud
- AWS EC2
- AWS Security Groups

## 🔄 CI/CD Architecture

```text
Developer
   |
   v
GitHub Repository
   |
   | Push
   v
GitHub Webhook
   |
   v
Jenkins
   |
   | Build / Test / Deploy
   v
Docker / Docker Compose
   |
   v
AWS EC2
   |
   v
OrderFlow Application
