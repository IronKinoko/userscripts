import { addErrorListener, s2d } from './utils'
import { keybind, wait, waitDOM } from 'shared'

function replaceHeader() {
  const header = document.querySelector<HTMLDivElement>(
    '.container.header-log .row'
  )
  if (header) {
    header.style.flexWrap = 'nowrap'
    header.querySelector('div:nth-child(6)')!.replaceWith(
      s2d(
        `<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/shujia">我的书架</a>
            <div class="log-unboder"></div>
          </div>
        </div>`
      )
    )
    header.querySelector('div:nth-child(7)')!.replaceWith(
      s2d(
        `<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/liulan">我的浏览</a>
            <div class="log-unboder"></div>
          </div>
        </div>`
      )
    )

    header.querySelector('div:nth-child(8)')!.className = 'col'
    header.querySelector<HTMLDivElement>(
      'div.col > div > div'
    )!.style.justifyContent = 'flex-end'
  }
}

async function injectFixImg() {
  const listDOM = await waitDOM('ul.comicContent-list')

  async function injectEvent() {
    const imgs = document.querySelectorAll<HTMLImageElement>('ul li img')
    imgs.forEach(addErrorListener)
  }

  const ob = new MutationObserver(injectEvent)
  ob.observe(listDOM, { childList: true, subtree: true })
  injectEvent()
}

async function injectFastLoadImg() {
  const $list = await waitDOM('.comicContent-list')

  function fastLoad() {
    const $imgs = $list.querySelectorAll<HTMLImageElement>('li img')
    $imgs.forEach(($img) => {
      if ($img.dataset.fastLoad === 'true') return
      $img.dataset.fastLoad = 'true'
      $img.src = $img.dataset.src!
    })
  }

  const ob = new MutationObserver(fastLoad)
  ob.observe($list, { childList: true, subtree: true })
}

async function removeMouseupEvent() {
  await wait(() => !!document.body.onmouseup)

  document.body.onmouseup = null
}

async function injectEvent() {
  keybind(['z', 'x'], (e, key) => {
    switch (key) {
      case 'z': {
        document
          .querySelector<HTMLAnchorElement>(`[class='comicContent-prev'] a`)
          ?.click()
        break
      }
      case 'x': {
        document
          .querySelector<HTMLAnchorElement>(`[class='comicContent-next'] a`)
          ?.click()
        break
      }
    }
  })
}

export default function () {
  if (/comic\/.*\/chapter/.test(location.href)) {
    injectFixImg()
    injectFastLoadImg()
    removeMouseupEvent()
    injectEvent()
  }

  replaceHeader()
}
