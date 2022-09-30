import h5 from './h5'
import pc from './pc'

if (window.location.host.includes('www.')) {
  pc()
} else h5()
