const SHIFT_KEY = '~!@#$%^&*()_+{}|:"<>?' + '～！@#¥%…&*（）——+「」｜：“《》？'

export function keybind(
  keys: string[],
  keydown: (e: KeyboardEvent, key: string) => void,
  keyup?: (e: KeyboardEvent, key: string) => void
) {
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
  keys = keys.filter((key) => !key.includes(isMac ? 'ctrl' : 'meta'))

  function createProcess(callback: Function) {
    return function (e: KeyboardEvent) {
      if (document.activeElement?.tagName === 'INPUT') return

      let keyArr = []

      e.ctrlKey && keyArr.push('ctrl')
      e.metaKey && keyArr.push('meta')
      e.shiftKey && !SHIFT_KEY.includes(e.key) && keyArr.push('shift')
      e.altKey && keyArr.push('alt')

      if (!['Control', 'Meta', 'Shift', 'Alt'].includes(e.key)) {
        keyArr.push(e.key)
      }

      keyArr = [...new Set(keyArr)]

      const key = keyArr.join('+')

      if (keys.includes(key)) {
        callback(e, key)
      }
    }
  }
  window.addEventListener('keydown', createProcess(keydown))
  if (keyup) window.addEventListener('keyup', createProcess(keyup))
}
