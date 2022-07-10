function createStorage(storage: Storage) {
  function getItem<T = any>(key: string): T | undefined
  function getItem<T = any>(key: string, defaultValue: T): T
  function getItem<T = any>(key: string, defaultValue?: T): T | undefined {
    try {
      const value = storage.getItem(key)
      if (value) return JSON.parse(value)
      return defaultValue
    } catch (error) {
      return defaultValue
    }
  }

  return {
    getItem,
    setItem(key: string, value: any) {
      storage.setItem(key, JSON.stringify(value))
    },
    removeItem: storage.removeItem.bind(storage),
    clear: storage.clear.bind(storage),
  }
}

export const session = createStorage(window.sessionStorage)
export const local = createStorage(window.localStorage)
