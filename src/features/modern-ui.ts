/**
 * MODERN UI ORCHESTRATOR
 * Gerencia a substituição da interface antiga pela nova
 */

import { DeckParser } from "./deck-parser";
import { DeckRenderer } from "./deck-renderer";

export class ModernUI {
    private static isInitialized = false;

    /**
   * Aguarda o carregamento da lista de decks
   */
    private static waitForDecks(): Promise<void> {
        return new Promise((resolve) => {
            // Se já existe, retorna
            if (document.querySelector('.row.light-bottom-border')) {
                resolve();
                return;
            }

            // Observer para esperar aparecer
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.row.light-bottom-border')) {
                    obs.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Timeout de segurança (5s)
            setTimeout(() => {
                observer.disconnect();
                resolve(); // Tenta mesmo assim ou falha silenciosamente
            }, 5000);
        });
    }

    /**
     * Inicializa a interface moderna se estivermos na página de decks
     */
    public static async init(): Promise<void> {
        if (this.isInitialized) return;

        // Verificar se estamos na página de decks
        const path = window.location.pathname;
        if (path !== '/decks' && path !== '/') return;

        console.log('[Anki Modern] Aguardando lista de decks...');
        await this.waitForDecks();

        console.log('[Anki Modern] Inicializando Modern UI...');

        // 1. Parsear Decks e Metadados
        const deckData = DeckParser.parse();
        if (deckData.decks.length === 0) {
            console.warn('[Anki Modern] Nenhum deck encontrado ou falha no parser.');
            return;
        }

        // 2. Preparar Container
        const mainContainer = document.querySelector('main.container');
        if (!mainContainer) return;

        // Limpar conteúdo antigo
        mainContainer.innerHTML = '';

        // 3. Renderizar Título
        const title = document.createElement('h1');
        title.className = 'page-title';
        title.innerText = 'Meus Estudos';
        title.style.cssText = `
      font-size: 2.5rem;
      margin-bottom: 2rem;
      background: var(--gradient-title);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    `;
        mainContainer.appendChild(title);

        // 4. Renderizar Árvore de Decks
        const deckContainer = DeckRenderer.createContainer();
        deckData.decks.forEach(node => {
            deckContainer.appendChild(DeckRenderer.renderNode(node));
        });
        mainContainer.appendChild(deckContainer);

        // 5. Renderizar Ações (Botões)
        if (deckData.actions.length > 0) {
            const actionsContainer = DeckRenderer.renderActions(deckData.actions);
            mainContainer.appendChild(actionsContainer);
        }

        // 6. Renderizar Estatísticas
        if (deckData.stats) {
            const statsContainer = DeckRenderer.renderStats(deckData.stats);
            mainContainer.appendChild(statsContainer);
        }

        // 7. Adicionar Footer
        this.renderFooter();

        this.isInitialized = true;
    }

    private static renderFooter(): void {
        const footer = document.createElement('div');
        footer.style.cssText = "margin-top: 60px; text-align: center; color: var(--text-muted); font-size: 0.8rem;";
        footer.innerHTML = `AnkiWeb 2025 Redesign • Foco no essencial`;
        document.body.appendChild(footer);

        // Esconder footer antigo
        const oldFooter = document.querySelector('.container-fluid.bg-gray') as HTMLElement;
        if (oldFooter) oldFooter.style.display = 'none';
    }
}
