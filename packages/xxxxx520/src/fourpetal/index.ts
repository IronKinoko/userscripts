import { router } from 'shared'
import { detail } from './detail'

router({
  domain: 'fourpetal',
  routes: [{ pathname: /.*\.html/, run: detail }],
})
