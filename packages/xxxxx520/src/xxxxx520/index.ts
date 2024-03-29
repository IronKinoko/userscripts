import { Cookie, router } from 'shared'
import { detail } from './detail'

function skipModal() {
  Cookie.set({
    name: 'cao_notice_cookie',
    value: '1',
    maxAge: 24 * 60 * 60 * 999,
  })
}

router({
  domain: ['xxxxx', 'www.gamer'],
  routes: [{ run: skipModal }, { pathname: /.*\.html/, run: detail }],
})
