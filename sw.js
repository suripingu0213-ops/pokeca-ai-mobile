// スマホ版のサービスワーカー: アプリ一式(画面・Python・モデル・カード)を端末に保存し、圏外でも起動できるようにする。
// ビルドのたびに VERSION とファイル一覧が書き換わる(build_pwa.py)。VERSIONが変わると新しい一式を取り直す。
"use strict";

const VERSION = "036947dea0";
const CACHE = "pokeca-ai-" + VERSION;
const IMAGE_CACHE = "pokeca-ai-images";
const FILES = ["./", "bundle/pokeca_bundle.zip", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "index.html", "manifest.webmanifest", "models.json", "models/policy_1790055041_iter360.pt", "models/policy_1790190963_iter160.pt", "models/policy_1791390425_iter540.pt", "pwa_mobile.css", "pwa_shim.js", "pwa_worker.js", "static/app.js", "static/style.css", "vendor/pyodide/numpy-2.4.6-cp314-cp314-pyemscripten_2026_0_wasm32.whl", "vendor/pyodide/pyodide-lock.json", "vendor/pyodide/pyodide.asm.mjs", "vendor/pyodide/pyodide.asm.wasm", "vendor/pyodide/pyodide.mjs", "vendor/pyodide/python_stdlib.zip", "vendor/pyodide/pyyaml-6.0.3-cp314-cp314-pyemscripten_2026_0_wasm32.whl"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // 大きいファイルが多いので1つずつ。途中で失敗したらインストールをやり直す(古い版は残る)
      for (const f of FILES) await cache.add(new Request(f, { cache: "reload" }));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith("pokeca-ai-") && key !== CACHE && key !== IMAGE_CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // 自分のファイル: キャッシュ優先(圏外でも動く)。無ければネットワーク
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req))
    );
    return;
  }
  if (req.destination === "image") {
    // カード画像(外部): 一度見たものは保存して、圏外でも出す。取れなければ何も返さない(壊れた画像にしない)
    event.respondWith(
      (async () => {
        const cache = await caches.open(IMAGE_CACHE);
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res.ok || res.type === "opaque") cache.put(req, res.clone());
          return res;
        } catch (e) {
          return Response.error();
        }
      })()
    );
  }
});
