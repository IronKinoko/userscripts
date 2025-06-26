export function setup() {
  fetchRoomId()
  hookXHR()
  hookFetch()
}
export function run() {}

declare global {
  interface XMLHttpRequest {
    _requestURL: string
    _requestMethod: string
  }
}

let room_id = ''
async function fetchRoomId() {
  const res = await fetch(
    'https://api.live.bilibili.com/xlive/app-blink/v1/room/GetInfo?platform=pc',
    { credentials: 'include' }
  )
  const data = await res.json()
  room_id = data.data.room_id
}

function hookXHR() {
  const originalOpen = XMLHttpRequest.prototype.open
  const originalSend = XMLHttpRequest.prototype.send

  // @ts-ignore
  XMLHttpRequest.prototype.open = function (method, url: string, ...rest) {
    if (url.includes('FetchWebUpStreamAddr')) {
      method = 'GET'
      url = `//api.live.bilibili.com/live_stream/v1/StreamList/get_stream_by_roomId?room_id=${room_id}`
    }

    this._requestURL = url
    this._requestMethod = method

    // @ts-ignore
    return originalOpen.call(this, method, url, ...rest)
  }

  XMLHttpRequest.prototype.send = function (body) {
    const xhr = this
    const url = this._requestURL

    if (url && url.includes('GetWebLivePermission')) {
      injectOnReadyStateChange(xhr, (xhr) => {
        try {
          let responseData = JSON.parse(xhr.responseText)
          if (responseData.data) {
            responseData.data.allow_live = true
          }

          Object.defineProperty(xhr, 'responseText', {
            get: function () {
              return JSON.stringify(responseData)
            },
          })
        } catch (e) {
          console.error('修改GetWebLivePermission返回值出错:', e)
        }
      })
    }

    if (url && url.includes('get_stream_by_roomId')) {
      injectOnReadyStateChange(xhr, (xhr) => {
        try {
          let responseData = JSON.parse(xhr.responseText)
          if (responseData.data) {
            responseData.data.addr = responseData.data.rtmp
            responseData.data.line = responseData.data.stream_line
          }

          Object.defineProperty(xhr, 'responseText', {
            get: function () {
              return JSON.stringify(responseData)
            },
          })
        } catch (e) {
          console.error('修改get_stream_by_roomId返回值出错:', e)
        }
      })
    }

    // if (url && url.includes('/room/v1/Room/startLive')) {
    //   const isString = typeof body === 'string'
    //   const params = isString
    //     ? new URLSearchParams(body)
    //     : (body as URLSearchParams)
    //   params.set('platform', 'mobile')
    //   arguments[0] = isString ? params.toString() : params
    // }
    // @ts-ignore
    return originalSend.apply(this, arguments)
  }
}

function injectOnReadyStateChange(
  xhr: XMLHttpRequest,
  callback: (xhr: XMLHttpRequest) => void
) {
  const originalOnReadyStateChange = xhr.onreadystatechange
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        callback(xhr)
      }
    }
    if (originalOnReadyStateChange) {
      // @ts-ignore
      originalOnReadyStateChange.apply(this, arguments)
    }
  }
}

function hookFetch() {
  const oldFetch = window.fetch
  window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    if (typeof input === 'string') {
      if (input.includes('WebLiveCenterStartLive')) {
        const params = new URLSearchParams(input.split('?')[1])
        params.set('platform', 'pc_link')
        input =
          '//api.live.bilibili.com/room/v1/Room/startLive?' + params.toString()
      }
    }

    return oldFetch(input, init)
  }
}
