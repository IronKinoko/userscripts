import jsQR from 'jsqr'
import { router } from 'shared'

router({
  domain: ['gamers520.com'],
  routes: [{ run: parseQRCode }],
})

function parseQRCode() {
  const imgList = document.querySelectorAll<HTMLImageElement>('.wpkqcg_qrcode')
  imgList.forEach((img) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)
    const imageData = ctx.getImageData(0, 0, img.width, img.height)

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
    img.parentElement?.appendChild(div)
  })
}
