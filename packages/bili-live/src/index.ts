import { router } from 'shared'
import * as startLive from './modules/startLive'

router({
  domain: 'link.bilibili.com',
  routes: [
    { path: '/p/center/index', setup: startLive.setup, run: startLive.run },
  ],
})
