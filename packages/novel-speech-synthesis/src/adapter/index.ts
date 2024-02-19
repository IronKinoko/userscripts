import { Route, RouterOptions } from 'shared'
import Speech, { SpeechOptions } from '../speech'

type Adapter = Omit<RouterOptions, 'routes'> & {
  routes: (Partial<Route> & { speech?: SpeechOptions })[]
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
]
