/**
 * Dracula Theme - Edit Page Logic
 * Aplica estilização Dracula à página de edição
 */

(function () {
  'use strict';

  console.log('[Anki Modern - Dracula] Inicializando página Edit...');

  /**
   * Aguarda o shared/common.js estar carregado antes de inicializar
   */
  function waitForSharedAndInit() {
    if (typeof window.AnkiModernShared === 'undefined') {
      console.log('[Anki Modern - Dracula] Aguardando shared/common.js...');
      setTimeout(waitForSharedAndInit, 100);
      return;
    }

    init();
  }

  /**
   * Inicializa a estilização da página
   */
  function init() {
    console.log('[Anki Modern - Dracula] Iniciando estilização Edit...');

    // Adiciona classe identificadora ao body para aplicar estilos
    document.body.classList.add('anki-modern-edit');

    console.log('[Anki Modern - Dracula] Edit page inicializada com sucesso!');
  }

  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSharedAndInit);
  } else {
    waitForSharedAndInit();
  }
})();
