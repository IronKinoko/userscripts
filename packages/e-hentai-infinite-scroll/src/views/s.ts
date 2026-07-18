import { debounce, local, memoize, session, sleep, throttle } from 'shared'

interface ApiRes {
  /** source */
  s: string
  /** i4 > .sn */
  n: string
  /** i4 > div */
  i: string
  /** current img key */
  k: string
  i3: string
  i5: string
  i6: string
}
type I3MatchGroup = {
  key: string
  src: string
  nl: string
}

enum GalleryImageState {
  Idle = 'Idle',
  Waiting = 'Waiting',
  Loading = 'Loading',
  Loaded = 'Loaded',
  Rendered = 'Rendered',
}

interface GalleryImage {
  state: GalleryImageState
  page: number
  idx: number
  galleryUrl: string
  idxInPage: number
  sourceUrl: string
  imgUrl: string
  container: HTMLDivElement
}

function parseI3(i3: string) {
  return i3.match(/'(?<key>.*)'.*src="(?<src>.*?)"(.*nl\('(?<nl>.*)'\))?/)!
    .groups! as I3MatchGroup
}

async function setupInfiniteScroll() {
  function createImgContainer(page: number) {
    const container = document.createElement('div')
    container.classList.add('k-img-item', 'auto-load-item', 'is-loading')
    container.setAttribute('data-idx', page.toString())

    const placeholder = document.createElement('div')
    placeholder.classList.add('auto-load-placeholder')

    const spinnerWrap = document.createElement('div')
    spinnerWrap.classList.add('auto-load-spinner-wrap')

    const spinner = document.createElement('div')
    spinner.classList.add('auto-load-spinner')

    const indicator = document.createElement('span')
    indicator.classList.add('auto-load-indicator')
    indicator.textContent = page + 1 + ''

    const label = document.createElement('span')
    label.classList.add('auto-load-placeholder-text')
    label.textContent = `Wait for image to load...`

    const img = document.createElement('img')
    img.classList.add('auto-load-img', 'is-loading')

    spinnerWrap.append(spinner)
    spinnerWrap.append(indicator)
    placeholder.append(spinnerWrap)
    placeholder.append(label)
    container.append(placeholder)
    container.append(img)

    return container
  }

  const setPlaceholderText = (galleryImage: GalleryImage, text: string) => {
    const placeholderText = galleryImage.container.querySelector<HTMLElement>(
      '.auto-load-placeholder-text'
    )
    if (placeholderText) {
      placeholderText.innerHTML = `[${galleryImage.state}]${text}`
    }
  }

  function bindImgLoadState(galleryImage: GalleryImage) {
    const container = galleryImage.container
    const img = container.querySelector<HTMLImageElement>('img.auto-load-img')!
    img.src = galleryImage.imgUrl
    const clearLoadingState = () => {
      container.classList.remove('is-loading')
      container.classList.add('is-loaded')
      container.querySelector('.auto-load-placeholder')?.remove()
      img.classList.remove('is-loading')
      img.classList.add('is-loaded')
    }

    const MaxRetryCount = 3
    let retryCount = 0
    let timer = 0
    const onDone = () => {
      clearTimeout(timer)

      if (img.complete && img.naturalWidth > 0) {
        clearLoadingState()
      } else {
        if (retryCount >= MaxRetryCount) {
          galleryImage.state = GalleryImageState.Waiting
          galleryImage.imgUrl = ''
          setPlaceholderText(galleryImage, 'Failed to load image')
          return
        }

        const retryUrl = new URL(img.src)
        retryUrl.searchParams.set('retry', retryCount.toString())
        img.src = retryUrl.toString()
        retryCount++
        setPlaceholderText(
          galleryImage,
          `Load failed, retry ${retryCount}/${MaxRetryCount}...`
        )

        timer = window.setTimeout(onDone, retryCount * 10000)
        img.decode().then(onDone).catch(onDone)
      }
    }

    setPlaceholderText(galleryImage, `Loading image...`)
    timer = window.setTimeout(onDone, 10000)
    img.decode().then(onDone).catch(onDone)
  }

  function api_call(page: number, nextImgKey: string) {
    return new Promise<ApiRes>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', window.api_url)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.withCredentials = true
      xhr.addEventListener('loadend', () => {
        if (200 <= xhr.status && xhr.status <= 300)
          resolve(JSON.parse(xhr.response))
        else reject(xhr.response)
      })

      xhr.send(
        JSON.stringify({
          method: 'showpage',
          gid: window.gid,
          page: page,
          imgkey: nextImgKey,
          showkey: window.showkey,
        })
      )
    })
  }

  async function getGalleryMeta() {
    const total = parseInt(
      document.querySelector('#i2 > div.sn > div > span:nth-child(2)')!
        .textContent!
    )
    const currentPage = window.startpage - 1
    const prevPageSize = local.getItem('e-hentai-infinite-scroll-page-size')
    let defaultPage = 0

    if (prevPageSize) {
      defaultPage = Math.floor(currentPage / parseInt(prevPageSize))
    }

    const galleryUrl = document.querySelector('#i5 a')!.getAttribute('href')!
    const { pages, pageSize, images } = await getGalleryPageMeta(
      galleryUrl,
      defaultPage
    )

    const galleryImages = Array.from({ length: total }).map<GalleryImage>(
      (_, idx) => {
        const page = Math.floor(idx / pageSize)
        const indexInPage = idx % pageSize
        const pageUrl = new URL(galleryUrl)
        pageUrl.searchParams.set('p', page.toString())
        return {
          state: GalleryImageState.Idle,
          galleryUrl: `${pageUrl.toString()}`,
          page,
          idx,
          idxInPage: indexInPage,
          sourceUrl: '',
          imgUrl: '',
          container: createImgContainer(idx),
        }
      }
    )

    images.forEach((image) => {
      galleryImages[image.idx].sourceUrl = image.sourceUrl
    })

    galleryImages[currentPage].state = GalleryImageState.Loaded
    galleryImages[currentPage].sourceUrl = window.location.href
    galleryImages[currentPage].imgUrl = $('#i3 img').attr('src')!

    return { total, pages, pageSize, galleryImages }
  }

  $('body').addClass('e-hentai-infinite-scroll s')
  const meta = await getGalleryMeta()
  $('#i3').empty()
  meta.galleryImages.forEach((galleryImage) => {
    const container = galleryImage.container
    $('#i3').append(container)
  })

  await sleep()
  $('.k-img-item')
    .get(window.startpage - 1)!
    .scrollIntoView({ block: 'start' })

  let observer: IntersectionObserver
  function createObserver() {
    const activeLineY = 200

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute('data-idx')!)

            updateBrowserHistory(idx)
            detectBoxInView(idx)
          }
        })
      },
      {
        rootMargin: `${-activeLineY}px 0px -${
          document.body.clientHeight - activeLineY - 1
        }px 0px`,
      }
    )
    meta.galleryImages.forEach((galleryImage) => {
      observer.observe(galleryImage.container)
    })
    return observer
  }
  observer = createObserver()

  window.addEventListener(
    'resize',
    debounce(() => {
      observer.disconnect()
      observer = createObserver()
    })
  )

  const updateBrowserHistory = throttle((idx: number) => {
    if (meta.galleryImages[idx].sourceUrl) {
      history.replaceState(null, '', meta.galleryImages[idx].sourceUrl)
    }
  }, 100)

  const detectBoxInView = debounce((idx: number) => {
    for (let i = 0; i < meta.galleryImages.length; i++) {
      const galleryImage = meta.galleryImages[i]
      if (!galleryImage) continue

      if (i >= idx - 1 && i < idx + 5) {
        if (galleryImage.state === GalleryImageState.Idle) {
          galleryImage.state = GalleryImageState.Waiting
        }
      } else {
        if (galleryImage.state === GalleryImageState.Waiting) {
          galleryImage.state = GalleryImageState.Idle
        }
      }
    }
  }, 100)

  while (true) {
    const loadedList = meta.galleryImages.filter(
      (galleryImage) => galleryImage.state === GalleryImageState.Loaded
    )

    loadedList.forEach((galleryImage) => {
      galleryImage.state = GalleryImageState.Rendered
      bindImgLoadState(galleryImage)
    })

    const loadingList = meta.galleryImages.filter(
      (galleryImage) => galleryImage.state === GalleryImageState.Loading
    )

    if (loadingList.length >= 3) {
      await sleep(100)
      continue
    }

    const waitingList = meta.galleryImages.filter(
      (galleryImage) => galleryImage.state === GalleryImageState.Waiting
    )
    if (waitingList.length === 0) {
      await sleep(100)
      continue
    }

    waitingList
      .slice(0, 3 - loadingList.length)
      .forEach(async (galleryImage) => {
        galleryImage.state = GalleryImageState.Loading
        try {
          if (!galleryImage.sourceUrl) {
            setPlaceholderText(galleryImage, 'Fetch page meta')
            try {
              const res = await getGalleryPageMeta(
                galleryImage.galleryUrl,
                galleryImage.page
              )
              res.images.forEach((image) => {
                meta.galleryImages[image.idx].sourceUrl = image.sourceUrl
              })
            } catch (error) {
              getGalleryPageMeta.cache.clear?.()
              throw new Error('Failed to fetch page meta')
            }
          }

          if (!galleryImage.imgUrl) {
            try {
              setPlaceholderText(galleryImage, 'Fetch image url')
              const nextKey = galleryImage.sourceUrl.split('/').slice(-2)[0]
              const res = await api_call(galleryImage.idx + 1, nextKey)

              galleryImage.imgUrl = parseI3(res.i3).src
            } catch (error) {
              throw new Error('Failed to fetch image url')
            }
          }

          galleryImage.state = GalleryImageState.Loaded
        } catch (error: any) {
          galleryImage.state = GalleryImageState.Waiting
          setPlaceholderText(galleryImage, error.message)
        }
      })

    await sleep(100)
  }
}

interface PageMeta {
  pages: number
  pageSize: number
  images: {
    page: number
    idx: number
    idxInPage: number
    sourceUrl: string
  }[]
}

const getGalleryPageMeta = memoize(async function getGalleryPageMeta(
  galleryUrl: string,
  page: number
) {
  const url = new URL(galleryUrl)
  url.searchParams.set('p', page.toString())

  if (session.getItem(url.toString())) {
    return session.getItem(url.toString()) as PageMeta
  }

  const response = await fetch(url.toString())
  const text = await response.text()
  const doc = new DOMParser().parseFromString(text, 'text/html')

  const pages = doc.querySelectorAll('.gtb .ptt td').length - 2
  const pageSize = doc.querySelector('#gdt')!.classList.contains('gt200')
    ? 20
    : 40
  local.setItem('e-hentai-infinite-scroll-page-size', pageSize)

  const images = Array.from(doc.querySelector('#gdt')!.children).map(
    (element, index) => {
      const url = $(element).attr('href')!
      const idx = parseInt(url.match(/-(\d+)$/)![1])

      return {
        page,
        idx: idx - 1,
        idxInPage: index,
        sourceUrl: url,
      }
    }
  )

  session.setItem(url.toString(), { pages, pageSize, images })
  return { pages, pageSize, images }
})

export function setup() {
  setupInfiniteScroll()
}
