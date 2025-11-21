// Firestore data model helpers

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from "firebase/firestore"

import { db } from "~lib/firebase"

// ============================================
// Interfaces
// ============================================

export interface User {
  uid: string
  email: string
  active_theme_id: string
  owned_themes: string[]
}

export interface Theme {
  id: string
  name: string
  css_vars: Record<string, string>
  is_premium: boolean
}

// ============================================
// User Functions
// ============================================

/**
 * Fetches user profile from Firestore
 * @param uid - The user's unique ID
 * @returns User profile or null if not found
 */
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as User
    }

    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

/**
 * Creates a new user profile in Firestore
 * @param user - The user data to create
 */
export async function createUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, "users", user.uid)
    await setDoc(userRef, user)
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

/**
 * Updates the user's active theme preference
 * @param uid - The user's unique ID
 * @param themeId - The theme ID to set as active
 */
export async function updateActiveTheme(
  uid: string,
  themeId: string
): Promise<void> {
  try {
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      active_theme_id: themeId
    })
  } catch (error) {
    console.error("Error updating active theme:", error)
    throw error
  }
}

/**
 * Adds a theme to the user's owned themes list
 * @param uid - The user's unique ID
 * @param themeId - The theme ID to add
 */
export async function addOwnedTheme(
  uid: string,
  themeId: string
): Promise<void> {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as User
      const ownedThemes = userData.owned_themes || []

      if (!ownedThemes.includes(themeId)) {
        await updateDoc(userRef, {
          owned_themes: [...ownedThemes, themeId]
        })
      }
    }
  } catch (error) {
    console.error("Error adding owned theme:", error)
    throw error
  }
}

// ============================================
// Theme Functions
// ============================================

/**
 * Fetches all available themes from Firestore
 * @returns Array of all themes
 */
export async function getAvailableThemes(): Promise<Theme[]> {
  try {
    const themesRef = collection(db, "themes")
    const themesSnap = await getDocs(themesRef)

    const themes: Theme[] = []
    themesSnap.forEach((doc) => {
      themes.push({
        id: doc.id,
        ...doc.data()
      } as Theme)
    })

    return themes
  } catch (error) {
    console.error("Error fetching available themes:", error)
    throw error
  }
}

/**
 * Fetches a specific theme by ID
 * @param themeId - The theme ID to fetch
 * @returns Theme or null if not found
 */
export async function getThemeById(themeId: string): Promise<Theme | null> {
  try {
    const themeRef = doc(db, "themes", themeId)
    const themeSnap = await getDoc(themeRef)

    if (themeSnap.exists()) {
      return {
        id: themeSnap.id,
        ...themeSnap.data()
      } as Theme
    }

    return null
  } catch (error) {
    console.error("Error fetching theme:", error)
    throw error
  }
}

/**
 * Gets themes owned by a specific user
 * @param ownedThemeIds - Array of theme IDs owned by the user
 * @returns Array of owned themes
 */
export async function getUserThemes(
  ownedThemeIds: string[]
): Promise<Theme[]> {
  try {
    if (ownedThemeIds.length === 0) {
      return []
    }

    const themes: Theme[] = []
    for (const themeId of ownedThemeIds) {
      const theme = await getThemeById(themeId)
      if (theme) {
        themes.push(theme)
      }
    }

    return themes
  } catch (error) {
    console.error("Error fetching user themes:", error)
    throw error
  }
}
