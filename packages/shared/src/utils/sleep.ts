export function sleep(time?: number) {
  if (!time) {
    return new Promise((resolve) => {
      requestAnimationFrame(resolve)
      window.requestIdleCallback()
    })
  }

  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
