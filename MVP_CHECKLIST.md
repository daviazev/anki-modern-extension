# ✅ Checklist de Verificação - MVP Mode

## Para Você Testar Agora

### 1. Recarregar Extensão
- [ ] Ir para `chrome://extensions`
- [ ] Encontrar "AnkiModern - Modern Theme for AnkiWeb"
- [ ] Clicar no botão de recarregar 🔄

### 2. Testar Mock Login
- [ ] Clicar no ícone da extensão
- [ ] Ver botão "Sign in with Google"
- [ ] Clicar no botão
- [ ] Abrir DevTools (botão direito → Inspecionar popup)
- [ ] Verificar no console: `🎭 MVP Mode: Simulating Google Sign-In...`
- [ ] Verificar no console: `✅ Mock login successful!`
- [ ] Popup deve mostrar estado logado

### 3. Verificar Persistência
- [ ] Fechar popup
- [ ] Abrir popup novamente
- [ ] Ainda deve estar logado (dados em chrome.storage)

### 4. Testar no AnkiWeb (Se aplicável)
- [ ] Navegar para https://ankiweb.net
- [ ] Fazer login no AnkiWeb
- [ ] Verificar se tema está aplicado
- [ ] Abrir popup e mudar tema
- [ ] Verificar se mudanças são refletidas

### 5. Testar Logout (Se houver botão)
- [ ] Clicar em logout no popup
- [ ] Verificar console: `✅ Mock logout successful!`
- [ ] Deve voltar para tela de login

## 📋 Arquivos Criados

Verifique se estes arquivos existem:

- [ ] `FIREBASE_MIGRATION_PLAN.md` - Plano de migração completo
- [ ] `MVP_TESTING_GUIDE.md` - Guia de testes
- [ ] `MVP_SUMMARY.md` - Resumo das mudanças
- [ ] `README.md` - Atualizado com informações MVP

## 🔧 Código Modificado

Verifique se estes arquivos foram atualizados:

- [ ] `src/popup/context/AuthContext.tsx` - Mock auth implementado
- [ ] `src/lib/storage.ts` - Comentários de migração adicionados
- [ ] Build concluído sem erros

## 🎯 Comportamento Esperado

### ✅ O que DEVE funcionar:
- Login instantâneo (mock)
- Persistência entre sessões
- Logout funcional
- Storage local funcionando
- Build sem erros

### ❌ O que NÃO vai funcionar (por enquanto):
- Sincronização entre dispositivos
- Backup na nuvem
- Login real com Google OAuth
- Firestore

## 🐛 Se Algo Não Funcionar

### Login não funciona:
1. Abrir DevTools do popup
2. Verificar erros no console
3. Limpar storage: `chrome.storage.local.clear()`
4. Tentar novamente

### Build com erro:
1. Verificar se `@types/chrome` está instalado
2. Rodar `pnpm install`
3. Tentar `pnpm build` novamente

### Extensão não carrega:
1. Verificar se a pasta `build/chrome-mv3-prod` existe
2. Ir para `chrome://extensions`
3. Ativar "Modo desenvolvedor"
4. Clicar em "Carregar sem compactação"
5. Selecionar a pasta `build/chrome-mv3-prod`

## 📞 Próximos Passos

Após confirmar que tudo funciona:

1. **Desenvolver MVP:**
   - [ ] Implementar funcionalidades principais
   - [ ] Adicionar mais temas
   - [ ] Melhorar UI/UX
   - [ ] Adicionar customizações

2. **Testar com Usuários:**
   - [ ] Beta testing
   - [ ] Coletar feedback
   - [ ] Iterar baseado em feedback

3. **Preparar para Firebase:**
   - [ ] Publicar na Chrome Web Store
   - [ ] Seguir FIREBASE_MIGRATION_PLAN.md
   - [ ] Migrar dados de usuários

## 🎉 Tudo Funcionando?

Se sim, você está pronto para desenvolver o MVP sem bloqueios! 🚀

**Dúvidas?** Consulte:
- `MVP_TESTING_GUIDE.md` - Guia detalhado de testes
- `MVP_SUMMARY.md` - Resumo completo das mudanças
- `FIREBASE_MIGRATION_PLAN.md` - Plano de migração futura

---

**Status:** 🟢 Pronto para desenvolvimento MVP  
**Última atualização:** 21 de novembro de 2025
