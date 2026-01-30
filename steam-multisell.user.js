// ==UserScript==
// @name         Steam 批量出售
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/steam-multisell
// @version      1.1.2
// @license      MIT
// @description  修复批量出售 Steam 库存时出现“您的库存当前不可用”的问题，并且在货物详情页面增加批量出售按钮
// @author       IronKinoko
// @match        https://steamcommunity.com/market/listings/*
// @match        https://steamcommunity.com/market/multisell*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/steam-multisell.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/steam-multisell.user.js
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

  function run$1() {
    createMultisellButton();
    createMultiCancelButton();
  }
  function createMultisellButton() {
    const button = document.createElement("a");
    button.className = "btn_green_white_innerfade";
    button.style.float = "right";
    button.textContent = "\u6279\u91CF\u51FA\u552E";
    button.target = "_blank";
    const [id, item] = extractLastSegment(window.location.pathname);
    const steamUrl = `https://steamcommunity.com/market/multisell?appid=${id}&contextid=2&items[]=${item}`;
    button.href = steamUrl;
    document.querySelector("#tabContentsMyActiveMarketListingsTable > h3").appendChild(button);
    function extractLastSegment(url) {
      const parts = url.split("/").filter(Boolean);
      return parts.slice(-2);
    }
  }
  function createMultiCancelButton() {
    var _a;
    const button = document.createElement("a");
    button.className = "btn_green_white_innerfade";
    button.style.float = "right";
    button.style.marginRight = "8px";
    button.textContent = "\u6279\u91CF\u53D6\u6D88";
    button.target = "_blank";
    const sessionid = window.g_sessionID;
    const cancel = async (id) => {
      var _a2;
      await fetch(`https://steamcommunity.com/market/removelisting/${id}`, {
        body: new URLSearchParams({ sessionid }),
        method: "POST"
      });
      (_a2 = document.getElementById(`mylisting_${id}`)) == null ? void 0 : _a2.remove();
      const countEl = document.getElementById("my_market_selllistings_number");
      if (countEl) {
        const count = parseInt(countEl.textContent || "0", 10) - 1;
        countEl.textContent = count.toString();
      }
    };
    document.querySelector("#tabContentsMyActiveMarketListingsTable > h3").appendChild(button);
    const list = Array.from(
      document.querySelectorAll(
        "#tabContentsMyActiveMarketListingsRows .market_listing_row"
      )
    );
    let ids = [];
    list.forEach((item) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.style.margin = "0px";
      checkbox.style.verticalAlign = "-0.125em";
      checkbox.className = "multicancel_checkbox";
      const nameBlock = item.querySelector(".market_listing_item_name_block");
      nameBlock.prepend(checkbox);
      nameBlock.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          e.preventDefault();
          checkbox.checked = !checkbox.checked;
          const id = getId(item);
          if (checkbox.checked) {
            ids.push(id);
          } else {
            ids = ids.filter((item2) => item2 !== id);
          }
        },
        { capture: true }
      );
    });
    let lock = false;
    button.addEventListener("click", async () => {
      if (lock)
        return;
      lock = true;
      for (let i = 0, size = 3; i < ids.length; i += size) {
        const chunk = ids.slice(i, i + size);
        await Promise.all(chunk.map(cancel));
        await sleep(200);
      }
      window.location.reload();
    });
    (_a = document.querySelector(".my_market_header_active")) == null ? void 0 : _a.addEventListener("click", () => {
      const allIds = list.map(getId);
      const allInputs = document.querySelectorAll(
        ".multicancel_checkbox"
      );
      const nextChecked = allIds.length !== ids.length;
      allInputs.forEach((input) => {
        input.checked = nextChecked;
      });
      ids = nextChecked ? allIds : [];
    });
    function getId(dom) {
      const match = dom.id.match(/mylisting_(\d+)/);
      if (!match)
        throw new Error("Cannot find listing id");
      return match[1];
    }
  }

  function setup() {
    hookXHR();
  }
  function run() {
    autoMaxCount();
  }
  function hookXHR() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (url.toString().includes("/inventory/")) {
        const tmp = new URL(url.toString());
        tmp.searchParams.set("count", "1000");
        url = tmp.toString();
      }
      return originalOpen.apply(this, [method, url, ...args]);
    };
  }
  async function autoMaxCount() {
    const table = await waitDOM(".market_multi_table");
    if (!table)
      return;
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    rows.forEach((row) => {
      const [td1, td2] = row.children;
      const input = td1.querySelector('input[type="number"]');
      const maxCount = td2.querySelector(".market_multi_qtyown span").textContent;
      input.value = maxCount;
    });
  }

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = ".market_listing_table_header {\n  padding-right: 14px;\n}\n\n#tabContentsMyActiveMarketListingsRows {\n  overflow-y: scroll;\n  max-height: 400px;\n}";
  n(css,{});

  router([
    { path: "/market/listings/", run: run$1 },
    { path: "/market/multisell", setup: setup, run: run }
  ]);

})();
