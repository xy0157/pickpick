const STORAGE_PREFIX = 'pickpick_'

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('Storage save failed:', e)
    return false
  }
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : defaultValue
  } catch (e) {
    console.error('Storage load failed:', e)
    return defaultValue
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key)
  } catch (e) {
    console.error('Storage remove failed:', e)
  }
}

export function clearAllStorage() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k))
  } catch (e) {
    console.error('Storage clear failed:', e)
  }
}
