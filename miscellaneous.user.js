// ==UserScript==
// @name         miscellaneous
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/miscellaneous
// @version      1.1.2
// @license      MIT
// @description  杂项，所有无法归类的脚本都放在这里
// @author       IronKinoko
// @match        https://c.pc.qq.com/*
// @match        https://pan.baidu.com/share/init*
// @match        https://www.acggw.me/*
// @icon         https://q.qlogo.cn/g?b=qq&nk=707819027&s=100
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/miscellaneous.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/miscellaneous.user.js
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
//#region src/modules/acggw.ts
	router({
		domain: "acggw.me",
		routes: [{
			path: /\d+\.html/,
			run: linkMergePassword
		}]
	});
	async function linkMergePassword() {
		const lines = Array.from(document.querySelectorAll(".content .single > p"));
		function makeLink(line) {
			var _line$textContent;
			const urlMatch = (_line$textContent = line.textContent) === null || _line$textContent === void 0 ? void 0 : _line$textContent.match(/(https?:\/\/\S+)/);
			if (urlMatch) {
				const url = urlMatch[0];
				const a = document.createElement("a");
				a.href = url;
				a.textContent = url;
				a.target = "_blank";
				a.style.textDecoration = "underline";
				line.textContent = line.textContent.replace(url, "");
				line.appendChild(a);
			}
		}
		const mega = lines.filter((line) => line.textContent.includes("M盘"));
		if (mega.length === 2) {
			var _pwdLine$textContent$;
			const [linkLine, pwdLine] = mega;
			linkLine.textContent = `${linkLine.textContent}#${(_pwdLine$textContent$ = pwdLine.textContent.split(/：|:/).pop()) === null || _pwdLine$textContent$ === void 0 ? void 0 : _pwdLine$textContent$.trim()}`;
			makeLink(linkLine);
		}
		const baidu = lines.filter((line) => line.textContent.match(/pan\.baidu\.com|提取码/));
		if ([2, 3].includes(baidu.length)) {
			var _pwdLine$textContent$2;
			const linkLine = baidu[0];
			const pwdLine = baidu[baidu.length - 1];
			linkLine.textContent = `${linkLine.textContent}?pwd=${(_pwdLine$textContent$2 = pwdLine.textContent.split(/：|:/).pop()) === null || _pwdLine$textContent$2 === void 0 ? void 0 : _pwdLine$textContent$2.trim()}`;
			makeLink(linkLine);
		}
	}

//#endregion
//#region src/modules/baidu.ts
	router({
		domain: "pan.baidu.com",
		routes: [{
			path: "/share/init",
			run: autoSubmit
		}]
	});
	async function autoSubmit() {
		if (!new URL(window.location.href).searchParams.get("pwd")) return;
		(await waitDOM("#submitBtn")).click();
	}

//#endregion
//#region src/modules/qq.ts
	router({
		domain: "c.pc.qq.com",
		routes: [{ run: qqRedirect }]
	});
	function qqRedirect() {
		const url = new URL(window.location.href);
		if (url.pathname === "/middlem.html") {
			const target = url.searchParams.get("pfurl");
			if (target) window.location.replace(target);
		}
		if (url.pathname === "/ios.html") {
			const target = url.searchParams.get("url");
			if (target) window.location.replace(target);
		}
	}

//#endregion
})();