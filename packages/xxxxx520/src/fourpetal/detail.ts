export function detail() {
  moveDownloadToTop()
  enhanceDownload()
  baiduCloudLinkAutoComplete()
  modifyAnchorTarget()
}

function enhanceDownload() {
  const downBtn = document.querySelector<HTMLAnchorElement>('.go-down')
  if (!downBtn) return
  downBtn.href = `${window.location.origin}/go/?post_id=${downBtn.dataset.id}`
  downBtn.addEventListener('click', (e) => e.stopPropagation(), true)
}

function moveDownloadToTop() {
  const $area = $('.sidebar-right .sidebar-column .widget-area')
  const $down = $('#cao_widget_pay-4')

  $area.prepend($down)
}

function baiduCloudLinkAutoComplete() {
  const $root = $('article .entry-content')

  let panEl: HTMLParagraphElement | null = null
  $root.find('p').each((i, el) => {
    if (el.innerText.match(/pan\.baidu\.com/)) {
      panEl = el
    }
    if (el.innerText.match(/提取码/) && panEl) {
      const match = panEl.innerText.match(/https:\/\/pan.baidu.com\/s\/\S+/)
      if (!match) return

      const link = match[0]
      const url = new URL(link)
      const pwd = el.innerText.match(/提取码[:：]\s?(\w{4})/)?.[1]
      if (!pwd) return

      url.searchParams.set('pwd', pwd)
      panEl.innerHTML = panEl.innerHTML.replaceAll(link, url.toString())
      panEl = null
    }
  })
}

function modifyAnchorTarget() {
  $<HTMLAnchorElement>('article .entry-content a').each((i, el) => {
    el.target = '_blank'
  })
}
