// MutationObserver for SPA navigation detection
// Watches for Svelte/SvelteKit navigation and style removal

type ObserverCallback = () => void

export class NavigationObserver {
  private observer: MutationObserver | null = null
  private currentUrl: string = ""
  private onNavigate: ObserverCallback
  private onStyleRemoved: ObserverCallback

  constructor(callbacks: {
    onNavigate: ObserverCallback
    onStyleRemoved: ObserverCallback
  }) {
    this.currentUrl = window.location.href
    this.onNavigate = callbacks.onNavigate
    this.onStyleRemoved = callbacks.onStyleRemoved
    this.init()
  }

  private init() {
    // Watch for DOM changes in SPA
    this.observer = new MutationObserver((mutations) => {
      this.checkUrlChange()
      this.checkDomReplacements(mutations)
      this.checkStyleRemoval()
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    })

    // Listen to popstate for back/forward navigation
    window.addEventListener("popstate", () => this.handleNavigation())

    // Listen to pushState/replaceState (SvelteKit routing)
    this.interceptHistoryMethods()
  }

  /**
   * Intercepts history methods used by SvelteKit
   */
  private interceptHistoryMethods() {
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = (...args) => {
      originalPushState.apply(history, args)
      this.handleNavigation()
    }

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args)
      this.handleNavigation()
    }
  }

  /**
   * Checks if URL has changed
   */
  private checkUrlChange() {
    const newUrl = window.location.href
    if (newUrl !== this.currentUrl) {
      this.currentUrl = newUrl
      console.log("AnkiModern: URL changed to", newUrl)
    }
  }

  /**
   * Handles navigation event
   */
  private handleNavigation() {
    this.checkUrlChange()
    // Delay to allow Svelte to finish rendering
    setTimeout(() => {
      this.onNavigate()
    }, 100)
  }

  /**
   * Checks if main containers have been replaced
   */
  private checkDomReplacements(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        // Check if main container or quiz container was added
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            if (
              node.matches("main.container") ||
              node.matches("#quiz") ||
              node.querySelector("main.container") ||
              node.querySelector("#quiz")
            ) {
              console.log(
                "AnkiModern: Main container replaced, re-applying styles"
              )
              this.onNavigate()
            }
          }
        })
      }
    }
  }

  /**
   * Checks if the theme class was removed from HTML element
   */
  private checkStyleRemoval() {
    const htmlElement = document.documentElement
    const hasThemeClass = htmlElement.classList.contains(
      "anki-modern-theme-active"
    )

    if (!hasThemeClass) {
      console.log(
        "AnkiModern: Theme class removed by Svelte hydration, re-applying"
      )
      this.onStyleRemoved()
    }
  }

  /**
   * Cleanup observer
   */
  public destroy() {
    this.observer?.disconnect()
    this.observer = null
  }
}

/**
 * Initializes the navigation observer
 * @param callbacks - Callbacks for navigation and style removal events
 * @returns NavigationObserver instance
 */
export function initObserver(callbacks: {
  onNavigate: ObserverCallback
  onStyleRemoved: ObserverCallback
}): NavigationObserver {
  return new NavigationObserver(callbacks)
}
