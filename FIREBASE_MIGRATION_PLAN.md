# Plano de Migração: localStorage → Firebase

## 📋 Decisão Técnica

**Data:** 21 de novembro de 2025  
**Decisão:** Adiar integração Firebase para fase pós-MVP

### Contexto

Durante o desenvolvimento inicial, encontramos complexidades na configuração OAuth para Chrome Extensions:
- `redirect_uri_mismatch` requer configuração precisa no Google Cloud Console
- Extension ID muda durante desenvolvimento local
- Processo de autenticação Firebase em extensões requer setup adicional

### Decisão

Para acelerar o desenvolvimento do MVP e focar nas funcionalidades principais da extensão, decidimos:

✅ **Usar `chrome.storage.local` temporariamente** para persistência de dados  
✅ **Manter todo código Firebase comentado/intacto** para migração futura fácil  
✅ **Simular autenticação** com mock para testar fluxo da aplicação  
✅ **Documentar processo de migração** para retomar quando MVP estiver pronto

## 🔄 Mudanças Implementadas

### 1. AuthContext (`src/popup/context/AuthContext.tsx`)

**ANTES:**
- Login real com Firebase via `chrome.identity.launchWebAuthFlow`
- Dependia de configuração OAuth correta
- Bloqueava desenvolvimento por problemas de configuração

**DEPOIS:**
- Login simulado (mock) que armazena estado no `localStorage`
- Firebase mantido mas não utilizado
- Desenvolvimento pode continuar sem bloqueios

### 2. Storage (`src/lib/storage.ts`)

**ANTES:**
- Dependia de Firestore para salvar/carregar dados

**DEPOIS:**
- Usa `chrome.storage.local` para persistência
- API mantida igual (mesmas funções)
- Migração para Firestore será transparente

### 3. Firebase Config (`src/lib/firebase.ts`)

**MANTIDO INTACTO:**
- Configuração Firebase preservada
- Credenciais no `.env` mantidas
- Pronto para ser reativado

## 📦 Código Firebase Mantido (Não Deletado)

### Arquivos Preservados:
```
src/lib/firebase.ts          ✅ Mantido
src/lib/firestore.ts         ✅ Mantido
.env                          ✅ Mantido
package.json (oauth2)         ✅ Mantido
client_secret_*.json          ✅ Mantido
OAUTH_SETUP.md               ✅ Mantido
TROUBLESHOOTING.md           ✅ Mantido
FIX_CLIENT_ID.md             ✅ Mantido
```

### Dependências Firebase:
```json
{
  "firebase": "^12.6.0"  ✅ Mantida no package.json
}
```

## 🎯 Estado Atual (MVP)

### Funcionalidades Usando localStorage:

1. **Autenticação**
   - Login simulado (mock user)
   - Estado persistido em `chrome.storage.local`
   - Logout funcional

2. **Temas**
   - Salvos em `chrome.storage.local`
   - Sincronizados entre popup e content script

3. **Configurações**
   - Preferências do usuário em `chrome.storage.local`
   - Mantém estado entre sessões

### Limitações Temporárias:

❌ **Sem sincronização entre dispositivos** (apenas local)  
❌ **Sem backup na nuvem**  
❌ **Dados perdidos ao desinstalar extensão**  
❌ **Sem autenticação real** (qualquer um pode "logar")

## 🚀 Plano de Migração Futura (Pós-MVP)

### Fase 1: Preparação (1-2 dias)

**1.1 Configurar OAuth Corretamente**
- [ ] Publicar extensão na Chrome Web Store (Extension ID fixo)
- [ ] Obter Extension ID permanente
- [ ] Criar OAuth Client no Google Cloud Console (tipo: Chrome Extension)
- [ ] Adicionar Redirect URI correto
- [ ] Testar autenticação

**1.2 Configurar Firebase**
- [ ] Verificar regras de segurança Firestore
- [ ] Habilitar Google Sign-In no Firebase Console
- [ ] Testar conexão Firebase

### Fase 2: Migração do Código (2-3 dias)

**2.1 Reativar Firebase Auth**

Em `src/popup/context/AuthContext.tsx`:

```typescript
// REMOVER (mock):
const mockUser = { uid: "mock-user", email: "user@example.com" }
await chrome.storage.local.set({ user: mockUser })

// REATIVAR (Firebase):
const responseUrl = await chrome.identity.launchWebAuthFlow({
  url: authUrl.toString(),
  interactive: true
})
const idToken = new URL(responseUrl).hash.match(/id_token=([^&]+)/)?.[1]
const credential = GoogleAuthProvider.credential(idToken)
await signInWithCredential(auth, credential)
```

**2.2 Migrar Storage para Firestore**

Em `src/lib/storage.ts`:

```typescript
// REMOVER (chrome.storage):
await chrome.storage.local.set({ themes })
const result = await chrome.storage.local.get('themes')

// REATIVAR (Firestore):
import { saveUserData, getUserData } from './firestore'
await saveUserData(userId, 'themes', themes)
const themes = await getUserData(userId, 'themes')
```

**2.3 Script de Migração de Dados**

Criar `scripts/migrate-to-firebase.ts` para:
- Ler dados do `chrome.storage.local`
- Fazer upload para Firestore
- Confirmar migração com usuário

### Fase 3: Testes (1-2 dias)

- [ ] Testar login/logout
- [ ] Testar sincronização entre dispositivos
- [ ] Testar persistência de temas
- [ ] Testar recovery de dados
- [ ] Testar offline mode

### Fase 4: Deploy (1 dia)

- [ ] Atualizar documentação
- [ ] Criar guia de migração para usuários
- [ ] Release notes
- [ ] Deploy gradual (beta → production)

## 📊 Comparação: Antes vs Depois

| Recurso | MVP (localStorage) | Pós-Migração (Firebase) |
|---------|-------------------|------------------------|
| Autenticação | Mock | Google OAuth real |
| Persistência | Local apenas | Nuvem + Local |
| Sincronização | ❌ Não | ✅ Multi-device |
| Backup | ❌ Não | ✅ Automático |
| Offline | ✅ Sim | ✅ Sim (cache) |
| Setup inicial | ⚡ Rápido | 🐌 Complexo |
| Desenvolvimento | ⚡ Ágil | 🐌 Requer config |

## 🔧 Configuração para Desenvolvimento

### Modo Atual (Mock):
```bash
# Apenas fazer build e testar
pnpm build
```

### Modo Futuro (Firebase):
```bash
# Adicionar flag de ambiente
FIREBASE_ENABLED=true pnpm build
```

## 📝 Checklist de Migração (Para o Futuro)

Quando estiver pronto para migrar:

### Pré-requisitos:
- [ ] MVP testado e funcional
- [ ] Extensão publicada na Chrome Web Store
- [ ] Extension ID permanente obtido
- [ ] OAuth configurado corretamente
- [ ] Firebase Console configurado

### Código:
- [ ] Descomentar chamadas Firebase no AuthContext
- [ ] Trocar chrome.storage por Firestore no storage.ts
- [ ] Remover mock user
- [ ] Adicionar error handling para falhas de rede
- [ ] Implementar modo offline

### Testes:
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Dados sincronizam entre dispositivos
- [ ] Dados persistem após reinstalação
- [ ] Funciona offline

### Deploy:
- [ ] Atualizar version no package.json
- [ ] Criar release notes
- [ ] Deploy na Chrome Web Store
- [ ] Monitorar erros

## 🎓 Lições Aprendidas

### O que deu certo:
✅ Separação clara entre auth e storage  
✅ Interfaces bem definidas facilitam migração  
✅ Firebase config mantido facilita retomada  
✅ Foco no MVP acelerou desenvolvimento

### O que melhorar na migração:
⚠️ Adicionar testes automatizados antes de migrar  
⚠️ Criar ambiente de staging para testar Firebase  
⚠️ Documentar processo de rollback caso algo dê errado  
⚠️ Implementar feature flags para ativar/desativar Firebase

## 📚 Recursos Úteis

- [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/identity/)
- [Firebase Auth para Chrome Extensions](https://firebase.google.com/docs/auth/web/chrome-extension)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Firestore para Web](https://firebase.google.com/docs/firestore/quickstart)

## 💡 Notas Finais

Esta decisão **não é um retrocesso**, é uma estratégia para:
- Focar no que importa: funcionalidades do MVP
- Evitar bloqueios por problemas de infraestrutura
- Manter código limpo e preparado para migração
- Entregar valor mais rápido aos usuários

A migração para Firebase será **rápida e suave** porque:
- Toda a estrutura já existe
- Interfaces estão definidas
- Código Firebase está preservado
- Documentação está completa

---

**Próxima revisão deste documento:** Quando MVP estiver 100% funcional e testado.
