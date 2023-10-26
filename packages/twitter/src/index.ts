window.addEventListener('click', handleClick, { capture: true })
window.addEventListener('blur', () => (cache = []))

function handleClick(e: MouseEvent) {
  handleLike(e)
}

function queryParent<T = HTMLElement>(
  dom: HTMLElement | null,
  selector: string
) {
  let target: HTMLElement | null = dom
  while (target) {
    if (target.matches(selector)) break
    target = target.parentElement
  }
  return target as T | null
}

let cache: { imgs: string[]; href: string }[] = []
function handleLike(e: MouseEvent) {
  const likeDom = queryParent(e.target as HTMLElement, '[data-testid="like"]')
  if (!likeDom) return

  const tweet = queryParent<HTMLDivElement>(likeDom, '[data-testid="tweet"]')
  if (!tweet) return

  const photos = Array.from(
    tweet.querySelectorAll<HTMLDivElement>('[data-testid="tweetPhoto"]')
  )
  if (!photos.length) return

  const imgs = photos.map((photo) => {
    const src = new URL(photo.querySelector('img')!.src)
    src.searchParams.set('name', 'orig')
    return src.toString()
  })

  let href = queryParent<HTMLAnchorElement>(photos[0], 'a')?.href
  if (!href) href = window.location.href
  href = href.replace(/\/photo\/.*$/, '').replace('twitter.com', 'x.com')

  if (cache.some((item) => item.href === href)) return
  cache.push({ href, imgs })

  updateClipboard()
}

function updateClipboard() {
  if (!cache.length) return

  const html =
    '<meta charset="UTF-8" />' +
    cache
      .map(({ href, imgs }) => {
        return (
          imgs.map((img) => `<img src="${img}">`).join('') +
          `<br/><a href="${href}">${href}</a>`
        )
      })
      .join('<br/><br/>')

  navigator.clipboard
    .write([
      new ClipboardItem({
        'text/plain': new Blob(['请粘贴到支持富文本的地方'], {
          type: 'text/plain',
        }),
        'text/html': new Blob([html], { type: 'text/html' }),
      }),
    ])
    .catch((err) => {
      console.error(err)
    })
}
