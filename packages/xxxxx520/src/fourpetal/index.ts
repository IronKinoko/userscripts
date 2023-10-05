import { router } from 'shared'
import { detail } from './detail'

router({
  domain: ['fourpetal', 'dow'],
  routes: [{ pathname: /.*\.html/, run: detail }],
})
