export function detail() {
  moveDownloadToTop()
  enhanceDownload()
}

function enhanceDownload() {
  const downBtn = document.querySelector<HTMLAnchorElement>('.go-down')
  if (!downBtn) return
  downBtn.href = `${window.location.origin}/go/?post_id=${downBtn.dataset.id}`
  downBtn.addEventListener('click', (e) => e.stopPropagation(), true)
}

function moveDownloadToTop() {
  const $area = $('.sidebar-right .sidebar-column .widget-area')
  const $down = $('.cao_widget_pay-4')

  $area.prepend($down)
}
