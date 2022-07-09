import { addErrorListener, sleep, waitDOM } from './utils'

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

/**
 * @param {Event} e
 */
async function currentPage() {
  try {
    if (!/h5\/comicContent\/.*/.test(location.href)) return
    const scrollHeight = document.scrollingElement.scrollTop
    const list = await waitHasComicContent()
    let height = 0
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      height += item.getBoundingClientRect().height
      if (height > scrollHeight) {
        const dom = document.querySelector('.comicContentPopup .comicFixed')
        dom.textContent = dom.textContent.replace(/(.*)\//, `${i + 1}/`)
        break
      }
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

async function runH5main() {
  try {
    if (!/h5\/comicContent\/.*/.test(location.href)) return
    const ulDom = await waitDOM('.comicContentPopupImageList')
    const uuid = getComicId()
    const domUUID = ulDom.dataset.uuid
    if (domUUID !== uuid) {
      ulDom.dataset.uuid = uuid
    }

    injectFixImg()

    const main = ulDom.parentElement
    main.style.position = 'unset'
    main.style.overflowY = 'unset'

    let nextPartDom = document.querySelector('#comicContentMain #nextpart')
    let nextButton = document.querySelector(
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
      nextPartDom.style.textAlign = 'center'
      nextPartDom.style.lineHeight = '50px'
      nextPartDom.style.fontSize = '16px'
      nextPartDom.style.paddingBottom = '100px'
      nextPartDom.textContent = '下一话'
      nextPartDom.id = 'nextpart'

      nextPartDom.onclick = async (e) => {
        e.stopPropagation()
        nextButton && nextButton.click()
        document.scrollingElement.scrollTop = 0
      }

      document.getElementById('comicContentMain').appendChild(nextPartDom)
    }
    nextPartDom.style.display = nextButton.parentElement.classList.contains(
      'noneUuid'
    )
      ? 'none'
      : 'block'
  } catch (error) {
    console.error(error)
  }
}

function getComicId() {
  const [, uuid] = location.href.match(/h5\/comicContent\/.*\/(.*)/)
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

const _historyWrap = function (type) {
  const orig = history[type]
  const e = new Event(type)
  return function () {
    const rv = orig.apply(this, arguments)
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}

async function injectFixImg() {
  const listDOM = await waitDOM('.comicContentPopupImageList')

  async function injectEvent() {
    const imgs = document.querySelectorAll('ul li img')
    imgs.forEach(addErrorListener)
  }

  const ob = new MutationObserver(injectEvent)
  ob.observe(listDOM, { childList: true, subtree: true })
  injectEvent()
}

export default function () {
  addH5HistoryListener()
}
