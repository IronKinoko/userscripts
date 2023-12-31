import './index.scss'
import T from './ui.template.html'

export type SpeechOptions = {
  container: string
  lang: string
  getParagraph: () => HTMLElement[]
  scrollElement?: string
  nextChapter: () => void
}

export default class Speech {
  private elements: {
    play: HTMLInputElement
    voice: HTMLSelectElement
    rate: HTMLSelectElement
    continuous: HTMLInputElement
  } | null = null

  utterance = {
    rate: 1.5,
    voiceURI: null as string | null,
    continuous: true,
  }
  voices: SpeechSynthesisVoice[] = []

  constructor(private opts: SpeechOptions) {
    this.loadUtterance()
    this.washContent()
    this.createUI()
  }

  private washContent() {
    const paragraphList = this.opts.getParagraph()
    paragraphList.forEach((p, idx) => {
      p.setAttribute('data-speech-idx', idx.toString())

      p.addEventListener('click', () => {
        window.speechSynthesis.cancel()
        this.elements!.play.checked = true
        const scrollElement = this.opts.scrollElement
          ? document.querySelector(this.opts.scrollElement)
          : document.scrollingElement

        for (let index = idx; index < paragraphList.length; index++) {
          const p = this.getParagraph(index)
          if (p && p.textContent) {
            const utterance = this.speak(p.textContent)
            utterance.addEventListener('start', () => {
              p.classList.add('speech-reading')

              if (scrollElement) {
                const { y } = p.getBoundingClientRect()

                if (top) {
                  scrollElement.scrollBy({ top: y - 100, behavior: 'smooth' })
                }
              }
            })
            utterance.addEventListener('end', () => {
              p.classList.remove('speech-reading')
              if (
                this.utterance.continuous &&
                index === paragraphList.length - 1
              ) {
                this.opts.nextChapter()
              }
            })
            utterance.addEventListener('error', () => {
              p.classList.remove('speech-reading')
            })
          }
        }
      })
    })
  }

  private getParagraph(idx: number) {
    return document.querySelector<HTMLElement>(`[data-speech-idx="${idx}"]`)
  }

  private createUI() {
    const dom = new DOMParser().parseFromString(T.speech, 'text/html').body
      .children[0]
    const container = document.querySelector(this.opts.container)
    if (!container) throw new Error('container not found')
    container.appendChild(dom)

    window.addEventListener('beforeunload', () => {
      this.cancel()
    })

    this.elements = {
      play: dom.querySelector('.speech-controls-play input')!,
      voice: dom.querySelector('.speech-controls-voice')!,
      rate: dom.querySelector('.speech-controls-rate')!,
      continuous: dom.querySelector('.speech-controls-continuous input')!,
    }
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
        this.getParagraph(0)?.click()
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
  }

  private refreshSpeech() {
    const dom = document.querySelector('.speech-reading')
    if (!dom) return
    const idx = Number(dom.getAttribute('data-speech-idx'))
    const p = this.getParagraph(idx)
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

  speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = this.opts.lang
    utterance.rate = this.utterance.rate
    utterance.voice =
      this.voices.find((voice) => this.utterance.voiceURI === voice.voiceURI) ||
      null
    window.speechSynthesis.speak(utterance)
    return utterance
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
}
