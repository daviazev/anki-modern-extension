const toggle = document.getElementById('toggleActive');
chrome.storage.local.get(['ankiModernActive'], (result) => {
  toggle.checked = !!result.ankiModernActive;
});
toggle.addEventListener('change', () => {
  const isActive = toggle.checked;
  chrome.storage.local.set({ ankiModernActive: isActive }, () => {
    // Recarrega as abas do AnkiWeb para aplicar/remover a extensão
    chrome.tabs.query({ url: 'https://ankiweb.net/*' }, (tabs) => {
      tabs.forEach(tab => chrome.tabs.reload(tab.id));
    });
  });
});
