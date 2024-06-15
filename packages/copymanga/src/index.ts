import h5 from './h5'
import pc from './pc'
import './index.scss'
import { execInUnsafeWindow, router, wait } from 'shared'

document.body.classList.add('k-copymanga')

wait(() => execInUnsafeWindow(() => !!window.aboutBlank)).then(() => {
  execInUnsafeWindow(() => {
    window.aboutBlank = () => {}
  })
})

router([
  { pathname: /^\/h5/, run: h5 },
  { pathname: /^(?!\/h5)/, run: pc },
])
