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
  }
}

let isLoading = false
async function loadNextPage(info: Info) {
  if (isLoading) return

  let url = info.unloadPageLinks.shift()
  if (url) {
    isLoading = true
    const html = await fetch(url).then((r) => r.text())
    isLoading = false

    const doc = new DOMParser().parseFromString(html, 'text/html')
    $('#gdt').append(...doc.querySelector('#gdt')!.childNodes)
  }
}

export default async function setup() {
  const info = getPageInfo()

  if (!info.unloadPageLinks.length) return

  document.addEventListener('scroll', () => {
    const dom = document.scrollingElement!

    if (
      $('#cdiv').getBoundingClientRect().y <=
      dom.scrollTop + dom.clientHeight + 2000
    ) {
      loadNextPage(info)
    }
  })
}

if (/\/g\/.*\/.*/.test(window.location.pathname)) {
  setup()
}
