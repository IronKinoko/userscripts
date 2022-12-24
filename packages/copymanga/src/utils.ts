import crypto from 'crypto-js'

export function addErrorListener(img: HTMLImageElement) {
  if (img.dataset.errorFix === 'true') return
  img.dataset.errorFix = 'true'
  img.onerror = () => {
    const url = new URL(img.src)
    let v = parseInt(url.searchParams.get('v')!) || 0
    if (v > 5) return (img.onerror = null)
    url.searchParams.set('v', ++v + '')
    img.src = url.toString()
    img.alt = '图片加载出错'
  }
}

export function getFullImages() {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')

    iframe.src = window.location.href.replace('/h5/', '/')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    function load() {
      const document = iframe.contentDocument!

      const imageData = document
        .querySelector('.imageData')!
        .getAttribute('contentkey')!

      const jojo = iframe.contentWindow!.jojo
      resolve(parseImageData(imageData, jojo))

      iframe.remove()
    }
    iframe.contentWindow!.addEventListener('DOMContentLoaded', load)
    iframe.contentWindow!.addEventListener('load', load)
  })
}

function parseImageData(imageData: string, jojo: string) {
  const key = imageData.slice(0, 0x10)
  const content = imageData.slice(0x10)

  const wordArray1 = crypto.enc.Utf8.parse(jojo)
  const wordArray2 = crypto.enc.Utf8.parse(key)

  let nextContent = crypto.enc.Base64.stringify(crypto.enc.Hex.parse(content))

  const raw = crypto.AES.decrypt(nextContent, wordArray1, {
    iv: wordArray2,
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7,
  }).toString(crypto.enc.Utf8)

  return JSON.parse(raw)
}
