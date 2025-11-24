import { router } from 'shared'
import * as listings from './market/listings'
import * as multisell from './market/multisell'
import './index.scss'

router([
  { path: '/market/listings/', run: listings.run },
  { path: '/market/multisell', setup: multisell.setup, run: multisell.run },
])
