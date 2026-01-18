// ==UserScript==
// @name         esjzone
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/esjzone
// @version      1.1.2
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://www.esjzone.cc/*
// @icon         https://www.google.com/s2/favicons?domain=esjzone.cc
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/esjzone.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/esjzone.user.js
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

  function removeLoveEmoji() {
    function transBody(node) {
      const nodes = node ? node.childNodes : document.body.childNodes;
      for (const node2 of nodes) {
        if (node2.nodeType === node2.TEXT_NODE) {
          const text = node2;
          text.data = text.data.replace(/❤/g, "\u2764\uFE0E");
        } else {
          transBody(node2);
        }
      }
    }
    transBody();
  }
  function customizerEnhance() {
    const el = document.querySelector(".customizer");
    let lastScrollTop = 0;
    el.style.transition = "opacity 0.15s, right 0.3s";
    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        el.style.opacity = "0";
        lastScrollTop = scrollTop;
      } else if (scrollTop + 20 < lastScrollTop || scrollTop < 50) {
        lastScrollTop = scrollTop;
        el.style.opacity = "1";
      }
    });
  }
  function enhanceBackground() {
    const nav = document.querySelector(".navbar");
    const fn = () => {
      document.body.id = nav.id;
      document.querySelector(".page-title").id = nav.id;
    };
    fn();
    const observer = new MutationObserver(fn);
    observer.observe(nav, { attributes: true });
  }
  function main() {
    removeLoveEmoji();
    customizerEnhance();
    enhanceBackground();
  }

  router([{ path: /forum\/\d+\/\d+\.html/, run: main }]);

})();
