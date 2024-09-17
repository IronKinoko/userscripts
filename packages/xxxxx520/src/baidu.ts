import { waitDOM } from 'shared'

export default async function main() {
  const url = new URL(window.location.href)
  const pwd = url.searchParams.get('pwd')
  if (!pwd) return

  const btn = await waitDOM<HTMLDialogElement>('#submitBtn')
  btn.click()
}
