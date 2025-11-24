// Loader principal da extensão: injeta JS/CSS do tema correto por URL, se ativado no storage
(async function() {
  console.log("LOADER INJETADO");
  
  // Checa se a extensão está ativada E qual tema usar
  const storage = await new Promise(resolve => {
    chrome.storage.local.get(['ankiModernActive', 'ankiModernTheme'], (result) => {
      resolve(result);
    });
  });
  
  if (!storage.ankiModernActive) {
    console.log("Extensão desativada, não injeta temas");
    return;
  }

  // Usa o tema salvo no storage (padrão: neumorphism)
  const theme = storage.ankiModernTheme || 'neumorphism';
  console.log(`Tema ativo: ${theme}`);
  let lastInjectedFolder = null;

  // Mapeia padrões de URL para pastas de tema
  // IMPORTANTE: Ordem importa! Patterns mais específicos primeiro (com IDs antes de genéricos)
  // NOTA: Sistema genérico que converte /path/to/page → path-to-page automaticamente
  const URL_PATTERNS = [
    // ===== ankiweb.net =====
    { pattern: /^\/decks\/share\/\d+$/, folder: 'decks-share-id', host: 'ankiweb.net' },
    { pattern: /^\/decks$/, folder: 'decks', host: 'ankiweb.net' },
    { pattern: /^\/account\/login$/, folder: 'account-login', host: 'ankiweb.net' },
    { pattern: /^\/account\/media$/, folder: 'account-media', host: 'ankiweb.net' },
    { pattern: /^\/account\/remove-account$/, folder: 'account-remove-account', host: 'ankiweb.net' },
    { pattern: /^\/account\/reset-password$/, folder: 'account-reset-password', host: 'ankiweb.net' },
    { pattern: /^\/account\/settings$/, folder: 'account-settings', host: 'ankiweb.net' },
    { pattern: /^\/account\/signup$/, folder: 'account-signup', host: 'ankiweb.net' },
    { pattern: /^\/search$/, folder: 'search', host: 'ankiweb.net' },
    { pattern: /^\/shared\/decks$/, folder: 'shared-decks', host: 'ankiweb.net' },
    { pattern: /^\/shared\/mine$/, folder: 'shared-mine', host: 'ankiweb.net' },
    
    // ===== ankiuser.net =====
    { pattern: /^\/edit\/\d+$/, folder: 'edit-id', host: 'ankiuser.net' },
    { pattern: /^\/study\/options$/, folder: 'study-options', host: 'ankiuser.net' },
    { pattern: /^\/study$/, folder: 'study', host: 'ankiuser.net' },
    { pattern: /^\/add$/, folder: 'add', host: 'ankiuser.net' },
  ];

  // Função que encontra a pasta do tema baseado na URL e host
  function getThemeFolderForPath(path) {
    const currentHost = window.location.hostname;
    
    for (const { pattern, folder, host } of URL_PATTERNS) {
      // Verifica se o host é compatível (se especificado)
      if (host && currentHost !== host) {
        continue;
      }
      
      if (pattern.test(path)) {
        console.log(`URL ${currentHost}${path} → tema: ${folder}`);
        return folder;
      }
    }
    
    console.log(`Nenhum tema configurado para ${currentHost}${path}`);
    return null;
  }

  // Função genérica que injeta CSS e JS para uma URL específica
  function injectThemeForPath(path) {
    const currentFolder = getThemeFolderForPath(path);

    // Remove CSS do tema anterior se mudou de pasta
    if (lastInjectedFolder && lastInjectedFolder !== currentFolder) {
      console.log(`Saiu de ${lastInjectedFolder}, removendo CSS...`);
      const oldCssId = `anki-modern-${lastInjectedFolder}-css`;
      const oldCSS = document.getElementById(oldCssId);
      if (oldCSS) {
        oldCSS.remove();
        console.log(`CSS do tema ${lastInjectedFolder} removido`);
      }
    }

    // Se não há tema para esta URL, apenas atualiza lastInjectedFolder e retorna
    if (!currentFolder) {
      console.log(`Nenhum tema configurado para ${path}`);
      lastInjectedFolder = null;
      return;
    }

    // Previne injeção duplicada
    if (lastInjectedFolder === currentFolder) {
      console.log(`Tema já injetado para ${currentFolder}, pulando...`);
      return;
    }

    console.log(`Injetando tema ${theme}/${currentFolder} para ${path}...`);

    // Injeta CSS (usa ID único por pasta para evitar duplicação)
    const cssId = `anki-modern-${currentFolder}-css`;
    let styleEl = document.getElementById(cssId);
    if (!styleEl) {
      const cssPath = chrome.runtime.getURL(`themes/${theme}/${currentFolder}/styles.css`);
      styleEl = document.createElement('link');
      styleEl.id = cssId;
      styleEl.rel = 'stylesheet';
      styleEl.type = 'text/css';
      styleEl.href = cssPath;
      document.head.appendChild(styleEl);
    }

    // Injeta o shared/common.js do tema ANTES do logic.js
    const sharedId = `anki-modern-${theme}-shared-js`;
    if (!document.getElementById(sharedId)) {
      const sharedPath = chrome.runtime.getURL(`themes/${theme}/shared/common.js`);
      const sharedScript = document.createElement('script');
      sharedScript.id = sharedId;
      sharedScript.src = sharedPath;
      sharedScript.type = 'text/javascript';
      sharedScript.onload = () => {
        console.log(`Shared do tema ${theme} carregado!`);
        // Só injeta a lógica do tema após o shared estar disponível
        injectThemeLogic();
      };
      sharedScript.onerror = (err) => console.error(`Erro ao carregar shared do tema ${theme}:`, err);
      (document.head || document.documentElement).appendChild(sharedScript);
    } else {
      // Shared já carregado, pode injetar a lógica direto
      injectThemeLogic();
    }

    function injectThemeLogic() {
      const jsPath = chrome.runtime.getURL(`themes/${theme}/${currentFolder}/logic.js`);
      const scriptEl = document.createElement('script');
      scriptEl.src = jsPath;
      scriptEl.type = 'text/javascript';
      scriptEl.onload = () => {
        console.log(`Lógica do tema ${currentFolder} carregada/reinjetada com sucesso!`);
        scriptEl.remove();
      };
      scriptEl.onerror = (err) => console.error(`Erro ao carregar lógica do tema ${currentFolder}:`, err);
      (document.head || document.documentElement).appendChild(scriptEl);
    }

    lastInjectedFolder = currentFolder;
  }

  // Injeta para a URL atual
  injectThemeForPath(window.location.pathname);

  // Monitora mudanças de URL (para navegação SPA)
  let lastPathname = window.location.pathname;
  setInterval(() => {
    const currentPathname = window.location.pathname;
    if (currentPathname !== lastPathname) {
      console.log(`URL mudou de ${lastPathname} para ${currentPathname}`);
      lastPathname = currentPathname;
      injectThemeForPath(currentPathname);
    }
  }, 300);
})();
