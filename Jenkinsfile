pipeline {
    environment {
     DOCKER_COMPOSE_PATH = '/home/testarmy/projekty/magento/docker-compose.yml'
    }

    agent any

    triggers { 
        pollSCM('H H * * *') 
        cron('H 5 * * *')
    }

    stages {
        stage('Build') {
            steps {
                slackSend baseUrl: 'https://hooks.slack.com/services/', channel: 'lodz_jenkins', color: 'warning', message: "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} just started.", teamDomain: 'testarmy', tokenCredentialId: 'slack-demo'
                sh "docker-compose -f ${DOCKER_COMPOSE_PATH} down"
                echo "Running images from ${DOCKER_COMPOSE_PATH} file..."
                sh "docker-compose -f ${DOCKER_COMPOSE_PATH} up -d"
            }
        }
        stage('Install') {
            steps {
                sh 'sleep 15'
                echo "Installing magento..."
                sh 'docker exec magento_web_1 install-magento'
                sh 'sleep 60'
                sh 'docker exec magento_web_1 bin/magento config:set admin/security/use_form_key 0'
            }
        }
        stage('Test') {
            steps {
                echo "Running tests..."
                sh 'docker run --rm --add-host=local.magento:172.17.0.1 --mount type=bind,src=${WORKSPACE},dst="/home/circleci" angular/ngcontainer -c "npm install && npm run webdriver-update-ci && xvfb-run --server-args=\'-screen 0 1920x1080x24\' npm run magento-login"'
            }
        }
        stage('Clean') {
            steps {
                sh "docker-compose -f ${DOCKER_COMPOSE_PATH} down"
            }
        }    
    }
    post { 
        always { 
            slackSend baseUrl: 'https://hooks.slack.com/services/', channel: 'lodz_jenkins', color: 'warning', message: "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} just ended.", teamDomain: 'testarmy', tokenCredentialId: 'slack-demo'
            script {
                if ( currentBuild.currentResult == "SUCCESS" ) {
                slackSend baseUrl: 'https://hooks.slack.com/services/', channel: 'lodz_jenkins', color: 'good', message: "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} was successful!", teamDomain: 'testarmy', tokenCredentialId: 'slack-demo'
                }
                else { 
                    slackSend baseUrl: 'https://hooks.slack.com/services/', channel: 'lodz_jenkins', color: 'danger', message: "Job: ${env.JOB_NAME} with build number ${env.BUILD_NUMBER} was failed", teamDomain: 'testarmy', tokenCredentialId: 'slack-demo'
                }
            }
        }
    }
}