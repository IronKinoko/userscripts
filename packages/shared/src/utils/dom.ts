import { wait } from './wait'

export async function waitDOM<T extends Element>(selector: string) {
  await wait(() => !!document.querySelector(selector))
  return document.querySelector<T>(selector)!
}
