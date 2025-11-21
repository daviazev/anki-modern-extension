/**
 * ANKI BEAUTIFIER - Content Script Principal
 * Moderniza a interface do AnkiWeb com temas e estilos
 */

import type { PlasmoCSConfig } from "plasmo";
import { ThemeManager } from "~styles/theme-engine";
import type { ThemeName } from "~styles/tokens";
import { injectCSS } from "~styles/css-injector";

// Importar CSS como texto usando Plasmo data-text
import globalCSS from "data-text:~styles/global.css";
import navbarCSS from "data-text:~styles/navbar.css";
import deckListCSS from "data-text:~styles/deck-list.css";

/**
 * Configuração do Plasmo Content Script
 * Executa APENAS no AnkiWeb
 */
export const config: PlasmoCSConfig = {
  matches: ["https://ankiweb.net/*", "https://ankiuser.net/*"],
  run_at: "document_start",
  all_frames: false
};

// ============================================
// INICIALIZAÇÃO
// ============================================

let themeManager: ThemeManager | null = null;
const STORAGE_KEY = 'anki-modern-theme';

/**
 * Injeta todos os CSS necessários
 */
function injectAllStyles(): void {
  console.log('[Anki Modern] Injetando estilos CSS...');
  
  // Injetar CSS global, navbar e deck-list
  injectCSS(globalCSS, 'global');
  injectCSS(navbarCSS, 'navbar');
  injectCSS(deckListCSS, 'deck-list');
}

/**
 * Inicializa o sistema de temas
 */
async function initializeTheme(): Promise<void> {
  try {
    // Buscar tema salvo no storage
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const savedTheme = result[STORAGE_KEY] as ThemeName | undefined;
    
    // Criar instância do ThemeManager
    themeManager = new ThemeManager(savedTheme || 'academic');
    
    console.log('[Anki Modern] Tema aplicado:', themeManager.getCurrent());
  } catch (error) {
    console.error('[Anki Modern] Erro ao inicializar tema:', error);
    // Fallback para tema padrão
    themeManager = new ThemeManager('academic');
  }
}

/**
 * Salva o tema atual no storage
 */
async function saveThemePreference(theme: ThemeName): Promise<void> {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: theme });
    console.log('[Anki Modern] Tema salvo:', theme);
  } catch (error) {
    console.error('[Anki Modern] Erro ao salvar tema:', error);
  }
}

/**
 * Adiciona scroll behavior para navbar
 */
function setupNavbarScrollEffect(): void {
  const navbar = document.querySelector('nav.navbar');
  if (!navbar) return;

  let lastScrollTop = 0;
  
  const handleScroll = (): void => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Adiciona atalho de teclado para alternar tema (Ctrl+Shift+T)
 */
function setupKeyboardShortcuts(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      
      if (themeManager) {
        themeManager.toggle();
        const currentTheme = themeManager.getCurrent();
        
        // Salvar preferência
        saveThemePreference(currentTheme);
        
        console.log('[Anki Modern] Tema alternado para:', currentTheme);
        
        // Notificar usuário
        showNotification(`Tema alterado: ${currentTheme === 'academic' ? 'Academic (Light)' : 'Focus (Dark)'}`);
      }
    }
  });
}

/**
 * Listener para mensagens do popup
 * Suporta tanto o formato novo (action) quanto o legado (type: "THEME_CHANGE")
 */
function setupMessageListener(): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Anki Modern] Mensagem recebida:', message);
    
    // ========================================
    // FORMATO NOVO (ThemeToggle.tsx)
    // ========================================
    
    if (message.action === 'toggleTheme' && themeManager) {
      themeManager.toggle();
      const currentTheme = themeManager.getCurrent();
      
      // Salvar preferência
      saveThemePreference(currentTheme);
      
      // Responder com o tema atual
      sendResponse({ 
        success: true, 
        theme: currentTheme 
      });
      
      console.log('[Anki Modern] Tema alternado via popup:', currentTheme);
      
    } else if (message.action === 'setTheme' && themeManager) {
      const newTheme = message.theme as ThemeName;
      themeManager.switch(newTheme);
      
      // Salvar preferência
      saveThemePreference(newTheme);
      
      // Responder com sucesso
      sendResponse({ 
        success: true, 
        theme: newTheme 
      });
      
      console.log('[Anki Modern] Tema definido via popup:', newTheme);
      
    } else if (message.action === 'getTheme' && themeManager) {
      // Retornar tema atual
      sendResponse({ 
        success: true, 
        theme: themeManager.getCurrent() 
      });
      
    // ========================================
    // FORMATO LEGADO (ThemeSelector.tsx)
    // Para retrocompatibilidade com o sistema antigo
    // ========================================
    
    } else if (message.type === 'THEME_CHANGE' && themeManager) {
      console.log('[Anki Modern] Mensagem legada THEME_CHANGE ignorada');
      console.log('[Anki Modern] ThemeSelector afeta apenas o popup, não o AnkiWeb');
      
      // Responder com sucesso mas não fazer nada
      // (ThemeSelector é para o tema do popup, não do AnkiWeb)
      sendResponse({ 
        success: true,
        message: 'ThemeSelector only affects popup theme'
      });
      
    } else {
      sendResponse({ success: false, error: 'Unknown action' });
    }
    
    // Retornar true para manter o canal de mensagem aberto
    return true;
  });
}

/**
 * Mostra notificação temporária na tela
 */
function showNotification(message: string): void {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--accent);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--shadow-hover);
    z-index: 10000;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 14px;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Adicionar animação
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// BOOTSTRAP
// ============================================

/**
 * Inicialização principal
 */
async function bootstrap(): Promise<void> {
  console.log('[Anki Modern] Iniciando extensão...');
  
  try {
    // 1. Injetar estilos CSS
    injectAllStyles();
    
    // 2. Inicializar sistema de temas
    await initializeTheme();
    
    // 3. Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupFeatures);
    } else {
      setupFeatures();
    }
    
    // 4. Setup de listeners (não depende do DOM)
    setupKeyboardShortcuts();
    setupMessageListener();
    
    console.log('[Anki Modern] ✓ Extensão carregada com sucesso!');
  } catch (error) {
    console.error('[Anki Modern] ✗ Erro ao carregar extensão:', error);
  }
}

/**
 * Setup de features que dependem do DOM
 */
function setupFeatures(): void {
  console.log('[Anki Modern] Configurando features...');
  
  // Navbar scroll effect
  setupNavbarScrollEffect();
  
  // Futuras features podem ser adicionadas aqui
}

// Executar bootstrap
bootstrap();

// ============================================
// EXPORTS (para uso em testes/debug)
// ============================================

export { themeManager, saveThemePreference, showNotification };
