import { session } from 'shared'

export function detail() {
  autoCompletePassowrd()
  moveDownloadToTop()
  enhanceDownload()
  baiduCloudLinkAutoComplete()
  modifyAnchorTarget()
}

function autoCompletePassowrd() {
  const $pwd = $('#password')
  if (!$pwd.length || session.getItem('is-auto-complete')) return
  const $submit = $('input[name=Submit]')

  const pwdSource = [$('.entry-title').text(), $('form>p').text()]
  const re = /密码保护(?:：|:)(\w+)/
  const pwd = pwdSource.map((s) => s.match(re)?.[1]).find((s) => s)
  if (!pwd) return

  session.setItem('is-auto-complete', true)
  $pwd.val(pwd)
  $submit[0].click()
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
  function complete() {
    const $root = $('article .entry-content')

    let panEl: HTMLParagraphElement | null = null
    $root.find('p').each((i, el) => {
      if (el.innerText.match(/pan\.baidu\.com/)) {
        panEl = el
      }
      if (el.innerText.match('提取码') && panEl) {
        const match = panEl.innerText.match(/https:\/\/pan.baidu.com\/s\/\S+/)
        if (!match) return

        const link = match[0]
        const url = new URL(link)
        if (url.searchParams.has('pwd')) return
        const pwd = el.innerText.match(/提取码[:：]\s?(\w{4})/)?.[1]
        if (!pwd) return

        url.searchParams.set('pwd', pwd)
        panEl.innerHTML = panEl.innerHTML.replaceAll(link, url.toString())
        panEl = null
      }
    })
  }

  new MutationObserver(complete).observe(document.body, {
    subtree: true,
    childList: true,
  })
}

function modifyAnchorTarget() {
  $<HTMLAnchorElement>('article .entry-content a').each((i, el) => {
    el.target = '_blank'
  })
}
