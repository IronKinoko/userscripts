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
