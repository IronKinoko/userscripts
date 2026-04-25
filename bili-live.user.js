// ==UserScript==
// @name         bili-live
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/bili-live
// @version      1.0.1
// @license      MIT
// @description  优化直播间开播设置
// @author       IronKinoko
// @match        https://link.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/bili-live.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/bili-live.user.js
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
//#region src/modules/startLive.ts
	function setup() {
		fetchRoomId();
		hookXHR();
		hookFetch();
	}
	function run() {}
	let room_id = "";
	async function fetchRoomId() {
		room_id = (await (await fetch("https://api.live.bilibili.com/xlive/app-blink/v1/room/GetInfo?platform=pc", { credentials: "include" })).json()).data.room_id;
	}
	function hookXHR() {
		const originalOpen = XMLHttpRequest.prototype.open;
		const originalSend = XMLHttpRequest.prototype.send;
		XMLHttpRequest.prototype.open = function(method, url, ...rest) {
			if (url.includes("FetchWebUpStreamAddr")) {
				method = "GET";
				url = `//api.live.bilibili.com/live_stream/v1/StreamList/get_stream_by_roomId?room_id=${room_id}`;
			}
			this._requestURL = url;
			this._requestMethod = method;
			return originalOpen.call(this, method, url, ...rest);
		};
		XMLHttpRequest.prototype.send = function(body) {
			const xhr = this;
			const url = this._requestURL;
			if (url && url.includes("GetWebLivePermission")) injectOnReadyStateChange(xhr, (xhr) => {
				try {
					let responseData = JSON.parse(xhr.responseText);
					if (responseData.data) responseData.data.allow_live = true;
					Object.defineProperty(xhr, "responseText", { get: function() {
						return JSON.stringify(responseData);
					} });
				} catch (e) {
					console.error("修改GetWebLivePermission返回值出错:", e);
				}
			});
			if (url && url.includes("get_stream_by_roomId")) injectOnReadyStateChange(xhr, (xhr) => {
				try {
					let responseData = JSON.parse(xhr.responseText);
					if (responseData.data) {
						responseData.data.addr = responseData.data.rtmp;
						responseData.data.line = responseData.data.stream_line;
					}
					Object.defineProperty(xhr, "responseText", { get: function() {
						return JSON.stringify(responseData);
					} });
				} catch (e) {
					console.error("修改get_stream_by_roomId返回值出错:", e);
				}
			});
			return originalSend.apply(this, arguments);
		};
	}
	function injectOnReadyStateChange(xhr, callback) {
		const originalOnReadyStateChange = xhr.onreadystatechange;
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) callback(xhr);
			}
			if (originalOnReadyStateChange) originalOnReadyStateChange.apply(this, arguments);
		};
	}
	function hookFetch() {
		const oldFetch = window.fetch;
		window.fetch = function(input, init) {
			if (typeof input === "string") {
				if (input.includes("WebLiveCenterStartLive")) {
					const params = new URLSearchParams(input.split("?")[1]);
					params.set("platform", "pc_link");
					input = "//api.live.bilibili.com/room/v1/Room/startLive?" + params.toString();
				}
			}
			return oldFetch(input, init);
		};
	}

//#endregion
//#region src/index.ts
	router({
		domain: "link.bilibili.com",
		routes: [{
			path: "/p/center/index",
			setup,
			run
		}]
	});

//#endregion
})();