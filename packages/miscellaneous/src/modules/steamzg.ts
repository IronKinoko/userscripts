import jsQR from 'jsqr'
import { router } from 'shared'

router({
  domain: ['acgxj.com', 'xj.steamzg.com', 'acfb.top'],
  routes: [{ run: parseQRCode }],
})

function parseQRCode() {
  parseQRCodeV1()
  parseQRCodeV2()
}

function parseQRCodeV1() {
  const canvasList = document.querySelectorAll<HTMLCanvasElement>(
    'canvas.su-qr-canvas'
  )
  canvasList.forEach((canvas) => {
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const res = jsQR(imageData.data, imageData.width, imageData.height)

    if (!res) return

    if (res.data.includes('pan.baidu.com')) {
      const matched = document.body.innerText.match(/提取码[:：]?\s*(\w{4})/)
      if (matched) {
        const url = new URL(res.data)
        url.searchParams.set('pwd', matched[1])
        res.data = url.toString()
      }
    }

    const link = document.createElement('a')
    link.href = res.data
    link.target = '_blank'
    link.textContent = res.data
    const div = document.createElement('div')
    div.append(link)
    canvas.parentElement?.appendChild(div)
  })
}

function parseQRCodeV2() {
  const items = document.querySelectorAll<HTMLElement>('.su-download-item')

  items.forEach((item) => {
    const $info = item.querySelector<HTMLDivElement>('.su-download-info')
    const $text = item.querySelector<HTMLDivElement>('.su-download-text')
    const $btn = item.querySelector<HTMLButtonElement>('.su-download-btn')
    if (!$btn || !$text || !$info) return
    const urlBase64 = $btn.getAttribute('data-qr-url')
    if (!urlBase64) return
    const url = atob(urlBase64)

    const $wrap = document.createElement('div')
    $info.append($wrap)
    $wrap.append($text)

    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    a.textContent = url
    a.style.display = 'block'
    a.style.color = '#999999'
    a.style.lineHeight = '1.2'
    a.style.fontSize = '12px'
    $wrap.append(a)

    $btn.addEventListener(
      'click',
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(url, '_blank')
      },
      { capture: true }
    )
  })
}
