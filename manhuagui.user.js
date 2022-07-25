// ==UserScript==
// @name         manhuagui
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/manhuagui
// @version      1.0.1
// @license      MIT
// @description  enhance manhuagui
// @author       IronKinoko
// @match        https://www.manhuagui.com/comic/*
// @icon         https://www.google.com/s2/favicons?domain=manhuagui.com
// @grant        none
// @noframes
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/manhuagui.user.js
// ==/UserScript==
(function () {
  'use strict';

  async function waitDOM(selector) {
    return new Promise((resolve, reject) => {
      const now = Date.now();
      function getDOM() {
        if (Date.now() - now > 5e3)
          reject();
        const dom = document.querySelector(selector);
        if (dom) {
          resolve(dom);
        } else {
          requestAnimationFrame(getDOM);
        }
      }
      getDOM();
    });
  }

  function isMobile() {
    const re = /iphone|ipod|android|webos|blackberry|windows phone/i;
    const ua = navigator.userAgent;
    return re.test(ua);
  }

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".k-custom-btn.k-custom-btn {\n  text-indent: 0;\n  background: #b5b5b5;\n  color: white;\n  line-height: 40px;\n  text-align: center;\n  text-decoration: none;\n}\n.k-custom-btn.k-custom-btn:hover {\n  background: #c00f20;\n}\n\n.backToTop {\n  height: auto !important;\n}\n\n.tbCenter {\n  border: none !important;\n  background: none !important;\n}\n\n[data-tag=mangaFile] {\n  width: 980px !important;\n}\n\n.big-h5-btn {\n  width: calc(100% - 72px);\n  display: block;\n  height: 100px;\n  background-color: #c00f20;\n  color: white;\n  font-size: 36px;\n  margin: 36px auto;\n  outline: 0;\n  border: #c00f20;\n}";
  n(css,{});

  (async () => {
    document.oncontextmenu = null;
    createNextBtn();
    createFullScreen();
    createNextBtnInH5();
  })();
  async function createNextBtn() {
    const dom = await waitDOM(".backToTop");
    const a = document.createElement("a");
    a.innerHTML = "NEXT";
    a.className = "k-custom-btn";
    a.id = "show-next";
    a.href = "javascript:;";
    a.onclick = window.SMH.nextC;
    dom.append(a);
  }
  async function createFullScreen() {
    const dom = await waitDOM(".backToTop");
    const a = document.createElement("a");
    a.innerHTML = "FULL";
    a.className = "k-custom-btn";
    a.id = "full-btn";
    a.href = "javascript:;";
    a.onclick = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        a.innerHTML = "FULL";
      } else {
        document.documentElement.requestFullscreen();
        a.innerHTML = "EXIT";
      }
    };
    dom.append(a);
    document.addEventListener("keypress", (e) => {
      if (document.activeElement && /textarea|input|select/i.test(document.activeElement.tagName)) {
        return;
      }
      if (e.key === "f") {
        a.click();
      }
    });
  }
  async function createNextBtnInH5() {
    if (!isMobile())
      return;
    const $pagination = await waitDOM("#pagination");
    $pagination.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "big-h5-btn";
    btn.textContent = "\u4E0B\u4E00\u7AE0";
    btn.onclick = () => window.SMH.nextC();
    $pagination.replaceWith(btn);
  }

})();
