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
    disabled: HTMLInputElement
  } | null = null

  private utterance = {
    rate: 1.5,
    voiceURI: null as string | null,
    continuous: true,
    disabled: false,
  }
  private voices: SpeechSynthesisVoice[] = []
  private paragraphDisposeList: (() => void)[] = []

  private speakDispose: (() => void) | null = null
  private drag!: Drag

  constructor(public opts: SpeechOptions) {
    this.loadUtterance()
    this.setupParagraph()
    this.createUI()
  }

  get paragraphList() {
    return this.opts.getParagraph()
  }

  setupParagraph() {
    if (this.paragraphDisposeList.length) {
      this.paragraphDisposeList.forEach((fn) => fn())
      this.paragraphDisposeList = []
    }

    this.paragraphDisposeList = this.paragraphList.map((p, idx) => {
      p.setAttribute('data-speech-idx', idx.toString())

      const fn = () => {
        if (this.utterance.disabled) return

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
      }

      p.addEventListener('click', fn)

      return () => {
        p.removeAttribute('data-speech-idx')
        p.removeEventListener('click', fn)
      }
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
      disabled: root.querySelector('.speech-controls-disabled input')!,
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

      if (
        this.utterance.continuous &&
        this.currentSpeakingParagraphIdx === null
      ) {
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

    this.elements.disabled.checked = this.utterance.disabled
    this.elements.disabled.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      this.utterance.disabled = target.checked
      window.speechSynthesis.cancel()
      this.saveUtterance()
    })

    this.updateMenuUI()

    keybind(['space'], (e) => {
      e.preventDefault()
      this.elements!.play.click()
    })
  }

  private updateMenuUI() {
    this.elements!.root.querySelectorAll('.speech-controls-button').forEach(
      (dom) => {
        if (dom.classList.contains('speech-controls-menu')) return
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

        utterance.addEventListener('start', (e) => {
          console.log('start', e)
          p.classList.add('speech-reading')

          if (scrollElement) {
            const { y } = p.getBoundingClientRect()

            if (top) {
              scrollElement.scrollBy({ top: y - 100, behavior: 'smooth' })
            }
          }
        })
        utterance.addEventListener('end', (e) => {
          console.log('end', e)
          p.classList.remove('speech-reading')

          if (
            this.utterance.continuous &&
            index === this.paragraphList.length - 1
          ) {
            this.opts.nextChapter()
          }
          resolve()
        })
        utterance.addEventListener('error', (e) => {
          console.error('error', e)
          p.classList.remove('speech-reading')
          console.error(e)
          reject(e)
        })

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
