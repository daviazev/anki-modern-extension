// Service Worker for AnkiModern Extension

export {}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("AnkiModern extension installed")
})

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle different message types
  return true // Keep channel open for async responses
})
