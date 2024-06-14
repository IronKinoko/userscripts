import { gm, memoize } from 'shared'

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

type ChapterInfo = {
  ok: boolean
  message?: string
  manga: { url: string }[]
  next?: {
    comicId: string
    chapterId: string
  }
}

const getChapterInfoFromURL = memoize(async (url: string) => {
  const res = await gm.request<ChapterInfo>({ url })
  return res.response
})

export async function getChapterInfo() {
  const url = h5URLToPC(window.location.href)

  if (!url) throw new Error('请在移动端运行')

  try {
    const data = await getChapterInfoFromURL(url)
    if (!data.ok) throw new Error(data.message)

    if (data.next) {
      const { comicId, chapterId } = data.next
      const url = `https://userscripts-proxy.vercel.app/api/copymanga/comic/${comicId}/chapter/${chapterId}`
      // prefetch
      getChapterInfoFromURL(url)
    }

    return data
  } catch (error: any) {
    console.error(error)
    alert(`接口调用失败 ${error.message}`)
    return { ok: false, manga: [] } as ChapterInfo
  }
}
