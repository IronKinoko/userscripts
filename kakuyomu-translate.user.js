// ==UserScript==
// @name         kakuyomu-translate
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/kakuyomu-translate
// @version      2.1.8
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://kakuyomu.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kakuyomu.jp
// @grant        none
// @noframes
// @require      https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/kakuyomu-translate.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/kakuyomu-translate.user.js
// ==/UserScript==
(function () {
  'use strict';

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = "html[lang=zh-CN] .widget-episodeBody font {\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif;\n}\n\nruby rt {\n  -webkit-user-select: none;\n  user-select: none;\n}\n\n.ruby-hidden ruby rt {\n  display: none;\n}";
  n(css,{});

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

  async function main() {
    autoScrollIntoView();
    broadcastHoverText();
    autoFurigana();
  }
  function broadcastHoverText() {
    let channel = new BroadcastChannel("kakuyomu-translate");
    $(".widget-episodeBody").children().each((i, dom) => {
      const id = dom.id;
      dom.addEventListener("mouseenter", () => {
        const top = dom.getBoundingClientRect().top;
        channel.postMessage({ type: "focus", id, top });
      });
      dom.addEventListener("mouseleave", () => {
        channel.postMessage({ type: "blur", id });
      });
    });
    $("#contentMain-nextEpisode a, #contentMain-previousEpisode a").on(
      "click",
      (e) => {
        channel.postMessage({
          type: "jump",
          href: e.currentTarget.getAttribute("href")
        });
      }
    );
    handleMessage(channel);
  }
  async function handleMessage(channel) {
    channel.addEventListener("message", (e) => {
      const data = e.data;
      if (data.type === "focus") {
        const dom = document.getElementById(data.id);
        const rect = dom.getBoundingClientRect();
        window.scrollBy({ top: rect.y - data.top, behavior: "smooth" });
      }
      if (data.type === "jump") {
        window.location.href = data.href;
      }
    });
  }
  async function autoScrollIntoView() {
    const asideEl = await waitDOM("#contentAside");
    const detect = () => {
      const activeEpisodeEl = asideEl.querySelector(
        ".widget-toc-main .widget-toc-items .widget-toc-episode.isHighlighted"
      );
      if (!activeEpisodeEl)
        return;
      activeEpisodeEl.scrollIntoView({ block: "center" });
      ob.disconnect();
    };
    const ob = new MutationObserver(detect);
    ob.observe(asideEl, { childList: true });
  }
  async function autoFurigana() {
    const article = await queryArticleFurigana();
    if (article) {
      document.querySelector("#contentMain-inner").outerHTML = article;
      document.body.addEventListener("dblclick", () => {
        $("body").toggleClass("ruby-hidden");
      });
    }
  }
  async function queryArticleFurigana() {
    const [, workId, episodeId] = window.location.pathname.match(
      /works\/(.*)\/episodes\/(.*)/
    );
    const url = `https://userscripts-proxy.vercel.app/api/kakuyomu/furigana?workId=${workId}&episodeId=${episodeId}`;
    try {
      const data = await fetch(url).then((r) => r.json());
      if (!data.ok)
        throw new Error(data.message);
      return data.html;
    } catch (error) {
      console.error(error);
      alert(`\u63A5\u53E3\u8C03\u7528\u5931\u8D25 ${error.message}`);
      return null;
    }
  }

  router([{ path: /works\/.*\/episodes\/.*/, run: main }]);

})();
