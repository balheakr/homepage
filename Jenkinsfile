pipeline {
  agent any

  environment {
    GITHUB_OWNER = 'balheakr'
    GITHUB_REPO  = 'homepage'
    RELEASE_TAG  = "neo-v${env.BUILD_NUMBER}"
    RELEASE_NAME = "Release ${env.BUILD_NUMBER}"
    RELEASE_BODY = "자동 배포 릴리즈\n빌드 번호: ${env.BUILD_NUMBER}"
  }

  stage('Replace cache busting') {
    when { branch 'neo/main' }
    steps {
      sh '''
        echo "Inject BUILD_NUMBER=${BUILD_NUMBER}"

        find . -name "*.html" -type f -print0 | \
        xargs -0 sed -i "s/__BUILD__/${BUILD_NUMBER}/g"
      '''
    }
  }

  stages {
    stage('Archive ZIP') {
      when { branch 'neo/main' }
      steps {
        sh '''
          zip -r release.zip . -x "*.git*" "Jenkinsfile" "*.DS_Store" "admin/*"
        '''
      }
    }

    stage('Create GitHub Release') {
      when { branch 'neo/main' }
      steps {
        withCredentials([string(credentialsId: 'portal_fe_release_token', variable: 'PORTAL_FE_RELEASE_TOKEN')]) {
            sh '''
                set -e
                REPO="${GITHUB_OWNER}/${GITHUB_REPO}"
                TAG="${RELEASE_TAG}"
                
                curl -i https://api.github.com/repos/balheakr/homepage \
                  -H "Authorization: Bearer ${PORTAL_FE_RELEASE_TOKEN}" \
                  -H "Accept: application/vnd.github+json"

                # 1) Node 로 JSON payload 생성 (자동 이스케이프)
                node -e '
                const data = {
                    tag_name: process.env.RELEASE_TAG,
                    name:     process.env.RELEASE_NAME,
                    body:     process.env.RELEASE_BODY,
                    target_commitish: "neo/main"

                };
                console.log(JSON.stringify(data));
                ' > payload.json

                echo "Payload:"
                cat payload.json

                # 2) 릴리즈 생성 (파일 전체를 본문으로)
                curl -s -X POST "https://api.github.com/repos/${REPO}/releases" \
                -H "Authorization: Bearer ${PORTAL_FE_RELEASE_TOKEN}" \
                -H "Content-Type: application/json" \
                -d @payload.json

                # 3) upload_url 파싱
                FULL_URL=$(curl -s \
                -H "Authorization: Bearer ${PORTAL_FE_RELEASE_TOKEN}" \
                "https://api.github.com/repos/${REPO}/releases/tags/${TAG}" \
                | grep '"upload_url"' \
                | head -n1 \
                | sed -E 's/.*"upload_url": *"([^"]+)".*/\\1/' \
                | sed 's/{.*//')

                echo "Uploading to: ${FULL_URL}?name=release-${TAG}.zip"

                # 4) ZIP 아티팩트 업로드
                curl -s --data-binary @release.zip \
                -H "Authorization: Bearer ${PORTAL_FE_RELEASE_TOKEN}" \
                -H "Content-Type: application/zip" \
                "${FULL_URL}?name=release.zip"
            '''
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
