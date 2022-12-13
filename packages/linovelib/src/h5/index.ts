import { isMobile, keybind, router } from 'shared'

export default async function main() {
  router([
    { pathname: /novel\/\d+\.html/, run: injectDownload },
    { pathname: /novel\/\d+\/catalog/, run: injectDownloadSection },
  ])

  if (!window.ReadTools) return
  resetPageEvent()

  if (isMobile()) injectMovePageEvent()
  else injectShortcuts()
}

function injectDownload() {
  const bookId = window.location.pathname.match(/\d+/)![0]

  const dom = document.querySelector('.book-detail-btn .btn-group')
  console.log(dom)
  const a = document.createElement('a')
  dom?.append(a)
  a.outerHTML = `
  <li class="btn-group-cell">
    <a class="btn-normal white" href="https://www.zhidianbao.cn:8443/qs_xq_epub?bookId=${bookId}" target="_blank">Epub下载</a>
  </li>
  `
}

export interface SyncProgressEvent {
  total: number
  loaded: number
  progress: number
}
export interface SyncProgress {
  status: 'chapter' | 'asset' | 'done'
  id?: string
  chapter: SyncProgressEvent
  asset: SyncProgressEvent
}

type SyncResult = {
  code: number
  progress: SyncProgress
  message: string
  done: boolean
  downloadURL: string
}

function injectDownloadSection() {
  const bookId = window.location.pathname.match(/\d+/)![0]

  document
    .querySelectorAll<HTMLDivElement>('#volumes .chapter-bar')
    .forEach((node, idx) => {
      const api = `https://www.zhidianbao.cn:8443/qs_xq_epub/api/catalog/${bookId}/${idx}/sync`

      node.innerHTML = `
        <span>${node.textContent}</span>
        <button class="download-btn"></button>
        <div class="progress">
          <div hidden></div>
        </div>
      `

      const $btn = node.querySelector<HTMLButtonElement>('.download-btn')!
      const $progress = node.querySelector<HTMLDivElement>('.progress div')!

      const setProgress = (progress?: SyncProgress) => {
        if (progress) {
          $progress.hidden = false
          const { asset, chapter } = progress
          $progress.style.width =
            ((chapter.progress + asset.progress) * 100) / 2 + '%'
        } else {
          $progress.hidden = true
          $progress.style.width = '0'
        }
      }
      $btn.onclick = () => {
        $btn.disabled = true
        ;(async function fn() {
          const res: SyncResult = await fetch(api).then((res) => res.json())
          setProgress(res.progress)

          if (res.code !== 0) {
            alert(res.message)
            $btn.disabled = false
          } else {
            if (res.done) {
              window.location.href = new URL(
                res.downloadURL,
                'https://www.zhidianbao.cn:8443'
              ).toString()
              setTimeout(() => setProgress(undefined), 100)
              $btn.disabled = false
            } else {
              setTimeout(fn, 300)
            }
          }
        })()
      }
    })
}

function resetPageEvent() {
  const $body = document.body
  $body.onclick = (e) => {
    const toolsId = ['#toptools', '#bottomtools', '#readset']
    if (
      toolsId.some((id) =>
        document.querySelector(id)?.contains(e.target as Node)
      )
    ) {
      return
    }
    window.ReadPages.PageClick()
  }
}

function injectMovePageEvent() {
  let left: number,
    startX: number,
    startY: number,
    diffX: number,
    startTime: number,
    isMoved: boolean,
    direction: 'x' | 'y' | ''
  const $page = document.getElementById('apage')!

  const isDisabled = (e: TouchEvent) => {
    return (
      window.ReadTools.pagemid != 1 ||
      e.touches.length > 1 ||
      (window.visualViewport && window.visualViewport.scale !== 1) ||
      (window.getSelection() && window.getSelection()!.toString().length > 0)
    )
  }

  window.addEventListener('touchstart', (e) => {
    if (isDisabled(e)) return

    left = parseFloat($page.style.left.replace('px', '')) || 0
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startTime = Date.now()
    isMoved = false
    direction = ''
  })
  window.addEventListener(
    'touchmove',
    (e) => {
      if (isDisabled(e)) return

      isMoved = true
      diffX = e.touches[0].clientX - startX
      let diffY = e.touches[0].clientY - startY

      if (direction === '') {
        direction = Math.abs(diffX) > Math.abs(diffY) ? 'x' : 'y'
      }
      if (direction === 'x') {
        e.preventDefault()

        $page.style.left = left + diffX + 'px'
        $page.style.transition = 'initail'
      }
    },
    { passive: false }
  )
  window.addEventListener('touchend', (e) => {
    if (isDisabled(e)) return

    if (!isMoved || direction === 'y') return

    const diffTime = Date.now() - startTime

    const threshold =
      diffTime < 300 ? 10 : document.documentElement.clientWidth * 0.3

    $page.style.transition = ''
    if (Math.abs(diffX) > threshold) {
      const type = diffX > 0 ? 'previous' : 'next'
      window.ReadPages.ShowPage(type)

      if (
        window.ReadPages.currentPage > window.ReadPages.totalPages ||
        window.ReadPages.currentPage < 1
      ) {
        window.ReadPages.ShowPage()
      }
    } else {
      window.ReadPages.ShowPage()
    }
  })
}

function injectShortcuts() {
  keybind(['a', 's', 'w', 'd', 'space', 'shift+space'], (e, key) => {
    if (window.ReadTools.pagemid != 1) return

    switch (key) {
      case 'shift+space':
      case 'a':
      case 'w':
        window.ReadPages.ShowPage('previous')

        break

      case 'space':
      case 'd':
      case 's':
        window.ReadPages.ShowPage('next')

        break

      default:
        break
    }
  })
}
