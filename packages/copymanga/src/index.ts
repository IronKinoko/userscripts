import h5 from './h5'
import pc from './pc'

;(() => {
  if (location.pathname.startsWith('/h5')) {
    h5()
  } else {
    pc()
  }
})()
