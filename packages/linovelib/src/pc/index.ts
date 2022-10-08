import { keybind } from 'shared'

export default function main() {
  removeSelectEvent()
  if (document.body.id === 'readbg') {
    injectEvent()
  }
}

function removeSelectEvent() {
  const dom = document.createElement('style')
  dom.innerHTML = `* { user-select: initial !important; }`
  document.body.append(dom)

  document.body.removeAttribute('onselectstart')
}

function injectEvent() {
  const scripts = Array.from(document.scripts)
  const script = scripts.find((script) =>
    script.innerHTML.includes('prevpage="')
  )

  if (!script) return

  const res = script.innerHTML.match(
    /prevpage="(?<pre>.*?)";.*nextpage="(?<next>.*?)";/
  )

  if (!res?.groups) return

  const { pre, next } = res.groups

  keybind(
    ['w', 's', 'a', 'd'],
    (e, key) => {
      switch (key) {
        case 'w':
        case 's':
          const direction = key === 'w' ? -1 : 1
          if (e.repeat) scroll.start(direction * 15)
          else window.scrollBy({ behavior: 'smooth', top: direction * 200 })
          break
        case 'a':
        case 'd':
          window.location.pathname = key === 'a' ? pre : next
          break
      }
    },
    (e, key) => {
      switch (key) {
        case 'w':
        case 's':
          scroll.stop()
          break
      }
    }
  )
}

const scroll = (() => {
  let handle: number | undefined

  function stop() {
    if (!handle) return
    cancelAnimationFrame(handle)
    handle = undefined
  }

  function start(step: number) {
    if (handle) return

    function animate() {
      handle = requestAnimationFrame(animate)

      window.scrollBy({ top: step })
    }

    handle = requestAnimationFrame(animate)
  }
  return { start, stop }
})()
