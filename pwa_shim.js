// スマホ版の接続部品: app.js(PC版と同じ画面)の fetch("/api/...") を、Webワーカー内のPython(pwa_worker.js)へ転送する。
// app.js は無改造。ここで fetch を差し替え、起動中の表示・記録の書き出し・サービスワーカー登録も受け持つ。
"use strict";

(function () {
  const realFetch = window.fetch.bind(window);
  try {
    // sessionStorageはアプリが終了すると消えるため、前回の対局IDを引き継ぐ(app.jsはこの値から対局を再開する)
    if (!sessionStorage.getItem("pokeca_game_id") && localStorage.getItem("pokeca_last_game_id")) {
      sessionStorage.setItem("pokeca_game_id", localStorage.getItem("pokeca_last_game_id"));
    }
  } catch (e) {}
  const worker = new Worker("pwa_worker.js", { type: "module" });
  let nextId = 1;
  const pending = new Map();
  let readyResolve;
  let readyReject;
  const ready = new Promise((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  // ---- 起動中の表示 ----
  const overlay = document.createElement("div");
  overlay.id = "pwa-boot";
  overlay.innerHTML =
    '<div class="pwa-boot-box"><div class="pwa-boot-title">Pokéca AI</div><div id="pwa-boot-msg">準備しています…</div>' +
    '<div class="pwa-boot-bar"><div id="pwa-boot-fill"></div></div>' +
    '<div class="pwa-boot-note">初回だけ数十秒かかります。2回目以降は通信なしで起動します。</div></div>';
  const style = document.createElement("style");
  style.textContent =
    "#pwa-boot{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#16202e;color:#e8eef7;font-family:system-ui,sans-serif}" +
    ".pwa-boot-box{width:min(320px,80vw);text-align:center}.pwa-boot-title{font-size:22px;font-weight:700;margin-bottom:14px}" +
    ".pwa-boot-bar{height:8px;border-radius:4px;background:#2a3a50;overflow:hidden;margin:12px 0}#pwa-boot-fill{height:100%;width:0;background:#5aa9ff;transition:width .3s}" +
    ".pwa-boot-note{font-size:12px;color:#93a4bb}#pwa-boot.error .pwa-boot-title{color:#ff8c8c}#pwa-boot-msg{white-space:pre-wrap;word-break:break-all;font-size:13px}" +
    "#pwa-tools{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:18px;padding-top:12px;border-top:1px solid #2a3a50;font-size:13px;color:#93a4bb}" +
    "#pwa-tools button{font-size:13px;padding:8px 12px;border-radius:6px;border:1px solid #3b4d66;background:#1d2b3d;color:#cfdbec}" +
    "#pwa-tools .pwa-net{display:inline-flex;align-items:center}" +
    ".pwa-offline-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px;background:#5bd68a}.pwa-offline-dot.off{background:#e0b341}";
  document.head.appendChild(style);
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(overlay));
  if (document.body) document.body.appendChild(overlay);

  worker.onmessage = (event) => {
    const msg = event.data;
    if (msg.type === "progress") {
      const m = document.getElementById("pwa-boot-msg");
      const f = document.getElementById("pwa-boot-fill");
      if (m) m.textContent = msg.message + "…";
      if (f) f.style.width = Math.round(msg.fraction * 100) + "%";
    } else if (msg.type === "ready") {
      console.info("[pwa] ready", Math.round(performance.now()), "ms after page start", msg.info);
      overlay.remove();
      readyResolve(msg.info);
    } else if (msg.type === "boot-error") {
      overlay.classList.add("error");
      const m = document.getElementById("pwa-boot-msg");
      if (m) m.textContent = "起動に失敗しました\n" + msg.message;
      readyReject(new Error(msg.message));
    } else if (msg.type === "fetch-result" || msg.type === "records" || msg.type === "persisted" || msg.type === "fetch-error") {
      const p = pending.get(msg.id);
      if (!p) return;
      pending.delete(msg.id);
      if (msg.type === "fetch-error") p.reject(new Error(msg.message));
      else p.resolve(msg);
    }
  };
  worker.postMessage({ type: "boot" });

  function call(message) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      worker.postMessage({ ...message, id });
    });
  }

  // ---- 進行中の対局の自動保存(操作の少し後・アプリが裏に回るとき) ----
  let persistTimer = null;
  function persistNow() {
    clearTimeout(persistTimer);
    persistTimer = null;
    return call({ type: "persist" }).catch((e) => console.warn("persist:", e));
  }
  function schedulePersist() {
    if (persistTimer === null) persistTimer = setTimeout(persistNow, 1500);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistNow();
  });
  window.addEventListener("pagehide", persistNow);

  // ---- fetch差し替え: /api/ だけワーカーへ、それ以外(画像など)は本物のfetch ----
  window.fetch = async function (input, options) {
    const url = typeof input === "string" ? input : input.url;
    if (!url.startsWith("/api/")) return realFetch(input, options);
    await ready;
    const method = (options && options.method) || "GET";
    const body = options && typeof options.body === "string" ? options.body : null;
    const result = await call({ type: "fetch", method, url, body });
    if (method !== "GET") schedulePersist();
    try {
      // 最後に遊んでいた対局のIDを覚えておく(アプリが終了されて戻ってきたとき、自動保存した対局を再開するため)
      if (url.startsWith("/api/quit")) localStorage.removeItem("pokeca_last_game_id");
      else if (result.body && result.body.game_id) localStorage.setItem("pokeca_last_game_id", result.body.game_id);
    } catch (e) {}
    return new Response(JSON.stringify(result.body), { status: result.status, headers: { "Content-Type": "application/json" } });
  };

  // ---- 画像が取れないとき(圏外)は壊れた画像アイコンを出さない(カード名の文字は残る) ----
  window.addEventListener(
    "error",
    (e) => {
      if (e.target && e.target.tagName === "IMG") e.target.style.visibility = "hidden";
    },
    true
  );

  // ---- 記録の書き出し(人間の対局記録をPCへ渡す) ----
  function crc32(bytes) {
    let c = -1;
    for (let i = 0; i < bytes.length; i++) {
      c ^= bytes[i];
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return (c ^ -1) >>> 0;
  }
  function makeZip(files) {
    // 無圧縮(STORE)のzip。pickleは小さく、PC側のzipfileで普通に開ける
    const enc = new TextEncoder();
    const chunks = [];
    const central = [];
    let offset = 0;
    const u16 = (n) => new Uint8Array([n & 255, (n >>> 8) & 255]);
    const u32 = (n) => new Uint8Array([n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]);
    const cat = (...parts) => {
      const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
      let o = 0;
      for (const p of parts) {
        out.set(p, o);
        o += p.length;
      }
      return out;
    };
    for (const f of files) {
      const name = enc.encode(f.path);
      const crc = crc32(f.bytes);
      const header = cat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(f.bytes.length), u32(f.bytes.length), u16(name.length), u16(0), name);
      chunks.push(header, f.bytes);
      central.push(cat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0x21), u32(crc), u32(f.bytes.length), u32(f.bytes.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name));
      offset += header.length + f.bytes.length;
    }
    const centralBytes = cat(...central);
    const end = cat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(centralBytes.length), u32(offset), u16(0));
    return new Blob([...chunks, centralBytes, end], { type: "application/zip" });
  }
  async function exportRecords() {
    await ready;
    const res = await call({ type: "list-records" });
    if (!res.files.length) {
      alert("書き出す記録がまだありません。\n対局の終了後に「学習に使う」を選ぶと、ここに溜まります。");
      return;
    }
    const blob = makeZip(res.files);
    const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "");
    const filename = `pokeca_phone_records_${stamp}.zip`;
    const file = new File([blob], filename, { type: "application/zip" });
    // スマホは共有シート(AirDrop/クラウド/メール等)、PCは通常のダウンロード
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
  }
  window.pokecaExportRecords = exportRecords;
  window.pokecaMakeZip = makeZip; // テスト用

  // ---- スマホ向けの画面調整(見た目の大半は pwa_mobile.css) ----
  document.addEventListener("DOMContentLoaded", () => {
    // 「一手戻す」を丸いボタンに(アイコン+ラベル)
    const undo = document.getElementById("undo-btn");
    if (undo) undo.innerHTML = '<span class="pwa-undo-icon">↩</span><span>一手戻す</span>';
    // ダメカンを置く選択パネルにも、サーチ選択パネルと同じ「盤面を見る」ボタンを付ける
    const box = document.getElementById("damage-distribution-box");
    if (box) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pwa-peek-btn";
      const sync = () => (btn.textContent = box.classList.contains("pwa-collapsed") ? "選択に戻る ▴" : "盤面を見る ▾");
      btn.addEventListener("click", () => {
        box.classList.toggle("pwa-collapsed");
        sync();
      });
      box.prepend(btn);
      sync();
      // 新しい選択が始まったら開いた状態に戻す(隠れたままだと選択できないことに気づけない)
      const overlay = document.getElementById("damage-distribution-overlay");
      new MutationObserver(() => {
        if (overlay.classList.contains("hidden")) {
          box.classList.remove("pwa-collapsed");
          sync();
        }
      }).observe(overlay, { attributes: true, attributeFilter: ["class"] });
    }
    // サーチ選択パネルのボタンの文言を分かりやすく(開いている間は「盤面を見る」、たたむと「選択に戻る」)
    const sbtn = document.getElementById("search-choice-toggle-btn");
    if (sbtn) {
      new MutationObserver(() => {
        const t = sbtn.textContent;
        if (t.includes("盤面を見る ▸")) sbtn.textContent = "選択に戻る ▴";
      }).observe(sbtn, { childList: true, characterData: true, subtree: true });
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const tools = document.createElement("div");
    tools.id = "pwa-tools";
    const dot = '<span class="pwa-offline-dot"></span>';
    tools.innerHTML = `<button id="pwa-export-btn" type="button" title="対局後に「学習に使う」を選んだ記録を、PCへ渡すためのファイルにします">人間の対局記録を書き出す</button><span class="pwa-net">${dot}<span id="pwa-net-text">オンライン</span></span>`;
    (document.getElementById("start-screen") || document.body).appendChild(tools);
    document.getElementById("pwa-export-btn").addEventListener("click", exportRecords);
    const refreshNet = () => {
      const off = !navigator.onLine;
      document.querySelector(".pwa-offline-dot").classList.toggle("off", off);
      document.getElementById("pwa-net-text").textContent = off ? "オフライン(画像なし)" : "オンライン";
    };
    window.addEventListener("online", refreshNet);
    window.addEventListener("offline", refreshNet);
    refreshNet();
  });

  // ---- 保存領域を消されにくくする / サービスワーカー(オフライン起動)登録 ----
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn("service worker:", e));
  }
})();
