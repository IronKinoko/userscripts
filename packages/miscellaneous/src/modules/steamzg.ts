import jsQR from 'jsqr'
import { router } from 'shared'

router({
  domain: ['acgxj.com', 'xj.steamzg.com', 'acfb.top'],
  routes: [{ run: parseQRCode }],
})

function parseQRCode() {
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
