import { sleep } from 'shared'

export function run() {
  createMultisellButton()
  createMultiCancelButton()
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

function createMultiCancelButton() {
  const button = document.createElement('a')
  button.className = 'btn_green_white_innerfade'
  button.style.float = 'right'
  button.style.marginRight = '8px'
  button.textContent = '批量取消'
  button.target = '_blank'

  const sessionid = window.g_sessionID

  const cancel = async (id: string) => {
    await fetch(`https://steamcommunity.com/market/removelisting/${id}`, {
      body: new URLSearchParams({ sessionid }),
      method: 'POST',
    })

    document.getElementById(`mylisting_${id}`)?.remove()

    const countEl = document.getElementById('my_market_selllistings_number')
    if (countEl) {
      const count = parseInt(countEl.textContent || '0', 10) - 1
      countEl.textContent = count.toString()
    }
  }

  document
    .querySelector('#tabContentsMyActiveMarketListingsTable > h3')!
    .appendChild(button)

  const list = Array.from(
    document.querySelectorAll(
      '#tabContentsMyActiveMarketListingsRows .market_listing_row'
    )
  )

  let ids: string[] = []
  list.forEach((item) => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.style.margin = '0px'
    checkbox.style.verticalAlign = '-0.125em'
    checkbox.className = 'multicancel_checkbox'

    const nameBlock = item.querySelector('.market_listing_item_name_block')!
    nameBlock.prepend(checkbox)

    nameBlock.addEventListener(
      'click',
      (e) => {
        e.stopPropagation()
        e.preventDefault()
        checkbox.checked = !checkbox.checked
        const id = getId(item)!
        if (checkbox.checked) {
          ids.push(id)
        } else {
          ids = ids.filter((item) => item !== id)
        }
      },
      { capture: true }
    )
  })

  let lock = false
  button.addEventListener('click', async () => {
    if (lock) return
    lock = true

    for (let i = 0, size = 3; i < ids.length; i += size) {
      const chunk = ids.slice(i, i + size)
      await Promise.all(chunk.map(cancel))
      await sleep(200)
    }
    window.location.reload()
  })

  document
    .querySelector('.my_market_header_active')
    ?.addEventListener('click', () => {
      const allIds = list.map(getId)
      const allInputs = document.querySelectorAll<HTMLInputElement>(
        '.multicancel_checkbox'
      )
      const nextChecked = allIds.length !== ids.length

      allInputs.forEach((input) => {
        input.checked = nextChecked
      })
      ids = nextChecked ? allIds : []
    })

  function getId(dom: Element) {
    const match = dom.id.match(/mylisting_(\d+)/)
    if (!match) throw new Error('Cannot find listing id')
    return match[1]
  }
}
