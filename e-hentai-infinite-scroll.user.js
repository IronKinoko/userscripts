// ==UserScript==
// @name         e-hentai-infinite-scroll
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/e-hentai-infinite-scroll
// @version      1.3.10
// @description  Exhentai infinite scroll scripts.
// @author       IronKinoko
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @grant        none
// @require      https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/e-hentai-infinite-scroll.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/e-hentai-infinite-scroll.user.js
// ==/UserScript==
(function() {

//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) {
					__defProp(to, key, {
						get: ((k) => from[k]).bind(null, key),
						enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
					});
				}
			}
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));

//#endregion

//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_freeGlobal.js
/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == "object" && global && global.Object === Object && global;

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_root.js
/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function("return this")();

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_Symbol.js
/** Built-in value references. */
	var Symbol$1 = root.Symbol;

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_getRawTag.js
/** Used for built-in method references. */
	var objectProto = Object.prototype;
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString$1 = objectProto.toString;
	/** Built-in value references. */
	var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
	/**
	* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the raw `toStringTag`.
	*/
	function getRawTag(value) {
		var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
		try {
			value[symToStringTag$1] = void 0;
			var unmasked = true;
		} catch (e) {}
		var result = nativeObjectToString$1.call(value);
		if (unmasked) if (isOwn) value[symToStringTag$1] = tag;
		else delete value[symToStringTag$1];
		return result;
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_objectToString.js
/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString = Object.prototype.toString;
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

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_baseGetTag.js
/** `Object#toString` result references. */
	var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
	/** Built-in value references. */
	var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
	/**
	* The base implementation of `getTag` without fallbacks for buggy environments.
	*
	* @private
	* @param {*} value The value to query.
	* @returns {string} Returns the `toStringTag`.
	*/
	function baseGetTag(value) {
		if (value == null) return value === void 0 ? undefinedTag : nullTag;
		return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/isObjectLike.js
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
		return value != null && typeof value == "object";
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/isSymbol.js
/** `Object#toString` result references. */
	var symbolTag = "[object Symbol]";
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
		return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_trimmedEndIndex.js
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
		while (index-- && reWhitespace.test(string.charAt(index)));
		return index;
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/_baseTrim.js
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
		return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/isObject.js
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
		return value != null && (type == "object" || type == "function");
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/toNumber.js
/** Used as references for various `Number` constants. */
	var NAN = NaN;
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
		if (typeof value == "number") return value;
		if (isSymbol(value)) return NAN;
		if (isObject(value)) {
			var other = typeof value.valueOf == "function" ? value.valueOf() : value;
			value = isObject(other) ? other + "" : other;
		}
		if (typeof value != "string") return value === 0 ? value : +value;
		value = baseTrim(value);
		var isBinary = reIsBinary.test(value);
		return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/now.js
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

//#endregion
//#region ../../node_modules/.pnpm/lodash-es@4.17.23/node_modules/lodash-es/debounce.js
/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
	var nativeMax = Math.max, nativeMin = Math.min;
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
		var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
		if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
		wait = toNumber(wait) || 0;
		if (isObject(options)) {
			leading = !!options.leading;
			maxing = "maxWait" in options;
			maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
			trailing = "trailing" in options ? !!options.trailing : trailing;
		}
		function invokeFunc(time) {
			var args = lastArgs, thisArg = lastThis;
			lastArgs = lastThis = void 0;
			lastInvokeTime = time;
			result = func.apply(thisArg, args);
			return result;
		}
		function leadingEdge(time) {
			lastInvokeTime = time;
			timerId = setTimeout(timerExpired, wait);
			return leading ? invokeFunc(time) : result;
		}
		function remainingWait(time) {
			var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
			return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
		}
		function shouldInvoke(time) {
			var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
			return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
		}
		function timerExpired() {
			var time = now();
			if (shouldInvoke(time)) return trailingEdge(time);
			timerId = setTimeout(timerExpired, remainingWait(time));
		}
		function trailingEdge(time) {
			timerId = void 0;
			if (trailing && lastArgs) return invokeFunc(time);
			lastArgs = lastThis = void 0;
			return result;
		}
		function cancel() {
			if (timerId !== void 0) clearTimeout(timerId);
			lastInvokeTime = 0;
			lastArgs = lastCallTime = lastThis = timerId = void 0;
		}
		function flush() {
			return timerId === void 0 ? result : trailingEdge(now());
		}
		function debounced() {
			var time = now(), isInvoking = shouldInvoke(time);
			lastArgs = arguments;
			lastThis = this;
			lastCallTime = time;
			if (isInvoking) {
				if (timerId === void 0) return leadingEdge(lastCallTime);
				if (maxing) {
					clearTimeout(timerId);
					timerId = setTimeout(timerExpired, wait);
					return invokeFunc(lastCallTime);
				}
			}
			if (timerId === void 0) timerId = setTimeout(timerExpired, wait);
			return result;
		}
		debounced.cancel = cancel;
		debounced.flush = flush;
		return debounced;
	}

//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/typeof.js
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}

//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/toPrimitive.js
	function toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}

//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/toPropertyKey.js
	function toPropertyKey(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}

//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/defineProperty.js
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}

//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/objectSpread2.js
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}

//#endregion
//#region ../shared/src/utils/cookie.ts
	function set(arg1, arg2) {
		let options = {
			name: "",
			value: "",
			maxAge: 1440 * 60,
			path: "/"
		};
		if (typeof arg1 === "object") Object.assign(options, arg1);
		else {
			options.name = arg1;
			options.value = arg2;
		}
		options.value = encodeURIComponent(options.value);
		document.cookie = [
			`${options.name}=${options.value}`,
			`max-age=${options.maxAge}`,
			!!options.domain && `domain=${options.domain}`,
			!!options.path && `path=${options.path}`,
			!!options.sameSite && `sameSite=${options.sameSite}`,
			!!options.secure && `secure`
		].filter(Boolean).join(";");
	}
	function get(name) {
		let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		let arr = document.cookie.match(reg);
		if (arr) return decodeURIComponent(arr[2]);
		else return null;
	}
	function remove(arg1) {
		if (typeof arg1 === "string") set({
			name: arg1,
			value: "",
			maxAge: 0
		});
		else set(_objectSpread2(_objectSpread2({}, arg1), {}, { maxAge: 0 }));
	}
	const Cookie = {
		get,
		set,
		remove
	};

//#endregion
//#region ../../node_modules/.pnpm/toggle-selection@1.0.6/node_modules/toggle-selection/index.js
	var require_toggle_selection = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = function() {
			var selection = document.getSelection();
			if (!selection.rangeCount) return function() {};
			var active = document.activeElement;
			var ranges = [];
			for (var i = 0; i < selection.rangeCount; i++) ranges.push(selection.getRangeAt(i));
			switch (active.tagName.toUpperCase()) {
				case "INPUT":
				case "TEXTAREA":
					active.blur();
					break;
				default:
					active = null;
					break;
			}
			selection.removeAllRanges();
			return function() {
				selection.type === "Caret" && selection.removeAllRanges();
				if (!selection.rangeCount) ranges.forEach(function(range) {
					selection.addRange(range);
				});
				active && active.focus();
			};
		};
	}));

//#endregion
//#region ../../node_modules/.pnpm/copy-to-clipboard@3.3.3/node_modules/copy-to-clipboard/index.js
	var require_copy_to_clipboard = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var deselectCurrent = require_toggle_selection();
		var clipboardToIE11Formatting = {
			"text/plain": "Text",
			"text/html": "Url",
			"default": "Text"
		};
		var defaultMessage = "Copy to clipboard: #{key}, Enter";
		function format(message) {
			var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
			return message.replace(/#{\s*key\s*}/g, copyKey);
		}
		function copy(text, options) {
			var debug, message, reselectPrevious, range, selection, mark, success = false;
			if (!options) options = {};
			debug = options.debug || false;
			try {
				reselectPrevious = deselectCurrent();
				range = document.createRange();
				selection = document.getSelection();
				mark = document.createElement("span");
				mark.textContent = text;
				mark.ariaHidden = "true";
				mark.style.all = "unset";
				mark.style.position = "fixed";
				mark.style.top = 0;
				mark.style.clip = "rect(0, 0, 0, 0)";
				mark.style.whiteSpace = "pre";
				mark.style.webkitUserSelect = "text";
				mark.style.MozUserSelect = "text";
				mark.style.msUserSelect = "text";
				mark.style.userSelect = "text";
				mark.addEventListener("copy", function(e) {
					e.stopPropagation();
					if (options.format) {
						e.preventDefault();
						if (typeof e.clipboardData === "undefined") {
							debug && console.warn("unable to use e.clipboardData");
							debug && console.warn("trying IE specific stuff");
							window.clipboardData.clearData();
							var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
							window.clipboardData.setData(format, text);
						} else {
							e.clipboardData.clearData();
							e.clipboardData.setData(options.format, text);
						}
					}
					if (options.onCopy) {
						e.preventDefault();
						options.onCopy(e.clipboardData);
					}
				});
				document.body.appendChild(mark);
				range.selectNodeContents(mark);
				selection.addRange(range);
				if (!document.execCommand("copy")) throw new Error("copy command was unsuccessful");
				success = true;
			} catch (err) {
				debug && console.error("unable to copy using execCommand: ", err);
				debug && console.warn("trying IE specific stuff");
				try {
					window.clipboardData.setData(options.format || "text", text);
					options.onCopy && options.onCopy(window.clipboardData);
					success = true;
				} catch (err) {
					debug && console.error("unable to copy using clipboardData: ", err);
					debug && console.error("falling back to prompt");
					message = format("message" in options ? options.message : defaultMessage);
					window.prompt(message, text);
				}
			} finally {
				if (selection) if (typeof selection.removeRange == "function") selection.removeRange(range);
				else selection.removeAllRanges();
				if (mark) document.body.removeChild(mark);
				reselectPrevious();
			}
			return success;
		}
		module.exports = copy;
	}));

//#endregion
//#region ../shared/src/utils/copy.ts
	var import_copy_to_clipboard = /* @__PURE__ */ __toESM(require_copy_to_clipboard());

//#endregion
//#region ../shared/src/utils/storage.ts
	function createStorage(storage) {
		function getItem(key, defaultValue) {
			try {
				const value = storage.getItem(key);
				if (value) return JSON.parse(value);
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
	const local = createStorage(window.localStorage);

//#endregion
//#region ../shared/src/utils/router.ts
	function matcher(source, regexp) {
		if (typeof regexp === "string") return source.includes(regexp);
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
		} else opts.routes = Array.isArray(config) ? config : [config];
		if (opts.domain) {
			if (!(Array.isArray(opts.domain) ? opts.domain : [opts.domain]).some((domain) => matcher(window.location.origin, domain))) return;
		}
		const pathSource = window.location.pathname + window.location.search + window.location.hash;
		if (typeof opts.routes === "function") {
			opts.routes();
			return;
		}
		const runRoutes = (Array.isArray(opts.routes) ? opts.routes : [opts.routes]).filter((route) => {
			let match = true;
			if (route.path) match = matcher(pathSource, route.path);
			if (route.pathname) match = matcher(window.location.pathname, route.pathname);
			if (route.search) match = matcher(window.location.search, route.search);
			if (route.hash) match = matcher(window.location.hash, route.hash);
			return match;
		});
		runRoutes.forEach((route) => {
			if (route.setup) route.setup();
		});
		function run() {
			runRoutes.forEach((route) => {
				if (route.run) route.run();
			});
		}
		if (window.document.readyState === "complete") run();
		else window.addEventListener("load", run);
	}

//#endregion
//#region \0virtual:bocchi-style-runtime
	function injectStyle(css) {
		if (typeof document === "undefined") return;
		const style = document.createElement("style");
		style.setAttribute("data-bocchi", "");
		document.head.append(style);
		style.textContent = css;
	}

//#endregion
//#region src/index.scss
	injectStyle(".e-hentai-infinite-scroll.g #gd2 > * {\n  cursor: pointer;\n}\n.e-hentai-infinite-scroll.g #gd2 > *:active {\n  color: #2af;\n  text-decoration: underline;\n}\n.e-hentai-infinite-scroll.g #gdt::after {\n  content: \"\";\n  display: block;\n  clear: both;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body {\n  display: grid;\n  overflow: hidden auto;\n  max-height: 80vh;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body::-webkit-scrollbar {\n  width: 8px;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body::-webkit-scrollbar-thumb {\n  background-color: rgba(255, 255, 255, 0.15);\n  border-radius: 2px;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body.large {\n  grid-template-columns: repeat(5, 1fr);\n}\n@media screen and (max-width: 1230px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.large {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}\n@media screen and (max-width: 990px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.large {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n.e-hentai-infinite-scroll.g .g-scroll-body.normal {\n  grid-template-columns: repeat(10, 1fr);\n}\n@media screen and (max-width: 1230px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.normal {\n    grid-template-columns: repeat(8, 1fr);\n  }\n}\n@media screen and (max-width: 990px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.normal {\n    grid-template-columns: repeat(6, 1fr);\n  }\n}\n.e-hentai-infinite-scroll.g .g-scroll-page-index {\n  clear: both;\n  grid-column: 1/-1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.e-hentai-infinite-scroll.g .g-scroll-page-index::before, .e-hentai-infinite-scroll.g .g-scroll-page-index::after {\n  display: block;\n  content: \"\";\n  width: 40px;\n  height: 1px;\n  background: #ddd;\n  margin: 0 10px;\n}\n.e-hentai-infinite-scroll.s .auto-load-img {\n  width: 100% !important;\n  max-width: 100% !important;\n  margin: 0 !important;\n  padding: 10px;\n  display: block;\n  box-sizing: border-box;\n}\n.e-hentai-infinite-scroll.s .auto-load-img-empty {\n  min-height: 1000px;\n  width: 100px !important;\n  margin: 0 auto !important;\n}\n.e-hentai-infinite-scroll.s #i3 a {\n  pointer-events: none;\n}");

//#endregion
//#region src/views/g.ts
	const $$1 = (selector) => document.querySelector(selector);
	const $$ = (selector) => document.querySelectorAll(selector);
	function getPageInfo() {
		const mode = $$1("#gdt").className.includes("gt200") ? "large" : "normal";
		const pageSize = mode === "normal" ? 40 : 20;
		const total = +$$1(".gtb p.gpc").textContent.match(/* @__PURE__ */ new RegExp("of\\s(?<total>[0-9,]+)\\simages", "")).groups.total;
		const url = new URL(window.location.href);
		let currentPage = 0;
		if (url.searchParams.has("p")) currentPage = +url.searchParams.get("p");
		const pageCount = +$$1(".gtb .ptb td:nth-last-child(2)").textContent;
		const unloadPageCount = pageCount - 1 - currentPage;
		let unloadPageLinks = Array(unloadPageCount).fill(0).map((_, i) => {
			url.searchParams.set("p", 1 + currentPage + i + "");
			return url.toString();
		});
		return {
			mode,
			url,
			total,
			currentPage,
			pageSize,
			pageCount,
			unloadPageLinks,
			childrenClass: "#gdt > a"
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
		} else return null;
	}
	let isLoading = false;
	async function loadNextPage(info, mode) {
		if (isLoading) return;
		let url = info.unloadPageLinks.shift();
		if (url) {
			isLoading = true;
			const items = await fetchNextDom(url, info);
			isLoading = false;
			if (items) {
				createPageIndex(info.currentPage);
				$$1("#gdt").append(...items);
				$$("#gdt .c").forEach((node) => node.remove());
			}
		}
	}
	function createPageIndex(currentPage) {
		const dom = document.createElement("div");
		dom.innerText = currentPage + 1 + "";
		dom.className = "g-scroll-page-index";
		$$1("#gdt").append(dom);
	}
	function tinyGallery() {
		const info = getPageInfo();
		const handleScroll = () => {
			const dom = document.scrollingElement;
			if ($$1("#cdiv").getBoundingClientRect().y <= dom.scrollTop + dom.clientHeight + 2e3) loadNextPage(info, "tiny");
		};
		document.addEventListener("scroll", handleScroll);
	}
	function largeGallery() {
		const info = getPageInfo();
		$$1("#gdt").classList.add("g-scroll-body", info.mode);
		$$(info.childrenClass).forEach((node) => {
			node.setAttribute("data-page", info.currentPage + "");
		});
		const replaceCurrentURL = debounce(function() {
			const imgs = document.querySelectorAll(info.childrenClass);
			const rect = $$1("#gdt").getBoundingClientRect();
			const base = rect.top + rect.height / 2;
			for (const img of imgs) {
				const { top, bottom } = img.getBoundingClientRect();
				if (top < base && bottom > base) {
					const page = img.dataset.page;
					const url = new URL(window.location.href);
					if (+page === 0) url.searchParams.delete("p");
					else url.searchParams.set("p", page);
					if (window.location.href !== url.toString()) {
						history.replaceState(null, "", url);
						const activeElement = (node, idx) => {
							node.className = "";
							if (idx === +page + 1) node.className = "ptds";
						};
						$$(".gtb .ptt td").forEach(activeElement);
						$$(".gtb .ptb td").forEach(activeElement);
					}
					return;
				}
			}
		}, 30);
		const handleScroll = () => {
			const dom = $$1("#gdt");
			if (dom.scrollHeight - 2e3 < dom.scrollTop + dom.clientHeight) loadNextPage(info, "large");
			replaceCurrentURL();
		};
		handleScroll();
		$$1("#gdt").addEventListener("scroll", handleScroll);
	}
	function addWatchTag(tag) {
		return fetch("/mytags", {
			method: "POST",
			body: new URLSearchParams({
				usertag_action: "add",
				tagname_new: tag,
				tagwatch_new: "on",
				tagcolor_new: "",
				tagweight_new: "10",
				usertag_target: "0"
			})
		});
	}
	async function injectWatchTag() {
		const node = document.querySelector("#tagmenu_act");
		const inject = () => {
			const img = document.createElement("img");
			const a = document.createElement("a");
			const br = document.createElement("br");
			node.append(br, img, a);
			img.outerHTML = "<img src=\"https://ehgt.org/g/mr.gif\" class=\"mr\" alt=\">\"> ";
			a.href = "#";
			a.textContent = "Watch";
			a.addEventListener("click", (e) => {
				e.preventDefault();
				if (window.selected_tagname) addWatchTag(window.selected_tagname).then(() => {
					alert("success");
				}).catch((error) => {
					console.error(error);
					alert(error.message);
				});
			});
		};
		new MutationObserver(() => {
			if (node.style.display !== "none") inject();
		}).observe(node, { attributes: true });
	}
	function addTitleCopyEvent() {
		$$("#gd2>*").forEach(function(node) {
			node.addEventListener("click", function() {
				if (this.textContent) (0, import_copy_to_clipboard.default)(this.textContent);
			});
		});
	}
	async function setup$1() {
		injectWatchTag();
		addTitleCopyEvent();
		const info = getPageInfo();
		$$1("body").classList.add("e-hentai-infinite-scroll", "g");
		if (!info.unloadPageLinks.length) return;
		if (info.unloadPageLinks.length > 2) largeGallery();
		else tinyGallery();
	}

//#endregion
//#region src/views/checkCookie.ts
	function checkCookie() {
		const igneous = Cookie.get("igneous");
		if (!igneous || igneous === "mystery") {
			$("<button>refresh</button>").on("click", refresh).appendTo("body");
			$("<button>login</button>").on("click", login).appendTo("body");
		}
		if (igneous === "mystery") $("<h2>[Cookie] igneous error! Change system proxy and reload page</h2>").appendTo("body");
	}
	function refresh() {
		Cookie.remove({
			name: "yay",
			domain: ".exhentai.org"
		});
		Cookie.remove({
			name: "igneous",
			domain: ".exhentai.org"
		});
		Cookie.remove({
			name: "ipb_pass_hash",
			domain: ".exhentai.org"
		});
		Cookie.remove({
			name: "ipb_member_id",
			domain: ".exhentai.org"
		});
		window.location.reload();
	}
	function login() {
		window.location.href = "https://forums.e-hentai.org/index.php?act=Login&CODE=00";
	}

//#endregion
//#region src/views/s.ts
	const store = {};
	function parseI3(i3) {
		return i3.match(/* @__PURE__ */ new RegExp("'(?<key>.*)'.*src=\"(?<src>.*?\")(.*nl\\('(?<nl>.*)'\\))?", "")).groups;
	}
	function setupInfiniteScroll() {
		function api_call(page, nextImgKey) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", window.api_url);
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.withCredentials = true;
				xhr.addEventListener("loadend", () => {
					if (200 <= xhr.status && xhr.status <= 300) resolve(JSON.parse(xhr.response));
					else reject(xhr.response);
				});
				xhr.send(JSON.stringify({
					method: "showpage",
					gid: window.gid,
					page,
					imgkey: nextImgKey,
					showkey: window.showkey
				}));
			});
		}
		const maxPageSize = parseInt(document.querySelector("#i2 > div.sn > div > span:nth-child(2)").textContent);
		let nextImgKey = document.querySelector("#i3 a[onclick]").onclick.toString().match(/* @__PURE__ */ new RegExp("'(?<key>.*)'", "")).groups.key;
		let page = window.startpage + 1;
		let isLoading = false;
		async function loadImgInfo() {
			try {
				if (maxPageSize < page) return;
				if (isLoading) return;
				isLoading = true;
				const res = await api_call(page, nextImgKey);
				isLoading = false;
				const groups = parseI3(res.i3);
				const info = {
					key: res.k,
					nl: groups.nl,
					src: groups.src.slice(0, -1),
					source: res.s[0] === "/" ? res.s : "/" + res.s
				};
				store[res.k] = {
					info,
					res
				};
				renderImg(page, info);
				nextImgKey = groups.key;
				page++;
			} catch (error) {
				isLoading = false;
				console.error(error);
				await loadImgInfo();
			}
		}
		function renderImg(page, info) {
			const { key, source, src } = info;
			const img = document.createElement("img");
			img.setAttribute("src", src);
			img.dataset.imgKey = key;
			img.dataset.page = page + "";
			img.dataset.source = source;
			img.classList.add("auto-load-img");
			document.getElementById("i3").append(img);
		}
		function detectShouldLoadNextPage() {
			const dom = document.scrollingElement;
			if (dom.scrollHeight <= dom.scrollTop + dom.clientHeight + 2e3) loadImgInfo();
		}
		function resetDefaultImgDOM() {
			const groups = parseI3(document.querySelector("#i3").innerHTML);
			store[window.startkey] = {
				info: {
					key: window.startkey,
					nl: groups.nl,
					src: groups.src,
					source: location.pathname
				},
				res: {
					i: document.querySelector("#i4 > div").outerHTML,
					i3: document.querySelector("#i3").innerHTML,
					n: document.querySelector("#i4 > .sn").outerHTML,
					i5: document.querySelector("#i5").innerHTML,
					i6: document.querySelector("#i6").innerHTML,
					k: window.startkey,
					s: location.pathname
				}
			};
			const $img = document.querySelector("#i3 a img");
			$img.removeAttribute("style");
			$img.classList.add("auto-load-img");
			$img.dataset.imgKey = window.startkey;
			$img.dataset.source = location.pathname;
			document.getElementById("i3").append($img);
			document.querySelector("#i3 a").remove();
			removeSnAnchor();
		}
		document.body.classList.add("e-hentai-infinite-scroll", "s");
		resetDefaultImgDOM();
		detectShouldLoadNextPage();
		document.addEventListener("scroll", () => {
			detectShouldLoadNextPage();
			updateCurrentInfo();
		});
		new MutationObserver(() => {
			detectShouldLoadNextPage();
		}).observe(document.querySelector("#i3"), {
			childList: true,
			subtree: true,
			attributes: true
		});
	}
	function removeSnAnchor() {
		document.querySelectorAll(".sn a[onclick]").forEach((a) => {
			a.removeAttribute("onclick");
		});
	}
	function getCurrentActiveImg() {
		const imgs = document.querySelectorAll("#i3 img,#i3 img");
		for (const img of imgs) {
			const { top, bottom } = img.getBoundingClientRect();
			const base = 200;
			if (top < base && bottom > base) return img;
		}
		return null;
	}
	function updateCurrentPathname($img) {
		const source = $img.dataset.source;
		history.replaceState(null, "", source);
	}
	function updateBottomInfo($img) {
		const { res } = store[$img.dataset.imgKey];
		document.querySelector("#i2").innerHTML = res.n + res.i;
		document.querySelector("#i4").innerHTML = res.i + res.n;
		document.querySelector("#i5").innerHTML = res.i5;
		document.querySelector("#i6").innerHTML = res.i6;
		removeSnAnchor();
	}
	const updateCurrentInfo = debounce(function() {
		const $img = getCurrentActiveImg();
		if (!$img) return;
		const source = $img.dataset.source;
		if (location.pathname === source) return;
		updateCurrentPathname($img);
		updateBottomInfo($img);
	}, 30);
	function setup() {
		setupInfiniteScroll();
	}

//#endregion
//#region src/index.ts
	router({
		domain: "exhentai.org",
		routes: [{ run: checkCookie }]
	});
	router([{
		pathname: /^\/g\//,
		run: setup$1
	}, {
		pathname: /^\/s\//,
		run: setup
	}]);

//#endregion
})();