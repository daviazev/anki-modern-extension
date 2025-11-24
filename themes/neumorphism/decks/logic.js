console.log("Aplicando tema 'Neumorphism Pro' com Fixes de Funcionalidade...");

// Função principal que aplica o tema
function init() {
  // CRÍTICO: Verifica se está na URL correta ANTES de fazer qualquer coisa
  if (window.location.pathname !== '/decks') {
    console.log('Tema Neumorphism Decks: URL incorreta, abortando...', window.location.pathname);
    return;
  }

  // Aguarda um pequeno delay para garantir que o DOM do AnkiWeb está completamente renderizado
  setTimeout(() => {
    // Double-check: verifica novamente a URL (caso tenha mudado durante o setTimeout)
    if (window.location.pathname !== '/decks') {
      console.log('Tema Neumorphism Decks: URL mudou durante carregamento, abortando...');
      return;
    }

    // Encontra o container principal
    const main = document.querySelector('main.container');
  
  if (!main) {
    console.error('main.container não encontrado!');
    return;
  }

  // IMPORTANTE: Remove TODAS as rows originais do AnkiWeb antes de criar a interface customizada
  const originalRows = main.querySelectorAll('.row.light-bottom-border, .row.mt-3, .row:not(#custom-interface *)');
  originalRows.forEach(row => {
    if (!row.closest('#custom-interface')) {
      row.style.display = 'none'; // Oculta as rows originais
    }
  });

  // Cria ou reutiliza o container da interface customizada
  let customInterface = document.getElementById('custom-interface');
  if (!customInterface) {
    customInterface = document.createElement('div');
    customInterface.id = 'custom-interface';
    main.appendChild(customInterface);
  }
function buildUI() {
    customInterface.innerHTML = '';
    const header = document.createElement('div');
    header.innerHTML = '<h1 class="page-title">Meus Estudos</h1>';
    customInterface.appendChild(header);
    const rows = Array.from(main.querySelectorAll('.row.light-bottom-border'));
    let root = { level: -1, children: [] };
    let stack = [root];
    rows.forEach(row => {
        const nameBtn = row.querySelector('button.btn-link.pl-0');
        const nbsp = (nameBtn.innerHTML.match(/&nbsp;/g) || []).length;
        const level = nbsp / 3;
        const due = parseInt(row.querySelector('.number.due')?.innerText) || 0;
        const newC = parseInt(row.querySelector('.number.new')?.innerText) || 0;
        const dropdown = row.querySelector('.dropdown-menu');
        const node = {
            level: level,
            name: nameBtn.innerText.trim(),
            due: due,
            new: newC,
            originalBtn: nameBtn,
            originalDropdown: dropdown,
            children: []
        };
        while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
        stack[stack.length - 1].children.push(node);
        stack.push(node);
    });
    const treeContainer = document.createElement('div');
    treeContainer.style.display = "flex";
    treeContainer.style.flexDirection = "column";
    function createNode(node, isRoot) {
        const container = document.createElement('div');
        container.className = isRoot ? 'deck-card' : 'child-wrapper';
        const content = document.createElement('div');
        content.className = isRoot ? 'card-content' : 'child-row';
        content.onclick = (e) => {
            if (e.target.closest('.dropdown-wrapper') || e.target.closest('.toggle-arrow')) return;
            if (node.children.length > 0) {
                const arrow = rightArea.querySelector('.toggle-arrow');
                if (arrow) arrow.click();
            } else {
                node.originalBtn.click();
            }
        };
        if (!isRoot && node.level > 1) {
            content.style.paddingLeft = `${32 + (node.level * 20)}px`;
        }
        const icon = document.createElement('div');
        icon.className = 'deck-icon';
        icon.innerHTML = isRoot 
            ? `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
        content.appendChild(icon);
        const name = document.createElement('div');
        name.className = 'deck-name';
        name.innerText = node.name;
        content.appendChild(name);
        const rightArea = document.createElement('div');
        rightArea.className = 'right-area';
        const pDue = document.createElement('span');
        pDue.className = `stats-pill ${node.due > 0 ? 'pill-due' : 'pill-zero'}`;
        pDue.innerText = node.due;
        const pNew = document.createElement('span');
        pNew.className = `stats-pill ${node.new > 0 ? 'pill-new' : 'pill-zero'}`;
        pNew.innerText = node.new;
        rightArea.appendChild(pDue);
        rightArea.appendChild(pNew);
        if (node.originalDropdown) {
            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.className = 'dropdown-wrapper';
            dropdownWrapper.style.position = 'relative';
            const actionsBtn = document.createElement('div');
            actionsBtn.className = 'custom-actions-btn';
            actionsBtn.innerText = 'Actions';
            const customMenu = document.createElement('div');
            customMenu.className = 'custom-dropdown-menu';
            const originalItems = node.originalDropdown.querySelectorAll('button, a');
            originalItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'custom-dropdown-item';
                menuItem.innerText = item.innerText;
                menuItem.onclick = (e) => {
                    e.stopPropagation();
                    customMenu.classList.remove('show');
                    actionsBtn.classList.remove('active');
                    item.click();
                };
                customMenu.appendChild(menuItem);
            });
            actionsBtn.onclick = (e) => {
                e.stopPropagation();
                document.querySelectorAll('.custom-dropdown-menu').forEach(m => {
                    if (m !== customMenu) m.classList.remove('show');
                });
                const isVisible = customMenu.classList.contains('show');
                isVisible ? customMenu.classList.remove('show') : customMenu.classList.add('show');
                isVisible ? actionsBtn.classList.remove('active') : actionsBtn.classList.add('active');
            };
            dropdownWrapper.appendChild(actionsBtn);
            dropdownWrapper.appendChild(customMenu);
            rightArea.appendChild(dropdownWrapper);
        }
        if (node.children.length > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'toggle-arrow';
            arrow.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
            arrow.onclick = (e) => {
                e.stopPropagation();
                const childBlock = container.querySelector('.children-block');
                if (childBlock) {
                    const isOpen = childBlock.classList.contains('open');
                    isOpen ? childBlock.classList.remove('open') : childBlock.classList.add('open');
                    isOpen ? arrow.classList.remove('rotated') : arrow.classList.add('rotated');
                }
            };
            rightArea.appendChild(arrow);
        } else {
            const spacer = document.createElement('div');
            spacer.style.width = '32px';
            rightArea.appendChild(spacer);
        }
        content.appendChild(rightArea);
        container.appendChild(content);
        if (node.children.length > 0) {
            const childBlock = document.createElement('div');
            childBlock.className = 'children-block';
            node.children.forEach(child => {
                childBlock.appendChild(createNode(child, false));
            });
            container.appendChild(childBlock);
        }
        return container;
    }
    root.children.forEach(child => {
        treeContainer.appendChild(createNode(child, true));
    });
    customInterface.appendChild(treeContainer);
    buildFooter();
}
function buildFooter() {
    const footer = document.createElement('div');
    footer.className = 'footer-container';
    const allLinks = Array.from(main.querySelectorAll('a'));
    const collectionLink = allLinks.find(a => a.innerText.includes('MB') && !a.href.includes('media'));
    const mediaLink = allLinks.find(a => a.href.includes('/account/media'));
    const statsRow = document.createElement('div');
    statsRow.className = 'footer-stats-row';
    const colText = document.createElement('div');
    colText.innerHTML = `Collection: `;
    if (collectionLink) {
        const span = document.createElement('span');
        span.innerText = collectionLink.innerText;
        span.onclick = () => collectionLink.click();
        colText.appendChild(span);
    } else { colText.innerHTML += "Unknown"; }
    const medText = document.createElement('div');
    medText.innerHTML = `Media: `;
    if (mediaLink) {
        const span = document.createElement('span');
        span.innerText = mediaLink.innerText;
        span.onclick = (e) => {
            e.preventDefault();
            mediaLink.click();
        };
        medText.appendChild(span);
    }
    statsRow.appendChild(colText);
    statsRow.appendChild(medText);
    const btnsRow = document.createElement('div');
    btnsRow.className = 'footer-buttons-row';
    const createBtn = (text, action, isPrimary = false) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.className = isPrimary ? 'big-btn big-btn-primary' : 'big-btn';
        btn.onclick = action;
        return btn;
    };
    btnsRow.appendChild(createBtn('Get Shared Decks', () => location.href='/shared/decks/'));
    btnsRow.appendChild(createBtn('My Shared Items', () => location.href='/shared/mine'));
    btnsRow.appendChild(createBtn('Create Deck', () => {
        const originalButtons = Array.from(document.querySelectorAll('button'));
        const realCreateBtn = originalButtons.find(b => b.innerText.trim() === 'Create Deck');
        if (realCreateBtn) {
            realCreateBtn.click();
        } else {
            const addLink = document.querySelector('a[href*="/add"]');
            if (addLink) addLink.click();
            else alert("Botão original 'Create Deck' não encontrado.");
        }
    }, true));
    footer.appendChild(statsRow);
    footer.appendChild(btnsRow);
    customInterface.appendChild(footer);
}
buildUI();
const observer = new MutationObserver((mutations) => {
    let shouldRebuild = false;
    mutations.forEach(m => {
        if (m.target === main || m.target.classList?.contains('row')) {
            const isCustomChange = Array.from(m.addedNodes).some(n => n.id === 'custom-interface') ||
                                   Array.from(m.removedNodes).some(n => n.id === 'custom-interface');
            if (!isCustomChange) {
                shouldRebuild = true;
            }
        }
    });
    if (shouldRebuild) {
        if (window.rebuildTimeout) clearTimeout(window.rebuildTimeout);
        window.rebuildTimeout = setTimeout(buildUI, 50);
    }
});
observer.observe(main, { childList: true, subtree: true });
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrapper')) {
        document.querySelectorAll('.custom-dropdown-menu').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.custom-actions-btn').forEach(b => b.classList.remove('active'));
    }
});
console.log("Tema aplicado e funcional!");
  }, 300); // Aguarda 300ms para o DOM estar completamente pronto
}

// Executa a inicialização
init();

// SEGURANÇA: Monitora mudanças de URL e remove o tema se sair de /decks
let lastPathname = window.location.pathname;
setInterval(() => {
  const currentPathname = window.location.pathname;
  if (currentPathname !== lastPathname) {
    console.log('Tema Neumorphism Decks: URL mudou de', lastPathname, 'para', currentPathname);
    lastPathname = currentPathname;
    
    // Se saiu de /decks, remove a interface customizada
    if (currentPathname !== '/decks') {
      const customInterface = document.getElementById('custom-interface');
      if (customInterface) {
        console.log('Tema Neumorphism Decks: Removendo interface customizada...');
        customInterface.remove();
      }
    }
  }
}, 500); // Verifica a cada 500ms
