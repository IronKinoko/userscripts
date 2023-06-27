import { getFullImages } from './utils'
import { local, sleep, throttle, waitDOM } from 'shared'

async function openControl() {
  const li = await waitDOM('li.comicContentPopupImageItem')
  li.dispatchEvent(fakeClickEvent())
  await sleep(0)
  li.dispatchEvent(fakeClickEvent())
}
function fakeClickEvent() {
  const { width, height } = document.body.getBoundingClientRect()
  return new MouseEvent('click', { clientX: width / 2, clientY: height / 2 })
}

async function currentPage() {
  try {
    if (!/h5\/comicContent\/.*/.test(location.href)) return
    const scrollHeight = document.scrollingElement!.scrollTop
    const list = document.querySelectorAll('li.comicContentPopupImageItem')
    let height = 0
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      height += item.getBoundingClientRect().height
      if (height > scrollHeight) {
        const dom = document.querySelector('.comicContentPopup .comicFixed')!
        dom.textContent = `${i + 1}/${list.length}`
        break
      }
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

async function restoreTabIdx() {
  if (!/h5\/details\/comic\/.*/.test(location.pathname)) return
  const LocalKey = 'k-copymanga-tab-store'
  const [, id] = location.pathname.match(/h5\/details\/comic\/(.*)/)!
  const store = local.getItem<Record<string, number[]>>(LocalKey, {})

  await waitDOM(
    '.detailsTextContentTabs.van-tabs.van-tabs--line .van-tab:nth-child(2).van-tab--active'
  )
  const root = await waitDOM('.van-tabs')
  ;(async () => {
    const prevActiveIdx = store[id]
    if (prevActiveIdx) {
      const [navIdx, itemIdx] = prevActiveIdx
      if (navIdx) {
        const nav = await waitDOM<HTMLDivElement>('.van-tabs__nav')
        ;(nav.children.item(navIdx) as HTMLDivElement)?.click()

        if (itemIdx) {
          const nav = await waitDOM<HTMLDivElement>(
            `.van-tabs__content div:nth-child(${navIdx + 1}) .van-tabs__nav`
          )
          if (nav) {
            ;(nav.children.item(navIdx) as HTMLDivElement)?.click()
          }
        }
      }
    }
  })()

  function getActiveIdx() {
    let idx: number[] = []
    const list = root.querySelectorAll('.van-tabs__nav')
    list.forEach((nav, navIdx) => {
      Array.from(nav.children).forEach((item, itemIdx) => {
        if (item.classList.contains('van-tab--active')) {
          idx[navIdx] = itemIdx
        }
      })
    })

    return idx
  }

  const ob = new MutationObserver(() => {
    const idx = getActiveIdx()
    store[id] = idx
    local.setItem(LocalKey, store)
  })
  ob.observe(root, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  })
}

let trackId = { current: 0 }
async function runH5main() {
  try {
    restoreTabIdx()

    if (!/h5\/comicContent\/.*/.test(location.href)) return
    let runTrackId = ++trackId.current
    const ulDom = await waitDOM<HTMLUListElement>('.comicContentPopupImageList')
    if (runTrackId !== trackId.current) return

    const uuid = getComicId()
    const domUUID = ulDom.dataset.uuid
    if (domUUID !== uuid) {
      ulDom.dataset.uuid = uuid
    }
    await openControl()
    await injectImageData()

    const main = ulDom.parentElement!
    main.style.position = 'unset'
    main.style.overflowY = 'unset'

    createNextPartDom()
  } catch (error) {
    throw error
  }
}

async function createNextPartDom() {
  let nextPartDom = document.querySelector<HTMLDivElement>(
    '#comicContentMain .next-part-btn'
  )
  let nextButton = document.querySelector<HTMLSpanElement>(
    '.comicControlBottomTop > div:nth-child(3) > span'
  )
  if (!nextPartDom) {
    if (!nextButton) {
      await openControl()
      nextButton = document.querySelector(
        '.comicControlBottomTop > div:nth-child(3) > span'
      )
    }

    nextPartDom = document.createElement('div')
    nextPartDom.className = 'next-part-btn'
    nextPartDom.textContent = '下一话'

    nextPartDom.onclick = async (e) => {
      e.stopPropagation()
      nextButton && nextButton.click()
      document.scrollingElement!.scrollTop = 0
    }

    document.getElementById('comicContentMain')!.appendChild(nextPartDom)
  }
  nextPartDom.style.display = nextButton!.parentElement!.classList.contains(
    'noneUuid'
  )
    ? 'none'
    : 'block'

  let fixedNextBtn = document.querySelector<HTMLDivElement>(
    '.next-part-btn-fixed'
  )
  if (!fixedNextBtn) {
    fixedNextBtn = document.createElement('div')
    fixedNextBtn.className = 'next-part-btn-fixed'
    fixedNextBtn.textContent = '下一话'
    document.body.appendChild(fixedNextBtn)

    let prevY = 0
    let storeY = 0
    window.addEventListener(
      'scroll',
      throttle(() => {
        if (!/h5\/comicContent\/.*/.test(location.href)) {
          fixedNextBtn?.classList.add('hide')
          return
        }

        const dom = document.scrollingElement!

        const currentY = dom.scrollTop
        let diffY = currentY - storeY
        if (
          currentY < 50 ||
          currentY + dom.clientHeight > dom.scrollHeight - 800 ||
          diffY < -30
        ) {
          fixedNextBtn?.classList.remove('hide')
        } else {
          fixedNextBtn?.classList.add('hide')
        }

        if (currentY > prevY) {
          storeY = currentY
        }
        prevY = currentY
      }, 100)
    )
  }

  fixedNextBtn.onclick = nextPartDom.onclick
  fixedNextBtn.style.display = nextPartDom.style.display
}

function getComicId() {
  const [, uuid] = location.href.match(/h5\/comicContent\/.*\/(.*)/)!
  return uuid
}

async function addH5HistoryListener() {
  history.pushState = _historyWrap('pushState')
  history.replaceState = _historyWrap('replaceState')

  window.addEventListener('pushState', runH5main)
  window.addEventListener('replaceState', runH5main)
  window.addEventListener('popstate', runH5main)
  window.addEventListener('scroll', throttle(currentPage, 100))

  runH5main()
}

const _historyWrap = function (type: 'pushState' | 'replaceState') {
  const orig = history[type]
  const e = new Event(type)
  return function () {
    // @ts-ignore
    const rv = orig.apply(this, arguments)
    window.dispatchEvent(e)
    return rv
  }
}

async function injectImageData() {
  const data = await getFullImages()

  let html = ''
  data.forEach(({ url }, idx) => {
    html += `
    <li class="comicContentPopupImageItem" data-k data-idx="${idx}">
      <img-lazy src="${url}" />
    </li>
    `
  })

  await waitDOM('.comicContentPopupImageList .comicContentPopupImageItem')
  $('.comicContentPopupImageItem').attr('class', 'k-open-control-item').hide()
  $('[data-k]').remove()
  $('.comicContentPopupImageList').prepend(html)
  $('.comicContentPopupImageItem').on('click', (e) => {
    const { innerWidth, innerHeight } = window
    const x = e.clientX
    const y = e.clientY
    if (
      innerWidth / 3 < x &&
      x < (innerWidth / 3) * 2 &&
      innerHeight / 3 < y &&
      y < (innerHeight / 3) * 2
    ) {
      const li = $('.k-open-control-item').get(0)
      li?.dispatchEvent(fakeClickEvent())
    }
  })
  currentPage()
}

export default function () {
  addH5HistoryListener()
}
