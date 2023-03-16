function set(name: string, value: string | number, days = 1) {
  var exp = new Date()
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie =
    name +
    '=' +
    escape(String(value)) +
    ';expires=' +
    exp.toUTCString() +
    ';path=/'
}

function get(name: string) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return decodeURIComponent(arr[2])
  } else {
    return null
  }
}

export const Cookie = {
  get,
  set,
  remove: function (name: string) {
    set(name, '', 0)
  },
}
