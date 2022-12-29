import crypto from 'crypto-js'
import { gm } from 'shared'

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

function h5URLToPC(href: string) {
  const url = new URL(href)
  const re = /\/h5\/comicContent\/(?<name>.*?)\/(?<episode>.*)/
  const match = url.pathname.match(re)
  if (match) {
    const { name, episode } = match.groups!
    url.pathname = `/comic/${name}/chapter/${episode}`
    return url.toString()
  }
  return null
}

export async function getFullImages() {
  const { responseText } = await gm.request({
    url: h5URLToPC(window.location.href)!,
    method: 'GET',
    responseType: 'text',
  })
  const $root = $(responseText)
  const imageData = $root.filter('.imageData').attr('contentkey')!
  const jojo = responseText.match(/var jojo = '(.*?)'/)[1]
  const data = parseImageData(imageData, jojo)
  return data
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

  return JSON.parse(raw) as { url: string }[]
}
