/**
 * Neumorphism Theme - Account Login Page Logic
 * Aplica estilização neumórfica à página de login
 */

(function () {
  'use strict';

  console.log('[Anki Modern - Neumorphism] Inicializando página Account Login...');

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
    console.log('[Anki Modern - Neumorphism] Iniciando estilização Account Login...');

    // Adiciona classe identificadora ao body para aplicar estilos
    document.body.classList.add('anki-modern-account-login');

    console.log('[Anki Modern - Neumorphism] Account Login page inicializada com sucesso!');
  }

  // Inicia quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSharedAndInit);
  } else {
    waitForSharedAndInit();
  }
})();
