import h5 from './h5'
import pc from './pc'
import './index.scss'

document.body.classList.add('k-wrapper')

if (window.location.host.includes('www.')) {
  pc()
} else h5()
