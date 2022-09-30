import { keybind } from 'shared'

export default function main() {
  removeSelectEvent()
  if (document.body.id === 'readbg') {
    injectEvent()
  }
}

function removeSelectEvent() {
  // Your code here...
  const dom = document.createElement('style')
  dom.innerHTML = `
  * {
    user-select: initial !important;
  }
  `

  document.body.removeAttribute('onselectstart')

  document.body.append(dom)
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

  keybind(['w', 's', 'a', 'd'], (e, key) => {
    switch (key) {
      case 'w':
      case 's':
        const direction = key === 'w' ? -1 : 1
        if (e.repeat) return
        window.scrollBy({ behavior: 'smooth', top: direction * 200 })
        break
      case 'a':
      case 'd':
        window.location.pathname = key === 'a' ? pre : next
        break
    }
  })
}
