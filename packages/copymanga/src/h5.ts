import { addErrorListener, getFullImages } from './utils'
import { sleep, throttle, waitDOM } from 'shared'

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
    await openControl()
    await injectImageData()
    injectFixImg()

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

    let prevPosition = 0
    window.addEventListener(
      'scroll',
      throttle(() => {
        if (!/h5\/comicContent\/.*/.test(location.href)) {
          fixedNextBtn?.classList.add('hide')
          return
        }

        const dom = document.scrollingElement!

        if (
          dom.scrollTop < 50 ||
          dom.scrollTop + dom.clientHeight > dom.scrollHeight - 800 ||
          dom.scrollTop < prevPosition
        ) {
          fixedNextBtn?.classList.remove('hide')
        } else {
          fixedNextBtn?.classList.add('hide')
        }
        prevPosition = dom.scrollTop
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
      <img src="${url}" />
    </li>
    `
  })

  await waitDOM('.comicContentPopupImageList .comicContentPopupImageItem')
  $('.comicContentPopupImageItem').remove()

  $('.comicContentPopupImageList').prepend(html)
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
