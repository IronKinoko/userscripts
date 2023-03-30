type Options = {
  name: string
  value?: string
  /** max age in seconds */
  maxAge?: number
  domain?: string
  path?: string
  sameSite?: 'strict' | 'lax' | 'none'
  secure?: boolean
}

function set(name: string, value: string): void
function set(options: Options): void
function set(arg1: string | Options, arg2?: string) {
  let options: Options = {
    name: '',
    value: '',
    maxAge: 24 * 60 * 60,
    path: '/',
  }
  if (typeof arg1 === 'object') {
    Object.assign(options, arg1)
  } else {
    options.name = arg1
    options.value = arg2!
  }

  options.value = encodeURIComponent(options.value!)

  document.cookie = [
    `${options.name}=${options.value}`,
    `max-age=${options.maxAge}`,
    !!options.domain && `domain=${options.domain}`,
    !!options.path && `path=${options.path}`,
    !!options.sameSite && `sameSite=${options.sameSite}`,
    !!options.secure && `secure`,
  ]
    .filter(Boolean)
    .join(';')
}

function get(name: string): string | null {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return decodeURIComponent(arr[2])
  } else {
    return null
  }
}

function remove(name: string): void
function remove(options: Options): void
function remove(arg1: string | Options): void {
  if (typeof arg1 === 'string') {
    set({ name: arg1, value: '', maxAge: 0 })
  } else {
    set({ ...arg1, maxAge: 0 })
  }
}

export const Cookie = {
  get,
  set,
  remove,
}
