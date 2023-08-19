export default function setup() {
  customElements.define(
    'img-lazy',
    class ImgLazy extends HTMLElement {
      img: HTMLImageElement
      ob: IntersectionObserver
      timeout = 12000
      timeoutId?: number

      constructor() {
        super()

        this.timeout = this.getAttribute('timeout')
          ? parseInt(this.getAttribute('timeout')!)
          : this.timeout

        const shadow = this.attachShadow({ mode: 'open' })

        this.img = document.createElement('img')
        this.img.classList.add('loading')

        this.img.onload = () => {
          this.img.classList.remove('loading')
          clearTimeout(this.timeoutId)
        }

        this.img.onerror = () => {
          this.refreshImg()
        }

        this.ob = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (!e.isIntersecting) return
              const src = this.getAttribute('src')
              if (!src) return
              this.img.src = src
              this.timeoutId = window.setTimeout(() => {
                this.refreshImg()
              }, this.timeout)

              this.ob.unobserve(this)
            })
          },
          { rootMargin: '2000px 0px', threshold: [0, 1] }
        )

        const style = document.createElement('style')
        style.innerHTML = `
        img { 
          display: block; 
          width: 100%; 
        }
        .loading { min-height: 500px }
      `
        shadow.appendChild(style)
        shadow.appendChild(this.img)
      }

      connectedCallback() {
        this.ob.observe(this)
      }

      disconnectedCallback() {
        this.ob.disconnect()
      }

      static get observedAttributes() {
        return ['src']
      }

      attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
        if (attrName === 'src') {
          this.ob.unobserve(this)
          this.ob.observe(this)
        }
      }

      refreshImg() {
        const url = new URL(this.img.src)
        let v = parseInt(url.searchParams.get('v')!) || 0
        v++
        url.searchParams.set('v', v + '')
        this.img.src = ''
        this.img.src = url.toString()
        this.img.alt = `图片加载出错 [${v}]`
        this.timeoutId = window.setTimeout(() => {
          this.refreshImg()
          this.timeout = Math.max(this.timeout * 2, 60000)
        }, this.timeout)
      }
    }
  )
}
