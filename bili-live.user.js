// ==UserScript==
// @name         bili-live
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/bili-live
// @version      1.0.0
// @license      MIT
// @description  优化直播间开播设置
// @author       IronKinoko
// @match        https://link.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/bili-live.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/bili-live.user.js
// ==/UserScript==
(function () {
  'use strict';

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

  function setup() {
    hookXHR();
  }
  function run() {
  }
  function hookXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._requestURL = url;
      this._requestMethod = method;
      return originalOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function(body) {
      const xhr = this;
      const url = this._requestURL;
      this._requestMethod;
      if (url && url.includes("GetWebLivePermission")) {
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            try {
              if (xhr.status >= 200 && xhr.status < 300) {
                let responseData = JSON.parse(xhr.responseText);
                if (responseData.data) {
                  responseData.data.allow_live = true;
                }
                Object.defineProperty(xhr, "responseText", {
                  get: function() {
                    return JSON.stringify(responseData);
                  }
                });
              }
            } catch (e) {
              console.error("\u4FEE\u6539GetWebLivePermission\u8FD4\u56DE\u503C\u51FA\u9519:", e);
            }
          }
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments);
          }
        };
      }
      if (url && url.includes("/room/v1/Room/startLive")) {
        const isString = typeof body === "string";
        const params = isString ? new URLSearchParams(body) : body;
        params.set("platform", "mobile");
        arguments[0] = isString ? params.toString() : params;
      }
      return originalSend.apply(this, arguments);
    };
  }

  router({
    domain: "link.bilibili.com",
    routes: [
      { path: "/p/center/index", setup: setup, run: run }
    ]
  });

})();
