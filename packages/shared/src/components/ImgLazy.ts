export default function setup() {
  customElements.define(
    'img-lazy',
    class ImgLazy extends HTMLElement {
      img: HTMLImageElement
      ob: IntersectionObserver
      constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        this.img = document.createElement('img')
        this.img.classList.add('loading')
        this.img.onload = () => {
          this.img.classList.remove('loading')
        }
        this.img.onerror = () => {
          const url = new URL(this.img.src)
          let v = parseInt(url.searchParams.get('v')!) || 0
          v++
          url.searchParams.set('v', v + '')
          this.img.src = url.toString()
          this.img.alt = `图片加载出错 [${v}]`
        }

        this.ob = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) return
            const src = this.getAttribute('src')
            if (!src) return
            this.img.src = src
            this.ob.unobserve(this)
          },
          { rootMargin: '2000px 0px' }
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
    }
  )
}
