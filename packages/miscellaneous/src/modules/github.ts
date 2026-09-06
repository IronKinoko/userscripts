import { router } from 'shared'

// 加速代理前缀，可按需替换为其他可用的 gh 代理服务
const PROXY_PREFIX = 'https://v4.gh-proxy.org/'

// 需要走代理加速的资源链接：release 附件、raw 文件、仓库/分支归档、codeload 下载
const ACCELERATE_PATTERN =
  /^https:\/\/(github\.com\/.+\/(releases\/download|archive)\/|raw\.githubusercontent\.com\/|codeload\.github\.com\/)/

router({
  domain: 'github.com',
  routes: [{ run: main }],
})

function main() {
  patchDownloadLinks()

  const observer = new MutationObserver(() => patchDownloadLinks())
  observer.observe(document.body, { childList: true, subtree: true })
}

function patchDownloadLinks() {
  const links = document.querySelectorAll<HTMLAnchorElement>(
    'a[href]:not([data-gh-accelerated])'
  )

  links.forEach((link) => {
    const href = link.getAttribute('href') || ''
    link.setAttribute('data-gh-accelerated', 'true')

    // GitHub 下载链接常为相对路径，需先转为绝对地址再匹配
    const absoluteHref = new URL(href, location.origin).href
    if (!ACCELERATE_PATTERN.test(absoluteHref)) return

    link.setAttribute('href', PROXY_PREFIX + absoluteHref)
  })
}
