import { wait } from './wait'

export async function waitDOM<T extends Element>(selector: string): Promise<T>
export async function waitDOM<T extends Element>(
  selector: string,
  root: Element | Document
): Promise<T>
export async function waitDOM<T extends Element>(
  selector: string,
  root: Element | Document = document
) {
  await wait(() => !!root.querySelector(selector))
  return root.querySelector<T>(selector)!
}
