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

  cache = [{ href, imgs }]

  updateClipboard(likeDom)
}

async function makeWaterMark() {
  const lastItem = cache[cache.length - 1]
  const lastImg = lastItem.imgs[lastItem.imgs.length - 1]
  const blob = await fetch(lastImg).then((res) => res.blob())

  const author = '@' + new URL(lastItem.href).pathname.split('/')[1]

  const img = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(blob)
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  ctx.drawImage(img, 0, 0)

  const fontSize = Math.max(16, canvas.width / 40)
  ctx.font = `${fontSize}px sans-serif`

  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.shadowColor = 'black'
  ctx.shadowBlur = 4
  ctx.fillText(
    author,
    canvas.width - ctx.measureText(author).width - 16,
    canvas.height - 16
  )
  ctx.restore()

  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.fillText(
    author,
    canvas.width - ctx.measureText(author).width - 16,
    canvas.height - 16
  )
  ctx.restore()

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!))
  })
}

function toast(target: HTMLElement, text: string) {
  const dom = document.createElement('div')
  dom.textContent = text
  dom.style.cssText = `position:absolute;left:50%;bottom:100%;z-index:100;
  transform:translateX(-50%);
  border-radius:2px;padding:4px;
  background:rgba(0,0,0,0.60);width:max-content;
  color:white;font-size:11px;line-height:12px;`
  target.appendChild(dom)
  target.style.position = 'relative'

  setTimeout(() => {
    dom.remove()
  }, 1000)
}

async function updateClipboard(likeDom: HTMLElement) {
  if (!cache.length) return

  const blob = await makeWaterMark()

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/plain': new Blob(['请粘贴到支持富文本的地方'], {
          type: 'text/plain',
        }),
        [blob.type]: blob,
      }),
    ])

    toast(likeDom, '已复制')
  } catch (err: any) {
    console.error(err)
    toast(likeDom, `复制失败:${err.message}`)
  }
}
