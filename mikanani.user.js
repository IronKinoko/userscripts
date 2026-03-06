// ==UserScript==
// @name         mikanani
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/mikanani
// @version      1.0.0
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://mikanani.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mikanani.me
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/mikanani.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/mikanani.user.js
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
//#region src/home.ts
	function home() {
		addGlobalClickListener();
	}
	function addGlobalClickListener() {
		document.addEventListener("click", (e) => {
			const target = e.target;
			if (target.matches(".js-subscribe_bangumi")) {
				e.stopPropagation();
				(0, import_copy_to_clipboard.default)(`https://mikanani.me/RSS/Bangumi?bangumiId=${target.getAttribute("data-bangumiid")}&subgroupid=${target.getAttribute("data-subtitlegroupid")}`);
				target.innerHTML = "OK";
				target.classList.add("active");
				setTimeout(() => {
					target.innerHTML = "订";
					target.classList.remove("active");
				}, 1e3);
			}
		}, { capture: true });
	}

//#endregion
//#region src/index.ts
	router([{
		pathname: /^\/$/,
		run: home
	}]);

//#endregion
})();