
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment') {
            steps {
                withCredentials([
                    string(credentialsId: 'orderflow-env-b64', variable: 'ENV_B64')
                ]) {
                    sh 'echo "$ENV_B64" | base64 -d > .env'
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose --env-file .env build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose --env-file .env up -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker compose --env-file .env ps'
            }
        }
    }
}
