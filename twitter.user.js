// ==UserScript==
// @name         twitter
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/twitter
// @version      1.0.7
// @license      MIT
// @description  
// @author       IronKinoko
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @noframes
// @downloadURL  https://github.com/IronKinoko/userscripts/raw/dist/twitter.user.js
// @updateURL    https://github.com/IronKinoko/userscripts/raw/dist/twitter.user.js
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
  createStorage(window.sessionStorage);
  const local = createStorage(window.localStorage);

  const LocalKey = "k-x-mode";
  window.addEventListener("click", handleClick, { capture: true });
  window.addEventListener("blur", () => cache = []);
  async function createUI() {
    var _a;
    {
      if (document.querySelector("#k-x-mode"))
        return;
      const doms = document.querySelectorAll('[role="navigation"] > div > span');
      for (const dom of doms) {
        if ((_a = dom.textContent) == null ? void 0 : _a.match(/x corp/i)) {
          const switchDom = dom.parentNode.previousSibling.previousSibling.cloneNode(
            true
          );
          switchDom.id = "k-x-mode";
          switchDom.addEventListener("click", () => {
            const mode = local.getItem(LocalKey);
            local.setItem(LocalKey, mode === "watermark" ? "normal" : "watermark");
            updateText();
          });
          const updateText = () => {
            switchDom.children[0].textContent = `M: ${local.getItem(LocalKey) === "watermark" ? "PNG" : "HTML"}`;
          };
          updateText();
          switchDom.removeAttribute("href");
          dom.parentNode.parentNode.append(switchDom);
          break;
        }
      }
    }
  }
  const ob = new MutationObserver(createUI);
  ob.observe(document.body, { childList: true, subtree: true });
  function handleClick(e) {
    handleLike(e);
  }
  function queryParent(dom, selector) {
    let target = dom;
    while (target) {
      if (target.matches(selector))
        break;
      target = target.parentElement;
    }
    return target;
  }
  let cache = [];
  function handleLike(e) {
    var _a;
    const likeDom = queryParent(e.target, '[data-testid="like"]');
    if (!likeDom)
      return;
    const tweet = queryParent(
      likeDom,
      '[role="dialog"]>div>div,[data-testid="tweet"]'
    );
    if (!tweet)
      return;
    const photos = Array.from(
      tweet.querySelectorAll(
        '[data-testid="tweetPhoto"],[data-testid="swipe-to-dismiss"]'
      )
    );
    if (!photos.length)
      return;
    const imgs = photos.map((photo) => {
      const src = new URL(photo.querySelector("img").src);
      src.searchParams.set("name", "orig");
      return src.toString();
    });
    let href = (_a = queryParent(photos[0], "a")) == null ? void 0 : _a.href;
    if (!href)
      href = window.location.href;
    href = href.replace(/\/photo\/.*$/, "").replace("twitter.com", "x.com");
    cache.push({ href, imgs });
    updateClipboard(likeDom);
  }
  async function makeWaterMark() {
    const lastItem = cache[cache.length - 1];
    const lastImg = lastItem.imgs[lastItem.imgs.length - 1];
    const blob = await fetch(lastImg).then((res) => res.blob());
    const author = "@" + new URL(lastItem.href).pathname.split("/")[1];
    const img = await new Promise((resolve) => {
      const img2 = new Image();
      img2.onload = () => resolve(img2);
      img2.src = URL.createObjectURL(blob);
    });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const fontSize = Math.max(16, canvas.width / 40);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
    ctx.fillText(
      author,
      canvas.width - ctx.measureText(author).width - 16,
      canvas.height - 16
    );
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillText(
      author,
      canvas.width - ctx.measureText(author).width - 16,
      canvas.height - 16
    );
    ctx.restore();
    return new Promise((resolve) => {
      canvas.toBlob((blob2) => resolve(blob2));
    });
  }
  function toast(target, text) {
    const dom = document.createElement("div");
    dom.textContent = text;
    dom.style.cssText = `position:absolute;left:50%;bottom:100%;z-index:100;
  transform:translateX(-50%);
  border-radius:2px;padding:4px;
  background:rgba(0,0,0,0.60);width:max-content;
  color:white;font-size:11px;line-height:12px;`;
    target.appendChild(dom);
    target.style.position = "relative";
    setTimeout(() => {
      dom.remove();
    }, 1e3);
  }
  async function retry(fn) {
    while (true) {
      try {
        return await fn();
      } catch (err) {
        await sleep(300);
      }
    }
  }
  async function updateClipboard(likeDom) {
    if (!cache.length)
      return;
    try {
      if (local.getItem("k-x-mode") === "watermark") {
        const blob = await makeWaterMark();
        await retry(
          () => navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
        );
      } else {
        let html = cache.map((item) => item.imgs.map((img) => `<img src="${img}" />`).join("")).join("");
        await retry(
          () => navigator.clipboard.write([
            new ClipboardItem({
              "text/html": new Blob([html], { type: "text/html" })
            })
          ])
        );
      }
      toast(likeDom, "\u5DF2\u590D\u5236");
    } catch (err) {
      console.error(err);
      toast(likeDom, `\u590D\u5236\u5931\u8D25:${err.message}`);
    }
  }

})();
