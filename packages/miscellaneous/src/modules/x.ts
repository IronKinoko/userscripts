import { router, sleep } from 'shared'

router({
  domain: ['x.com'],
  routes: [{ run: main }],
})

function main() {
  const run = () => {
    injectDownloadIcon()
    patchMediaTab()
    enableScrollSnapDrag()
    enableCarouselDrag()
    enableSwipeToDismissDrag()

    requestAnimationFrame(run)
  }
  requestAnimationFrame(run)
}

function enableCarouselDrag() {
  const lists = document.querySelectorAll<HTMLElement>(
    '[role="dialog"] [aria-roledescription="carousel"] [role="list"]'
  )

  lists.forEach((list) => {
    if (list.hasAttribute('data-x-carousel-drag-enabled')) return

    const carousel = list.closest<HTMLElement>(
      '[aria-roledescription="carousel"]'
    )
    if (!carousel) return

    list.setAttribute('data-x-carousel-drag-enabled', 'true')
    list.style.cursor = 'grab'

    disableImageDragging(list)

    list.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return

      const startX = event.clientX
      const startY = event.clientY
      const startTime = Date.now()
      const originalTransform = list.style.transform
      const originalTransition = list.style.transition
      const originalUserSelect = list.style.userSelect
      const transformMatch = originalTransform.match(
        /translate3d\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px,\s*(-?[\d.]+)px\s*\)/i
      )
      const computedTransform = window.getComputedStyle(list).transform
      const computedMatrix =
        computedTransform === 'none'
          ? new DOMMatrixReadOnly()
          : new DOMMatrixReadOnly(computedTransform)
      const startTranslateX = transformMatch
        ? Number(transformMatch[1])
        : computedMatrix.m41
      const translateY = transformMatch
        ? Number(transformMatch[2])
        : computedMatrix.m42
      const translateZ = transformMatch
        ? Number(transformMatch[3])
        : computedMatrix.m43
      let dragging = false
      let axis: 'x' | 'y' | null = null
      let deltaX = 0
      let deltaY = 0

      const onMouseMove = (moveEvent: MouseEvent) => {
        deltaX = moveEvent.clientX - startX
        deltaY = moveEvent.clientY - startY
        if (!axis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 5) {
          axis = Math.abs(deltaX) >= Math.abs(deltaY) ? 'x' : 'y'
        }
        if (axis !== 'x') return

        if (!dragging) {
          dragging = true
          list.style.cursor = 'grabbing'
          list.style.userSelect = 'none'
          list.style.transition = 'none'
        }

        moveEvent.preventDefault()
        const nextTranslateX = startTranslateX + deltaX
        const translatedTransform = transformMatch
          ? originalTransform.replace(
              transformMatch[0],
              `translate3d(${nextTranslateX}px, ${translateY}px, ${translateZ}px)`
            )
          : `translate3d(${nextTranslateX}px, ${translateY}px, ${translateZ}px)`
        list.style.transform = translatedTransform
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        if (dragging) {
          list.style.transform = originalTransform
          list.style.transition = originalTransition
          list.style.cursor = 'grab'
          list.style.userSelect = originalUserSelect

          const duration = Date.now() - startTime
          const distance = Math.abs(deltaX)
          const shouldSwitch =
            (distance >= 50 && duration <= 300) || distance >= 120

          if (shouldSwitch) {
            const testId = deltaX < 0 ? 'Carousel-NavRight' : 'Carousel-NavLeft'
            carousel
              .querySelector<HTMLElement>(`[data-testid="${testId}"]`)
              ?.click()
          }

          const preventClick = (clickEvent: MouseEvent) => {
            if (list.contains(clickEvent.target as Node)) {
              clickEvent.preventDefault()
              clickEvent.stopPropagation()
            }
            document.removeEventListener('click', preventClick, true)
          }
          document.addEventListener('click', preventClick, true)
          window.setTimeout(
            () => document.removeEventListener('click', preventClick, true),
            0
          )
        }
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
  })
}

function enableSwipeToDismissDrag() {
  document
    .querySelectorAll<HTMLElement>(
      '[role="dialog"] [data-testid="swipe-to-dismiss"]'
    )
    .forEach(enableVerticalDrag)
}

function enableVerticalDrag(element: HTMLElement) {
  if (element.hasAttribute('data-x-vertical-drag-enabled')) return

  element.setAttribute('data-x-vertical-drag-enabled', 'true')
  element.style.cursor = 'grab'
  element.addEventListener('dragstart', (event) => event.preventDefault())

  element.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return

    const startX = event.clientX
    const startY = event.clientY
    const startTime = Date.now()
    const originalTransform = element.style.transform
    const originalTransition = element.style.transition
    const originalOpacity = element.style.opacity
    const originalCursor = element.style.cursor
    const originalUserSelect = element.style.userSelect
    const transformMatch = originalTransform.match(
      /translate3d\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px,\s*(-?[\d.]+)px\s*\)/i
    )
    const computedTransform = window.getComputedStyle(element).transform
    const computedMatrix =
      computedTransform === 'none'
        ? new DOMMatrixReadOnly()
        : new DOMMatrixReadOnly(computedTransform)
    const startTranslateX = transformMatch
      ? Number(transformMatch[1])
      : computedMatrix.m41
    const startTranslateY = transformMatch
      ? Number(transformMatch[2])
      : computedMatrix.m42
    const translateZ = transformMatch
      ? Number(transformMatch[3])
      : computedMatrix.m43
    let axis: 'x' | 'y' | null = null
    let dragging = false
    let deltaX = 0
    let deltaY = 0

    const onMouseMove = (moveEvent: MouseEvent) => {
      deltaX = moveEvent.clientX - startX
      deltaY = moveEvent.clientY - startY
      if (!axis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 5) {
        axis = Math.abs(deltaY) > Math.abs(deltaX) ? 'y' : 'x'
      }
      if (axis !== 'y') return

      if (!dragging) {
        dragging = true
        element.style.cursor = 'grabbing'
        element.style.userSelect = 'none'
        element.style.transition = 'none'
      }

      moveEvent.preventDefault()
      element.style.transform = transformMatch
        ? originalTransform.replace(
            transformMatch[0],
            `translate3d(${startTranslateX + deltaX}px, ${
              startTranslateY + deltaY
            }px, ${translateZ}px)`
          )
        : `translate3d(${startTranslateX + deltaX}px, ${
            startTranslateY + deltaY
          }px, ${translateZ}px)`
      const downwardDistance = Math.max(deltaY, 0)
      element.style.opacity = String(Math.max(0.2, 1 - downwardDistance / 300))
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      if (!dragging) return

      element.style.transform = originalTransform
      element.style.transition = originalTransition
      element.style.opacity = originalOpacity
      element.style.cursor = originalCursor
      element.style.userSelect = originalUserSelect

      const duration = Date.now() - startTime
      const distance = Math.max(deltaY, 0)
      const shouldDismiss =
        (distance >= 50 && duration <= 300) || distance >= 120
      if (shouldDismiss) {
        element
          .closest('[role="dialog"]')
          ?.querySelector<HTMLElement>('[aria-label="关闭"]')
          ?.click()
      }

      const preventClick = (clickEvent: MouseEvent) => {
        if (element.contains(clickEvent.target as Node)) {
          clickEvent.preventDefault()
          clickEvent.stopPropagation()
        }
        document.removeEventListener('click', preventClick, true)
      }
      document.addEventListener('click', preventClick, true)
      window.setTimeout(
        () => document.removeEventListener('click', preventClick, true),
        0
      )
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  })
}

function disableImageDragging(list: HTMLElement) {
  list.addEventListener('dragstart', (event) => {
    event.preventDefault()
  })

  list.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
    image.draggable = false
  })

  const imageObserver = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          node.draggable = false
        } else if (node instanceof Element) {
          node.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
            image.draggable = false
          })
        }
      })
    })
  })
  imageObserver.observe(list, { childList: true, subtree: true })
}

function enableScrollSnapDrag() {
  const lists = document.querySelectorAll<HTMLElement>(
    '[data-testid="ScrollSnap-List"]'
  )

  lists.forEach((list) => {
    if (list.hasAttribute('data-x-drag-enabled')) return

    list.setAttribute('data-x-drag-enabled', 'true')
    list.style.cursor = 'grab'
    disableImageDragging(list)

    list.addEventListener('mousedown', (event) => {
      if (event.button !== 0) return
      if (
        (event.target as HTMLElement).closest(
          'button, input, textarea, select, [contenteditable="true"]'
        )
      ) {
        return
      }

      const startX = event.clientX
      const startScrollLeft = list.scrollLeft
      const originalSnapType = list.style.getPropertyValue('scroll-snap-type')
      const originalSnapPriority =
        list.style.getPropertyPriority('scroll-snap-type')
      const originalUserSelect = list.style.userSelect
      let dragging = false

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX
        if (!dragging && Math.abs(deltaX) < 5) return

        if (!dragging) {
          dragging = true
          list.style.cursor = 'grabbing'
          list.style.userSelect = 'none'
          list.style.setProperty('scroll-snap-type', 'none', 'important')
        }

        moveEvent.preventDefault()
        list.scrollLeft = startScrollLeft - deltaX
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        list.style.cursor = 'grab'
        list.style.userSelect = originalUserSelect
        if (originalSnapType) {
          list.style.setProperty(
            'scroll-snap-type',
            originalSnapType,
            originalSnapPriority
          )
        } else {
          list.style.removeProperty('scroll-snap-type')
        }

        if (!dragging) return

        const preventClick = (clickEvent: MouseEvent) => {
          if (list.contains(clickEvent.target as Node)) {
            clickEvent.preventDefault()
            clickEvent.stopPropagation()
          }
          document.removeEventListener('click', preventClick, true)
        }
        document.addEventListener('click', preventClick, true)
        window.setTimeout(
          () => document.removeEventListener('click', preventClick, true),
          0
        )
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
  })
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
