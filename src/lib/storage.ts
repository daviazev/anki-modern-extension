// Chrome Storage wrapper for type-safe storage operations
// MVP Mode: Using chrome.storage.sync for persistence
// Future: Will migrate to Firestore for cloud sync - see FIREBASE_MIGRATION_PLAN.md

export interface StorageData {
  theme: "light" | "dark" | "auto"
  customColors?: Record<string, string>
  enabledFeatures?: string[]
  userId?: string
  // MVP: Mock user stored locally
  mockUser?: {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
  }
}

export class Storage {
  /**
   * Get data from Chrome storage
   * MVP: Uses chrome.storage.sync (limited to 100KB, syncs across devices)
   * Future: Will use Firestore for unlimited storage and advanced queries
   */
  static async get<K extends keyof StorageData>(
    key: K
  ): Promise<StorageData[K] | undefined> {
    const result = await chrome.storage.sync.get(key)
    return result[key]
    
    // Future Firestore implementation:
    // if (auth.currentUser) {
    //   const docRef = doc(db, "users", auth.currentUser.uid)
    //   const docSnap = await getDoc(docRef)
    //   return docSnap.data()?.[key]
    // }
  }

  /**
   * Get multiple keys from Chrome storage
   */
  static async getAll(
    keys: (keyof StorageData)[]
  ): Promise<Partial<StorageData>> {
    const result = await chrome.storage.sync.get(keys)
    return result as Partial<StorageData>
  }

  /**
   * Set data in Chrome storage
   * MVP: Uses chrome.storage.sync
   * Future: Will use Firestore with offline persistence
   */
  static async set<K extends keyof StorageData>(
    key: K,
    value: StorageData[K]
  ): Promise<void> {
    await chrome.storage.sync.set({ [key]: value })
    
    // Future Firestore implementation:
    // if (auth.currentUser) {
    //   const docRef = doc(db, "users", auth.currentUser.uid)
    //   await setDoc(docRef, { [key]: value }, { merge: true })
    // }
  }

  /**
   * Set multiple values in Chrome storage
   */
  static async setMultiple(data: Partial<StorageData>): Promise<void> {
    await chrome.storage.sync.set(data)
  }

  /**
   * Remove data from Chrome storage
   */
  static async remove(key: keyof StorageData): Promise<void> {
    await chrome.storage.sync.remove(key)
  }

  /**
   * Clear all data from Chrome storage
   */
  static async clear(): Promise<void> {
    await chrome.storage.sync.clear()
  }

  /**
   * Listen to storage changes
   */
  static addListener(
    callback: (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => void
  ): void {
    chrome.storage.onChanged.addListener(callback)
  }

  /**
   * Remove storage listener
   */
  static removeListener(
    callback: (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => void
  ): void {
    chrome.storage.onChanged.removeListener(callback)
  }
}
