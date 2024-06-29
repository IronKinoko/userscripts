// ==UserScript==
// @name         xxxxx520
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/xxxxx520
// @version      1.2.5
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://*.xxxxx520.com/*
// @match        https://*.xxxxx525.com/*
// @match        https://*.xxxxx528.com/*
// @match        https://*.xxxxx520.cam/*
// @match        https://*.gamer520.com/*
// @match        https://*.efemovies.com/*
// @match        https://download.gamer520.com/*
// @match        https://*.espartasr.com/*
// @match        https://*.fourpetal.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer520.com
// @require      https://unpkg.com/jquery@3.6.1/dist/jquery.min.js
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/xxxxx520.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/xxxxx520.user.js
// ==/UserScript==
(function () {
  'use strict';

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

  autoCompletePassowrd();
  moveDownloadToTop();
  baiduCloudLinkAutoComplete();
  modifyAnchorTarget();
  enhanceDownloadLink();
  function autoCompletePassowrd() {
    const $pwd = $('[name="post_password"]');
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
    complete();
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
  function enhanceDownloadLink() {
    const $dom = $(".go-down");
    const id = $dom.attr("data-id");
    $dom.attr("href", `/go/?post_id=${id}`);
    $dom[0].addEventListener("click", (e) => e.stopPropagation(), {
      capture: true
    });
  }

})();
