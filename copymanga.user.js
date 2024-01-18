// ==UserScript==
// @name         修复copymanga图片错误
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/copymanga
// @version      1.5.5
// @license      MIT
// @description  处理图片资源加载失败时自动重新加载
// @author       IronKinoko
// @match        https://www.copymanga.org/*
// @match        https://www.copymanga.tv/*
// @match        https://www.copymanga.site/*
// @icon         https://www.google.com/s2/favicons?domain=www.copymanga.org
// @grant        none
// @noframes
// @require      https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/copymanga.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/copymanga.user.js
// ==/UserScript==
(function () {
  'use strict';

  function addErrorListener(img) {
    if (img.dataset.errorFix === "true")
      return;
    img.dataset.errorFix = "true";
    img.onerror = () => {
      const url = new URL(img.src);
      let v = parseInt(url.searchParams.get("v")) || 0;
      if (v > 5)
        return img.onerror = null;
      url.searchParams.set("v", ++v + "");
      img.src = url.toString();
      img.alt = "\u56FE\u7247\u52A0\u8F7D\u51FA\u9519";
    };
  }
  function h5URLToPC(href) {
    const url = new URL(href);
    const re = new RegExp("\\/h5\\/comicContent\\/(?<comicId>.*?)\\/(?<chapterId>.*)");
    const match = url.pathname.match(re);
    if (match) {
      const { comicId, chapterId } = match.groups;
      return `https://userscripts-proxy.vercel.app/api/copymanga/comic/${comicId}/chapter/${chapterId}`;
    }
    return null;
  }
  async function getChapterInfo() {
    const url = h5URLToPC(window.location.href);
    if (!url)
      throw new Error("\u8BF7\u5728\u79FB\u52A8\u7AEF\u8FD0\u884C");
    try {
      const data = await fetch(url).then((r) => r.json());
      if (!data.ok)
        throw new Error(data.message);
      return data;
    } catch (error) {
      console.error(error);
      alert(`\u63A5\u53E3\u8C03\u7528\u5931\u8D25 ${error.message}`);
      return { ok: false, manga: [] };
    }
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

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

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

  /** Error message constants. */
  var FUNC_ERROR_TEXT$1 = 'Expected a function';

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
      throw new TypeError(FUNC_ERROR_TEXT$1);
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
      var time = now();
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
      return timerId === undefined ? result : trailingEdge(now());
    }

    function debounced() {
      var time = now(),
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

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a throttled function that only invokes `func` at most once per
   * every `wait` milliseconds. The throttled function comes with a `cancel`
   * method to cancel delayed `func` invocations and a `flush` method to
   * immediately invoke them. Provide `options` to indicate whether `func`
   * should be invoked on the leading and/or trailing edge of the `wait`
   * timeout. The `func` is invoked with the last arguments provided to the
   * throttled function. Subsequent calls to the throttled function return the
   * result of the last `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the throttled function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.throttle` and `_.debounce`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to throttle.
   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=true]
   *  Specify invoking on the leading edge of the timeout.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * // Avoid excessively updating the position while scrolling.
   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
   *
   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
   * jQuery(element).on('click', throttled);
   *
   * // Cancel the trailing throttled invocation.
   * jQuery(window).on('popstate', throttled.cancel);
   */
  function throttle(func, wait, options) {
    var leading = true,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
      leading = 'leading' in options ? !!options.leading : leading;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      'leading': leading,
      'maxWait': wait,
      'trailing': trailing
    });
  }

  function setup() {
    customElements.define(
      "img-lazy",
      class ImgLazy extends HTMLElement {
        constructor() {
          super();
          this.timeout = 12e3;
          this.timeout = this.getAttribute("timeout") ? parseInt(this.getAttribute("timeout")) : this.timeout;
          const shadow = this.attachShadow({ mode: "open" });
          this.img = document.createElement("img");
          this.img.classList.add("loading");
          this.img.onload = () => {
            this.img.classList.remove("loading");
            clearTimeout(this.timeoutId);
          };
          this.img.onerror = () => {
            this.refreshImg();
          };
          this.ob = new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (!e.isIntersecting)
                  return;
                const src = this.getAttribute("src");
                if (!src)
                  return;
                this.img.src = src;
                this.timeoutId = window.setTimeout(() => {
                  this.refreshImg();
                }, this.timeout);
                this.ob.unobserve(this);
              });
            },
            { rootMargin: "2000px 0px", threshold: [0, 1] }
          );
          const style = document.createElement("style");
          style.innerHTML = `
        img { 
          display: block; 
          width: 100%; 
        }
        .loading { min-height: 500px }
      `;
          shadow.appendChild(style);
          shadow.appendChild(this.img);
        }
        connectedCallback() {
          this.ob.observe(this);
        }
        disconnectedCallback() {
          this.ob.disconnect();
        }
        static get observedAttributes() {
          return ["src"];
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
          if (attrName === "src") {
            this.ob.unobserve(this);
            this.ob.observe(this);
          }
        }
        refreshImg() {
          const url = new URL(this.img.src);
          let v = parseInt(url.searchParams.get("v")) || 0;
          v++;
          url.searchParams.set("v", v + "");
          this.img.src = "";
          this.img.src = url.toString();
          this.img.alt = `\u56FE\u7247\u52A0\u8F7D\u51FA\u9519 [${v}]`;
          this.timeoutId = window.setTimeout(() => {
            this.refreshImg();
            this.timeout = Math.max(this.timeout * 2, 6e4);
          }, this.timeout);
        }
      }
    );
  }

  function sleep(ms) {
    if (!ms) {
      return new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
    }
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function wait(selector) {
    let bool = selector();
    while (!bool) {
      await sleep();
      bool = selector();
    }
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
  createStorage(window.sessionStorage);
  const local = createStorage(window.localStorage);

  function normalizeKeyEvent(e) {
    const SPECIAL_KEY_EN = "`-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split("");
    const SPECIAL_KEY_ZH = "\xB7-=\u3010\u3011\u3001\uFF1B\u2018\uFF0C\u3002/\uFF5E\uFF01@#\xA5%\u2026&*\uFF08\uFF09\u2014+\u300C\u300D\uFF5C\uFF1A\u201C\u300A\u300B\uFF1F".split("");
    let key = e.key;
    if (e.code === "Space") {
      key = "Space";
    }
    if (/^[a-z]$/.test(key)) {
      key = key.toUpperCase();
    } else if (SPECIAL_KEY_ZH.includes(key)) {
      key = SPECIAL_KEY_EN[SPECIAL_KEY_ZH.indexOf(key)];
    }
    let keyArr = [];
    e.ctrlKey && keyArr.push("ctrl");
    e.metaKey && keyArr.push("meta");
    e.shiftKey && !SPECIAL_KEY_EN.includes(key) && keyArr.push("shift");
    e.altKey && keyArr.push("alt");
    if (!/Control|Meta|Shift|Alt/i.test(key))
      keyArr.push(key);
    keyArr = [...new Set(keyArr)];
    return keyArr.join("+");
  }
  function keybind(keys, keydown, keyup) {
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    keys = keys.filter((key) => !key.includes(isMac ? "ctrl" : "meta"));
    function createProcess(callback) {
      return function(e) {
        var _a;
        if (((_a = document.activeElement) == null ? void 0 : _a.tagName) === "INPUT")
          return;
        const normalizedKey = normalizeKeyEvent(e).toLowerCase();
        for (const key of keys) {
          if (key.toLowerCase() === normalizedKey)
            callback(e, key);
        }
      };
    }
    window.addEventListener("keydown", createProcess(keydown));
    if (keyup)
      window.addEventListener("keyup", createProcess(keyup));
  }

  async function waitDOM(selector, root = document) {
    await wait(() => !!root.querySelector(selector));
    return root.querySelector(selector);
  }

  function matcher(source, regexp) {
    if (typeof regexp === "string")
      return source.includes(regexp);
    return !!source.match(regexp);
  }
  function router(config) {
    const opts = {
      domain: "",
      routes: []
    };
    if ("routes" in config) {
      opts.domain = config.domain;
      opts.routes = config.routes;
    } else {
      opts.routes = Array.isArray(config) ? config : [config];
    }
    if (opts.domain) {
      const domains = Array.isArray(opts.domain) ? opts.domain : [opts.domain];
      const match = domains.some(
        (domain) => matcher(window.location.origin, domain)
      );
      if (!match)
        return;
    }
    const pathSource = window.location.pathname + window.location.search + window.location.hash;
    if (typeof opts.routes === "function") {
      opts.routes();
      return;
    }
    const routes = Array.isArray(opts.routes) ? opts.routes : [opts.routes];
    routes.forEach((route) => {
      let match = true;
      if (route.path) {
        match = matcher(pathSource, route.path);
      }
      if (route.pathname) {
        match = matcher(window.location.pathname, route.pathname);
      }
      if (route.search) {
        match = matcher(window.location.search, route.search);
      }
      if (route.hash) {
        match = matcher(window.location.hash, route.hash);
      }
      if (match)
        route.run();
    });
  }

  var T = {"Actions":"<div id=\"Actions\" class=\"k-actions\">\n  <div class=\"k-icon k-next\">\n    <svg       viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"1em\"\n      height=\"1em\"\n    >\n      <path         d=\"M769.792 476.032 416.48 125.92c-18.848-18.656-49.216-18.528-67.872 0.32-18.656 18.816-18.528 49.216 0.32 67.872l319.456 316.576-318.176 321.056c-18.656 18.816-18.528 49.216 0.32 67.872 9.344 9.28 21.568 13.92 33.792 13.92 12.352 0 24.704-4.736 34.08-14.208l350.112-353.312c0.512-0.512 0.672-1.248 1.184-1.792 0.128-0.128 0.288-0.16 0.416-0.288C788.736 525.088 788.64 494.688 769.792 476.032z\"\n      ></path>\n    </svg>\n  </div>\n  <div class=\"k-icon k-split\">\n    <svg       viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"1em\"\n      height=\"1em\"\n    >\n      <path         d=\"M132.939294 481.882353h227.20753v60.235294H132.939294l99.147294 99.147294-42.586353 42.586353L17.648941 512l171.91153-171.911529 42.586353 42.586353L132.939294 481.882353z m701.560471-141.793882l-42.586353 42.586353L891.060706 481.882353h-227.20753v60.235294h227.20753l-99.147294 99.147294 42.586353 42.586353L1006.351059 512l-171.851294-171.911529zM481.882353 1024h60.235294V0H481.882353v1024z\"\n      ></path>\n    </svg>\n  </div>\n  <div class=\"k-icon k-merge\">\n    <svg       viewBox=\"0 0 1024 1024\"\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"1em\"\n      height=\"1em\"\n    >\n      <path         d=\"M362.375529 613.556706a29.033412 29.033412 0 0 1-20.720941-8.613647l-0.963764-1.024a33.611294 33.611294 0 0 1-0.90353-45.116235l45.296941-47.706353h-224.677647V445.620706h224.195765l-44.393412-46.742588a33.611294 33.611294 0 0 1-0.903529-45.056l0.903529-1.084236a29.274353 29.274353 0 0 1 42.405647-1.084235l120.591059 126.976-119.145412 125.289412a28.912941 28.912941 0 0 1-21.684706 9.637647m340.931765 0a29.033412 29.033412 0 0 1-20.781176-8.613647L561.995294 478.027294l119.024941-125.289412a29.274353 29.274353 0 0 1 42.405647-1.084235l0.90353 1.084235a33.310118 33.310118 0 0 1 0.963764 44.754824l-45.357176 47.706353h224.256v65.897412h-224.075294l44.333176 46.742588a33.129412 33.129412 0 0 1 0.963765 44.634353l-0.963765 1.084235v0.481882a27.587765 27.587765 0 0 1-21.202823 9.517177m-579.102118 358.821647c-41.441882-3.553882-73.246118-39.152941-73.246117-83.727059V93.364706C50.898824 46.381176 86.136471 9.216 131.011765 9.216h267.986823c44.875294 0 80.112941 36.984471 80.112941 84.208941V177.694118h-62.644705V93.424941a19.456 19.456 0 0 0-4.818824-13.191529 18.672941 18.672941 0 0 0-12.528941-5.662118H130.951529a18.010353 18.010353 0 0 0-12.468705 5.541647 17.106824 17.106824 0 0 0-4.818824 12.769883v794.563764c0 11.685647 6.264471 18.251294 17.287529 18.251294h268.047059a18.010353 18.010353 0 0 0 12.468706-5.541647 17.106824 17.106824 0 0 0 4.818824-12.649411v-84.208942h62.223058v84.148706c0 47.224471-35.237647 84.208941-80.112941 84.208941H124.084706l0.12047 0.722824z m542.479059 0.481882c-44.815059 0-80.052706-36.984471-80.052706-84.208941v-84.208941h62.644706v84.208941c0 11.625412 6.264471 18.251294 17.287529 18.251294h268.649412a19.937882 19.937882 0 0 0 17.28753-18.251294V93.906824c0-11.625412-6.264471-18.251294-17.28753-18.251295h-268.528941a19.937882 19.937882 0 0 0-17.287529 18.251295V180.705882H586.691765V93.967059c0-47.224471 35.237647-84.208941 80.112941-84.208941h267.986823c44.875294 0 80.112941 36.984471 80.112942 84.208941v794.74447c0 47.224471-35.237647 84.208941-80.112942 84.208942h-268.167529z\"\n      ></path>\n    </svg>\n  </div>\n</div>"};

  async function openControl() {
    const li = await waitDOM("li.comicContentPopupImageItem");
    li.dispatchEvent(fakeClickEvent());
    await sleep(0);
    li.dispatchEvent(fakeClickEvent());
  }
  function fakeClickEvent() {
    const { width, height } = document.body.getBoundingClientRect();
    return new MouseEvent("click", { clientX: width / 2, clientY: height / 2 });
  }
  function getCurrentPage() {
    const scrollHeight = document.scrollingElement.scrollTop;
    const list = document.querySelectorAll("li.comicContentPopupImageItem");
    let height = 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      height += item.getBoundingClientRect().height;
      if (height > scrollHeight) {
        return i;
      }
    }
    return 0;
  }
  async function updatePageIndicator() {
    try {
      if (!/h5\/comicContent\/.*/.test(location.href))
        return;
      const list = document.querySelectorAll("li.comicContentPopupImageItem");
      const currentPage = getCurrentPage();
      const dom = document.querySelector(".comicContentPopup .comicFixed");
      dom.textContent = `${currentPage + 1}/${list.length}`;
    } catch (e) {
    }
  }
  async function restoreTabIdx() {
    if (!/h5\/details\/comic\/.*/.test(location.pathname))
      return;
    const LocalKey = "k-copymanga-tab-store";
    const [, id] = location.pathname.match(/h5\/details\/comic\/(.*)/);
    const store = local.getItem(LocalKey, {});
    await waitDOM(
      ".detailsTextContentTabs.van-tabs.van-tabs--line .van-tab:nth-child(2).van-tab--active"
    );
    const root = await waitDOM(".van-tabs");
    (async () => {
      var _a, _b;
      const prevActiveIdx = store[id];
      if (prevActiveIdx) {
        const [navIdx, itemIdx] = prevActiveIdx;
        if (navIdx) {
          const nav = await waitDOM(".van-tabs__nav");
          (_a = nav.children.item(navIdx)) == null ? void 0 : _a.click();
          if (itemIdx) {
            const nav2 = await waitDOM(
              `.van-tabs__content div:nth-child(${navIdx + 1}) .van-tabs__nav`
            );
            if (nav2) {
              (_b = nav2.children.item(itemIdx)) == null ? void 0 : _b.click();
            }
          }
        }
      }
    })();
    function getActiveIdx() {
      let idx = [];
      const list = root.querySelectorAll(".van-tabs__nav");
      list.forEach((nav, navIdx) => {
        Array.from(nav.children).forEach((item, itemIdx) => {
          if (item.classList.contains("van-tab--active")) {
            idx[navIdx] = itemIdx;
          }
        });
      });
      return idx;
    }
    const ob = new MutationObserver(() => {
      const idx = getActiveIdx();
      store[id] = idx;
      local.setItem(LocalKey, store);
    });
    ob.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });
  }
  let trackId = { current: 0 };
  async function runH5main() {
    try {
      restoreTabIdx();
      if (!/h5\/comicContent\/.*/.test(location.href))
        return;
      let runTrackId = ++trackId.current;
      const ulDom = await waitDOM(".comicContentPopupImageList");
      if (runTrackId !== trackId.current)
        return;
      const uuid = getComicId();
      const domUUID = ulDom.dataset.uuid;
      if (domUUID !== uuid) {
        ulDom.dataset.uuid = uuid;
      }
      await openControl();
      await injectImageData();
      const main = ulDom.parentElement;
      main.style.position = "unset";
      main.style.overflowY = "unset";
      createActionsUI();
    } catch (error) {
      throw error;
    }
  }
  async function createActionsUI() {
    let actionsDom = document.querySelector(".k-actions");
    if (!actionsDom) {
      actionsDom = $(T.Actions)[0];
      document.body.appendChild(actionsDom);
      addDragEvent(actionsDom);
      intiNextPartEvent();
      initSplitEvent();
      initMergeEvent();
    }
    if (!/h5\/comicContent\/.*/.test(location.href)) {
      actionsDom == null ? void 0 : actionsDom.classList.add("hide");
      return;
    } else {
      actionsDom.classList.remove("hide");
      $(".k-icon").removeClass("active");
    }
  }
  async function initSplitEvent() {
    $(".k-split").on("click", (e) => {
      var _a;
      const isActive = e.currentTarget.classList.toggle("active");
      const list = $("[data-k]");
      const currentPage = getCurrentPage();
      for (const item of list) {
        item.style.overflowX = "hidden";
        const imgs = $(item).find("img-lazy");
        if (isActive) {
          const url = imgs.attr("src");
          imgs.last().css({
            clipPath: "polygon(50% 0%, 50% 100%, 0% 100%, 0% 0%)",
            width: "200%",
            display: "block"
          });
          $("<img-lazy/>").attr("src", url).css({
            clipPath: "polygon(100% 0%, 100% 100%, 50% 100%, 50% 0%)",
            width: "200%",
            display: "block",
            transform: "translateX(-50%)"
          }).prependTo(item);
        } else {
          imgs.last().removeAttr("style");
          imgs.first().remove();
        }
      }
      (_a = $(`[data-idx="${currentPage}"]`).get(0)) == null ? void 0 : _a.scrollIntoView();
    });
  }
  async function initMergeEvent() {
    let activeArr = [];
    function run(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const li = e.currentTarget;
      const isActive = li.classList.toggle("merge-active");
      if (isActive) {
        activeArr.push(li);
      } else {
        activeArr = activeArr.filter((item) => item !== li);
      }
      if (activeArr.length === 2) {
        const [first, second] = activeArr;
        $(second).find("img-lazy").prependTo($(first));
        $(first).css({ display: "flex" });
        $(first).find("img-lazy").css({ width: "50%" });
        cleanup();
        $(".k-merge").removeClass("active");
      }
    }
    function setup() {
      document.querySelectorAll("[data-k]").forEach((item) => {
        item.addEventListener("click", run, { capture: true });
      });
    }
    function cleanup() {
      activeArr = [];
      document.querySelectorAll("[data-k]").forEach((item) => {
        item.removeEventListener("click", run, { capture: true });
        item.classList.remove("merge-active");
      });
    }
    $(".k-merge").on("click", (e) => {
      const isActive = e.currentTarget.classList.toggle("active");
      cleanup();
      if (isActive) {
        setup();
      }
    });
  }
  async function intiNextPartEvent() {
    let fixedNextBtn = document.querySelector(".k-next");
    fixedNextBtn.onclick = async (e) => {
      var _a;
      e.stopPropagation();
      let nextButton = document.querySelector(
        ".comicControlBottomTop > div:nth-child(3) > span"
      );
      if (!nextButton) {
        await openControl();
        nextButton = document.querySelector(
          ".comicControlBottomTop > div:nth-child(3) > span"
        );
      }
      if ((_a = nextButton == null ? void 0 : nextButton.parentElement) == null ? void 0 : _a.classList.contains("noneUuid")) {
        const comicHomeBtn = document.querySelector(
          ".comicControlBottomBottom > .comicControlBottomBottomItem:nth-child(1)"
        );
        comicHomeBtn == null ? void 0 : comicHomeBtn.click();
      } else {
        nextButton == null ? void 0 : nextButton.click();
      }
      document.scrollingElement.scrollTop = 0;
    };
  }
  function addDragEvent(fxiedDom) {
    let prevY = 0;
    let storeY = 0;
    const key = "next-part-btn-fixed-position";
    let position = local.getItem(key, {
      top: document.documentElement.clientHeight / 4,
      left: document.documentElement.clientWidth
    });
    const size = fxiedDom.getBoundingClientRect();
    const safeArea = {
      top: (y) => Math.min(
        Math.max(y, 0),
        document.documentElement.clientHeight - size.height
      ),
      left: (x) => Math.min(
        Math.max(x, 0),
        document.documentElement.clientWidth - size.width
      )
    };
    const setPosition = (position2, isMoving) => {
      fxiedDom.classList.remove("left", "right");
      fxiedDom.style.transition = isMoving ? "none" : "";
      fxiedDom.style.top = `${position2.top}px`;
      fxiedDom.style.left = `${position2.left}px`;
      if (!isMoving) {
        const halfScreenWidth = document.documentElement.clientWidth / 2;
        fxiedDom.classList.add(
          position2.left > halfScreenWidth ? "right" : "left"
        );
        fxiedDom.style.left = position2.left > halfScreenWidth ? `${document.documentElement.clientWidth - size.width}px` : "0px";
      }
    };
    setPosition(position, false);
    fxiedDom.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const { clientX, clientY } = touch;
      const { top, left } = fxiedDom.getBoundingClientRect();
      const diffX = clientX - left;
      const diffY = clientY - top;
      const move = (e2) => {
        e2.preventDefault();
        e2.stopPropagation();
        const touch2 = e2.touches[0];
        const { clientX: clientX2, clientY: clientY2 } = touch2;
        const x = safeArea.left(clientX2 - diffX);
        const y = safeArea.top(clientY2 - diffY);
        position = { top: y, left: x };
        setPosition(position, true);
      };
      const end = () => {
        local.setItem(key, position);
        setPosition(position, false);
        fxiedDom.style.removeProperty("transition");
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", end);
    });
    window.addEventListener(
      "scroll",
      throttle(() => {
        if (!/h5\/comicContent\/.*/.test(location.href)) {
          fxiedDom == null ? void 0 : fxiedDom.classList.add("hide");
          return;
        }
        const dom = document.scrollingElement;
        const currentY = dom.scrollTop;
        let diffY = currentY - storeY;
        if (currentY < 50 || currentY + dom.clientHeight > dom.scrollHeight - 800 || diffY < -30) {
          fxiedDom == null ? void 0 : fxiedDom.classList.remove("hide");
        } else {
          fxiedDom == null ? void 0 : fxiedDom.classList.add("hide");
        }
        if (currentY > prevY) {
          storeY = currentY;
        }
        prevY = currentY;
      }, 100)
    );
  }
  function getComicId() {
    const [, uuid] = location.href.match(/h5\/comicContent\/.*\/(.*)/);
    return uuid;
  }
  async function addH5HistoryListener() {
    history.pushState = _historyWrap("pushState");
    history.replaceState = _historyWrap("replaceState");
    window.addEventListener("pushState", runH5main);
    window.addEventListener("replaceState", runH5main);
    window.addEventListener("popstate", runH5main);
    window.addEventListener("scroll", throttle(updatePageIndicator, 100));
    runH5main();
  }
  const _historyWrap = function(type) {
    const orig = history[type];
    const e = new Event(type);
    return function() {
      const rv = orig.apply(this, arguments);
      window.dispatchEvent(e);
      return rv;
    };
  };
  async function injectImageData() {
    $(".comicContentPopup .comicFixed").addClass("loading");
    const info = await getChapterInfo();
    $(".comicContentPopup .comicFixed").removeClass("loading");
    let html = "";
    info.manga.forEach(({ url }, idx) => {
      html += `
    <li class="comicContentPopupImageItem" data-k data-idx="${idx}">
      <img-lazy src="${url}" />
    </li>
    `;
    });
    if (info.next) {
      const { comicId, chapterId } = info.next;
      const prefetchURLs = [
        `https://userscripts-proxy.vercel.app/api/copymanga/comic/${comicId}/chapter/${chapterId}`
      ];
      prefetchURLs.forEach((url) => {
        $("head").append(`<link rel="prefetch" href="${url}" data-k-prefetch />`);
      });
    }
    await waitDOM(".comicContentPopupImageList .comicContentPopupImageItem");
    $(".comicContentPopupImageItem").attr("class", "k-open-control-item").hide();
    $("[data-k]").remove();
    $(".comicContentPopupImageList").prepend(html);
    $(".comicContentPopupImageItem").on("click", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX;
      const y = e.clientY;
      if (innerWidth / 3 < x && x < innerWidth / 3 * 2 && innerHeight / 3 < y && y < innerHeight / 3 * 2) {
        const li = $(".k-open-control-item").get(0);
        li == null ? void 0 : li.dispatchEvent(fakeClickEvent());
      }
    });
    updatePageIndicator();
  }
  function h5() {
    addH5HistoryListener();
  }

  function replaceHeader() {
    const header = document.querySelector(
      ".container.header-log .row"
    );
    if (header) {
      header.style.flexWrap = "nowrap";
      $(header).find("div:nth-child(6)").replaceWith(
        `<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/shujia">\u6211\u7684\u4E66\u67B6</a>
            <div class="log-unboder"></div>
          </div>
        </div>`
      );
      $(header).find("div:nth-child(7)").replaceWith(
        `<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/liulan">\u6211\u7684\u6D4F\u89C8</a>
            <div class="log-unboder"></div>
          </div>
        </div>`
      );
      header.querySelector("div:nth-child(8)").className = "col";
      header.querySelector(
        "div.col > div > div"
      ).style.justifyContent = "flex-end";
    }
  }
  async function injectFixImg() {
    const listDOM = await waitDOM("ul.comicContent-list");
    async function injectEvent2() {
      const imgs = document.querySelectorAll("ul li img");
      imgs.forEach(addErrorListener);
    }
    const ob = new MutationObserver(injectEvent2);
    ob.observe(listDOM, { childList: true, subtree: true });
    injectEvent2();
  }
  async function injectFastLoadImg() {
    const $list = await waitDOM(".comicContent-list");
    function fastLoad() {
      const $imgs = $list.querySelectorAll("li img");
      $imgs.forEach(($img) => {
        if ($img.dataset.fastLoad === "true")
          return;
        $img.dataset.fastLoad = "true";
        $img.src = $img.dataset.src;
      });
    }
    const ob = new MutationObserver(fastLoad);
    ob.observe($list, { childList: true, subtree: true });
  }
  async function removeMouseupEvent() {
    await wait(() => !!document.body.onmouseup);
    document.body.onmouseup = null;
  }
  async function injectEvent() {
    keybind(["z", "x"], (e, key) => {
      var _a, _b;
      switch (key) {
        case "z": {
          (_a = document.querySelector(`[class='comicContent-prev'] a`)) == null ? void 0 : _a.click();
          break;
        }
        case "x": {
          (_b = document.querySelector(`[class='comicContent-next'] a`)) == null ? void 0 : _b.click();
          break;
        }
      }
    });
  }
  function pc() {
    if (/comic\/.*\/chapter/.test(location.href)) {
      injectFixImg();
      injectFastLoadImg();
      removeMouseupEvent();
      injectEvent();
    }
    replaceHeader();
  }

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".k-copymanga .k-actions {\n  position: fixed;\n  font-size: 20px;\n  transition: all 0.2s ease;\n  transform: translateX(0);\n  border-radius: 4px;\n  opacity: 1;\n  box-sizing: border-box;\n  overflow: hidden;\n  box-shadow: rgba(0, 0, 0, 0.2) -1px 1px 10px 0px;\n  background: white;\n}\n.k-copymanga .k-actions .k-icon {\n  padding: 8px;\n}\n.k-copymanga .k-actions .k-icon svg {\n  display: block;\n  fill: currentColor;\n}\n.k-copymanga .k-actions .k-icon.active {\n  background: rgb(44, 174, 254);\n  color: white;\n}\n.k-copymanga .k-actions .k-icon + .k-icon {\n  border-top: 1px solid #eee;\n}\n.k-copymanga .k-actions .k-next {\n  padding: 16px 8px;\n}\n.k-copymanga .k-actions.left {\n  border-radius: 0 4px 4px 0;\n  --transform-x: -100%;\n}\n.k-copymanga .k-actions.right {\n  border-radius: 4px 0 0 4px;\n  --transform-x: 100%;\n}\n.k-copymanga .k-actions.hide {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateX(var(--transform-x));\n}\n.k-copymanga .merge-active {\n  opacity: 0.5;\n  border: 1px solid red;\n}\n.k-copymanga .comicContentPopup .comicContentPopupImageList .comicContentPopupImageItem img {\n  display: block;\n  float: none;\n}\n.k-copymanga .comicContentPopup .comicContentPopupImageList > li[style] [role=alert],\n.k-copymanga .comicContentPopup .comicContentPopupImageList > li[style] [role=alert] + button {\n  display: none;\n}\n.k-copymanga .comicContentPopup .comicFixed {\n  position: fixed;\n  top: unset;\n  bottom: env(safe-area-inset-bottom);\n}\n.k-copymanga .comicContentPopup .comicFixed.loading {\n  width: auto;\n  min-width: 1.4rem;\n  padding: 0 1em;\n}\n.k-copymanga .comicContentPopup .comicFixed.loading::before {\n  content: \"Loading...\";\n  padding-right: 1em;\n}";
  n(css,{});

  setup();
  document.body.classList.add("k-copymanga");
  if (window.aboutBlank) {
    window.aboutBlank = () => {
    };
  }
  router([
    { pathname: /^\/h5/, run: h5 },
    { pathname: /^(?!\/h5)/, run: pc }
  ]);

})();
