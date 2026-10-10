// ==UserScript==
// @name         miscellaneous
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/miscellaneous
// @version      1.4.1
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
// @match        https://github.com/*
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
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
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
		routes: [{ run: main$2 }]
	});
	function main$2() {
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
		routes: [{ run: main$1 }]
	});
	function main$1() {
		const run = () => {
			injectDownloadIcon();
			patchMediaTab();
			requestAnimationFrame(run);
		};
		requestAnimationFrame(run);
	}
	function patchMediaTab() {
		const mediaTab = Array.from(document.querySelectorAll("a[href]")).find((a) => /\/.*?\/media/.test(a.getAttribute("href") || ""));
		if (!mediaTab || mediaTab.hasAttribute("data-x-patched")) return;
		const url = new URL(mediaTab.href);
		url.searchParams.set("filter", "photo");
		mediaTab.setAttribute("data-x-patched", "true");
		mediaTab.setAttribute("href", url.toString());
		mediaTab.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			let target;
			const currentUrl = new URL(window.location.href);
			if (currentUrl.searchParams.get("filter") === "photo") {
				currentUrl.searchParams.delete("filter");
				target = currentUrl.toString();
			} else target = url.toString();
			const state = history.state;
			history.pushState(state, "", target);
			window.dispatchEvent(new PopStateEvent("popstate", { state }));
		}, true);
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
					try {
						const urls = JSON.parse(hisUrls);
						if (!Array.isArray(urls) || urls.some((url) => typeof (url === null || url === void 0 ? void 0 : url.url) !== "string" || typeof (url === null || url === void 0 ? void 0 : url.filename) !== "string")) throw new Error("缓存的下载信息无效");
						await downloadFilesWithTip(btn, urls);
					} catch (error) {
						console.error("Failed to parse cached X download URLs", error);
						window.alert("下载失败：缓存的下载信息无效");
					}
					return;
				}
				if (btn.getAttribute("data-x-fetching")) return;
				btn.setAttribute("data-x-fetching", "true");
				const tip = createDownloadTip(btn);
				let failed = false;
				try {
					if (!tweet.querySelector("video")) throw new Error("未找到视频");
					const anchorEl = tweet.querySelector("a[role=\"link\"][href*=\"/status/\"]");
					if (!anchorEl) throw new Error("未找到推文链接");
					const statusUrl = anchorEl.href;
					const parts = statusUrl.split("/");
					const statusIdx = parts.findIndex((part) => part === "status");
					const user = parts[statusIdx - 1];
					const tweetId = parts[statusIdx + 1];
					if (statusIdx < 1 || !user || !tweetId) throw new Error("推文链接格式无效");
					tip.setStep("获取信息");
					const meta = await fetchGifMeta(statusUrl);
					tip.setStep("处理中");
					const result = await processMediaFiles(meta.media, meta.tweet_id, (idx) => `x-${user}-${tweetId}${idx > 0 ? `-${idx}` : ""}.gif`, tip);
					if (result.files.length === meta.media.length) btn.setAttribute("data-x-urls", JSON.stringify(result.files));
					if (result.failed) {
						failed = true;
						tip.retain();
					}
				} catch (error) {
					failed = true;
					console.error("Failed to download GIF from X", error);
					const message = error instanceof Error ? error.message : "未知错误";
					tip.showError(message);
				} finally {
					btn.removeAttribute("data-x-fetching");
					if (!failed) tip.remove();
				}
			});
		});
	}
	function createDownloadTip(target) {
		const tipEl = document.createElement("div");
		tipEl.style.cssText = `
    position: fixed;
    transform: translate(-50%, -100%);
    background: rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 4px 8px;
    border-radius: 8px;
    white-space: pre-line;
    text-align: left;
    z-index: 99999;
    pointer-events: none;
  `;
		document.body.appendChild(tipEl);
		const startedAt = Date.now();
		let currentStep = "获取信息";
		const events = [];
		let failed = false;
		let removed = false;
		let removeTimer = 0;
		const render = () => {
			const elapsed = Math.floor((Date.now() - startedAt) / 1e3);
			const time = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
			tipEl.textContent = [`${time} | ${currentStep}`, ...events.map((event) => event.step)].join("\n");
		};
		const updatePosition = () => {
			const rect = target.getBoundingClientRect();
			const halfWidth = tipEl.offsetWidth / 2;
			const padding = 8;
			const minLeft = padding + halfWidth;
			const maxLeft = window.innerWidth - padding - halfWidth;
			const left = minLeft > maxLeft ? window.innerWidth / 2 : Math.min(Math.max(rect.left + rect.width / 2, minLeft), maxLeft);
			const placeAbove = rect.top >= tipEl.offsetHeight + padding;
			const top = placeAbove ? rect.top - padding : Math.min(rect.bottom + padding, window.innerHeight - tipEl.offsetHeight);
			tipEl.style.left = `${left}px`;
			tipEl.style.top = `${Math.max(padding, top)}px`;
			tipEl.style.transform = placeAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)";
		};
		const remove = () => {
			if (removed) return;
			removed = true;
			window.clearInterval(updateTimer);
			window.clearTimeout(removeTimer);
			window.removeEventListener("scroll", updatePosition, true);
			window.removeEventListener("resize", updatePosition);
			tipEl.remove();
		};
		const updateTimer = window.setInterval(() => {
			if (!failed) render();
			updatePosition();
		}, 1e3);
		window.addEventListener("scroll", updatePosition, true);
		window.addEventListener("resize", updatePosition);
		render();
		updatePosition();
		return {
			setStep(nextStep) {
				currentStep = nextStep;
				render();
				updatePosition();
			},
			updateFile(index, step) {
				const existingEvent = events.find((event) => event.index === index);
				const message = `#${index + 1} ${step}`;
				if (existingEvent) existingEvent.step = message;
				else events.push({
					index,
					step: message
				});
				render();
				updatePosition();
			},
			showError(message) {
				failed = true;
				tipEl.style.background = "rgba(180, 0, 0, 0.85)";
				currentStep = `获取信息失败：${message}`;
				render();
				updatePosition();
				removeTimer = window.setTimeout(remove, 5e3);
			},
			retain() {
				failed = true;
				tipEl.style.background = "rgba(180, 0, 0, 0.85)";
				updatePosition();
				removeTimer = window.setTimeout(remove, 5e3);
			},
			remove
		};
	}
	async function downloadFilesWithTip(btn, files) {
		if (btn.hasAttribute("data-x-fetching")) return;
		btn.setAttribute("data-x-fetching", "true");
		const tip = createDownloadTip(btn);
		let failed = false;
		try {
			tip.setStep("处理中");
			failed = await downloadFiles(files, tip);
			if (failed) tip.retain();
		} catch (error) {
			failed = true;
			console.error("Failed to download cached X GIF URLs", error);
			const message = error instanceof Error ? error.message : "未知错误";
			tip.showError(message);
		} finally {
			btn.removeAttribute("data-x-fetching");
			if (!failed) tip.remove();
		}
	}
	async function downloadFiles(files, tip) {
		let failed = false;
		await Promise.all(files.map(async (file, index) => {
			tip.updateFile(index, "下载中");
			try {
				const downloaded = await downloadFile(file.url, file.filename, (loaded, total) => {
					const progress = total && total > 0 ? `${Math.floor(loaded / total * 100)}%` : `${formatBytes(loaded)}`;
					tip.updateFile(index, `下载中 ${progress}`);
				});
				tip.updateFile(index, downloaded ? "完成" : "下载失败，已尝试新窗口打开");
			} catch (error) {
				failed = true;
				const message = error instanceof Error ? error.message : "未知错误";
				console.error(`Failed to download GIF #${index + 1}`, error);
				tip.updateFile(index, `下载失败：${message}`);
			}
		}));
		return failed;
	}
	function formatBytes(bytes) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / 1048576).toFixed(1)} MB`;
	}
	function downloadFile(url, filename, onProgress) {
		const fallbackOpen = () => {
			window.open(url, "_blank", "noopener,noreferrer");
		};
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				url,
				method: "GET",
				responseType: "blob",
				onprogress: (response) => {
					onProgress(response.loaded, response.lengthComputable ? response.total : void 0);
				},
				onload: (response) => {
					if (response.status < 200 || response.status >= 300) {
						fallbackOpen();
						resolve(false);
						return;
					}
					try {
						const blob = response.response;
						const blobUrl = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = blobUrl;
						a.download = encodeURIComponent(filename);
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
						URL.revokeObjectURL(blobUrl);
						resolve(true);
					} catch (error) {
						reject(error);
					}
				},
				onerror: () => {
					fallbackOpen();
					resolve(false);
				},
				ontimeout: () => {
					fallbackOpen();
					resolve(false);
				},
				onabort: () => {
					fallbackOpen();
					resolve(false);
				}
			});
		});
	}
	async function fetchGifMeta(url) {
		const meta = await converticoRequest({
			action: "fetch",
			url
		});
		if (!Array.isArray(meta.media) || meta.media.length === 0) throw new Error("推文中没有可转换的视频");
		if (!meta.tweet_id) throw new Error("转换服务未返回推文 ID");
		return meta;
	}
	async function processMediaFiles(media, tweetId, getFilename, tip) {
		let failed = false;
		const files = new Array(media.length);
		await Promise.all(media.map(async (item, index) => {
			tip.updateFile(index, "转换gif");
			try {
				if (typeof (item === null || item === void 0 ? void 0 : item.url) !== "string" || !item.url) throw new Error("视频地址无效");
				const response = await converticoRequest({
					action: "convert_gif",
					video_url: item.url,
					tweet_id: tweetId,
					filename: `x-gif-${Date.now()}-${index}`,
					fps: 20,
					width: 480
				});
				if (typeof response.file_url !== "string" || !response.file_url) throw new Error("GIF 转换失败");
				const file = {
					url: new URL(response.file_url, "https://convertico.com/twitter-video-downloader/").toString(),
					filename: getFilename(index)
				};
				files[index] = file;
				tip.updateFile(index, "下载中");
				const downloaded = await downloadFile(file.url, file.filename, (loaded, total) => {
					const progress = total && total > 0 ? `${Math.floor(loaded / total * 100)}%` : `${formatBytes(loaded)}`;
					tip.updateFile(index, `下载中 ${progress}`);
				});
				tip.updateFile(index, downloaded ? "完成" : "下载失败，已尝试新窗口打开");
			} catch (error) {
				failed = true;
				const message = error instanceof Error ? error.message : "未知错误";
				console.error(`Failed to process GIF #${index + 1}`, error);
				tip.updateFile(index, `失败：${message}`);
			}
		}));
		return {
			files: files.filter((file) => file !== void 0),
			failed
		};
	}
	async function converticoRequest(params) {
		const formData = new FormData();
		Object.keys(params).forEach((key) => {
			formData.append(key, String(params[key]));
		});
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "POST",
				url: "https://convertico.com/twitter-video-downloader/process.php",
				responseType: "json",
				data: formData,
				onload: (response) => {
					if (response.status < 200 || response.status >= 300) {
						reject(/* @__PURE__ */ new Error(`转换服务请求失败（HTTP ${response.status} ${response.statusText}）`));
						return;
					}
					if (!response.response || typeof response.response !== "object") {
						reject(/* @__PURE__ */ new Error("转换服务返回了无效响应"));
						return;
					}
					resolve(response.response);
				},
				onerror: (error) => {
					reject(new Error(error.statusText || "网络请求失败"));
				},
				ontimeout: () => {
					reject(/* @__PURE__ */ new Error("请求超时"));
				},
				onabort: () => {
					reject(/* @__PURE__ */ new Error("请求已取消"));
				}
			});
		});
	}
	//#endregion
	//#region src/modules/github.ts
	const PROXY_PREFIX = "https://v4.gh-proxy.org/";
	const ACCELERATE_PATTERN = /^https:\/\/(github\.com\/.+\/(releases\/download|archive)\/|raw\.githubusercontent\.com\/|codeload\.github\.com\/)/;
	router({
		domain: "github.com",
		routes: [{ run: main }]
	});
	function main() {
		patchDownloadLinks();
		new MutationObserver(() => patchDownloadLinks()).observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	function patchDownloadLinks() {
		document.querySelectorAll("a[href]:not([data-gh-accelerated])").forEach((link) => {
			const href = link.getAttribute("href") || "";
			link.setAttribute("data-gh-accelerated", "true");
			const absoluteHref = new URL(href, location.origin).href;
			if (!ACCELERATE_PATTERN.test(absoluteHref)) return;
			link.setAttribute("href", PROXY_PREFIX + absoluteHref);
		});
	}
	//#endregion
})(jsQR);
