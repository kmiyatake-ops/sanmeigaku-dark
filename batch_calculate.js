/**
 * 芸能人病気データ 一括算命学計算スクリプト
 * app.js の計算ロジックを Node.js 環境で実行し、
 * 40名の芸能人データに対して算命学データを一括計算する。
 *
 * 使用方法: node batch_calculate.js
 * 出力: celebrity_sanmeigaku_results.json
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

// === app.js と kanji-data.js をサンドボックスで実行 ===
const appJsPath = path.join(__dirname, "app.js");
const kanjiDataPath = path.join(__dirname, "kanji-data.js");
const appJsCode = fs.readFileSync(appJsPath, "utf-8");
const kanjiDataCode = fs.readFileSync(kanjiDataPath, "utf-8");

// ブラウザ環境のモック
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

// kanji-data.js を先に実行（app.js が依存するため）
vm.runInContext(kanjiDataCode, sandbox);
vm.runInContext(appJsCode, sandbox);

// const宣言はsandboxに自動的に公開されないため、明示的に公開する
const exposeCode = `
  globalThis.__exports = {
    stems, branches, elements, yinYang, branchElements, mod,
    setsuiriDays, starNames,
    getYearPillar, getMonthPillar, getDayPillar, pillarFromIndex,
    countElements, getBalanceType, getDaysSinceSetsuiri, getZoukan,
    getMainStar, getEnergyStar, getTenchusatsu, getTaiun,
    analyzeTopology, analyzeBranchTopology, analyzeHealthRisk,
    analyzeFateTenchusatsu, getGuardianElements, analyzeYearlyFortune,
    getYearPillarForYear, isTenchusatsuYear, analyzeSeimei
  };
`;
vm.runInContext(exposeCode, sandbox);
const exp = sandbox.__exports;

// === 計算関数をサンドボックスから取得 ===
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
  analyzeBranchTopology: exp.analyzeBranchTopology,
  analyzeHealthRisk: exp.analyzeHealthRisk,
  analyzeFateTenchusatsu: exp.analyzeFateTenchusatsu,
  getGuardianElements: exp.getGuardianElements,
  analyzeYearlyFortune: exp.analyzeYearlyFortune,
  getYearPillarForYear: exp.getYearPillarForYear,
  isTenchusatsuYear: exp.isTenchusatsuYear,
  analyzeSeimei: exp.analyzeSeimei,
  stems: exp.stems,
  branches: exp.branches,
  elements: exp.elements,
  yinYang: exp.yinYang,
  branchElements: exp.branchElements,
  mod: exp.mod,
};

// === 芸能人データ読み込み ===
const dataPath = path.join(__dirname, "expanded_dataset_combined.json");
const celebrities = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// === 各芸能人の算命学データを計算 ===
function calculateSanmeigaku(celeb) {
  const [by, bm, bd] = celeb.birth_date.split("-").map(Number);
  const date = new Date(by, bm - 1, bd);
  const gender = celeb.gender;

  // 三柱（年柱・月柱・日柱）
  const year = f.getYearPillar(date);
  const month = f.getMonthPillar(date, f.stems.indexOf(year.stem));
  const day = f.getDayPillar(date);
  const pillars = { year, month, day };
  const allPillars = [year, month, day];

  // 五行バランス
  const counts = f.countElements(allPillars);
  const balanceType = f.getBalanceType(counts);

  // 蔵干
  const daysSinceSetsuiri = f.getDaysSinceSetsuiri(date);
  const zoukan = {
    year: f.getZoukan(year.branch, daysSinceSetsuiri),
    month: f.getZoukan(month.branch, daysSinceSetsuiri),
    day: f.getZoukan(day.branch, daysSinceSetsuiri),
  };

  // 十大主星
  const mainStars = {
    north: f.getMainStar(day.stem, year.stem),
    south: f.getMainStar(day.stem, month.stem),
    east: f.getMainStar(day.stem, zoukan.year),
    west: f.getMainStar(day.stem, zoukan.day),
    center: f.getMainStar(day.stem, zoukan.month),
    companion: f.getMainStar(day.stem, f.stems[f.mod(f.stems.indexOf(year.stem) + 5, 10)]),
  };

  // 十二大従星
  const energy = [
    f.getEnergyStar(day.stem, year.branch),
    f.getEnergyStar(day.stem, month.branch),
    f.getEnergyStar(day.stem, day.branch),
  ];

  // 天中殺
  const tenchusatsu = f.getTenchusatsu(day.index);

  // 大運
  const taiun = f.getTaiun(date, month, f.stems.indexOf(year.stem), gender);

  // 位相法（宿命内）
  const topologyResults = f.analyzeTopology(pillars);

  // 宿命天中殺（詳細）
  const fateTenchu = f.analyzeFateTenchusatsu(pillars);

  // 守護神
  const guardian = f.getGuardianElements(counts);

  // 発症年時のデータ（コントロール群はnull）
  const onsetYear = celeb.onset_year;
  const hasOnset = onsetYear != null;
  const onsetAge = hasOnset ? onsetYear - by : null;
  const onsetYp = hasOnset ? f.getYearPillarForYear(onsetYear) : null;
  const onsetYearStar = hasOnset ? f.getMainStar(day.stem, onsetYp.stem) : null;
  const onsetYearEnergy = hasOnset ? f.getEnergyStar(day.stem, onsetYp.branch) : null;
  const onsetIsTenchu = hasOnset ? f.isTenchusatsuYear(onsetYp.branch, tenchusatsu) : null;
  const onsetTaiun = hasOnset ? taiun.periods.find((p) => onsetAge >= p.age && onsetAge <= p.ageTo) : null;
  const onsetTaiunStar = onsetTaiun ? f.getMainStar(day.stem, onsetTaiun.stem) : null;
  const onsetTaiunEnergy = onsetTaiun ? f.getEnergyStar(day.stem, onsetTaiun.branch) : null;
  const onsetIsTaiunTenchu = onsetTaiun ? f.isTenchusatsuYear(onsetTaiun.branch, tenchusatsu) : false;
  const onsetTopology = hasOnset ? f.analyzeBranchTopology(onsetYp.branch, pillars) : [];

  // 発症年の健康リスク（コントロール群は計算しない）
  const healthRisk = hasOnset
    ? f.analyzeHealthRisk(day, pillars, counts, taiun, tenchusatsu, onsetAge, onsetYear)
    : { dayElement: f.elements[f.stems.indexOf(day.stem)], constitution: null, natalWeakness: null, natalExcess: null, majorDiseaseRisks: [], yearRisks: [] };
  const onsetHealthRisk = hasOnset ? healthRisk.yearRisks.find((r) => r.year === onsetYear) : null;

  // 姓名判断（実名が利用可能な場合）
  let seimeiResult = null;
  if (celeb.real_name && celeb.real_name !== celeb.name) {
    const nameParts = celeb.real_name.trim().split(/[\s　]+/);
    if (nameParts.length >= 2) {
      seimeiResult = f.analyzeSeimei(nameParts[0], nameParts.slice(1).join(""));
    } else {
      // 藝名と実名が同じ場合はスキップ
      seimeiResult = null;
    }
  }

  // 五行バランスの偏り
  const gogyoVals = Object.values(counts);
  const gogyoMax = Math.max(...gogyoVals);
  const gogyoMin = Math.min(...gogyoVals);
  const gogyoBalance = gogyoMax - gogyoMin;

  // 最強五行・最弱五行
  const gogyoEntries = Object.entries(counts);
  const strongestGogyo = gogyoEntries.filter(([, v]) => v === gogyoMax).map(([k]) => k);
  const weakestGogyo = gogyoEntries.filter(([, v]) => v === gogyoMin).map(([k]) => k);

  return {
    id: celeb.id,
    name: celeb.name,
    real_name: celeb.real_name,
    birth_date: celeb.birth_date,
    gender: celeb.gender,
    group: celeb.group || "case",
    illness: celeb.illness,
    illness_category: celeb.illness_category,
    onset_year: celeb.onset_year,
    notes: celeb.notes,

    // 三柱
    pillars: {
      year: `${year.stem}${year.branch}`,
      month: `${month.stem}${month.branch}`,
      day: `${day.stem}${day.branch}`,
    },
    day_stem: day.stem,
    day_branch: day.branch,
    day_element: f.elements[f.stems.indexOf(day.stem)],
    day_yin_yang: f.yinYang[f.stems.indexOf(day.stem)],

    // 蔵干
    zoukan: zoukan,

    // 五行バランス
    gogyo_counts: counts,
    gogyo_balance: gogyoBalance,
    balance_type: balanceType,
    strongest_gogyo: strongestGogyo,
    weakest_gogyo: weakestGogyo,

    // 十大主星
    main_stars: mainStars,

    // 十二大従星
    energy_stars: energy.map((e) => ({ name: e.name, score: e.score })),

    // 天中殺
    tenchusatsu: tenchusatsu,
    fate_tenchusatsu: fateTenchu,

    // 大運
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

    // 位相法（宿命内）
    topology: topologyResults.map((r) => ({ label: r.label, name: r.name, group: r.group })),

    // 守護神
    guardian: guardian,

    // 発症時のデータ（コントロール群はnull）
    onset_data: hasOnset ? {
      age: onsetAge,
      year_pillar: `${onsetYp.stem}${onsetYp.branch}`,
      year_star: onsetYearStar,
      year_energy: onsetYearEnergy ? { name: onsetYearEnergy.name, score: onsetYearEnergy.score } : null,
      is_tenchu_year: onsetIsTenchu,
      taiun: onsetTaiun
        ? {
            age_range: `${onsetTaiun.age}-${onsetTaiun.ageTo}`,
            pillar: `${onsetTaiun.stem}${onsetTaiun.branch}`,
            stem: onsetTaiun.stem,
            branch: onsetTaiun.branch,
            star: onsetTaiunStar,
            energy: onsetTaiunEnergy ? { name: onsetTaiunEnergy.name, score: onsetTaiunEnergy.score } : null,
            is_tenchu: onsetIsTaiunTenchu,
          }
        : null,
      topology: onsetTopology.map((r) => ({ label: r.label, name: r.name, group: r.group })),
      health_risk: onsetHealthRisk
        ? {
            risk_score: onsetHealthRisk.riskScore,
            level: onsetHealthRisk.level,
            factors: onsetHealthRisk.factors,
            major_diseases: onsetHealthRisk.majorDiseases,
          }
        : null,
    } : null,

    // 健康リスク分析（全生涯）
    health_risk_summary: {
      day_element: healthRisk.dayElement,
      constitution: healthRisk.constitution,
      natal_weakness: healthRisk.natalWeakness,
      natal_excess: healthRisk.natalExcess,
      major_disease_risks: healthRisk.majorDiseaseRisks.map((r) => ({
        year: r.year,
        age: r.age,
        pillar: r.pillar,
        risk_score: r.riskScore,
        level: r.level,
        is_tenchu: r.isTenchu,
        major_diseases: r.majorDiseases,
      })),
    },

    // 姓名判断
    seimei: seimeiResult
      ? {
          tenkaku: seimeiResult.tenkaku,
          jinkaku: seimeiResult.jinkaku,
          chikaku: seimeiResult.chikaku,
          soukaku: seimeiResult.soukaku,
          gaikaku: seimeiResult.gaikaku,
          sancai: seimeiResult.sancai,
          ten_rank: seimeiResult.tenRank,
          jin_rank: seimeiResult.jinRank,
          chi_rank: seimeiResult.chiRank,
          gai_rank: seimeiResult.gaiRank,
          sou_rank: seimeiResult.souRank,
        }
      : null,
  };
}

// === メイン処理 ===
console.log("算命学データ一括計算を開始します...");
console.log(`対象人数: ${celebrities.length}名\n`);

const results = [];
for (const celeb of celebrities) {
  try {
    const result = calculateSanmeigaku(celeb);
    results.push(result);
    const groupLabel = celeb.group === 'control' ? '[CTRL]' : '[CASE]';
    const illnessLabel = celeb.illness ? `${celeb.illness} (発症:${celeb.onset_year}年)` : '病気情報なし';
    console.log(`[${celeb.id}] ${groupLabel} ${celeb.name} - ${illnessLabel} -> 計算完了`);
  } catch (err) {
    console.error(`[${celeb.id}] ${celeb.name} - 計算エラー: ${err.message}`);
    results.push({ id: celeb.id, name: celeb.name, error: err.message });
  }
}

// === 結果を出力 ===
const outputPath = path.join(__dirname, "celebrity_sanmeigaku_results.json");
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
console.log(`\n計算完了! 結果を ${outputPath} に出力しました。`);
console.log(`成功: ${results.filter((r) => !r.error).length}名 / エラー: ${results.filter((r) => r.error).length}名`);
