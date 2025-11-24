// Loader principal da extensão: injeta JS/CSS do tema correto por URL, se ativado no storage
(async function() {
  console.log("LOADER INJETADO");
  
  // Checa se a extensão está ativada
  const isActive = await new Promise(resolve => {
    chrome.storage.local.get(['ankiModernActive'], (result) => {
      resolve(!!result.ankiModernActive);
    });
  });
  if (!isActive) {
    console.log("Extensão desativada, não injeta temas");
    return;
  }

  const theme = 'neumorphism';
  let lastInjectedPath = null;

  // Função que injeta CSS e JS para uma URL específica
  function injectThemeForPath(path) {
    // Remove CSS de temas anteriores quando muda de página
    if (lastInjectedPath && lastInjectedPath !== path) {
      console.log(`Saiu de ${lastInjectedPath}, removendo CSS...`);
      
      // Remove CSS do tema /decks
      if (lastInjectedPath === '/decks') {
        const decksCSS = document.getElementById('anki-modern-decks-css');
        if (decksCSS) {
          decksCSS.remove();
          console.log('CSS do tema /decks removido');
        }
      }
    }

    // Previne injeção duplicada
    if (lastInjectedPath === path) {
      console.log(`Tema já injetado para ${path}, pulando...`);
      return;
    }

    // Decks
    if (path === '/decks') {
      console.log('Injetando tema Neumorphism para /decks...');
      
      // Injeta CSS (usa ID para evitar duplicação)
      let styleEl = document.getElementById('anki-modern-decks-css');
      if (!styleEl) {
        const cssPath = chrome.runtime.getURL(`themes/${theme}/decks/styles.css`);
        styleEl = document.createElement('link');
        styleEl.id = 'anki-modern-decks-css';
        styleEl.rel = 'stylesheet';
        styleEl.type = 'text/css';
        styleEl.href = cssPath;
        document.head.appendChild(styleEl);
      }
      
      // Injeta a lógica JS do tema via script src (contorna CSP)
      // IMPORTANTE: Injeta SEMPRE porque precisamos reinicializar ao voltar para /decks
      const jsPath = chrome.runtime.getURL(`themes/${theme}/decks/logic.js`);
      const scriptEl = document.createElement('script');
      scriptEl.src = jsPath;
      scriptEl.type = 'text/javascript';
      scriptEl.onload = () => {
        console.log('Lógica do tema carregada/reinjetada com sucesso!');
        scriptEl.remove(); // Remove após execução
      };
      scriptEl.onerror = (err) => console.error('Erro ao carregar lógica do tema:', err);
      (document.head || document.documentElement).appendChild(scriptEl);
      
      lastInjectedPath = path;
    } else {
      // Se não está em nenhuma URL com tema, limpa lastInjectedPath
      lastInjectedPath = null;
    }
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
