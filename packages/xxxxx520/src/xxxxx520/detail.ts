export function detail() {
  enhanceDownload()
}

function enhanceDownload() {
  const downBtn = document.querySelector<HTMLAnchorElement>('.go-down')
  if (!downBtn) return
  downBtn.href = `https://xxxxx520.com/go/?post_id=${downBtn.dataset.id}`
  downBtn.addEventListener('click', (e) => e.stopPropagation(), true)
}
