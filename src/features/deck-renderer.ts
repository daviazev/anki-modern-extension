/**
 * DECK RENDERER
 * Renderiza a árvore de decks com o novo visual moderno
 */

import type { DeckNode } from "./deck-parser";

export class DeckRenderer {
    /**
     * Cria o container principal
     */
    public static createContainer(): HTMLElement {
        const container = document.createElement('div');
        container.id = 'modern-deck-list';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '12px';
        return container;
    }

    /**
     * Renderiza um nó de deck (recursivo)
     */
    public static renderNode(deck: DeckNode): HTMLElement {
        const hasChildren = deck.children && deck.children.length > 0;
        const isReviewing = parseInt(deck.due) > 0;
        const isNew = parseInt(deck.new) > 0;

        // Container do Node
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'deck-node';
        nodeDiv.style.cssText = `
      margin-bottom: 8px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--bg-surface);
      transition: all 0.25s ease;
    `;

        // Header
        const header = document.createElement('div');
        header.className = 'deck-header';
        header.style.cssText = `
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background: transparent;
      transition: background 0.2s;
    `;

        // Hover effect via JS (ou poderia ser CSS injetado)
        header.onmouseenter = () => header.style.background = 'var(--bg-surface-hover)';
        header.onmouseleave = () => header.style.background = 'transparent';

        // Ícones SVG
        const bookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
        const folderIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
        const chevronIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
        const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="var(--accent)" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

        const iconSvg = hasChildren ? folderIcon : bookIcon;

        // HTML Interno do Header
        header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
        <div style="
          width: 40px; height: 40px; 
          background: var(--bg-main); 
          border-radius: 10px; 
          display: flex; align-items: center; justify-content: center; 
          color: var(--accent);
        ">${iconSvg}</div>
        <div style="font-weight: 600; font-size: 1.1rem; color: var(--text-main);">${deck.name}</div>
      </div>
      
      <div class="stats-group" style="display: flex; gap: 8px; align-items: center;">
        ${(isReviewing || isNew) ? `
          <div class="play-btn" title="Estudar" style="
            padding: 8px; cursor: pointer; margin-right: 8px; display: flex;
          ">${playIcon}</div>
        ` : ''}
        
        <span style="
          padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; min-width: 30px; text-align: center;
          background: ${isReviewing ? 'rgba(244, 63, 94, 0.15)' : 'rgba(150, 150, 150, 0.1)'};
          color: ${isReviewing ? 'var(--review)' : 'var(--text-muted)'};
        " title="Revisar">${deck.due}</span>
        
        <span style="
          padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; min-width: 30px; text-align: center;
          background: ${isNew ? 'rgba(16, 185, 129, 0.15)' : 'rgba(150, 150, 150, 0.1)'};
          color: ${isNew ? 'var(--success)' : 'var(--text-muted)'};
        " title="Novos">${deck.new}</span>
        
        <div class="toggle-icon" style="
          width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; 
          color: var(--text-muted); transition: transform 0.3s ease; margin-left: 10px;
          opacity: ${hasChildren ? '1' : '0'}; pointer-events: ${hasChildren ? 'auto' : 'none'};
        ">${chevronIcon}</div>
      </div>
    `;

        // Event Listeners
        const toggleIcon = header.querySelector('.toggle-icon') as HTMLElement;
        const playBtn = header.querySelector('.play-btn') as HTMLElement;

        // Ação de Estudar (Play Button)
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deck.originalElement.click();
            });
        }

        // Ação Principal (Header Click)
        header.addEventListener('click', () => {
            if (hasChildren) {
                // Toggle Expand
                const childrenContainer = nodeDiv.querySelector('.deck-children') as HTMLElement;
                const isOpen = childrenContainer.style.display !== 'none';

                if (isOpen) {
                    childrenContainer.style.display = 'none';
                    toggleIcon.style.transform = 'rotate(0deg)';
                } else {
                    childrenContainer.style.display = 'block';
                    toggleIcon.style.transform = 'rotate(90deg)';
                }
            } else {
                // Se é folha, estuda direto
                deck.originalElement.click();
            }
        });

        nodeDiv.appendChild(header);

        // Renderizar Filhos
        if (hasChildren) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'deck-children';
            childrenContainer.style.cssText = `
        display: none;
        padding-left: 24px;
        border-top: 1px solid var(--border);
        background: rgba(0,0,0,0.02);
      `;

            deck.children.forEach(child => {
                childrenContainer.appendChild(this.renderNode(child));
            });

            nodeDiv.appendChild(childrenContainer);
        }

        return nodeDiv;
    }
}
