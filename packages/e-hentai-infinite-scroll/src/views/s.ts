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
    const { key, source, src } = info
    const img = document.createElement('img-lazy')
    img.setAttribute('src', src)
    img.dataset.imgKey = key
    img.dataset.page = page + ''
    img.dataset.source = source
    img.classList.add('auto-load-img')

    document.getElementById('i3')!.append(img)
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
  const imgs = document.querySelectorAll<HTMLImageElement>(
    '#i3 img,#i3 img-lazy'
  )
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
