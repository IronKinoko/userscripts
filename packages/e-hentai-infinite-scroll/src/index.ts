import { ImgLazySetup, router } from 'shared'
import './index.scss'
import { setup as g } from './views/g'
import { checkCookie } from './views/home'
import { setup as s } from './views/s'

ImgLazySetup()

router({
  domain: 'exhentai.org',
  routes: [{ run: checkCookie }],
})

router([
  { pathname: /\/g\/.*\/.*/, run: g },
  { pathname: /\/s\/.*\/.*/, run: s },
])
