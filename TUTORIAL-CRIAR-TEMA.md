# 📘 Tutorial: Como Criar um Novo Tema (Exemplo: Dracula)

Este documento mostra **passo a passo COMPLETO** de como foi criado o tema **Dracula** para a extensão Anki Modern, servindo como exemplo prático de como adicionar novos temas ao projeto.

---

## 🎯 Objetivo

Criar um tema completo chamado **Dracula** com:
- Paleta de cores escuras (dark mode)
- Suporte para a URL `/decks`
- Sistema de cards, botões e dropdowns estilizados
- Integração com o seletor de temas do popup

---

## 📋 Pré-requisitos

- Estrutura de templates em `.templates/` já criada
- Scripts `create-theme.sh` e `add-url-support.sh` funcionando
- Tema Neumorphism como referência

---

## 🚀 Passo 1: Criar Estrutura Base do Tema

### 1.1 - Executar script de criação

```bash
cd .templates/scripts
./create-theme.sh "dracula" "Davi Azevedo"
```

**Resultado:**
```
🎨 Criando novo tema: dracula
📁 Criando estrutura de pastas...
📄 Copiando arquivos template...
✏️  Personalizando arquivos...
✓ Tema 'dracula' criado com sucesso!
```

**O que foi criado:**
```
themes/dracula/
├── theme-config.json
└── shared/
    ├── base.css
    └── common.js
```

---

## 🎨 Passo 2: Configurar Paleta de Cores

### 2.1 - Editar `themes/dracula/theme-config.json`

Substituir as cores padrão pela **paleta oficial do Dracula**:

```json
{
  "name": "dracula",
  "version": "1.0.0",
  "description": "Tema dracula para AnkiWeb",
  "author": "Davi Azevedo",
  
  "colors": {
    "primary": "#282a36",        // Background escuro
    "secondary": "#44475a",      // Surface (cards, menus)
    "textPrimary": "#f8f8f2",    // Texto claro
    "textSecondary": "#6272a4",  // Texto secundário (cinza-azulado)
    "accent": "#bd93f9",         // Roxo principal
    "accentHover": "#a97fe0",    // Roxo escuro (hover)
    "shadowLight": "#383a4a",    // Sombra clara (dark mode)
    "shadowDark": "#191a21",     // Sombra escura
    "success": "#50fa7b",        // Verde
    "warning": "#f1fa8c",        // Amarelo
    "danger": "#ff5555",         // Vermelho
    "pink": "#ff79c6",           // Rosa
    "cyan": "#8be9fd",           // Ciano
    "green": "#50fa7b",          // Verde
    "orange": "#ffb86c",         // Laranja
    "purple": "#bd93f9",         // Roxo
    "red": "#ff5555",            // Vermelho
    "yellow": "#f1fa8c"          // Amarelo
  }
}
```

### 2.2 - Atualizar sombras para dark mode

```json
"shadows": {
  "raised": "0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3)",
  "pressed": "inset 0 2px 6px rgba(0, 0, 0, 0.4)",
  "hover": "0 8px 20px rgba(189, 147, 249, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4)",
  "subtle": "0 2px 8px rgba(0, 0, 0, 0.3)",
  "glow": "0 0 20px rgba(189, 147, 249, 0.4)"
}
```

---

## 🌈 Passo 3: Personalizar CSS Base

### 3.1 - Editar `themes/dracula/shared/base.css`

Atualizar as **CSS custom properties** com a paleta Dracula:

```css
:root {
  /* ===== Cores Principais - Dracula Theme ===== */
  --theme-bg-primary: #282a36;
  --theme-bg-secondary: #44475a;
  --theme-text-primary: #f8f8f2;
  --theme-text-secondary: #6272a4;
  --theme-accent: #bd93f9;
  --theme-accent-hover: #a97fe0;
  
  /* ===== Sombras (Dark Mode) ===== */
  --theme-shadow-light: #383a4a;
  --theme-shadow-dark: #191a21;
  --theme-shadow-raised: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
  --theme-shadow-hover: 0 8px 20px rgba(189, 147, 249, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4);
  --theme-shadow-glow: 0 0 20px rgba(189, 147, 249, 0.4);
  
  /* ===== Dracula Accent Colors ===== */
  --theme-pink: #ff79c6;
  --theme-cyan: #8be9fd;
  --theme-green: #50fa7b;
  --theme-orange: #ffb86c;
  --theme-purple: #bd93f9;
  --theme-red: #ff5555;
  --theme-yellow: #f1fa8c;
}
```

### 3.2 - Personalizar scrollbar

```css
::-webkit-scrollbar-thumb {
  background: var(--theme-bg-secondary);
  border-radius: 6px;
  border: 2px solid var(--theme-bg-primary);
  transition: background var(--theme-transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--theme-accent);
  box-shadow: var(--theme-shadow-glow);
}
```

---

## 🔧 Passo 4: Adicionar Suporte para URL /decks

### 4.1 - Executar script de URL

```bash
cd .templates/scripts
./add-url-support.sh "dracula" "decks" "/decks"
```

**Resultado:**
```
🔧 Adicionando suporte para URL: decks
📁 Criando pasta decks...
📄 Copiando templates...
✏️  Personalizando arquivos...
✓ Suporte para decks adicionado com sucesso!
```

**O que foi criado:**
```
themes/dracula/decks/
├── styles.css
└── logic.js
```

---

## 📝 Passo 5: Implementar Estilos Específicos

### 5.1 - Copiar base do Neumorphism

Como a estrutura HTML é a mesma, copiamos os arquivos do Neumorphism e adaptamos:

```bash
cp themes/neumorphism/decks/styles.css themes/dracula/decks/styles.css
cp themes/neumorphism/decks/logic.js themes/dracula/decks/logic.js
```

### 5.2 - Adaptar variáveis CSS em `themes/dracula/decks/styles.css`

**Antes (Neumorphism):**
```css
:root {
    --primary: #4C6EF5;
    --bg-body: #F0F2F5;
    --surface: #FFFFFF;
    --text-main: #212529;
}
```

**Depois (Dracula):**
```css
:root {
    --primary: #bd93f9;
    --primary-hover: #a97fe0;
    --bg-body: #282a36;
    --surface: #44475a;
    --text-main: #f8f8f2;
    --text-muted: #6272a4;
    --accent-pink: #ff79c6;
    --accent-cyan: #8be9fd;
    --accent-green: #50fa7b;
    --accent-orange: #ffb86c;
    --accent-red: #ff5555;
    --accent-yellow: #f1fa8c;
}
```

### 5.3 - Adaptar pills de estatísticas

**Antes:**
```css
.pill-due { background: #FFE3E3; color: #C92A2A; }
.pill-new { background: #D3F9D8; color: #2B8A3E; }
```

**Depois (com transparência e bordas):**
```css
.pill-due { 
  background: rgba(255, 85, 85, 0.2); 
  color: var(--accent-red); 
  border: 1px solid var(--accent-red); 
}
.pill-new { 
  background: rgba(80, 250, 123, 0.2); 
  color: var(--accent-green); 
  border: 1px solid var(--accent-green); 
}
```

### 5.4 - Adaptar botões e hovers

```css
.custom-actions-btn:hover {
    background: rgba(189, 147, 249, 0.2);
    color: var(--primary);
    border-color: var(--primary);
}

.child-row:hover { 
  background: rgba(189, 147, 249, 0.1); 
}

.footer-stats-row span { 
  color: var(--accent-cyan); 
}
.footer-stats-row span:hover { 
  color: var(--primary); 
}
```

### 5.5 - Atualizar sombras

```css
.deck-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
}

.deck-card:hover {
    box-shadow: 0 8px 20px rgba(189, 147, 249, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4);
}
```

---

## 💻 Passo 6: Adaptar Lógica JavaScript

### 6.1 - Atualizar `themes/dracula/decks/logic.js`

Apenas mudar a mensagem de log:

```javascript
console.log("Aplicando tema 'Dracula' para /decks...");
```

**Nota:** O resto da lógica permanece igual, pois:
- A estrutura HTML é a mesma
- Os seletores CSS são os mesmos
- A funcionalidade é idêntica
- **Apenas as cores/sombras mudam!**

---

## 🎨 Passo 7: Registrar Tema no Popup

### 7.1 - Editar `popup/popup.js`

Adicionar o tema na lista de disponíveis:

```javascript
const AVAILABLE_THEMES = [
  { value: 'neumorphism', label: 'Neumorphism' },
  { value: 'dracula', label: 'Dracula' }, // ← ADICIONADO
];
```

**Resultado:** O dropdown no popup agora mostra:
```
┌──────────────────────┐
│ Tema                 │
├──────────────────────┤
│ Neumorphism          │
│ Dracula         ◀──  │ (novo!)
└──────────────────────┘
```

---

## ✅ Passo 8: Testar a Extensão

### 8.1 - Recarregar extensão

1. Abra `chrome://extensions/`
2. Clique no ícone de **reload** da extensão
3. Vá para https://ankiweb.net/decks

### 8.2 - Selecionar tema Dracula

1. Clique no ícone da extensão
2. Marque "Ativar"
3. Selecione "Dracula" no dropdown
4. A página recarrega automaticamente

### 8.3 - Verificar no console

Deveria aparecer:
```
LOADER INJETADO
Tema ativo: dracula
URL ankiweb.net/decks → tema: decks
Aplicando tema 'Dracula' para /decks...
Tema aplicado e funcional!
```

---

## 🎉 Resultado Final

### ✨ O que foi criado:

```
themes/dracula/
├── theme-config.json        # Cores e variáveis do Dracula
├── shared/
│   ├── base.css            # CSS variables com paleta Dracula
│   └── common.js           # Funções compartilhadas (não modificado)
└── decks/
    ├── styles.css          # Estilos específicos para /decks
    └── logic.js            # Lógica de criação da interface
```

### 🎨 Características do tema:

- ✅ **Background:** #282a36 (escuro)
- ✅ **Accent:** #bd93f9 (roxo vibrante)
- ✅ **Pills:** Verde (#50fa7b) para novos, Vermelho (#ff5555) para devidos
- ✅ **Sombras:** Adaptadas para dark mode
- ✅ **Hover effects:** Glow roxo nos elementos interativos
- ✅ **Scrollbar:** Customizada com cores do Dracula

---

## 📊 Comparação: Neumorphism vs Dracula

| Aspecto | Neumorphism | Dracula |
|---------|-------------|---------|
| **Background** | #F0F2F5 (claro) | #282a36 (escuro) |
| **Surface** | #FFFFFF (branco) | #44475a (cinza escuro) |
| **Texto** | #212529 (preto) | #f8f8f2 (branco) |
| **Accent** | #4C6EF5 (azul) | #bd93f9 (roxo) |
| **Sombras** | Neumorphism soft | Box shadows com glow |
| **Estilo** | Soft UI, minimalista | Dark, vibrante, cyberpunk |

---

## 🚀 Para Criar Outros Temas

Basta seguir o mesmo processo:

```bash
# 1. Criar tema
./create-theme.sh "nord" "Seu Nome"

# 2. Editar cores em:
# - themes/nord/theme-config.json
# - themes/nord/shared/base.css

# 3. Adicionar URL
./add-url-support.sh "nord" "decks" "/decks"

# 4. Copiar lógica do Neumorphism e adaptar cores
cp themes/neumorphism/decks/*.* themes/nord/decks/

# 5. Registrar no popup
# Adicionar em popup/popup.js: { value: 'nord', label: 'Nord' }
```

---

## 💡 Dicas e Boas Práticas

### 1. Paletas de cores
- Use ferramentas como [Coolors](https://coolors.co/) ou [Adobe Color](https://color.adobe.com/)
- Mantenha consistência entre `theme-config.json` e `base.css`

### 2. Contraste de texto
- Dark themes: texto claro (#f8f8f2)
- Light themes: texto escuro (#212529)
- Teste com [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 3. Sombras
- Light themes: sombras suaves (rgba(0,0,0,0.1))
- Dark themes: sombras escuras + glows coloridos

### 4. Testar em diferentes URLs
```bash
# Adicione suporte para outras URLs
./add-url-support.sh "dracula" "account-settings" "/account/settings"
./add-url-support.sh "dracula" "search" "/search"
```

### 5. Reutilizar estrutura
- ✅ **Copie a lógica** do Neumorphism (já funciona!)
- ✅ **Mude apenas as cores** (muito mais rápido!)
- ❌ **Não reinvente** a estrutura HTML/JS

---

## 📚 Referências

- **Dracula Theme:** https://draculatheme.com/
- **Paleta oficial:** https://draculatheme.com/contribute
- **Neumorphism:** https://neumorphism.io/

---

## 🐛 Troubleshooting

### Tema não aparece no dropdown
- ✅ Verificar se foi adicionado em `popup/popup.js`
- ✅ Recarregar a extensão no Chrome

### Cores não aplicam
- ✅ Verificar se `base.css` foi editado
- ✅ Confirmar que o CSS importa o base: `@import url('...')`
- ✅ Inspecionar elemento e ver se variáveis estão definidas

### JavaScript não executa
- ✅ Verificar console do Chrome (F12)
- ✅ Confirmar que `logic.js` está em IIFE
- ✅ Ver se URL está correta no `loader.js`

---

**Criado por:** Davi Azevedo  
**Data:** 23 de novembro de 2025  
**Versão:** 1.0.0
