// ==UserScript==
// @name         esjzone
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/esjzone
// @version      1.1.2
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://www.esjzone.cc/*
// @icon         https://www.google.com/s2/favicons?domain=esjzone.cc
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/esjzone.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/esjzone.user.js
// ==/UserScript==
(function() {


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
//#region src/read.ts
	function removeLoveEmoji() {
		function transBody(node) {
			const nodes = node ? node.childNodes : document.body.childNodes;
			for (const node of nodes) if (node.nodeType === node.TEXT_NODE) {
				const text = node;
				text.data = text.data.replace(/❤/g, "❤︎");
			} else transBody(node);
		}
		transBody();
	}
	function customizerEnhance() {
		const el = document.querySelector(".customizer");
		let lastScrollTop = 0;
		el.style.transition = "opacity 0.15s, right 0.3s";
		window.addEventListener("scroll", () => {
			const scrollTop = document.documentElement.scrollTop;
			if (scrollTop > lastScrollTop) {
				el.style.opacity = "0";
				lastScrollTop = scrollTop;
			} else if (scrollTop + 20 < lastScrollTop || scrollTop < 50) {
				lastScrollTop = scrollTop;
				el.style.opacity = "1";
			}
		});
	}
	function enhanceBackground() {
		const nav = document.querySelector(".navbar");
		const fn = () => {
			document.body.id = nav.id;
			document.querySelector(".page-title").id = nav.id;
		};
		fn();
		new MutationObserver(fn).observe(nav, { attributes: true });
	}
	function main() {
		removeLoveEmoji();
		customizerEnhance();
		enhanceBackground();
	}

//#endregion
//#region src/index.ts
	router([{
		path: /forum\/\d+\/\d+\.html/,
		run: main
	}]);

//#endregion
})();