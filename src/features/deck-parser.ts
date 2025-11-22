/**
 * DECK PARSER
 * Extrai a estrutura de decks do HTML original do AnkiWeb
 */

export interface DeckNode {
    name: string;
    level: number;
    due: string;
    new: string;
    originalElement: HTMLElement;
    children: DeckNode[];
}

export interface DeckStats {
    collection: string;
    media: string;
    originalElement: HTMLElement;
}

export interface DeckAction {
    label: string;
    originalElement: HTMLElement;
}

export interface DeckData {
    decks: DeckNode[];
    stats: DeckStats | null;
    actions: DeckAction[];
}

export class DeckParser {
    /**
     * Conta o nível de indentação baseado em espaços/NBSP
     */
    private static getIndentLevel(text: string): number {
        let count = 0;
        for (let i = 0; i < text.length; i++) {
            // Char code 160 é o &nbsp;
            if (text.charCodeAt(i) === 160 || text[i] === ' ') {
                count++;
            } else {
                break;
            }
        }
        // No AnkiWeb, cada nível costuma ter 3 ou 6 espaços
        return Math.floor(count / 3);
    }

    /**
     * Constrói a árvore hierárquica de decks
     */
    private static buildTree(flatDecks: DeckNode[]): DeckNode[] {
        const root: DeckNode[] = [];
        const stack: DeckNode[] = [];

        flatDecks.forEach(deck => {
            // Ajustar a stack para o nível correto
            while (stack.length > 0 && stack[stack.length - 1].level >= deck.level) {
                stack.pop();
            }

            if (stack.length === 0) {
                // É um item raiz
                root.push(deck);
                stack.push(deck);
            } else {
                // É filho do item que está no topo da stack
                const parent = stack[stack.length - 1];
                parent.children.push(deck);
                stack.push(deck);
            }
        });

        return root;
    }

    /**
     * Extrai estatísticas de coleção e mídia
     */
    private static parseStats(): DeckStats | null {
        // Procura pela linha que contém "Collection:"
        const rows = Array.from(document.querySelectorAll('.row'));
        const statsRow = rows.find(row => row.textContent?.includes('Collection:'));

        if (!statsRow) return null;

        const colText = (statsRow as HTMLElement).innerText; // Ex: "Collection: 3.76MB Media: 2730.65MB"

        // Extração simples baseada em regex ou split
        const collectionMatch = colText.match(/Collection:\s*([0-9.]+[A-Z]+)/i);
        const mediaMatch = colText.match(/Media:\s*([0-9.]+[A-Z]+)/i);

        return {
            collection: collectionMatch ? collectionMatch[1] : '?',
            media: mediaMatch ? mediaMatch[1] : '?',
            originalElement: statsRow as HTMLElement
        };
    }

    /**
     * Extrai botões de ação (Get Shared Decks, Create Deck, etc)
     */
    private static parseActions(): DeckAction[] {
        const actions: DeckAction[] = [];

        // Geralmente estão na última row com botões btn-outline-secondary
        const buttons = Array.from(document.querySelectorAll('.btn-outline-secondary'));

        buttons.forEach(btn => {
            const label = btn.textContent?.trim() || '';
            if (label) {
                actions.push({
                    label: label,
                    originalElement: btn as HTMLElement
                });
            }
        });

        return actions;
    }

    /**
     * Parseia o DOM atual e retorna a árvore de decks e metadados
     */
    public static parse(): DeckData {
        const rows = Array.from(document.querySelectorAll('.row.light-bottom-border'));
        const flatDecks: DeckNode[] = [];

        rows.forEach(row => {
            const linkBtn = row.querySelector('button.btn-link') as HTMLElement;
            if (!linkBtn) return;

            const rawText = linkBtn.textContent || '';
            const name = rawText.trim();
            const level = this.getIndentLevel(rawText);

            const dueEl = row.querySelector('.number.due') as HTMLElement;
            const newEl = row.querySelector('.number.new') as HTMLElement;

            flatDecks.push({
                name: name,
                level: level,
                due: dueEl ? dueEl.innerText.trim() : "0",
                new: newEl ? newEl.innerText.trim() : "0",
                originalElement: linkBtn,
                children: []
            });
        });

        return {
            decks: this.buildTree(flatDecks),
            stats: this.parseStats(),
            actions: this.parseActions()
        };
    }
}
