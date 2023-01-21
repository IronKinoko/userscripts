import { local, waitDOM } from 'shared'

const TypeItemPrefix = 'k-zelda-map'

main()
async function main() {
  const $type = $(await waitDOM('#TypeSwitch'))

  $type.find(':contains(多选)').trigger('click')

  const $items = $type.find('li[data-type]')

  const state = getState()
  $items.each((idx, dom) => {
    const checked = state[idx] ?? false
    $(dom).data({ idx, checked })
    if (state[idx]) {
      $(dom).trigger('click')
    }
  })

  $items.on('click', (e) => {
    const $dom = $(e.currentTarget)

    const { idx, checked } = $dom.data()

    setState(idx, !checked)
    $dom.data({ idx, checked: !checked })
  })
}

function setState(idx: number, checked: boolean) {
  const state = getState()

  local.setItem(TypeItemPrefix, { ...state, [idx]: checked })
}
function getState() {
  const state = local.getItem(TypeItemPrefix, {}) as Record<string, boolean>
  return state
}
