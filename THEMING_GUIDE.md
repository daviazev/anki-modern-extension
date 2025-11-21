# Sistema de Temas e Estilização - Anki Modern Extension

## 📁 Estrutura de Arquivos

```
src/
├── core/
│   └── dom-selectors.ts         # Fonte da verdade para seletores CSS
└── styles/
    ├── tokens.ts                # Design tokens (cores, temas)
    ├── theme-engine.ts          # Sistema de injeção de temas
    ├── global.css               # Reset e estilos base
    ├── navbar.css               # Estilização da navbar
    ├── deck-list.css            # Estilização da lista de decks
    └── integration-example.ts   # Exemplo de integração
```

## 🎨 Temas Disponíveis

### Theme Academic (Light)
- **Vibe**: Notion, Papel, Limpo
- **Background**: `#FFFFFF` / `#F7F7F5`
- **Texto**: `#37352F` / `#787774`
- **Accent**: `#2EAADC` (Azul Anki)

### Theme Focus (Dark)
- **Vibe**: VSCode, Discord, Conforto noturno
- **Background**: `#1E1E1E` / `#252526`
- **Texto**: `#D4D4D4` / `#A0A0A0`
- **Accent**: `#BB86FC` (Roxo suave)

## 🚀 Como Usar

### 1. Aplicar Tema (Vanilla JS)

```typescript
import { ThemeManager } from './styles/theme-engine';

// Criar instância
const themeManager = new ThemeManager('academic');

// Aplicar tema
themeManager.apply();

// Alternar tema
themeManager.toggle();

// Trocar para tema específico
themeManager.switch('focus');
```

### 2. Usar com React/Plasmo

```typescript
import { useTheme } from './styles/theme-engine';

function MyComponent() {
  const { theme, switchTheme, toggle } = useTheme('academic');
  
  return (
    <button onClick={toggle}>
      Tema atual: {theme}
    </button>
  );
}
```

### 3. Importar Estilos

```typescript
// No seu content script principal
import './styles/global.css';
import './styles/navbar.css';
import './styles/deck-list.css';
```

## 🎯 Seletores CSS (ANKI_SELECTORS)

**IMPORTANTE**: Sempre use `ANKI_SELECTORS` ao invés de seletores hardcoded.

```typescript
import { ANKI_SELECTORS } from './core/dom-selectors';

// ✅ CORRETO
document.querySelector(ANKI_SELECTORS.global.navbar);
document.querySelector(ANKI_SELECTORS.decksPage.deckItem);

// ❌ ERRADO
document.querySelector('nav.navbar');
document.querySelector('.deck');
```

## 🎨 Variáveis CSS Disponíveis

Todas as variáveis são injetadas dinamicamente pelo `theme-engine`:

```css
:root {
  --bg-main: #FFFFFF;
  --bg-secondary: #F7F7F5;
  --text-main: #37352F;
  --text-muted: #787774;
  --border: #E1E1E0;
  --accent: #2EAADC;
  --accent-hover: #2596C2;
  --shadow: rgba(15, 15, 15, 0.05);
  --shadow-hover: rgba(15, 15, 15, 0.1);
}
```

Use-as no seu CSS:

```css
.my-element {
  background-color: var(--bg-secondary);
  color: var(--text-main);
  border: 1px solid var(--border);
}
```

## ✨ Recursos Implementados

### Global
- ✅ Fonte moderna (Inter)
- ✅ Scrollbar estilizada
- ✅ Transições suaves
- ✅ Reset de estilos Bootstrap

### Navbar
- ✅ Sticky positioning
- ✅ Backdrop blur (glass morphism)
- ✅ Transparência dinâmica
- ✅ Borda inferior sutil
- ✅ Animações de hover

### Lista de Decks
- ✅ Cards flutuantes
- ✅ Border radius modernos
- ✅ Box shadows
- ✅ Badges coloridos para contadores
- ✅ Hover effects
- ✅ Animações staggered

## 🔧 Personalização

### Adicionar Novo Tema

1. Edite `src/styles/tokens.ts`:

```typescript
export const THEME_CUSTOM: ThemeTokens = {
  '--bg-main': '#YOUR_COLOR',
  '--bg-secondary': '#YOUR_COLOR',
  // ... outros tokens
};

export const THEMES = {
  academic: THEME_ACADEMIC,
  focus: THEME_FOCUS,
  custom: THEME_CUSTOM, // ← Novo tema
};
```

2. Atualize o tipo:

```typescript
export type ThemeName = 'academic' | 'focus' | 'custom';
```

### Adicionar Novo Seletor

1. Edite `src/core/dom-selectors.ts`:

```typescript
export const ANKI_SELECTORS = {
  // ... existentes
  myNewPage: {
    container: '#myContainer',
    button: '.my-button',
  }
};
```

2. Crie CSS correspondente usando o seletor:

```css
#myContainer {
  background: var(--bg-main);
}
```

## 📱 Responsividade

Todos os estilos incluem breakpoints mobile:

```css
@media (max-width: 768px) {
  /* Ajustes para telas pequenas */
}
```

## ⌨️ Atalhos de Teclado

- `Ctrl + Shift + T`: Alternar tema (implementado no exemplo)

## 🐛 Troubleshooting

### Tema não está aplicando

1. Verifique se o `theme-engine` está sendo importado
2. Confirme que `DOMContentLoaded` foi disparado
3. Inspecione o `<html>` tag - deve ter `data-theme="academic"` ou `data-theme="focus"`

### Estilos não aparecem

1. Confirme que os arquivos CSS estão sendo importados
2. Verifique a ordem de importação (global.css deve vir primeiro)
3. Use DevTools para verificar se os estilos foram injetados

### Seletores não funcionam

1. Confirme que está usando `ANKI_SELECTORS`
2. Verifique se o AnkiWeb não mudou a estrutura HTML
3. Use DevTools para inspecionar os elementos reais

## 📚 Referências

- [Plasmo Framework](https://docs.plasmo.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/)
