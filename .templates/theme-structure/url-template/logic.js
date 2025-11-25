// ===================================
// TEMPLATE - {{URL_NAME}} Logic
//
// INSTRUÇÕES:
// 1. Copie este arquivo para themes/{tema}/{url-name}/logic.js
// 2. Substitua:
//    - {{URL_NAME}} pelo nome da URL
//    - {{EXPECTED_URL}} pela URL esperada (ex: '/decks')
//    - {{CONTAINER_ID}} por um ID único (ex: 'custom-interface-decks')
// 3. Implemente sua lógica na função init()
// 4. Este código é ENCAPSULADO em IIFE para evitar conflitos
// ===================================

(function() {
  'use strict';
  
  // ===== Configuração =====
  const THEME_NAME = '{{THEME_NAME}}';
  const URL_NAME = '{{URL_NAME}}';
  const EXPECTED_URL = '{{EXPECTED_URL}}'; // String ou RegExp
  const CONTAINER_ID = 'custom-interface-{{URL_NAME}}';
  
  window.AnkiModernShared.log(THEME_NAME, `Carregando tema para ${URL_NAME}...`);

  // ===== Variáveis de Estado =====
  let monitorInterval = null;
  let isThemeApplied = false;

  // ===== Função Principal =====
  function init() {
    // CRÍTICO: Verifica URL antes de executar
    if (!window.AnkiModernShared.isCorrectUrl(EXPECTED_URL)) {
      window.AnkiModernShared.log(THEME_NAME, `URL incorreta, esperado: ${EXPECTED_URL}`);
      return;
    }

    // Aguarda DOM estar pronto
    setTimeout(() => {
      // Double-check da URL (SPA pode ter mudado)
      if (!window.AnkiModernShared.isCorrectUrl(EXPECTED_URL)) {
        window.AnkiModernShared.log(THEME_NAME, 'URL mudou durante carregamento, abortando');
        return;
      }

      // Busca container principal
      const main = document.querySelector('main.container');
      if (!main) {
        window.AnkiModernShared.error(THEME_NAME, 'main.container não encontrado');
        return;
      }

      // ===== IMPLEMENTE SUA LÓGICA AQUI =====
      
      // Exemplo: Oculta elementos originais
      window.AnkiModernShared.hideOriginalElements('.row.light-bottom-border');
      
      // Exemplo: Cria container customizado
      let customInterface = document.getElementById(CONTAINER_ID);
      if (!customInterface) {
        customInterface = document.createElement('div');
        customInterface.id = CONTAINER_ID;
        customInterface.className = 'theme-fade-in';
        main.appendChild(customInterface);
      }

      // Exemplo: Adiciona conteúdo
      buildUI(customInterface, main);

      // Marca como aplicado
      isThemeApplied = true;
      window.AnkiModernShared.log(THEME_NAME, `✓ Tema ${URL_NAME} aplicado com sucesso!`);
      
      // ===== FIM DA SUA LÓGICA =====

    }, 300); // Aguarda 300ms para DOM estabilizar
  }

  // ===== Função de Build da UI =====
  function buildUI(container, main) {
    // EXEMPLO: Substitua pela sua lógica
    container.innerHTML = '';
    
    // Cria header
    const header = document.createElement('div');
    header.innerHTML = `<h1>{{URL_NAME}} - Customizado</h1>`;
    container.appendChild(header);
    
    // Cria card de exemplo
    const card = window.AnkiModernShared.createCard();
    card.innerHTML = `<p>Este é um card customizado para ${URL_NAME}</p>`;
    container.appendChild(card);
    
    // Cria botão de exemplo
    const button = window.AnkiModernShared.createButton('Ação Exemplo', () => {
      alert('Botão clicado!');
    }, true);
    container.appendChild(button);
    
    // TODO: Implemente sua UI específica aqui
  }

  // ===== Cleanup =====
  function cleanupTheme() {
    window.AnkiModernShared.log(THEME_NAME, `Limpando tema ${URL_NAME}...`);
    
    // Remove interface customizada
    window.AnkiModernShared.cleanup(CONTAINER_ID);
    
    // Para monitor de URL
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
    }
    
    isThemeApplied = false;
    window.AnkiModernShared.log(THEME_NAME, `✓ Tema ${URL_NAME} desativado`);
  }

  // ===== Execução =====
  
  // Só inicia se está na URL correta
  if (window.AnkiModernShared.isCorrectUrl(EXPECTED_URL)) {
    init();

    // Monitor de URL - limpa ao sair
    monitorInterval = setInterval(() => {
      if (!window.AnkiModernShared.isCorrectUrl(EXPECTED_URL)) {
        cleanupTheme();
        return;
      }
      
      // Opcional: Reaplica se interface foi removida
      if (isThemeApplied && !document.getElementById(CONTAINER_ID)) {
        window.AnkiModernShared.log(THEME_NAME, 'Interface removida, reaplicando...');
        init();
      }
    }, 500);
  }

})(); // Fim da IIFE
