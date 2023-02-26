import { waitDOM } from 'shared'

type Payload =
  | { type: 'focus'; id: string; top: number }
  | { type: 'blur'; id: string }
  | { type: 'jump'; href: string }

export default async function main() {
  let channel = new BroadcastChannel('kakuyomu-translate')

  $('.widget-episodeBody')
    .children()
    .each((i, dom) => {
      const id = dom.id
      dom.addEventListener('mouseenter', () => {
        const top = dom.getBoundingClientRect().top

        channel.postMessage({ type: 'focus', id, top })
      })
      dom.addEventListener('mouseleave', () => {
        channel.postMessage({ type: 'blur', id })
      })
    })

  $('#contentMain-nextEpisode a, #contentMain-previousEpisode a').on(
    'click',
    (e) => {
      channel.postMessage({
        type: 'jump',
        href: e.currentTarget.getAttribute('href'),
      })
    }
  )

  handleMessage(channel)
}

async function handleMessage(channel: BroadcastChannel) {
  channel.addEventListener('message', (e) => {
    const data: Payload = e.data

    if (data.type === 'focus') {
      const dom = document.getElementById(data.id)!
      const rect = dom.getBoundingClientRect()
      window.scrollBy({ top: rect.y - data.top, behavior: 'smooth' })
    }

    if (data.type === 'jump') {
      window.location.href = data.href
    }
  })
}
