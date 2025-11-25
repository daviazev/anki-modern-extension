/**
 * Neumorphism Theme - Study Page Logic
 * Aplica estilização neumórfica à página de estudo
 */

(function () {
  'use strict';

  console.log('[Anki Modern - Neumorphism] Inicializando página Study...');

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
    console.log('[Anki Modern - Neumorphism] Iniciando estilização Study...');

    // Adiciona classe identificadora ao body para aplicar estilos
    document.body.classList.add('anki-modern-study');

    console.log('[Anki Modern - Neumorphism] Study page inicializada com sucesso!');
  }

  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSharedAndInit);
  } else {
    waitForSharedAndInit();
  }
})();
