// ==UserScript==
// @name         Steam 批量出售
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/steam-multisell
// @version      1.1.4
// @license      MIT
// @description  修复批量出售 Steam 库存时出现“您的库存当前不可用”的问题，并且在货物详情页面增加批量出售按钮
// @author       IronKinoko
// @match        https://steamcommunity.com/market/listings/*
// @match        https://steamcommunity.com/market/multisell*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/steam-multisell.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/steam-multisell.user.js
// ==/UserScript==
(function() {
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
	//#region ../shared/src/utils/wait.ts
	async function wait(selector) {
		let bool = await selector();
		while (!bool) {
			await sleep();
			bool = await selector();
		}
	}
	//#endregion
	//#region ../shared/src/utils/dom.ts
	async function waitDOM(selector, root = document) {
		await wait(() => !!root.querySelector(selector));
		return root.querySelector(selector);
	}
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
	//#region src/market/listings.ts
	function queryElementByText(selector, text) {
		return Array.from(document.querySelectorAll(selector)).find((el) => {
			var _el$textContent;
			return ((_el$textContent = el.textContent) === null || _el$textContent === void 0 ? void 0 : _el$textContent.trim()) === text;
		});
	}
	function run$1() {
		setInterval(createMultisellButton, 16);
	}
	function createMultisellButton() {
		var _sellBtn$parentElemen;
		if (queryElementByText("button", "批量出售")) return;
		const sellBtn = queryElementByText("button", "出售");
		if (!sellBtn) return;
		const warp = document.createElement("div");
		warp.style.display = "flex";
		warp.style.gap = "8px";
		(_sellBtn$parentElemen = sellBtn.parentElement) === null || _sellBtn$parentElemen === void 0 || _sellBtn$parentElemen.insertBefore(warp, sellBtn);
		warp.appendChild(sellBtn);
		const anchor = document.createElement("a");
		const batchSellBtn = sellBtn.cloneNode(true);
		batchSellBtn.textContent = "批量出售";
		anchor.appendChild(batchSellBtn);
		warp.appendChild(anchor);
		const [id, item] = extractLastSegment();
		anchor.href = `https://steamcommunity.com/market/multisell?appid=${id}&contextid=2&items[]=${item}`;
		function extractLastSegment() {
			const [appid, item] = window.location.pathname.split("/").filter(Boolean).slice(-2);
			const anchor = Array.from(document.querySelectorAll("a")).find((a) => {
				const href = a.getAttribute("href");
				return !!href && href.includes(window.location.pathname) && a.hasAttribute("style");
			});
			if (!(anchor === null || anchor === void 0 ? void 0 : anchor.textContent)) throw new Error("Cannot find item name");
			return [appid, decodeURIComponent(anchor.textContent.trim())];
		}
	}
	//#endregion
	//#region src/market/multisell.ts
	function setup() {
		hookXHR();
	}
	function run() {
		autoMaxCount();
	}
	function hookXHR() {
		const originalOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function(method, url, ...args) {
			if (url.toString().includes("/inventory/")) {
				const tmp = new URL(url.toString());
				tmp.searchParams.set("count", "1000");
				url = tmp.toString();
			}
			return originalOpen.apply(this, [
				method,
				url,
				...args
			]);
		};
	}
	async function autoMaxCount() {
		const table = await waitDOM(".market_multi_table");
		if (!table) return;
		Array.from(table.querySelectorAll("tbody tr")).forEach((row) => {
			const [td1, td2] = row.children;
			const input = td1.querySelector("input[type=\"number\"]");
			input.value = td2.querySelector(".market_multi_qtyown span").textContent;
		});
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
	injectStyle(".market_listing_table_header {\n  padding-right: 14px;\n}\n\n#tabContentsMyActiveMarketListingsRows {\n  overflow-y: scroll;\n  max-height: 400px;\n}");
	//#endregion
	//#region src/index.ts
	router([{
		path: "/market/listings/",
		run: run$1
	}, {
		path: "/market/multisell",
		setup,
		run
	}]);
	//#endregion
})();
