import { wait } from 'shared'

export default function main() {
  fixImgError()
  addRefreshButton()
}

async function getImages() {
  await wait(() => !!window.page_arr)
  return window.page_arr!.map((id) => {
    return document.querySelector(`[id="${id}"] img`) as HTMLImageElement
  })
}

async function fixImgError() {
  const imgs = await getImages()
  imgs.forEach((img) => {
    img.onerror = () => {
      setTimeout(() => {
        refreshImg(img)
      }, 300)
    }
  })
}

function refreshImg(imgEl: HTMLImageElement) {
  const url = new URL(imgEl.dataset.original!)
  url.searchParams.set('_key', Math.random().toString())
  imgEl.src = url.toString()
}

async function addRefreshButton() {
  const $dom = $(`<li><a href="javascript:void(0)"><span>重连</span></a></li>`)
  $dom.on('click', async () => {
    const imgs = await getImages()
    imgs.forEach((img) => {
      if (!img.complete) {
        refreshImg(img)
      }
    })
  })
  $('#pageselect').parent().before($dom)
}
