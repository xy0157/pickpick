import { describe, it, expect, beforeEach } from 'vitest'
import { saveToStorage, loadFromStorage, removeFromStorage, clearAllStorage } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads data', () => {
    const data = { name: 'test', items: [1, 2, 3] }
    expect(saveToStorage('test', data)).toBe(true)
    expect(loadFromStorage('test')).toEqual(data)
  })

  it('returns default value when key not found', () => {
    expect(loadFromStorage('nonexistent', [])).toEqual([])
    expect(loadFromStorage('nonexistent')).toBeNull()
  })

  it('removes data', () => {
    saveToStorage('test', 'value')
    removeFromStorage('test')
    expect(loadFromStorage('test')).toBeNull()
  })

  it('clears all pickpick data', () => {
    saveToStorage('a', 1)
    saveToStorage('b', 2)
    clearAllStorage()
    expect(loadFromStorage('a')).toBeNull()
    expect(loadFromStorage('b')).toBeNull()
  })

  it('handles complex nested objects', () => {
    const complex = {
      records: Array.from({ length: 10 }, (_, i) => ({
        id: i,
        mode: 'food',
        options: ['a', 'b', 'c'],
        result: 'a',
        time: new Date().toISOString()
      }))
    }
    saveToStorage('complex', complex)
    expect(loadFromStorage('complex')).toEqual(complex)
  })
})
