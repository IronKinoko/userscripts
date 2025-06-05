import { waitDOM } from 'shared'

export function setup() {
  hookXHR()
}
export function run() {
  autoMaxCount()
}

function hookXHR() {
  const originalOpen = XMLHttpRequest.prototype.open
  // @ts-ignore
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    if (url.toString().includes('/inventory/')) {
      const tmp = new URL(url.toString())
      tmp.searchParams.set('count', '1000')
      url = tmp.toString()
    }

    return originalOpen.apply(this, [method, url, ...args] as any)
  }
}

async function autoMaxCount() {
  const table = await waitDOM('.market_multi_table')
  if (!table) return
  const rows = Array.from(table.querySelectorAll('tbody tr'))

  rows.forEach((row) => {
    const [td1, td2] = row.children

    const input = td1.querySelector<HTMLInputElement>('input[type="number"]')!
    const maxCount = td2.querySelector('.market_multi_qtyown span')!
      .textContent!

    input.value = maxCount
  })
}
