type MatcherInput = string | RegExp
type Route = { path?: MatcherInput; run: () => void }

function matcher(source: string, regexp: MatcherInput) {
  if (typeof regexp === 'string') return source.includes(regexp)
  return !!source.match(regexp)
}
export interface RouterOptions {
  domain?: MatcherInput
  routes: Route | Route[] | (() => void)
}
export function router(opts: RouterOptions) {
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
    const match = !route.path || matcher(pathSource, route.path)
    if (match) route.run()
  })
}
