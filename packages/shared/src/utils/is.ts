export function isMobile() {
  const re = /iphone|ipod|android|webos|blackberry|windows phone/i
  const ua = navigator.userAgent

  return re.test(ua)
}
