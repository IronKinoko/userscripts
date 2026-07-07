/// <reference types="bocchi/env" />

interface Window {
  [x: string]: any
}

declare const unsafeWindow: Window
declare function GM_getValue<T>(key: string): T | undefined
declare function GM_getValue<T>(key: string, defaultValue: T): T
declare function GM_setValue(key: string, value: any): void

declare interface GMXMLHttpRequestDetails {
  /**
   * HTTP method
   * @default "GET"
   */
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'

  /**
   * Request URL
   */
  url: string

  /**
   * Request headers
   */
  headers?: Record<string, string>

  /**
   * Request body
   */
  data?: string | Blob | ArrayBuffer | FormData

  /**
   * Response type
   */
  responseType?: '' | 'arraybuffer' | 'blob' | 'json' | 'text'

  /**
   * Timeout in milliseconds
   */
  timeout?: number

  /**
   * Whether to send cookies
   */
  anonymous?: boolean

  /**
   * Include cookies for the request
   */
  cookie?: string

  /**
   * Redirect handling
   */
  redirect?: 'follow' | 'error' | 'manual'

  /**
   * Override MIME type
   */
  overrideMimeType?: string

  /**
   * User-Agent
   */
  userAgent?: string

  /**
   * Progress callback
   */
  onprogress?: (response: GMXMLHttpRequestProgress) => void

  /**
   * Ready state change callback
   */
  onreadystatechange?: (response: GMXMLHttpRequestResponse) => void

  /**
   * Request completed
   */
  onload?: (response: GMXMLHttpRequestResponse) => void

  /**
   * Request failed
   */
  onerror?: (response: GMXMLHttpRequestResponse) => void

  /**
   * Timeout callback
   */
  ontimeout?: (response: GMXMLHttpRequestResponse) => void

  /**
   * Abort callback
   */
  onabort?: (response: GMXMLHttpRequestResponse) => void
}

declare interface GMXMLHttpRequestResponse<T = any> {
  /**
   * Final URL after redirects
   */
  finalUrl: string

  /**
   * XMLHttpRequest readyState
   */
  readyState: number

  /**
   * HTTP status code
   */
  status: number

  /**
   * HTTP status text
   */
  statusText: string

  /**
   * Response headers
   */
  responseHeaders: string

  /**
   * Response data
   */
  response: T

  /**
   * Response as text
   */
  responseText: string

  /**
   * XML document response
   */
  responseXML: Document | null
}

declare interface GMXMLHttpRequestProgress extends GMXMLHttpRequestResponse {
  lengthComputable: boolean
  loaded: number
  total: number
}

declare interface GMXMLHttpRequestAbortHandle {
  abort(): void
}

declare function GM_xmlhttpRequest<T = any>(
  details: GMXMLHttpRequestDetails
): GMXMLHttpRequestAbortHandle
