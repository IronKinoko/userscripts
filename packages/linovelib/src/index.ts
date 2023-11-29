import h5 from './h5'
import pc from './pc'
import './index.scss'
import { router } from 'shared'

document.body.classList.add('k-wrapper')

router({ domain: ['//www.linovelib.com'], routes: [{ run: pc }] })
router({
  domain: ['//w.linovelib.com', '//www.bilinovel.com'],
  routes: [{ run: h5 }],
})
