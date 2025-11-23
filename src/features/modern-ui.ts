/**
 * MODERN UI ORCHESTRATOR
 * Gerencia a substituição da interface antiga pela nova
 */

import { DeckParser } from "./deck-parser";
import { DeckRenderer } from "./deck-renderer";
import { IntegrityMonitor } from "../testing/integrity-monitor";

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

        // Limpar conteúdo antigo - NÃO FAZER ISSO (Destrutivo)
        // mainContainer.innerHTML = '';

        // Adicionar classe ao body para controle CSS
        document.body.classList.add('anki-modern-active');

        // Criar wrapper para a UI moderna (se não existir)
        let modernWrapper = document.getElementById('modern-ui-wrapper');
        if (modernWrapper) {
            modernWrapper.innerHTML = ''; // Limpa apenas o nosso wrapper se já existir
        } else {
            modernWrapper = document.createElement('div');
            modernWrapper.id = 'modern-ui-wrapper';
            mainContainer.appendChild(modernWrapper);
        }

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
        modernWrapper.appendChild(title);

        // 4. Renderizar Árvore de Decks
        const deckContainer = DeckRenderer.createContainer();
        deckData.decks.forEach(node => {
            deckContainer.appendChild(DeckRenderer.renderNode(node));
        });
        modernWrapper.appendChild(deckContainer);

        // 5. Renderizar Ações (Botões)
        if (deckData.actions.length > 0) {
            const actionsContainer = DeckRenderer.renderActions(deckData.actions);
            modernWrapper.appendChild(actionsContainer);
        }

        // 6. Renderizar Estatísticas
        if (deckData.stats) {
            const statsContainer = DeckRenderer.renderStats(deckData.stats);
            modernWrapper.appendChild(statsContainer);
        }

        // 7. Renderizar Footer (Links Originais)
        if (deckData.footerLinks.length > 0) {
            const footerContainer = DeckRenderer.renderFooter(deckData.footerLinks);
            modernWrapper.appendChild(footerContainer);
        }

        // Esconder footer antigo (se ainda estiver visível fora do main)
        const oldFooter = document.querySelector('.container-fluid.bg-gray') as HTMLElement;
        if (oldFooter) oldFooter.style.display = 'none';

        this.isInitialized = true;

        // 8. Monitor de Integridade
        IntegrityMonitor.init();
    }
}
