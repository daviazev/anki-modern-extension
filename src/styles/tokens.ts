/**
 * DESIGN TOKENS - Sistema de Temas
 * Define as variáveis CSS para os temas Academic (Light) e Focus (Dark)
 */

export type ThemeName = 'academic' | 'focus';

export interface ThemeTokens {
  '--bg-main': string;
  '--bg-main-rgb': string;
  '--bg-secondary': string;
  '--text-main': string;
  '--text-muted': string;
  '--border': string;
  '--accent': string;
  '--accent-hover': string;
  '--shadow': string;
  '--shadow-hover': string;
  // Modern UI Tokens
  '--bg-glass': string;
  '--bg-surface': string;
  '--bg-surface-hover': string;
  '--primary-glow': string;
  '--success': string;
  '--review': string;
  '--gradient-title': string;
}

/**
 * Theme Academic (Light)
 * Vibe: Notion, Papel, Limpo
 */
export const THEME_ACADEMIC: ThemeTokens = {
  '--bg-main': '#FFFFFF',
  '--bg-main-rgb': '255, 255, 255',
  '--bg-secondary': '#F7F7F5',
  '--text-main': '#37352F',
  '--text-muted': '#787774',
  '--border': '#E1E1E0',
  '--accent': '#2EAADC',
  '--accent-hover': '#2596C2',
  '--shadow': 'rgba(15, 15, 15, 0.05)',
  '--shadow-hover': 'rgba(15, 15, 15, 0.1)',
  // Modern UI Tokens - Light
  '--bg-glass': 'rgba(255, 255, 255, 0.8)',
  '--bg-surface': '#FFFFFF',
  '--bg-surface-hover': '#F0F0F0',
  '--primary-glow': 'rgba(46, 170, 220, 0.15)',
  '--success': '#10b981',
  '--review': '#f43f5e',
  '--gradient-title': 'linear-gradient(to right, #37352F, #787774)'
};

/**
 * Theme Focus (Dark)
 * Vibe: VSCode, Discord, Conforto visual noturno
 */
export const THEME_FOCUS: ThemeTokens = {
  '--bg-main': '#1E1E1E',
  '--bg-main-rgb': '30, 30, 30',
  '--bg-secondary': '#252526',
  '--text-main': '#D4D4D4',
  '--text-muted': '#A0A0A0',
  '--border': '#3E3E42',
  '--accent': '#BB86FC',
  '--accent-hover': '#A370E8',
  '--shadow': 'rgba(0, 0, 0, 0.3)',
  '--shadow-hover': 'rgba(0, 0, 0, 0.5)',
  // Modern UI Tokens - Dark
  '--bg-glass': 'rgba(30, 30, 30, 0.6)',
  '--bg-surface': '#252526',
  '--bg-surface-hover': '#2D2D30',
  '--primary-glow': 'rgba(187, 134, 252, 0.15)',
  '--success': '#10b981',
  '--review': '#f43f5e',
  '--gradient-title': 'linear-gradient(to right, #ffffff, #9ca3af)'
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
