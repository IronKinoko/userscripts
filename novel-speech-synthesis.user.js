// ==UserScript==
// @name         novel-speech-synthesis
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/novel-speech-synthesis
// @version      1.0.11
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://hans.bilixs.com/*
// @match        https://www.bilixs.com/*
// @match        https://www.bilinovel.com/*
// @match        https://www.linovelib.com/*
// @match        https://novel18.syosetu.com/*
// @match        https://kakuyomu.jp/*
// @match        https://www.esjzone.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/novel-speech-synthesis.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/novel-speech-synthesis.user.js
// ==/UserScript==
(function () {
  'use strict';

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

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = "#speech {\n  position: fixed;\n  z-index: 999999999;\n  border: 1px solid #444;\n  border-radius: 8px;\n  transition: all 0.2s ease;\n  transform: translateX(0);\n  opacity: 1;\n  box-sizing: border-box;\n  overflow: hidden;\n  box-shadow: rgba(0, 0, 0, 0.2) -1px 1px 10px 0px;\n  background: #16161a;\n  text-align: center;\n}\n#speech.left {\n  border-radius: 0 8px 8px 0;\n  --transform-x: -100%;\n}\n#speech.right {\n  border-radius: 8px 0 0 8px;\n  --transform-x: 100%;\n}\n#speech.hide {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateX(var(--transform-x));\n}\n#speech * {\n  box-sizing: border-box;\n  user-select: none;\n}\n#speech .speech-controls-buttons {\n  font-size: 16px;\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n}\n#speech .speech-controls-button {\n  padding: 0 4px;\n  width: 35px;\n  height: 28px;\n  text-align: center;\n  cursor: pointer;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0;\n}\n#speech .speech-controls-button:nth-child(-n+3) {\n  border-right: 1px solid #444;\n}\n#speech select {\n  text-align: center;\n  appearance: none;\n  border: none;\n  background: transparent;\n  outline: none;\n  color: inherit;\n}\n#speech select option {\n  color: initial;\n}\n#speech .speech-controls-play {\n  cursor: pointer;\n}\n#speech .speech-controls-play svg {\n  margin: 0 auto;\n}\n#speech .speech-controls-play svg:nth-child(2) {\n  display: block;\n}\n#speech .speech-controls-play svg:nth-child(3) {\n  display: none;\n}\n#speech .speech-controls-play input:checked ~ svg:nth-child(2) {\n  display: none;\n}\n#speech .speech-controls-play input:checked ~ svg:nth-child(3) {\n  display: block;\n}\n#speech .speech-controls-continuous input:checked + span {\n  color: #1890ff;\n}\n#speech .speech-controls-disabled input:checked + svg {\n  color: #1890ff;\n}\n#speech .speech-controls-hide {\n  display: none !important;\n}\n#speech .speech-controls-voice {\n  grid-column: span 4;\n  width: 100%;\n  max-width: 140px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  border-top: 1px solid #444;\n  min-width: 0;\n}\n\n.speech-reading {\n  text-decoration: underline !important;\n  text-underline-offset: 0.4em !important;\n  text-decoration-style: dashed !important;\n}";
  n(css,{});

  var T = {"speech":"<div id=\"speech\">\n  <div class=\"speech-controls\">\n    <div class=\"speech-controls-buttons\">\n      <label class=\"speech-controls-button speech-controls-play\">\n        <input type=\"checkbox\" hidden >\n        <svg           viewBox=\"0 0 1024 1024\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          width=\"1em\"\n          height=\"1em\"\n        >\n          <path             d=\"M817.088 484.96l-512-323.744c-9.856-6.24-22.336-6.624-32.512-.992A31.993 31.993 0 0 0 256 188.256v647.328c0 11.648 6.336 22.4 16.576 28.032A31.82 31.82 0 0 0 288 867.584a32.107 32.107 0 0 0 17.088-4.928l512-323.616A31.976 31.976 0 0 0 832 512a31.976 31.976 0 0 0-14.912-27.04z\"\n            fill=\"currentColor\"\n          ></path>\n        </svg>\n        <svg           viewBox=\"0 0 1024 1024\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          width=\"1em\"\n          height=\"1em\"\n        >\n          <path             d=\"M597.333 816.64H768V219.307H597.333M256 816.64h170.667V219.307H256V816.64z\"\n            fill=\"currentColor\"\n          ></path>\n        </svg>\n      </label>\n      <label class=\"speech-controls-button speech-controls-disabled\">\n        <input type=\"checkbox\" hidden >\n        <svg           viewBox=\"0 0 1024 1024\"\n          xmlns=\"http://www.w3.org/2000/svg\"\n          width=\"1em\"\n          height=\"1em\"\n        >\n          <path             d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884z m288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z\"\n            fill=\"currentColor\"\n          ></path>\n        </svg>\n      </label>\n      <select class=\"speech-controls-button speech-controls-rate\">\n        <option value=\"0.25\">0.25x</option>\n        <option value=\"0.3\">0.3x</option>\n        <option value=\"0.4\">0.4x</option>\n        <option value=\"0.5\">0.5x</option>\n        <option value=\"0.75\">0.75x</option>\n        <option value=\"1\">1x</option>\n        <option value=\"1.25\">1.25x</option>\n        <option value=\"1.5\">1.5x</option>\n        <option value=\"1.75\">1.75x</option>\n        <option value=\"2\">2x</option>\n        <option value=\"2.25\">2.25x</option>\n        <option value=\"2.5\">2.5x</option>\n        <option value=\"3\">3x</option>\n        <option value=\"3.5\">3.5x</option>\n        <option value=\"4\">4x</option>\n        <option value=\"4.5\">4.5x</option>\n        <option value=\"5\">5x</option>\n        <option value=\"6\">6x</option>\n        <option value=\"7\">7x</option>\n        <option value=\"8\">8x</option>\n        <option value=\"9\">9x</option>\n        <option value=\"10\">10x</option>\n      </select>\n      <label class=\"speech-controls-button speech-controls-continuous\">\n        <input type=\"checkbox\" hidden >\n        <span>C</span>\n      </label>\n      <select class=\"speech-controls-button speech-controls-voice\"></select>\n    </div>\n  </div>\n</div>"};

  const mouseEvent = {
    Down: "mousedown",
    Move: "mousemove",
    Up: "mouseup"
  };
  const touchEvent = {
    Down: "touchstart",
    Move: "touchmove",
    Up: "touchend"
  };
  const EventMap = "ontouchstart" in window ? touchEvent : mouseEvent;
  function getPoint(e) {
    return "ontouchstart" in window ? e.touches[0] : e;
  }
  class Drag {
    constructor(fxiedDom) {
      this.fxiedDom = fxiedDom;
      this.addDragEvent();
    }
    setPosition(position, isMoving) {
      const safeArea = {
        top: (y) => Math.min(
          Math.max(y, 0),
          document.documentElement.clientHeight - this.fxiedDom.getBoundingClientRect().height
        ),
        left: (x) => Math.min(
          Math.max(x, 0),
          document.documentElement.clientWidth - this.fxiedDom.getBoundingClientRect().width
        )
      };
      const left = safeArea.left(position.left);
      const top = safeArea.top(position.top);
      this.fxiedDom.classList.remove("left", "right");
      this.fxiedDom.style.transition = isMoving ? "none" : "";
      this.fxiedDom.style.top = `${top}px`;
      this.fxiedDom.style.left = `${left}px`;
      if (!isMoving) {
        const screenWidth = document.documentElement.clientWidth;
        const halfScreenWidth = screenWidth / 2;
        const width = this.fxiedDom.getBoundingClientRect().width;
        const isRight = left + width / 2 > halfScreenWidth;
        this.fxiedDom.classList.add(isRight ? "right" : "left");
        this.fxiedDom.style.left = isRight ? `${screenWidth - width}px` : "0px";
      }
    }
    addDragEvent() {
      const key = "speech-fixed-position";
      let position = local.getItem(key, {
        top: document.documentElement.clientHeight / 4,
        left: document.documentElement.clientWidth
      });
      this.setPosition(position, false);
      this.fxiedDom.addEventListener(EventMap.Down, (e) => {
        const { clientX, clientY } = getPoint(e);
        const { top, left } = this.fxiedDom.getBoundingClientRect();
        const diffX = clientX - left;
        const diffY = clientY - top;
        const move = (e2) => {
          e2.preventDefault();
          e2.stopPropagation();
          const { clientX: clientX2, clientY: clientY2 } = getPoint(e2);
          const x = clientX2 - diffX;
          const y = clientY2 - diffY;
          position = { top: y, left: x };
          this.setPosition(position, true);
        };
        const end = (e2) => {
          local.setItem(key, position);
          this.setPosition(position, false);
          this.fxiedDom.style.removeProperty("transition");
          window.removeEventListener(EventMap.Move, move);
          window.removeEventListener(EventMap.Up, end);
        };
        window.addEventListener(EventMap.Move, move, { passive: false });
        window.addEventListener(EventMap.Up, end);
      });
      let prevY = 0;
      window.addEventListener(
        "scroll",
        throttle(() => {
          var _a;
          const dom = document.scrollingElement;
          const currentY = dom.scrollTop;
          let diffY = currentY - prevY;
          if (Math.abs(diffY) > 30) {
            (_a = this.fxiedDom) == null ? void 0 : _a.classList.toggle("hide", diffY > 0);
            prevY = currentY;
          }
        }, 16)
      );
    }
  }

  class Speech {
    constructor(opts) {
      this.opts = opts;
      this.elements = null;
      this.utterance = {
        rate: 1.5,
        voiceURI: null,
        continuous: true,
        disabled: false
      };
      this.voices = [];
      this.paragraphDisposeList = [];
      this.speakDispose = null;
      this.loadUtterance();
      this.setupParagraph();
      this.createUI();
    }
    get paragraphList() {
      return this.opts.getParagraph();
    }
    setupParagraph() {
      if (this.paragraphDisposeList.length) {
        this.paragraphDisposeList.forEach((fn) => fn());
        this.paragraphDisposeList = [];
      }
      this.paragraphDisposeList = this.paragraphList.map((p, idx) => {
        p.setAttribute("data-speech-idx", idx.toString());
        const fn = () => {
          var _a;
          if (this.utterance.disabled)
            return;
          let current = idx;
          let cancel = false;
          (_a = this.speakDispose) == null ? void 0 : _a.call(this);
          const speak = async () => {
            if (cancel)
              return;
            await this.speakParagraph(current);
            if (current < this.paragraphList.length) {
              current++;
              speak();
            }
          };
          this.speakDispose = () => {
            cancel = true;
          };
          speak();
        };
        p.addEventListener("click", fn);
        return () => {
          p.removeAttribute("data-speech-idx");
          p.removeEventListener("click", fn);
        };
      });
    }
    createUI() {
      const root = new DOMParser().parseFromString(T.speech, "text/html").body.children[0];
      const container = document.querySelector(this.opts.container);
      if (!container)
        throw new Error("container not found");
      container.appendChild(root);
      window.addEventListener("beforeunload", () => {
        this.cancel();
      });
      this.elements = {
        root,
        play: root.querySelector(".speech-controls-play input"),
        voice: root.querySelector(".speech-controls-voice"),
        rate: root.querySelector(".speech-controls-rate"),
        continuous: root.querySelector(".speech-controls-continuous input"),
        disabled: root.querySelector(".speech-controls-disabled input")
      };
      this.drag = new Drag(root);
      this.elements.play.addEventListener("change", (e) => {
        const target = e.target;
        if (target.checked) {
          window.speechSynthesis.resume();
        } else {
          window.speechSynthesis.pause();
        }
      });
      this.onVoices((voices) => {
        var _a;
        if (voices.length === 0)
          return;
        this.voices = voices.filter((voice) => voice.lang === this.opts.lang);
        this.elements.voice.innerHTML = this.voices.map((v) => `<option value="${v.voiceURI}">${v.name}</option>`).join("");
        if (this.utterance.voiceURI) {
          this.elements.voice.value = this.utterance.voiceURI;
          this.refreshSpeech();
        }
        if (this.utterance.continuous && this.currentSpeakingParagraphIdx === null) {
          (_a = this.paragraphList[0]) == null ? void 0 : _a.click();
        }
      });
      this.elements.voice.value = this.utterance.voiceURI || "";
      this.elements.voice.addEventListener("change", (e) => {
        const target = e.target;
        const find = this.voices.find((voice) => voice.voiceURI === target.value);
        if (find) {
          this.utterance.voiceURI = find.voiceURI;
          this.saveUtterance();
          this.refreshSpeech();
        }
      });
      this.elements.rate.value = this.utterance.rate.toString();
      this.elements.rate.addEventListener("change", (e) => {
        const target = e.target;
        this.utterance.rate = Number(target.value);
        this.saveUtterance();
        this.refreshSpeech();
      });
      this.elements.continuous.checked = this.utterance.continuous;
      this.elements.continuous.addEventListener("change", (e) => {
        const target = e.target;
        this.utterance.continuous = target.checked;
        this.saveUtterance();
      });
      this.elements.disabled.checked = this.utterance.disabled;
      this.elements.disabled.addEventListener("change", (e) => {
        const target = e.target;
        this.utterance.disabled = target.checked;
        window.speechSynthesis.cancel();
        this.saveUtterance();
      });
      this.updateMenuUI();
      keybind(["space"], (e) => {
        e.preventDefault();
        this.elements.play.click();
      });
    }
    updateMenuUI() {
      this.elements.root.querySelectorAll(".speech-controls-button").forEach(
        (dom) => {
          if (dom.classList.contains("speech-controls-menu"))
            return;
        }
      );
      this.drag.setPosition(
        {
          left: Number(this.elements.root.style.left.replace("px", "")),
          top: Number(this.elements.root.style.top.replace("px", ""))
        },
        false
      );
    }
    refreshSpeech() {
      const idx = this.currentSpeakingParagraphIdx;
      if (idx === null)
        return;
      const p = this.paragraphList[idx];
      p == null ? void 0 : p.click();
    }
    saveUtterance() {
      localStorage.setItem("speech-utterance", JSON.stringify(this.utterance));
    }
    loadUtterance() {
      const utterance = localStorage.getItem("speech-utterance");
      if (utterance) {
        this.utterance = JSON.parse(utterance);
      }
    }
    onVoices(callback) {
      callback(window.speechSynthesis.getVoices());
      window.speechSynthesis.onvoiceschanged = () => {
        callback(window.speechSynthesis.getVoices());
      };
    }
    speakParagraph(index) {
      return new Promise((resolve, reject) => {
        window.speechSynthesis.cancel();
        this.elements.play.checked = true;
        const scrollElement = this.opts.scrollElement ? document.querySelector(this.opts.scrollElement) : document.scrollingElement;
        document.querySelectorAll(".speech-reading").forEach((p2) => {
          p2.classList.remove("speech-reading");
        });
        const p = this.paragraphList[index];
        if (p && p.textContent) {
          const utterance = new SpeechSynthesisUtterance(p.textContent);
          utterance.lang = this.opts.lang;
          utterance.rate = this.utterance.rate;
          utterance.voice = this.voices.find(
            (voice) => this.utterance.voiceURI === voice.voiceURI
          ) || null;
          utterance.addEventListener("start", (e) => {
            console.log("start", e);
            p.classList.add("speech-reading");
            if (scrollElement) {
              const { y } = p.getBoundingClientRect();
              if (top) {
                scrollElement.scrollBy({ top: y - 100, behavior: "smooth" });
              }
            }
          });
          utterance.addEventListener("end", (e) => {
            console.log("end", e);
            p.classList.remove("speech-reading");
            if (this.utterance.continuous && index === this.paragraphList.length - 1) {
              this.opts.nextChapter();
            }
            resolve();
          });
          utterance.addEventListener("error", (e) => {
            console.error("error", e);
            p.classList.remove("speech-reading");
            console.error(e);
            reject(e);
          });
          console.log("utterance", utterance);
          window.speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      });
    }
    resume() {
      window.speechSynthesis.resume();
    }
    pause() {
      window.speechSynthesis.pause();
    }
    cancel() {
      window.speechSynthesis.cancel();
    }
    get speaking() {
      return window.speechSynthesis.speaking;
    }
    get pending() {
      return window.speechSynthesis.pending;
    }
    get currentSpeakingParagraphIdx() {
      const dom = document.querySelector(".speech-reading");
      if (!dom)
        return null;
      return Number(dom.getAttribute("data-speech-idx"));
    }
  }

  const adapters = [
    {
      domain: ["bilixs.com"],
      routes: [
        {
          path: /novel\/.*\/.*\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector(".article-content");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              const dom = document.querySelector(".footer .f-right");
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    },
    {
      domain: ["linovelib.com"],
      routes: [
        {
          path: /novel\/.*\/.*\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector(".read-content");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p")).filter(
                (o) => o.clientHeight
              );
            },
            nextChapter() {
              var _a;
              const dom = document.querySelectorAll(".mlfy_page a");
              (_a = Array.from(dom).find((d) => d.innerText.match(/下一[章页]/))) == null ? void 0 : _a.click();
            }
          },
          run() {
            const speech = new Speech(this.speech);
            const ob = new MutationObserver(() => {
              if (speech.paragraphList.length !== speech.opts.getParagraph().length) {
                speech.setupParagraph();
              }
            });
            ob.observe(document.querySelector(".read-content"), {
              childList: true
            });
          }
        }
      ]
    },
    {
      domain: ["bilinovel.com"],
      routes: [
        {
          path: /novel\/.*\/.*\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector("#acontentz");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              var _a;
              (_a = document.querySelector("#footlink > a:last-child")) == null ? void 0 : _a.click();
            }
          },
          run() {
            const speech = new Speech(this.speech);
            const ob = new MutationObserver(() => {
              if (speech.paragraphList.length !== speech.opts.getParagraph().length) {
                speech.setupParagraph();
              }
            });
            ob.observe(document.querySelector("#acontentz"), {
              childList: true
            });
          }
        }
      ]
    },
    {
      domain: ["novel18.syosetu.com"],
      routes: [
        {
          pathname: /^\/([^/]+?)\/([^/]+?)\/?$/,
          speech: {
            container: "body",
            lang: "ja-JP",
            getParagraph: () => {
              const content = document.querySelector("#novel_honbun");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter: () => {
              let dom = document.querySelector(
                '.novel_bn a[rel="next"]'
              );
              if (!dom) {
                dom = document.querySelector(
                  ".novel_bn a:last-child"
                );
              }
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    },
    {
      domain: ["esjzone.cc"],
      routes: [
        {
          path: /forum\/[^/]+\/[^/]+\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector(".forum-content");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              const dom = document.querySelector(".btn-next");
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    },
    {
      domain: ["kakuyomu.jp"],
      routes: [
        {
          pathname: /^\/works\/\d+\/episodes\/\d+$/,
          speech: {
            container: "body",
            lang: "ja-JP",
            getParagraph: () => {
              const content = document.querySelector(".widget-episodeBody");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              const dom = document.querySelector(
                "#contentMain-readNextEpisode"
              );
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    }
  ];

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
  adapters.forEach((adapter) => {
    router({
      domain: adapter.domain,
      routes: adapter.routes.map((route) => {
        return __spreadProps(__spreadValues({}, route), {
          run: () => {
            if (route.run) {
              route.run();
            } else if (route.speech)
              new Speech(route.speech);
          }
        });
      })
    });
  });

})();
