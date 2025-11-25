/**
 * Neumorphism Theme - Search Page Logic
 * Aplica estilização neumórfica à página de busca
 */

(function () {
  'use strict';

  console.log('[Anki Modern - Neumorphism] Inicializando página Search...');

  /**
   * Aguarda o shared/common.js estar carregado antes de inicializar
   */
  function waitForSharedAndInit() {
    if (typeof window.AnkiModernShared === 'undefined') {
      console.log('[Anki Modern - Neumorphism] Aguardando shared/common.js...');
      setTimeout(waitForSharedAndInit, 100);
      return;
    }

    init();
  }

  /**
   * Inicializa a estilização da página
   */
  function init() {
    console.log('[Anki Modern - Neumorphism] Iniciando estilização Search...');

    // Adiciona classe identificadora ao body para aplicar estilos
    document.body.classList.add('anki-modern-search');

    console.log('[Anki Modern - Neumorphism] Search page inicializada com sucesso!');
  }

  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSharedAndInit);
  } else {
    waitForSharedAndInit();
  }
})();
