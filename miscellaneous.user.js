// ==UserScript==
// @name         miscellaneous
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/miscellaneous
// @version      1.1.2
// @license      MIT
// @description  杂项，所有无法归类的脚本都放在这里
// @author       IronKinoko
// @match        https://c.pc.qq.com/*
// @match        https://pan.baidu.com/share/init*
// @match        https://www.acggw.me/*
// @icon         https://q.qlogo.cn/g?b=qq&nk=707819027&s=100
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/miscellaneous.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/miscellaneous.user.js
// ==/UserScript==
(function () {
  'use strict';

  function sleep(ms) {
    if (!ms) {
      return new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
    }
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function wait(selector) {
    let bool = await selector();
    while (!bool) {
      await sleep();
      bool = await selector();
    }
  }

  async function waitDOM(selector, root = document) {
    await wait(() => !!root.querySelector(selector));
    return root.querySelector(selector);
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

  router({
    domain: "acggw.me",
    routes: [{ path: /\d+\.html/, run: linkMergePassword }]
  });
  async function linkMergePassword() {
    var _a, _b;
    const lines = Array.from(document.querySelectorAll(".content .single > p"));
    function makeLink(line) {
      var _a2;
      const urlMatch = (_a2 = line.textContent) == null ? void 0 : _a2.match(/(https?:\/\/\S+)/);
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
    const mega = lines.filter((line) => line.textContent.includes("M\u76D8"));
    if (mega.length === 2) {
      const [linkLine, pwdLine] = mega;
      linkLine.textContent = `${linkLine.textContent}#${(_a = pwdLine.textContent.split(/：|:/).pop()) == null ? void 0 : _a.trim()}`;
      makeLink(linkLine);
    }
    const baidu = lines.filter(
      (line) => line.textContent.match(/pan\.baidu\.com|提取码/)
    );
    if ([2, 3].includes(baidu.length)) {
      const linkLine = baidu[0];
      const pwdLine = baidu[baidu.length - 1];
      linkLine.textContent = `${linkLine.textContent}?pwd=${(_b = pwdLine.textContent.split(/：|:/).pop()) == null ? void 0 : _b.trim()}`;
      makeLink(linkLine);
    }
  }

  router({
    domain: "pan.baidu.com",
    routes: [{ path: "/share/init", run: autoSubmit }]
  });
  async function autoSubmit() {
    const url = new URL(window.location.href);
    const pwd = url.searchParams.get("pwd");
    if (!pwd)
      return;
    const btn = await waitDOM("#submitBtn");
    btn.click();
  }

  router({
    domain: "c.pc.qq.com",
    routes: [{ run: qqRedirect }]
  });
  function qqRedirect() {
    const url = new URL(window.location.href);
    if (url.pathname === "/middlem.html") {
      const target = url.searchParams.get("pfurl");
      if (target)
        window.location.replace(target);
    }
    if (url.pathname === "/ios.html") {
      const target = url.searchParams.get("url");
      if (target)
        window.location.replace(target);
    }
  }

})();
