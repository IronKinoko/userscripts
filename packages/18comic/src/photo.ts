import { wait } from 'shared'

export default function main() {
  fixImgError()
}

async function fixImgError() {
  await wait(() => !!window.page_arr)
  window.page_arr!.forEach((id) => {
    const img = document.querySelector(`[id="${id}"] img`) as HTMLImageElement
    img.onerror = () => {
      setTimeout(() => {
        const url = new URL(img.dataset.original!)
        url.searchParams.set('_key', Math.random().toString())
        img.src = url.toString()
      }, 300)
    }
  })
}
