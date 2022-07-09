import h5 from './h5'
import pc from './pc'

;(() => {
  if (window.__copymanga_autofix) return console.log('已经插入过了')
  window.__copymanga_autofix = true

  if (location.pathname.startsWith('/h5')) {
    h5()
  } else {
    pc()
  }
})()
