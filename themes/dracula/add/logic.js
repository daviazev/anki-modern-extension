// ===================================
// Dracula Theme - Add Card Logic
// URL: https://ankiuser.net/add
// Abordagem simplificada: apenas adiciona classes CSS
// ===================================

(function() {
  'use strict';

  const EXPECTED_URL = '/add';

  function waitForSharedAndInit() {
    if (window.AnkiModernShared && typeof window.AnkiModernShared.isCorrectUrl === 'function') {
      init();
    } else {
      setTimeout(waitForSharedAndInit, 50);
    }
  }

  function init() {
    if (!window.AnkiModernShared.isCorrectUrl(EXPECTED_URL)) {
      return;
    }

    setTimeout(() => {
      if (!window.AnkiModernShared.isCorrectUrl(EXPECTED_URL)) {
        return;
      }

      const main = document.querySelector('main.container');
      if (!main) {
        return;
      }

      // Apenas adiciona classe para estilização CSS
      main.classList.add('anki-modern-add');
      
      console.log('✓ Tema Dracula aplicado na página /add');
    }, 500);
  }

  waitForSharedAndInit();

})();
