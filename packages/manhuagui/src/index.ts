import { waitDOM, isMobile, throttle } from 'shared'
import './index.scss'

// main
;(async () => {
  document.oncontextmenu = null
  createNextBtn()
  createFullScreen()

  if (isMobile()) {
    createNextBtnInH5()
  }
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

async function createNextBtnInH5() {
  const $pagination = await waitDOM('#pagination')
  $pagination.innerHTML = ''

  const btn = document.createElement('button')
  btn.className = 'big-h5-btn'
  btn.textContent = '下一章'
  btn.onclick = () => window.SMH.nextC()

  $pagination.replaceWith(btn)

  const fixedNextBtn = document.createElement('div')
  fixedNextBtn.className = 'next-part-btn-fixed'
  fixedNextBtn.textContent = '下一章'
  document.body.appendChild(fixedNextBtn)

  window.addEventListener(
    'scroll',
    throttle(() => {
      const dom = document.scrollingElement!
      if (
        dom.scrollTop < 50 ||
        dom.scrollTop + dom.clientHeight > dom.scrollHeight - 800
      ) {
        fixedNextBtn?.classList.remove('hide')
      } else {
        fixedNextBtn?.classList.add('hide')
      }
    }, 100)
  )
}
