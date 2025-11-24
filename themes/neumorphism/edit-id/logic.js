/**
 * Neumorphism Theme - Edit Page Logic
 * Aplica estilização Neumorphism à página de edição
 */

(function () {
  'use strict';

  console.log('[Anki Modern - Neumorphism] Inicializando página Edit...');

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
    console.log('[Anki Modern - Neumorphism] Iniciando estilização Edit...');

    // Adiciona classe identificadora ao body para aplicar estilos
    document.body.classList.add('anki-modern-edit');

    console.log('[Anki Modern - Neumorphism] Edit page inicializada com sucesso!');
  }

  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSharedAndInit);
  } else {
    waitForSharedAndInit();
  }
})();
