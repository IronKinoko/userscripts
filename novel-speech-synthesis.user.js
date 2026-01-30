// ==UserScript==
// @name         novel-speech-synthesis
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/novel-speech-synthesis
// @version      1.0.14
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://hans.bilixs.com/*
// @match        https://www.bilixs.com/*
// @match        https://www.bilinovel.com/*
// @match        https://www.linovelib.com/*
// @match        https://novel18.syosetu.com/*
// @match        https://kakuyomu.jp/*
// @match        https://www.esjzone.cc/*
// @match        https://www.piaotia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/novel-speech-synthesis.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/novel-speech-synthesis.user.js
// ==/UserScript==
(function () {
  'use strict';

  function normalizeKeyEvent(e) {
    const SPECIAL_KEY_EN = "`-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split("");
    const SPECIAL_KEY_ZH = "\xB7-=\u3010\u3011\u3001\uFF1B\u2018\uFF0C\u3002/\uFF5E\uFF01@#\xA5%\u2026&*\uFF08\uFF09\u2014+\u300C\u300D\uFF5C\uFF1A\u201C\u300A\u300B\uFF1F".split("");
    let key = e.key;
    if (e.code === "Space") {
      key = "Space";
    }
    if (/^[a-z]$/.test(key)) {
      key = key.toUpperCase();
    } else if (SPECIAL_KEY_ZH.includes(key)) {
      key = SPECIAL_KEY_EN[SPECIAL_KEY_ZH.indexOf(key)];
    }
    let keyArr = [];
    e.ctrlKey && keyArr.push("ctrl");
    e.metaKey && keyArr.push("meta");
    e.shiftKey && !SPECIAL_KEY_EN.includes(key) && keyArr.push("shift");
    e.altKey && keyArr.push("alt");
    if (!/Control|Meta|Shift|Alt/i.test(key))
      keyArr.push(key);
    keyArr = [...new Set(keyArr)];
    return keyArr.join("+");
  }
  function keybind(keys, keydown, keyup) {
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    keys = keys.filter((key) => !key.includes(isMac ? "ctrl" : "meta"));
    function createProcess(callback) {
      return function(e) {
        var _a;
        if (((_a = document.activeElement) == null ? void 0 : _a.tagName) === "INPUT")
          return;
        const normalizedKey = normalizeKeyEvent(e).toLowerCase();
        for (const key of keys) {
          if (key.toLowerCase() === normalizedKey)
            callback(e, key);
        }
      };
    }
    window.addEventListener("keydown", createProcess(keydown));
    if (keyup)
      window.addEventListener("keyup", createProcess(keyup));
  }

  function matcher(source, regexp) {
    if (typeof regexp === "string")
      return source.includes(regexp);
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
    } else {
      opts.routes = Array.isArray(config) ? config : [config];
    }
    if (opts.domain) {
      const domains = Array.isArray(opts.domain) ? opts.domain : [opts.domain];
      const match = domains.some(
        (domain) => matcher(window.location.origin, domain)
      );
      if (!match)
        return;
    }
    const pathSource = window.location.pathname + window.location.search + window.location.hash;
    if (typeof opts.routes === "function") {
      opts.routes();
      return;
    }
    const routes = Array.isArray(opts.routes) ? opts.routes : [opts.routes];
    const runRoutes = routes.filter((route) => {
      let match = true;
      if (route.path) {
        match = matcher(pathSource, route.path);
      }
      if (route.pathname) {
        match = matcher(window.location.pathname, route.pathname);
      }
      if (route.search) {
        match = matcher(window.location.search, route.search);
      }
      if (route.hash) {
        match = matcher(window.location.hash, route.hash);
      }
      return match;
    });
    runRoutes.forEach((route) => {
      if (route.setup)
        route.setup();
    });
    function run() {
      runRoutes.forEach((route) => {
        if (route.run)
          route.run();
      });
    }
    if (window.document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run);
    }
  }

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = "#speech {\n  user-select: none;\n}\n#speech .speech-handler {\n  position: absolute;\n  right: 24px;\n  bottom: 100%;\n  padding: 4px 8px;\n  background: #222;\n  border-radius: 8px 8px 0 0;\n  cursor: pointer;\n}\n#speech .speech-handler svg {\n  transform: rotate(180deg);\n  transition: trasnform 0.3s ease;\n}\n#speech .speech-controls {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 16px;\n  gap: 8px;\n  transition: transform 0.3s ease;\n  transform: translateY(100%);\n  position: fixed;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  background: #222;\n  color: #fff;\n  z-index: 99999999;\n  line-height: 1;\n}\n#speech .speech-controls svg {\n  display: block;\n}\n#speech .speech-controls-show {\n  transform: translateY(0%);\n}\n#speech .speech-controls-show .speech-handler svg {\n  transform: rotate(0);\n}\n#speech .speech-controls-voice {\n  flex: 1;\n  min-width: 0;\n}\n#speech .speech-checkbox {\n  padding: 8px;\n  margin: 0;\n  background: #333;\n  border-radius: 8px;\n  cursor: pointer;\n}\n#speech .speech-checkbox:not(.speech-checkbox-icon-switch) input:checked ~ * {\n  color: #349bdb;\n}\n#speech .speech-checkbox.speech-checkbox-icon-switch input:checked + * {\n  display: none;\n}\n#speech .speech-checkbox.speech-checkbox-icon-switch input:not(:checked) + * + * {\n  display: none;\n}\n#speech .speech-select {\n  text-align: center;\n  appearance: none;\n  border: none;\n  background: transparent;\n  outline: none;\n  color: inherit;\n  cursor: pointer;\n  padding: 8px;\n  margin: 0;\n  background: #333;\n  border-radius: 8px;\n}\n#speech .speech-select option {\n  color: initial;\n}\n\n.speech-reading {\n  text-decoration: underline !important;\n  text-underline-offset: 0.4em !important;\n  text-decoration-style: dashed !important;\n}";
  n(css,{});

  var T = {"speech":"<div id=\"speech\">\n  <div class=\"speech-controls\">\n    <div class=\"speech-handler\">\n      <svg         viewBox=\"0 0 100 100\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        width=\"1em\"\n        height=\"1em\"\n      >\n        <path           d=\"M50 70 L 15 30 M50 70 L 85 30\"\n          stroke=\"currentColor\"\n          stroke-linecap=\"round\"\n          stroke-width=\"10\"\n        ></path>\n      </svg>\n    </div>\n    <label       class=\"speech-checkbox speech-checkbox-icon-switch speech-controls-play\"\n    >\n      <input type=\"checkbox\" hidden >\n      <svg         viewBox=\"0 0 1024 1024\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        width=\"1em\"\n        height=\"1em\"\n      >\n        <path           d=\"M817.088 484.96l-512-323.744c-9.856-6.24-22.336-6.624-32.512-.992A31.993 31.993 0 0 0 256 188.256v647.328c0 11.648 6.336 22.4 16.576 28.032A31.82 31.82 0 0 0 288 867.584a32.107 32.107 0 0 0 17.088-4.928l512-323.616A31.976 31.976 0 0 0 832 512a31.976 31.976 0 0 0-14.912-27.04z\"\n          fill=\"currentColor\"\n        ></path>\n      </svg>\n      <svg         viewBox=\"0 0 1024 1024\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        width=\"1em\"\n        height=\"1em\"\n      >\n        <path           d=\"M597.333 816.64H768V219.307H597.333M256 816.64h170.667V219.307H256V816.64z\"\n          fill=\"currentColor\"\n        ></path>\n      </svg>\n    </label>\n    <label class=\"speech-checkbox speech-controls-disabled\">\n      <input type=\"checkbox\" hidden >\n      <svg         viewBox=\"0 0 1024 1024\"\n        xmlns=\"http://www.w3.org/2000/svg\"\n        width=\"1em\"\n        height=\"1em\"\n      >\n        <path           d=\"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884z m288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z\"\n          fill=\"currentColor\"\n        ></path>\n      </svg>\n    </label>\n    <select class=\"speech-select speech-controls-rate\">\n      <option value=\"0.25\">0.25x</option>\n      <option value=\"0.3\">0.3x</option>\n      <option value=\"0.4\">0.4x</option>\n      <option value=\"0.5\">0.5x</option>\n      <option value=\"0.75\">0.75x</option>\n      <option value=\"1\">1x</option>\n      <option value=\"1.25\">1.25x</option>\n      <option value=\"1.5\">1.5x</option>\n      <option value=\"1.75\">1.75x</option>\n      <option value=\"2\">2x</option>\n      <option value=\"2.25\">2.25x</option>\n      <option value=\"2.5\">2.5x</option>\n      <option value=\"3\">3x</option>\n      <option value=\"3.5\">3.5x</option>\n      <option value=\"4\">4x</option>\n      <option value=\"4.5\">4.5x</option>\n      <option value=\"5\">5x</option>\n      <option value=\"6\">6x</option>\n      <option value=\"7\">7x</option>\n      <option value=\"8\">8x</option>\n      <option value=\"9\">9x</option>\n      <option value=\"10\">10x</option>\n    </select>\n    <label class=\"speech-checkbox speech-controls-continuous\">\n      <input type=\"checkbox\" hidden >\n      <span>连播</span>\n    </label>\n    <select class=\"speech-select speech-controls-voice\"></select>\n  </div>\n</div>"};

  class Speech {
    constructor(opts) {
      this.opts = opts;
      this.elements = null;
      this.utterance = {
        rate: 1.5,
        voiceURI: null,
        continuous: true,
        disabled: false,
        show: true
      };
      this.voices = [];
      this.paragraphDisposeList = [];
      this.speakDispose = null;
      this.paragraphList = [];
      this.loadLocalConfig();
      this.setupParagraph();
      this.createUI();
    }
    setupParagraph() {
      this.paragraphList = this.opts.getParagraph();
      if (this.paragraphDisposeList.length) {
        this.paragraphDisposeList.forEach((fn) => fn());
        this.paragraphDisposeList = [];
      }
      this.paragraphDisposeList = this.paragraphList.map((p, idx) => {
        p.setAttribute("data-speech-idx", idx.toString());
        const fn = (e) => {
          var _a;
          e.stopPropagation();
          if (this.utterance.disabled)
            return;
          let current = idx;
          let cancel = false;
          (_a = this.speakDispose) == null ? void 0 : _a.call(this);
          const speak = async () => {
            if (cancel)
              return;
            await this.speakParagraph(current);
            if (current < this.paragraphList.length) {
              current++;
              speak();
            }
          };
          this.speakDispose = () => {
            cancel = true;
          };
          speak();
        };
        p.addEventListener("click", fn);
        return () => {
          p.removeAttribute("data-speech-idx");
          p.removeEventListener("click", fn);
        };
      });
    }
    createUI() {
      const root = new DOMParser().parseFromString(T.speech, "text/html").body.children[0];
      const controls = root.querySelector(".speech-controls");
      const container = document.querySelector(this.opts.container);
      if (!container)
        throw new Error("container not found");
      container.appendChild(root);
      window.addEventListener("beforeunload", () => {
        this.cancel();
      });
      this.elements = {
        root,
        play: root.querySelector(".speech-controls-play input"),
        voice: root.querySelector(".speech-controls-voice"),
        rate: root.querySelector(".speech-controls-rate"),
        continuous: root.querySelector(".speech-controls-continuous input"),
        disabled: root.querySelector(".speech-controls-disabled input"),
        handler: root.querySelector(".speech-handler")
      };
      this.elements.handler.addEventListener("click", () => {
        this.utterance.show = !this.utterance.show;
        controls.classList.toggle("speech-controls-show", this.utterance.show);
        this.saveLocalConfig();
      });
      controls.classList.toggle("speech-controls-show", this.utterance.show);
      this.elements.play.addEventListener("change", (e) => {
        const target = e.target;
        if (target.checked) {
          window.speechSynthesis.resume();
        } else {
          window.speechSynthesis.pause();
        }
      });
      this.onVoices((voices) => {
        var _a;
        if (voices.length === 0)
          return;
        this.voices = voices.filter((voice) => voice.lang === this.opts.lang);
        this.elements.voice.innerHTML = this.voices.map((v) => `<option value="${v.voiceURI}">${v.name}</option>`).join("");
        if (this.utterance.voiceURI) {
          this.elements.voice.value = this.utterance.voiceURI;
          this.refreshSpeech();
        }
        if (this.utterance.continuous && this.currentSpeakingParagraphIdx === null) {
          (_a = this.paragraphList[0]) == null ? void 0 : _a.click();
        }
      });
      this.elements.voice.value = this.utterance.voiceURI || "";
      this.elements.voice.addEventListener("change", (e) => {
        const target = e.target;
        const find = this.voices.find((voice) => voice.voiceURI === target.value);
        if (find) {
          this.utterance.voiceURI = find.voiceURI;
          this.saveLocalConfig();
          this.refreshSpeech();
        }
      });
      this.elements.rate.value = this.utterance.rate.toString();
      this.elements.rate.addEventListener("change", (e) => {
        const target = e.target;
        this.utterance.rate = Number(target.value);
        this.saveLocalConfig();
        this.refreshSpeech();
      });
      this.elements.continuous.checked = this.utterance.continuous;
      this.elements.continuous.addEventListener("change", (e) => {
        const target = e.target;
        this.utterance.continuous = target.checked;
        this.saveLocalConfig();
      });
      this.elements.disabled.checked = this.utterance.disabled;
      this.elements.disabled.addEventListener("change", (e) => {
        const target = e.target;
        this.utterance.disabled = target.checked;
        window.speechSynthesis.cancel();
        this.saveLocalConfig();
      });
      keybind(["space"], (e) => {
        e.preventDefault();
        this.elements.play.click();
      });
      keybind(["w"], (e) => {
        e.preventDefault();
        if (this.currentSpeakingParagraphIdx !== null) {
          this.paragraphList[this.currentSpeakingParagraphIdx - 1].click();
        }
      });
      keybind(["s"], (e) => {
        e.preventDefault();
        if (this.currentSpeakingParagraphIdx !== null) {
          this.paragraphList[this.currentSpeakingParagraphIdx + 1].click();
        }
      });
      keybind(["d"], (e) => {
        e.preventDefault();
        this.opts.nextChapter();
      });
    }
    refreshSpeech() {
      const idx = this.currentSpeakingParagraphIdx;
      if (idx === null)
        return;
      const p = this.paragraphList[idx];
      p == null ? void 0 : p.click();
    }
    saveLocalConfig() {
      localStorage.setItem("speech-utterance", JSON.stringify(this.utterance));
    }
    loadLocalConfig() {
      const utterance = localStorage.getItem("speech-utterance");
      if (utterance) {
        this.utterance = JSON.parse(utterance);
      }
    }
    onVoices(callback) {
      callback(window.speechSynthesis.getVoices());
      window.speechSynthesis.onvoiceschanged = () => {
        callback(window.speechSynthesis.getVoices());
      };
    }
    speakParagraph(index) {
      return new Promise((resolve, reject) => {
        window.speechSynthesis.cancel();
        this.elements.play.checked = true;
        const scrollElement = this.opts.scrollElement ? document.querySelector(this.opts.scrollElement) : document.scrollingElement;
        document.querySelectorAll(".speech-reading").forEach((p2) => {
          p2.classList.remove("speech-reading");
        });
        const p = this.paragraphList[index];
        if (p && p.textContent) {
          const utterance = new SpeechSynthesisUtterance(p.textContent);
          utterance.lang = this.opts.lang;
          utterance.rate = this.utterance.rate;
          utterance.voice = this.voices.find(
            (voice) => this.utterance.voiceURI === voice.voiceURI
          ) || null;
          utterance.addEventListener("start", (e) => {
            console.log("start", e);
            p.classList.add("speech-reading");
            if (scrollElement) {
              const { y } = p.getBoundingClientRect();
              if (top) {
                scrollElement.scrollBy({ top: y - 100, behavior: "smooth" });
              }
            }
          });
          utterance.addEventListener("end", (e) => {
            console.log("end", e);
            p.classList.remove("speech-reading");
            if (this.utterance.continuous && index === this.paragraphList.length - 1) {
              this.opts.nextChapter();
            }
            resolve();
          });
          utterance.addEventListener("error", (e) => {
            console.error("error", e);
            p.classList.remove("speech-reading");
            console.error(e);
            reject(e);
          });
          console.log("utterance", utterance);
          window.speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      });
    }
    resume() {
      window.speechSynthesis.resume();
    }
    pause() {
      window.speechSynthesis.pause();
    }
    cancel() {
      window.speechSynthesis.cancel();
    }
    get speaking() {
      return window.speechSynthesis.speaking;
    }
    get pending() {
      return window.speechSynthesis.pending;
    }
    get currentSpeakingParagraphIdx() {
      const dom = document.querySelector(".speech-reading");
      if (!dom)
        return null;
      return Number(dom.getAttribute("data-speech-idx"));
    }
  }

  function deepParseParagraph(content) {
    content.querySelectorAll("br").forEach((el) => el.remove());
    const deep = (node) => {
      const els = Array.from(node.childNodes);
      els.forEach((el) => {
        if (el.nodeType === Node.TEXT_NODE) {
          const p = document.createElement("p");
          p.textContent = el.textContent.trim();
          p.style.textIndent = "2em";
          p.style.paddingBottom = "1em";
          if (!p.textContent)
            el.remove();
          else
            el.replaceWith(p);
        } else if (el.nodeType === Node.ELEMENT_NODE) {
          deep(el);
        }
      });
    };
    deep(content);
    let checking = true;
    while (checking) {
      checking = Array.from(content.querySelectorAll("p")).some((p) => {
        if (p.querySelector("p")) {
          const div = document.createElement("div");
          div.innerHTML = p.innerHTML;
          p.replaceWith(div);
          return true;
        }
        return false;
      });
    }
  }
  const adapters = [
    {
      domain: ["bilixs.com"],
      routes: [
        {
          path: /novel\/.*\/.*\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector(".article-content");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              const dom = document.querySelector(".footer .f-right");
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    },
    {
      domain: ["linovelib.com"],
      routes: [
        {
          path: /novel\/.*\/.*\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector(".read-content");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p")).filter(
                (o) => o.clientHeight
              );
            },
            nextChapter() {
              var _a;
              const dom = document.querySelectorAll(".mlfy_page a");
              (_a = Array.from(dom).find((d) => d.innerText.match(/下一[章页]/))) == null ? void 0 : _a.click();
            }
          },
          run() {
            const speech = new Speech(this.speech);
            const ob = new MutationObserver(() => {
              if (speech.paragraphList.length !== speech.opts.getParagraph().length) {
                speech.setupParagraph();
              }
            });
            ob.observe(document.querySelector(".read-content"), {
              childList: true
            });
          }
        }
      ]
    },
    {
      domain: ["bilinovel.com"],
      routes: [
        {
          path: /novel\/.*\/.*\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector("#acontentz");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              var _a;
              (_a = document.querySelector("#footlink > a:last-child")) == null ? void 0 : _a.click();
            }
          },
          run() {
            const speech = new Speech(this.speech);
            const ob = new MutationObserver(() => {
              if (speech.paragraphList.length !== speech.opts.getParagraph().length) {
                speech.setupParagraph();
              }
            });
            ob.observe(document.querySelector("#acontentz"), {
              childList: true
            });
          }
        }
      ]
    },
    {
      domain: ["novel18.syosetu.com"],
      routes: [
        {
          pathname: /^\/([^/]+?)\/([^/]+?)\/?$/,
          speech: {
            container: "body",
            lang: "ja-JP",
            getParagraph: () => {
              const content = document.querySelector("#novel_honbun");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter: () => {
              let dom = document.querySelector(
                '.novel_bn a[rel="next"]'
              );
              if (!dom) {
                dom = document.querySelector(
                  ".novel_bn a:last-child"
                );
              }
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    },
    {
      domain: ["esjzone.cc"],
      routes: [
        {
          path: /forum\/[^/]+\/[^/]+\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector(".forum-content");
              if (!content)
                throw new Error("content not found");
              deepParseParagraph(content);
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              const dom = document.querySelector(".btn-next");
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    },
    {
      domain: ["kakuyomu.jp"],
      routes: [
        {
          pathname: /^\/works\/\d+\/episodes\/\d+$/,
          speech: {
            container: "body",
            lang: "ja-JP",
            getParagraph: () => {
              const content = document.querySelector(".widget-episodeBody");
              if (!content)
                throw new Error("content not found");
              return Array.from(content.querySelectorAll("p"));
            },
            nextChapter() {
              const dom = document.querySelector(
                "#contentMain-readNextEpisode"
              );
              dom == null ? void 0 : dom.click();
            }
          }
        }
      ]
    },
    {
      domain: ["piaotia.com"],
      routes: [
        {
          path: /html\/[^/]+\/[^/]+\/[^/]+\.html/,
          speech: {
            container: "body",
            lang: "zh-CN",
            getParagraph: () => {
              const content = document.querySelector("#content");
              if (!content)
                throw new Error("content not found");
              content.querySelectorAll("br").forEach((o) => o.remove());
              return Array.from(content.childNodes).filter(
                (o) => o.nodeType === Node.TEXT_NODE && o.textContent.trim()
              ).map((o) => {
                const p = document.createElement("p");
                p.textContent = o.textContent.trim();
                p.style.textIndent = "2em";
                p.style.paddingBottom = "1em";
                o.replaceWith(p);
                return p;
              });
            },
            nextChapter() {
              var _a;
              (_a = document.querySelector(
                "#content > div > a:nth-child(3)"
              )) == null ? void 0 : _a.click();
            }
          }
        }
      ]
    }
  ];

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  adapters.forEach((adapter) => {
    router({
      domain: adapter.domain,
      routes: adapter.routes.map((route) => {
        return __spreadProps(__spreadValues({}, route), {
          run: () => {
            if (route.run) {
              route.run();
            } else if (route.speech)
              new Speech(route.speech);
          }
        });
      })
    });
  });

})();
