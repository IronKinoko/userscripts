import { waitDOM } from 'shared'
import './index.scss'

// main
;(async () => {
  document.oncontextmenu = null
  createNextBtn()
  createFullScreen()
})()

async function createNextBtn() {
  const dom = await waitDOM<HTMLDivElement>('.backToTop')
  const a = document.createElement('a')
  a.innerHTML = 'NEXT'
  a.className = 'k-custom-btn'
  a.id = 'show-next'
  a.href = 'javascript:;'
  a.onclick = window.SMH.nextC
  dom.append(a)
}

async function createFullScreen() {
  const dom = await waitDOM<HTMLDivElement>('.backToTop')
  const a = document.createElement('a')
  a.innerHTML = 'FULL'
  a.className = 'k-custom-btn'
  a.id = 'full-btn'
  a.href = 'javascript:;'
  a.onclick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
      a.innerHTML = 'FULL'
    } else {
      document.documentElement.requestFullscreen()
      a.innerHTML = 'EXIT'
    }
  }
  dom.append(a)

  document.addEventListener('keypress', (e) => {
    if (
      document.activeElement &&
      /textarea|input|select/i.test(document.activeElement.tagName)
    ) {
      return
    }
    if (e.key === 'f') {
      a.click()
    }
  })
}
