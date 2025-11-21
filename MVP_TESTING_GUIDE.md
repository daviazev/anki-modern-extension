# Guia de Teste - Modo MVP (Mock Auth)

## ✅ Build Concluído

A extensão foi adaptada para funcionar sem Firebase durante o desenvolvimento do MVP.

## 🧪 Como Testar

### 1. Recarregar a Extensão

1. Vá para `chrome://extensions`
2. Encontre "AnkiModern - Modern Theme for AnkiWeb"
3. Clique no botão de **recarregar** 🔄

### 2. Testar Login Mock

1. Clique no ícone da extensão na barra de ferramentas
2. Você verá o popup com botão "Sign in with Google"
3. Clique no botão
4. **Abra o DevTools** (botão direito → Inspecionar popup)
5. No console, você deve ver:

```
🎭 MVP Mode: Simulating Google Sign-In...
✅ Mock login successful! {uid: "mock-...", email: "user@example.com", ...}
```

6. O popup deve mostrar que você está logado

### 3. Testar Persistência

1. Feche o popup
2. Abra novamente
3. Você deve continuar logado (dados salvos em `chrome.storage.local`)

### 4. Testar Logout

1. Com o popup aberto, clique em "Logout" (se houver o botão)
2. No console, você deve ver:

```
✅ Mock logout successful!
```

3. Você deve voltar para a tela de login

### 5. Testar Funcionalidades da Extensão

1. Navegue para: https://ankiweb.net
2. Faça login na sua conta AnkiWeb
3. Vá para uma página de estudo ou deck
4. Verifique se o tema está sendo aplicado
5. Abra o popup e mude o tema
6. Verifique se as mudanças são aplicadas em tempo real

## 🔍 Verificar chrome.storage

Para ver os dados salvos:

1. Vá para `chrome://extensions`
2. Encontre "AnkiModern"
3. Clique em "inspecionar visualizações: service worker" ou "background page"
4. No console, execute:

```javascript
chrome.storage.local.get(null, (data) => console.log(data))
```

Você deve ver algo como:
```json
{
  "mockUser": {
    "uid": "mock-1732219800000",
    "email": "user@example.com",
    "displayName": "MVP User",
    "photoURL": "https://via.placeholder.com/150"
  },
  "theme": "dark",
  "customColors": {...}
}
```

## 🐛 Possíveis Problemas

### Problema: "Cannot find name 'chrome'"
**Solução:** Certifique-se de que `@types/chrome` está instalado:
```bash
pnpm install --save-dev @types/chrome
```

### Problema: Login não funciona
**Solução:** 
1. Abra o console do popup (botão direito → Inspecionar)
2. Verifique se há erros
3. Tente limpar o storage:
```javascript
chrome.storage.local.clear()
```

### Problema: Tema não aplica
**Solução:**
1. Verifique se você está em uma página do AnkiWeb (ankiweb.net ou ankiuser.net)
2. Recarregue a página
3. Verifique o console da página (F12)

## ✨ Próximos Passos

Depois de confirmar que tudo funciona:

1. ✅ Desenvolver funcionalidades principais do MVP
2. ✅ Adicionar mais temas e customizações
3. ✅ Melhorar UI/UX
4. ✅ Testes com usuários
5. 🔜 Migrar para Firebase (quando MVP estiver pronto)

## 📚 Documentação Relacionada

- **FIREBASE_MIGRATION_PLAN.md** - Plano completo de migração para Firebase
- **OAUTH_SETUP.md** - Setup OAuth (para uso futuro)
- **TROUBLESHOOTING.md** - Troubleshooting geral

## 💡 Dicas de Desenvolvimento

### Modo Debug
Para ver todos os logs, mantenha o DevTools aberto enquanto desenvolve.

### Hot Reload
O Plasmo tem hot reload automático durante desenvolvimento:
```bash
pnpm dev
```

### Testar em Múltiplos Sites
A extensão funciona em:
- https://ankiweb.net/*
- https://ankiuser.net/*

### Limpar Dados para Testar do Zero
```javascript
// No console do background/popup
chrome.storage.local.clear()
chrome.storage.sync.clear()
```

## 🎉 Sucesso!

Se você conseguiu fazer login (mock) e ver o tema aplicado no AnkiWeb, está tudo funcionando!

Agora você pode focar em desenvolver as funcionalidades principais do MVP sem se preocupar com Firebase. 🚀
