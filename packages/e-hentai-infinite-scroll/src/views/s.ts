import { debounce } from 'shared'

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
type Info = {
  key: string
  src: string
  nl: string
  source: string
}

const store: Record<string, { info: Info; res: ApiRes }> = {}

function parseI3(i3: string) {
  return i3.match(/'(?<key>.*)'.*src="(?<src>.*?")(.*nl\('(?<nl>.*)'\))?/)!
    .groups!
}

function setupInfiniteScroll() {
  function getAspectRatioFromImg(img: HTMLImageElement | null) {
    if (!img) return null

    const width = Math.round(img.naturalWidth || img.width)
    const height = Math.round(img.naturalHeight || img.height)
    if (!width || !height) return null

    const gcd = (a: number, b: number): number => {
      let x = Math.abs(a)
      let y = Math.abs(b)
      while (y) {
        const temp = x % y
        x = y
        y = temp
      }
      return x || 1
    }

    const divisor = gcd(width, height)
    return `${width / divisor} / ${height / divisor}`
  }

  function getMostCommonAspectRatio() {
    const images =
      document.querySelectorAll<HTMLImageElement>('#i3 .auto-load-img')
    const ratioCountMap: Record<string, number> = {}

    images.forEach((img) => {
      const ratio = getAspectRatioFromImg(img)
      if (!ratio) return
      ratioCountMap[ratio] = (ratioCountMap[ratio] || 0) + 1
    })

    let maxCount = 0
    let mostCommonRatio = ''

    Object.entries(ratioCountMap).forEach(([ratio, count]) => {
      if (count > maxCount) {
        maxCount = count
        mostCommonRatio = ratio
      }
    })

    return mostCommonRatio
  }

  function getPlaceholderRatio() {
    return getMostCommonAspectRatio() || '320 / 450'
  }

  function createImgContainer(page: number) {
    const container = document.createElement('div')
    container.classList.add('auto-load-item', 'is-loading')
    container.style.setProperty('--auto-load-ratio', getPlaceholderRatio())

    const placeholder = document.createElement('div')
    placeholder.classList.add('auto-load-placeholder')

    const spinner = document.createElement('span')
    spinner.classList.add('auto-load-spinner')

    const label = document.createElement('span')
    label.classList.add('auto-load-placeholder-text')
    label.textContent = `Loading image #${page}...`

    placeholder.append(spinner, label)
    container.append(placeholder)
    return container
  }

  function bindImgLoadState(img: HTMLImageElement, container: HTMLDivElement) {
    const clearLoadingState = () => {
      container.append(img)
      container.classList.remove('is-loading')
      container.classList.add('is-loaded')
      container.querySelector('.auto-load-placeholder')?.remove()
      img.classList.remove('is-loading')
      img.classList.add('is-loaded')
    }

    const setPlaceholderText = (text: string) => {
      const placeholderText = container.querySelector<HTMLElement>(
        '.auto-load-placeholder-text'
      )
      if (placeholderText) {
        placeholderText.textContent = text
      }
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
          setPlaceholderText('Failed to load image')
          return
        }

        const retryUrl = new URL(img.src)
        retryUrl.searchParams.set('retry', retryCount.toString())
        img.src = retryUrl.toString()
        retryCount++
        setPlaceholderText(
          `Load failed, retry #${retryCount}/${MaxRetryCount}...`
        )

        timer = window.setTimeout(onDone, 60000)
        img.decode().then(onDone).catch(onDone)
      }
    }

    timer = window.setTimeout(onDone, 60000)
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
  const maxPageSize = parseInt(
    document.querySelector('#i2 > div.sn > div > span:nth-child(2)')!
      .textContent!
  )

  let nextImgKey = document
    .querySelector<HTMLAnchorElement>('#i3 a[onclick]')!
    .onclick!.toString()
    .match(/'(?<key>.*)'/)!.groups!.key
  let page = window.startpage + 1

  let isLoading = false
  async function loadImgInfo() {
    try {
      if (maxPageSize < page) {
        return
      }
      if (isLoading) return
      isLoading = true
      const res = await api_call(page, nextImgKey)
      isLoading = false
      const groups = parseI3(res.i3)

      const info: Info = {
        key: res.k,
        nl: groups.nl,
        src: groups.src.slice(0, -1),
        source: res.s[0] === '/' ? res.s : '/' + res.s,
      }

      store[res.k] = { info, res }

      renderImg(page, info)

      nextImgKey = groups.key
      page++
    } catch (error) {
      isLoading = false
      console.error(error)
      await loadImgInfo()
    }
  }

  function renderImg(page: number, info: Info) {
    const { key, source, src } = info
    const container = createImgContainer(page)
    const img = document.createElement('img')
    img.classList.add('auto-load-img', 'is-loading')

    img.dataset.imgKey = key
    img.dataset.page = page + ''
    img.dataset.source = source
    img.setAttribute('src', src)
    bindImgLoadState(img, container)

    document.getElementById('i3')!.append(container)
  }

  function detectShouldLoadNextPage() {
    const dom = document.scrollingElement!

    if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 2000) {
      loadImgInfo()
    }
  }

  function resetDefaultImgDOM() {
    const groups = parseI3(document.querySelector('#i3')!.innerHTML)
    store[window.startkey] = {
      info: {
        key: window.startkey,
        nl: groups.nl,
        src: groups.src,
        source: location.pathname,
      },
      res: {
        i: document.querySelector('#i4 > div')!.outerHTML,
        i3: document.querySelector('#i3')!.innerHTML,
        n: document.querySelector('#i4 > .sn')!.outerHTML,
        i5: document.querySelector('#i5')!.innerHTML,
        i6: document.querySelector('#i6')!.innerHTML,
        k: window.startkey,
        s: location.pathname,
      },
    }
    document.querySelector('#i3')!.innerHTML = ''
    renderImg(window.startpage, store[window.startkey].info)
  }

  document.body.classList.add('e-hentai-infinite-scroll', 's')

  resetDefaultImgDOM()
  detectShouldLoadNextPage()
  document.addEventListener('scroll', () => {
    detectShouldLoadNextPage()
    updateCurrentInfo()
  })

  const ob = new MutationObserver(() => {
    detectShouldLoadNextPage()
  })

  ob.observe(document.querySelector('#i3')!, {
    childList: true,
    subtree: true,
    attributes: true,
  })

  document.querySelector<HTMLDivElement>('#i1')!.style.width = 'fit-content'
}

function removeSnAnchor() {
  document.querySelectorAll('.sn a[onclick]').forEach((a) => {
    a.removeAttribute('onclick')
  })
}
function getCurrentActiveImg() {
  const imgs = document.querySelectorAll<HTMLImageElement>('#i3 img,#i3 img')
  for (const img of imgs) {
    const { top, bottom } = img.getBoundingClientRect()
    const base = 200

    if (top < base && bottom > base) {
      return img
    }
  }
  return null
}

function updateCurrentPathname($img: HTMLImageElement) {
  const source = $img.dataset.source
  history.replaceState(null, '', source)
}

function updateBottomInfo($img: HTMLImageElement) {
  const key = $img.dataset.imgKey!
  const { res } = store[key]

  document.querySelector('#i2')!.innerHTML = res.n + res.i
  document.querySelector('#i4')!.innerHTML = res.i + res.n
  document.querySelector('#i5')!.innerHTML = res.i5
  document.querySelector('#i6')!.innerHTML = res.i6
  removeSnAnchor()
}

const updateCurrentInfo = debounce(function () {
  const $img = getCurrentActiveImg()
  if (!$img) return

  const source = $img.dataset.source
  if (location.pathname === source) return

  updateCurrentPathname($img)
  updateBottomInfo($img)
}, 30)

export function setup() {
  setupInfiniteScroll()
}
