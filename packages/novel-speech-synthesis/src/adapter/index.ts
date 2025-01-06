import { Route, RouterOptions } from 'shared'
import Speech, { SpeechOptions } from '../speech'

type Adapter = Omit<RouterOptions, 'routes'> & {
  routes: (Partial<Route> & { speech?: SpeechOptions })[]
}

function deepParseParagraph(content: Element) {
  content.querySelectorAll('br').forEach((el) => el.remove())
  const deep = (node: Node) => {
    const els = Array.from(node.childNodes)
    els.forEach((el) => {
      if (el.nodeType === Node.TEXT_NODE) {
        const p = document.createElement('p')
        p.textContent = el.textContent!.trim()
        p.style.textIndent = '2em'
        p.style.paddingBottom = '1em'

        if (!p.textContent) el.remove()
        else el.replaceWith(p)
      } else if (el.nodeType === Node.ELEMENT_NODE) {
        deep(el)
      }
    })
  }

  deep(content)

  let checking = true
  while (checking) {
    checking = Array.from(content.querySelectorAll('p')).some((p) => {
      if (p.querySelector('p')) {
        const div = document.createElement('div')
        div.innerHTML = p.innerHTML
        p.replaceWith(div)
        return true
      }
      return false
    })
  }
}

export const adapters: Adapter[] = [
  {
    domain: ['bilixs.com'],
    routes: [
      {
        path: /novel\/.*\/.*\.html/,
        speech: {
          container: 'body',
          lang: 'zh-CN',
          getParagraph: () => {
            const content = document.querySelector('.article-content')
            if (!content) throw new Error('content not found')

            return Array.from(content.querySelectorAll('p'))
          },
          nextChapter() {
            const dom =
              document.querySelector<HTMLAnchorElement>('.footer .f-right')
            dom?.click()
          },
        },
      },
    ],
  },
  {
    domain: ['linovelib.com'],
    routes: [
      {
        path: /novel\/.*\/.*\.html/,
        speech: {
          container: 'body',
          lang: 'zh-CN',
          getParagraph: () => {
            const content = document.querySelector('.read-content')
            if (!content) throw new Error('content not found')

            // 这个站点会插入一些脏数据防盗，需要过滤掉
            return Array.from(content.querySelectorAll('p')).filter(
              (o) => o.clientHeight
            )
          },
          nextChapter() {
            const dom =
              document.querySelectorAll<HTMLAnchorElement>('.mlfy_page a')
            Array.from(dom)
              .find((d) => d.innerText.match(/下一[章页]/))
              ?.click()
          },
        },
        run() {
          const speech = new Speech(this.speech!)

          const ob = new MutationObserver(() => {
            if (
              speech.paragraphList.length !== speech.opts.getParagraph().length
            ) {
              speech.setupParagraph()
            }
          })

          ob.observe(document.querySelector('.read-content')!, {
            childList: true,
          })
        },
      },
    ],
  },
  {
    domain: ['bilinovel.com'],
    routes: [
      {
        path: /novel\/.*\/.*\.html/,
        speech: {
          container: 'body',
          lang: 'zh-CN',
          getParagraph: () => {
            const content = document.querySelector('#acontentz')
            if (!content) throw new Error('content not found')

            return Array.from(content.querySelectorAll('p'))
          },
          nextChapter() {
            document
              .querySelector<HTMLAnchorElement>('#footlink > a:last-child')
              ?.click()
          },
        },
        run() {
          const speech = new Speech(this.speech!)

          const ob = new MutationObserver(() => {
            if (
              speech.paragraphList.length !== speech.opts.getParagraph().length
            ) {
              speech.setupParagraph()
            }
          })

          ob.observe(document.querySelector('#acontentz')!, {
            childList: true,
          })
        },
      },
    ],
  },
  {
    domain: ['novel18.syosetu.com'],
    routes: [
      {
        pathname: /^\/([^/]+?)\/([^/]+?)\/?$/,
        speech: {
          container: 'body',
          lang: 'ja-JP',
          getParagraph: () => {
            const content = document.querySelector('#novel_honbun')
            if (!content) throw new Error('content not found')

            return Array.from(content.querySelectorAll('p'))
          },
          nextChapter: () => {
            let dom = document.querySelector<HTMLAnchorElement>(
              '.novel_bn a[rel="next"]'
            )
            if (!dom) {
              dom = document.querySelector<HTMLAnchorElement>(
                '.novel_bn a:last-child'
              )
            }
            dom?.click()
          },
        },
      },
    ],
  },
  {
    domain: ['esjzone.cc'],
    routes: [
      {
        path: /forum\/[^/]+\/[^/]+\.html/,
        speech: {
          container: 'body',
          lang: 'zh-CN',
          getParagraph: () => {
            const content = document.querySelector('.forum-content')
            if (!content) throw new Error('content not found')

            deepParseParagraph(content)
            return Array.from(content.querySelectorAll('p'))
          },
          nextChapter() {
            const dom = document.querySelector<HTMLAnchorElement>('.btn-next')
            dom?.click()
          },
        },
      },
    ],
  },
  {
    domain: ['kakuyomu.jp'],
    routes: [
      {
        pathname: /^\/works\/\d+\/episodes\/\d+$/,
        speech: {
          container: 'body',
          lang: 'ja-JP',
          getParagraph: () => {
            const content = document.querySelector('.widget-episodeBody')
            if (!content) throw new Error('content not found')

            return Array.from(content.querySelectorAll('p'))
          },
          nextChapter() {
            const dom = document.querySelector<HTMLAnchorElement>(
              '#contentMain-readNextEpisode'
            )
            dom?.click()
          },
        },
      },
    ],
  },
  {
    domain: ['piaotia.com'],
    routes: [
      {
        path: /html\/[^/]+\/[^/]+\/[^/]+\.html/,
        speech: {
          container: 'body',
          lang: 'zh-CN',
          getParagraph: () => {
            const content = document.querySelector('#content')
            if (!content) throw new Error('content not found')
            content.querySelectorAll('br').forEach((o) => o.remove())
            return Array.from(content.childNodes)
              .filter(
                (o) => o.nodeType === Node.TEXT_NODE && o.textContent!.trim()
              )
              .map((o) => {
                const p = document.createElement('p')
                p.textContent = o.textContent!.trim()
                p.style.textIndent = '2em'
                p.style.paddingBottom = '1em'

                o.replaceWith(p)
                return p
              })
          },
          nextChapter() {
            document
              .querySelector<HTMLAnchorElement>(
                '#content > div > a:nth-child(3)'
              )
              ?.click()
          },
        },
      },
    ],
  },
]
