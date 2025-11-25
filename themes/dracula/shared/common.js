// ===================================
// SHARED COMMON - dracula
// Funções utilitárias reutilizáveis
//
// INSTRUÇÕES:
// 1. Substitua dracula pelo nome do tema
// 2. Este arquivo é injetado ANTES dos logic.js específicos
// 3. Todas as funções ficam disponíveis via window.AnkiModernShared
// ===================================

(function() {
  'use strict';

  // Namespace global para funções compartilhadas
  window.AnkiModernShared = window.AnkiModernShared || {};

  // ===== URL Helpers =====

  /**
   * Verifica se está na URL esperada
   * @param {string|RegExp} expectedPath - Caminho ou pattern esperado
   * @returns {boolean}
   */
  window.AnkiModernShared.isCorrectUrl = function(expectedPath) {
    const currentPath = window.location.pathname;
    if (expectedPath instanceof RegExp) {
      return expectedPath.test(currentPath);
    }
    return currentPath === expectedPath;
  };

  /**
   * Extrai ID da URL (ex: /edit/123456 → 123456)
   * @param {RegExp} pattern - Pattern com grupo de captura
   * @returns {string|null}
   */
  window.AnkiModernShared.extractIdFromUrl = function(pattern) {
    const match = window.location.pathname.match(pattern);
    return match ? match[1] : null;
  };

  // ===== DOM Helpers =====

  /**
   * Aguarda elemento aparecer no DOM
   * @param {string} selector - Seletor CSS
   * @param {number} timeout - Timeout em ms (padrão: 5000)
   * @returns {Promise<Element>}
   */
  window.AnkiModernShared.waitForElement = function(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Elemento ${selector} não encontrado em ${timeout}ms`));
      }, timeout);
    });
  };

  /**
   * Remove todos os elementos criados pelo tema
   * @param {string} containerId - ID do container customizado
   */
  window.AnkiModernShared.cleanup = function(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.remove();
      console.log(`✓ Container ${containerId} removido`);
    }
  };

  /**
   * Oculta elementos originais do AnkiWeb
   * @param {string} selector - Seletor CSS dos elementos a ocultar
   */
  window.AnkiModernShared.hideOriginalElements = function(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.display = 'none';
    });
    console.log(`✓ ${elements.length} elementos originais ocultados`);
  };

  // ===== Component Builders =====

  /**
   * Cria botão com estilo do tema
   * @param {string} text - Texto do botão
   * @param {Function} onClick - Callback do clique
   * @param {boolean} isPrimary - Se é botão primário
   * @returns {HTMLElement}
   */
  window.AnkiModernShared.createButton = function(text, onClick, isPrimary = false) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.className = isPrimary ? 'theme-btn theme-btn-primary' : 'theme-btn';
    btn.onclick = onClick;
    return btn;
  };

  /**
   * Cria card com estilo do tema
   * @returns {HTMLElement}
   */
  window.AnkiModernShared.createCard = function() {
    const card = document.createElement('div');
    card.className = 'theme-card theme-fade-in';
    return card;
  };

  /**
   * Cria dropdown customizado
   * @param {string} buttonText - Texto do botão
   * @param {Array<{text: string, onClick: Function}>} items - Itens do menu
   * @returns {HTMLElement}
   */
  window.AnkiModernShared.createDropdown = function(buttonText, items) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';

    const button = this.createButton(buttonText, () => {
      menu.classList.toggle('show');
    });
    
    const menu = document.createElement('div');
    menu.className = 'theme-dropdown-menu';
    menu.style.cssText = `
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: var(--theme-bg-primary);
      border-radius: var(--theme-radius-md);
      box-shadow: var(--theme-shadow-raised);
      padding: var(--theme-spacing-xs);
      min-width: 150px;
      z-index: 1000;
    `;

    items.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.innerText = item.text;
      menuItem.className = 'theme-dropdown-item';
      menuItem.style.cssText = `
        padding: var(--theme-spacing-sm);
        cursor: pointer;
        border-radius: var(--theme-radius-sm);
        transition: all var(--theme-transition-fast);
      `;
      menuItem.onclick = (e) => {
        e.stopPropagation();
        menu.classList.remove('show');
        item.onClick();
      };
      menuItem.onmouseenter = () => {
        menuItem.style.background = 'var(--theme-bg-secondary)';
      };
      menuItem.onmouseleave = () => {
        menuItem.style.background = 'transparent';
      };
      menu.appendChild(menuItem);
    });

    menu.classList.add('show');
    menu.style.display = 'block';

    wrapper.appendChild(button);
    wrapper.appendChild(menu);

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        menu.classList.remove('show');
        menu.style.display = 'none';
      }
    });

    return wrapper;
  };

  // ===== Lifecycle Management =====

  /**
   * Cria monitor de URL que limpa o tema ao sair
   * @param {string} expectedUrl - URL esperada (string ou regex)
   * @param {Function} cleanupCallback - Função de cleanup
   * @returns {number} - ID do interval
   */
  window.AnkiModernShared.createUrlMonitor = function(expectedUrl, cleanupCallback) {
    return setInterval(() => {
      const isCorrect = this.isCorrectUrl(expectedUrl);
      if (!isCorrect) {
        console.log('✗ URL mudou, executando cleanup...');
        cleanupCallback();
      }
    }, 500);
  };

  // ===== Debug Helpers =====

  /**
   * Log formatado para debug
   * @param {string} themeName - Nome do tema
   * @param {string} message - Mensagem
   */
  window.AnkiModernShared.log = function(themeName, message) {
    console.log(`[${themeName}] ${message}`);
  };

  /**
   * Log de erro formatado
   * @param {string} themeName - Nome do tema
   * @param {string} message - Mensagem de erro
   */
  window.AnkiModernShared.error = function(themeName, message) {
    console.error(`[${themeName}] ✗ ${message}`);
  };

  console.log('✓ AnkiModern Shared utilities loaded');
})();
