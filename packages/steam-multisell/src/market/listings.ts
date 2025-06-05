export function run() {
  createMultisellButton()
}

function createMultisellButton() {
  const button = document.createElement('a')
  button.className = 'btn_green_white_innerfade'
  button.style.float = 'right'
  button.textContent = '批量出售'
  button.target = '_blank'
  const [id, item] = extractLastSegment(window.location.pathname)
  const steamUrl = `https://steamcommunity.com/market/multisell?appid=${id}&contextid=2&items[]=${item}`

  button.href = steamUrl

  document
    .querySelector('#tabContentsMyActiveMarketListingsTable > h3')!
    .appendChild(button)

  function extractLastSegment(url: string) {
    const parts = url.split('/').filter(Boolean)
    return parts.slice(-2)
  }
}
