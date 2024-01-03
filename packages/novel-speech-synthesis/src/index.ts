import { router } from 'shared'
import { adapter } from './adapter'
import Speech from './speech'

router({
  domain: ['bilixs.com'],
  routes: [
    {
      path: /novel\/.*\/.*\.html/,
      run: () => {
        new Speech(adapter.bilixs)
      },
    },
  ],
})

router({
  domain: ['linovelib.com'],
  routes: [
    {
      path: /novel\/.*\/.*\.html/,
      run: () => {
        new Speech(adapter.linovelib)
      },
    },
  ],
})

router({
  domain: ['bilinovel.com'],
  routes: [
    {
      path: /novel\/.*\/.*\.html/,
      run: () => {
        new Speech(adapter.bilinovel)
      },
    },
  ],
})
