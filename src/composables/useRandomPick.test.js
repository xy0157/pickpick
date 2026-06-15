import { describe, it, expect } from 'vitest'
import { useRandomPick } from './useRandomPick'

describe('useRandomPick', () => {
  const testOptions = ['饺子', '面条', '米饭', '披萨', '沙拉']

  it('initializes with provided options', () => {
    const picker = useRandomPick(testOptions)
    expect(picker.optionCount.value).toBe(5)
    expect(picker.allOptions.value).toEqual(testOptions)
  })

  it('picks a single item', () => {
    const picker = useRandomPick(testOptions)
    const result = picker.pick()
    expect(result).toHaveLength(1)
    expect(testOptions).toContain(result[0])
  })

  it('picks multiple items without repeat', () => {
    const picker = useRandomPick(testOptions)
    const result = picker.pick(3, false)
    expect(result).toHaveLength(3)
    const unique = new Set(result)
    expect(unique.size).toBe(3)
  })

  it('picks multiple items with repeat allowed', () => {
    const picker = useRandomPick(['only'])
    const result = picker.pick(3, true)
    expect(result).toHaveLength(3)
    expect(result.every(r => r === 'only')).toBe(true)
  })

  it('returns empty array when no options', () => {
    const picker = useRandomPick([])
    expect(picker.pick()).toEqual([])
  })

  it('updates currentResult after pick', () => {
    const picker = useRandomPick(testOptions)
    picker.pick()
    expect(picker.currentResult.value).not.toBeNull()
  })

  it('resets state', () => {
    const picker = useRandomPick(testOptions)
    picker.pick()
    expect(picker.currentResult.value).not.toBeNull()
    picker.reset()
    expect(picker.currentResult.value).toBeNull()
  })

  it('setOptions replaces options', () => {
    const picker = useRandomPick(testOptions)
    picker.setOptions(['新选项'])
    expect(picker.optionCount.value).toBe(1)
    expect(picker.allOptions.value).toEqual(['新选项'])
  })
})
