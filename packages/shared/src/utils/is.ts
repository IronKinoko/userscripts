export function isMobile() {
  const re = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i
  const ua = navigator.userAgent

  return re.test(ua)
}
