import { local, wait } from 'shared'

const LocalKey = 'k-x-mode'

window.addEventListener('click', handleClick, { capture: true })
window.addEventListener('blur', () => (cache = []))

async function createUI() {
  {
    if (document.querySelector('#k-x-mode')) return
    const doms = document.querySelectorAll('[role="navigation"] > div > span')

    for (const dom of doms) {
      if (dom.textContent?.match(/x corp/i)) {
        const switchDom =
          dom.parentNode!.previousSibling!.previousSibling!.cloneNode(
            true
          ) as HTMLAnchorElement

        switchDom.id = 'k-x-mode'

        switchDom.addEventListener('click', () => {
          const mode = local.getItem(LocalKey)
          local.setItem(LocalKey, mode === 'watermark' ? 'normal' : 'watermark')
          updateText()
        })

        const updateText = () => {
          switchDom.children[0].textContent = `M: ${
            local.getItem(LocalKey) === 'watermark' ? 'PNG' : 'HTML'
          }`
        }
        updateText()

        switchDom.removeAttribute('href')

        dom.parentNode!.parentNode!.append(switchDom)
        break
      }
    }
  }
}

const ob = new MutationObserver(createUI)
ob.observe(document.body, { childList: true, subtree: true })

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

  const tweet = queryParent<HTMLDivElement>(
    likeDom,
    '[role="dialog"]>div>div,[data-testid="tweet"]'
  )
  if (!tweet) return

  const photos = Array.from(
    tweet.querySelectorAll<HTMLDivElement>(
      '[data-testid="tweetPhoto"],[data-testid="swipe-to-dismiss"]'
    )
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

  cache.push({ href, imgs })

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
  try {
    if (local.getItem('k-x-mode') === 'watermark') {
      const blob = await makeWaterMark()

      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ])
    } else {
      let html = cache
        .map((item) => item.imgs.map((img) => `<img src="${img}" />`).join(''))
        .join('')
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
        }),
      ])
    }

    toast(likeDom, '已复制')
  } catch (err: any) {
    console.error(err)
    toast(likeDom, `复制失败:${err.message}`)
  }
}
