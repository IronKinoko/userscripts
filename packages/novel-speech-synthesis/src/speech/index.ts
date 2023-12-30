import './index.scss'
import T from './ui.template.html'

export type SpeechOptions = {
  container: string
  lang: string
  /** 目标是给每个段落增加 */
  getParagraph: () => HTMLElement[]
  scrollElement?: string
}

export default class Speech {
  private elements: {
    play: HTMLInputElement
    voice: HTMLSelectElement
    rate: HTMLSelectElement
  } | null = null

  utterance = {
    rate: 1.5,
    voiceURI: null as string | null,
  }
  voices: SpeechSynthesisVoice[] = []

  constructor(private opts: SpeechOptions) {
    this.loadUtterance()
    this.createUI()
    this.washContent()
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
    return document.querySelector(`[data-speech-idx="${idx}"]`)
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
      this.voices = voices.filter((voice) => voice.lang === this.opts.lang)
      this.elements!.voice.innerHTML = this.voices
        .map((v) => `<option value="${v.voiceURI}">${v.name}</option>`)
        .join('')

      this.elements!.voice.value = this.utterance.voiceURI || ''
    })

    this.elements.voice.value = this.utterance.voiceURI || ''
    this.elements.voice.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement
      const find = this.voices.find((voice) => voice.voiceURI === target.value)
      if (find) {
        this.utterance.voiceURI = find.voiceURI
        this.saveUtterance()
      }
    })

    this.elements.rate.value = this.utterance.rate.toString()
    this.elements.rate.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement
      this.utterance.rate = Number(target.value)
      this.saveUtterance()
    })
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
