import { local } from './storage'

export interface Opts {
  url: string
  method?: 'GET' | 'POST'
  params?: any
  responseType?: 'text' | 'steam' | 'arraybuffer' | 'blob'
}

export function request(opts: Opts) {
  let { url, method, params } = opts

  if (params) {
    let u = new URL(url)
    Object.keys(params).forEach((key) => {
      const value = params[key]
      if (value !== undefined && value !== null) {
        u.searchParams.set(key, params[key])
      }
    })
    url = u.toString()
  }

  return new Promise<any>((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method: method || 'GET',
      responseType: 'json',
      onload: (res: any) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(res)
        }
        resolve(res)
      },
      onerror: reject,
    })
  })
}

type GM = Pick<typeof local, 'getItem' | 'setItem'> & {
  request: typeof request
}
let gm: GM = {} as any

try {
  gm.setItem = GM_setValue
  gm.getItem = GM_getValue
} catch (error) {
  gm.setItem = local.setItem
  gm.getItem = local.getItem
}

gm.request = request

export { gm }
