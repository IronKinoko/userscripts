import { router } from 'shared'
import T from './index.template.html'

function novelReadPage() {}

export function main() {
  console.log($(T.xs))
  router([{ pathname: /novel\/.*\/.*\.html/, run: novelReadPage }])
}
