// ==UserScript==
// @name         kakuyomu-translate
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/kakuyomu-translate
// @version      2.1.8
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://kakuyomu.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kakuyomu.jp
// @grant        none
// @noframes
// @require      https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/kakuyomu-translate.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/kakuyomu-translate.user.js
// ==/UserScript==
(function() {


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
	injectStyle("html[lang=zh-CN] .widget-episodeBody font {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif;\n}\n\nruby rt {\n  -webkit-user-select: none;\n  user-select: none;\n}\n\n.ruby-hidden ruby rt {\n  display: none;\n}");

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
//#region src/episodes.ts
	async function main() {
		autoScrollIntoView();
		broadcastHoverText();
		autoFurigana();
	}
	function broadcastHoverText() {
		let channel = new BroadcastChannel("kakuyomu-translate");
		$(".widget-episodeBody").children().each((i, dom) => {
			const id = dom.id;
			dom.addEventListener("mouseenter", () => {
				const top = dom.getBoundingClientRect().top;
				channel.postMessage({
					type: "focus",
					id,
					top
				});
			});
			dom.addEventListener("mouseleave", () => {
				channel.postMessage({
					type: "blur",
					id
				});
			});
		});
		$("#contentMain-nextEpisode a, #contentMain-previousEpisode a").on("click", (e) => {
			channel.postMessage({
				type: "jump",
				href: e.currentTarget.getAttribute("href")
			});
		});
		handleMessage(channel);
	}
	async function handleMessage(channel) {
		channel.addEventListener("message", (e) => {
			const data = e.data;
			if (data.type === "focus") {
				const rect = document.getElementById(data.id).getBoundingClientRect();
				window.scrollBy({
					top: rect.y - data.top,
					behavior: "smooth"
				});
			}
			if (data.type === "jump") window.location.href = data.href;
		});
	}
	async function autoScrollIntoView() {
		const asideEl = await waitDOM("#contentAside");
		const detect = () => {
			const activeEpisodeEl = asideEl.querySelector(".widget-toc-main .widget-toc-items .widget-toc-episode.isHighlighted");
			if (!activeEpisodeEl) return;
			activeEpisodeEl.scrollIntoView({ block: "center" });
			ob.disconnect();
		};
		const ob = new MutationObserver(detect);
		ob.observe(asideEl, { childList: true });
	}
	async function autoFurigana() {
		const article = await queryArticleFurigana();
		if (article) {
			document.querySelector("#contentMain-inner").outerHTML = article;
			document.body.addEventListener("dblclick", () => {
				$("body").toggleClass("ruby-hidden");
			});
		}
	}
	async function queryArticleFurigana() {
		const [, workId, episodeId] = window.location.pathname.match(/works\/(.*)\/episodes\/(.*)/);
		const url = `https://userscripts-proxy.vercel.app/api/kakuyomu/furigana?workId=${workId}&episodeId=${episodeId}`;
		try {
			const data = await fetch(url).then((r) => r.json());
			if (!data.ok) throw new Error(data.message);
			return data.html;
		} catch (error) {
			console.error(error);
			alert(`接口调用失败 ${error.message}`);
			return null;
		}
	}

//#endregion
//#region src/index.ts
	router([{
		path: /works\/.*\/episodes\/.*/,
		run: main
	}]);

//#endregion
})();