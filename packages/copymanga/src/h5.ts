import { getChapterInfo } from './utils'
import { execInUnsafeWindow, local, sleep, throttle, waitDOM } from 'shared'
import T from './h5.template.html'

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

function getCurrentPage() {
  const scrollHeight = document.scrollingElement!.scrollTop
  const list = document.querySelectorAll('li.comicContentPopupImageItem')
  let height = 0
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    height += item.getBoundingClientRect().height
    if (height > scrollHeight) {
      return i
    }
  }
  return 0
}
async function updatePageIndicator() {
  try {
    if (!/h5\/comicContent\/.*/.test(location.href)) return
    const list = document.querySelectorAll('li.comicContentPopupImageItem')
    const currentPage = getCurrentPage()
    const dom = document.querySelector('.comicContentPopup .comicFixed')!
    dom.textContent = `${currentPage + 1}/${list.length}`
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
            ;(nav.children.item(itemIdx) as HTMLDivElement)?.click()
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

    createActionsUI()
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function createActionsUI() {
  let actionsDom = document.querySelector<HTMLDivElement>('.k-actions')

  if (!actionsDom) {
    actionsDom = $(T.Actions)[0] as HTMLDivElement
    document.body.appendChild(actionsDom)
    addDragEvent(actionsDom)
    intiNextPartEvent()
    initSplitEvent()
    initMergeEvent()
  }

  if (!/h5\/comicContent\/.*/.test(location.href)) {
    actionsDom?.classList.add('hide')
    return
  } else {
    actionsDom.classList.remove('hide')
    $('.k-icon').removeClass('active')
  }
}

async function initSplitEvent() {
  $('.k-split').on('click', (e) => {
    const isActive = e.currentTarget.classList.toggle('active')
    const list = $('[data-k]')
    const currentPage = getCurrentPage()
    for (const item of list) {
      item.style.overflowX = 'hidden'
      const imgs = $(item).find('[data-img-lazy]')
      if (isActive) {
        const url = imgs.attr('src')!

        imgs.last().css({
          clipPath: 'polygon(50% 0%, 50% 100%, 0% 100%, 0% 0%)',
          width: '200%',
          display: 'block',
        })
        $('<img data-img-lazy loading="lazy"/>')
          .attr('src', url)
          .css({
            clipPath: 'polygon(100% 0%, 100% 100%, 50% 100%, 50% 0%)',
            width: '200%',
            display: 'block',
            transform: 'translateX(-50%)',
          })
          .prependTo(item)
      } else {
        imgs.last().removeAttr('style')
        imgs.first().remove()
      }
    }

    // reset scroll position
    $(`[data-idx="${currentPage}"]`).get(0)?.scrollIntoView()
  })
}

async function initMergeEvent() {
  let activeArr: HTMLLIElement[] = []

  function run(e: Event) {
    e.stopPropagation()
    e.stopImmediatePropagation()
    const li = e.currentTarget as HTMLLIElement
    const isActive = li.classList.toggle('merge-active')
    if (isActive) {
      activeArr.push(li)
    } else {
      activeArr = activeArr.filter((item) => item !== li)
    }

    if (activeArr.length === 2) {
      const [first, second] = activeArr
      $(second).find('[data-img-lazy]').prependTo($(first))
      $(first).css({ display: 'flex' })
      $(first).find('[data-img-lazy]').css({ width: '50%' })

      cleanup()
      $('.k-merge').removeClass('active')
    }
  }

  function setup() {
    document.querySelectorAll('[data-k]').forEach((item) => {
      item.addEventListener('click', run, { capture: true })
    })
  }

  function cleanup() {
    activeArr = []
    document.querySelectorAll('[data-k]').forEach((item) => {
      item.removeEventListener('click', run, { capture: true })
      item.classList.remove('merge-active')
    })
  }

  $('.k-merge').on('click', (e) => {
    const isActive = e.currentTarget.classList.toggle('active')

    cleanup()

    if (isActive) {
      setup()
    }
  })
}

async function intiNextPartEvent() {
  let fixedNextBtn = document.querySelector<HTMLDivElement>('.k-next')!
  fixedNextBtn.onclick = async (e) => {
    e.stopPropagation()
    let nextButton = document.querySelector<HTMLSpanElement>(
      '.comicControlBottomTop > div:nth-child(3) > span'
    )
    if (!nextButton) {
      await openControl()
      nextButton = document.querySelector(
        '.comicControlBottomTop > div:nth-child(3) > span'
      )
    }

    if (nextButton?.parentElement?.classList.contains('noneUuid')) {
      const comicHomeBtn = document.querySelector<HTMLDivElement>(
        '.comicControlBottomBottom > .comicControlBottomBottomItem:nth-child(1)'
      )
      comicHomeBtn?.click()
    } else {
      nextButton?.click()
    }
    document.scrollingElement!.scrollTop = 0
  }
}

function addDragEvent(fxiedDom: HTMLDivElement) {
  let prevY = 0
  let storeY = 0
  const key = 'next-part-btn-fixed-position'
  let position = local.getItem(key, {
    top: document.documentElement.clientHeight / 4,
    left: document.documentElement.clientWidth,
  })

  const size = fxiedDom!.getBoundingClientRect()
  // safe position area
  const safeArea = {
    top: (y: number) =>
      Math.min(
        Math.max(y, 0),
        document.documentElement.clientHeight - size.height
      ),
    left: (x: number) =>
      Math.min(
        Math.max(x, 0),
        document.documentElement.clientWidth - size.width
      ),
  }

  // set fixedNextBtn position
  const setPosition = (
    position: { left: number; top: number },
    isMoving: boolean
  ) => {
    fxiedDom!.classList.remove('left', 'right')
    fxiedDom!.style.transition = isMoving ? 'none' : ''
    fxiedDom!.style.top = `${position.top}px`
    fxiedDom!.style.left = `${position.left}px`

    if (!isMoving) {
      const halfScreenWidth = document.documentElement.clientWidth / 2
      fxiedDom!.classList.add(
        position.left > halfScreenWidth ? 'right' : 'left'
      )
      fxiedDom!.style.left =
        position.left > halfScreenWidth
          ? `${document.documentElement.clientWidth - size.width}px`
          : '0px'
    }
  }

  setPosition(position, false)

  // remember fixedNextBtn move position
  fxiedDom.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]
    const { clientX, clientY } = touch
    const { top, left } = fxiedDom!.getBoundingClientRect()
    const diffX = clientX - left
    const diffY = clientY - top
    const move = (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      const { clientX, clientY } = touch
      const x = safeArea.left(clientX - diffX)
      const y = safeArea.top(clientY - diffY)
      position = { top: y, left: x }
      setPosition(position, true)
    }
    const end = () => {
      local.setItem(key, position)
      setPosition(position, false)
      fxiedDom!.style.removeProperty('transition')
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', end)
    }
    window.addEventListener('touchmove', move, { passive: false })
    window.addEventListener('touchend', end)
  })

  window.addEventListener(
    'scroll',
    throttle(() => {
      if (!/h5\/comicContent\/.*/.test(location.href)) {
        fxiedDom?.classList.add('hide')
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
        fxiedDom?.classList.remove('hide')
      } else {
        fxiedDom?.classList.add('hide')
      }

      if (currentY > prevY) {
        storeY = currentY
      }
      prevY = currentY
    }, 100)
  )
}

function getComicId() {
  const [, uuid] = location.href.match(/h5\/comicContent\/.*\/(.*)/)!
  return uuid
}

async function addH5HistoryListener() {
  execInUnsafeWindow(() => {
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

    history.pushState = _historyWrap('pushState')
    history.replaceState = _historyWrap('replaceState')
  })

  window.addEventListener('pushState', runH5main)
  window.addEventListener('replaceState', runH5main)
  window.addEventListener('popstate', runH5main)
  window.addEventListener('scroll', throttle(updatePageIndicator, 100))

  runH5main()
}

async function injectImageData() {
  $('.comicContentPopup .comicFixed').addClass('loading')
  const info = await getChapterInfo()

  $('.comicContentPopup .comicFixed').removeClass('loading')

  let html = ''
  info.manga.forEach(({ url }, idx) => {
    html += `
    <li class="comicContentPopupImageItem" data-k data-idx="${idx}">
      <img src="${url}" data-img-lazy loading="lazy" />
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
  updatePageIndicator()
}

export default function () {
  addH5HistoryListener()
}
