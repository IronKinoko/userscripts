export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export function s2d(string) {
  return new DOMParser().parseFromString(string, 'text/html').body.firstChild
}

export async function waitDOM(query) {
  return new Promise((resolve, reject) => {
    const now = Date.now()
    function getDOM() {
      if (Date.now() - now > 5000) reject()
      const dom = document.querySelector(query)
      if (dom) {
        resolve(dom)
      } else {
        requestAnimationFrame(getDOM)
      }
    }
    getDOM()
  })
}

export function addErrorListener(img) {
  if (img.dataset.inject === 'true') return
  img.dataset.inject = 'true'
  img.onerror = () => {
    const url = new URL(img.src)
    let v = parseInt(url.searchParams.get('v')) || 0
    if (v > 5) return (img.onerror = null)
    url.searchParams.set('v', ++v)
    img.src = url.toString()
    img.alt = '图片加载出错'
  }
}