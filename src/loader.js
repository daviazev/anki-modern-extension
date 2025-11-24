// Loader principal da extensão: injeta JS/CSS do tema correto por URL, se ativado no storage
(async function() {
  // Checa se a extensão está ativada
  const isActive = await new Promise(resolve => {
    chrome.storage.local.get(['ankiModernActive'], (result) => {
      resolve(!!result.ankiModernActive);
    });
  });
  if (!isActive) return;

  // Detecta URL e tema
  const theme = 'neumorphism';
  const path = window.location.pathname;

  // Decks
  if (path === '/decks') {
    // Injeta CSS
    const cssPath = chrome.runtime.getURL(`themes/${theme}/decks/styles.css`);
    const styleEl = document.createElement('link');
    styleEl.rel = 'stylesheet';
    styleEl.type = 'text/css';
    styleEl.href = cssPath;
    document.head.appendChild(styleEl);
    // Injeta a lógica JS do tema via script src (contorna CSP)
    const jsPath = chrome.runtime.getURL(`themes/${theme}/decks/logic.js`);
    const scriptEl = document.createElement('script');
    scriptEl.src = jsPath;
    scriptEl.type = 'text/javascript';
    scriptEl.onload = () => {
      console.log('Lógica do tema carregada com sucesso!');
      scriptEl.remove(); // Remove após execução
    };
    scriptEl.onerror = (err) => console.error('Erro ao carregar lógica do tema:', err);
    (document.head || document.documentElement).appendChild(scriptEl);
  }
})();
console.log("LOADER INJETADO");
