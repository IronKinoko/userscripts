export async function waitDOM<T extends Element>(selector: string) {
  return new Promise<T>((resolve, reject) => {
    const now = Date.now()
    function getDOM() {
      if (Date.now() - now > 5000) reject()
      const dom = document.querySelector<T>(selector)
      if (dom) {
        resolve(dom)
      } else {
        requestAnimationFrame(getDOM)
      }
    }
    getDOM()
  })
}
