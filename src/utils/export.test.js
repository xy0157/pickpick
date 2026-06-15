import { describe, it, expect, beforeEach, vi } from 'vitest'
import { importJSON, parseTxtFile } from './export'
import * as storage from './storage'

vi.mock('./storage')

describe('export utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('importJSON validates version field', () => {
    const result = importJSON({})
    expect(result.success).toBe(false)
    expect(result.error).toBe('无效的备份文件')
  })

  it('importJSON merge mode appends history', () => {
    storage.loadFromStorage.mockReturnValue([{ id: 1 }])
    importJSON({ version: 1, history: [{ id: 2 }] }, 'merge')
    // Verify saveToStorage was called with merged array
    const calls = storage.saveToStorage.mock.calls
    const historyCall = calls.find(c => c[0] === 'history')
    expect(historyCall).toBeDefined()
    expect(historyCall[1]).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('importJSON overwrite mode replaces data', () => {
    importJSON({ version: 1, history: [{ id: 1 }] }, 'overwrite')
    const calls = storage.saveToStorage.mock.calls
    const historyCall = calls.find(c => c[0] === 'history')
    expect(historyCall).toBeDefined()
    expect(historyCall[1]).toEqual([{ id: 1 }])
  })

  it('parseTxtFile splits by lines and trims', () => {
    const result = parseTxtFile(' 苹果 \n香蕉\n\n 橙子 ')
    expect(result).toEqual(['苹果', '香蕉', '橙子'])
  })

  it('parseTxtFile limits to 500 lines', () => {
    const lines = Array.from({ length: 600 }, (_, i) => `选项${i}`)
    const result = parseTxtFile(lines.join('\n'))
    expect(result).toHaveLength(500)
  })
})
