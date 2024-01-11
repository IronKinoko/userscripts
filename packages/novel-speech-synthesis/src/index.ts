import { router } from 'shared'
import { adapters } from './adapter'
import Speech from './speech'

adapters.forEach((adapter) => {
  router({
    domain: adapter.domain,
    routes: adapter.routes.map((route) => {
      return {
        ...route,
        run: () => {
          if (route.run) {
            route.run()
          } else if (route.speech) new Speech(route.speech)
        },
      }
    }),
  })
})
