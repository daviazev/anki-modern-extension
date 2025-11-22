/**
 * THEMING ENGINE
 * Sistema de injeção dinâmica de temas no AnkiWeb
 */

import { type ThemeName, generateThemeCSS } from './tokens';

const THEME_STYLE_ID = 'anki-extension-theme';

/**
 * Injeta o tema selecionado no DOM do AnkiWeb
 */
export function injectTheme(themeName: ThemeName): void {
  // Remove o tema anterior se existir
  const existingStyle = document.getElementById(THEME_STYLE_ID);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Cria e injeta o novo tema
  const styleElement = document.createElement('style');
  styleElement.id = THEME_STYLE_ID;
  styleElement.textContent = generateThemeCSS(themeName);

  // Injeta no head ou html (fallback)
  (document.head || document.documentElement).appendChild(styleElement);

  // Adiciona data-attribute na tag HTML para seletores específicos
  document.documentElement.setAttribute('data-theme', themeName);
}

/**
 * Remove o tema injetado
 */
export function removeTheme(): void {
  const existingStyle = document.getElementById(THEME_STYLE_ID);
  if (existingStyle) {
    existingStyle.remove();
  }
  document.documentElement.removeAttribute('data-theme');
}

/**
 * Obtém o tema atual do DOM
 */
export function getCurrentTheme(): ThemeName | null {
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'academic' || theme === 'focus' ? theme : null;
}

/**
 * Alterna entre os temas disponíveis
 */
export function toggleTheme(): void {
  const currentTheme = getCurrentTheme();
  const newTheme: ThemeName = currentTheme === 'academic' ? 'focus' : 'academic';
  injectTheme(newTheme);
}

/**
 * Hook React para gerenciar o tema (para uso no Plasmo/React)
 */
import { useEffect, useState } from 'react';

export function useTheme(initialTheme: ThemeName = 'academic') {
  const [theme, setTheme] = useState<ThemeName>(initialTheme);

  useEffect(() => {
    injectTheme(theme);

    // Cleanup ao desmontar
    return () => {
      removeTheme();
    };
  }, [theme]);

  const switchTheme = (newTheme: ThemeName) => {
    setTheme(newTheme);
  };

  const toggle = () => {
    setTheme(prev => prev === 'academic' ? 'focus' : 'academic');
  };

  return { theme, switchTheme, toggle };
}

/**
 * Versão não-React para uso em content scripts vanilla
 */
export class ThemeManager {
  private currentTheme: ThemeName;

  constructor(initialTheme: ThemeName = 'academic') {
    this.currentTheme = initialTheme;
    this.apply();
  }

  apply(): void {
    injectTheme(this.currentTheme);
  }

  switch(theme: ThemeName): void {
    this.currentTheme = theme;
    this.apply();
  }

  toggle(): void {
    this.currentTheme = this.currentTheme === 'academic' ? 'focus' : 'academic';
    this.apply();
  }

  getCurrent(): ThemeName {
    return this.currentTheme;
  }
}
