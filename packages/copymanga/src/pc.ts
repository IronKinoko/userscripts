import { addErrorListener, s2d, waitDOM } from './utils'

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

export default function () {
  if (/comic\/.*\/chapter/.test(location.href)) {
    injectFixImg()
  }

  replaceHeader()
}
