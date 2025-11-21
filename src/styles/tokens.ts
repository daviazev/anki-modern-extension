/**
 * DESIGN TOKENS - Sistema de Temas
 * Define as variáveis CSS para os temas Academic (Light) e Focus (Dark)
 */

export type ThemeName = 'academic' | 'focus';

export interface ThemeTokens {
  '--bg-main': string;
  '--bg-secondary': string;
  '--text-main': string;
  '--text-muted': string;
  '--border': string;
  '--accent': string;
  '--accent-hover': string;
  '--shadow': string;
  '--shadow-hover': string;
}

/**
 * Theme Academic (Light)
 * Vibe: Notion, Papel, Limpo
 */
export const THEME_ACADEMIC: ThemeTokens = {
  '--bg-main': '#FFFFFF',
  '--bg-secondary': '#F7F7F5',
  '--text-main': '#37352F',
  '--text-muted': '#787774',
  '--border': '#E1E1E0',
  '--accent': '#2EAADC',
  '--accent-hover': '#2596C2',
  '--shadow': 'rgba(15, 15, 15, 0.05)',
  '--shadow-hover': 'rgba(15, 15, 15, 0.1)'
};

/**
 * Theme Focus (Dark)
 * Vibe: VSCode, Discord, Conforto visual noturno
 */
export const THEME_FOCUS: ThemeTokens = {
  '--bg-main': '#1E1E1E',
  '--bg-secondary': '#252526',
  '--text-main': '#D4D4D4',
  '--text-muted': '#A0A0A0',
  '--border': '#3E3E42',
  '--accent': '#BB86FC',
  '--accent-hover': '#A370E8',
  '--shadow': 'rgba(0, 0, 0, 0.3)',
  '--shadow-hover': 'rgba(0, 0, 0, 0.5)'
};

/**
 * Mapeia nomes de temas para seus tokens
 */
export const THEMES: Record<ThemeName, ThemeTokens> = {
  academic: THEME_ACADEMIC,
  focus: THEME_FOCUS
};

/**
 * Converte os tokens em uma string CSS pronta para injeção
 */
export function tokensToCSS(tokens: ThemeTokens): string {
  return Object.entries(tokens)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n  ');
}

/**
 * Gera o CSS completo do tema com variáveis
 */
export function generateThemeCSS(themeName: ThemeName): string {
  const tokens = THEMES[themeName];
  const cssVars = tokensToCSS(tokens);
  
  return `
:root {
  ${cssVars}
}

/* Fallback para elementos que não herdam as variáveis */
html[data-theme="${themeName}"] {
  ${cssVars}
}
  `.trim();
}
