// ==UserScript==
// @name         miscellaneous
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/miscellaneous
// @version      1.2.0
// @license      MIT
// @description  杂项，所有无法归类的脚本都放在这里
// @author       IronKinoko
// @match        https://c.pc.qq.com/*
// @match        https://pan.baidu.com/share/init*
// @match        https://www.acggw.me/*
// @match        https://acgxj.com/*
// @match        https://xj.steamzg.com/*
// @match        https://acfb.top/*
// @match        https://gamers520.com/*
// @match        https://x.com/*
// @icon         https://q.qlogo.cn/g?b=qq&nk=707819027&s=100
// @require      https://unpkg.com/jsqr@1.4.0/dist/jsQR.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      convertico.com
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/miscellaneous.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/miscellaneous.user.js
// ==/UserScript==
(function(jsqr) {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
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
	jsqr = __toESM(jsqr);
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
	//#region src/modules/steamzg.ts
	router({
		domain: [
			"acgxj.com",
			"xj.steamzg.com",
			"acfb.top"
		],
		routes: [{ run: parseQRCode$1 }]
	});
	function parseQRCode$1() {
		parseQRCodeV1();
		parseQRCodeV2();
	}
	function parseQRCodeV1() {
		document.querySelectorAll("canvas.su-qr-canvas").forEach((canvas) => {
			var _canvas$parentElement;
			const imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
			const res = (0, jsqr.default)(imageData.data, imageData.width, imageData.height);
			if (!res) return;
			if (res.data.includes("pan.baidu.com")) {
				const matched = document.body.innerText.match(/提取码[:：]?\s*(\w{4})/);
				if (matched) {
					const url = new URL(res.data);
					url.searchParams.set("pwd", matched[1]);
					res.data = url.toString();
				}
			}
			const link = document.createElement("a");
			link.href = res.data;
			link.target = "_blank";
			link.textContent = res.data;
			const div = document.createElement("div");
			div.append(link);
			(_canvas$parentElement = canvas.parentElement) === null || _canvas$parentElement === void 0 || _canvas$parentElement.appendChild(div);
		});
	}
	function parseQRCodeV2() {
		document.querySelectorAll(".su-download-item").forEach((item) => {
			const $info = item.querySelector(".su-download-info");
			const $text = item.querySelector(".su-download-text");
			const $btn = item.querySelector(".su-download-btn");
			if (!$btn || !$text || !$info) return;
			const urlBase64 = $btn.getAttribute("data-qr-url");
			if (!urlBase64) return;
			const url = atob(urlBase64);
			const $wrap = document.createElement("div");
			$info.append($wrap);
			$wrap.append($text);
			const a = document.createElement("a");
			a.href = url;
			a.target = "_blank";
			a.textContent = url;
			a.style.display = "block";
			a.style.color = "#999999";
			a.style.lineHeight = "1.2";
			a.style.fontSize = "12px";
			$wrap.append(a);
			$btn.addEventListener("click", (e) => {
				e.preventDefault();
				e.stopPropagation();
				window.open(url, "_blank");
			}, { capture: true });
		});
	}
	//#endregion
	//#region src/modules/gamers520.ts
	router({
		domain: ["gamers520.com"],
		routes: [{ run: main$1 }]
	});
	function main$1() {
		parseQRCode();
		parseQRCode2();
	}
	function parseQRCode() {
		document.querySelectorAll(".bdp-qrcode-box img").forEach((img) => {
			var _img$parentElement, _img$parentElement2;
			const url = new URL(img.src).searchParams.get("data");
			if (!url) return;
			const node = (_img$parentElement = img.parentElement) === null || _img$parentElement === void 0 ? void 0 : _img$parentElement.nextSibling;
			const btn = document.createElement("div");
			node.insertAdjacentElement("afterend", btn);
			btn.outerHTML = `<div style="margin: auto 0; width: 100%; display: flex; flex-direction: column; align-items: center;">
    <a href="${url}" target="_blank" class="bdp-btn">⚡ 点击下载</a></div>`;
			node.remove();
			(_img$parentElement2 = img.parentElement) === null || _img$parentElement2 === void 0 || _img$parentElement2.remove();
		});
	}
	function parseQRCode2() {
		document.querySelectorAll(".wpkqcg_qrcode").forEach((img) => {
			var _img$parentElement3;
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);
			const imageData = ctx.getImageData(0, 0, img.width, img.height);
			const res = (0, jsqr.default)(imageData.data, imageData.width, imageData.height);
			if (!res) return;
			if (res.data.includes("pan.baidu.com")) {
				const matched = document.body.innerText.match(/提取码[:：]?\s*(\w{4})/);
				if (matched) {
					const url = new URL(res.data);
					url.searchParams.set("pwd", matched[1]);
					res.data = url.toString();
				}
			}
			const link = document.createElement("a");
			link.href = res.data;
			link.target = "_blank";
			link.textContent = res.data;
			const div = document.createElement("div");
			div.append(link);
			(_img$parentElement3 = img.parentElement) === null || _img$parentElement3 === void 0 || _img$parentElement3.appendChild(div);
		});
	}
	//#endregion
	//#region src/modules/x.ts
	router({
		domain: ["x.com"],
		routes: [{ run: main }]
	});
	function main() {
		const run = () => {
			injectDownloadIcon();
			requestAnimationFrame(run);
		};
		requestAnimationFrame(run);
	}
	function injectDownloadIcon() {
		const downloadIconHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M11.99 16l-5.7-5.7L7.7 8.88l3.29 3.3V2.59h2v9.59l3.3-3.3 1.41 1.42-5.71 5.7zM21 
  15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 
  .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
  </svg>`;
		Array.from(document.querySelectorAll("article[data-testid=\"tweet\"]")).forEach(async (tweet) => {
			if (tweet.getAttribute("data-x-injected")) return;
			tweet.setAttribute("data-x-injected", "true");
			const actionsEl = tweet.querySelector("div > div > div[role=\"group\"]");
			if (!actionsEl) return;
			const originEl = actionsEl.children[actionsEl.children.length - 1];
			const downloadEl = originEl.cloneNode(true);
			originEl.insertAdjacentElement("afterend", downloadEl);
			const oldSvg = downloadEl.querySelector("svg");
			if (!oldSvg) return;
			const svgCls = oldSvg.getAttribute("class");
			const template = document.createElement("template");
			template.innerHTML = downloadIconHTML.trim();
			const newSvg = template.content.firstElementChild;
			if (!newSvg) return;
			newSvg.setAttribute("class", svgCls || "");
			oldSvg.replaceWith(newSvg);
			const btn = downloadEl.querySelector("button");
			if (!btn) return;
			btn.addEventListener("click", async () => {
				const hisUrls = btn.getAttribute("data-x-urls");
				if (hisUrls) {
					JSON.parse(hisUrls).forEach((url, idx) => downloadFile(url.url, url.filename));
					return;
				}
				if (btn.getAttribute("data-x-fetching")) return;
				btn.setAttribute("data-x-fetching", "true");
				if (!tweet.querySelector("video")) return;
				const anchorEl = tweet.querySelector("a[role=\"link\"][href*=\"/status/\"]");
				if (!anchorEl) return;
				const statusUrl = anchorEl.href;
				const parts = statusUrl.split("/");
				const statusIdx = parts.findIndex((part) => part === "status");
				const user = parts[statusIdx - 1];
				const tweetId = parts[statusIdx + 1];
				const tipEl = document.createElement("div");
				tipEl.textContent = "下载中...";
				tipEl.style.cssText = `
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          padding: 4px 8px;
          border-radius: 8px;
          white-space: nowrap;
          z-index: 9999;
        `;
				downloadEl.appendChild(tipEl);
				try {
					const files = (await downloadGif(statusUrl)).map((url, idx) => ({
						url,
						filename: `x-${user}-${tweetId}${idx > 0 ? `-${idx}` : ""}.gif`
					}));
					files.forEach((file) => downloadFile(file.url, file.filename));
					btn.setAttribute("data-x-urls", JSON.stringify(files));
				} finally {
					tipEl.remove();
					btn.removeAttribute("data-x-fetching");
				}
			});
		});
	}
	function downloadFile(url, filename) {
		const fallbackOpen = () => {
			window.open(url, "_blank", "noopener,noreferrer");
		};
		GM_xmlhttpRequest({
			url,
			method: "GET",
			responseType: "blob",
			onload: (response) => {
				const blob = response.response;
				const blobUrl = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = blobUrl;
				a.download = encodeURIComponent(filename);
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(blobUrl);
			},
			onerror: () => {
				fallbackOpen();
			}
		});
	}
	const cache = {};
	async function downloadGif(url) {
		if (cache[url]) return cache[url];
		const client = async (params) => {
			const formData = new FormData();
			Object.keys(params).forEach((key) => {
				formData.append(key, params[key]);
			});
			return new Promise((resolve, reject) => {
				GM_xmlhttpRequest({
					method: "POST",
					url: "https://convertico.com/twitter-gif-downloader/twitter-gif-downloader.php",
					responseType: "json",
					data: formData,
					onload: (response) => {
						resolve(response.response);
					},
					onerror: (error) => {
						reject(error);
					}
				});
			});
		};
		const meta = await client({
			action: "fetch",
			url
		});
		const files = await Promise.all(meta.media.map(async (item, idx) => {
			return "https://convertico.com/twitter-gif-downloader/" + (await client({
				action: "convert_to_gif",
				video_url: item.url,
				filename: `x-gif-${Date.now()}-${idx}`,
				fps: 20,
				width: 480,
				lossy: 80
			})).file_url;
		}));
		cache[url] = files;
		return files;
	}
	//#endregion
})(jsQR);
