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
     * Parseia o DOM atual e retorna a árvore de decks
     */
    public static parse(): DeckNode[] {
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

        return this.buildTree(flatDecks);
    }
}
