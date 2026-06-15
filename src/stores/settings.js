import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage } from '../utils/storage'

const SETTINGS_KEY = 'settings'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    animationSpeed: 'normal',
    confirmBeforePick: false
  }),
  actions: {
    updateSetting(key, value) {
      this[key] = value
      saveToStorage(SETTINGS_KEY, this.$state)
    },
    loadSettings() {
      const saved = loadFromStorage(SETTINGS_KEY)
      if (saved) {
        Object.assign(this, saved)
      }
    }
  }
})
