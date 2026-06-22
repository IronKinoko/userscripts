import jsQR from 'jsqr'
import { router } from 'shared'

router({
  domain: ['gamers520.com'],
  routes: [{ run: parseQRCode }],
})

function parseQRCode() {
  const imgList = document.querySelectorAll<HTMLImageElement>(
    '.bdp-qrcode-box img'
  )
  imgList.forEach((img) => {
    const sourceUrl = new URL(img.src)
    const url = sourceUrl.searchParams.get('data')
    if (!url) return

    const node = img.parentElement?.nextSibling as HTMLElement

    const btn = document.createElement('div')
    node.insertAdjacentElement('afterend', btn)
    btn.outerHTML = `<div style="margin: auto 0; width: 100%; display: flex; flex-direction: column; align-items: center;">
    <a href="${url}" target="_blank" class="bdp-btn">⚡ 点击下载</a></div>`

    node.remove()
    img.parentElement?.remove()
  })
}
