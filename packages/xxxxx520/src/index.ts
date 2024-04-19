import { session } from 'shared'

autoCompletePassowrd()
moveDownloadToTop()
baiduCloudLinkAutoComplete()
modifyAnchorTarget()
enhanceDownloadLink()

function autoCompletePassowrd() {
  const $pwd = $('[name="post_password"]')
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

  complete()
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

function enhanceDownloadLink() {
  const $dom = $('.go-down')
  const id = $dom.attr('data-id')

  $dom.attr('href', `/go/?post_id=${id}`)
  $dom[0].addEventListener('click', (e) => e.stopPropagation(), {
    capture: true,
  })
}
