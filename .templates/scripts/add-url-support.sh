#!/bin/bash

# ===================================
# Script para adicionar suporte a nova URL
# Uso: ./add-url-support.sh "tema" "url-name" "/url/esperada"
# Exemplo: ./add-url-support.sh "neumorphism" "account-settings" "/account/settings"
# ===================================

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Valida argumentos
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo -e "${YELLOW}Uso: ./add-url-support.sh \"tema\" \"url-name\" \"/url/esperada\"${NC}"
  echo ""
  echo "Exemplos:"
  echo "  ./add-url-support.sh \"neumorphism\" \"account-settings\" \"/account/settings\""
  echo "  ./add-url-support.sh \"neumorphism\" \"edit-id\" \"/edit/\\d+\" (com regex)"
  exit 1
fi

THEME_NAME=$1
URL_NAME=$2
EXPECTED_URL=$3
THEME_DIR="../../themes/${THEME_NAME}"
URL_DIR="${THEME_DIR}/${URL_NAME}"
TEMPLATE_DIR="../theme-structure/url-template"

echo -e "${BLUE}🔧 Adicionando suporte para URL: ${URL_NAME}${NC}"

# Verifica se tema existe
if [ ! -d "$THEME_DIR" ]; then
  echo -e "${YELLOW}⚠️  Tema '${THEME_NAME}' não existe!${NC}"
  echo "Crie o tema primeiro com: ./create-theme.sh \"${THEME_NAME}\""
  exit 1
fi

# Verifica se URL já existe
if [ -d "$URL_DIR" ]; then
  echo -e "${YELLOW}⚠️  URL '${URL_NAME}' já existe em ${URL_DIR}${NC}"
  read -p "Deseja sobrescrever? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operação cancelada."
    exit 1
  fi
  rm -rf "$URL_DIR"
fi

# Cria pasta da URL
echo -e "${BLUE}📁 Criando pasta ${URL_NAME}...${NC}"
mkdir -p "$URL_DIR"

# Copia templates
echo -e "${BLUE}📄 Copiando templates...${NC}"
cp "$TEMPLATE_DIR/styles.css" "$URL_DIR/"
cp "$TEMPLATE_DIR/logic.js" "$URL_DIR/"

# Substitui placeholders
echo -e "${BLUE}✏️  Personalizando arquivos...${NC}"

# No styles.css
sed -i "s/{{THEME_NAME}}/${THEME_NAME}/g" "$URL_DIR/styles.css"
sed -i "s/{{URL_NAME}}/${URL_NAME}/g" "$URL_DIR/styles.css"

# No logic.js
sed -i "s/{{THEME_NAME}}/${THEME_NAME}/g" "$URL_DIR/logic.js"
sed -i "s/{{URL_NAME}}/${URL_NAME}/g" "$URL_DIR/logic.js"
sed -i "s|{{EXPECTED_URL}}|${EXPECTED_URL}|g" "$URL_DIR/logic.js"
sed -i "s/{{CONTAINER_ID}}/custom-interface-${URL_NAME}/g" "$URL_DIR/logic.js"

echo -e "${GREEN}✓ Suporte para ${URL_NAME} adicionado com sucesso!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "1. Adicione o pattern no src/loader.js:"
echo "   { pattern: /REGEX_AQUI/, folder: '${URL_NAME}', host: 'ankiweb.net' },"
echo ""
echo "2. Personalize os arquivos:"
echo "   - themes/${THEME_NAME}/${URL_NAME}/styles.css"
echo "   - themes/${THEME_NAME}/${URL_NAME}/logic.js"
echo ""
echo -e "${GREEN}✨ Pronto para desenvolver!${NC}"
