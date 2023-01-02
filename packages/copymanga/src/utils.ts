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
  const re = /\/h5\/comicContent\/(?<comicId>.*?)\/(?<chapterId>.*)/
  const match = url.pathname.match(re)
  if (match) {
    const { comicId, chapterId } = match.groups!
    return `https://userscripts-proxy.vercel.app/api/copymanga/comic/${comicId}/chapter/${chapterId}`
  }
  return null
}

export async function getFullImages() {
  const url = h5URLToPC(window.location.href)

  if (!url) throw new Error('请在移动端运行')

  try {
    const data = await fetch(url).then((r) => r.json())
    if (!data.ok) throw new Error(data.message)
    return data.manga as { url: string }[]
  } catch (error: any) {
    console.error(error)
    alert(`接口调用失败 ${error.message}`)
    return []
  }
}
