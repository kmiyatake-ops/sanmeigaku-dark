/**
 * 結婚・浮気・離婚データの算命学一括計算スクリプト
 * marriage_dataset.json を読み込み、celebrity_marriage_sanmeigaku.json を出力する
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// === app.js と kanji-data.js をサンドボックスで実行 ===
const appJsPath = path.join(__dirname, "app.js");
const kanjiDataPath = path.join(__dirname, "kanji-data.js");
const appJsCode = fs.readFileSync(appJsPath, "utf-8");
const kanjiDataCode = fs.readFileSync(kanjiDataPath, "utf-8");

const mockElement = {
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  setAttribute: () => {},
  appendChild: () => {},
  insertAdjacentHTML: () => {},
};
const mockDocument = {
  querySelector: () => mockElement,
  querySelectorAll: () => [],
  getElementById: () => mockElement,
  createElement: () => mockElement,
  addEventListener: () => {},
  body: { classList: { add: () => {}, remove: () => {}, contains: () => false } },
};
const mockWindow = {
  addEventListener: () => {},
  localStorage: { getItem: () => null, setItem: () => {} },
};

const sandbox = {
  document: mockDocument,
  window: mockWindow,
  console: console,
  Date: Date,
  Math: Math,
  parseInt: parseInt,
  parseFloat: parseFloat,
  isNaN: isNaN,
  Infinity: Infinity,
  JSON: JSON,
  Set: Set,
  Map: Map,
  Object: Object,
  Array: Array,
  String: String,
  Number: Number,
  Boolean: Boolean,
  RegExp: RegExp,
  Error: Error,
};

vm.createContext(sandbox);
vm.runInContext(kanjiDataCode, sandbox);
vm.runInContext(appJsCode, sandbox);

const exposeCode = `
  globalThis.__exports = {
    stems, branches, elements, yinYang, branchElements, mod,
    setsuiriDays, starNames,
    getYearPillar, getMonthPillar, getDayPillar, pillarFromIndex,
    countElements, getBalanceType, getDaysSinceSetsuiri, getZoukan,
    getMainStar, getEnergyStar, getTenchusatsu, getTaiun,
    analyzeTopology, analyzeBranchTopology, analyzeHealthRisk,
    analyzeFateTenchusatsu, getGuardianElements, analyzeYearlyFortune,
    getYearPillarForYear, isTenchusatsuYear, analyzeSeimei,
    getAffairRiskScore, getMarriageScore, yinYangPairStar,
    getAbnormalZodiac, abnormalTopThree
  };
`;
vm.runInContext(exposeCode, sandbox);
const exp = sandbox.__exports;

const f = {
  getYearPillar: exp.getYearPillar,
  getMonthPillar: exp.getMonthPillar,
  getDayPillar: exp.getDayPillar,
  countElements: exp.countElements,
  getBalanceType: exp.getBalanceType,
  getDaysSinceSetsuiri: exp.getDaysSinceSetsuiri,
  getZoukan: exp.getZoukan,
  getMainStar: exp.getMainStar,
  getEnergyStar: exp.getEnergyStar,
  getTenchusatsu: exp.getTenchusatsu,
  getTaiun: exp.getTaiun,
  analyzeTopology: exp.analyzeTopology,
  analyzeFateTenchusatsu: exp.analyzeFateTenchusatsu,
  getGuardianElements: exp.getGuardianElements,
  getAffairRiskScore: exp.getAffairRiskScore,
  getMarriageScore: exp.getMarriageScore,
  yinYangPairStar: exp.yinYangPairStar,
  getAbnormalZodiac: exp.getAbnormalZodiac,
  abnormalTopThree: exp.abnormalTopThree,
  stems: exp.stems,
  branches: exp.branches,
  elements: exp.elements,
  yinYang: exp.yinYang,
  branchElements: exp.branchElements,
  mod: exp.mod,
};

// === データ読み込み ===
const dataPath = path.join(__dirname, "marriage_dataset.json");
const celebrities = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

function calculateSanmeigaku(celeb) {
  const [by, bm, bd] = celeb.birth_date.split("-").map(Number);
  const date = new Date(by, bm - 1, bd);
  const gender = celeb.gender;

  const year = f.getYearPillar(date);
  const month = f.getMonthPillar(date, f.stems.indexOf(year.stem));
  const day = f.getDayPillar(date);
  const pillars = { year, month, day };
  const allPillars = [year, month, day];

  const counts = f.countElements(allPillars);
  const balanceType = f.getBalanceType(counts);

  const daysSinceSetsuiri = f.getDaysSinceSetsuiri(date);
  const zoukan = {
    year: f.getZoukan(year.branch, daysSinceSetsuiri),
    month: f.getZoukan(month.branch, daysSinceSetsuiri),
    day: f.getZoukan(day.branch, daysSinceSetsuiri),
  };

  const mainStars = {
    north: f.getMainStar(day.stem, year.stem),
    south: f.getMainStar(day.stem, month.stem),
    east: f.getMainStar(day.stem, zoukan.year),
    west: f.getMainStar(day.stem, zoukan.day),
    center: f.getMainStar(day.stem, zoukan.month),
    companion: f.getMainStar(day.stem, f.stems[f.mod(f.stems.indexOf(year.stem) + 5, 10)]),
  };

  const energy = [
    f.getEnergyStar(day.stem, year.branch),
    f.getEnergyStar(day.stem, month.branch),
    f.getEnergyStar(day.stem, day.branch),
  ];

  const tenchusatsu = f.getTenchusatsu(day.index);
  const taiun = f.getTaiun(date, month, f.stems.indexOf(year.stem), gender);
  const topologyResults = f.analyzeTopology(pillars);
  const fateTenchu = f.analyzeFateTenchusatsu(pillars);
  const guardian = f.getGuardianElements(counts);

  const gogyoVals = Object.values(counts);
  const gogyoMax = Math.max(...gogyoVals);
  const gogyoMin = Math.min(...gogyoVals);
  const gogyoBalance = gogyoMax - gogyoMin;

  const gogyoEntries = Object.entries(counts);
  const strongestGogyo = gogyoEntries.filter(([, v]) => v === gogyoMax).map(([k]) => k);
  const weakestGogyo = gogyoEntries.filter(([, v]) => v === gogyoMin).map(([k]) => k);
  const topologyNames = topologyResults.map(r => r.name);
  const dayElement = f.elements[f.stems.indexOf(day.stem)];

  // 浮気リスクスコア計算
  const spouseEnergy = f.getEnergyStar(day.stem, day.branch);
  const isDoubleEn = mainStars.east === mainStars.west || f.yinYangPairStar[mainStars.east] === mainStars.west;
  const abnormalMatches = ["year", "month", "day"].map((key) => f.getAbnormalZodiac(pillars[key].stem, pillars[key].branch)).filter(Boolean);
  const hasAbnormal = abnormalMatches.length > 0;
  const hasTopThreeAbnormal = ["year", "month", "day"].some((key) => f.abnormalTopThree.includes(pillars[key].stem + pillars[key].branch));

  const affairScore = f.getAffairRiskScore({
    westStar: mainStars.west,
    spouseEnergyName: spouseEnergy.name,
    isDoubleEn,
    hasAbnormal,
    hasTopThreeAbnormal,
    centerStar: mainStars.center,
    northStar: mainStars.north,
    southStar: mainStars.south,
    eastStar: mainStars.east,
    dayStem: day.stem,
    gogyoBalance,
    dayElement,
    tenchusatsu,
    topologyNames,
    weakestGogyo,
    balanceType,
    gender,
  });

  const marriageScore = f.getMarriageScore({
    centerStar: mainStars.center,
    westStar: mainStars.west,
    spouseEnergyName: spouseEnergy.name,
    isDoubleEn,
    hasAbnormal,
    hasTopThreeAbnormal,
    affairScore,
    gogyoBalance,
    dayElement,
    tenchusatsu,
    topologyNames,
    weakestGogyo,
    balanceType,
    gender,
  });

  return {
    id: celeb.id,
    name: celeb.name,
    real_name: celeb.real_name,
    birth_date: celeb.birth_date,
    gender: celeb.gender,
    group: celeb.group,
    notes: celeb.notes,

    pillars: {
      year: `${year.stem}${year.branch}`,
      month: `${month.stem}${month.branch}`,
      day: `${day.stem}${day.branch}`,
    },
    day_stem: day.stem,
    day_branch: day.branch,
    day_element: f.elements[f.stems.indexOf(day.stem)],
    day_yin_yang: f.yinYang[f.stems.indexOf(day.stem)],

    zoukan: zoukan,
    gogyo_counts: counts,
    gogyo_balance: gogyoBalance,
    balance_type: balanceType,
    strongest_gogyo: strongestGogyo,
    weakest_gogyo: weakestGogyo,

    main_stars: mainStars,
    energy_stars: energy.map((e) => ({ name: e.name, score: e.score })),
    tenchusatsu: tenchusatsu,
    fate_tenchusatsu: fateTenchu,

    taiun: {
      start_age: taiun.startAge,
      forward: taiun.forward,
      periods: taiun.periods.map((p) => ({
        age: p.age,
        ageTo: p.ageTo,
        pillar: `${p.stem}${p.branch}`,
        stem: p.stem,
        branch: p.branch,
      })),
    },

    topology: topologyResults.map((r) => ({ label: r.label, name: r.name, group: r.group })),
    guardian: guardian,

    // 浮気・結婚スコア
    affair_score: affairScore,
    marriage_score: marriageScore,
    is_double_en: isDoubleEn,
    has_abnormal: hasAbnormal,
    has_top_three_abnormal: hasTopThreeAbnormal,
    spouse_energy: spouseEnergy.name,
  };
}

// === メイン処理 ===
console.log("結婚・浮気・離婚データ 算命学一括計算を開始...");
console.log(`対象人数: ${celebrities.length}名\n`);

const results = [];
for (const celeb of celebrities) {
  try {
    const result = calculateSanmeigaku(celeb);
    results.push(result);
    const groupLabel = celeb.group === "control" ? "[CTRL]" : `[${celeb.group.toUpperCase()}]`;
    console.log(`[${celeb.id}] ${groupLabel} ${celeb.name} - affair=${result.affair_score} marriage=${result.marriage_score}`);
  } catch (err) {
    console.error(`[${celeb.id}] ${celeb.name} - 計算エラー: ${err.message}`);
    results.push({ id: celeb.id, name: celeb.name, error: err.message });
  }
}

const outputPath = path.join(__dirname, "celebrity_marriage_sanmeigaku.json");
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
console.log(`\n計算完了! 出力: ${outputPath}`);
console.log(`成功: ${results.filter((r) => !r.error).length}名 / エラー: ${results.filter((r) => r.error).length}名`);
