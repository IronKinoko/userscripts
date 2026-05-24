function queryElementByText(selector: string, text: string) {
  const elements = Array.from(document.querySelectorAll(selector))
  return elements.find((el) => el.textContent?.trim() === text)
}

export function run() {
  createMultisellButton()
}

function createMultisellButton() {
  const sellBtn = queryElementByText('button', '出售')
  if (!sellBtn) return

  const warp = document.createElement('div')
  warp.style.display = 'flex'
  warp.style.gap = '8px'

  sellBtn.parentElement?.insertBefore(warp, sellBtn)
  warp.appendChild(sellBtn)

  const anchor = document.createElement('a')
  const batchSellBtn = sellBtn.cloneNode(true) as HTMLButtonElement
  batchSellBtn.textContent = '批量出售'
  anchor.appendChild(batchSellBtn)
  warp.appendChild(anchor)

  const [id, item] = extractLastSegment()
  const steamUrl = `https://steamcommunity.com/market/multisell?appid=${id}&contextid=2&items[]=${item}`
  anchor.href = steamUrl

  function extractLastSegment() {
    const parts = window.location.pathname.split('/').filter(Boolean)
    const [appid, item] = parts.slice(-2)

    const anchor = Array.from(document.querySelectorAll('a')).find((a) => {
      const href = a.getAttribute('href')
      return (
        !!href &&
        href.includes(window.location.pathname) &&
        a.hasAttribute('style')
      )
    })

    if (!anchor?.textContent) throw new Error('Cannot find item name')
    return [appid, decodeURIComponent(anchor.textContent.trim())] as const
  }
}
