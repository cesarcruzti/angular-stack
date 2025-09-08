#!/bin/bash

# Para o script se um comando falhar
set -e

# --- Configuração ---
# A URL do registry OCI onde o chart será publicado
REGISTRY_URL="oci://localhost:5001/helm-charts"

# --- Validação de Entrada ---
if [ -z "$1" ]; then
    echo "Erro: O caminho para o diretório do Helm chart não foi fornecido."
    echo "Uso: $0 <caminho-para-o-chart>"
    exit 1
fi

CHART_PATH=$1

if [ ! -d "${CHART_PATH}" ]; then
    echo "Erro: O diretório do chart '${CHART_PATH}' não foi encontrado."
    exit 1
fi

# --- Lógica do Script ---

echo "Empacotando o Helm chart do diretório: ${CHART_PATH}"

# Empacota o chart. Isso cria um arquivo .tgz no diretório atual.
# A saída deste comando contém o caminho para o pacote criado.
PACKAGE_OUTPUT=$(helm package "${CHART_PATH}")
CHART_PACKAGE_PATH=$(echo "${PACKAGE_OUTPUT}" | awk -F': ' '{print $2}')

if [ ! -f "${CHART_PACKAGE_PATH}" ]; then
    echo "Erro: O pacote Helm não foi criado com sucesso em '${CHART_PACKAGE_PATH}'"
    exit 1
fi

echo "Chart empacotado com sucesso: ${CHART_PACKAGE_PATH}"

echo "Enviando o chart para o registry: ${REGISTRY_URL}"

# Envia o pacote do chart para o registry OCI
helm push "${CHART_PACKAGE_PATH}" "${REGISTRY_URL}"

echo "Chart ${CHART_PACKAGE_PATH} enviado com sucesso para ${REGISTRY_URL}"

# Limpa o arquivo do pacote local
echo "Limpando o arquivo de pacote local: ${CHART_PACKAGE_PATH}"
rm "${CHART_PACKAGE_PATH}"

echo "Processo concluído."