const turnInfo = document.getElementById("turn-info");
const replayProgressDisplay = document.getElementById("replay-progress");
const replaySelect = document.getElementById("replay-select");
const loadReplayBtn = document.getElementById("load-replay-btn");
const refreshReplaysBtn = document.getElementById("refresh-replays-btn");
const deleteReplayBtn = document.getElementById("delete-replay-btn");
const autoplaySpeedSelect = document.getElementById("autoplay-speed-select");
const aiEvalDisplay = document.getElementById("ai-eval");
const lastAiActionDisplay = document.getElementById("last-ai-action");
const player0AgentSelect = document.getElementById("player0-agent-select");
const policyVariant0Label = document.getElementById("policy-variant-0-label");
const policyVariant0Select = document.getElementById("policy-variant-0-select");
const policyVariant0Text = document.getElementById("policy-variant-0-text");
const player1AgentSelect = document.getElementById("player1-agent-select");
const policyVariant1Label = document.getElementById("policy-variant-1-label");
const policyVariant1Select = document.getElementById("policy-variant-1-select");
const policyVariant1Text = document.getElementById("policy-variant-1-text");
const aiVsAiHint = document.getElementById("ai-vs-ai-hint");
const oppPrizes = document.getElementById("opp-prizes");
const oppHand = document.getElementById("opp-hand");
const oppDeckDiscard = document.getElementById("opp-deckdiscard");
const oppBench = document.getElementById("opp-bench");
const oppActive = document.getElementById("opp-active");
const stadiumSlot = document.getElementById("stadium-slot");
const selfActive = document.getElementById("self-active");
const selfBench = document.getElementById("self-bench");
const selfPrizes = document.getElementById("self-prizes");
const selfHand = document.getElementById("self-hand");
const selfDeckDiscard = document.getElementById("self-deckdiscard");
const actionButtons = document.getElementById("action-buttons");
const attackPanel = document.getElementById("attack-panel");
const hintArea = document.getElementById("hint-area");
const endTurnBtn = document.getElementById("end-turn-btn");
const undoBtn = document.getElementById("undo-btn");
const stepAiToggleLabel = document.getElementById("step-ai-toggle-label");
const stepAiToggle = document.getElementById("step-ai-toggle");
const aiStepBtn = document.getElementById("ai-step-btn");
const aiAutoplayBtn = document.getElementById("ai-autoplay-btn");
const autoplaySpeedLabel = document.getElementById("autoplay-speed-label");
const logList = document.getElementById("log-list");
const winnerOverlay = document.getElementById("winner-overlay");
const winnerText = document.getElementById("winner-text");
const winnerLogBtn = document.getElementById("winner-log-btn");
const recordAutoDiscardNotice = document.getElementById("record-auto-discard-notice");
const recordDecisionBox = document.getElementById("record-decision-box");
const recordDecisionYesBtn = document.getElementById("record-decision-yes-btn");
const recordDecisionNoBtn = document.getElementById("record-decision-no-btn");
const recordDecisionBugBtn = document.getElementById("record-decision-bug-btn");
const bugReportBox = document.getElementById("bug-report-box");
const bugReportInput = document.getElementById("bug-report-input");
const bugReportSubmitBtn = document.getElementById("bug-report-submit-btn");
const bugReportCancelBtn = document.getElementById("bug-report-cancel-btn");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const deckASelect = document.getElementById("deck-a-select");
const deckBSelect = document.getElementById("deck-b-select");
const deckARecipeBtn = document.getElementById("deck-a-recipe-btn");
const deckBRecipeBtn = document.getElementById("deck-b-recipe-btn");
const deckARandomBtn = document.getElementById("deck-a-random-btn");
const deckBRandomBtn = document.getElementById("deck-b-random-btn");
const reloadModelBtn = document.getElementById("reload-model-btn");
const modelStatus = document.getElementById("model-status");
const categoryTabs = document.getElementById("category-tabs");
const regulationCards = document.getElementById("regulation-cards");
const contextMenuOverlay = document.getElementById("context-menu-overlay");
const contextMenuTitle = document.getElementById("context-menu-title");
const contextMenuItems = document.getElementById("context-menu-items");
const contextMenuCancel = document.getElementById("context-menu-cancel");
const table = document.getElementById("table");
const infoOverlay = document.getElementById("info-overlay");
const infoOverlayTitle = document.getElementById("info-overlay-title");
const infoOverlayBody = document.getElementById("info-overlay-body");
const infoOverlayClose = document.getElementById("info-overlay-close");
const logPanel = document.getElementById("log-panel");
const logToggleBtn = document.getElementById("log-toggle-btn");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const logPanelClose = document.getElementById("log-panel-close");
const searchChoiceOverlay = document.getElementById("search-choice-overlay");
const searchChoiceBox = document.getElementById("search-choice-box");
const searchChoiceTitle = document.getElementById("search-choice-title");
const searchChoiceToggleBtn = document.getElementById("search-choice-toggle-btn");
const searchChoiceFilters = document.getElementById("search-choice-filters");
const searchChoiceCards = document.getElementById("search-choice-cards");
const searchChoiceCount = document.getElementById("search-choice-count");
const searchChoiceDoneBtn = document.getElementById("search-choice-done-btn");
const damageDistOverlay = document.getElementById("damage-distribution-overlay");
const damageDistTitle = document.getElementById("damage-distribution-title");
const damageDistHint = document.getElementById("damage-distribution-hint");
const damageDistTargets = document.getElementById("damage-distribution-targets");
const damageDistCount = document.getElementById("damage-distribution-count");
const damageDistDoneBtn = document.getElementById("damage-distribution-done-btn");
const revealOverlay = document.getElementById("reveal-overlay");
const revealTitle = document.getElementById("reveal-title");
const revealCards = document.getElementById("reveal-cards");
const revealCloseBtn = document.getElementById("reveal-close-btn");
let revealDismissedFor = null;
let currentState = null;
let searchChoiceSelected = new Set();
let searchChoiceFilter = "valid"; // "valid" | "all"
// 順番が結果に影響する選択(暗号マニアの解読等、山札の上に戻す順番=選んだ順)で、2枚以上選ぶ場合は
// 「1枚目を選んで決定→2枚目を選んで決定」と1つずつ確定させる方式にする(全候補が並んだ状態で
// 自由に複数クリックすると、一度に見えている選択肢の多さのわりに実際に何を選んだか分かりにくい、
// という指摘への対応)。この値は「今のステップまでに確定済みの枚数」を表す。
let searchChoiceLockedCount = 0;
let damageDistCounts = [];

searchChoiceToggleBtn.addEventListener("click", () => {
  const collapsed = searchChoiceBox.classList.toggle("collapsed");
  searchChoiceToggleBtn.textContent = collapsed ? "盤面を見る ▸" : "盤面を見る ▾";
});

const CATEGORY_LABELS = {
  normal: "ノーマルレギュレーション",
  past: "過去レギュレーション",
  era: "時代別レギュレーション(発売日の範囲)",
  extra: "エクストラレギュレーション",
  special: "特殊レギュレーション",
};

let regulationsByCategory = {};
let selectedCategory = null;
let selectedRegulation = null;
let currentActions = [];
// action.index → 1/2/3(AI評価値の上位3件の順位)。この画面の「今選べる行動全部」の中での
// 相対順位で、手札カード・ワザ一覧・全選択肢一覧など複数の表示箇所で使い回す(2026-09-10、
// ユーザー要望「一選択ごとに上位3つを色分けしてほしい」)。
let currentActionRanks = new Map();

// タブごとに独立した対局を区別するID。sessionStorageはCookieと違いタブ間で共有されないため、
// 同じブラウザで対局画面を複数タブ開いても互いの対局を上書きしない(以前はサーバー側のグローバルな
// 単一状態を全タブが共有しており、片方で対局を始めるともう片方が無言で上書きされるバグがあった)。
let gameId = sessionStorage.getItem("pokeca_game_id") || null;

function setGameId(id) {
  gameId = id || null;
  if (gameId) {
    sessionStorage.setItem("pokeca_game_id", gameId);
  } else {
    sessionStorage.removeItem("pokeca_game_id");
  }
}

function withGameIdQuery(url) {
  if (!gameId) return url;
  return `${url}${url.includes("?") ? "&" : "?"}game_id=${encodeURIComponent(gameId)}`;
}

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "エラーが発生しました");
  }
  return data;
}

// ---- クリック対象(手札・盤面ポケモン)とアクションのマッチング ----

// 2026-09-09: 「AI:X%」はソフトマックス確率(合計1.0)で、複数の選択肢の中で1つが優れているだけの
// 場面でも100%に張り付いてしまい、「勝率100%」であるかのような誤解を招いていた(ユーザー指摘:
// カードゲームには運の要素があるのに100%はおかしい)。方策ネットワークが実際の行動選択
// (agents/policy_agent.PolicyAgentのgreedy=argmax(scores))に使っている生スコアをそのまま表示する
// ことで、この誤解を避ける(上限が無く合計も1にならないため、パーセント表示はしない)。
function formatAiScore(score) {
  const sign = score > 0 ? "+" : "";
  return `${sign}${score.toFixed(2)}`;
}

// 2026-09-22追加: リプレイ添削中、専用AI(フーディンAI対ドラパAIのように専用チェックポイントが
// あるデッキ対決)の"今の"評価による推定勝率(win_rate、%)。AI評価値(生スコア、順位付け用)とは
// 別の数値で、選択肢が2つ以上ある決断点でだけサーバー側から付与される(web/app.py
// _replay_action_win_rates参照)。
// 2026-09-24追加: 「同じ盤面(actorから見える情報だけ)+同じ選択」を自己対戦の学習履歴で
// 何回選んだか(visit_count)。win_rateと同じ条件でだけ付与される(web/app.py
// _replay_action_visit_counts参照)。
function actionLabelWithScore(a) {
  const parts = [];
  if (typeof a.ai_score === "number") parts.push(`AI評価値:${formatAiScore(a.ai_score)}`);
  if (typeof a.win_rate === "number") parts.push(`推定勝率:${a.win_rate.toFixed(1)}%`);
  if (typeof a.visit_count === "number") {
    // 実績(過去に同じ盤面+同じ選択が出た対局での、その手を打った側の勝ち数・負け数と勝率)。
    parts.push(
      a.visit_count > 0 && typeof a.past_win_rate === "number"
        ? `過去の実績:${a.past_wins}勝${a.visit_count - a.past_wins}敗(勝率${a.past_win_rate.toFixed(1)}%${
            a.past_human_moves > 0 ? `、うち人間の手${a.past_human_moves}回` : ""
          })`
        : "過去の実績:0回"
    );
  }
  return parts.length ? `${a.description} [${parts.join(" / ")}]` : a.description;
}

// 今選べる行動全部(currentActions)の中で、AI評価値(生スコア)が高い順に上位3件だけ
// action.index → 順位(1〜3)のマップを作る。手札カード・ワザ一覧・全選択肢一覧など、
// 同じ行動が複数の場所に別の形で表示される箇所すべてで、この1つのマップを共有して使う。
function computeAiScoreRanks(actions) {
  const withScore = actions.filter((a) => typeof a.ai_score === "number");
  withScore.sort((x, y) => y.ai_score - x.ai_score);
  const ranks = new Map();
  withScore.slice(0, 3).forEach((a, i) => ranks.set(a.index, i + 1));
  return ranks;
}

// 1枚のカード・1つのワザ等に複数の行動(action_indices)が紐づく場合、その中で一番良い順位
// (数字が小さいほど上位)を採用する。上位3件に入る行動が無ければnull。
function bestAiScoreRank(actionIndices) {
  let best = null;
  for (const idx of actionIndices) {
    const rank = currentActionRanks.get(idx);
    if (rank && (best === null || rank < best)) best = rank;
  }
  return best;
}

function aiRankClass(rank) {
  return rank ? `ai-rank-${rank}` : "";
}

function matchingActions(kind, index) {
  return currentActions.filter((a) => {
    const o = a.origin;
    if (!o || o.kind !== kind) return false;
    if (index === null) return o.index === undefined || o.index === null;
    return o.index === index;
  });
}

// ---- レンダリング ----

function pokemonCardHTML(mon, isActive, origin) {
  if (!mon) {
    return '<div class="empty-slot">(空き)</div>';
  }
  if (mon.hidden) {
    return `<div class="pokemon-card face-down ${isActive ? "active" : ""} no-actions"></div>`;
  }
  const img = mon.image ? `<img src="${mon.image}" alt="${mon.name}" />` : "";
  const statuses = mon.statuses.length ? `<div class="status">${mon.statuses.join(" / ")}</div>` : "";
  const energyIcons = mon.energy.map((e) => `<span class="energy-icon" title="${e.name}">${e.symbol}</span>`).join("");
  const toolBadge = mon.tool ? `<div class="tool-badge" title="${mon.tool.name}">🔧 ${mon.tool.name}</div>` : "";
  const attachedIds = [mon.tool ? mon.tool.card_id : null, ...mon.energy.map((e) => e.card_id)].filter(Boolean);
  let attrs = ` data-card-id="${mon.card_id}" data-attached-ids="${attachedIds.join(",")}"`;
  if (origin) {
    const matches = matchingActions(origin.kind, origin.index === undefined ? null : origin.index);
    const hasActions = matches.length > 0;
    attrs += ` data-origin-kind="${origin.kind}"${origin.index !== undefined ? ` data-origin-index="${origin.index}"` : ""} class="pokemon-card ${isActive ? "active" : ""} ${hasActions ? "clickable" : "no-actions"}"`;
  } else {
    attrs += ` class="pokemon-card ${isActive ? "active" : ""} no-actions"`;
  }
  return `
    <div${attrs}>
      ${img}
      <div class="name">${mon.name}</div>
      <div class="hp">HP ${mon.hp}/${mon.max_hp}</div>
      ${energyIcons ? `<div class="energy-row">${energyIcons}</div>` : ""}
      ${toolBadge}
      ${statuses}
    </div>`;
}

function prizePileHTML(player, label) {
  // タウンマップで表向きにしたサイド(両者に公開)/Eye Openerで見たサイド(本人のみ)は、裏向きのカード裏ではなく
  // 実際のカード名を出す(prize_cardsは位置ごとのカード情報、裏向きのままの位置はnull)
  const backs = Array.from({ length: player.prizes_remaining }, (_, i) => {
    const known = player.prize_cards ? player.prize_cards[i] : null;
    return known
      ? `<div class="card-front prize-known" data-card-id="${known.card_id}" title="${known.name}">${known.name}</div>`
      : '<div class="card-back"></div>';
  }).join("");
  return `<div class="prize-stack">${backs}</div><div class="pile-label">${label} サイド${player.prizes_remaining}</div>`;
}

function deckDiscardHTML(player, side) {
  // ロストゾーンは使われないデッキが大半なので、0枚のときは表示欄自体を出さない
  const lostZone =
    player.lost_zone_count > 0
      ? `<div class="pile lost-zone-pile" data-lost-zone-side="${side}">${player.lost_zone_count}</div>
    <div class="pile-caption">ロストゾーン</div>`
      : "";
  return `
    <div class="pile deck-pile">${player.deck_count}</div>
    <div class="pile-caption">山札</div>
    <div class="pile discard-pile" data-discard-side="${side}">${player.discard_count}</div>
    <div class="pile-caption">トラッシュ</div>
    ${lostZone}`;
}

function opponentHandHTML(player) {
  const backs = Array.from({ length: player.hand_count }, () => '<div class="hand-card-back"></div>').join("");
  return backs;
}

function selfHandHTML(player) {
  return player.hand
    .map((c, i) => {
      const matches = matchingActions("hand", i);
      const cls = matches.length ? "clickable" : "no-actions";
      // 対戦準備でどのたねポケモンをバトル場に出すか等、手札のカードをクリックして選ぶ場面では
      // 攻撃ボタン(attack-ai-score)と違いAI評価値が一切表示されておらず、ユーザーからは
      // 「セットアップ時、AI評価値を見れないままAIが選んでいる」という指摘があった(2026-09-07)。
      // このカードに対応する合法手のうち最高スコアをバッジ表示する(複数の手が同じカードに
      // 紐づく場合、攻撃選択肢と同じ流儀で最大値を採用する)。
      const scores = matches.map((a) => a.ai_score).filter((s) => typeof s === "number");
      const rank = bestAiScoreRank(matches.map((a) => a.index));
      const scoreLabel = scores.length
        ? `<span class="hand-card-ai-score ${aiRankClass(rank)}">AI:${formatAiScore(Math.max(...scores))}</span>`
        : "";
      return `<div data-card-id="${c.card_id}" data-origin-kind="hand" data-origin-index="${i}" class="hand-card ${cls} ${aiRankClass(rank)}">${c.image ? `<img src="${c.image}" alt="${c.name}"/>` : ""}<div>${c.name}</div>${scoreLabel}</div>`;
    })
    .join("");
}

function showStartScreen() {
  startScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
  winnerOverlay.classList.add("hidden");
  recordDecisionBox.classList.add("hidden");
  bugReportBox.classList.add("hidden");
  bugReportInput.value = "";
  endTurnBtn.classList.add("hidden");
  undoBtn.classList.add("hidden");
  stepAiToggleLabel.classList.add("hidden");
  aiStepBtn.classList.add("hidden");
  aiAutoplayBtn.classList.add("hidden");
  autoplaySpeedLabel.classList.add("hidden");
  stopAutoplay();
  logToggleBtn.classList.add("hidden");
  logPanel.classList.add("hidden");
  turnInfo.textContent = "";
  replayProgressDisplay.textContent = "";
  replayProgressDisplay.classList.add("hidden");
  aiEvalDisplay.textContent = "";
  aiEvalDisplay.classList.add("hidden");
  lastAiActionDisplay.textContent = "";
  lastAiActionDisplay.classList.add("hidden");
  revealOverlay.classList.add("hidden");
  revealDismissedFor = null;
}

function showGameScreen() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function render(data) {
  const { state, actions } = data;
  currentActions = actions || [];
  currentActionRanks = computeAiScoreRanks(currentActions);
  currentState = state;
  if (!state) {
    setGameId(null);
    showStartScreen();
    return;
  }
  if (data.game_id) {
    setGameId(data.game_id);
  }
  showGameScreen();

  const actor = state.actor;
  const opponent = state.players[1 - actor];
  const self = state.players[actor];

  turnInfo.textContent = `ターン${state.turn_number} / player${actor} の行動`;

  if (data.mode === "replay" && data.replay_progress) {
    const meta = data.replay_meta;
    const matchupLabel = meta && meta.matchup_label ? `【${meta.matchup_label}】` : "";
    const metaLabel = meta ? `${meta.deck_a_label} vs ${meta.deck_b_label}` : "";
    const trainingLabel = meta ? ` / ${formatTrainingCountLabel(meta)}時点のAI` : "";
    replayProgressDisplay.textContent = `${matchupLabel}リプレイ再生中(${metaLabel}${trainingLabel}): ${data.replay_progress.cursor}/${data.replay_progress.total}手`;
    replayProgressDisplay.classList.remove("hidden");
  } else {
    replayProgressDisplay.textContent = "";
    replayProgressDisplay.classList.add("hidden");
  }

  if (typeof data.ai_eval === "number") {
    const winPct = Math.round(((data.ai_eval + 1) / 2) * 100);
    const suffix = data.mode === "replay" ? "・記録時点" : "";
    aiEvalDisplay.textContent = `AI評価(player${actor}視点${suffix}): ${winPct}%`;
    aiEvalDisplay.classList.remove("hidden");
  } else {
    aiEvalDisplay.textContent = "";
    aiEvalDisplay.classList.add("hidden");
  }

  const aiActionEntries =
    Array.isArray(data.last_ai_action_descriptions) && data.last_ai_action_descriptions.length > 0
      ? data.last_ai_action_descriptions
      : data.last_ai_action_description
        ? [{ description: data.last_ai_action_description, was_lethal: data.last_ai_action_was_lethal }]
        : [];
  // player0・player1の両方がAI操作(観戦モード)のときは「相手」という主語が成立しないため、
  // 各手にどちらの座席の手かを付けて表示する(2026-09-01、AI同士の対局を観戦できる機能追加)。
  const isSpectatingBothAi = data.player0_agent === "policy" && data.player1_agent === "policy";
  if (aiActionEntries.length > 0) {
    const label = isSpectatingBothAi
      ? "直前の手番"
      : aiActionEntries.length > 1
        ? "相手の直前の手番"
        : "相手の直前の手";
    const lines = aiActionEntries.map((entry) => {
      const seatPrefix = isSpectatingBothAi && typeof entry.seat === "number" ? `[player${entry.seat}] ` : "";
      return entry.was_lethal
        ? `${seatPrefix}${entry.description}(必勝手順のため評価値によらずこの手を選択)`
        : `${seatPrefix}${entry.description}`;
    });
    lastAiActionDisplay.textContent = `${label}: ${lines.join(" → ")}`;
    lastAiActionDisplay.classList.remove("hidden");
  } else {
    lastAiActionDisplay.textContent = "";
    lastAiActionDisplay.classList.add("hidden");
  }

  oppPrizes.innerHTML = prizePileHTML(opponent, `player${1 - actor}`);
  oppDeckDiscard.innerHTML = deckDiscardHTML(opponent, "opp");
  oppHand.innerHTML = opponentHandHTML(opponent);
  oppBench.innerHTML = opponent.bench.map((mon) => pokemonCardHTML(mon, false, null)).join("") || "";
  oppActive.innerHTML = pokemonCardHTML(opponent.active, true, null);

  selfPrizes.innerHTML = prizePileHTML(self, `player${actor}`);
  selfDeckDiscard.innerHTML = deckDiscardHTML(self, "self");
  selfHand.innerHTML = self.hand ? selfHandHTML(self) : "";
  selfBench.innerHTML =
    self.bench
      .map((mon, i) => pokemonCardHTML(mon, false, { kind: "own_bench", index: i }))
      .join("") || "";
  selfActive.innerHTML = pokemonCardHTML(self.active, true, { kind: "own_active" });

  if (state.stadium) {
    const stadiumMatches = matchingActions("stadium", null);
    const cls = stadiumMatches.length ? "clickable" : "no-actions";
    const ownerCls = state.stadium.owner === "self" ? "owner-self" : state.stadium.owner === "opponent" ? "owner-opponent" : "";
    stadiumSlot.innerHTML = `<div class="stadium-card ${cls} ${ownerCls}" data-origin-kind="stadium" data-card-id="${state.stadium.card_id}">${state.stadium.image ? `<img src="${state.stadium.image}"/>` : ""}${state.stadium.name}</div>`;
  } else {
    stadiumSlot.innerHTML = "";
  }

  // フォールバック: 全選択肢の一覧(折りたたみ)
  actionButtons.innerHTML = "";
  currentActions.forEach((a) => {
    const btn = document.createElement("button");
    btn.textContent = actionLabelWithScore(a);
    const rank = currentActionRanks.get(a.index);
    if (rank) btn.classList.add(aiRankClass(rank));
    btn.addEventListener("click", () => sendAction(a.index));
    actionButtons.appendChild(btn);
  });

  // ワザ一覧(コスト・ダメージつき、PTCGL同様に常時表示する)
  const attackOptions = state.attack_options || [];
  if (attackOptions.length > 0) {
    attackPanel.innerHTML = attackOptions
      .map((a) => {
        const scores = a.action_indices.map((idx) => currentActions[idx] && currentActions[idx].ai_score).filter((s) => typeof s === "number");
        const rank = bestAiScoreRank(a.action_indices);
        const scoreLabel = scores.length
          ? `<span class="attack-ai-score ${aiRankClass(rank)}">AI:${formatAiScore(Math.max(...scores))}</span>`
          : "";
        return `
        <button type="button" class="attack-option${a.borrowed_from ? " borrowed" : ""} ${aiRankClass(rank)}">
          <span class="attack-cost">${a.cost_symbols.join("")}</span>
          <span class="attack-name">${a.name}${a.borrowed_from ? ` <span class="attack-borrowed-label">(${a.borrowed_from}から借用)</span>` : ""}</span>
          <span class="attack-damage">${a.damage || ""}</span>
          ${scoreLabel}
        </button>`;
      })
      .join("");
    attackPanel.classList.remove("hidden");
    attackPanel.querySelectorAll(".attack-option").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        const indices = attackOptions[i].action_indices;
        if (indices.length === 1) {
          sendAction(indices[0]);
        } else {
          openContextMenu(indices.map((idx) => currentActions[idx]));
        }
      });
    });
  } else {
    attackPanel.classList.add("hidden");
    attackPanel.innerHTML = "";
  }

  // ターン終了/準備完了ボタン(同じ場所に出す、ラベルはアクションの説明文をそのまま使う)。
  // コマ送りモードでAIの番の途中(awaiting_ai_step)は、actionsがAI自身の合法手(EndTurn含む)を
  // 反映しているだけで人間が押してよいものではないため、誤クリックを避けるために出さない。
  const endTurnAction = currentActions.find((a) => a.origin && a.origin.kind === "turn");
  if (endTurnAction && !data.awaiting_ai_step) {
    endTurnBtn.textContent = endTurnAction.description;
    endTurnBtn.classList.remove("hidden");
    endTurnBtn.onclick = () => sendAction(endTurnAction.index);
  } else {
    endTurnBtn.classList.add("hidden");
  }
  logToggleBtn.classList.remove("hidden");

  // 一手戻すボタン: 戻せるスナップショットがある間だけ出す。
  if (data.can_undo) {
    undoBtn.classList.remove("hidden");
    undoBtn.onclick = sendUndo;
  } else {
    undoBtn.classList.add("hidden");
  }

  // 「AIの手をコマ送りで見る」: AI対戦のときだけ出す。ONのままAIの番が残っていれば
  // 「AIの次の手へ」ボタンと「自動再生」ボタンを出す。自動再生はAI同士の対局を1手ずつ
  // 自動で進めながら観戦できるようにするための機能(2026-09-01追加)。
  if (data.player0_agent === "policy" || data.player1_agent === "policy") {
    // リプレイ再生モードは常にコマ送り固定のため、トグル自体を隠す(ONにする/OFFにする操作が無意味)。
    stepAiToggleLabel.classList.toggle("hidden", data.mode === "replay");
    stepAiToggle.checked = !!data.step_ai;
    aiStepBtn.classList.toggle("hidden", !data.awaiting_ai_step);
    aiStepBtn.textContent = data.mode === "replay" ? "次の手へ ▶" : "AIの次の手へ ▶";
    aiAutoplayBtn.classList.toggle("hidden", !data.awaiting_ai_step);
    autoplaySpeedLabel.classList.toggle("hidden", !data.awaiting_ai_step);
  } else {
    stepAiToggleLabel.classList.add("hidden");
    aiStepBtn.classList.add("hidden");
    aiAutoplayBtn.classList.add("hidden");
    autoplaySpeedLabel.classList.add("hidden");
  }
  if (!data.awaiting_ai_step) stopAutoplay();

  if (data.mode === "replay" && !data.awaiting_ai_step) {
    hintArea.textContent = "リプレイの再生が終わりました。「一手戻す」で見返すか、「新しい対局」で別のリプレイを選べます。";
  } else if (data.awaiting_ai_step) {
    hintArea.textContent =
      data.mode === "replay"
        ? "リプレイ再生中: 「次の手へ」を押すと記録された次の1手を再生します。"
        : "コマ送りモード: 「AIの次の手へ」を押すと、AIが次の1手を行います。";
  } else if (state.in_setup) {
    hintArea.textContent = "対戦準備中: 手札のたねポケモンをクリックしてバトルポケモンを選び、必要ならベンチも出してから「準備完了」を押してください。";
  } else if (state.awaiting_active_choice) {
    hintArea.textContent = "きぜつしました。ベンチのポケモンをクリックして新しいバトルポケモンを選んでください。";
  } else if (currentActions.length <= 1) {
    hintArea.textContent = "できることがなければ「ターン終了」を押してください。";
  } else {
    hintArea.textContent = "手札のカードや自分のポケモンをクリックして操作します。";
  }

  logList.innerHTML = state.log_tail
    .map((line) => (line.startsWith("―――") ? `<li class="log-turn-marker">${line}</li>` : `<li>${line}</li>`))
    .join("");

  if (state.pending_search_choice) {
    // 同じ効果の中で複数回選択が挟まる場合(オーリム博士の気迫等)、各段階のprompt文言が
    // 完全に同じになることがある。promptだけを「同じ選択か」の判定に使うと、前段階で選んだ
    // インデックスがクリアされずに残ってしまい、次の選択でカードをクリックしても反応しなくなる
    // (searchChoiceSelectedのサイズがmax_countに達したままになるため)。zone・prompt・候補一覧の
    // card_idを合わせたキーで比較し、候補の中身が変わっていれば必ず新しい選択として扱う。
    const choiceKey = `${state.pending_search_choice.zone}|${state.pending_search_choice.prompt}|${(state.pending_search_choice.candidates || []).map((c) => c.card_id).join(",")}`;
    if (!searchChoiceOverlay.dataset.openFor || searchChoiceOverlay.dataset.openFor !== choiceKey) {
      searchChoiceSelected = new Set();
      searchChoiceFilter = "valid";
      searchChoiceLockedCount = 0;
      searchChoiceOverlay.dataset.openFor = choiceKey;
      searchChoiceBox.classList.remove("collapsed");
      searchChoiceToggleBtn.textContent = "盤面を見る ▾";
    }
    renderSearchChoice(state.pending_search_choice);
    searchChoiceOverlay.classList.remove("hidden");
    document.body.classList.add("search-choice-open");
  } else {
    searchChoiceOverlay.classList.add("hidden");
    document.body.classList.remove("search-choice-open");
    delete searchChoiceOverlay.dataset.openFor;
    searchChoiceSelected = new Set();
    searchChoiceFilter = "valid";
    searchChoiceLockedCount = 0;
    searchChoiceBox.classList.remove("collapsed");
    searchChoiceToggleBtn.textContent = "盤面を見る ▾";
  }

  if (state.pending_damage_distribution) {
    const dist = state.pending_damage_distribution;
    const openKey = `${dist.source_card_id}:${dist.total_counters}:${state.turn_number}`;
    if (damageDistOverlay.dataset.openFor !== openKey) {
      damageDistOverlay.dataset.openFor = openKey;
      damageDistCounts = dist.targets.map(() => 0);
    }
    renderDamageDistribution(dist);
    damageDistOverlay.classList.remove("hidden");
  } else {
    damageDistOverlay.classList.add("hidden");
    delete damageDistOverlay.dataset.openFor;
    damageDistCounts = [];
  }

  // 選択の余地なく機械的に解決する効果(ポケストップ等)で見えたカードを一度だけ表示する。
  // 同じ内容を毎ポーリングで出し直さないよう、last_reveal自体が更新されるたびに増える通し番号
  // (state.last_reveal.seq)込みのキーで「既に閉じたもの」かどうかを判定する。以前はログの行数
  // (last_reveal自体が更新されていなくても対局が進むだけで増え続ける値)を使っており、対局の
  // 終盤までずっと同じ古い通知が毎ポーリングで再表示され続けるバグだった(2026-08-21発覚)。
  if (state.last_reveal) {
    const revealKey = `${state.last_reveal.seq}:${state.last_reveal.title}:${state.last_reveal.cards.map((c) => c.card_id).join(",")}`;
    if (revealDismissedFor !== revealKey) {
      revealTitle.textContent = state.last_reveal.title;
      revealCards.innerHTML = state.last_reveal.cards
        .map((c) => `<div class="search-choice-card">${c.image ? `<img src="${c.image}" alt="${c.name}"/>` : ""}<div>${c.name}</div></div>`)
        .join("");
      revealOverlay.dataset.openFor = revealKey;
      revealOverlay.classList.remove("hidden");
    }
  } else {
    revealOverlay.classList.add("hidden");
  }

  // 「〜してもよい」ポケパワー: 使う/使わないを選ばせる(既存のコンテキストメニューを流用)
  if (state.pending_trigger) {
    const triggerActions = currentActions.filter((a) => a.origin && a.origin.kind === "trigger");
    if (triggerActions.length > 0) {
      openContextMenu(triggerActions, state.pending_trigger.prompt);
    }
  }

  // パワースプレー割り込みウィンドウ: 相手のポケパワー使用直後、応答側に使う/使わないを選ばせる。
  if (state.pending_power_spray_window) {
    const powerSprayActions = currentActions.filter((a) => a.origin && a.origin.kind === "power_spray");
    if (powerSprayActions.length > 0) {
      openContextMenu(powerSprayActions, state.pending_power_spray_window.prompt);
    }
  }

  if (state.winner !== null) {
    winnerText.textContent = `対局終了! 勝者: player${state.winner}`;
    winnerOverlay.classList.remove("hidden");
    recordAutoDiscardNotice.classList.toggle("hidden", !data.records_auto_discarded);
    recordDecisionBox.classList.toggle("hidden", !data.pending_record_decision);
    if (data.pending_record_decision) {
      bugReportBox.classList.add("hidden");
      bugReportInput.value = "";
    }
  } else {
    winnerOverlay.classList.add("hidden");
  }
}

// ---- クリック操作(盤面/手札のイベント委譲) ----

let actionInFlight = false; // 通信中の二重クリックで意図しない行動が実行されるのを防ぐ

// ワザを打つ/特性を使う/にげる、は盤面のポケモンを直接クリックしただけで即実行されると
// 誤操作しやすいため、候補が1つしかなくても確認(コンテキストメニュー)を挟む。
const CONFIRM_BEFORE_SEND_TYPES = new Set(["Attack", "UseBorrowedAttack", "UseAbility", "Retreat"]);

function handleOriginClick(kind, index) {
  if (actionInFlight) return;
  const matches = matchingActions(kind, index);
  if (matches.length === 0) return;
  if (matches.length === 1 && !CONFIRM_BEFORE_SEND_TYPES.has(matches[0].type)) {
    sendAction(matches[0].index);
    return;
  }
  openContextMenu(matches);
}

function openContextMenu(matches, title) {
  contextMenuTitle.textContent = title || "行動を選んでください";
  contextMenuItems.innerHTML = "";
  matches.forEach((a) => {
    const btn = document.createElement("button");
    btn.textContent = actionLabelWithScore(a);
    const rank = currentActionRanks.get(a.index);
    if (rank) btn.classList.add(aiRankClass(rank));
    btn.addEventListener("click", () => {
      closeContextMenu();
      sendAction(a.index);
    });
    contextMenuItems.appendChild(btn);
  });
  contextMenuOverlay.classList.remove("hidden");
}

function closeContextMenu() {
  contextMenuOverlay.classList.add("hidden");
}

function onBoardClick(event) {
  const discardEl = event.target.closest("[data-discard-side]");
  if (discardEl) {
    openDiscardViewer(discardEl.dataset.discardSide);
    return;
  }
  const lostZoneEl = event.target.closest("[data-lost-zone-side]");
  if (lostZoneEl) {
    openLostZoneViewer(lostZoneEl.dataset.lostZoneSide);
    return;
  }
  const el = event.target.closest("[data-origin-kind]");
  if (!el) return;
  const kind = el.dataset.originKind;
  const index = el.dataset.originIndex !== undefined ? Number(el.dataset.originIndex) : null;
  handleOriginClick(kind, index);
}

table.addEventListener("click", onBoardClick);
selfHand.addEventListener("click", onBoardClick);
contextMenuCancel.addEventListener("click", closeContextMenu);
contextMenuOverlay.addEventListener("click", (e) => {
  if (e.target === contextMenuOverlay) closeContextMenu();
});

// ---- 右クリックでカード拡大表示 ----

function onBoardRightClick(event) {
  const el = event.target.closest("[data-card-id]");
  if (!el) return;
  event.preventDefault();
  const attachedIds = (el.dataset.attachedIds || "").split(",").filter(Boolean);
  openCardInspect(el.dataset.cardId, attachedIds);
}

table.addEventListener("contextmenu", onBoardRightClick);
selfHand.addEventListener("contextmenu", onBoardRightClick);

function cardDetailSectionHTML(card) {
  const img = card.image ? `<img src="${card.image}" alt="${card.name}" />` : "";
  const attacks = card.attacks
    .map(
      (a) => `
      <div class="attack-row">
        <div class="attack-name">${a.name} ${(a.cost_symbols || a.cost).join("")} ${a.damage ? "- " + a.damage : ""}</div>
        <div class="attack-text">${a.text || ""}</div>
      </div>`
    )
    .join("");
  const abilities = card.abilities
    .map((a) => `<div class="attack-row"><div class="attack-name">${a.type || "特性"}: ${a.name}</div><div class="attack-text">${a.text}</div></div>`)
    .join("");
  const weak = card.weaknesses.map((w) => `弱点 ${w.type} ${w.value}`).join(" / ");
  const resist = card.resistances.map((r) => `抵抗力 ${r.type} ${r.value}`).join(" / ");
  const trainerText = card.trainer_text ? `<div class="attack-text">${card.trainer_text}</div>` : "";
  const rulesText = card.rules && card.rules.length ? `<div class="attack-text">${card.rules.join(" ")}</div>` : "";
  return `
    <div class="card-detail">
      ${img}
      <div class="card-detail-info">
        <div class="card-detail-name">${card.name}</div>
        ${card.hp ? `<div>HP ${card.hp}</div>` : ""}
        ${abilities}
        ${attacks}
        ${weak || resist ? `<div class="attack-text">${weak} ${resist}</div>` : ""}
        ${card.retreat_cost ? `<div>にげる: ${card.retreat_cost}</div>` : ""}
        ${trainerText}
        ${rulesText}
      </div>
    </div>`;
}

async function openCardInspect(cardId, attachedIds) {
  let card;
  try {
    card = await fetchJSON(`/api/card/${encodeURIComponent(cardId)}`);
  } catch (err) {
    return;
  }
  infoOverlayTitle.textContent = card.name;
  const sections = [cardDetailSectionHTML(card)];
  for (const attachedId of attachedIds || []) {
    if (attachedId === cardId) continue;
    try {
      const attachedCard = await fetchJSON(`/api/card/${encodeURIComponent(attachedId)}`);
      sections.push(cardDetailSectionHTML(attachedCard));
    } catch (err) {
      // ついているカードの情報が取れなくても本体の表示は続ける
    }
  }
  infoOverlayBody.innerHTML = sections.join('<hr class="card-detail-divider"/>');
  infoOverlay.classList.remove("hidden");
}

function openDiscardViewer(side) {
  if (!currentState) return;
  const actor = currentState.actor;
  const player = side === "self" ? currentState.players[actor] : currentState.players[1 - actor];
  infoOverlayTitle.textContent = `トラッシュ (${player.discard.length}枚)`;
  infoOverlayBody.innerHTML = `<div class="discard-grid">${player.discard
    .map((c) => `<div class="hand-card" data-card-id="${c.card_id}">${c.image ? `<img src="${c.image}" alt="${c.name}"/>` : ""}<div>${c.name}</div></div>`)
    .join("")}</div>`;
  infoOverlay.classList.remove("hidden");
}

function openLostZoneViewer(side) {
  if (!currentState) return;
  const actor = currentState.actor;
  const player = side === "self" ? currentState.players[actor] : currentState.players[1 - actor];
  infoOverlayTitle.textContent = `ロストゾーン (${player.lost_zone.length}枚)`;
  infoOverlayBody.innerHTML = `<div class="discard-grid">${player.lost_zone
    .map((c) => `<div class="hand-card" data-card-id="${c.card_id}">${c.image ? `<img src="${c.image}" alt="${c.name}"/>` : ""}<div>${c.name}</div></div>`)
    .join("")}</div>`;
  infoOverlay.classList.remove("hidden");
}

async function openDeckRecipe(path) {
  if (!path) return;
  let data;
  try {
    data = await fetchJSON(`/api/deck_recipe?path=${encodeURIComponent(path)}`);
  } catch (err) {
    return;
  }
  infoOverlayTitle.textContent = `${data.name} (${data.card_count}枚)`;
  infoOverlayBody.innerHTML = `<div class="discard-grid">${data.cards
    .map(
      (c) => `
      <div class="hand-card" data-card-id="${c.card_id}">
        ${c.image ? `<img src="${c.image}" alt="${c.name}"/>` : ""}
        <div>${c.name} ×${c.count}</div>
      </div>`
    )
    .join("")}</div>`;
  infoOverlay.classList.remove("hidden");
}

deckARecipeBtn.addEventListener("click", () => openDeckRecipe(deckASelect.value));
deckBRecipeBtn.addEventListener("click", () => openDeckRecipe(deckBSelect.value));

function pickRandomDeckValue(select) {
  const options = Array.from(select.options).filter((o) => o.value);
  if (!options.length) return null;
  return options[Math.floor(Math.random() * options.length)].value;
}

deckARandomBtn.addEventListener("click", () => {
  const value = pickRandomDeckValue(deckASelect);
  if (value === null) return;
  deckASelect.value = value;
  if (deckBSelect.disabled) {
    deckBSelect.value = value;
  }
  updatePolicyOptions();
});

deckBRandomBtn.addEventListener("click", () => {
  if (deckBSelect.disabled) return;
  const value = pickRandomDeckValue(deckBSelect);
  if (value === null) return;
  deckBSelect.value = value;
  updatePolicyOptions();
});

// player0・player1どちらもAI操作を選べるようになった(2026-09-01、AI同士の対局を観戦できる
// 機能追加)ため、選ばれているAI(1つとは限らない)の状態表示・更新も両方ぶん扱う。

function activePolicyVariants() {
  // 今「AIが操作」を選んでいる座席ぶんのAI種類だけを対象にする(重複は除く)。人間操作の座席は
  // 対象外(そちらのAI種類の表示は無意味なため)。
  const variants = new Set();
  if (player0AgentSelect.value === "policy") variants.add(policyVariant0Select.value || "general");
  if (player1AgentSelect.value === "policy") variants.add(policyVariant1Select.value || "general");
  return [...variants];
}

async function refreshModelStatus() {
  const variants = activePolicyVariants();
  if (variants.length === 0) {
    modelStatus.textContent = "";
    return;
  }
  try {
    const results = await Promise.all(
      variants.map((v) => fetchJSON(`/api/model_status?variant=${encodeURIComponent(v)}`).then((data) => ({ v, data })))
    );
    modelStatus.textContent = results
      .map(({ v, data }) => {
        if (!data.latest_checkpoint) return `${v}: 未学習(チェックポイント無し)`;
        if (data.loaded_checkpoint === data.latest_checkpoint) return `${v}: 最新版を使用中(${data.loaded_checkpoint})`;
        return `${v}: 更新あり(現在: ${data.loaded_checkpoint ?? "未学習"} → 最新: ${data.latest_checkpoint})`;
      })
      .join(" / ");
  } catch (err) {
    // 取得失敗時は何も表示しない
  }
}

reloadModelBtn.addEventListener("click", async () => {
  const variants = activePolicyVariants();
  if (variants.length === 0) return;
  reloadModelBtn.disabled = true;
  try {
    const results = await Promise.all(
      variants.map((v) =>
        fetchJSON("/api/reload_model", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variant: v }),
        }).then((data) => ({ v, data }))
      )
    );
    modelStatus.textContent = results
      .map(({ v, data }) =>
        data.reloaded ? `${v}: 最新版に更新しました(${data.loaded_checkpoint})` : `${v}: 既に最新版です(${data.loaded_checkpoint})`
      )
      .join(" / ");
  } catch (err) {
    alert(err.message);
  } finally {
    reloadModelBtn.disabled = false;
  }
});

function updatePolicyVariantVisibility() {
  const show0 = player0AgentSelect.value === "policy";
  const show1 = player1AgentSelect.value === "policy";
  // AI操作の座席は「対戦するAI」、人間操作の座席は「評価値を表示するAI」を選ぶ(2026-09-25、
  // ユーザー要望)。どちらの座席も常にこの選択肢を出す。専用枠でAIが固定されている場合は、
  // どちらの文言でも紛らわしいので「固定AI」で統一する(2026-10-02)。
  policyVariant0Text.textContent = currentFixedAi ? "player0: 固定AI" : show0 ? "player0のAI" : "player0の評価値を表示するAI";
  policyVariant1Text.textContent = currentFixedAi ? "player1: 固定AI" : show1 ? "player1のAI" : "player1の評価値を表示するAI";
  aiVsAiHint.classList.toggle("hidden", !(show0 && show1));
  if (show0 || show1) refreshModelStatus();
  else modelStatus.textContent = "";
}

let policyModelsList = [];
// 選んでいるレギュレーション/専用枠が、AI操作の座席で使うAIを固定している場合の{id, label}
// (2026-10-02、ユーザー指摘「対局セットアップのどらぱAIがどっちのAIを指しているか分からない」)。
// この専用枠では、選択肢に出るAI(通常AI・ドラパAI等)を選んでも実際にはサーバー側で無視され
// 必ずこのAIが使われる(web/app.py _new_game のfixed_ai)。選択肢自体をこのAI1つだけに絞り、
// どのAIが実際に動くか一目で分かるようにする。
let currentFixedAi = null;

// 2026-09-24: フーディンAI/ドラパAIはデッキごとに別のAI。deck_fileを持つAIは、その座席で選ばれている
// デッキがそのAIのデッキのときだけ選択肢に出す(deck_fileが無い通常AI/HIJ専用AIは常に出す)。
function updatePolicyOptions() {
  [policyVariant0Select, policyVariant1Select].forEach((select) => {
    if (currentFixedAi) {
      select.innerHTML = `<option value="${currentFixedAi.id}">${currentFixedAi.label}(この専用枠の固定AI)</option>`;
      select.value = currentFixedAi.id;
      select.disabled = true;
      return;
    }
    select.disabled = false;
  });
  if (currentFixedAi) {
    if (player0AgentSelect.value === "policy" || player1AgentSelect.value === "policy") refreshModelStatus();
    return;
  }
  [[policyVariant0Select, deckASelect], [policyVariant1Select, deckBSelect]].forEach(([select, deckSelect]) => {
    const deckName = (deckSelect.value || "").split("/").pop();
    const previous = select.value;
    const models = policyModelsList.filter((m) => !m.deck_file || m.deck_file === deckName);
    select.innerHTML = models.map((m) => `<option value="${m.id}">${m.label}</option>`).join("");
    if (models.some((m) => m.id === previous)) select.value = previous;
    else if (models.some((m) => m.deck_file)) select.value = models.find((m) => m.deck_file).id;
  });
  if (player0AgentSelect.value === "policy" || player1AgentSelect.value === "policy") refreshModelStatus();
}

async function loadPolicyModels() {
  const data = await fetchJSON("/api/policy_models");
  policyModelsList = data.models || [];
  updatePolicyOptions();
  updatePolicyVariantVisibility();
}

deckASelect.addEventListener("change", updatePolicyOptions);
deckBSelect.addEventListener("change", updatePolicyOptions);

player0AgentSelect.addEventListener("change", updatePolicyVariantVisibility);
policyVariant0Select.addEventListener("change", refreshModelStatus);
player1AgentSelect.addEventListener("change", updatePolicyVariantVisibility);
policyVariant1Select.addEventListener("change", refreshModelStatus);

loadPolicyModels();

infoOverlayBody.addEventListener("click", (event) => {
  const el = event.target.closest("[data-card-id]");
  if (el) openCardInspect(el.dataset.cardId);
});

infoOverlayClose.addEventListener("click", () => infoOverlay.classList.add("hidden"));
revealCloseBtn.addEventListener("click", () => {
  revealDismissedFor = revealOverlay.dataset.openFor || null;
  revealOverlay.classList.add("hidden");
});
infoOverlay.addEventListener("click", (e) => {
  if (e.target === infoOverlay) infoOverlay.classList.add("hidden");
});

// ---- 山札/トラッシュ検索の選択カルーセル ----

// 同じカードが複数あると1枚ずつ並んで見づらいため、card_idごとにまとめて枚数バッジを出す(PTCGL準拠)。
function groupByCardId(list) {
  const groups = [];
  const byId = new Map();
  list.forEach((c) => {
    let g = byId.get(c.card_id);
    if (!g) {
      g = { card_id: c.card_id, name: c.name, image: c.image, count: 0 };
      byId.set(c.card_id, g);
      groups.push(g);
    }
    g.count += 1;
  });
  return groups;
}

function validIndicesForCardId(choice, cardId) {
  const indices = [];
  choice.candidates.forEach((c, i) => {
    if (c.card_id === cardId) indices.push(i);
  });
  return indices;
}

// own_pokemon_target/field_attachmentは盤面上の「位置」を選ぶ選択(同名ポケモンが2体いる等、
// card_idが重複していても別々の対象として選べなければならない)なので、card_idでグルーピングせず
// リスト中の位置(index)をそのまま選択の単位として扱う。
const POSITIONAL_SEARCH_CHOICE_ZONES = new Set(["own_pokemon_target", "field_attachment", "own_prizes_take", "opponent_pokemon_target", "gen_pokemon_pick", "gen_energy_pick", "gen_hand_pick"]);
// destinationが"deck_top"/"deck_top_no_shuffle"のとき、選んだ順番がそのまま山札の上からの並びになる
// (暗号マニアの解読/夜のアカデミー等)。プレイヤーが「1枚目に選んだカードが一番上」と分かるよう、
// 選んだ順番を示すバッジを表示する。
const ORDER_SENSITIVE_DESTINATIONS = new Set(["deck_top", "deck_top_no_shuffle", "deck_bottom"]);

function renderSearchChoice(choice) {
  searchChoiceTitle.textContent = choice.prompt;
  renderSearchChoiceFilters(choice);
  renderSearchChoiceCards(choice);
}

function renderSearchChoiceFilters(choice) {
  const allCandidates = choice.all_candidates || [];
  searchChoiceFilters.innerHTML = `
    <button type="button" class="search-choice-filter-tab${searchChoiceFilter === "valid" ? " selected" : ""}" data-filter="valid">VALID ${choice.candidates.length}</button>
    <button type="button" class="search-choice-filter-tab${searchChoiceFilter === "all" ? " selected" : ""}" data-filter="all">ALL ${allCandidates.length}</button>
  `;
  searchChoiceFilters.querySelectorAll(".search-choice-filter-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      searchChoiceFilter = btn.dataset.filter;
      renderSearchChoiceCards(choice);
      renderSearchChoiceFilters(choice);
    });
  });
}

function renderSearchChoiceCards(choice) {
  const sourceList = searchChoiceFilter === "all" ? choice.all_candidates || [] : choice.candidates;
  if (POSITIONAL_SEARCH_CHOICE_ZONES.has(choice.zone)) {
    renderPositionalSearchChoiceCards(choice, sourceList);
    return;
  }
  const groups = groupByCardId(sourceList);
  const orderSensitive = ORDER_SENSITIVE_DESTINATIONS.has(choice.destination);
  const stepMode = orderSensitive && choice.max_count > 1;
  const selectionOrder = Array.from(searchChoiceSelected);
  const orderLabel = (order) => (order === 1 ? "① 一番上" : `${["①", "②", "③", "④", "⑤"][order - 1] || `${order}`} ${order}番目`);
  searchChoiceCards.innerHTML = groups
    .map((g) => {
      const validIndices = validIndicesForCardId(choice, g.card_id);
      const selectedIndices = validIndices.filter((i) => searchChoiceSelected.has(i));
      const selectedCount = selectedIndices.length;
      const order = selectedCount > 0 ? selectionOrder.indexOf(selectedIndices[0]) + 1 : 0;
      const locked = stepMode && order > 0 && order <= searchChoiceLockedCount;
      const clickable = validIndices.length > 0 && !locked;
      const cls = ["search-choice-card"];
      if (selectedCount > 0) cls.push("selected");
      if (locked) cls.push("locked");
      if (!clickable) cls.push("disabled");
      let badge;
      if (orderSensitive && selectedCount > 0) {
        cls.push("search-choice-badge-order-card");
        badge = `<div class="search-choice-badge search-choice-badge-order">${orderLabel(order)}</div>`;
      } else {
        badge = g.count > 1 || selectedCount > 0 ? `<div class="search-choice-badge">${selectedCount > 0 ? selectedCount + "/" : ""}${g.count}</div>` : "";
      }
      return `
      <div class="${cls.join(" ")}" data-card-id="${g.card_id}">
        ${g.image ? `<img src="${g.image}" alt="${g.name}"/>` : ""}
        ${badge}
        <div>${g.name}</div>
      </div>`;
    })
    .join("");
  const suffix = choice.min_count > 0 ? `(最低${choice.min_count}枚)` : "";
  if (stepMode) {
    const step = searchChoiceLockedCount + 1;
    const hasPending = searchChoiceSelected.size > searchChoiceLockedCount;
    searchChoiceCount.textContent = hasPending
      ? `${orderLabel(step)}に決定してよいですか?(「決定」を押すと確定します)`
      : `${orderLabel(step)}に置くカードを選んでください(${searchChoiceLockedCount} / ${choice.max_count}枚 決定済み)`;
    const isFinalStep = step >= choice.max_count;
    searchChoiceDoneBtn.textContent = isFinalStep ? "決定" : `${orderLabel(step)}を決定して次へ`;
    searchChoiceDoneBtn.disabled = !hasPending && searchChoiceLockedCount < choice.min_count;
  } else {
    searchChoiceCount.textContent = orderSensitive
      ? `${searchChoiceSelected.size} / ${choice.max_count}枚選択 ${suffix}(選んだ順に山札の上から並びます。クリックした順番=①が一番上)`
      : `${searchChoiceSelected.size} / ${choice.max_count}枚選択 ${suffix}`;
    searchChoiceDoneBtn.textContent = "決定";
    searchChoiceDoneBtn.disabled = searchChoiceSelected.size < choice.min_count;
  }
}

// own_pokemon_target/field_attachment用: グルーピングせず、リスト中の位置(index)を選択の単位として
// 1枚ずつ表示する(同名ポケモンが2体いても別々のタイルとして選べる)。
function renderPositionalSearchChoiceCards(choice, sourceList) {
  searchChoiceCards.innerHTML = sourceList
    .map((c, i) => {
      const selected = searchChoiceSelected.has(i);
      const cls = ["search-choice-card"];
      if (selected) cls.push("selected");
      const label = c.slot_label ? `<div class="search-choice-badge">${c.slot_label}</div>` : "";
      // own_prizes_take: 実際に取るまでサイドは裏向きなので、絵柄/カード名は出さずカード裏を表示する
      const body = c.hidden ? `<div class="card-back"></div>` : `${c.image ? `<img src="${c.image}" alt="${c.name}"/>` : ""}<div>${c.name}</div>`;
      return `
      <div class="${cls.join(" ")}" data-index="${i}">
        ${label}
        ${body}
      </div>`;
    })
    .join("");
  const suffix = choice.min_count > 0 ? `(最低${choice.min_count}枚)` : "";
  searchChoiceCount.textContent = `${searchChoiceSelected.size} / ${choice.max_count}枚選択 ${suffix}`;
  searchChoiceDoneBtn.disabled = searchChoiceSelected.size < choice.min_count;
}

searchChoiceCards.addEventListener("click", (event) => {
  const el = event.target.closest(".search-choice-card:not(.disabled)");
  if (!el || !currentState || !currentState.pending_search_choice) return;
  const choice = currentState.pending_search_choice;
  if (POSITIONAL_SEARCH_CHOICE_ZONES.has(choice.zone)) {
    const index = Number(el.dataset.index);
    if (searchChoiceSelected.has(index)) {
      searchChoiceSelected.delete(index);
    } else if (searchChoiceSelected.size < choice.max_count) {
      searchChoiceSelected.add(index);
    }
    renderSearchChoiceCards(choice);
    return;
  }
  const cardId = el.dataset.cardId;
  const validIndices = validIndicesForCardId(choice, cardId);
  const selected = validIndices.filter((i) => searchChoiceSelected.has(i));
  const orderSensitive = ORDER_SENSITIVE_DESTINATIONS.has(choice.destination);
  const stepMode = orderSensitive && choice.max_count > 1;
  if (stepMode) {
    // 1ステップにつき「まだ確定していない候補」を1枚だけ持てる(確定済みのsearchChoiceLockedCount
    // 枚は変更不可)。同じカードを再クリックすれば選択解除、別のカードをクリックすれば
    // 未確定の選択を丸ごとその新しいカードに入れ替える(「決定」を押すまでは何度でも選び直せる)。
    if (selected.length > 0) {
      selected.forEach((i) => searchChoiceSelected.delete(i));
    } else {
      const pendingIndices = Array.from(searchChoiceSelected).slice(searchChoiceLockedCount);
      pendingIndices.forEach((i) => searchChoiceSelected.delete(i));
      const nextIndex = validIndices.find((i) => !searchChoiceSelected.has(i));
      if (nextIndex !== undefined) searchChoiceSelected.add(nextIndex);
    }
  } else if (selected.length >= validIndices.length || searchChoiceSelected.size >= choice.max_count) {
    // 上限に達したら次のクリックでこのカードの選択をまとめて解除する
    selected.forEach((i) => searchChoiceSelected.delete(i));
  } else {
    const nextIndex = validIndices.find((i) => !searchChoiceSelected.has(i));
    searchChoiceSelected.add(nextIndex);
  }
  renderSearchChoiceCards(choice);
});

searchChoiceDoneBtn.addEventListener("click", async () => {
  if (actionInFlight) return;
  const choice = currentState && currentState.pending_search_choice;
  if (choice && !POSITIONAL_SEARCH_CHOICE_ZONES.has(choice.zone)) {
    const orderSensitive = ORDER_SENSITIVE_DESTINATIONS.has(choice.destination);
    const stepMode = orderSensitive && choice.max_count > 1;
    const hasPending = stepMode && searchChoiceSelected.size > searchChoiceLockedCount;
    if (hasPending) {
      // このステップの1枚を確定させる。まだ全ステップぶん決まっていなければ、送信せず次のステップへ。
      searchChoiceLockedCount += 1;
      if (searchChoiceLockedCount < choice.max_count) {
        renderSearchChoiceCards(choice);
        return;
      }
    }
  }
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/resolve_search_choice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selected_indices: Array.from(searchChoiceSelected), game_id: gameId }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
});

// ---- ダメカン自由配分(ミュウの「サイコパワー」等) ----

function _damageDistributionActions() {
  return (currentActions || []).filter((a) => a.type === "ResolveDamageDistribution" && Array.isArray(a.counts));
}

function _countsEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === (b[i] || 0));
}

function renderDamageDistribution(dist) {
  const allocated = damageDistCounts.reduce((a, b) => a + b, 0);
  const remaining = dist.total_counters - allocated;
  const label = dist.max_per_target
    ? `${dist.source_name}: ダメカンを${dist.total_counters}個(1体につき最大${dist.max_per_target}個)、相手のポケモンに配分してください`
    : `${dist.source_name}: ダメカンを${dist.total_counters}個、相手のポケモンに自由に配分してください`;
  damageDistTitle.textContent = label;

  const distActions = _damageDistributionActions();
  if (distActions.length) {
    const best = distActions.reduce((a, b) => (b.ai_score > a.ai_score ? b : a));
    const recommendation = best.counts
      .map((c, i) => (c > 0 ? `${dist.targets[i].name}に${c}個` : null))
      .filter(Boolean)
      .join("、");
    const current = distActions.find((a) => _countsEqual(a.counts, damageDistCounts));
    const currentText =
      current && typeof current.ai_score === "number" ? `(今の配分のAI評価値: ${formatAiScore(current.ai_score)})` : "";
    damageDistHint.textContent = recommendation ? `AI推奨: ${recommendation} ${currentText}` : "";
    damageDistHint.classList.toggle("hidden", !recommendation);
  } else {
    damageDistHint.textContent = "";
    damageDistHint.classList.add("hidden");
  }
  damageDistTargets.innerHTML = dist.targets
    .map((t, i) => {
      const count = damageDistCounts[i] || 0;
      const atMax = dist.max_per_target != null && count >= dist.max_per_target;
      return `
      <div class="damage-dist-target${count > 0 ? " has-count" : ""}">
        ${t.image ? `<img src="${t.image}" alt="${t.name}"/>` : ""}
        <div class="name">${t.name}${t.kind === "active" ? " (バトル場)" : ""}</div>
        <div class="hp">HP ${t.hp}/${t.max_hp}</div>
        <div class="damage-dist-counter">
          <button type="button" class="dist-minus" data-index="${i}" ${count <= 0 ? "disabled" : ""}>−</button>
          <span class="dist-count">${count}</span>
          <button type="button" class="dist-plus" data-index="${i}" ${remaining <= 0 || atMax ? "disabled" : ""}>＋</button>
        </div>
      </div>`;
    })
    .join("");
  damageDistCount.textContent = `残り ${remaining} / ${dist.total_counters}個`;
  damageDistDoneBtn.disabled = remaining !== 0;
}

damageDistTargets.addEventListener("click", (event) => {
  if (!currentState || !currentState.pending_damage_distribution) return;
  const dist = currentState.pending_damage_distribution;
  const plusEl = event.target.closest(".dist-plus:not(:disabled)");
  const minusEl = event.target.closest(".dist-minus:not(:disabled)");
  if (plusEl) {
    const i = Number(plusEl.dataset.index);
    if (dist.max_per_target != null && (damageDistCounts[i] || 0) >= dist.max_per_target) return;
    damageDistCounts[i] = (damageDistCounts[i] || 0) + 1;
  } else if (minusEl) {
    const i = Number(minusEl.dataset.index);
    damageDistCounts[i] = Math.max(0, (damageDistCounts[i] || 0) - 1);
  } else {
    return;
  }
  renderDamageDistribution(dist);
});

damageDistDoneBtn.addEventListener("click", async () => {
  if (actionInFlight) return;
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/resolve_damage_distribution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ counts: damageDistCounts, game_id: gameId }),
    });
    damageDistCounts = [];
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
});

// ---- バトルログパネル ----

logToggleBtn.addEventListener("click", () => logPanel.classList.toggle("hidden"));
logPanelClose.addEventListener("click", () => logPanel.classList.add("hidden"));
winnerLogBtn.addEventListener("click", () => logPanel.classList.remove("hidden"));

// ---- 対局終了時、この対局を学習データに使うか選ぶ ----

async function sendRecordDecision(save) {
  if (actionInFlight) return;
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/save_human_records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ save, game_id: gameId }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
}

recordDecisionYesBtn.addEventListener("click", () => sendRecordDecision(true));
recordDecisionNoBtn.addEventListener("click", () => sendRecordDecision(false));

// ---- 対局終了時、「バグ報告」を選んだ場合 ----
// 学習データの採否とは別に、対局全体のログ・最終盤面をバグ調査用に保存する
// (人間の手だけでなくAIの手も含む対局全体の記録なので、再現しにくいバグの調査に使える)。

recordDecisionBugBtn.addEventListener("click", () => {
  bugReportBox.classList.remove("hidden");
  bugReportInput.focus();
});

bugReportCancelBtn.addEventListener("click", () => {
  bugReportBox.classList.add("hidden");
  bugReportInput.value = "";
});

bugReportSubmitBtn.addEventListener("click", async () => {
  if (actionInFlight) return;
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/report_bug", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: bugReportInput.value, game_id: gameId }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
});

// ---- セットアップ画面 ----

async function loadRegulations() {
  regulationsByCategory = await fetchJSON("/api/regulations");
  const categories = Object.keys(regulationsByCategory);
  categoryTabs.innerHTML = categories
    .map((c) => `<button type="button" class="category-tab" data-category="${c}">${CATEGORY_LABELS[c] || c}</button>`)
    .join("");
  categoryTabs.querySelectorAll(".category-tab").forEach((btn) => {
    btn.addEventListener("click", () => selectCategory(btn.dataset.category));
  });
  if (categories.length) {
    // 初期表示は、実際にデッキが1つ以上あるカテゴリを優先する(「現行スタンダード」等、
    // レギュレーション自体は存在してもまだデッキが1つも無いものが最初に選ばれてしまうと、
    // プルダウンが空のまま対局を始めようとしてエラーになる/別のレギュレーションを見ている
    // ように見える、という不具合の原因だった)。どのカテゴリにも1つもデッキが無ければ
    // 従来通り先頭のカテゴリにフォールバックする。
    const categoryWithDecks = categories.find((c) => (regulationsByCategory[c] || []).some((r) => r.deck_count > 0));
    selectCategory(categoryWithDecks || categories[0]);
  }
}

function selectCategory(category) {
  selectedCategory = category;
  categoryTabs.querySelectorAll(".category-tab").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.category === category);
  });
  const regs = regulationsByCategory[category] || [];
  regulationCards.innerHTML = regs
    .map(
      (r) => `
      <div class="regulation-card${r.deck_count === 0 ? " no-decks" : ""}" data-regulation="${r.id}">
        <div class="reg-name">${r.name}${r.deck_count === 0 ? " (デッキ未収録)" : ""}</div>
        <div class="reg-sets">${r.sets.join(" 〜 ")}</div>
        <div class="reg-desc">${r.description}</div>
      </div>`
    )
    .join("");
  regulationCards.querySelectorAll(".regulation-card").forEach((card) => {
    card.addEventListener("click", () => selectRegulation(card.dataset.regulation));
  });
  if (regs.length) {
    // 同様に、このカテゴリ内でもデッキがあるレギュレーションを優先して選ぶ。
    const regWithDecks = regs.find((r) => r.deck_count > 0);
    selectRegulation((regWithDecks || regs[0]).id);
  }
}

let deckOptionsRequestToken = 0;

async function selectRegulation(regulationId) {
  selectedRegulation = regulationId;
  regulationCards.querySelectorAll(".regulation-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.regulation === regulationId);
  });
  await loadDeckOptions(regulationId);
}

async function loadDeckOptions(regulationId) {
  // カテゴリ/レギュレーションを素早く連続でクリックすると、後に出したfetchより先に出した
  // fetchの応答が遅れて返ってくることがある(ネットワーク応答順は発行順とは限らない)。
  // 古い応答でselectedRegulationと食い違うデッキ一覧を表示してしまうと、「別のレギュレーションの
  // デッキが読み込まれている」ように見えるズレの原因になるため、この呼び出しより後に
  // 新しい呼び出しが発行されていたら(=もう自分は最新ではない)結果を捨てて何もしない。
  const requestToken = ++deckOptionsRequestToken;
  const data = await fetchJSON(`/api/decks?regulation=${encodeURIComponent(regulationId)}`);
  if (requestToken !== deckOptionsRequestToken) {
    return;
  }
  const optionsHTML = data.decks
    .map((d) => `<option value="${d.path}">${d.name} (${d.card_count}枚)</option>`)
    .join("");
  deckASelect.innerHTML = optionsHTML || "<option>(デッキがありません)</option>";
  deckBSelect.innerHTML = optionsHTML || "<option>(デッキがありません)</option>";
  if (data.decks.length > 1) {
    deckBSelect.selectedIndex = 1;
  }

  const regs = regulationsByCategory[selectedCategory] || [];
  const reg = regs.find((r) => r.id === regulationId);
  currentFixedAi = reg && reg.fixed_ai ? { id: reg.fixed_ai, label: reg.fixed_ai_label } : null;
  const isMirror = !!(reg && reg.mirror);
  deckBSelect.disabled = isMirror;
  deckBRandomBtn.disabled = isMirror;
  if (isMirror) {
    deckBSelect.value = deckASelect.value;
  }
  if (reg && reg.default_decks && reg.default_decks.length >= 2) {
    deckASelect.value = reg.default_decks[0];
    deckBSelect.value = reg.default_decks[1];
  }
  deckASelect.onchange = () => {
    if (deckBSelect.disabled) {
      deckBSelect.value = deckASelect.value;
    }
  };
  updatePolicyOptions();
}

async function refresh() {
  const data = await fetchJSON(withGameIdQuery("/api/state"));
  render(data);
}

async function sendAction(index) {
  if (actionInFlight) return;
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, game_id: gameId }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
}

async function sendUndo() {
  if (actionInFlight) return;
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/undo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
}

async function sendSetStepMode(enabled) {
  if (actionInFlight) return;
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/set_step_mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled, game_id: gameId }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
}

async function sendAiStep() {
  if (actionInFlight) return;
  actionInFlight = true;
  try {
    const data = await fetchJSON("/api/ai_step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  } finally {
    actionInFlight = false;
  }
}

stepAiToggle.addEventListener("change", () => sendSetStepMode(stepAiToggle.checked));
aiStepBtn.addEventListener("click", () => sendAiStep());

// 「自動再生」: AI操作の座席の番である間、一定間隔で自動的に/api/ai_stepを呼び続ける
// (AI同士の対局を、人間がボタンを押し続けなくても観戦できるようにするための機能)。
// awaiting_ai_stepがfalseになった(人間の番になった/対局が終わった)ら自動的に止まる
// (render()側のstopAutoplay()呼び出し)。
// 間隔(ミリ秒)はユーザーが速度セレクタで選べる(2026-09-19、ユーザー要望「自動再生の速度を
// 調整できるようにしたい」)。選んだ値はlocalStorageに覚えておき、次回このページを開いたときも
// 同じ速度を初期値にする(タブごとに独立していてよい設定のため、ブラウザ保存で十分)。
function getAutoplayIntervalMs() {
  return Number(autoplaySpeedSelect.value) || 900;
}
try {
  const savedSpeed = localStorage.getItem("pokeca_autoplay_speed_ms");
  if (savedSpeed && autoplaySpeedSelect.querySelector(`option[value="${savedSpeed}"]`)) {
    autoplaySpeedSelect.value = savedSpeed;
  }
} catch (err) {
  // localStorageが使えない環境(プライベートブラウジング等)でも既定値で動けばよい
}
let autoplayTimer = null;

function stopAutoplay() {
  if (autoplayTimer !== null) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  aiAutoplayBtn.textContent = "自動再生 ▶▶";
}

function startAutoplay() {
  if (autoplayTimer !== null) return;
  aiAutoplayBtn.textContent = "自動再生を止める ⏸";
  autoplayTimer = setInterval(() => {
    if (actionInFlight) return;
    sendAiStep();
  }, getAutoplayIntervalMs());
}

aiAutoplayBtn.addEventListener("click", () => {
  if (autoplayTimer !== null) stopAutoplay();
  else startAutoplay();
});

autoplaySpeedSelect.addEventListener("change", () => {
  try {
    localStorage.setItem("pokeca_autoplay_speed_ms", autoplaySpeedSelect.value);
  } catch (err) {
    // 保存できなくても速度自体の変更は反映させる
  }
  if (autoplayTimer !== null) {
    // 再生中に速度を変えたら、新しい間隔で仕切り直す(次のtickまで待たず即座に反映)。
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      if (actionInFlight) return;
      sendAiStep();
    }, getAutoplayIntervalMs());
  }
});

async function startGame() {
  try {
    const data = await fetchJSON("/api/new_game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deck_a: deckASelect.value,
        deck_b: deckBSelect.disabled ? deckASelect.value : deckBSelect.value,
        regulation: selectedRegulation,
        player0_agent: player0AgentSelect.value,
        policy_variant_0: policyVariant0Select.value || "general",
        player1_agent: player1AgentSelect.value,
        policy_variant_1: policyVariant1Select.value || "general",
        // 人間操作の座席は、選んだAIの評価値を表示する(AI操作の座席では使わない)。
        eval_variant_0: player0AgentSelect.value === "human" ? policyVariant0Select.value || null : null,
        eval_variant_1: player1AgentSelect.value === "human" ? policyVariant1Select.value || null : null,
      }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  }
}

const WIN_REASON_LABELS = { prizes: "サイド勝ち", no_pokemon: "ポケモン0体", deck_out: "山札切れ" };

function formatTrainingCountLabel(entry) {
  // 累計学習対局数(data/training_lifetime_stats*.json、再起動をまたいで累積)を優先する。
  // 古い形式のリプレイ(2026-09-19より前に生成)はこの値を持たないため、その場合はチェックポイントの
  // ファイル名から取れる「その起動回からのイテレーション回数」で代用する(参考値である旨を注記)。
  if (typeof entry.total_games_trained === "number") {
    return `累計学習${entry.total_games_trained.toLocaleString("ja-JP")}局`;
  }
  if (typeof entry.checkpoint_iter === "number") {
    return `学習${entry.checkpoint_iter}回(起動回内、参考値)`;
  }
  return entry.checkpoint || "学習回数不明";
}

function formatReplayOptionLabel(entry) {
  const when = entry.generated_at ? new Date(entry.generated_at * 1000).toLocaleString("ja-JP") : "";
  const winnerLabel = entry.winner === null || entry.winner === undefined ? "未決着" : `player${entry.winner}勝ち`;
  const reasonLabel = WIN_REASON_LABELS[entry.win_reason] || entry.win_reason || "";
  const matchup = entry.matchup_label ? `【${entry.matchup_label}】` : "";
  return `${matchup}[${when}] ${entry.deck_a_label} vs ${entry.deck_b_label} (${winnerLabel}/${reasonLabel}, ${entry.turn_count}T, ${entry.step_count}手, ${formatTrainingCountLabel(entry)})`;
}

async function loadReplays() {
  let data;
  try {
    data = await fetchJSON("/api/replays");
  } catch (err) {
    return;
  }
  const replays = data.replays || [];
  replaySelect.innerHTML = "";
  if (replays.length === 0) {
    const opt = document.createElement("option");
    opt.textContent = "(保存済みのリプレイがありません)";
    opt.value = "";
    replaySelect.appendChild(opt);
    loadReplayBtn.disabled = true;
    return;
  }
  loadReplayBtn.disabled = false;
  replays.forEach((entry) => {
    const opt = document.createElement("option");
    opt.value = entry.id;
    opt.textContent = formatReplayOptionLabel(entry);
    replaySelect.appendChild(opt);
  });
}

async function loadReplay() {
  if (!replaySelect.value) return;
  try {
    const data = await fetchJSON("/api/load_replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ replay_id: replaySelect.value }),
    });
    render(data);
  } catch (err) {
    alert(err.message);
  }
}

async function deleteReplay() {
  if (!replaySelect.value) return;
  const label = replaySelect.options[replaySelect.selectedIndex]?.textContent || replaySelect.value;
  if (!confirm(`このリプレイを削除しますか?元に戻せません。\n\n${label}`)) return;
  try {
    await fetchJSON("/api/delete_replay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ replay_id: replaySelect.value }),
    });
    await loadReplays();
  } catch (err) {
    alert(err.message);
  }
}

loadReplayBtn.addEventListener("click", loadReplay);
refreshReplaysBtn.addEventListener("click", loadReplays);
deleteReplayBtn.addEventListener("click", deleteReplay);

document.getElementById("start-game-btn").addEventListener("click", startGame);
document.getElementById("new-game-btn").addEventListener("click", showStartScreen);
document.getElementById("winner-newgame-btn").addEventListener("click", showStartScreen);

document.getElementById("quit-btn").addEventListener("click", async () => {
  if (!confirm("この対局を終了しますか?(他のタブで開いている対局には影響しません)")) return;
  try {
    await fetchJSON("/api/quit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId }),
    });
  } catch (err) {
    // 何らかの理由で応答が得られなくても、対局を終了した扱いにして開始画面に戻る。
  }
  setGameId(null);
  currentState = null;
  showStartScreen();
});

fullscreenBtn.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen().catch(() => {});
  }
});

loadRegulations();
loadReplays();
refresh();
