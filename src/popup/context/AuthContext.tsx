// Authentication context
// MVP Mode: Using localStorage (mock auth)
// Firebase integration ready for future migration - see FIREBASE_MIGRATION_PLAN.md

import React, { createContext, useContext, useEffect, useState } from "react"

// Firebase imports - kept for future migration
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut as firebaseSignOut,
//   type User
// } from "firebase/auth"
// import { auth } from "~lib/firebase"

// Mock User type for MVP
interface MockUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

interface AuthContextType {
  user: MockUser | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // MVP Mode: Check for stored user in chrome.storage
    const loadStoredUser = async () => {
      try {
        const result = await chrome.storage.local.get("mockUser")
        if (result.mockUser) {
          setUser(result.mockUser)
        }
      } catch (error) {
        console.error("Error loading stored user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStoredUser()

    // Firebase version (for future migration):
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   setUser(user)
    //   setLoading(false)
    // })
    // return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      // MVP Mode: Simulate Google Sign-In
      console.log("🎭 MVP Mode: Simulating Google Sign-In...")
      
      // Create mock user
      const mockUser: MockUser = {
        uid: `mock-${Date.now()}`,
        email: "user@example.com",
        displayName: "MVP User",
        photoURL: "https://via.placeholder.com/150"
      }

      // Store in chrome.storage
      await chrome.storage.local.set({ mockUser })
      setUser(mockUser)

      console.log("✅ Mock login successful!", mockUser)

      // Firebase version (for future migration):
      // const manifest = chrome.runtime.getManifest()
      // const clientId = manifest.oauth2?.client_id
      // if (!clientId) throw new Error("OAuth2 client_id not found")
      // 
      // const redirectURL = chrome.identity.getRedirectURL()
      // const authUrl = new URL("https://accounts.google.com/o/oauth2/auth")
      // authUrl.searchParams.set("client_id", clientId)
      // authUrl.searchParams.set("response_type", "id_token")
      // authUrl.searchParams.set("redirect_uri", redirectURL)
      // authUrl.searchParams.set("scope", "openid email profile")
      // authUrl.searchParams.set("nonce", Math.random().toString(36))
      //
      // const responseUrl = await chrome.identity.launchWebAuthFlow({
      //   url: authUrl.toString(),
      //   interactive: true
      // })
      //
      // const url = new URL(responseUrl)
      // const idToken = url.hash.match(/id_token=([^&]+)/)?.[1]
      // if (!idToken) throw new Error("No ID token found")
      //
      // const credential = GoogleAuthProvider.credential(idToken)
      // const { signInWithCredential } = await import("firebase/auth")
      // await signInWithCredential(auth, credential)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // MVP Mode: Clear stored user
      await chrome.storage.local.remove("mockUser")
      setUser(null)
      console.log("✅ Mock logout successful!")

      // Firebase version (for future migration):
      // await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
