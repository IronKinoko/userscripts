export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export function s2d(string: string) {
  return new DOMParser().parseFromString(string, 'text/html').body.firstChild!
}

export async function waitDOM<T extends Element>(query: string) {
  return new Promise<T>((resolve, reject) => {
    const now = Date.now()
    function getDOM() {
      if (Date.now() - now > 5000) reject()
      const dom = document.querySelector<T>(query)
      if (dom) {
        resolve(dom)
      } else {
        requestAnimationFrame(getDOM)
      }
    }
    getDOM()
  })
}

export function addErrorListener(img: HTMLImageElement) {
  if (img.dataset.inject === 'true') return
  img.dataset.inject = 'true'
  img.onerror = () => {
    const url = new URL(img.src)
    let v = parseInt(url.searchParams.get('v')!) || 0
    if (v > 5) return (img.onerror = null)
    url.searchParams.set('v', ++v + '')
    img.src = url.toString()
    img.alt = '图片加载出错'
  }
}
