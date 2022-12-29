import h5 from './h5'
import pc from './pc'
import './index.scss'
import { router } from 'shared'
import { ImgLazySetup } from 'shared'

ImgLazySetup()

document.body.classList.add('k-copymanga')

router([
  { pathname: /^\/h5/, run: h5 },
  { pathname: /^(?!\/h5)/, run: pc },
])
