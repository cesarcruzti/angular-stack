#!/bin/bash

# Este script constrói as imagens Docker para a aplicação Angular (frontend)
# e para o BFF (Backend For Frontend), e depois as envia para um registry Docker local.
# Ele foi projetado para ser executado de qualquer diretório.

# Aborta o script se qualquer comando falhar.
set -e

# --- Determina os Caminhos Absolutos ---
# Encontra o diretório onde o script está localizado.
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
# Define o diretório raiz do projeto, subindo dois níveis a partir do diretório do script.
PROJECT_ROOT=$(realpath "$SCRIPT_DIR/../../")

# --- Configurações ---
# O endereço do registry Docker.
REGISTRY_URL="localhost:5001"

# Nomes das imagens.
APP_IMAGE_NAME="angular-app"
BFF_IMAGE_NAME="bff"

# A tag da imagem.
IMAGE_TAG="1.0.0"

# --- Construção e Envio da Imagem do Frontend (Angular) ---
echo "Construindo a imagem para ${APP_IMAGE_NAME}..."
# Usa caminhos absolutos para o Dockerfile e o contexto de build.
docker build -t "${REGISTRY_URL}/${APP_IMAGE_NAME}:${IMAGE_TAG}" -f "${PROJECT_ROOT}/Dockerfile" "${PROJECT_ROOT}"

echo "Enviando a imagem ${APP_IMAGE_NAME} para o registry..."
docker push "${REGISTRY_URL}/${APP_IMAGE_NAME}:${IMAGE_TAG}"
echo "${APP_IMAGE_NAME} enviada com sucesso."

# --- Construção e Envio da Imagem do BFF ---
echo "Construindo a imagem para ${BFF_IMAGE_NAME}..."
# Usa caminhos absolutos para o Dockerfile do BFF e o contexto de build.
docker build -t "${REGISTRY_URL}/${BFF_IMAGE_NAME}:${IMAGE_TAG}" -f "${PROJECT_ROOT}/bff/Dockerfile" "${PROJECT_ROOT}/bff"

echo "Enviando a imagem ${BFF_IMAGE_NAME} para o registry..."
docker push "${REGISTRY_URL}/${BFF_IMAGE_NAME}:${IMAGE_TAG}"
echo "${BFF_IMAGE_NAME} enviada com sucesso."

# --- Conclusão ---
echo "Script concluído. Todas as imagens foram construídas e enviadas para ${REGISTRY_URL}."