import { copy } from 'shared'

export function home() {
  addGlobalClickListener()
}

function addGlobalClickListener() {
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement
      if (target.matches('.js-subscribe_bangumi')) {
        e.stopPropagation()

        const bangumiId = target.getAttribute('data-bangumiid')
        const subtitlegroupId = target.getAttribute('data-subtitlegroupid')

        const rss = `https://mikanani.me/RSS/Bangumi?bangumiId=${bangumiId}&subgroupid=${subtitlegroupId}`
        copy(rss)

        target.innerHTML = 'OK'
        target.classList.add('active')
        setTimeout(() => {
          target.innerHTML = '订'
          target.classList.remove('active')
        }, 1000)
      }
    },
    { capture: true }
  )
}
