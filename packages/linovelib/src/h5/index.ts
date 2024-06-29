import { isMobile, keybind, router, waitDOM } from 'shared'

export default async function main() {
  if (!window.ReadTools) return
  resetPageEvent()

  if (isMobile()) injectMovePageEvent()
  else injectShortcuts()
}

export async function fixADBlock() {
  const res = await fetch(window.location.href)
  const text = await res.text()
  const html = new DOMParser().parseFromString(text, 'text/html')
  const volumes = html.querySelector('#volumes')
  if (!volumes) return

  document.querySelector('#volumes')?.replaceWith(volumes)

  try {
    document.getElementById(
      'bookmarkX'
      // @ts-ignore
    )!.innerHTML = `<div class="chapter-bar">阅读进度</div><span class="historyChapter"><a href="/novel/${targetRecord.articleid}/${targetRecord.chapterid}_${targetRecord.page}.html" class="chapter-li-a "><span class="chapter-index blue">${targetRecord.chaptername}</span></a></span>`
  } catch (error) {}
}

function resetPageEvent() {
  const $body = document.body
  $body.onclick = (e) => {
    const toolsId = ['#toptools', '#bottomtools', '#readset']
    if (
      toolsId.some((id) =>
        document.querySelector(id)?.contains(e.target as Node)
      )
    ) {
      return
    }
    window.ReadPages.PageClick()
  }
}

function injectMovePageEvent() {
  let left: number,
    startX: number,
    startY: number,
    diffX: number,
    startTime: number,
    isMoved: boolean,
    direction: 'x' | 'y' | ''
  const $page = document.getElementById('apage')!

  const isDisabled = (e: TouchEvent) => {
    return (
      window.ReadTools.pagemid != 1 ||
      e.touches.length > 1 ||
      (window.visualViewport && window.visualViewport.scale !== 1) ||
      (window.getSelection() && window.getSelection()!.toString().length > 0)
    )
  }

  window.addEventListener('touchstart', (e) => {
    if (isDisabled(e)) return

    left = parseFloat($page.style.left.replace('px', '')) || 0
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startTime = Date.now()
    isMoved = false
    direction = ''
  })
  window.addEventListener(
    'touchmove',
    (e) => {
      if (isDisabled(e)) return

      isMoved = true
      diffX = e.touches[0].clientX - startX
      let diffY = e.touches[0].clientY - startY

      if (direction === '') {
        direction = Math.abs(diffX) > Math.abs(diffY) ? 'x' : 'y'
      }
      if (direction === 'x') {
        e.preventDefault()

        $page.style.left = left + diffX + 'px'
        $page.style.transition = 'initail'
      }
    },
    { passive: false }
  )
  window.addEventListener('touchend', (e) => {
    if (isDisabled(e)) return

    if (!isMoved || direction === 'y') return

    const diffTime = Date.now() - startTime

    const threshold =
      diffTime < 300 ? 10 : document.documentElement.clientWidth * 0.3

    $page.style.transition = ''
    if (Math.abs(diffX) > threshold) {
      const type = diffX > 0 ? 'previous' : 'next'
      window.ReadPages.ShowPage(type)

      if (
        window.ReadPages.currentPage > window.ReadPages.totalPages ||
        window.ReadPages.currentPage < 1
      ) {
        window.ReadPages.ShowPage()
      }
    } else {
      window.ReadPages.ShowPage()
    }
  })
}

function injectShortcuts() {
  keybind(['a', 's', 'w', 'd', 'space', 'shift+space'], (e, key) => {
    if (window.ReadTools.pagemid != 1) return

    switch (key) {
      case 'shift+space':
      case 'a':
      case 'w':
        window.ReadPages.ShowPage('previous')

        break

      case 'space':
      case 'd':
      case 's':
        window.ReadPages.ShowPage('next')

        break

      default:
        break
    }
  })
}
