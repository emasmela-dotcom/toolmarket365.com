export interface LocalStorageFavorite {
  template_id: string
  created_at: string
}

const LOCALSTORAGE_KEY = 'template_favorites'

export function getLocalStorageFavorites(): string[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading localStorage favorites:', error)
    return []
  }
}

export function addLocalStorageFavorite(templateId: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const favorites = getLocalStorageFavorites()
    if (favorites.includes(templateId)) return false
    
    favorites.push(templateId)
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(favorites))
    return true
  } catch (error) {
    console.error('Error adding localStorage favorite:', error)
    return false
  }
}

export function removeLocalStorageFavorite(templateId: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const favorites = getLocalStorageFavorites()
    const index = favorites.indexOf(templateId)
    if (index === -1) return false
    
    favorites.splice(index, 1)
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(favorites))
    return true
  } catch (error) {
    console.error('Error removing localStorage favorite:', error)
    return false
  }
}

export function isLocalStorageFavorite(templateId: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const favorites = getLocalStorageFavorites()
    return favorites.includes(templateId)
  } catch (error) {
    console.error('Error checking localStorage favorite:', error)
    return false
  }
}

export function clearLocalStorageFavorites(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(LOCALSTORAGE_KEY)
  } catch (error) {
    console.error('Error clearing localStorage favorites:', error)
  }
}
