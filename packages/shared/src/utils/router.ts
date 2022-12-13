type MatcherInput = string | RegExp
type Route = {
  path?: MatcherInput
  pathname?: MatcherInput
  search?: MatcherInput
  hash?: MatcherInput
  run: () => void
}

function matcher(source: string, regexp: MatcherInput) {
  if (typeof regexp === 'string') return source.includes(regexp)
  return !!source.match(regexp)
}
export interface RouterOptions {
  domain?: MatcherInput
  routes: Route | Route[] | (() => void)
}
export function router(config: RouterOptions | Route | Route[]) {
  const opts: RouterOptions = {
    routes: [],
  }

  if ('routes' in config) {
    opts.domain = config.domain
    opts.routes = config.routes
  } else {
    opts.routes = Array.isArray(config) ? config : [config]
  }

  if (opts.domain) {
    const match = matcher(window.location.origin, opts.domain)
    if (!match) return
  }

  const pathSource =
    window.location.pathname + window.location.search + window.location.hash

  if (typeof opts.routes === 'function') {
    opts.routes()
    return
  }

  const routes = Array.isArray(opts.routes) ? opts.routes : [opts.routes]
  routes.forEach((route) => {
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

    if (match) route.run()
  })
}
