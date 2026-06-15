import { ref, computed } from 'vue'

export function useRandomPick(options) {
  const allOptions = ref(options || [])
  const currentResult = ref(null)
  const history = ref([])

  const optionCount = computed(() => allOptions.value.length)

  function setOptions(newOptions) {
    allOptions.value = [...newOptions]
  }

  function pick(count = 1, allowRepeat = false) {
    if (allOptions.value.length === 0) return []
    if (count > allOptions.value.length && !allowRepeat) count = allOptions.value.length

    const results = []
    const pool = [...allOptions.value]

    for (let i = 0; i < count; i++) {
      if (pool.length === 0) break
      const idx = Math.floor(Math.random() * pool.length)
      results.push(pool[idx])
      if (!allowRepeat) pool.splice(idx, 1)
    }

    currentResult.value = count === 1 ? results[0] : results
    history.value.push({
      timestamp: Date.now(),
      options: [...allOptions.value],
      result: count === 1 ? results[0] : [...results]
    })

    return results
  }

  function reset() {
    currentResult.value = null
  }

  return {
    allOptions,
    currentResult,
    optionCount,
    history,
    setOptions,
    pick,
    reset
  }
}
