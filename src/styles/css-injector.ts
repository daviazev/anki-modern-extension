/**
 * CSS INJECTOR
 * Helper para injetar estilos CSS diretamente no <head> do AnkiWeb
 */

const STYLE_ID_PREFIX = 'anki-modern-extension';

/**
 * Injeta um bloco CSS no head da página
 */
export function injectCSS(cssContent: string, id: string): void {
  const styleId = `${STYLE_ID_PREFIX}-${id}`;
  
  // Remove o estilo anterior se existir
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }

  // Cria e injeta o novo estilo
  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = cssContent;
  
  // Injeta no head (ou no body se head não existir ainda)
  const target = document.head || document.documentElement;
  target.appendChild(styleElement);
}

/**
 * Remove um estilo injetado
 */
export function removeCSS(id: string): void {
  const styleId = `${STYLE_ID_PREFIX}-${id}`;
  const style = document.getElementById(styleId);
  if (style) {
    style.remove();
  }
}

/**
 * Injeta múltiplos arquivos CSS de uma vez
 */
export function injectMultipleCSS(styles: Record<string, string>): void {
  Object.entries(styles).forEach(([id, content]) => {
    injectCSS(content, id);
  });
}

/**
 * Remove todos os estilos injetados pela extensão
 */
export function removeAllCSS(): void {
  const styles = document.querySelectorAll(`[id^="${STYLE_ID_PREFIX}"]`);
  styles.forEach(style => style.remove());
}
