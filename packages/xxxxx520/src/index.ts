import { router } from 'shared'
import xxxxx520 from './xxxxx520'
import baidu from './baidu'

router({
  domain: ['pan.baidu.com'],
  routes: [{ path: '/share/init', run: baidu }],
})

router({
  domain: [
    /xxxxx520/,
    /xxxxx525/,
    /xxxxx528/,
    /xxxxx520/,
    /gamer520/,
    /efemovies/,
    /espartasr/,
    /fourpetal/,
  ],
  routes: [{ run: xxxxx520 }],
})
