// スマホ版の「サーバー」: Webワーカーの中でPyodide(ブラウザ上のPython)を動かし、
// PC版Flaskの /api/* 呼び出しをそのままPythonの関数呼び出しに変える。
// 画面(app.js)側は pwa_shim.js が fetch("/api/...") をここへ転送する。
import { loadPyodide } from "./vendor/pyodide/pyodide.mjs";

// 人間の対局記録など、スマホ内に残したいフォルダ(PC版の data/ と同じ構成。IndexedDBに永続化する)
const PERSIST_DIRS = [
  "/app/data/human_games",
  "/app/data/human_games_osaka_aichi_mirror",
  "/app/data/human_games_aichi_dragapult_mirror",
  "/app/data/bug_reports",
  "/app/data/phone_session", // 進行中の対局の自動保存(書き出しの対象には含めない)
];
const EXPORT_DIRS = PERSIST_DIRS.filter((d) => !d.endsWith("phone_session"));
// これらのAPIの後は、書き込まれたファイルをIndexedDBへ同期する
const SYNC_AFTER = ["/api/save_human_records", "/api/report_bug"];

let pyodide = null;
let pyServer = null;
let bootPromise = null;

const bootStart = performance.now();
function progress(message, fraction) {
  console.info(`[pwa] ${Math.round(performance.now() - bootStart)}ms: ${message}`);
  postMessage({ type: "progress", message, fraction });
}

async function boot() {
  progress("Pythonを準備しています", 0.05);
  pyodide = await loadPyodide({ indexURL: new URL("./vendor/pyodide/", import.meta.url).href });
  progress("数値計算ライブラリを読み込んでいます", 0.25);
  await pyodide.loadPackage(["numpy", "pyyaml"]);
  progress("ゲームエンジンとAIを展開しています", 0.4);
  const res = await fetch(new URL("./bundle/pokeca_bundle.zip", import.meta.url));
  if (!res.ok) throw new Error("bundle/pokeca_bundle.zip を取得できません (" + res.status + ")");
  const buf = await res.arrayBuffer();
  pyodide.unpackArchive(buf, "zip", { extractDir: "/app" });
  // 学習済みモデル(別ファイル): 手順どおり data/<チェックポイントのフォルダ>/ に置く
  progress("AIの重みを読み込んでいます", 0.5);
  const modelList = await (await fetch(new URL("./models.json", import.meta.url))).json();
  for (const m of modelList) {
    const r = await fetch(new URL("./" + m.url, import.meta.url));
    if (!r.ok) throw new Error(m.url + " を取得できません (" + r.status + ")");
    const dir = m.path.slice(0, m.path.lastIndexOf("/"));
    pyodide.FS.mkdirTree("/app/" + dir);
    pyodide.FS.writeFile("/app/" + m.path, new Uint8Array(await r.arrayBuffer()));
  }
  // 永続化フォルダをIndexedDBにつなぎ、前回までの記録を読み込む
  const FS = pyodide.FS;
  for (const d of PERSIST_DIRS) {
    FS.mkdirTree(d);
    FS.mount(FS.filesystems.IDBFS, {}, d);
  }
  await new Promise((resolve, reject) => FS.syncfs(true, (err) => (err ? reject(err) : resolve())));
  progress("カードとAIを読み込んでいます", 0.6);
  pyodide.runPython("import sys; sys.path.insert(0, '/app')");
  pyServer = pyodide.pyimport("pwa_server");
  const info = JSON.parse(pyServer.init());
  info.restored_games = pyServer.restore_session();
  progress("準備完了", 1);
  return info;
}

function syncToIndexedDB() {
  return new Promise((resolve) => pyodide.FS.syncfs(false, () => resolve()));
}

function listRecords() {
  // 書き出し用: 永続化フォルダ内の全ファイルを {path, bytes} で返す
  const FS = pyodide.FS;
  const out = [];
  const walk = (dir) => {
    for (const name of FS.readdir(dir)) {
      if (name === "." || name === "..") continue;
      const p = dir + "/" + name;
      const st = FS.stat(p);
      if (FS.isDir(st.mode)) walk(p);
      else out.push({ path: p.replace(/^\/app\//, ""), bytes: FS.readFile(p) });
    }
  };
  for (const d of EXPORT_DIRS) walk(d);
  return out;
}

onmessage = async (event) => {
  const msg = event.data;
  try {
    if (msg.type === "boot") {
      bootPromise = bootPromise || boot();
      const info = await bootPromise;
      postMessage({ type: "ready", info });
      return;
    }
    await bootPromise;
    if (msg.type === "fetch") {
      const raw = pyServer.handle(msg.method, msg.url, msg.body || null);
      const parsed = JSON.parse(raw);
      if (msg.method !== "GET" && SYNC_AFTER.some((p) => msg.url.startsWith(p))) await syncToIndexedDB();
      postMessage({ type: "fetch-result", id: msg.id, status: parsed.status, body: parsed.body });
    } else if (msg.type === "persist") {
      const n = pyServer.save_session();
      await syncToIndexedDB();
      postMessage({ type: "persisted", id: msg.id, games: n });
    } else if (msg.type === "list-records") {
      const files = listRecords();
      postMessage({ type: "records", id: msg.id, files }, files.map((f) => f.bytes.buffer));
    }
  } catch (err) {
    postMessage({ type: msg.type === "boot" ? "boot-error" : "fetch-error", id: msg.id, message: String(err && err.stack ? err.stack : err) });
  }
};
