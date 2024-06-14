import { local } from './storage'

export interface Opts {
  url: string
  method?: 'GET' | 'POST'
  params?: any
  responseType?: 'text' | 'steam' | 'arraybuffer' | 'blob' | 'json'
  headers?: any
}

export function request<T = any>(opts: Opts) {
  let { url, method = 'GET', params, responseType = 'json', ...rest } = opts

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

  return new Promise<{ response: T }>((resolve, reject) => {
    GM_xmlhttpRequest({
      url,
      method,
      responseType,
      ...rest,
      onload: (res: any) => {
        console.log(res)
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
