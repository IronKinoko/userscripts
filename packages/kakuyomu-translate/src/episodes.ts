import { waitDOM } from 'shared'

let cache: Record<string, string> = {}
async function cacheJPContent() {
  await waitDOM('html[lang=ja]')
  const $article = $('.widget-episodeBody')

  $article.children().each((i, dom) => {
    if (dom.textContent) cache[dom.id] = dom.textContent
  })
}

async function runZHContent() {
  await waitDOM('html[lang=zh-CN]')

  const $article = $('.widget-episodeBody')

  $article.children().each((i, dom) => {
    const content = cache[dom.id]
    if (dom.textContent) dom.title = content
  })
}

export default async function main() {
  await cacheJPContent()

  runZHContent()
}
