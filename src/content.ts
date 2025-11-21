// Main logic for CSS injection into AnkiWeb

import type { PlasmoCSConfig } from "plasmo"

import baseCss from "data-text:~content/styles/base.css"
import deckListCss from "data-text:~content/styles/deck-list.css"
import formsCss from "data-text:~content/styles/forms.css"
import globalCss from "data-text:~content/styles/global.css"
import studyCss from "data-text:~content/styles/study.css"

// Plasmo content script configuration
export const config: PlasmoCSConfig = {
  matches: ["https://ankiweb.net/*", "https://ankiuser.net/*"],
  all_frames: false
}

/**
 * Injects the base CSS variables into the page
 */
function injectBaseStyles() {
  // Inject base CSS variables
  const baseStyleElement = document.createElement("style")
  baseStyleElement.id = "anki-modern-base-styles"
  baseStyleElement.textContent = baseCss
  document.head.appendChild(baseStyleElement)

  // Inject global styles
  const globalStyleElement = document.createElement("style")
  globalStyleElement.id = "anki-modern-global-styles"
  globalStyleElement.textContent = globalCss
  document.head.appendChild(globalStyleElement)

  // Inject deck list styles
  const deckListStyleElement = document.createElement("style")
  deckListStyleElement.id = "anki-modern-deck-list-styles"
  deckListStyleElement.textContent = deckListCss
  document.head.appendChild(deckListStyleElement)

  // Inject study screen styles
  const studyStyleElement = document.createElement("style")
  studyStyleElement.id = "anki-modern-study-styles"
  studyStyleElement.textContent = studyCss
  document.head.appendChild(studyStyleElement)

  // Inject forms styles
  const formsStyleElement = document.createElement("style")
  formsStyleElement.id = "anki-modern-forms-styles"
  formsStyleElement.textContent = formsCss
  document.head.appendChild(formsStyleElement)
}

// Theme color mappings
const THEME_COLORS: Record<
  string,
  {
    primary: string
    bgMain: string
    bgCard: string
    bgNav: string
    textPrimary: string
    textSecondary: string
    borderColor: string
    inputBg: string
  }
> = {
  "default-dark": {
    primary: "#BB86FC",
    bgMain: "#121212",
    bgCard: "#1E1E1E",
    bgNav: "#181818",
    textPrimary: "#E0E0E0",
    textSecondary: "#A0A0A0",
    borderColor: "#333333",
    inputBg: "#2C2C2C"
  },
  "matrix-green": {
    primary: "#00FF41",
    bgMain: "#0D0208",
    bgCard: "#1A1A1A",
    bgNav: "#0F0F0F",
    textPrimary: "#00FF41",
    textSecondary: "#00B82E",
    borderColor: "#003B00",
    inputBg: "#1A1A1A"
  },
  "ocean-blue": {
    primary: "#64B5F6",
    bgMain: "#0A1929",
    bgCard: "#132F4C",
    bgNav: "#0D2137",
    textPrimary: "#E3F2FD",
    textSecondary: "#90CAF9",
    borderColor: "#1E4976",
    inputBg: "#0D2137"
  }
}

/**
 * Applies the theme by adding the active class and updating CSS variables
 * @param themeId - The theme identifier
 */
export function applyTheme(themeId?: string) {
  const htmlElement = document.documentElement

  // Add the theme active class to enable the CSS variables
  if (!htmlElement.classList.contains("anki-modern-theme-active")) {
    htmlElement.classList.add("anki-modern-theme-active")
  }

  // Apply theme-specific colors if themeId is provided
  if (themeId && THEME_COLORS[themeId]) {
    const colors = THEME_COLORS[themeId]
    updateThemeVariables({
      "--anki-primary-accent": colors.primary,
      "--anki-bg-main": colors.bgMain,
      "--anki-bg-card": colors.bgCard,
      "--anki-bg-nav": colors.bgNav,
      "--anki-text-primary": colors.textPrimary,
      "--anki-text-secondary": colors.textSecondary,
      "--anki-border-color": colors.borderColor,
      "--anki-input-bg": colors.inputBg
    })
    console.log("AnkiModern: Theme applied:", themeId)
  } else {
    console.log("AnkiModern: Theme class applied")
  }
}

/**
 * Removes the theme by removing the active class
 */
export function removeTheme() {
  const htmlElement = document.documentElement
  htmlElement.classList.remove("anki-modern-theme-active")
  console.log("AnkiModern: Theme removed")
}

/**
 * Updates theme CSS variables dynamically
 * @param cssVariables - Object with CSS variable names and values
 */
export function updateThemeVariables(cssVariables: Record<string, string>) {
  const htmlElement = document.documentElement

  Object.entries(cssVariables).forEach(([key, value]) => {
    htmlElement.style.setProperty(key, value)
  })

  console.log("AnkiModern: Theme variables updated", cssVariables)
}

// Store current theme ID
let currentThemeId: string = "default-dark"

/**
 * Loads the saved theme from storage and applies it
 */
async function loadSavedTheme() {
  try {
    const result = await chrome.storage.sync.get("theme")
    if (result.theme) {
      currentThemeId = result.theme
      console.log("AnkiModern: Loaded saved theme:", currentThemeId)
      return currentThemeId
    }
  } catch (error) {
    console.error("AnkiModern: Failed to load theme:", error)
  }
  return currentThemeId
}

/**
 * Sets up storage change listener
 */
function setupStorageListener() {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.theme) {
      const newTheme = changes.theme.newValue
      if (newTheme && newTheme !== currentThemeId) {
        console.log(
          "AnkiModern: Theme changed in storage:",
          currentThemeId,
          "->",
          newTheme
        )
        currentThemeId = newTheme
        applyTheme(newTheme)
      }
    }
  })
  console.log("AnkiModern: Storage listener initialized")
}

// Initialize the extension
async function init() {
  console.log("AnkiModern: Initializing content script")

  // Inject base styles
  injectBaseStyles()

  // Load saved theme from storage BEFORE applying (avoids flicker)
  const savedTheme = await loadSavedTheme()

  // Apply theme with saved preference
  applyTheme(savedTheme)

  // Set up storage change listener for real-time updates
  setupStorageListener()

  // Initialize observer for SPA navigation
  initializeObserver()
}

/**
 * Initializes the observer to handle SPA navigation
 */
function initializeObserver() {
  // Dynamically import observer to avoid circular dependencies
  import("./content/observer").then(({ initObserver }) => {
    initObserver({
      onNavigate: () => {
        // Re-apply theme after navigation with current theme
        applyTheme(currentThemeId)
      },
      onStyleRemoved: () => {
        // Re-apply theme if class was removed by Svelte
        applyTheme(currentThemeId)
      }
    })
    console.log("AnkiModern: Observer initialized")
  })
}

/**
 * Listen for messages from popup to change theme
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "THEME_CHANGE") {
    console.log("AnkiModern: Received theme change request:", request.themeId)
    currentThemeId = request.themeId
    // Re-apply theme with new settings
    applyTheme(request.themeId)
    sendResponse({ success: true })
  }
  return true
})

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}
