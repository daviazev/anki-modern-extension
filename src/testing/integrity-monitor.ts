/**
 * INTEGRITY MONITOR
 * Verifica se elementos funcionais originais do AnkiWeb foram preservados ou corretamente substituídos.
 */

export class IntegrityMonitor {
    private static originalElements: Map<HTMLElement, boolean> = new Map();

    /**
     * Inicializa o monitoramento
     */
    public static init() {
        console.log('[IntegrityMonitor] Iniciando verificação de integridade...');
        this.scanOriginalElements();

        // Roda a verificação após um breve delay para garantir que a UI moderna renderizou
        setTimeout(() => {
            this.checkIntegrity();
        }, 1000);
    }

    /**
     * Escaneia o DOM em busca de elementos interativos originais
     */
    private static scanOriginalElements() {
        // Seletores de elementos que importam
        const selectors = [
            'a[href]',
            'button',
            'input[type="button"]',
            'input[type="submit"]',
            'select'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Ignora elementos que já são da nossa extensão (se houver alguma classe específica, por enquanto assumimos que tudo no body inicial era original)
                // Mas como a extensão roda depois, precisamos diferenciar.
                // Uma estratégia é assumir que elementos dentro de .container ou main originais são os alvos.

                // Para simplificar: vamos monitorar tudo que NÃO está dentro do nosso container moderno
                if (!el.closest('#modern-deck-list') && !el.closest('.deck-actions') && !el.closest('.deck-stats')) {
                    this.originalElements.set(el as HTMLElement, false);
                }
            });
        });

        console.log(`[IntegrityMonitor] ${this.originalElements.size} elementos originais encontrados.`);
    }

    /**
     * Verifica se os elementos originais estão acessíveis ou têm um proxy
     */
    private static checkIntegrity() {
        let missingCount = 0;
        const report: string[] = [];

        this.originalElements.forEach((_, element) => {
            // 1. Verifica se está visível
            if (this.isVisible(element)) {
                return; // Tudo certo, o elemento original ainda está lá e visível
            }

            // 2. Se não está visível, verifica se tem um substituto moderno
            // A extensão deve marcar elementos modernos com 'data-original-selector' ou similar,
            // ou nós podemos inferir pelo texto/href.

            const isProxied = this.checkForProxy(element);
            if (isProxied) {
                return; // Tudo certo, tem um substituto
            }

            // Se chegou aqui, temos um problema
            missingCount++;
            report.push(`[MISSING] Elemento perdido: ${this.getElementSummary(element)}`);
        });

        if (missingCount > 0) {
            console.warn(`[IntegrityMonitor] ⚠️ ALERTA DE INTEGRIDADE: ${missingCount} elementos funcionais podem estar inacessíveis!`);
            console.groupCollapsed('[IntegrityMonitor] Detalhes dos elementos perdidos');
            report.forEach(line => console.warn(line));
            console.groupEnd();
        } else {
            console.log('[IntegrityMonitor] ✅ Integridade verificada: Todos os elementos originais estão preservados ou substituídos.');
        }
    }

    /**
     * Verifica se um elemento é considerado visível pelo usuário
     */
    private static isVisible(element: HTMLElement): boolean {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    /**
     * Tenta encontrar um elemento moderno que substitua o original
     */
    private static checkForProxy(original: HTMLElement): boolean {
        // Estratégia 1: Texto coincidente (para botões e links)
        const text = original.innerText.trim();
        if (text) {
            // Procura no container moderno por algo com texto similar
            const modernMatches = Array.from(document.querySelectorAll('#modern-deck-list, .deck-actions, .deck-stats, .modern-footer'))
                .flatMap(c => Array.from(c.querySelectorAll('*')))
                .filter(el => (el as HTMLElement).innerText?.trim() === text);

            if (modernMatches.length > 0) return true;
        }

        // Estratégia 2: Href coincidente (para links)
        if (original instanceof HTMLAnchorElement) {
            const href = original.getAttribute('href');
            if (href) {
                const modernLink = document.querySelector(`a[href="${href}"]`);
                if (modernLink && this.isVisible(modernLink as HTMLElement)) return true;
            }
        }

        // Estratégia 3: Marcação explícita (futuro)
        // if (original.id && document.querySelector(`[data-proxy-for="${original.id}"]`)) return true;

        return false;
    }

    private static getElementSummary(element: HTMLElement): string {
        let summary = element.tagName.toLowerCase();
        if (element.id) summary += `#${element.id}`;
        if (element.className) summary += `.${element.className.split(' ').join('.')}`;
        if (element.innerText) summary += ` "${element.innerText.substring(0, 20)}${element.innerText.length > 20 ? '...' : ''}"`;
        if (element instanceof HTMLAnchorElement && element.href) summary += ` [href="${element.getAttribute('href')}"]`;
        return summary;
    }
}
