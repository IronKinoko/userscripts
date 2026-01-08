import { router, waitDOM } from 'shared'

router({
  domain: 'pan.baidu.com',
  routes: [{ path: '/share/init', run: autoSubmit }],
})

async function autoSubmit() {
  const url = new URL(window.location.href)
  const pwd = url.searchParams.get('pwd')
  if (!pwd) return

  const btn = await waitDOM<HTMLDialogElement>('#submitBtn')
  btn.click()
}
