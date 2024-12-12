import { local, throttle } from 'shared'

const mouseEvent = {
  Down: 'mousedown',
  Move: 'mousemove',
  Up: 'mouseup',
}
const touchEvent = {
  Down: 'touchstart',
  Move: 'touchmove',
  Up: 'touchend',
}
const EventMap = 'ontouchstart' in window ? touchEvent : mouseEvent

// 适配 TouchEvent and MouseEvent
function getPoint(e: Event) {
  return 'ontouchstart' in window
    ? (e as TouchEvent).touches[0]
    : (e as MouseEvent)
}

export class Drag {
  constructor(private fxiedDom: HTMLDivElement) {
    this.addDragEvent()
  }

  // set fixedNextBtn position
  setPosition(
    position: { left: number; top: number },
    isMoving: boolean
  ): void {
    // safe position area
    const safeArea = {
      top: (y: number) =>
        Math.min(
          Math.max(y, 0),
          document.documentElement.clientHeight -
            this.fxiedDom!.getBoundingClientRect().height
        ),
      left: (x: number) =>
        Math.min(
          Math.max(x, 0),
          document.documentElement.clientWidth -
            this.fxiedDom!.getBoundingClientRect().width
        ),
    }
    const left = safeArea.left(position.left)
    const top = safeArea.top(position.top)

    this.fxiedDom!.classList.remove('left', 'right')
    this.fxiedDom!.style.transition = isMoving ? 'none' : ''
    this.fxiedDom!.style.top = `${top}px`
    this.fxiedDom!.style.left = `${left}px`

    if (!isMoving) {
      const screenWidth = document.documentElement.clientWidth
      const halfScreenWidth = screenWidth / 2
      const width = this.fxiedDom!.getBoundingClientRect().width
      const isRight = left + width / 2 > halfScreenWidth
      this.fxiedDom!.classList.add(isRight ? 'right' : 'left')
      this.fxiedDom!.style.left = isRight ? `${screenWidth - width}px` : '0px'
    }
  }

  private addDragEvent() {
    const key = 'speech-fixed-position'
    let position = local.getItem(key, {
      top: document.documentElement.clientHeight / 4,
      left: document.documentElement.clientWidth,
    })

    this.setPosition(position, false)

    this.fxiedDom.addEventListener(EventMap.Down, (e) => {
      const { clientX, clientY } = getPoint(e)
      const { top, left } = this.fxiedDom!.getBoundingClientRect()
      const diffX = clientX - left
      const diffY = clientY - top
      const move = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        const { clientX, clientY } = getPoint(e)
        const x = clientX - diffX
        const y = clientY - diffY
        position = { top: y, left: x }
        this.setPosition(position, true)
      }
      const end = (e: Event) => {
        local.setItem(key, position)
        this.setPosition(position, false)
        this.fxiedDom!.style.removeProperty('transition')
        window.removeEventListener(EventMap.Move, move)
        window.removeEventListener(EventMap.Up, end)
      }
      window.addEventListener(EventMap.Move, move, { passive: false })
      window.addEventListener(EventMap.Up, end)
    })

    let prevY = 0
    window.addEventListener(
      'scroll',
      throttle(() => {
        const dom = document.scrollingElement!

        const currentY = dom.scrollTop
        let diffY = currentY - prevY

        if (Math.abs(diffY) > 30) {
          this.fxiedDom?.classList.toggle('hide', diffY > 0)
          prevY = currentY
        }
      }, 16)
    )
  }
}
