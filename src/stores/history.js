import { defineStore } from 'pinia'
import { saveToStorage, loadFromStorage } from '../utils/storage'

const HISTORY_KEY = 'history'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    records: loadFromStorage(HISTORY_KEY, [])
  }),
  actions: {
    addRecord(mode, options, result) {
      this.records.unshift({
        id: Date.now(),
        mode,
        options: [...options],
        result: typeof result === 'object' ? [...result] : result,
        time: new Date().toISOString(),
        note: ''
      })
      this._persist()
    },
    clearAll() {
      this.records = []
      this._persist()
    },
    deleteRecord(id) {
      this.records = this.records.filter(r => r.id !== id)
      this._persist()
    },
    _persist() {
      saveToStorage(HISTORY_KEY, this.records)
    }
  }
})
