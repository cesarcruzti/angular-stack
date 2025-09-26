#!/bin/bash

cd "$(dirname "$0")"

cd others/docker/

./create-publish-image-docker.sh bff
./create-publish-image-docker.sh angular-app


cd ../charts

./helm-chart-generate-publish.sh bff
./helm-chart-generate-publish.sh angular-app