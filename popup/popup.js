// ===== Elementos do DOM =====
const toggle = document.getElementById('toggleActive');
const themeSelect = document.getElementById('themeSelect');
const themeSelectorContainer = document.getElementById('themeSelectorContainer');

// ===== Lista de Temas Disponíveis =====
// NOTA: Adicione novos temas aqui quando criá-los
const AVAILABLE_THEMES = [
  { value: 'neumorphism', label: 'Neumorphism' },
  // { value: 'dracula', label: 'Dracula' },
  // { value: 'nord', label: 'Nord' },
  // Adicione mais temas conforme criar
];

// ===== Carrega Estado Inicial =====
chrome.storage.local.get(['ankiModernActive', 'ankiModernTheme'], (result) => {
  // Toggle
  toggle.checked = !!result.ankiModernActive;
  
  // Tema (padrão: neumorphism)
  const currentTheme = result.ankiModernTheme || 'neumorphism';
  themeSelect.value = currentTheme;
  
  // Mostra seletor de tema apenas se extensão estiver ativa
  if (result.ankiModernActive) {
    themeSelectorContainer.style.display = 'flex';
  }
});

// ===== Popula Dropdown de Temas =====
function populateThemeSelector() {
  themeSelect.innerHTML = '';
  AVAILABLE_THEMES.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme.value;
    option.textContent = theme.label;
    themeSelect.appendChild(option);
  });
}
populateThemeSelector();

// ===== Event Listeners =====

// Toggle on/off
toggle.addEventListener('change', () => {
  const isActive = toggle.checked;
  
  chrome.storage.local.set({ ankiModernActive: isActive }, () => {
    // Mostra/oculta seletor de tema
    themeSelectorContainer.style.display = isActive ? 'flex' : 'none';
    
    // Recarrega as abas do AnkiWeb e AnkiUser
    reloadAnkiTabs();
  });
});

// Seleção de tema
themeSelect.addEventListener('change', () => {
  const selectedTheme = themeSelect.value;
  
  chrome.storage.local.set({ ankiModernTheme: selectedTheme }, () => {
    console.log(`Tema alterado para: ${selectedTheme}`);
    
    // Recarrega as abas para aplicar novo tema
    reloadAnkiTabs();
  });
});

// ===== Função Helper =====
function reloadAnkiTabs() {
  // Recarrega todas as abas do AnkiWeb e AnkiUser
  chrome.tabs.query({ url: ['https://ankiweb.net/*', 'https://ankiuser.net/*'] }, (tabs) => {
    tabs.forEach(tab => chrome.tabs.reload(tab.id));
  });
}
