# 🎨 Anki Modern Extension

Extensão do Google Chrome (Manifest V3) que moderniza o layout e funcionalidades do **AnkiWeb** e **AnkiUser** com sistema de temas modular e reutilizável.

---

## ✨ Características

- ✅ **Sistema de Temas Modular:** Crie novos temas apenas mudando variáveis
- ✅ **Suporte Multi-URL:** Cada tela tem sua lógica e estilos separados
- ✅ **Roteamento Inteligente:** Suporta URLs exatas, com IDs e aninhadas
- ✅ **Dois Domínios:** ankiweb.net + ankiuser.net
- ✅ **Isolamento Perfeito:** Nenhum elemento vaza para outras URLs
- ✅ **Templates Prontos:** Scripts para criar temas e adicionar URLs rapidamente

---

## 📁 Estrutura do Projeto

```
anki-modern-extension/
├── manifest.json                 # Configuração da extensão
├── src/
│   ├── loader.js                # Sistema de roteamento (URL → Tema)
│   └── background.js            # Service worker
├── popup/
│   ├── index.html               # Interface toggle on/off
│   └── popup.js                 # Lógica do popup
├── themes/
│   └── neumorphism/             # Tema Neumorphism (padrão)
│       ├── decks/               # Tema para /decks
│       │   ├── styles.css
│       │   └── logic.js
│       └── ...                  # (outras URLs no futuro)
└── .templates/                  # 🔧 Templates para criar temas
    ├── README.md                # Documentação dos templates
    ├── theme-structure/         # Estrutura completa de um tema
    │   ├── theme-config.json
    │   ├── shared/
    │   │   ├── base.css
    │   │   └── common.js
    │   └── url-template/
    │       ├── styles.css
    │       └── logic.js
    └── scripts/
        ├── create-theme.sh      # Cria novo tema
        └── add-url-support.sh   # Adiciona suporte para URL
```

---

## 🚀 Como Criar um Novo Tema

### Opção 1: Com Script (Recomendado)

```bash
cd .templates/scripts
./create-theme.sh "dracula" "Seu Nome"
```

Isso cria automaticamente:
- `themes/dracula/theme-config.json`
- `themes/dracula/shared/base.css`
- `themes/dracula/shared/common.js`

### Opção 2: Manual

1. Copie `.templates/theme-structure/` para `themes/seu-tema/`
2. Edite `theme-config.json` com suas cores e variáveis
3. Ajuste `shared/base.css` com as CSS variables
4. Atualize `src/loader.js`: `const theme = 'seu-tema';`

---

## 📝 Como Adicionar Suporte para Nova URL

### Passo 1: Adicione o Pattern no `src/loader.js`

```javascript
const URL_PATTERNS = [
  // ... patterns existentes ...
  { pattern: /^\/nova\/url$/, folder: 'nova-url', host: 'ankiweb.net' },
];
```

### Passo 2: Crie os Arquivos do Tema

**Opção A: Com Script**
```bash
cd .templates/scripts
./add-url-support.sh "neumorphism" "nova-url" "/nova/url"
```

**Opção B: Manual**
```bash
mkdir themes/neumorphism/nova-url
cp .templates/theme-structure/url-template/styles.css themes/neumorphism/nova-url/
cp .templates/theme-structure/url-template/logic.js themes/neumorphism/nova-url/
```

### Passo 3: Customize

Edite `logic.js` e `styles.css` com sua lógica específica.

---

## 🎯 URLs Suportadas (Mapeadas)

### ankiweb.net
- `/decks` → `decks/` ✅ (implementado)
- `/decks/share/:id` → `decks-share-id/`
- `/account/login` → `account-login/`
- `/account/media` → `account-media/`
- `/account/remove-account` → `account-remove-account/`
- `/account/reset-password` → `account-reset-password/`
- `/account/settings` → `account-settings/`
- `/account/signup` → `account-signup/`
- `/search` → `search/`
- `/shared/decks` → `shared-decks/`
- `/shared/mine` → `shared-mine/`

### ankiuser.net
- `/study` → `study/`
- `/study/options` → `study-options/`
- `/edit/:id` → `edit-id/`
- `/add` → `add/`

---

## 🔧 Arquitetura Técnica

### Sistema de Roteamento (`loader.js`)

1. Monitora mudanças de URL (SPA navigation)
2. Faz match do pathname com `URL_PATTERNS` (regex)
3. Remove CSS do tema anterior
4. Injeta CSS + JS da nova pasta
5. Cada tema gerencia seu próprio lifecycle

### Isolamento por URL

Cada `logic.js`:
- ✅ Encapsulado em IIFE (evita conflitos globais)
- ✅ Verifica URL antes de executar
- ✅ Monitor que limpa ao sair da URL (`clearInterval`)
- ✅ Remove elementos DOM no cleanup

### Variáveis Compartilhadas

- **CSS:** `shared/base.css` com CSS custom properties
- **JS:** `shared/common.js` com funções utilitárias via `window.AnkiModernShared`

---

## 🛠️ Desenvolvimento

### Instalar

1. Clone o repositório
2. Abra Chrome: `chrome://extensions/`
3. Ative "Modo do desenvolvedor"
4. Clique "Carregar sem compactação"
5. Selecione a pasta do projeto

### Testar

1. Acesse https://ankiweb.net/decks
2. O tema deve aplicar automaticamente
3. Navegue para outra URL → tema deve limpar
4. Volte para /decks → tema deve reaplicar

### Debug

Console do Chrome mostra:
```
LOADER INJETADO
URL ankiweb.net/decks → tema: decks
[Neumorphism] Carregando tema para decks...
[Neumorphism] ✓ Tema decks aplicado com sucesso!
```

---

## 📚 Recursos Úteis

- **Templates:** Ver `.templates/README.md`
- **Criar Tema:** `.templates/scripts/create-theme.sh`
- **Adicionar URL:** `.templates/scripts/add-url-support.sh`

---

## 🤝 Contribuindo

1. Crie um novo tema usando os templates
2. Adicione suporte para novas URLs
3. Documente suas mudanças
4. Faça um pull request

---

## 📄 Licença

MIT

---

## 👤 Autor

**Davi Azevedo**  
GitHub: [@daviazev](https://github.com/daviazev)

---

**Versão:** 1.0.0  
**Última atualização:** 23 de novembro de 2025
