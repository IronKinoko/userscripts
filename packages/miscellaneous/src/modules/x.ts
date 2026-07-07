import { router, sleep } from 'shared'

router({
  domain: ['x.com'],
  routes: [{ run: main }],
})

function main() {
  const run = () => {
    injectDownloadIcon()

    requestAnimationFrame(run)
  }
  requestAnimationFrame(run)
}

function injectDownloadIcon() {
  const downloadIconHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M11.99 16l-5.7-5.7L7.7 8.88l3.29 3.3V2.59h2v9.59l3.3-3.3 1.41 1.42-5.71 5.7zM21 
  15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 
  .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
  </svg>`

  const tweets = Array.from(
    document.querySelectorAll<HTMLDivElement>('article[data-testid="tweet"]')
  )

  tweets.forEach(async (tweet) => {
    const injected = tweet.getAttribute('data-x-injected')
    if (injected) return

    tweet.setAttribute('data-x-injected', 'true')

    const actionsEl = tweet.querySelector<HTMLDivElement>(
      'div > div > div[role="group"]'
    )

    if (!actionsEl) return

    const originEl = actionsEl.children[
      actionsEl.children.length - 1
    ] as HTMLDivElement

    const downloadEl = originEl.cloneNode(true) as HTMLDivElement
    originEl.insertAdjacentElement('afterend', downloadEl)

    const oldSvg = downloadEl.querySelector('svg')
    if (!oldSvg) return

    const svgCls = oldSvg.getAttribute('class')
    const template = document.createElement('template')
    template.innerHTML = downloadIconHTML.trim()

    const newSvg = template.content.firstElementChild as SVGElement | null
    if (!newSvg) return

    newSvg.setAttribute('class', svgCls || '')
    oldSvg.replaceWith(newSvg)

    const btn = downloadEl.querySelector('button')
    if (!btn) return

    btn.addEventListener('click', async () => {
      const hisUrls = btn.getAttribute('data-x-urls')
      if (hisUrls) {
        const urls = JSON.parse(hisUrls) as { filename: string; url: string }[]
        urls.forEach((url, idx) => downloadFile(url.url, url.filename))
        return
      }

      const fetching = btn.getAttribute('data-x-fetching')
      if (fetching) return

      btn.setAttribute('data-x-fetching', 'true')
      const videoEl = tweet.querySelector<HTMLVideoElement>('video')
      if (!videoEl) return

      const anchorEl = tweet.querySelector<HTMLAnchorElement>(
        'a[role="link"][href*="/status/"]'
      )
      if (!anchorEl) return

      const statusUrl = anchorEl.href

      const parts = statusUrl.split('/')
      const statusIdx = parts.findIndex((part) => part === 'status')
      const user = parts[statusIdx - 1]
      const tweetId = parts[statusIdx + 1]

      const tipEl = document.createElement('div')
      tipEl.textContent = '下载中...'
      tipEl.style.cssText = `
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          padding: 4px 8px;
          border-radius: 8px;
          white-space: nowrap;
          z-index: 9999;
        `
      downloadEl.appendChild(tipEl)
      try {
        const urls = await downloadGif(statusUrl)
        const files = urls.map((url, idx) => ({
          url,
          filename: `x-${user}-${tweetId}${idx > 0 ? `-${idx}` : ''}.gif`,
        }))
        files.forEach((file) => downloadFile(file.url, file.filename))
        btn.setAttribute('data-x-urls', JSON.stringify(files))
      } finally {
        tipEl.remove()
        btn.removeAttribute('data-x-fetching')
      }
    })
  })
}

function downloadFile(url: string, filename: string) {
  const fallbackOpen = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  GM_xmlhttpRequest({
    url: url,
    method: 'GET',
    responseType: 'blob',
    onload: (response) => {
      const blob = response.response
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = encodeURIComponent(filename)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    },
    onerror: () => {
      fallbackOpen()
    },
  })
}

const cache: Record<string, string[]> = {}
async function downloadGif(url: string) {
  if (cache[url]) {
    return cache[url]
  }

  const client = async (params: any) => {
    const formData = new FormData()

    Object.keys(params).forEach((key) => {
      formData.append(key, params[key])
    })

    return new Promise<any>((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://convertico.com/twitter-gif-downloader/twitter-gif-downloader.php',
        responseType: 'json',
        data: formData,
        onload: (response) => {
          resolve(response.response)
        },
        onerror: (error) => {
          reject(error)
        },
      })
    })
  }

  const meta = await client({ action: 'fetch', url })

  const files = await Promise.all(
    meta.media.map(async (item: any, idx: number) => {
      const res = await client({
        action: 'convert_to_gif',
        video_url: item.url,
        filename: `x-gif-${Date.now()}-${idx}`,
        fps: 20,
        width: 480,
        lossy: 80,
      })

      return 'https://convertico.com/twitter-gif-downloader/' + res.file_url
    })
  )

  cache[url] = files
  return files
}
