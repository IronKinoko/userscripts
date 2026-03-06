// ==UserScript==
// @name         linovelib
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/linovelib
// @version      1.4.8
// @license      MIT
// @description  优化 linovelib 阅读体验
// @author       IronKinoko
// @match        https://www.linovelib.com/*
// @match        https://w.linovelib.com/*
// @match        https://www.bilinovel.com/*
// @icon         https://www.google.com/s2/favicons?domain=w.linovelib.com
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/linovelib.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/linovelib.user.js
// ==/UserScript==
(function() {


//#region ../shared/src/utils/is.ts
	function isMobile() {
		const re = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i;
		const ua = navigator.userAgent;
		return re.test(ua);
	}

//#endregion
//#region ../shared/src/utils/keybind.ts
	function normalizeKeyEvent(e) {
		const SPECIAL_KEY_EN = "`-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split("");
		const SPECIAL_KEY_ZH = "·-=【】、；‘，。/～！@#¥%…&*（）—+「」｜：“《》？".split("");
		let key = e.key;
		if (e.code === "Space") key = "Space";
		if (/^[a-z]$/.test(key)) key = key.toUpperCase();
		else if (SPECIAL_KEY_ZH.includes(key)) key = SPECIAL_KEY_EN[SPECIAL_KEY_ZH.indexOf(key)];
		let keyArr = [];
		e.ctrlKey && keyArr.push("ctrl");
		e.metaKey && keyArr.push("meta");
		e.shiftKey && !SPECIAL_KEY_EN.includes(key) && keyArr.push("shift");
		e.altKey && keyArr.push("alt");
		if (!/Control|Meta|Shift|Alt/i.test(key)) keyArr.push(key);
		keyArr = [...new Set(keyArr)];
		return keyArr.join("+");
	}
	function keybind(keys, keydown, keyup) {
		const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
		keys = keys.filter((key) => !key.includes(isMac ? "ctrl" : "meta"));
		function createProcess(callback) {
			return function(e) {
				var _document$activeEleme;
				if (((_document$activeEleme = document.activeElement) === null || _document$activeEleme === void 0 ? void 0 : _document$activeEleme.tagName) === "INPUT") return;
				const normalizedKey = normalizeKeyEvent(e).toLowerCase();
				for (const key of keys) if (key.toLowerCase() === normalizedKey) callback(e, key);
			};
		}
		window.addEventListener("keydown", createProcess(keydown));
		if (keyup) window.addEventListener("keyup", createProcess(keyup));
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
//#region src/h5/index.ts
	async function main$1() {
		if (!window.ReadTools) return;
		resetPageEvent();
		if (isMobile()) injectMovePageEvent();
		else injectShortcuts();
	}
	async function fixADBlock() {
		var _document$querySelect;
		const text = await (await fetch(window.location.href)).text();
		const volumes = new DOMParser().parseFromString(text, "text/html").querySelector("#volumes");
		if (!volumes) return;
		(_document$querySelect = document.querySelector("#volumes")) === null || _document$querySelect === void 0 || _document$querySelect.replaceWith(volumes);
		try {
			document.getElementById("bookmarkX").innerHTML = `<div class="chapter-bar">阅读进度</div><span class="historyChapter"><a href="/novel/${targetRecord.articleid}/${targetRecord.chapterid}_${targetRecord.page}.html" class="chapter-li-a "><span class="chapter-index blue">${targetRecord.chaptername}</span></a></span>`;
		} catch (error) {}
	}
	function resetPageEvent() {
		const $body = document.body;
		$body.onclick = (e) => {
			if ([
				"#toptools",
				"#bottomtools",
				"#readset"
			].some((id) => {
				var _document$querySelect2;
				return (_document$querySelect2 = document.querySelector(id)) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.contains(e.target);
			})) return;
			window.ReadPages.PageClick();
		};
	}
	function injectMovePageEvent() {
		let left, startX, startY, diffX, startTime, isMoved, direction;
		const $page = document.getElementById("apage");
		const isDisabled = (e) => {
			return window.ReadTools.pagemid != 1 || e.touches.length > 1 || window.visualViewport && window.visualViewport.scale !== 1 || window.getSelection() && window.getSelection().toString().length > 0;
		};
		window.addEventListener("touchstart", (e) => {
			if (isDisabled(e)) return;
			left = parseFloat($page.style.left.replace("px", "")) || 0;
			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
			startTime = Date.now();
			isMoved = false;
			direction = "";
		});
		window.addEventListener("touchmove", (e) => {
			if (isDisabled(e)) return;
			isMoved = true;
			diffX = e.touches[0].clientX - startX;
			let diffY = e.touches[0].clientY - startY;
			if (direction === "") direction = Math.abs(diffX) > Math.abs(diffY) ? "x" : "y";
			if (direction === "x") {
				e.preventDefault();
				$page.style.left = left + diffX + "px";
				$page.style.transition = "initail";
			}
		}, { passive: false });
		window.addEventListener("touchend", (e) => {
			if (isDisabled(e)) return;
			if (!isMoved || direction === "y") return;
			const threshold = Date.now() - startTime < 300 ? 10 : document.documentElement.clientWidth * .3;
			$page.style.transition = "";
			if (Math.abs(diffX) > threshold) {
				const type = diffX > 0 ? "previous" : "next";
				window.ReadPages.ShowPage(type);
				if (window.ReadPages.currentPage > window.ReadPages.totalPages || window.ReadPages.currentPage < 1) window.ReadPages.ShowPage();
			} else window.ReadPages.ShowPage();
		});
	}
	function injectShortcuts() {
		keybind([
			"a",
			"s",
			"w",
			"d",
			"space",
			"shift+space"
		], (e, key) => {
			if (window.ReadTools.pagemid != 1) return;
			switch (key) {
				case "shift+space":
				case "a":
				case "w":
					window.ReadPages.ShowPage("previous");
					break;
				case "space":
				case "d":
				case "s":
					window.ReadPages.ShowPage("next");
					break;
				default: break;
			}
		});
	}

//#endregion
//#region src/pc/index.ts
	function main() {
		removeSelectEvent();
		if (document.body.id === "readbg") injectEvent();
	}
	function removeSelectEvent() {
		const dom = document.createElement("style");
		dom.innerHTML = `* { user-select: initial !important; }`;
		document.body.append(dom);
		document.body.removeAttribute("onselectstart");
	}
	function injectEvent() {
		const script = Array.from(document.scripts).find((script) => script.innerHTML.includes("prevpage=\""));
		if (!script) return;
		const res = script.innerHTML.match(/* @__PURE__ */ new RegExp("prevpage=\"(?<pre>.*?)\";.*nextpage=\"(?<next>.*?)\";", ""));
		if (!(res === null || res === void 0 ? void 0 : res.groups)) return;
		const { pre, next } = res.groups;
		keybind([
			"w",
			"s",
			"a",
			"d"
		], (e, key) => {
			switch (key) {
				case "w":
				case "s":
					const direction = key === "w" ? -1 : 1;
					if (e.repeat) scroll.start(direction * 15);
					else window.scrollBy({
						behavior: "smooth",
						top: direction * 200
					});
					break;
				case "a":
				case "d":
					window.location.pathname = key === "a" ? pre : next;
					break;
			}
		}, (e, key) => {
			switch (key) {
				case "w":
				case "s":
					scroll.stop();
					break;
			}
		});
	}
	const scroll = (() => {
		let handle;
		function stop() {
			if (!handle) return;
			cancelAnimationFrame(handle);
			handle = void 0;
		}
		function start(step) {
			if (handle) return;
			function animate() {
				handle = requestAnimationFrame(animate);
				window.scrollBy({ top: step });
			}
			handle = requestAnimationFrame(animate);
		}
		return {
			start,
			stop
		};
	})();

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
	injectStyle("@charset \"UTF-8\";\n.k-wrapper #catelogX .module-header-r {\n  min-width: 0;\n}\n.k-wrapper #catelogX .module-header-r .module-header-btn {\n  position: static;\n  padding: 0;\n}\n.k-wrapper #volumes .chapter-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  position: relative;\n}\n.k-wrapper #volumes .chapter-bar::after {\n  content: none;\n}\n.k-wrapper #volumes .chapter-bar .download-btn {\n  border-radius: 4px;\n  background-color: rgba(255, 57, 84, 0.1);\n  padding: 4px 12px;\n  font-weight: 500;\n  color: #ff3955;\n  border: 0;\n  white-space: nowrap;\n  margin-left: 16px;\n}\n.k-wrapper #volumes .chapter-bar .download-btn::after {\n  content: \"下载\";\n}\n.k-wrapper #volumes .chapter-bar .download-btn:disabled {\n  opacity: 0.5;\n}\n.k-wrapper #volumes .chapter-bar .download-btn:disabled::after {\n  content: \"下载中...\";\n}\n.k-wrapper #volumes .chapter-bar .progress,\n.k-wrapper #volumes .chapter-bar .progress > div {\n  position: absolute;\n  pointer-events: none;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n}\n.k-wrapper #volumes .chapter-bar .progress > div {\n  background-color: rgba(255, 57, 84, 0.1);\n  transition: all 0.2s linear;\n}");

//#endregion
//#region src/index.ts
	document.body.classList.add("k-wrapper");
	router({
		domain: ["//www.linovelib.com"],
		routes: [{ run: main }]
	});
	router({
		domain: ["//w.linovelib.com", "//www.bilinovel.com"],
		routes: [{ run: main$1 }, {
			pathname: /(\/novel\/.*\/catalog)|(\/download\/.*\.html)/,
			run: fixADBlock
		}]
	});

//#endregion
})();