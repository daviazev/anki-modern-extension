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
    actions?: HTMLElement; // Dropdown original de ações
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

export interface DeckFooterLink {
    label: string;
    href: string;
    originalElement: HTMLElement;
}

export interface DeckData {
    decks: DeckNode[];
    stats: DeckStats | null;
    actions: DeckAction[];
    footerLinks: DeckFooterLink[];
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
        // Tenta encontrar a linha de estatísticas de forma mais genérica
        // Geralmente contém dois tamanhos de arquivo (ex: "3.76MB" e "2730.65MB")
        const rows = Array.from(document.querySelectorAll('.row'));

        // Regex para tamanho de arquivo: número + (opcional ponto + números) + KB/MB/GB/TB (case insensitive)
        const fileSizeRegex = /[0-9]+(\.[0-9]+)?\s*[KMGT]?B/i;

        const statsRow = rows.find(row => {
            const text = row.textContent || '';
            // Verifica se tem pelo menos dois padrões de tamanho de arquivo e NÃO é um deck (não tem botão de link)
            const matches = text.match(new RegExp(fileSizeRegex, 'gi'));
            const hasLink = row.querySelector('button.btn-link');
            return matches && matches.length >= 2 && !hasLink;
        });

        if (!statsRow) return null;

        const colText = (statsRow as HTMLElement).innerText;

        // Extrai todos os tamanhos encontrados
        const sizes = colText.match(new RegExp(fileSizeRegex, 'gi'));

        return {
            collection: sizes && sizes[0] ? sizes[0] : '?',
            media: sizes && sizes[1] ? sizes[1] : '?',
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
     * Extrai links do rodapé (Apps, About, Terms, Privacy, etc)
     */
    private static parseFooter(): DeckFooterLink[] {
        const links: DeckFooterLink[] = [];
        // O footer geralmente está em .container-fluid.bg-gray > ul.nav > li.nav-item > a.nav-link
        const footerLinks = Array.from(document.querySelectorAll('.container-fluid.bg-gray .nav-link'));

        footerLinks.forEach(link => {
            const anchor = link as HTMLAnchorElement;
            if (anchor.href && anchor.innerText) {
                links.push({
                    label: anchor.innerText.trim(),
                    href: anchor.getAttribute('href') || '', // Pega o atributo original para garantir
                    originalElement: anchor
                });
            }
        });

        return links;
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

            // Encontrar o dropdown de ações (geralmente um .btn-group ou .dropdown)
            // No AnkiWeb atual, é frequentemente um botão "Actions" que abre um menu
            // Vamos tentar pegar o container pai do botão de ações
            const actionsBtn = row.querySelector('button.dropdown-toggle') || row.querySelector('.actions-dropdown');
            let actionsContainer: HTMLElement | undefined;

            if (actionsBtn) {
                // Se achou o botão, pega o pai (o .dropdown ou .btn-group) para mover tudo junto
                actionsContainer = actionsBtn.closest('.dropdown, .btn-group') as HTMLElement;
                if (!actionsContainer) actionsContainer = actionsBtn as HTMLElement; // Fallback
            }

            flatDecks.push({
                name: name,
                level: level,
                due: dueEl ? dueEl.innerText.trim() : "0",
                new: newEl ? newEl.innerText.trim() : "0",
                originalElement: linkBtn,
                actions: actionsContainer,
                children: []
            });
        });

        return {
            decks: this.buildTree(flatDecks),
            stats: this.parseStats(),
            actions: this.parseActions(),
            footerLinks: this.parseFooter()
        };
    }
}
