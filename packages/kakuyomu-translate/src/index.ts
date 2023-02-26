import './index.scss'

import { router } from 'shared'
import episodes from './episodes'

router([{ path: /works\/.*\/episodes\/.*/, run: episodes }])
