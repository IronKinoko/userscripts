import { router } from 'shared'
import { detail } from './detail'

router({
  domain: 'xxxxx520',
  routes: [{ pathname: /.*\.html/, run: detail }],
})
