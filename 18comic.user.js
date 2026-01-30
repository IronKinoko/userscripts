// ==UserScript==
// @name         18comic
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/18comic
// @version      1.0.1
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://18comic.vip/*
// @match        https://18comic.org/*
// @match        https://jmcomic.me/*
// @match        https://jmcomic1.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18comic.vip
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/18comic.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/18comic.user.js
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

  function main() {
    fixImgError();
    addRefreshButton();
  }
  async function getImages() {
    await wait(() => !!window.page_arr);
    return window.page_arr.map((id) => {
      return document.querySelector(`[id="${id}"] img`);
    });
  }
  async function fixImgError() {
    const imgs = await getImages();
    imgs.forEach((img) => {
      img.onerror = () => {
        setTimeout(() => {
          refreshImg(img);
        }, 300);
      };
    });
  }
  function refreshImg(imgEl) {
    const url = new URL(imgEl.dataset.original);
    url.searchParams.set("_key", Math.random().toString());
    imgEl.src = url.toString();
  }
  async function addRefreshButton() {
    const $dom = $(`<li><a href="javascript:void(0)"><span>\u91CD\u8FDE</span></a></li>`);
    $dom.on("click", async () => {
      const imgs = await getImages();
      imgs.forEach((img) => {
        if (!img.complete) {
          refreshImg(img);
        }
      });
    });
    $("#pageselect").parent().before($dom);
  }

  router([{ path: "/photo/", run: main }]);

})();
