#!/bin/bash

# Este script constrói a imagem Docker para uma aplicação específica (angular-app ou bff)
# e a envia para um registry Docker local.
# Ele foi projetado para ser executado de qualquer diretório.

# Aborta o script se qualquer comando falhar.
set -e

# --- Funções ---
# Mostra uma mensagem de uso se o script for chamado incorretamente.
usage() {
  echo "Uso: $0 [angular-app|bff]"
  echo "  angular-app: Constrói e envia a imagem do frontend Angular."
  echo "  bff: Constrói e envia a imagem do Backend For Frontend."
  exit 1
}

# --- Validação do Input ---
# Verifica se foi fornecido exatamente um argumento.
if [ "$#" -ne 1 ]; then
  echo "Erro: Número incorreto de argumentos."
  usage
fi

APP_TO_BUILD=$1

# --- Determina os Caminhos Absolutos ---
# Encontra o diretório onde o script está localizado.
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
# Define o diretório raiz do projeto, subindo dois níveis a partir do diretório do script.
PROJECT_ROOT=$(realpath "$SCRIPT_DIR/../../")

# --- Configurações ---
# O endereço do registry Docker.
REGISTRY_URL="localhost:5001"
# A tag da imagem.
IMAGE_TAG="1.0.0"

# --- Lógica de Build e Push ---
case "$APP_TO_BUILD" in
  angular-app)
    echo "Construindo a imagem para angular-app..."
    docker build -t "${REGISTRY_URL}/angular-app:${IMAGE_TAG}" -f "${PROJECT_ROOT}/Dockerfile-prod" "${PROJECT_ROOT}"
    
    echo "Enviando a imagem angular-app para o registry..."
    docker push "${REGISTRY_URL}/angular-app:${IMAGE_TAG}"
    echo "angular-app enviada com sucesso."
    ;;
  
  bff)
    echo "Construindo a imagem para bff..."
    docker build -t "${REGISTRY_URL}/bff:${IMAGE_TAG}" -f "${PROJECT_ROOT}/bff/Dockerfile" "${PROJECT_ROOT}/bff"
    
    echo "Enviando a imagem bff para o registry..."
    docker push "${REGISTRY_URL}/bff:${IMAGE_TAG}"
    echo "bff enviada com sucesso."
    ;;
  
  *)
    echo "Erro: Opção inválida '$APP_TO_BUILD'"
    usage
    ;;
esac

# --- Conclusão ---
echo "Script concluído. A imagem para ${APP_TO_BUILD} foi construída e enviada para ${REGISTRY_URL}."