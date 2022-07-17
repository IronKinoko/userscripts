import { session, debounce } from 'shared'

const $ = <T extends Element = Element>(selector: string) =>
  document.querySelector<T>(selector)!
const $$ = <T extends Element = Element>(selector: string) =>
  document.querySelectorAll<T>(selector)!

interface Info {
  rows: number
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
  const rows = +$('#gdo2 .ths').textContent!.replace(' rows', '')
  const mode = $('#gdo4 .ths').textContent!.toLowerCase() as Info['mode']
  const pageSize = (mode === 'normal' ? 10 : 5) * rows
  const total = +$('.gtb p.gpc').textContent!.match(
    /of\s(?<total>\d+)\simages/
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
    rows,
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
async function loadNextPage(info: Info) {
  if (isLoading) return

  let url = info.unloadPageLinks.shift()
  if (url) {
    isLoading = true
    const items = await fetchNextDom(url, info)
    isLoading = false

    if (items) {
      createPageIndex(info.currentPage)
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
export default async function setup() {
  const info = getPageInfo()

  if (!info.unloadPageLinks.length) return

  $('body').classList.add('e-hentai-infinite-scroll')
  $('#gdt').classList.add('g-scroll-body')
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
      loadNextPage(info)
    }

    replaceCurrentURL()
  }
  handleScroll()
  $('#gdt').addEventListener('scroll', handleScroll)
}

if (/\/g\/.*\/.*/.test(window.location.pathname)) {
  setup()
}
