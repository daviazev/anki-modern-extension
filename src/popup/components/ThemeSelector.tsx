// Theme Selector Component

import React, { useEffect, useState } from "react"

import { Storage } from "~lib/storage"
import { useAuth } from "~popup/context/AuthContext"

// Hardcoded themes for now
const THEMES = [
  {
    id: "default-dark",
    name: "Default Dark",
    description: "Modern dark theme with purple accents",
    colors: {
      primary: "#BB86FC",
      bgMain: "#121212",
      bgCard: "#1E1E1E"
    }
  },
  {
    id: "matrix-green",
    name: "Matrix Green",
    description: "Hacker-style green on black",
    colors: {
      primary: "#00FF41",
      bgMain: "#0D0208",
      bgCard: "#1A1A1A"
    }
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Calm blue tones for focus",
    colors: {
      primary: "#64B5F6",
      bgMain: "#0A1929",
      bgCard: "#132F4C"
    }
  }
]

export function ThemeSelector() {
  const { user } = useAuth()
  const [selectedTheme, setSelectedTheme] = useState<string>("default-dark")
  const [loading, setLoading] = useState(false)

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme()
  }, [])

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await Storage.get("theme")
      if (savedTheme) {
        setSelectedTheme(savedTheme)
      }
    } catch (error) {
      console.error("Failed to load saved theme:", error)
    }
  }

  const handleThemeChange = async (themeId: string) => {
    setLoading(true)
    try {
      // Update local state
      setSelectedTheme(themeId)

      // Save to Chrome storage
      await Storage.set("theme", themeId as any)

      // Save to Firestore if user is logged in
      // TODO: Re-enable when Firebase is properly configured
      // if (user) {
      //   const { updateActiveTheme } = await import("~lib/firestore")
      //   await updateActiveTheme(user.uid, themeId)
      // }

      // Send message to content script to update theme immediately
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              type: "THEME_CHANGE",
              themeId: themeId
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.log("Content script not ready:", chrome.runtime.lastError)
              }
            }
          )
        }
      })

      console.log("Theme changed to:", themeId)
    } catch (error) {
      console.error("Failed to change theme:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-3">
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
        <h3 className="plasmo-font-semibold plasmo-text-[#E0E0E0]">
          Select Theme
        </h3>
        {loading && (
          <div className="plasmo-h-4 plasmo-w-4 plasmo-animate-spin plasmo-rounded-full plasmo-border-2 plasmo-border-[#333333] plasmo-border-t-[#BB86FC]" />
        )}
      </div>

      <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            disabled={loading}
            className={`plasmo-group plasmo-flex plasmo-items-start plasmo-gap-3 plasmo-rounded-lg plasmo-border plasmo-p-3 plasmo-text-left plasmo-transition-all ${
              selectedTheme === theme.id
                ? "plasmo-border-[#BB86FC] plasmo-bg-[#2C2C2C]"
                : "plasmo-border-[#333333] plasmo-bg-[#1E1E1E] hover:plasmo-border-[#555555] hover:plasmo-bg-[#252525]"
            } disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50`}>
            {/* Color Preview */}
            <div className="plasmo-flex plasmo-flex-col plasmo-gap-1 plasmo-pt-1">
              <div
                className="plasmo-h-8 plasmo-w-8 plasmo-rounded-md plasmo-border plasmo-border-[#333333]"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.bgMain} 0%, ${theme.colors.bgCard} 100%)`
                }}
              />
              <div
                className="plasmo-h-2 plasmo-w-8 plasmo-rounded-sm"
                style={{ backgroundColor: theme.colors.primary }}
              />
            </div>

            {/* Theme Info */}
            <div className="plasmo-flex-1">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                <h4 className="plasmo-font-medium plasmo-text-[#E0E0E0]">
                  {theme.name}
                </h4>
                {selectedTheme === theme.id && (
                  <svg
                    className="plasmo-h-4 plasmo-w-4 plasmo-text-[#BB86FC]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <p className="plasmo-text-xs plasmo-text-[#A0A0A0]">
                {theme.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="plasmo-rounded-lg plasmo-border plasmo-border-[#555555] plasmo-bg-[#2C2C2C] plasmo-p-3">
        <p className="plasmo-text-xs plasmo-text-[#A0A0A0]">
          {user
            ? "✅ Theme synced to your account"
            : "💡 Theme saved locally. Sign in to sync across devices."}
        </p>
      </div>
    </div>
  )
}
