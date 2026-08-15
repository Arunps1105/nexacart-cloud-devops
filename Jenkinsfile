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
                withCredentials([string(credentialsId: 'orderflow-env', variable: 'ENV_FILE')]) {
                    writeFile file: '.env', text: ENV_FILE
                }
            }
        }

        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Verify') {
            steps {
                sh 'docker compose ps'
            }
        }
    }
}
