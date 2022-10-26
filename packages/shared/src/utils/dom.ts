import { wait } from './wait'

export function s2d(string: string) {
  return new DOMParser().parseFromString(string, 'text/html').body.childNodes!
}

export async function waitDOM<T extends Element>(selector: string) {
  await wait(() => !!document.querySelector(selector))
  return document.querySelector<T>(selector)!
}
