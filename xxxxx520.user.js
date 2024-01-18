// ==UserScript==
// @name         xxxxx520
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/xxxxx520
// @version      1.2.2
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://xxxxx520.com/*
// @match        https://xxxxx525.com/*
// @match        https://xxxxx528.com/*
// @match        https://xxxxx520.cam/*
// @match        https://*.gamer520.com/*
// @match        https://download.gamer520.com/*
// @match        https://download.espartasr.com/*
// @match        https://*.fourpetal.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xxxxx528.com
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/xxxxx520.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/xxxxx520.user.js
// ==/UserScript==
(function () {
  'use strict';

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
  function set(arg1, arg2) {
    let options = {
      name: "",
      value: "",
      maxAge: 24 * 60 * 60,
      path: "/"
    };
    if (typeof arg1 === "object") {
      Object.assign(options, arg1);
    } else {
      options.name = arg1;
      options.value = arg2;
    }
    options.value = encodeURIComponent(options.value);
    document.cookie = [
      `${options.name}=${options.value}`,
      `max-age=${options.maxAge}`,
      !!options.domain && `domain=${options.domain}`,
      !!options.path && `path=${options.path}`,
      !!options.sameSite && `sameSite=${options.sameSite}`,
      !!options.secure && `secure`
    ].filter(Boolean).join(";");
  }
  function get(name) {
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    let arr = document.cookie.match(reg);
    if (arr) {
      return decodeURIComponent(arr[2]);
    } else {
      return null;
    }
  }
  function remove(arg1) {
    if (typeof arg1 === "string") {
      set({ name: arg1, value: "", maxAge: 0 });
    } else {
      set(__spreadProps(__spreadValues({}, arg1), { maxAge: 0 }));
    }
  }
  const Cookie = {
    get,
    set,
    remove
  };

  function createStorage(storage) {
    function getItem(key, defaultValue) {
      try {
        const value = storage.getItem(key);
        if (value)
          return JSON.parse(value);
        return defaultValue;
      } catch (error) {
        return defaultValue;
      }
    }
    return {
      getItem,
      setItem(key, value) {
        storage.setItem(key, JSON.stringify(value));
      },
      removeItem: storage.removeItem.bind(storage),
      clear: storage.clear.bind(storage)
    };
  }
  const session = createStorage(window.sessionStorage);
  createStorage(window.localStorage);

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
    routes.forEach((route) => {
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
      if (match)
        route.run();
    });
  }

  function detail$1() {
    moveDownloadToTop$1();
    enhanceDownload$1();
    baiduCloudLinkAutoComplete$1();
    modifyAnchorTarget$1();
  }
  function enhanceDownload$1() {
    const downBtn = document.querySelector(".go-down");
    if (!downBtn)
      return;
    downBtn.href = `${window.location.origin}/go/?post_id=${downBtn.dataset.id}`;
    downBtn.addEventListener("click", (e) => e.stopPropagation(), true);
  }
  function moveDownloadToTop$1() {
    const $area = $(".sidebar-right .sidebar-column .widget-area");
    const $down = $(".cao_widget_pay-4");
    $area.prepend($down);
  }
  function baiduCloudLinkAutoComplete$1() {
    const $root = $("article .entry-content");
    let panEl = null;
    $root.find("p").each((i, el) => {
      var _a;
      if (el.innerText.match(/pan\.baidu\.com/)) {
        panEl = el;
      }
      if (el.innerText.match(/提取码/) && panEl) {
        const match = panEl.innerText.match(/https:\/\/pan.baidu.com\/s\/\S+/);
        if (!match)
          return;
        const link = match[0];
        const url = new URL(link);
        const pwd = (_a = el.innerText.match(/提取码[:：]\s?(\w{4})/)) == null ? void 0 : _a[1];
        if (!pwd)
          return;
        url.searchParams.set("pwd", pwd);
        panEl.innerHTML = panEl.innerHTML.replaceAll(link, url.toString());
        panEl = null;
      }
    });
  }
  function modifyAnchorTarget$1() {
    $("article .entry-content a").each((i, el) => {
      el.target = "_blank";
    });
  }

  function skipModal() {
    Cookie.set({
      name: "cao_notice_cookie",
      value: "1",
      maxAge: 24 * 60 * 60 * 999
    });
  }
  router({
    domain: ["xxxxx", "www.gamer"],
    routes: [{ run: skipModal }, { pathname: /.*\.html/, run: detail$1 }]
  });

  function detail() {
    autoCompletePassowrd();
    moveDownloadToTop();
    enhanceDownload();
    baiduCloudLinkAutoComplete();
    modifyAnchorTarget();
  }
  function autoCompletePassowrd() {
    const $pwd = $("#password");
    if (!$pwd.length || session.getItem("is-auto-complete"))
      return;
    const $submit = $("input[name=Submit]");
    const pwdSource = [$(".entry-title").text(), $("form>p").text()];
    const re = /密码保护(?:：|:)(\w+)/;
    const pwd = pwdSource.map((s) => {
      var _a;
      return (_a = s.match(re)) == null ? void 0 : _a[1];
    }).find((s) => s);
    if (!pwd)
      return;
    session.setItem("is-auto-complete", true);
    $pwd.val(pwd);
    $submit[0].click();
  }
  function enhanceDownload() {
    const downBtn = document.querySelector(".go-down");
    if (!downBtn)
      return;
    downBtn.href = `${window.location.origin}/go/?post_id=${downBtn.dataset.id}`;
    downBtn.addEventListener("click", (e) => e.stopPropagation(), true);
  }
  function moveDownloadToTop() {
    const $area = $(".sidebar-right .sidebar-column .widget-area");
    const $down = $("#cao_widget_pay-4");
    $area.prepend($down);
  }
  function baiduCloudLinkAutoComplete() {
    function complete() {
      const $root = $("article .entry-content");
      let panEl = null;
      $root.find("p").each((i, el) => {
        var _a;
        if (el.innerText.match(/pan\.baidu\.com/)) {
          panEl = el;
        }
        if (el.innerText.match("\u63D0\u53D6\u7801") && panEl) {
          const match = panEl.innerText.match(/https:\/\/pan.baidu.com\/s\/\S+/);
          if (!match)
            return;
          const link = match[0];
          const url = new URL(link);
          if (url.searchParams.has("pwd"))
            return;
          const pwd = (_a = el.innerText.match(/提取码[:：]\s?(\w{4})/)) == null ? void 0 : _a[1];
          if (!pwd)
            return;
          url.searchParams.set("pwd", pwd);
          panEl.innerHTML = panEl.innerHTML.replaceAll(link, url.toString());
          panEl = null;
        }
      });
    }
    new MutationObserver(complete).observe(document.body, {
      subtree: true,
      childList: true
    });
  }
  function modifyAnchorTarget() {
    $("article .entry-content a").each((i, el) => {
      el.target = "_blank";
    });
  }

  router({
    domain: ["fourpetal", "dow"],
    routes: [{ pathname: /.*\.html/, run: detail }]
  });

})();
