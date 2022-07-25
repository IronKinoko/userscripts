// ==UserScript==
// @name         修复copymanga图片错误
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/copymanga
// @version      1.1.1
// @license      MIT
// @description  处理图片资源加载失败时自动重新加载
// @author       IronKinoko
// @match        https://www.copymanga.org/*
// @icon         https://www.google.com/s2/favicons?domain=www.copymanga.org
// @grant        none
// @noframes
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/copymanga.user.js
// ==/UserScript==
(function () {
  'use strict';

  function s2d(string) {
    return new DOMParser().parseFromString(string, "text/html").body.firstChild;
  }
  function addErrorListener(img) {
    if (img.dataset.inject === "true")
      return;
    img.dataset.inject = "true";
    img.onerror = () => {
      const url = new URL(img.src);
      let v = parseInt(url.searchParams.get("v")) || 0;
      if (v > 5)
        return img.onerror = null;
      url.searchParams.set("v", ++v + "");
      img.src = url.toString();
      img.alt = "\u56FE\u7247\u52A0\u8F7D\u51FA\u9519";
    };
  }

  function sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

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

  async function openControl() {
    const li = await waitDOM("li.comicContentPopupImageItem");
    li.dispatchEvent(fakeClickEvent());
    await sleep(0);
    li.dispatchEvent(fakeClickEvent());
  }
  function fakeClickEvent() {
    const { width, height } = document.body.getBoundingClientRect();
    return new MouseEvent("click", { clientX: width / 2, clientY: height / 2 });
  }
  async function currentPage() {
    try {
      if (!/h5\/comicContent\/.*/.test(location.href))
        return;
      const scrollHeight = document.scrollingElement.scrollTop;
      const list = await waitHasComicContent();
      let height = 0;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        height += item.getBoundingClientRect().height;
        if (height > scrollHeight) {
          const dom = document.querySelector(".comicContentPopup .comicFixed");
          dom.textContent = dom.textContent.replace(/(.*)\//, `${i + 1}/`);
          break;
        }
      }
    } catch (e) {
    }
  }
  async function runH5main() {
    try {
      if (!/h5\/comicContent\/.*/.test(location.href))
        return;
      const ulDom = await waitDOM(".comicContentPopupImageList");
      const uuid = getComicId();
      const domUUID = ulDom.dataset.uuid;
      if (domUUID !== uuid) {
        ulDom.dataset.uuid = uuid;
      }
      injectFixImg$1();
      const main = ulDom.parentElement;
      main.style.position = "unset";
      main.style.overflowY = "unset";
      let nextPartDom = document.querySelector("#comicContentMain #nextpart");
      let nextButton = document.querySelector(".comicControlBottomTop > div:nth-child(3) > span");
      if (!nextPartDom) {
        if (!nextButton) {
          await openControl();
          nextButton = document.querySelector(".comicControlBottomTop > div:nth-child(3) > span");
        }
        nextPartDom = document.createElement("div");
        nextPartDom.style.textAlign = "center";
        nextPartDom.style.lineHeight = "50px";
        nextPartDom.style.fontSize = "16px";
        nextPartDom.style.paddingBottom = "100px";
        nextPartDom.textContent = "\u4E0B\u4E00\u8BDD";
        nextPartDom.id = "nextpart";
        nextPartDom.onclick = async (e) => {
          e.stopPropagation();
          nextButton && nextButton.click();
          document.scrollingElement.scrollTop = 0;
        };
        document.getElementById("comicContentMain").appendChild(nextPartDom);
      }
      nextPartDom.style.display = nextButton.parentElement.classList.contains("noneUuid") ? "none" : "block";
    } catch (error) {
      console.error(error);
    }
  }
  function getComicId() {
    const [, uuid] = location.href.match(/h5\/comicContent\/.*\/(.*)/);
    return uuid;
  }
  async function waitHasComicContent() {
    return document.querySelectorAll(".comicContentPopupImageItem");
  }
  async function addH5HistoryListener() {
    history.pushState = _historyWrap("pushState");
    history.replaceState = _historyWrap("replaceState");
    window.addEventListener("pushState", runH5main);
    window.addEventListener("replaceState", runH5main);
    window.addEventListener("popstate", runH5main);
    window.addEventListener("scroll", currentPage);
    runH5main();
  }
  const _historyWrap = function(type) {
    const orig = history[type];
    const e = new Event(type);
    return function() {
      const rv = orig.apply(this, arguments);
      window.dispatchEvent(e);
      return rv;
    };
  };
  async function injectFixImg$1() {
    const listDOM = await waitDOM(".comicContentPopupImageList");
    async function injectEvent() {
      const imgs = document.querySelectorAll("ul li img");
      imgs.forEach(addErrorListener);
    }
    const ob = new MutationObserver(injectEvent);
    ob.observe(listDOM, { childList: true, subtree: true });
    injectEvent();
  }
  function h5() {
    addH5HistoryListener();
  }

  function replaceHeader() {
    const header = document.querySelector(".container.header-log .row");
    if (header) {
      header.style.flexWrap = "nowrap";
      header.querySelector("div:nth-child(6)").replaceWith(s2d(`<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/shujia">\u6211\u7684\u4E66\u67B6</a>
            <div class="log-unboder"></div>
          </div>
        </div>`));
      header.querySelector("div:nth-child(7)").replaceWith(s2d(`<div class="col-1">
          <div class="log-txt">
            <a href="/web/person/liulan">\u6211\u7684\u6D4F\u89C8</a>
            <div class="log-unboder"></div>
          </div>
        </div>`));
      header.querySelector("div:nth-child(8)").className = "col";
      header.querySelector("div.col > div > div").style.justifyContent = "flex-end";
    }
  }
  async function injectFixImg() {
    const listDOM = await waitDOM("ul.comicContent-list");
    async function injectEvent() {
      const imgs = document.querySelectorAll("ul li img");
      imgs.forEach(addErrorListener);
    }
    const ob = new MutationObserver(injectEvent);
    ob.observe(listDOM, { childList: true, subtree: true });
    injectEvent();
  }
  function pc() {
    if (/comic\/.*\/chapter/.test(location.href)) {
      injectFixImg();
    }
    replaceHeader();
  }

  if (location.pathname.startsWith("/h5")) {
    h5();
  } else {
    pc();
  }

})();
