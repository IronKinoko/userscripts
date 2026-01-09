import { router, waitDOM } from 'shared'

router({
  domain: 'acggw.me',
  routes: [{ path: /\d+\.html/, run: linkMergePassword }],
})

async function linkMergePassword() {
  const lines = Array.from(document.querySelectorAll('.content .single > p'))

  function makeLink(line: Element) {
    const urlMatch = line.textContent?.match(/(https?:\/\/\S+)/)
    if (urlMatch) {
      const url = urlMatch[0]
      const a = document.createElement('a')
      a.href = url
      a.textContent = url
      a.target = '_blank'
      a.style.textDecoration = 'underline'
      line.textContent = line.textContent.replace(url, '')
      line.appendChild(a)
    }
  }

  // mega
  const mega = lines.filter((line) => line.textContent.includes('M盘'))
  if (mega.length === 2) {
    const [linkLine, pwdLine] = mega
    linkLine.textContent = `${linkLine.textContent}#${pwdLine.textContent
      .split(/：|:/)
      .pop()
      ?.trim()}`

    makeLink(linkLine)
  }

  // 百度网盘
  const baidu = lines.filter((line) =>
    line.textContent.match(/百度网盘|提取码/)
  )
  if (baidu.length === 2) {
    const [linkLine, pwdLine] = baidu
    linkLine.textContent = `${linkLine.textContent}?pwd=${pwdLine.textContent
      .split(/：|:/)
      .pop()
      ?.trim()}`

    makeLink(linkLine)
  }
}
