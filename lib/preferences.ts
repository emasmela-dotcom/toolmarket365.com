/**
 * User Preferences Utility
 * Manages user preferences with localStorage fallback
 */

const PREFERENCES_KEY = 'toolmarket365_preferences'

export interface UserPreferences {
  saveToLibraryEnabled: boolean
  [key: string]: any
}

const DEFAULT_PREFERENCES: UserPreferences = {
  saveToLibraryEnabled: true // Default to enabled
}

/**
 * Get user preferences (with localStorage fallback)
 */
export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY)
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Error loading preferences:', error)
  }
  return DEFAULT_PREFERENCES
}

/**
 * Save user preferences
 */
export function savePreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving preferences:', error)
  }
}

/**
 * Check if "Save to Library" feature is enabled
 */
export function isSaveToLibraryEnabled(): boolean {
  const prefs = getPreferences()
  return prefs.saveToLibraryEnabled ?? true
}

/**
 * Toggle "Save to Library" feature
 */
export function toggleSaveToLibrary(enabled: boolean): void {
  savePreferences({ saveToLibraryEnabled: enabled })
}
