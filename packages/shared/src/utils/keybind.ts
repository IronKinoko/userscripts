export function normalizeKeyEvent(e: KeyboardEvent) {
  const SPECIAL_KEY_EN = '`-=[]\\;\',./~!@#$%^&*()_+{}|:"<>?'.split('')
  const SPECIAL_KEY_ZH =
    '·-=【】、；‘，。/～！@#¥%…&*（）—+「」｜：“《》？'.split('')

  let key = e.key

  if (e.code === 'Space') {
    key = 'Space'
  }

  // trans a-z to A-Z
  if (/^[a-z]$/.test(key)) {
    key = key.toUpperCase()
  } else if (SPECIAL_KEY_ZH.includes(key)) {
    key = SPECIAL_KEY_EN[SPECIAL_KEY_ZH.indexOf(key)]
  }

  let keyArr = []

  e.ctrlKey && keyArr.push('ctrl')
  e.metaKey && keyArr.push('meta')
  e.shiftKey && !SPECIAL_KEY_EN.includes(key) && keyArr.push('shift')
  e.altKey && keyArr.push('alt')

  if (!/Control|Meta|Shift|Alt/i.test(key)) keyArr.push(key)

  keyArr = [...new Set(keyArr)]

  return keyArr.join('+')
}

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

      const normalizedKey = normalizeKeyEvent(e).toLowerCase()

      for (const key of keys) {
        if (key.toLowerCase() === normalizedKey) callback(e, key)
      }
    }
  }
  window.addEventListener('keydown', createProcess(keydown))
  if (keyup) window.addEventListener('keyup', createProcess(keyup))
}
