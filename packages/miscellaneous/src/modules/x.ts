import { router, sleep } from 'shared'

router({
  domain: ['x.com'],
  routes: [{ run: main }],
})

function main() {
  const run = () => {
    injectDownloadIcon()
    patchMediaTab()

    requestAnimationFrame(run)
  }
  requestAnimationFrame(run)
}

// 方案：改写媒体 tab 的 href 追加 ?filter=photo，
// 再用捕获阶段监听器（先于应用自身的处理器）拦截真实点击：
// preventDefault + stopPropagation，随后派发一个合成 click 事件。
// 合成事件照常冒泡到应用的路由处理器，若处理器从 DOM 读取 href，
// 就会导航到带 filter 的 URL —— 全程 SPA 内部切换，无刷新。
function patchMediaTab() {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href]')
  )
  const mediaTab = links.find((a) =>
    /\/.*?\/media/.test(a.getAttribute('href') || '')
  )
  if (!mediaTab || mediaTab.hasAttribute('data-x-patched')) return

  const url = new URL(mediaTab.href)
  url.searchParams.set('filter', 'photo')
  mediaTab.setAttribute('data-x-patched', 'true')
  mediaTab.setAttribute('href', url.toString())

  mediaTab.addEventListener(
    'click',
    (e) => {
      e.preventDefault()
      e.stopPropagation()

      let target: string
      const currentUrl = new URL(window.location.href)
      if (currentUrl.searchParams.get('filter') === 'photo') {
        currentUrl.searchParams.delete('filter')
        target = currentUrl.toString()
      } else {
        target = url.toString()
      }
      const state = history.state

      history.pushState(state, '', target)
      window.dispatchEvent(new PopStateEvent('popstate', { state }))
    },
    true
  )
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
        try {
          const urls = JSON.parse(hisUrls) as {
            filename: string
            url: string
          }[]
          if (
            !Array.isArray(urls) ||
            urls.some(
              (url) =>
                typeof url?.url !== 'string' ||
                typeof url?.filename !== 'string'
            )
          ) {
            throw new Error('缓存的下载信息无效')
          }
          await downloadFilesWithTip(btn, urls)
        } catch (error) {
          console.error('Failed to parse cached X download URLs', error)
          window.alert('下载失败：缓存的下载信息无效')
        }
        return
      }

      const fetching = btn.getAttribute('data-x-fetching')
      if (fetching) return

      btn.setAttribute('data-x-fetching', 'true')
      const tip = createDownloadTip(btn)
      let failed = false

      try {
        const videoEl = tweet.querySelector<HTMLVideoElement>('video')
        if (!videoEl) throw new Error('未找到视频')

        const anchorEl = tweet.querySelector<HTMLAnchorElement>(
          'a[role="link"][href*="/status/"]'
        )
        if (!anchorEl) throw new Error('未找到推文链接')

        const statusUrl = anchorEl.href
        const parts = statusUrl.split('/')
        const statusIdx = parts.findIndex((part) => part === 'status')
        const user = parts[statusIdx - 1]
        const tweetId = parts[statusIdx + 1]
        if (statusIdx < 1 || !user || !tweetId) {
          throw new Error('推文链接格式无效')
        }

        tip.setStep('获取信息')
        const meta = await fetchGifMeta(statusUrl)
        tip.setStep('处理中')
        const result = await processMediaFiles(
          meta.media,
          meta.tweet_id,
          (idx) => `x-${user}-${tweetId}${idx > 0 ? `-${idx}` : ''}.gif`,
          tip
        )
        if (result.files.length === meta.media.length) {
          btn.setAttribute('data-x-urls', JSON.stringify(result.files))
        }
        if (result.failed) {
          failed = true
          tip.retain()
        }
      } catch (error) {
        failed = true
        console.error('Failed to download GIF from X', error)
        const message = error instanceof Error ? error.message : '未知错误'
        tip.showError(message)
      } finally {
        btn.removeAttribute('data-x-fetching')
        if (!failed) tip.remove()
      }
    })
  })
}

function createDownloadTip(target: HTMLElement) {
  const tipEl = document.createElement('div')
  tipEl.style.cssText = `
    position: fixed;
    transform: translate(-50%, -100%);
    background: rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 4px 8px;
    border-radius: 8px;
    white-space: pre-line;
    text-align: left;
    z-index: 99999;
    pointer-events: none;
  `
  document.body.appendChild(tipEl)

  const startedAt = Date.now()
  let currentStep = '获取信息'
  const events: { index: number; step: string }[] = []
  let failed = false
  let removed = false
  let removeTimer = 0

  const render = () => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    const time = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(
      elapsed % 60
    ).padStart(2, '0')}`
    tipEl.textContent = [
      `${time} | ${currentStep}`,
      ...events.map((event) => event.step),
    ].join('\n')
  }

  const updatePosition = () => {
    const rect = target.getBoundingClientRect()
    const halfWidth = tipEl.offsetWidth / 2
    const padding = 8
    const minLeft = padding + halfWidth
    const maxLeft = window.innerWidth - padding - halfWidth
    const left =
      minLeft > maxLeft
        ? window.innerWidth / 2
        : Math.min(Math.max(rect.left + rect.width / 2, minLeft), maxLeft)
    const placeAbove = rect.top >= tipEl.offsetHeight + padding
    const top = placeAbove
      ? rect.top - padding
      : Math.min(rect.bottom + padding, window.innerHeight - tipEl.offsetHeight)

    tipEl.style.left = `${left}px`
    tipEl.style.top = `${Math.max(padding, top)}px`
    tipEl.style.transform = placeAbove
      ? 'translate(-50%, -100%)'
      : 'translate(-50%, 0)'
  }

  const remove = () => {
    if (removed) return
    removed = true
    window.clearInterval(updateTimer)
    window.clearTimeout(removeTimer)
    window.removeEventListener('scroll', updatePosition, true)
    window.removeEventListener('resize', updatePosition)
    tipEl.remove()
  }

  const updateTimer = window.setInterval(() => {
    if (!failed) render()
    updatePosition()
  }, 1000)
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  render()
  updatePosition()

  return {
    setStep(nextStep: string) {
      currentStep = nextStep
      render()
      updatePosition()
    },
    updateFile(index: number, step: string) {
      const existingEvent = events.find((event) => event.index === index)
      const message = `#${index + 1} ${step}`
      if (existingEvent) {
        existingEvent.step = message
      } else {
        events.push({ index, step: message })
      }
      render()
      updatePosition()
    },
    showError(message: string) {
      failed = true
      tipEl.style.background = 'rgba(180, 0, 0, 0.85)'
      currentStep = `获取信息失败：${message}`
      render()
      updatePosition()
      removeTimer = window.setTimeout(remove, 5000)
    },
    retain() {
      failed = true
      tipEl.style.background = 'rgba(180, 0, 0, 0.85)'
      updatePosition()
      removeTimer = window.setTimeout(remove, 5000)
    },
    remove,
  }
}

async function downloadFilesWithTip(
  btn: HTMLButtonElement,
  files: { url: string; filename: string }[]
) {
  if (btn.hasAttribute('data-x-fetching')) return

  btn.setAttribute('data-x-fetching', 'true')
  const tip = createDownloadTip(btn)
  let failed = false

  try {
    tip.setStep('处理中')
    failed = await downloadFiles(files, tip)
    if (failed) tip.retain()
  } catch (error) {
    failed = true
    console.error('Failed to download cached X GIF URLs', error)
    const message = error instanceof Error ? error.message : '未知错误'
    tip.showError(message)
  } finally {
    btn.removeAttribute('data-x-fetching')
    if (!failed) tip.remove()
  }
}

async function downloadFiles(
  files: { url: string; filename: string }[],
  tip: ReturnType<typeof createDownloadTip>
) {
  let failed = false
  await Promise.all(
    files.map(async (file, index) => {
      tip.updateFile(index, '下载中')
      try {
        const downloaded = await downloadFile(
          file.url,
          file.filename,
          (loaded, total) => {
            const progress =
              total && total > 0
                ? `${Math.floor((loaded / total) * 100)}%`
                : `${formatBytes(loaded)}`
            tip.updateFile(index, `下载中 ${progress}`)
          }
        )
        tip.updateFile(
          index,
          downloaded ? '完成' : '下载失败，已尝试新窗口打开'
        )
      } catch (error) {
        failed = true
        const message = error instanceof Error ? error.message : '未知错误'
        console.error(`Failed to download GIF #${index + 1}`, error)
        tip.updateFile(index, `下载失败：${message}`)
      }
    })
  )

  return failed
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function downloadFile(
  url: string,
  filename: string,
  onProgress: (loaded: number, total?: number) => void
) {
  const fallbackOpen = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return new Promise<boolean>((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: 'GET',
      responseType: 'blob',
      onprogress: (response) => {
        onProgress(
          response.loaded,
          response.lengthComputable ? response.total : undefined
        )
      },
      onload: (response) => {
        if (response.status < 200 || response.status >= 300) {
          fallbackOpen()
          resolve(false)
          return
        }

        try {
          const blob = response.response
          const blobUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = encodeURIComponent(filename)
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(blobUrl)
          resolve(true)
        } catch (error) {
          reject(error)
        }
      },
      onerror: () => {
        fallbackOpen()
        resolve(false)
      },
      ontimeout: () => {
        fallbackOpen()
        resolve(false)
      },
      onabort: () => {
        fallbackOpen()
        resolve(false)
      },
    })
  })
}

async function fetchGifMeta(url: string) {
  const meta = await converticoRequest({ action: 'fetch', url })
  if (!Array.isArray(meta.media) || meta.media.length === 0) {
    throw new Error('推文中没有可转换的视频')
  }
  if (!meta.tweet_id) {
    throw new Error('转换服务未返回推文 ID')
  }
  return meta as { media: { url: string }[]; tweet_id: string }
}

async function processMediaFiles(
  media: { url: string }[],
  tweetId: string,
  getFilename: (index: number) => string,
  tip: ReturnType<typeof createDownloadTip>
) {
  let failed = false
  const files: ({ url: string; filename: string } | undefined)[] = new Array(
    media.length
  )

  await Promise.all(
    media.map(async (item, index) => {
      tip.updateFile(index, '转换gif')
      try {
        if (typeof item?.url !== 'string' || !item.url) {
          throw new Error('视频地址无效')
        }

        const response = await converticoRequest({
          action: 'convert_gif',
          video_url: item.url,
          tweet_id: tweetId,
          filename: `x-gif-${Date.now()}-${index}`,
          fps: 20,
          width: 480,
        })
        if (typeof response.file_url !== 'string' || !response.file_url) {
          throw new Error('GIF 转换失败')
        }

        const file = {
          url: new URL(
            response.file_url,
            'https://convertico.com/twitter-video-downloader/'
          ).toString(),
          filename: getFilename(index),
        }
        files[index] = file
        tip.updateFile(index, '下载中')
        const downloaded = await downloadFile(
          file.url,
          file.filename,
          (loaded, total) => {
            const progress =
              total && total > 0
                ? `${Math.floor((loaded / total) * 100)}%`
                : `${formatBytes(loaded)}`
            tip.updateFile(index, `下载中 ${progress}`)
          }
        )
        tip.updateFile(
          index,
          downloaded ? '完成' : '下载失败，已尝试新窗口打开'
        )
      } catch (error) {
        failed = true
        const message = error instanceof Error ? error.message : '未知错误'
        console.error(`Failed to process GIF #${index + 1}`, error)
        tip.updateFile(index, `失败：${message}`)
      }
    })
  )

  return {
    files: files.filter(
      (file): file is { url: string; filename: string } => file !== undefined
    ),
    failed,
  }
}

async function converticoRequest(params: Record<string, string | number>) {
  const formData = new FormData()
  Object.keys(params).forEach((key) => {
    formData.append(key, String(params[key]))
  })

  return new Promise<any>((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://convertico.com/twitter-video-downloader/process.php',
      responseType: 'json',
      data: formData,
      onload: (response) => {
        if (response.status < 200 || response.status >= 300) {
          reject(
            new Error(
              `转换服务请求失败（HTTP ${response.status} ${response.statusText}）`
            )
          )
          return
        }
        if (!response.response || typeof response.response !== 'object') {
          reject(new Error('转换服务返回了无效响应'))
          return
        }
        resolve(response.response)
      },
      onerror: (error) => {
        reject(new Error(error.statusText || '网络请求失败'))
      },
      ontimeout: () => {
        reject(new Error('请求超时'))
      },
      onabort: () => {
        reject(new Error('请求已取消'))
      },
    })
  })
}
