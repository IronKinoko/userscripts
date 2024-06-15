import { sleep } from './sleep'

export async function wait(selector: () => boolean | Promise<boolean>) {
  let bool = await selector()

  while (!bool) {
    await sleep()
    bool = await selector()
  }
}
