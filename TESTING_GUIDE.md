# 🧪 Guia de Teste Rápido

## ⚡ Quick Start

### 1. Build & Carregar

```bash
cd /home/davi-azevedo/repos/anki-modern-extension

# Desenvolvimento (com hot reload)
pnpm dev

# OU Produção
pnpm build
```

### 2. Carregar no Chrome

1. Abra Chrome: `chrome://extensions/`
2. Ative **"Modo do desenvolvedor"** (canto superior direito)
3. Clique em **"Carregar sem compactação"**
4. Selecione: `build/chrome-mv3-dev/` (ou `chrome-mv3-prod/`)

---

## ✅ Checklist de Testes

### Teste 1: Content Script Carregado
- [ ] Acesse `https://ankiweb.net/`
- [ ] Abra DevTools (F12) → Console
- [ ] Procure: `[Anki Modern] ✓ Extensão carregada com sucesso!`
- [ ] **Esperado**: Mensagem aparece ✅

### Teste 2: CSS Injetado
- [ ] No AnkiWeb, abra DevTools → Elements
- [ ] Inspecione `<html>` tag
- [ ] Verifique atributo: `data-theme="academic"` ou `data-theme="focus"`
- [ ] Inspecione `<head>`
- [ ] Procure por tags `<style id="anki-modern-extension-*">`
- [ ] **Esperado**: 4 tags style (theme, global, navbar, deck-list) ✅

### Teste 3: Visual Aplicado
- [ ] Navbar deve ter **blur effect** (fundo translúcido)
- [ ] Navbar deve estar **sticky** (fixa no topo ao rolar)
- [ ] Lista de decks deve estar com **cards flutuantes**
- [ ] Contadores devem ter **badges coloridos** (azul/vermelho/verde)
- [ ] Fonte deve ser **Inter** (não a padrão do Bootstrap)
- [ ] **Esperado**: Visual moderno aplicado ✅

### Teste 4: Popup Funcionando
- [ ] Clique no ícone da extensão (canto superior direito)
- [ ] Popup abre
- [ ] Veja seção **"AnkiWeb Theme"**
- [ ] Mostra tema atual com emoji (☀️ Academic ou 🌙 Focus)
- [ ] **Esperado**: UI do popup aparece ✅

### Teste 5: Alternar Tema via Popup
- [ ] No popup, clique em **"Alternar"**
- [ ] AnkiWeb deve mudar de tema **instantaneamente**
- [ ] Console deve mostrar: `[Anki Modern] Tema alternado via popup: ...`
- [ ] Feche e reabra o popup → tema deve persistir
- [ ] **Esperado**: Tema alterna e salva ✅

### Teste 6: Botões Individuais
- [ ] No popup, clique em **"☀️ Academic"**
- [ ] AnkiWeb muda para Light theme
- [ ] Clique em **"🌙 Focus"**
- [ ] AnkiWeb muda para Dark theme
- [ ] **Esperado**: Cada botão define tema específico ✅

### Teste 7: Atalho de Teclado
- [ ] No AnkiWeb, pressione `Ctrl + Shift + T`
- [ ] Tema deve alternar
- [ ] **Notificação** aparece no canto superior direito
- [ ] Mensagem: "Tema alterado: Academic (Light)" ou "Focus (Dark)"
- [ ] Notificação desaparece após 3 segundos
- [ ] **Esperado**: Atalho funciona + notificação aparece ✅

### Teste 8: Scroll Effect na Navbar
- [ ] No AnkiWeb, role a página para baixo
- [ ] Navbar deve ter **mais blur** (classe `.scrolled` adicionada)
- [ ] Role para cima
- [ ] Blur volta ao normal
- [ ] **Esperado**: Efeito de scroll funciona ✅

### Teste 9: Persistência (Recarregar Página)
- [ ] Alterne o tema para "Focus" (dark)
- [ ] Recarregue a página (F5)
- [ ] **Esperado**: Tema "Focus" continua aplicado ✅
- [ ] Alterne para "Academic"
- [ ] Recarregue novamente
- [ ] **Esperado**: Tema "Academic" continua aplicado ✅

### Teste 10: Múltiplas Abas
- [ ] Abra 2 abas do AnkiWeb
- [ ] Na aba 1, alterne o tema para "Focus"
- [ ] Vá para aba 2 e recarregue (F5)
- [ ] **Esperado**: Aba 2 também carrega com "Focus" ✅

---

## 🐛 Troubleshooting

### Problema: Console mostra erro "Cannot find module"
**Solução**: 
```bash
pnpm install
pnpm dev
```

### Problema: CSS não aparece no AnkiWeb
**Checklist**:
1. Extensão está habilitada? (`chrome://extensions/`)
2. Está na URL correta? (`ankiweb.net/*`)
3. Content script foi injetado? (veja console)
4. Recarregue a extensão: `chrome://extensions/` → botão reload

### Problema: Popup não comunica com content script
**Checklist**:
1. Está testando em uma aba do AnkiWeb?
2. Content script carregou? (veja console da aba)
3. Tente recarregar a aba do AnkiWeb (F5)

### Problema: Tema não persiste
**Checklist**:
1. Verifique `chrome.storage.local`:
   - DevTools da extensão → Application → Storage → Local Storage
   - Procure por chave `anki-modern-theme`
2. Se não aparecer, pode haver erro ao salvar (veja console)

---

## 📊 Teste Visual Completo

### Academic Theme (Light)
```
Background: Branco (#FFFFFF)
Cards: Cinza muito claro (#F7F7F5)
Texto: Preto acinzentado (#37352F)
Accent: Azul Anki (#2EAADC)
Badges: Azul/Vermelho/Verde vibrantes
```

### Focus Theme (Dark)
```
Background: Preto (#1E1E1E)
Cards: Cinza escuro (#252526)
Texto: Cinza claro (#D4D4D4)
Accent: Roxo suave (#BB86FC)
Badges: Azul/Vermelho/Verde com mais contraste
```

---

## 🎯 Teste de Regressão (Antes de Deploy)

- [ ] Build de produção funciona: `pnpm build`
- [ ] Sem erros TypeScript: `pnpm tsc --noEmit`
- [ ] Content script carrega no AnkiWeb
- [ ] Popup abre e funciona
- [ ] Tema alterna (popup + keyboard)
- [ ] Tema persiste (reload)
- [ ] Notificações aparecem
- [ ] Navbar scroll effect funciona
- [ ] Visual em ambos os temas (Academic + Focus)
- [ ] Sem erros no console

---

## 🚀 Deploy Checklist

- [ ] Todos os testes passam ✅
- [ ] Versão atualizada no `manifest.json`
- [ ] Build de produção: `pnpm build`
- [ ] Zipar: `cd build/chrome-mv3-prod && zip -r ../extension.zip .`
- [ ] Testar extensão zipada no Chrome
- [ ] Upload para Chrome Web Store

---

## 📝 Notas

- **Tempo estimado de teste completo**: ~10 minutos
- **Browser recomendado**: Chrome 120+ ou Edge 120+
- **Resolução mínima**: 1280x720
- **Internet**: Necessária (fonts do Google)

---

## ✅ Quick Test (2 minutos)

Se não tem tempo, faça apenas:

1. ✅ `pnpm dev`
2. ✅ Carregar extensão no Chrome
3. ✅ Abrir `ankiweb.net`
4. ✅ Pressionar `Ctrl + Shift + T`
5. ✅ Ver tema alternar + notificação

**Se funcionar, está tudo OK!** 🎉
