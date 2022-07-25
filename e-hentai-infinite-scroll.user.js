// ==UserScript==
// @name         e-hentai-infinite-scroll
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/e-hentai-infinite-scroll
// @version      1.0.7
// @description  Exhentai infinite scroll scripts.
// @author       IronKinoko
// @match        https://exhentai.org/s/*
// @match        https://exhentai.org/g/*
// @grant        none
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/e-hentai-infinite-scroll.user.js
// ==/UserScript==
(function () {
  'use strict';

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".e-hentai-infinite-scroll #gdt::after {\n  content: \"\";\n  display: block;\n  clear: both;\n}\n.e-hentai-infinite-scroll .g-scroll-body {\n  overflow: auto;\n  max-height: 80vh;\n}\n.e-hentai-infinite-scroll .g-scroll-body::-webkit-scrollbar {\n  width: 0;\n}\n@supports (overflow: overlay) {\n  .e-hentai-infinite-scroll .g-scroll-body {\n    overflow: overlay;\n  }\n  .e-hentai-infinite-scroll .g-scroll-body::-webkit-scrollbar {\n    width: 8px;\n  }\n  .e-hentai-infinite-scroll .g-scroll-body::-webkit-scrollbar-thumb {\n    background-color: rgba(255, 255, 255, 0.15);\n    border-radius: 2px;\n  }\n}\n.e-hentai-infinite-scroll .g-scroll-page-index {\n  clear: both;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-bottom: 10px;\n}\n.e-hentai-infinite-scroll .g-scroll-page-index::before, .e-hentai-infinite-scroll .g-scroll-page-index::after {\n  display: block;\n  content: \"\";\n  width: 40px;\n  height: 1px;\n  background: #ddd;\n  margin: 0 10px;\n}\n.e-hentai-infinite-scroll.s .auto-load-img {\n  width: 100% !important;\n  max-width: 100% !important;\n  margin: 0 !important;\n  padding: 10px;\n  display: block;\n  box-sizing: border-box;\n}\n.e-hentai-infinite-scroll.s .auto-load-img-empty {\n  min-height: 1000px;\n  width: 100px !important;\n  margin: 0 auto !important;\n}\n.e-hentai-infinite-scroll.s #i3 a {\n  pointer-events: none;\n}";
  n(css,{});

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto$1.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  /**
   * Gets the timestamp of the number of milliseconds that have elapsed since
   * the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Date
   * @returns {number} Returns the timestamp.
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => Logs the number of milliseconds it took for the deferred invocation.
   */
  var now = function() {
    return root.Date.now();
  };

  var now$1 = now;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max,
      nativeMin = Math.min;

  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed `func` invocations and a `flush` method to immediately invoke them.
   * Provide `options` to indicate whether `func` should be invoked on the
   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
   * with the last arguments provided to the debounced function. Subsequent
   * calls to the debounced function return the result of the last `func`
   * invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the debounced function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=false]
   *  Specify invoking on the leading edge of the timeout.
   * @param {number} [options.maxWait]
   *  The maximum time `func` is allowed to be delayed before it's invoked.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // Avoid costly calculations while the window size is in flux.
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // Invoke `sendMail` when clicked, debouncing subsequent calls.
   * jQuery(element).on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', debounced);
   *
   * // Cancel the trailing debounced invocation.
   * jQuery(window).on('popstate', debounced.cancel);
   */
  function debounce(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time;
      // Start the timer for the trailing edge.
      timerId = setTimeout(timerExpired, wait);
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
        (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
      var time = now$1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // Restart the timer.
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(now$1());
    }

    function debounced() {
      var time = now$1(),
          isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  function createStorage(storage) {
    function getItem(key, defaultValue) {
      try {
        const value = storage.getItem(key);
        if (value)
          return JSON.parse(value);
        return defaultValue;
      } catch (error) {
        return defaultValue;
      }
    }
    return {
      getItem,
      setItem(key, value) {
        storage.setItem(key, JSON.stringify(value));
      },
      removeItem: storage.removeItem.bind(storage),
      clear: storage.clear.bind(storage)
    };
  }
  const session = createStorage(window.sessionStorage);
  createStorage(window.localStorage);

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  function setup$1() {
    function api_call(page2, nextImgKey2) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", window.api_url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = true;
        xhr.onreadystatechange = () => {
          if (xhr.readyState === xhr.DONE) {
            resolve(JSON.parse(xhr.responseText));
          }
        };
        xhr.send(JSON.stringify({
          method: "showpage",
          gid: window.gid,
          page: page2,
          imgkey: nextImgKey2,
          showkey: window.showkey
        }));
      });
    }
    const maxPageSize = parseInt(document.querySelector("#i2 > div.sn > div > span:nth-child(2)").textContent);
    let nextImgKey = document.querySelector("#i3 a[onclick]").onclick.toString().match(new RegExp("'(?<key>.*)'")).groups.key;
    let page = window.startpage + 1;
    let isLoading = false;
    async function loadImgInfo() {
      if (maxPageSize < page)
        return;
      if (isLoading)
        return;
      isLoading = true;
      const res = await api_call(page, nextImgKey);
      isLoading = false;
      const groups = res.i3.match(new RegExp(`'(?<key>.*)'.*src="(?<src>.*)?".*nl\\('(?<nl>.*)'\\)`)).groups;
      renderImg(page, __spreadProps(__spreadValues({}, groups), {
        source: res.s[0] === "/" ? res.s : "/" + res.s
      }));
      nextImgKey = groups.key;
      page++;
    }
    function renderImg(page2, info) {
      const { key, source } = info;
      const img = document.createElement("img");
      img.src = "data:image/svg+xml,%3Csvg class='loading-icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M512 0a512 512 0 0 1 512 512h-64a448 448 0 0 0-448-448V0z' fill='%23999'%3E%3C/path%3E%3Cstyle%3E%0A.loading-icon %7B animation: rotate 1s infinite linear; %7D%0A@keyframes rotate %7B from %7B transform: rotate(0); %7D to %7B transform: rotate(360deg); %7D %7D%0A%3C/style%3E%3C/svg%3E";
      img.dataset.imgKey = key;
      img.dataset.page = page2 + "";
      img.dataset.source = source;
      img.classList.add("auto-load-img", "auto-load-img-empty");
      img.alt = source;
      loadImg(img, info);
      document.getElementById("i3").append(img);
    }
    function loadImg(imgDOM, info) {
      const { source, src, nl } = info;
      const img = new Image();
      img.onload = () => {
        imgDOM.src = src;
        imgDOM.classList.remove("auto-load-img-empty");
      };
      img.onerror = () => {
        imgDOM.alt = `\u56FE\u7247\u52A0\u8F7D\u51FA\u9519 ${source}?nl=${nl}`;
        retry(imgDOM, info);
      };
      img.src = src;
    }
    function retry(img, info) {
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;width:0;height:0;opacity:0;left:0;top:0;";
      const url = new URL(info.source, location.origin);
      url.searchParams.set("nl", info.nl);
      iframe.src = url.toString();
      document.body.append(iframe);
      iframe.contentWindow.addEventListener("DOMContentLoaded", () => {
        const src = iframe.contentWindow.document.querySelector("#i3 a img").getAttribute("src");
        loadImg(img, __spreadProps(__spreadValues({}, info), { src }));
        iframe.remove();
      });
    }
    function resetDefaultImgDOM() {
      const dom = document.querySelector("#i3 a img");
      dom.removeAttribute("style");
      dom.classList.add("auto-load-img");
      dom.dataset.source = location.pathname;
      document.getElementById("i3").append(dom);
      document.querySelector("#i3 a").remove();
    }
    const replaceCurrentPathname = debounce(function() {
      const imgs = document.querySelectorAll("#i3 img");
      for (const img of imgs) {
        const { top, bottom } = img.getBoundingClientRect();
        const base = 200;
        if (top < base && bottom > base) {
          const source = img.dataset.source;
          if (location.pathname !== source) {
            history.replaceState(null, "", source);
          }
          return;
        }
      }
    }, 30);
    document.body.classList.add("e-hentai-infinite-scroll", "s");
    resetDefaultImgDOM();
    loadImgInfo();
    document.addEventListener("scroll", () => {
      const dom = document.scrollingElement;
      if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 2e3) {
        loadImgInfo();
      }
      replaceCurrentPathname();
    });
  }
  if (/\/s\/.*\/.*/.test(window.location.pathname)) {
    setup$1();
  }

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  function getPageInfo() {
    const rows = +$("#gdo2 .ths").textContent.replace(" rows", "");
    const mode = $("#gdo4 .ths").textContent.toLowerCase();
    const pageSize = (mode === "normal" ? 10 : 5) * rows;
    const total = +$(".gtb p.gpc").textContent.match(new RegExp("of\\s(?<total>\\d+)\\simages")).groups.total;
    const url = new URL(window.location.href);
    let currentPage = 0;
    if (url.searchParams.has("p")) {
      currentPage = +url.searchParams.get("p");
    }
    const pageCount = +$(".gtb .ptb td:nth-last-child(2)").textContent;
    const unloadPageCount = pageCount - 1 - currentPage;
    let unloadPageLinks = Array(unloadPageCount).fill(0).map((_, i) => {
      url.searchParams.set("p", 1 + currentPage + i + "");
      return url.toString();
    });
    return {
      rows,
      mode,
      url,
      total,
      currentPage,
      pageSize,
      pageCount,
      unloadPageLinks,
      childrenClass: mode === "normal" ? "#gdt .gdtm" : "#gdt .gdtl"
    };
  }
  async function fetchNextDom(url, info) {
    const storageKey = url + info.mode;
    let html = session.getItem(storageKey) || await fetch(url).then((r) => r.text());
    const doc = new DOMParser().parseFromString(html, "text/html");
    if (doc.querySelector("#gdt")) {
      info.currentPage++;
      session.setItem(storageKey, html);
      const items = doc.querySelectorAll(info.childrenClass);
      items.forEach((node) => {
        node.setAttribute("data-page", info.currentPage + "");
      });
      return items;
    } else {
      return null;
    }
  }
  let isLoading = false;
  async function loadNextPage(info, mode) {
    if (isLoading)
      return;
    let url = info.unloadPageLinks.shift();
    if (url) {
      isLoading = true;
      const items = await fetchNextDom(url, info);
      isLoading = false;
      if (items) {
        if (mode === "large") {
          createPageIndex(info.currentPage);
        }
        $("#gdt").append(...items);
        $$("#gdt .c").forEach((node) => node.remove());
      }
    }
  }
  function createPageIndex(currentPage) {
    const dom = document.createElement("div");
    dom.innerText = currentPage + 1 + "";
    dom.className = "g-scroll-page-index";
    $("#gdt").append(dom);
  }
  function tinyGallery() {
    const info = getPageInfo();
    const handleScroll = () => {
      const dom = document.scrollingElement;
      if ($("#cdiv").getBoundingClientRect().y <= dom.scrollTop + dom.clientHeight + 2e3) {
        loadNextPage(info, "tiny");
      }
    };
    document.addEventListener("scroll", handleScroll);
  }
  function largeGallery() {
    const info = getPageInfo();
    $("#gdt").classList.add("g-scroll-body");
    $$(info.childrenClass).forEach((node) => {
      node.setAttribute("data-page", info.currentPage + "");
    });
    const replaceCurrentURL = debounce(function() {
      const imgs = document.querySelectorAll(info.childrenClass);
      const rect = $("#gdt").getBoundingClientRect();
      const base = rect.top + rect.height / 2;
      for (const img of imgs) {
        const { top, bottom } = img.getBoundingClientRect();
        if (top < base && bottom > base) {
          const page = img.dataset.page;
          const url = new URL(window.location.href);
          if (+page === 0) {
            url.searchParams.delete("p");
          } else {
            url.searchParams.set("p", page);
          }
          if (window.location.href !== url.toString()) {
            history.replaceState(null, "", url);
            const activeElement = (node, idx) => {
              node.className = "";
              if (idx === +page + 1) {
                node.className = "ptds";
              }
            };
            $$(".gtb .ptt td").forEach(activeElement);
            $$(".gtb .ptb td").forEach(activeElement);
          }
          return;
        }
      }
    }, 30);
    const handleScroll = () => {
      const dom = $("#gdt");
      if (dom.scrollHeight - 2e3 < dom.scrollTop + dom.clientHeight) {
        loadNextPage(info, "large");
      }
      replaceCurrentURL();
    };
    handleScroll();
    $("#gdt").addEventListener("scroll", handleScroll);
  }
  async function setup() {
    const info = getPageInfo();
    $("body").classList.add("e-hentai-infinite-scroll");
    if (!info.unloadPageLinks.length)
      return;
    if (info.unloadPageLinks.length > 2) {
      largeGallery();
    } else {
      tinyGallery();
    }
  }
  if (/\/g\/.*\/.*/.test(window.location.pathname)) {
    setup();
  }

})();
