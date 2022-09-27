import { isMobile } from 'shared'

main()
async function main() {
  if (!isMobile()) return

  if (window.ReadTools) {
    resetPageEvent()
    injectMovePageEvent()
  }
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
      window.visualViewport.scale !== 1
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
