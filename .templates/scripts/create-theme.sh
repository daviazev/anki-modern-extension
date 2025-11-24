#!/bin/bash

# ===================================
# Script para criar novo tema
# Uso: ./create-theme.sh "nome-do-tema" "Autor"
# ===================================

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Valida argumentos
if [ -z "$1" ]; then
  echo -e "${YELLOW}Uso: ./create-theme.sh \"nome-do-tema\" \"Autor (opcional)\"${NC}"
  exit 1
fi

THEME_NAME=$1
AUTHOR=${2:-"Seu Nome"}
THEME_DIR="../../themes/${THEME_NAME}"
TEMPLATE_DIR="../theme-structure"

echo -e "${BLUE}🎨 Criando novo tema: ${THEME_NAME}${NC}"

# Verifica se tema já existe
if [ -d "$THEME_DIR" ]; then
  echo -e "${YELLOW}⚠️  Tema '${THEME_NAME}' já existe em themes/${THEME_NAME}${NC}"
  read -p "Deseja sobrescrever? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operação cancelada."
    exit 1
  fi
  rm -rf "$THEME_DIR"
fi

# Cria estrutura do tema
echo -e "${BLUE}📁 Criando estrutura de pastas...${NC}"
mkdir -p "$THEME_DIR/shared"

# Copia arquivos base
echo -e "${BLUE}📄 Copiando arquivos template...${NC}"
cp "$TEMPLATE_DIR/theme-config.json" "$THEME_DIR/"
cp "$TEMPLATE_DIR/shared/base.css" "$THEME_DIR/shared/"
cp "$TEMPLATE_DIR/shared/common.js" "$THEME_DIR/shared/"

# Substitui placeholders
echo -e "${BLUE}✏️  Personalizando arquivos...${NC}"

# No config.json
sed -i "s/{{THEME_NAME}}/${THEME_NAME}/g" "$THEME_DIR/theme-config.json"
sed -i "s/{{THEME_DESCRIPTION}}/Tema ${THEME_NAME} para AnkiWeb/g" "$THEME_DIR/theme-config.json"
sed -i "s/{{AUTHOR_NAME}}/${AUTHOR}/g" "$THEME_DIR/theme-config.json"

# No base.css
sed -i "s/{{THEME_NAME}}/${THEME_NAME}/g" "$THEME_DIR/shared/base.css"

# No common.js
sed -i "s/{{THEME_NAME}}/${THEME_NAME}/g" "$THEME_DIR/shared/common.js"

echo -e "${GREEN}✓ Tema '${THEME_NAME}' criado com sucesso!${NC}"
echo ""
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "1. Edite themes/${THEME_NAME}/theme-config.json para ajustar cores e variáveis"
echo "2. Personalize themes/${THEME_NAME}/shared/base.css com os estilos do tema"
echo "3. Adicione suporte para URLs usando: ./add-url-support.sh \"${THEME_NAME}\" \"url-name\""
echo "4. Atualize src/loader.js para usar o novo tema: const theme = '${THEME_NAME}';"
echo ""
echo -e "${GREEN}✨ Pronto para usar!${NC}"
