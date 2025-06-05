export function setup() {
  hookXHR()
}
export function run() {}

declare global {
  interface XMLHttpRequest {
    _requestURL: string
    _requestMethod: string
  }
}

function hookXHR() {
  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send

  // @ts-ignore
  XMLHttpRequest.prototype.open = function (method, url: string, ...rest) {
    this._requestURL = url
    this._requestMethod = method
    // @ts-ignore
    return originalOpen.call(this, method, url, ...rest)
  }

  XMLHttpRequest.prototype.send = function (body) {
    const xhr = this
    const url = this._requestURL
    const method = this._requestMethod
    if (url && url.includes('GetWebLivePermission')) {
      const originalOnReadyStateChange = xhr.onreadystatechange
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              let responseData = JSON.parse(xhr.responseText)
              if (responseData.data) {
                responseData.data.allow_live = true
              }

              Object.defineProperty(xhr, 'responseText', {
                get: function () {
                  return JSON.stringify(responseData)
                },
              })
            }
          } catch (e) {
            console.error('修改GetWebLivePermission返回值出错:', e)
          }
        }

        if (originalOnReadyStateChange) {
          // @ts-ignore
          originalOnReadyStateChange.apply(this, arguments)
        }
      }
    }

    if (url && url.includes('/room/v1/Room/startLive')) {
      const isString = typeof body === 'string'
      const params = isString
        ? new URLSearchParams(body)
        : (body as URLSearchParams)
      params.set('platform', 'mobile')
      arguments[0] = isString ? params.toString() : params
    }
    // @ts-ignore
    return originalSend.apply(this, arguments)
  }
}
