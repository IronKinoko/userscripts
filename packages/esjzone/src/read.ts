function removeLoveEmoji() {
  function transBody(node?: ChildNode) {
    const nodes = node ? node.childNodes : document.body.childNodes
    for (const node of nodes) {
      if (node.nodeType === node.TEXT_NODE) {
        const text = node as Text
        text.data = text.data.replace(/❤/g, '❤︎')
      } else {
        transBody(node)
      }
    }
  }

  transBody()
}

function customizerEnhance() {
  // opacity: el when scroll down and show when scroll up
  const el = document.querySelector('.customizer') as HTMLElement
  let lastScrollTop = 0
  // set el transition
  el.style.transition = 'opacity 0.15s, right 0.3s'
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop
    if (scrollTop > lastScrollTop) {
      el.style.opacity = '0'
      lastScrollTop = scrollTop
    } else if (scrollTop + 20 < lastScrollTop || scrollTop < 50) {
      lastScrollTop = scrollTop
      el.style.opacity = '1'
    }
  })
}

export function main() {
  removeLoveEmoji()
  customizerEnhance()
}
