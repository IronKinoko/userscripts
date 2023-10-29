import { session, debounce, waitDOM, copy } from 'shared'

const $ = <T extends Element = Element>(selector: string) =>
  document.querySelector<T>(selector)!
const $$ = <T extends Element = Element>(selector: string) =>
  document.querySelectorAll<T>(selector)!

interface Info {
  mode: 'normal' | 'large'
  url: URL
  total: number
  currentPage: number
  pageSize: number
  pageCount: number
  unloadPageLinks: string[]
  childrenClass: string
}
function getPageInfo(): Info {
  const mode = $('#gdt .gdtl') ? 'large' : 'normal'
  const pageSize = mode === 'normal' ? 40 : 20
  const total = +$('.gtb p.gpc').textContent!.match(
    /of\s(?<total>[0-9,]+)\simages/
  )!.groups!.total

  const url = new URL(window.location.href)
  let currentPage = 0
  if (url.searchParams.has('p')) {
    currentPage = +url.searchParams.get('p')!
  }

  const pageCount = +$('.gtb .ptb td:nth-last-child(2)').textContent!

  const unloadPageCount = pageCount - 1 - currentPage
  let unloadPageLinks = Array(unloadPageCount)
    .fill(0)
    .map((_, i) => {
      url.searchParams.set('p', 1 + currentPage + i + '')
      return url.toString()
    })

  return {
    mode,
    url,
    total,
    currentPage,
    pageSize,
    pageCount,
    unloadPageLinks,
    childrenClass: mode === 'normal' ? '#gdt .gdtm' : '#gdt .gdtl',
  }
}

async function fetchNextDom(url: string, info: Info) {
  const storageKey = url + info.mode
  let html =
    session.getItem(storageKey) || (await fetch(url).then((r) => r.text()))

  const doc = new DOMParser().parseFromString(html, 'text/html')
  if (doc.querySelector('#gdt')) {
    info.currentPage++
    session.setItem(storageKey, html)
    const items = doc.querySelectorAll(info.childrenClass)
    items.forEach((node) => {
      node.setAttribute('data-page', info.currentPage + '')
    })
    return items
  } else {
    return null
  }
}
let isLoading = false
async function loadNextPage(info: Info, mode: 'tiny' | 'large') {
  if (isLoading) return

  let url = info.unloadPageLinks.shift()
  if (url) {
    isLoading = true
    const items = await fetchNextDom(url, info)
    isLoading = false

    if (items) {
      if (mode === 'large') {
        createPageIndex(info.currentPage)
      }
      $('#gdt').append(...items)
      $$('#gdt .c').forEach((node) => node.remove())
    }
  }
}

function createPageIndex(currentPage: number) {
  const dom = document.createElement('div')
  dom.innerText = currentPage + 1 + ''
  dom.className = 'g-scroll-page-index'
  $('#gdt').append(dom)
}

function tinyGallery() {
  const info = getPageInfo()

  const handleScroll = () => {
    const dom = document.scrollingElement!

    if (
      $('#cdiv').getBoundingClientRect().y <=
      dom.scrollTop + dom.clientHeight + 2000
    ) {
      loadNextPage(info, 'tiny')
    }
  }
  document.addEventListener('scroll', handleScroll)
}

function largeGallery() {
  const info = getPageInfo()

  $('#gdt').classList.add('g-scroll-body', info.mode)
  $$(info.childrenClass).forEach((node) => {
    node.setAttribute('data-page', info.currentPage + '')
  })

  const replaceCurrentURL = debounce(function () {
    const imgs = document.querySelectorAll<HTMLImageElement>(info.childrenClass)
    const rect = $('#gdt').getBoundingClientRect()
    const base = rect.top + rect.height / 2
    for (const img of imgs) {
      const { top, bottom } = img.getBoundingClientRect()

      if (top < base && bottom > base) {
        const page = img.dataset.page!
        const url = new URL(window.location.href)
        if (+page === 0) {
          url.searchParams.delete('p')
        } else {
          url.searchParams.set('p', page)
        }
        if (window.location.href !== url.toString()) {
          history.replaceState(null, '', url)

          const activeElement = (node: Element, idx: number) => {
            node.className = ''
            if (idx === +page + 1) {
              node.className = 'ptds'
            }
          }
          $$('.gtb .ptt td').forEach(activeElement)
          $$('.gtb .ptb td').forEach(activeElement)
        }
        return
      }
    }
  }, 30)

  const handleScroll = () => {
    const dom = $('#gdt')

    if (dom.scrollHeight - 2000 < dom.scrollTop + dom.clientHeight) {
      loadNextPage(info, 'large')
    }

    replaceCurrentURL()
  }
  handleScroll()
  $('#gdt').addEventListener('scroll', handleScroll)
}

function addWatchTag(tag: string) {
  return fetch('/mytags', {
    method: 'POST',
    body: new URLSearchParams({
      usertag_action: 'add',
      tagname_new: tag,
      tagwatch_new: 'on',
      tagcolor_new: '',
      tagweight_new: '10',
      usertag_target: '0',
    }),
  })
}
async function injectWatchTag() {
  const node = document.querySelector<HTMLDivElement>('#tagmenu_act')!

  const inject = () => {
    const img = document.createElement('img')
    const a = document.createElement('a')
    const br = document.createElement('br')
    node.append(br, img, a)

    img.outerHTML = '<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"> '
    a.href = '#'
    a.textContent = 'Watch'

    a.addEventListener('click', (e) => {
      e.preventDefault()
      if (window.selected_tagname) {
        addWatchTag(window.selected_tagname)
          .then(() => {
            alert('success')
          })
          .catch((error) => {
            console.error(error)
            alert(error.message)
          })
      }
    })
  }

  const ob = new MutationObserver(() => {
    if (node.style.display !== 'none') {
      inject()
    }
  })
  ob.observe(node, { attributes: true })
}

function addTitleCopyEvent() {
  $$<HTMLDivElement>('#gd2>*').forEach(function (node) {
    node.addEventListener('click', function () {
      if (this.textContent) copy(this.textContent)
    })
  })
}
export async function setup() {
  injectWatchTag()
  addTitleCopyEvent()

  const info = getPageInfo()
  $('body').classList.add('e-hentai-infinite-scroll', 'g')

  if (!info.unloadPageLinks.length) return

  if (info.unloadPageLinks.length > 2) {
    largeGallery()
  } else {
    tinyGallery()
  }
}
