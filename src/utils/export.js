import { saveToStorage, loadFromStorage } from './storage'

const HISTORY_KEY = 'history'
const CUSTOM_LISTS_KEY = 'customLists'
const SETTINGS_KEY = 'settings'

export function exportAllData() {
  return {
    version: 1,
    exportTime: new Date().toISOString(),
    history: loadFromStorage(HISTORY_KEY, []),
    customLists: loadFromStorage(CUSTOM_LISTS_KEY, {}),
    settings: loadFromStorage(SETTINGS_KEY, {})
  }
}

export function downloadJSON(data, filename = 'pickpick-backup.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importJSON(data, mode = 'merge') {
  if (!data || !data.version) return { success: false, error: '无效的备份文件' }

  if (mode === 'overwrite') {
    if (data.history) saveToStorage(HISTORY_KEY, data.history)
    if (data.customLists) saveToStorage(CUSTOM_LISTS_KEY, data.customLists)
    if (data.settings) saveToStorage(SETTINGS_KEY, data.settings)
    return { success: true, mode: 'overwrite' }
  }

  // merge mode
  if (data.history) {
    const existing = loadFromStorage(HISTORY_KEY, [])
    saveToStorage(HISTORY_KEY, [...existing, ...data.history])
  }
  if (data.customLists) {
    const existing = loadFromStorage(CUSTOM_LISTS_KEY, {})
    saveToStorage(CUSTOM_LISTS_KEY, { ...existing, ...data.customLists })
  }
  if (data.settings) {
    const existing = loadFromStorage(SETTINGS_KEY, {})
    saveToStorage(SETTINGS_KEY, { ...existing, ...data.settings })
  }
  return { success: true, mode: 'merge' }
}

export function parseTxtFile(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .slice(0, 500)
}
