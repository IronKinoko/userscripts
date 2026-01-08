import { router } from 'shared'

router({
  domain: 'c.pc.qq.com',
  routes: [{ run: qqRedirect }],
})

function qqRedirect() {
  const url = new URL(window.location.href)

  if (url.pathname === '/middlem.html') {
    const target = url.searchParams.get('pfurl')
    if (target) window.location.replace(target)
  }

  if (url.pathname === '/ios.html') {
    const target = url.searchParams.get('url')
    if (target) window.location.replace(target)
  }
}
