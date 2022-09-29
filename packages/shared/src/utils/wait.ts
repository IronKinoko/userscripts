import { sleep } from './sleep'

export async function wait(selector: () => boolean) {
  let bool = selector()

  while (!bool) {
    await sleep()
    bool = selector()
  }
}

export async function waitDOM<T extends Element>(selector: string) {
  await wait(() => !!document.querySelector(selector))
  return document.querySelector<T>(selector)!
}
