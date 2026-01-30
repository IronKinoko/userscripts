// ==UserScript==
// @name         bilixs
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/bilixs
// @version      1.0.1
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://hans.bilixs.com/*
// @match        https://www.bilixs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bilixs.com
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/bilixs.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/bilixs.user.js
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

  router([
    {
      path: /novel\/.*\/.*\.html/,
      run: () => {
        const href = $(".footer > a.f-right").attr("href");
        $("head").append(`<link rel="prefetch" href="${href}" />`);
        keybind(["a", "d", "ArrowLeft", "ArrowRight"], (e, key) => {
          switch (key) {
            case "a":
            case "ArrowLeft":
              $(".footer > a.f-left")[0].click();
              break;
            case "d":
            case "ArrowRight":
              $(".footer > a.f-right")[0].click();
              break;
          }
        });
      }
    }
  ]);

})();
