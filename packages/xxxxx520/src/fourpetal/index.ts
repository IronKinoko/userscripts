import { router } from 'shared'
import { detail } from './detail'

router({
  domain: ['fourpetal', 'download'],
  routes: [{ pathname: /.*\.html/, run: detail }],
})
