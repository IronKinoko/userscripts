// ==UserScript==
// @name         e-hentai-infinite-scroll
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/e-hentai-infinite-scroll
// @version      1.5.1
// @description  Exhentai infinite scroll scripts.
// @author       IronKinoko
// @match        https://e-hentai.org/*
// @match        https://exhentai.org/*
// @run-at       document-end
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
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_freeGlobal.js
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_root.js
	/** Detect free variable `self`. */
	var freeSelf = typeof self == "object" && self && self.Object === Object && self;
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function("return this")();
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_Symbol.js
	/** Built-in value references. */
	var Symbol$1 = root.Symbol;
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getRawTag.js
	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;
	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$1.hasOwnProperty;
	/**
	* Used to resolve the
	* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	* of values.
	*/
	var nativeObjectToString$1 = objectProto$1.toString;
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
		var isOwn = hasOwnProperty$3.call(value, symToStringTag$1), tag = value[symToStringTag$1];
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_objectToString.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseGetTag.js
	/** `Object#toString` result references. */
	var nullTag = "[object Null]";
	var undefinedTag = "[object Undefined]";
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isObjectLike.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isSymbol.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_trimmedEndIndex.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseTrim.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isObject.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/toNumber.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/isFunction.js
	/** `Object#toString` result references. */
	var asyncTag = "[object AsyncFunction]";
	var funcTag = "[object Function]";
	var genTag = "[object GeneratorFunction]";
	var proxyTag = "[object Proxy]";
	/**
	* Checks if `value` is classified as a `Function` object.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Lang
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a function, else `false`.
	* @example
	*
	* _.isFunction(_);
	* // => true
	*
	* _.isFunction(/abc/);
	* // => false
	*/
	function isFunction(value) {
		if (!isObject(value)) return false;
		var tag = baseGetTag(value);
		return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_coreJsData.js
	/** Used to detect overreaching core-js shims. */
	var coreJsData = root["__core-js_shared__"];
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_isMasked.js
	/** Used to detect methods masquerading as native. */
	var maskSrcKey = function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
		return uid ? "Symbol(src)_1." + uid : "";
	}();
	/**
	* Checks if `func` has its source masked.
	*
	* @private
	* @param {Function} func The function to check.
	* @returns {boolean} Returns `true` if `func` is masked, else `false`.
	*/
	function isMasked(func) {
		return !!maskSrcKey && maskSrcKey in func;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_toSource.js
	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = Function.prototype.toString;
	/**
	* Converts `func` to its source code.
	*
	* @private
	* @param {Function} func The function to convert.
	* @returns {string} Returns the source code.
	*/
	function toSource(func) {
		if (func != null) {
			try {
				return funcToString$1.call(func);
			} catch (e) {}
			try {
				return func + "";
			} catch (e) {}
		}
		return "";
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_baseIsNative.js
	/**
	* Used to match `RegExp`
	* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	*/
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	/** Used for built-in method references. */
	var funcProto = Function.prototype;
	var objectProto = Object.prototype;
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto.hasOwnProperty;
	/** Used to detect if a method is native. */
	var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty$2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
	/**
	* The base implementation of `_.isNative` without bad shim checks.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is a native function,
	*  else `false`.
	*/
	function baseIsNative(value) {
		if (!isObject(value) || isMasked(value)) return false;
		return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getValue.js
	/**
	* Gets the value at `key` of `object`.
	*
	* @private
	* @param {Object} [object] The object to query.
	* @param {string} key The key of the property to get.
	* @returns {*} Returns the property value.
	*/
	function getValue(object, key) {
		return object == null ? void 0 : object[key];
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getNative.js
	/**
	* Gets the native function at `key` of `object`.
	*
	* @private
	* @param {Object} object The object to query.
	* @param {string} key The key of the method to get.
	* @returns {*} Returns the function if it's native, else `undefined`.
	*/
	function getNative(object, key) {
		var value = getValue(object, key);
		return baseIsNative(value) ? value : void 0;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/eq.js
	/**
	* Performs a
	* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	* comparison between two values to determine if they are equivalent.
	*
	* @static
	* @memberOf _
	* @since 4.0.0
	* @category Lang
	* @param {*} value The value to compare.
	* @param {*} other The other value to compare.
	* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	* @example
	*
	* var object = { 'a': 1 };
	* var other = { 'a': 1 };
	*
	* _.eq(object, object);
	* // => true
	*
	* _.eq(object, other);
	* // => false
	*
	* _.eq('a', 'a');
	* // => true
	*
	* _.eq('a', Object('a'));
	* // => false
	*
	* _.eq(NaN, NaN);
	* // => true
	*/
	function eq(value, other) {
		return value === other || value !== value && other !== other;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_nativeCreate.js
	var nativeCreate = getNative(Object, "create");
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_hashClear.js
	/**
	* Removes all key-value entries from the hash.
	*
	* @private
	* @name clear
	* @memberOf Hash
	*/
	function hashClear() {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_hashDelete.js
	/**
	* Removes `key` and its value from the hash.
	*
	* @private
	* @name delete
	* @memberOf Hash
	* @param {Object} hash The hash to modify.
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function hashDelete(key) {
		var result = this.has(key) && delete this.__data__[key];
		this.size -= result ? 1 : 0;
		return result;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_hashGet.js
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	/**
	* Gets the hash value for `key`.
	*
	* @private
	* @name get
	* @memberOf Hash
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function hashGet(key) {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED$1 ? void 0 : result;
		}
		return hasOwnProperty$1.call(data, key) ? data[key] : void 0;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_hashHas.js
	/** Used to check objects for own properties. */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/**
	* Checks if a hash value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf Hash
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function hashHas(key) {
		var data = this.__data__;
		return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_hashSet.js
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = "__lodash_hash_undefined__";
	/**
	* Sets the hash `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf Hash
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the hash instance.
	*/
	function hashSet(key, value) {
		var data = this.__data__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
		return this;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_Hash.js
	/**
	* Creates a hash object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function Hash(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	Hash.prototype.clear = hashClear;
	Hash.prototype["delete"] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_listCacheClear.js
	/**
	* Removes all key-value entries from the list cache.
	*
	* @private
	* @name clear
	* @memberOf ListCache
	*/
	function listCacheClear() {
		this.__data__ = [];
		this.size = 0;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_assocIndexOf.js
	/**
	* Gets the index at which the `key` is found in `array` of key-value pairs.
	*
	* @private
	* @param {Array} array The array to inspect.
	* @param {*} key The key to search for.
	* @returns {number} Returns the index of the matched value, else `-1`.
	*/
	function assocIndexOf(array, key) {
		var length = array.length;
		while (length--) if (eq(array[length][0], key)) return length;
		return -1;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_listCacheDelete.js
	/** Built-in value references. */
	var splice = Array.prototype.splice;
	/**
	* Removes `key` and its value from the list cache.
	*
	* @private
	* @name delete
	* @memberOf ListCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function listCacheDelete(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) return false;
		if (index == data.length - 1) data.pop();
		else splice.call(data, index, 1);
		--this.size;
		return true;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_listCacheGet.js
	/**
	* Gets the list cache value for `key`.
	*
	* @private
	* @name get
	* @memberOf ListCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function listCacheGet(key) {
		var data = this.__data__, index = assocIndexOf(data, key);
		return index < 0 ? void 0 : data[index][1];
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_listCacheHas.js
	/**
	* Checks if a list cache value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf ListCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function listCacheHas(key) {
		return assocIndexOf(this.__data__, key) > -1;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_listCacheSet.js
	/**
	* Sets the list cache `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf ListCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the list cache instance.
	*/
	function listCacheSet(key, value) {
		var data = this.__data__, index = assocIndexOf(data, key);
		if (index < 0) {
			++this.size;
			data.push([key, value]);
		} else data[index][1] = value;
		return this;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_ListCache.js
	/**
	* Creates an list cache object.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function ListCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype["delete"] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_Map.js
	var Map = getNative(root, "Map");
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_mapCacheClear.js
	/**
	* Removes all key-value entries from the map.
	*
	* @private
	* @name clear
	* @memberOf MapCache
	*/
	function mapCacheClear() {
		this.size = 0;
		this.__data__ = {
			"hash": new Hash(),
			"map": new (Map || ListCache)(),
			"string": new Hash()
		};
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_isKeyable.js
	/**
	* Checks if `value` is suitable for use as unique object key.
	*
	* @private
	* @param {*} value The value to check.
	* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	*/
	function isKeyable(value) {
		var type = typeof value;
		return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_getMapData.js
	/**
	* Gets the data for `map`.
	*
	* @private
	* @param {Object} map The map to query.
	* @param {string} key The reference key.
	* @returns {*} Returns the map data.
	*/
	function getMapData(map, key) {
		var data = map.__data__;
		return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_mapCacheDelete.js
	/**
	* Removes `key` and its value from the map.
	*
	* @private
	* @name delete
	* @memberOf MapCache
	* @param {string} key The key of the value to remove.
	* @returns {boolean} Returns `true` if the entry was removed, else `false`.
	*/
	function mapCacheDelete(key) {
		var result = getMapData(this, key)["delete"](key);
		this.size -= result ? 1 : 0;
		return result;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_mapCacheGet.js
	/**
	* Gets the map value for `key`.
	*
	* @private
	* @name get
	* @memberOf MapCache
	* @param {string} key The key of the value to get.
	* @returns {*} Returns the entry value.
	*/
	function mapCacheGet(key) {
		return getMapData(this, key).get(key);
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_mapCacheHas.js
	/**
	* Checks if a map value for `key` exists.
	*
	* @private
	* @name has
	* @memberOf MapCache
	* @param {string} key The key of the entry to check.
	* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	*/
	function mapCacheHas(key) {
		return getMapData(this, key).has(key);
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_mapCacheSet.js
	/**
	* Sets the map `key` to `value`.
	*
	* @private
	* @name set
	* @memberOf MapCache
	* @param {string} key The key of the value to set.
	* @param {*} value The value to set.
	* @returns {Object} Returns the map cache instance.
	*/
	function mapCacheSet(key, value) {
		var data = getMapData(this, key), size = data.size;
		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/_MapCache.js
	/**
	* Creates a map cache object to store key-value pairs.
	*
	* @private
	* @constructor
	* @param {Array} [entries] The key-value pairs to cache.
	*/
	function MapCache(entries) {
		var index = -1, length = entries == null ? 0 : entries.length;
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype["delete"] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/memoize.js
	/** Error message constants. */
	var FUNC_ERROR_TEXT$2 = "Expected a function";
	/**
	* Creates a function that memoizes the result of `func`. If `resolver` is
	* provided, it determines the cache key for storing the result based on the
	* arguments provided to the memoized function. By default, the first argument
	* provided to the memoized function is used as the map cache key. The `func`
	* is invoked with the `this` binding of the memoized function.
	*
	* **Note:** The cache is exposed as the `cache` property on the memoized
	* function. Its creation may be customized by replacing the `_.memoize.Cache`
	* constructor with one whose instances implement the
	* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	* method interface of `clear`, `delete`, `get`, `has`, and `set`.
	*
	* @static
	* @memberOf _
	* @since 0.1.0
	* @category Function
	* @param {Function} func The function to have its output memoized.
	* @param {Function} [resolver] The function to resolve the cache key.
	* @returns {Function} Returns the new memoized function.
	* @example
	*
	* var object = { 'a': 1, 'b': 2 };
	* var other = { 'c': 3, 'd': 4 };
	*
	* var values = _.memoize(_.values);
	* values(object);
	* // => [1, 2]
	*
	* values(other);
	* // => [3, 4]
	*
	* object.a = 2;
	* values(object);
	* // => [1, 2]
	*
	* // Modify the result cache.
	* values.cache.set(object, ['a', 'b']);
	* values(object);
	* // => ['a', 'b']
	*
	* // Replace `_.memoize.Cache`.
	* _.memoize.Cache = WeakMap;
	*/
	function memoize(func, resolver) {
		if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT$2);
		var memoized = function() {
			var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
			if (cache.has(key)) return cache.get(key);
			var result = func.apply(this, args);
			memoized.cache = cache.set(key, result) || cache;
			return result;
		};
		memoized.cache = new (memoize.Cache || MapCache)();
		return memoized;
	}
	memoize.Cache = MapCache;
	//#endregion
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/now.js
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/debounce.js
	/** Error message constants. */
	var FUNC_ERROR_TEXT$1 = "Expected a function";
	var nativeMax = Math.max;
	var nativeMin = Math.min;
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
		if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT$1);
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
	//#region ../../node_modules/.pnpm/lodash-es@4.18.1/node_modules/lodash-es/throttle.js
	/** Error message constants. */
	var FUNC_ERROR_TEXT = "Expected a function";
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
		var leading = true, trailing = true;
		if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
		if (isObject(options)) {
			leading = "leading" in options ? !!options.leading : leading;
			trailing = "trailing" in options ? !!options.trailing : trailing;
		}
		return debounce(func, wait, {
			"leading": leading,
			"maxWait": wait,
			"trailing": trailing
		});
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.140.0/helpers/esm/typeof.js
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.140.0/helpers/esm/toPrimitive.js
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
	//#region \0@oxc-project+runtime@0.140.0/helpers/esm/toPropertyKey.js
	function toPropertyKey(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.140.0/helpers/esm/defineProperty.js
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	//#endregion
	//#region \0@oxc-project+runtime@0.140.0/helpers/esm/objectSpread2.js
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
	//#region ../shared/src/utils/copy.ts
	var import_copy_to_clipboard = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
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
	})))());
	//#endregion
	//#region ../shared/src/utils/sleep.ts
	function sleep(ms) {
		if (!ms) return new Promise((resolve) => {
			requestAnimationFrame(resolve);
		});
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}
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
	injectStyle(".e-hentai-infinite-scroll.g #gd2 > * {\n  cursor: pointer;\n}\n.e-hentai-infinite-scroll.g #gd2 > *:active {\n  color: #2af;\n  text-decoration: underline;\n}\n.e-hentai-infinite-scroll.g #gdt::after {\n  content: \"\";\n  display: block;\n  clear: both;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body {\n  display: grid;\n  overflow: hidden auto;\n  max-height: 80vh;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body::-webkit-scrollbar {\n  width: 8px;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body::-webkit-scrollbar-thumb {\n  background-color: rgba(255, 255, 255, 0.15);\n  border-radius: 2px;\n}\n.e-hentai-infinite-scroll.g .g-scroll-body.large {\n  grid-template-columns: repeat(5, 1fr);\n}\n@media screen and (max-width: 1230px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.large {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}\n@media screen and (max-width: 990px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.large {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n.e-hentai-infinite-scroll.g .g-scroll-body.normal {\n  grid-template-columns: repeat(10, 1fr);\n}\n@media screen and (max-width: 1230px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.normal {\n    grid-template-columns: repeat(8, 1fr);\n  }\n}\n@media screen and (max-width: 990px) {\n  .e-hentai-infinite-scroll.g .g-scroll-body.normal {\n    grid-template-columns: repeat(6, 1fr);\n  }\n}\n.e-hentai-infinite-scroll.g .g-scroll-page-index {\n  clear: both;\n  grid-column: 1/-1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.e-hentai-infinite-scroll.g .g-scroll-page-index::before, .e-hentai-infinite-scroll.g .g-scroll-page-index::after {\n  display: block;\n  content: \"\";\n  width: 40px;\n  height: 1px;\n  background: #ddd;\n  margin: 0 10px;\n}\n.e-hentai-infinite-scroll.s #i1 {\n  max-width: 1280px !important;\n  width: 100% !important;\n}\n.e-hentai-infinite-scroll.s .auto-load-item {\n  position: relative;\n  width: 100%;\n  --auto-load-ratio: 320 / 450;\n}\n.e-hentai-infinite-scroll.s .auto-load-placeholder {\n  margin: 10px;\n  width: calc(100% - 20px);\n  aspect-ratio: var(--auto-load-ratio);\n  min-height: 220px;\n  border-radius: 12px;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  background: linear-gradient(130deg, rgba(30, 30, 30, 0.92), rgba(46, 46, 46, 0.92));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  gap: 10px;\n  color: #d7d7d7;\n  font-size: 14px;\n  letter-spacing: 0.02em;\n  box-sizing: border-box;\n  text-align: center;\n}\n.e-hentai-infinite-scroll.s .auto-load-spinner-wrap {\n  position: relative;\n}\n.e-hentai-infinite-scroll.s .auto-load-spinner {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  border: 3px solid rgba(255, 255, 255, 0.24);\n  border-top-color: #ffffff;\n  animation: ehi-auto-load-spin 0.9s linear infinite;\n}\n.e-hentai-infinite-scroll.s .auto-load-indicator {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.e-hentai-infinite-scroll.s .auto-load-placeholder-text {\n  line-height: 1.4;\n  padding: 0 16px;\n  text-align: center;\n}\n.e-hentai-infinite-scroll.s .auto-load-item.is-loaded .auto-load-placeholder {\n  display: none;\n}\n.e-hentai-infinite-scroll.s .auto-load-img {\n  width: 100% !important;\n  max-width: 100% !important;\n  margin: 0 !important;\n  padding: 10px;\n  display: block;\n  box-sizing: border-box;\n  transition: opacity 0.24s ease;\n}\n.e-hentai-infinite-scroll.s .auto-load-img.is-loading {\n  opacity: 0;\n  pointer-events: none;\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.e-hentai-infinite-scroll.s .auto-load-img.is-loaded {\n  opacity: 1;\n}\n\n@keyframes ehi-auto-load-spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}");
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
	function parseI3(i3) {
		return i3.match(/* @__PURE__ */ new RegExp("'(?<key>.*)'.*src=\"(?<src>.*?)\"(.*nl\\('(?<nl>.*)'\\))?", "")).groups;
	}
	async function setupInfiniteScroll() {
		function createImgContainer(page) {
			const container = document.createElement("div");
			container.classList.add("k-img-item", "auto-load-item", "is-loading");
			container.setAttribute("data-idx", page.toString());
			const placeholder = document.createElement("div");
			placeholder.classList.add("auto-load-placeholder");
			const spinnerWrap = document.createElement("div");
			spinnerWrap.classList.add("auto-load-spinner-wrap");
			const spinner = document.createElement("div");
			spinner.classList.add("auto-load-spinner");
			const indicator = document.createElement("span");
			indicator.classList.add("auto-load-indicator");
			indicator.textContent = page + 1 + "";
			const label = document.createElement("span");
			label.classList.add("auto-load-placeholder-text");
			label.textContent = `Wait for image to load...`;
			const img = document.createElement("img");
			img.classList.add("auto-load-img", "is-loading");
			spinnerWrap.append(spinner);
			spinnerWrap.append(indicator);
			placeholder.append(spinnerWrap);
			placeholder.append(label);
			container.append(placeholder);
			container.append(img);
			return container;
		}
		const setPlaceholderText = (galleryImage, text) => {
			const placeholderText = galleryImage.container.querySelector(".auto-load-placeholder-text");
			if (placeholderText) placeholderText.innerHTML = text;
		};
		function bindImgLoadState(galleryImage) {
			const container = galleryImage.container;
			const img = container.querySelector("img.auto-load-img");
			img.src = galleryImage.imgUrl;
			const clearLoadingState = () => {
				var _container$querySelec;
				container.classList.remove("is-loading");
				container.classList.add("is-loaded");
				(_container$querySelec = container.querySelector(".auto-load-placeholder")) === null || _container$querySelec === void 0 || _container$querySelec.remove();
				img.classList.remove("is-loading");
				img.classList.add("is-loaded");
			};
			const MaxRetryCount = 3;
			let retryCount = 0;
			let timer = 0;
			const onDone = () => {
				clearTimeout(timer);
				if (img.complete && img.naturalWidth > 0) clearLoadingState();
				else {
					if (retryCount >= MaxRetryCount) {
						setPlaceholderText(galleryImage, "Failed to load image");
						return;
					}
					const retryUrl = new URL(img.src);
					retryUrl.searchParams.set("retry", retryCount.toString());
					img.src = retryUrl.toString();
					retryCount++;
					setPlaceholderText(galleryImage, `Load failed, retry #${retryCount}/${MaxRetryCount}...`);
					timer = window.setTimeout(onDone, retryCount * 1e4);
					img.decode().then(onDone).catch(onDone);
				}
			};
			setPlaceholderText(galleryImage, `Loading image...`);
			timer = window.setTimeout(onDone, 1e4);
			img.decode().then(onDone).catch(onDone);
		}
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
		async function getGalleryMeta() {
			const total = parseInt(document.querySelector("#i2 > div.sn > div > span:nth-child(2)").textContent);
			const currentPage = window.startpage - 1;
			const prevPageSize = local.getItem("e-hentai-infinite-scroll-page-size");
			let defaultPage = 0;
			if (prevPageSize) defaultPage = Math.floor(currentPage / parseInt(prevPageSize));
			const galleryUrl = document.querySelector("#i5 a").getAttribute("href");
			const { pages, pageSize, images } = await getGalleryPageMeta(galleryUrl, defaultPage);
			const galleryImages = Array.from({ length: total }).map((_, idx) => {
				const page = Math.floor(idx / pageSize);
				const indexInPage = idx % pageSize;
				const pageUrl = new URL(galleryUrl);
				pageUrl.searchParams.set("p", page.toString());
				return {
					state: 0,
					galleryUrl: `${pageUrl.toString()}`,
					page,
					idx,
					idxInPage: indexInPage,
					sourceUrl: "",
					imgUrl: "",
					container: createImgContainer(idx)
				};
			});
			images.forEach((image) => {
				galleryImages[image.idx].sourceUrl = image.sourceUrl;
			});
			galleryImages[currentPage].state = 3;
			galleryImages[currentPage].sourceUrl = window.location.href;
			galleryImages[currentPage].imgUrl = $("#i3 img").attr("src");
			return {
				total,
				pages,
				pageSize,
				galleryImages
			};
		}
		$("body").addClass("e-hentai-infinite-scroll s");
		const meta = await getGalleryMeta();
		$("#i3").empty();
		meta.galleryImages.forEach((galleryImage) => {
			const container = galleryImage.container;
			$("#i3").append(container);
		});
		await sleep();
		$(".k-img-item").get(window.startpage - 1).scrollIntoView({ block: "start" });
		let observer;
		function createObserver() {
			const observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const idx = parseInt(entry.target.getAttribute("data-idx"));
						updateBrowserHistory(idx);
						detectBoxInView(idx);
					}
				});
			}, { rootMargin: `-200px 0px -${document.body.clientHeight - 200 - 1}px 0px` });
			meta.galleryImages.forEach((galleryImage) => {
				observer.observe(galleryImage.container);
			});
			return observer;
		}
		observer = createObserver();
		window.addEventListener("resize", debounce(() => {
			observer.disconnect();
			observer = createObserver();
		}));
		const updateBrowserHistory = throttle((idx) => {
			if (meta.galleryImages[idx].sourceUrl) history.replaceState(null, "", meta.galleryImages[idx].sourceUrl);
		}, 100);
		const detectBoxInView = debounce((idx) => {
			for (let i = 0; i < meta.galleryImages.length; i++) {
				const galleryImage = meta.galleryImages[i];
				if (!galleryImage) continue;
				if (i >= idx - 1 && i < idx + 5) {
					if (galleryImage.state === 0) galleryImage.state = 1;
				} else if (galleryImage.state === 1) galleryImage.state = 0;
			}
		}, 100);
		while (true) {
			meta.galleryImages.filter((galleryImage) => galleryImage.state === 3).forEach((galleryImage) => {
				galleryImage.state = 4;
				bindImgLoadState(galleryImage);
			});
			const loadingList = meta.galleryImages.filter((galleryImage) => galleryImage.state === 2);
			if (loadingList.length >= 3) {
				await sleep(100);
				continue;
			}
			const waitingList = meta.galleryImages.filter((galleryImage) => galleryImage.state === 1);
			if (waitingList.length === 0) {
				await sleep(100);
				continue;
			}
			waitingList.slice(0, 3 - loadingList.length).forEach(async (galleryImage) => {
				galleryImage.state = 2;
				try {
					if (!galleryImage.sourceUrl) {
						setPlaceholderText(galleryImage, "Fetch page meta");
						try {
							(await getGalleryPageMeta(galleryImage.galleryUrl, galleryImage.page)).images.forEach((image) => {
								meta.galleryImages[image.idx].sourceUrl = image.sourceUrl;
							});
						} catch (error) {
							var _getGalleryPageMeta$c, _getGalleryPageMeta$c2;
							(_getGalleryPageMeta$c = (_getGalleryPageMeta$c2 = getGalleryPageMeta.cache).clear) === null || _getGalleryPageMeta$c === void 0 || _getGalleryPageMeta$c.call(_getGalleryPageMeta$c2);
							throw new Error("Failed to fetch page meta");
						}
					}
					if (!galleryImage.imgUrl) try {
						setPlaceholderText(galleryImage, "Fetch image url");
						const nextKey = galleryImage.sourceUrl.split("/").slice(-2)[0];
						galleryImage.imgUrl = parseI3((await api_call(galleryImage.idx + 1, nextKey)).i3).src;
					} catch (error) {
						throw new Error("Failed to fetch image url");
					}
					galleryImage.state = 3;
				} catch (error) {
					galleryImage.state = 1;
					setPlaceholderText(galleryImage, "Failed to load image");
				}
			});
			await sleep(100);
		}
	}
	const getGalleryPageMeta = memoize(async function getGalleryPageMeta(galleryUrl, page) {
		const url = new URL(galleryUrl);
		url.searchParams.set("p", page.toString());
		if (session.getItem(url.toString())) return session.getItem(url.toString());
		const text = await (await fetch(url.toString())).text();
		const doc = new DOMParser().parseFromString(text, "text/html");
		const pages = doc.querySelectorAll(".gtb .ptt td").length - 2;
		const pageSize = doc.querySelector("#gdt").classList.contains("gt200") ? 20 : 40;
		local.setItem("e-hentai-infinite-scroll-page-size", pageSize);
		const images = Array.from(doc.querySelector("#gdt").children).map((element, index) => {
			const url = $(element).attr("href");
			return {
				page,
				idx: parseInt(url.match(/-(\d+)$/)[1]) - 1,
				idxInPage: index,
				sourceUrl: url
			};
		});
		session.setItem(url.toString(), {
			pages,
			pageSize,
			images
		});
		return {
			pages,
			pageSize,
			images
		};
	});
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
