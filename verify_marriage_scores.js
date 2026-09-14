// 新スコア関数の検証: app.jsをvmでロードし、166名データでAUCを計測
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const appJsCode = fs.readFileSync(path.join(__dirname, "app.js"), "utf-8");
const kanjiDataCode = fs.readFileSync(path.join(__dirname, "kanji-data.js"), "utf-8");

const mockEl = {
  querySelector: () => null, querySelectorAll: () => [],
  addEventListener: () => {}, classList: { add: () => {}, remove: () => {}, contains: () => false },
  setAttribute: () => {}, appendChild: () => {}, insertAdjacentHTML: () => {},
};
const sandbox = {
  document: { querySelector: () => mockEl, querySelectorAll: () => [], getElementById: () => mockEl, createElement: () => mockEl, addEventListener: () => {}, body: { classList: { add: () => {}, remove: () => {}, contains: () => false } } },
  window: { addEventListener: () => {}, localStorage: { getItem: () => null, setItem: () => {} } },
  console, Date, Math, parseInt, parseFloat, isNaN, Infinity, JSON, Set, Map, Object, Array, String, Number, Boolean, RegExp, Error,
};
vm.createContext(sandbox);
vm.runInContext(kanjiDataCode, sandbox);
vm.runInContext(appJsCode, sandbox);
vm.runInContext("globalThis.__e = { getAffairRiskScore, getMarriageScore };", sandbox);
const { getAffairRiskScore, getMarriageScore } = sandbox.__e;

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "celebrity_marriage_sanmeigaku.json"), "utf-8"));

function scorePerson(d) {
  const topo = (d.topology || []).map((t) => t.name);
  const seName = d.spouse_energy ? (d.spouse_energy.endsWith("星") ? d.spouse_energy : d.spouse_energy + "星") : "";
  const aff = getAffairRiskScore({
    westStar: d.main_stars.west, spouseEnergyName: seName,
    isDoubleEn: !!d.is_double_en, hasAbnormal: !!d.has_abnormal,
    hasTopThreeAbnormal: !!d.has_top_three_abnormal,
    centerStar: d.main_stars.center, northStar: d.main_stars.north,
    southStar: d.main_stars.south, eastStar: d.main_stars.east,
    dayStem: d.day_stem, gogyoBalance: d.gogyo_balance,
    dayElement: d.day_element, dayYinYang: d.day_yin_yang,
    tenchusatsu: d.tenchusatsu, topologyNames: topo,
    weakestGogyo: d.weakest_gogyo || [], balanceType: d.balance_type,
    gender: d.gender,
  });
  const mar = getMarriageScore({
    centerStar: d.main_stars.center, westStar: d.main_stars.west,
    spouseEnergyName: seName, isDoubleEn: !!d.is_double_en,
    hasAbnormal: !!d.has_abnormal, hasTopThreeAbnormal: !!d.has_top_three_abnormal,
    affairScore: aff, gogyoBalance: d.gogyo_balance, dayElement: d.day_element,
    dayYinYang: d.day_yin_yang, eastStar: d.main_stars.east, northStar: d.main_stars.north,
    tenchusatsu: d.tenchusatsu, topologyNames: topo,
    weakestGogyo: d.weakest_gogyo || [], balanceType: d.balance_type,
    gender: d.gender,
  });
  return { aff, mar };
}

function auc(pairs) {
  const pos = pairs.filter(([, l]) => l === 1).map(([s]) => s).sort((a, b) => a - b);
  const neg = pairs.filter(([, l]) => l === 0).map(([s]) => s).sort((a, b) => a - b);
  let t = 0;
  for (const s of pos) {
    let lo = 0, hi = neg.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (neg[m] < s) lo = m + 1; else hi = m; }
    const lt = lo;
    lo = 0; hi = neg.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (neg[m] <= s) lo = m + 1; else hi = m; }
    t += lt + 0.5 * (lo - lt);
  }
  return t / (pos.length * neg.length);
}

const affair = data.filter((d) => d.group === "affair_case");
const divorce = data.filter((d) => d.group === "divorce_case");
const ctrl = data.filter((d) => d.group === "control");

const scores = new Map();
for (const d of data) scores.set(d, scorePerson(d));

for (const [label, cases] of [["不倫", affair], ["離婚", divorce], ["不倫+離婚", [...affair, ...divorce]]]) {
  const ap = [...cases.map((d) => [scores.get(d).aff, 1]), ...ctrl.map((d) => [scores.get(d).aff, 0])];
  const mp = [...cases.map((d) => [scores.get(d).mar, 0]), ...ctrl.map((d) => [scores.get(d).mar, 1])];
  console.log(`${label}: affair AUC=${auc(ap).toFixed(3)} / marriage AUC=${auc(mp).toFixed(3)}`);
}

// スコア分布の確認
const all = [...affair, ...divorce, ...ctrl].map((d) => scores.get(d).aff);
console.log(`\naffairスコア分布: min=${Math.min(...all)} max=${Math.max(...all)} avg=${(all.reduce((a, b) => a + b, 0) / all.length).toFixed(1)}`);
const marr = [...affair, ...divorce, ...ctrl].map((d) => scores.get(d).mar);
console.log(`marriageスコア分布: min=${Math.min(...marr)} max=${Math.max(...marr)} avg=${(marr.reduce((a, b) => a + b, 0) / marr.length).toFixed(1)}`);
