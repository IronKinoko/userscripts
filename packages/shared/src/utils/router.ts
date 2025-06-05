export type MatcherInput = string | RegExp
export type Route = {
  path?: MatcherInput
  pathname?: MatcherInput
  search?: MatcherInput
  hash?: MatcherInput
  setup?: () => void
  run?: () => void
}

function matcher(source: string, regexp: MatcherInput) {
  if (typeof regexp === 'string') return source.includes(regexp)
  return !!source.match(regexp)
}
export type RouterOptions = {
  domain: MatcherInput | MatcherInput[]
  routes: Route | Route[] | (() => void)
}
export function router(config: RouterOptions): void
export function router(config: Route | Route[]): void
export function router(config: RouterOptions | Route | Route[]) {
  const opts: RouterOptions = {
    domain: '',
    routes: [],
  }

  if ('routes' in config) {
    opts.domain = config.domain
    opts.routes = config.routes
  } else {
    opts.routes = Array.isArray(config) ? config : [config]
  }

  if (opts.domain) {
    const domains = Array.isArray(opts.domain) ? opts.domain : [opts.domain]
    const match = domains.some((domain) =>
      matcher(window.location.origin, domain)
    )
    if (!match) return
  }

  const pathSource =
    window.location.pathname + window.location.search + window.location.hash

  if (typeof opts.routes === 'function') {
    opts.routes()
    return
  }

  const routes = Array.isArray(opts.routes) ? opts.routes : [opts.routes]
  const runRoutes = routes.filter((route) => {
    let match = true

    if (route.path) {
      match = matcher(pathSource, route.path)
    }
    if (route.pathname) {
      match = matcher(window.location.pathname, route.pathname)
    }
    if (route.search) {
      match = matcher(window.location.search, route.search)
    }
    if (route.hash) {
      match = matcher(window.location.hash, route.hash)
    }

    return match
  })

  runRoutes.forEach((route) => {
    if (route.setup) route.setup()
  })

  function run() {
    runRoutes.forEach((route) => {
      if (route.run) route.run()
    })
  }
  if (window.document.readyState === 'complete') {
    run()
  } else {
    window.addEventListener('load', run)
  }
}
