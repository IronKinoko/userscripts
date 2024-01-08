import { keybind, local, throttle } from 'shared'
import './index.scss'
import T from './ui.template.html'
import { Drag } from './Drag'

export type SpeechOptions = {
  container: string
  lang: string
  getParagraph: () => HTMLElement[]
  scrollElement?: string
  nextChapter: () => void
}

export default class Speech {
  private elements: {
    root: HTMLDivElement
    play: HTMLInputElement
    voice: HTMLSelectElement
    rate: HTMLSelectElement
    continuous: HTMLInputElement
    menu: HTMLInputElement
  } | null = null

  private utterance = {
    rate: 1.5,
    voiceURI: null as string | null,
    continuous: true,
    menu: true,
  }
  private voices: SpeechSynthesisVoice[] = []
  private paragraphList = [] as HTMLElement[]

  private speakDispose: (() => void) | null = null
  drag!: Drag

  constructor(private opts: SpeechOptions) {
    this.loadUtterance()
    this.washContent()
    this.createUI()
  }

  private washContent() {
    this.paragraphList = this.opts.getParagraph()
    this.paragraphList.forEach((p, idx) => {
      p.setAttribute('data-speech-idx', idx.toString())

      p.addEventListener('click', () => {
        let current = idx
        let cancel = false
        this.speakDispose?.()

        const speak = async () => {
          if (cancel) return
          await this.speakParagraph(current)

          if (current < this.paragraphList.length) {
            current++
            speak()
          }
        }
        this.speakDispose = () => {
          cancel = true
        }
        speak()
      })
    })
  }

  private createUI() {
    const root = new DOMParser().parseFromString(T.speech, 'text/html').body
      .children[0] as HTMLDivElement
    const container = document.querySelector(this.opts.container)
    if (!container) throw new Error('container not found')
    container.appendChild(root)

    window.addEventListener('beforeunload', () => {
      this.cancel()
    })

    this.elements = {
      root,
      play: root.querySelector('.speech-controls-play input')!,
      voice: root.querySelector('.speech-controls-voice')!,
      rate: root.querySelector('.speech-controls-rate')!,
      continuous: root.querySelector('.speech-controls-continuous input')!,
      menu: root.querySelector('.speech-controls-menu input')!,
    }
    this.drag = new Drag(root)

    this.elements.play.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      if (target.checked) {
        window.speechSynthesis.resume()
      } else {
        window.speechSynthesis.pause()
      }
    })

    this.onVoices((voices) => {
      if (voices.length === 0) return

      this.voices = voices.filter((voice) => voice.lang === this.opts.lang)
      this.elements!.voice.innerHTML = this.voices
        .map((v) => `<option value="${v.voiceURI}">${v.name}</option>`)
        .join('')

      if (this.utterance.voiceURI) {
        this.elements!.voice.value = this.utterance.voiceURI
        this.refreshSpeech()
      }

      if (this.utterance.continuous) {
        this.paragraphList[0]?.click()
      }
    })

    this.elements.voice.value = this.utterance.voiceURI || ''
    this.elements.voice.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement
      const find = this.voices.find((voice) => voice.voiceURI === target.value)
      if (find) {
        this.utterance.voiceURI = find.voiceURI
        this.saveUtterance()
        this.refreshSpeech()
      }
    })

    this.elements.rate.value = this.utterance.rate.toString()
    this.elements.rate.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement
      this.utterance.rate = Number(target.value)
      this.saveUtterance()
      this.refreshSpeech()
    })

    this.elements.continuous.checked = this.utterance.continuous
    this.elements.continuous.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      this.utterance.continuous = target.checked
      this.saveUtterance()
    })

    this.elements.menu.checked = this.utterance.menu
    this.elements.menu.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      this.utterance.menu = target.checked
      this.updateMenuUI()
      this.saveUtterance()
    })

    this.updateMenuUI()

    keybind(['space'], (e) => {
      e.preventDefault()
      this.elements!.play.click()
    })
  }
  // set fixedNextBtn position
  private setPosition(
    fxiedDom: HTMLDivElement,
    position: { left: number; top: number },
    isMoving: boolean
  ): void {
    fxiedDom!.classList.remove('left', 'right')
    fxiedDom!.style.transition = isMoving ? 'none' : ''
    fxiedDom!.style.top = `${position.top}px`
    fxiedDom!.style.left = `${position.left}px`

    if (!isMoving) {
      const halfScreenWidth = document.documentElement.clientWidth / 2
      fxiedDom!.classList.add(
        position.left > halfScreenWidth ? 'right' : 'left'
      )
      fxiedDom!.style.left =
        position.left > halfScreenWidth
          ? `${
              document.documentElement.clientWidth -
              fxiedDom!.getBoundingClientRect().width
            }px`
          : '0px'
    }
  }

  private addDragEvent(fxiedDom: HTMLDivElement) {
    let prevY = 0
    let storeY = 0
    const key = 'speech-fixed-position'
    let position = local.getItem(key, {
      top: document.documentElement.clientHeight / 4,
      left: document.documentElement.clientWidth,
    })

    // safe position area
    const safeArea = {
      top: (y: number) =>
        Math.min(
          Math.max(y, 0),
          document.documentElement.clientHeight -
            fxiedDom!.getBoundingClientRect().height
        ),
      left: (x: number) =>
        Math.min(
          Math.max(x, 0),
          document.documentElement.clientWidth -
            fxiedDom!.getBoundingClientRect().width
        ),
    }

    this.setPosition(fxiedDom, position, false)

    fxiedDom.addEventListener('touchstart', (e) => {
      const touch = e.touches[0]
      const { clientX, clientY } = touch
      const { top, left } = fxiedDom!.getBoundingClientRect()
      const diffX = clientX - left
      const diffY = clientY - top
      const move = (e: TouchEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const touch = e.touches[0]
        const { clientX, clientY } = touch
        const x = safeArea.left(clientX - diffX)
        const y = safeArea.top(clientY - diffY)
        position = { top: y, left: x }
        this.setPosition(fxiedDom, position, true)
      }
      const end = () => {
        local.setItem(key, position)
        this.setPosition(fxiedDom, position, false)
        fxiedDom!.style.removeProperty('transition')
        window.removeEventListener('touchmove', move)
        window.removeEventListener('touchend', end)
      }
      window.addEventListener('touchmove', move, { passive: false })
      window.addEventListener('touchend', end)
    })

    window.addEventListener(
      'scroll',
      throttle(() => {
        const dom = document.scrollingElement!

        const currentY = dom.scrollTop
        let diffY = currentY - storeY
        if (
          currentY < 50 ||
          currentY + dom.clientHeight > dom.scrollHeight - 800 ||
          diffY < -30
        ) {
          fxiedDom?.classList.remove('hide')
        } else {
          fxiedDom?.classList.add('hide')
        }

        if (currentY > prevY) {
          storeY = currentY
        }
        prevY = currentY
      }, 100)
    )
  }

  private updateMenuUI() {
    this.elements!.root.querySelectorAll('.speech-controls-button').forEach(
      (dom) => {
        if (dom.classList.contains('speech-controls-menu')) return

        if (this.utterance.menu) {
          dom.classList.remove('speech-controls-hide')
        } else {
          dom.classList.add('speech-controls-hide')
        }
      }
    )
    this.drag.setPosition(
      {
        left: Number(this.elements!.root.style.left.replace('px', '')),
        top: Number(this.elements!.root.style.top.replace('px', '')),
      },
      false
    )
  }

  private refreshSpeech() {
    const idx = this.currentSpeakingParagraphIdx
    if (idx === null) return
    const p = this.paragraphList[idx]
    p?.click()
  }

  private saveUtterance() {
    localStorage.setItem('speech-utterance', JSON.stringify(this.utterance))
  }
  private loadUtterance() {
    const utterance = localStorage.getItem('speech-utterance')
    if (utterance) {
      this.utterance = JSON.parse(utterance)
    }
  }

  private onVoices(callback: (voices: SpeechSynthesisVoice[]) => void) {
    callback(window.speechSynthesis.getVoices())
    window.speechSynthesis.onvoiceschanged = () => {
      callback(window.speechSynthesis.getVoices())
    }
  }

  private speakParagraph(index: number) {
    return new Promise<void>((resolve, reject) => {
      window.speechSynthesis.cancel()
      this.elements!.play.checked = true
      const scrollElement = this.opts.scrollElement
        ? document.querySelector(this.opts.scrollElement)
        : document.scrollingElement

      document.querySelectorAll('.speech-reading').forEach((p) => {
        p.classList.remove('speech-reading')
      })

      const p = this.paragraphList[index]
      if (p && p.textContent) {
        const utterance = new SpeechSynthesisUtterance(p.textContent)
        utterance.lang = this.opts.lang
        utterance.rate = this.utterance.rate
        utterance.voice =
          this.voices.find(
            (voice) => this.utterance.voiceURI === voice.voiceURI
          ) || null

        utterance.onstart = (e) => {
          console.log('start', e)
          p.classList.add('speech-reading')

          if (scrollElement) {
            const { y } = p.getBoundingClientRect()

            if (top) {
              scrollElement.scrollBy({ top: y - 100, behavior: 'smooth' })
            }
          }
        }
        utterance.onend = (e) => {
          console.log('end', e)
          p.classList.remove('speech-reading')

          if (
            this.utterance.continuous &&
            index === this.paragraphList.length - 1
          ) {
            this.opts.nextChapter()
          }
          resolve()
        }
        utterance.onerror = (e) => {
          console.error('error', e)
          p.classList.remove('speech-reading')
          console.error(e)
          reject(e)
        }

        console.log('utterance', utterance)
        window.speechSynthesis.speak(utterance)
      } else {
        resolve()
      }
    })
  }

  resume() {
    window.speechSynthesis.resume()
  }

  pause() {
    window.speechSynthesis.pause()
  }

  cancel() {
    window.speechSynthesis.cancel()
  }
  get speaking() {
    return window.speechSynthesis.speaking
  }
  get pending() {
    return window.speechSynthesis.pending
  }
  get currentSpeakingParagraphIdx() {
    const dom = document.querySelector('.speech-reading')
    if (!dom) return null
    return Number(dom.getAttribute('data-speech-idx'))
  }
}
