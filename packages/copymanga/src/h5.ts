import { addErrorListener } from './utils'
import { sleep, waitDOM } from 'shared'

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
    const list = await waitHasComicContent()
    let height = 0
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      height += item.getBoundingClientRect().height
      if (height > scrollHeight) {
        const dom = document.querySelector('.comicContentPopup .comicFixed')!
        dom.textContent = dom.textContent!.replace(/(.*)\//, `${i + 1}/`)
        break
      }
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

let trackId = { current: 0 }
async function runH5main() {
  try {
    if (!/h5\/comicContent\/.*/.test(location.href)) return
    let runTrackId = ++trackId.current
    const ulDom = await waitDOM<HTMLUListElement>('.comicContentPopupImageList')
    if (runTrackId !== trackId.current) return

    const uuid = getComicId()
    const domUUID = ulDom.dataset.uuid
    if (domUUID !== uuid) {
      ulDom.dataset.uuid = uuid
    }

    injectFixImg()
    injectFastLoadImg()

    const main = ulDom.parentElement!
    main.style.position = 'unset'
    main.style.overflowY = 'unset'

    createNextPartDom()
  } catch (error) {
    throw error
  }
}

let ob: IntersectionObserver
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
    fixedNextBtn.onclick = nextPartDom.onclick
    document.body.appendChild(fixedNextBtn)

    ob = new IntersectionObserver(
      (e) => {
        console.log(e)
        if (e[0].isIntersecting) fixedNextBtn?.classList.remove('hide')
        else fixedNextBtn?.classList.add('hide')
      },
      { threshold: [0, 1], rootMargin: '0px 0px 1000px 0px' }
    )
  }

  ob.observe(nextPartDom)

  fixedNextBtn.style.display = nextPartDom.style.display
}

function getComicId() {
  const [, uuid] = location.href.match(/h5\/comicContent\/.*\/(.*)/)!
  return uuid
}

async function waitHasComicContent() {
  return document.querySelectorAll('.comicContentPopupImageItem')
}

async function addH5HistoryListener() {
  history.pushState = _historyWrap('pushState')
  history.replaceState = _historyWrap('replaceState')

  window.addEventListener('pushState', runH5main)
  window.addEventListener('replaceState', runH5main)
  window.addEventListener('popstate', runH5main)
  window.addEventListener('scroll', currentPage)

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

async function injectFixImg() {
  const listDOM = await waitDOM('.comicContentPopupImageList')

  async function injectEvent() {
    const imgs = document.querySelectorAll<HTMLImageElement>('ul li img')
    imgs.forEach(addErrorListener)
  }

  const ob = new MutationObserver(injectEvent)
  ob.observe(listDOM, { childList: true, subtree: true })
  injectEvent()
}

async function injectFastLoadImg() {
  const $list = await waitDOM('.comicContentPopupImageList')

  function fastLoad() {
    const $imgs = document.querySelectorAll<HTMLImageElement>('ul li img')

    $imgs.forEach(($img) => {
      if ($img.dataset.fastLoad === $img.dataset.src) return
      $img.dataset.fastLoad = $img.dataset.src
      $img.src = $img.dataset.src!
    })
  }

  const ob = new MutationObserver(fastLoad)
  ob.observe($list, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-src'],
  })
}

export default function () {
  addH5HistoryListener()
}
