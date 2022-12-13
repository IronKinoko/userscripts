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
  i7: string
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

let isLoadEnd = false
function setupInfiniteScroll() {
  function api_call(page: number, nextImgKey: string) {
    return new Promise<ApiRes>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', window.api_url)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.withCredentials = true
      xhr.onreadystatechange = () => {
        if (xhr.readyState === xhr.DONE) {
          resolve(JSON.parse(xhr.responseText))
        }
      }
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
    if (maxPageSize < page) {
      isLoadEnd = true
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
  }

  function renderImg(page: number, info: Info) {
    const { key, source } = info
    const img = document.createElement('img')
    img.src =
      "data:image/svg+xml,%3Csvg class='loading-icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M512 0a512 512 0 0 1 512 512h-64a448 448 0 0 0-448-448V0z' fill='%23999'%3E%3C/path%3E%3Cstyle%3E%0A.loading-icon %7B animation: rotate 1s infinite linear; %7D%0A@keyframes rotate %7B from %7B transform: rotate(0); %7D to %7B transform: rotate(360deg); %7D %7D%0A%3C/style%3E%3C/svg%3E"
    img.dataset.imgKey = key
    img.dataset.page = page + ''
    img.dataset.source = source
    img.classList.add('auto-load-img', 'auto-load-img-empty')
    img.alt = source

    loadImg(img, info)
    document.getElementById('i3')!.append(img)
  }

  function loadImg(imgDOM: HTMLImageElement, info: Info) {
    const { source, src, nl } = info
    const img = new Image()
    img.onload = () => {
      imgDOM.src = src
      imgDOM.classList.remove('auto-load-img-empty')
    }
    img.onerror = () => {
      imgDOM.alt = `图片加载出错 ${source}?nl=${nl}`
      retry(imgDOM, info)
    }
    img.src = src
  }

  function retry(img: HTMLImageElement, info: Info) {
    const iframe = document.createElement('iframe')
    iframe.style.cssText =
      'position:fixed;width:0;height:0;opacity:0;left:0;top:0;'

    const url = new URL(info.source, location.origin)
    url.searchParams.set('nl', info.nl)
    iframe.src = url.toString()

    document.body.append(iframe)

    iframe.contentWindow!.addEventListener('DOMContentLoaded', () => {
      const src = iframe
        .contentWindow!.document.querySelector('#i3 a img')!
        .getAttribute('src')!

      loadImg(img, { ...info, src })
      iframe.remove()
    })
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
        i7: document.querySelector('#i7')!.innerHTML,
        k: window.startkey,
        s: location.pathname,
      },
    }

    const $img = document.querySelector<HTMLImageElement>('#i3 a img')!
    $img.removeAttribute('style')
    $img.classList.add('auto-load-img')
    $img.dataset.imgKey = window.startkey
    $img.dataset.source = location.pathname
    document.getElementById('i3')!.append($img)
    document.querySelector('#i3 a')!.remove()
    removeSnAnchor()
  }

  document.body.classList.add('e-hentai-infinite-scroll', 's')

  resetDefaultImgDOM()
  loadImgInfo()
  document.addEventListener('scroll', () => {
    const dom = document.scrollingElement!

    if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 2000) {
      loadImgInfo()
    }

    updateCurrentInfo()
  })
}

function removeSnAnchor() {
  document.querySelectorAll('.sn a[onclick]').forEach((a) => {
    a.removeAttribute('onclick')
  })
}
function getCurrentActiveImg() {
  const imgs = document.querySelectorAll<HTMLImageElement>('#i3 img')
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
  document.querySelector('#i7')!.innerHTML = res.i7
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

function setupBottomInfo() {
  const $root = document.querySelector('#i1')!

  const $wrapper = document.createElement('div')
  $wrapper.className = 'ehis-bottom-info-wrapper'
  $root.insertBefore($wrapper, document.querySelector('#i4'))

  const $container = document.createElement('div')
  $container.className = 'ehis-bottom-info-container'
  $container.style.background = getComputedStyle($root).background
  $wrapper.append($container)

  $container.append(...document.querySelectorAll('#i4,#i5,#i6,#i7'))

  const calcSticky = () => {
    const dom = document.scrollingElement!

    if (isLoadEnd) {
      if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 200) {
        $wrapper.classList.add('static')
      } else {
        $wrapper.classList.remove('static')
      }
    }
  }
  calcSticky()
  document.addEventListener('scroll', () => {
    calcSticky()
  })
}

export function setup() {
  setupInfiniteScroll()
  setupBottomInfo()
}
