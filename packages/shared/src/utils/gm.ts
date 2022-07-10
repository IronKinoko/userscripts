import { request } from './request'
export const gm = {
  getItem: GM_getValue,
  setItem: GM_setValue,
  request,
}
