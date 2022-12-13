import './index.scss'
import { setup as s } from './views/s'
import { setup as g } from './views/g'
import { router } from 'shared'

router([
  { pathname: /\/g\/.*\/.*/, run: g },
  { pathname: /\/s\/.*\/.*/, run: s },
])
