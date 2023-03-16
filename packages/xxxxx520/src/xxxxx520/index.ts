import { Cookie, router } from 'shared'
import { detail } from './detail'

function skipModal() {
  Cookie.set('cao_notice_cookie', 1, 365)
}

router({
  domain: 'xxxxx520',
  routes: [{ run: skipModal }, { pathname: /.*\.html/, run: detail }],
})
