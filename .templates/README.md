# 🎨 Templates para Criação de Temas

Esta pasta contém **templates genéricos** para criar novos temas e adicionar suporte para novas URLs.

## 📁 Estrutura

```
.templates/
├── README.md                    # Este arquivo
├── theme-structure/             # Estrutura completa de um tema
│   ├── theme-config.json        # Configuração do tema (cores, sombras, etc)
│   ├── shared/                  # Código compartilhado entre URLs
│   │   ├── base.css             # CSS base com variáveis
│   │   └── common.js            # Funções utilitárias JS
│   └── url-template/            # Template para cada URL
│       ├── styles.css           # Estilos específicos da URL
│       └── logic.js             # Lógica específica da URL
└── scripts/
    └── create-theme.sh          # Script para criar novo tema
```

---

## 🚀 Como Criar um Novo Tema

### Opção 1: Manual

1. Copie a pasta `theme-structure/` para `themes/{nome-do-tema}/`
2. Renomeie e ajuste os arquivos
3. Configure as variáveis em `theme-config.json`
4. Atualize o `loader.js` para usar o novo tema

### Opção 2: Com Script (futuro)

```bash
./templates/scripts/create-theme.sh "meu-tema"
```

---

## 📝 Como Adicionar Suporte para Nova URL

### 1️⃣ Adicione o pattern no `src/loader.js`:

```javascript
const URL_PATTERNS = [
  // ... patterns existentes ...
  { pattern: /^\/nova\/url$/, folder: 'nova-url', host: 'ankiweb.net' },
  { pattern: /^\/outra\/\d+$/, folder: 'outra-id', host: 'ankiuser.net' },
];
```

### 2️⃣ Crie a pasta no tema:

```bash
mkdir themes/neumorphism/nova-url
cp .templates/theme-structure/url-template/styles.css themes/neumorphism/nova-url/
cp .templates/theme-structure/url-template/logic.js themes/neumorphism/nova-url/
```

### 3️⃣ Customize os arquivos:

- Ajuste `EXPECTED_URL` no `logic.js`
- Adicione estilos específicos no `styles.css`

---

## 🎯 Convenção de Nomenclatura

### Pastas:
- URL: `/decks` → Pasta: `decks/`
- URL: `/account/settings` → Pasta: `account-settings/`
- URL: `/decks/share/123` → Pasta: `decks-share-id/`
- URL: `/edit/123` → Pasta: `edit-id/`

**Regra:** Substitua `/` por `-` e use sufixo `-id` para URLs com IDs.

---

## ✨ Benefícios

- ✅ **Reutilização total:** Todo código é reaproveitado
- ✅ **Escalável:** Suporta dezenas de URLs facilmente
- ✅ **Temas rápidos:** Criar novo tema = copiar + mudar variáveis
- ✅ **Manutenção fácil:** Mudanças no template afetam todos os temas
- ✅ **Isolamento:** Cada URL tem seu próprio CSS/JS
