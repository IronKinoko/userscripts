import h5 from './h5'
import pc from './pc'
import './index.scss'

document.body.classList.add('k-copymanga')
if (location.pathname.startsWith('/h5')) {
  h5()
} else {
  pc()
}
