// Main Popup UI entry point

import React from "react"

import "~assets/style.css"

import { ThemeToggle } from "~popup/components/ThemeToggle"
import { AuthProvider, useAuth } from "~popup/context/AuthContext"

function IndexPopup() {
  const { user, loading, signInWithGoogle, logout } = useAuth()

  const handleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Failed to sign in:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  if (loading) {
    return (
      <div className="plasmo-flex plasmo-min-h-[500px] plasmo-w-[380px] plasmo-items-center plasmo-justify-center plasmo-bg-[#121212]">
        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3">
          <div className="plasmo-h-8 plasmo-w-8 plasmo-animate-spin plasmo-rounded-full plasmo-border-4 plasmo-border-[#333333] plasmo-border-t-[#BB86FC]" />
          <p className="plasmo-text-sm plasmo-text-[#A0A0A0]">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="plasmo-flex plasmo-min-h-[500px] plasmo-w-[380px] plasmo-flex-col plasmo-bg-[#121212] plasmo-text-[#E0E0E0]">
      {/* Header */}
      <header className="plasmo-border-b plasmo-border-[#333333] plasmo-bg-[#181818] plasmo-p-6">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
          <div className="plasmo-flex plasmo-h-10 plasmo-w-10 plasmo-items-center plasmo-justify-center plasmo-rounded-lg plasmo-bg-gradient-to-br plasmo-from-[#BB86FC] plasmo-to-[#9965E8]">
            <span className="plasmo-text-xl plasmo-font-bold plasmo-text-black">
              A
            </span>
          </div>
          <div>
            <h1 className="plasmo-text-xl plasmo-font-bold plasmo-text-[#E0E0E0]">
              AnkiModern
            </h1>
            <p className="plasmo-text-xs plasmo-text-[#A0A0A0]">
              Modern theme for AnkiWeb
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="plasmo-flex plasmo-flex-1 plasmo-flex-col plasmo-p-6">
        {!user ? (
          /* Login Screen */
          <div className="plasmo-flex plasmo-flex-1 plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-gap-6">
            <div className="plasmo-text-center">
              <h2 className="plasmo-mb-2 plasmo-text-lg plasmo-font-semibold plasmo-text-[#E0E0E0]">
                Welcome to AnkiModern
              </h2>
              <p className="plasmo-text-sm plasmo-text-[#A0A0A0]">
                Sign in to sync your theme preferences
              </p>
            </div>

            <button
              onClick={handleSignIn}
              className="plasmo-flex plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-gap-3 plasmo-rounded-lg plasmo-bg-[#BB86FC] plasmo-px-6 plasmo-py-3 plasmo-font-semibold plasmo-text-black plasmo-transition-all hover:plasmo-opacity-90 hover:plasmo-shadow-lg active:plasmo-scale-95">
              <svg
                className="plasmo-h-5 plasmo-w-5"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>

            <p className="plasmo-text-center plasmo-text-xs plasmo-text-[#A0A0A0]">
              Your data is stored securely in Firebase
            </p>
          </div>
        ) : (
          /* Logged In Screen */
          <div className="plasmo-flex plasmo-flex-1 plasmo-flex-col plasmo-gap-6">
            {/* User Info */}
            <div className="plasmo-rounded-lg plasmo-border plasmo-border-[#333333] plasmo-bg-[#1E1E1E] plasmo-p-4">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="plasmo-h-12 plasmo-w-12 plasmo-rounded-full plasmo-border-2 plasmo-border-[#BB86FC]"
                  />
                ) : (
                  <div className="plasmo-flex plasmo-h-12 plasmo-w-12 plasmo-items-center plasmo-justify-center plasmo-rounded-full plasmo-bg-[#BB86FC] plasmo-text-lg plasmo-font-bold plasmo-text-black">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
                <div className="plasmo-flex-1 plasmo-overflow-hidden">
                  <p className="plasmo-truncate plasmo-font-medium plasmo-text-[#E0E0E0]">
                    {user.displayName || "User"}
                  </p>
                  <p className="plasmo-truncate plasmo-text-sm plasmo-text-[#A0A0A0]">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div className="plasmo-flex-1 plasmo-space-y-4">
              <div className="plasmo-rounded-lg plasmo-border plasmo-border-[#333333] plasmo-bg-[#1E1E1E] plasmo-p-4">
                <h3 className="plasmo-mb-3 plasmo-text-sm plasmo-font-semibold plasmo-text-[#E0E0E0]">
                  AnkiWeb Theme
                </h3>
                <ThemeToggle />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="plasmo-w-full plasmo-rounded-lg plasmo-border plasmo-border-[#333333] plasmo-bg-[#1E1E1E] plasmo-px-4 plasmo-py-3 plasmo-font-medium plasmo-text-[#A0A0A0] plasmo-transition-all hover:plasmo-border-[#BB86FC] hover:plasmo-bg-[#2C2C2C] hover:plasmo-text-[#E0E0E0]">
              Logout
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="plasmo-border-t plasmo-border-[#333333] plasmo-bg-[#181818] plasmo-p-4 plasmo-text-center">
        <p className="plasmo-text-xs plasmo-text-[#A0A0A0]">
          v0.0.1 • Made with ❤️ for AnkiWeb users
        </p>
      </footer>
    </div>
  )
}

function PopupWithProvider() {
  return (
    <AuthProvider>
      <IndexPopup />
    </AuthProvider>
  )
}

export default PopupWithProvider
