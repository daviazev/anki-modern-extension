/**
 * STYLES INDEX
 * Ponto central de exportação para o sistema de temas e estilos
 */

// Theme System
export { 
  ThemeManager,
  useTheme,
  injectTheme,
  removeTheme,
  getCurrentTheme,
  toggleTheme
} from './theme-engine';

export type { ThemeName, ThemeTokens } from './tokens';

export {
  THEME_ACADEMIC,
  THEME_FOCUS,
  THEMES,
  tokensToCSS,
  generateThemeCSS
} from './tokens';

// DOM Selectors
export { ANKI_SELECTORS } from '../core/dom-selectors';
