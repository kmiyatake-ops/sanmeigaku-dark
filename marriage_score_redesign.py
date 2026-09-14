# -*- coding: utf-8 -*-
"""
結婚・不倫スコア再設計:
1. 既存スコアのAUCを検証
2. 各スコア構成要素の実データ相関を個別検証
3. 実データで裏付けられた要素のみで新スコアを構築
4. 交差検証で新スコアの汎化性能を評価
"""

import json
import math
import os
import random
from collections import defaultdict

BASE = os.path.dirname(__file__)
DATA = os.path.join(BASE, "celebrity_marriage_sanmeigaku.json")
OUT = os.path.join(BASE, "marriage_score_redesign.txt")

lines = []
def p(*a):
    lines.append(" ".join(str(x) for x in a))

with open(DATA, encoding="utf-8") as f:
    data = json.load(f)

affair = [d for d in data if d["group"] == "affair_case"]
divorce = [d for d in data if d["group"] == "divorce_case"]
control = [d for d in data if d["group"] == "control"]

p(f"データ: 不倫{len(affair)}名 / 離婚{len(divorce)}名 / 対照{len(control)}名")
p()

# ============ ユーティリティ ============
def auc(scores_labels):
    """scores_labels: list of (score, label 0/1). Higher score -> positive."""
    pos = sorted([s for s, l in scores_labels if l == 1])
    neg = sorted([s for s, l in scores_labels if l == 0])
    if not pos or not neg:
        return 0.5
    import bisect
    # P(pos > neg) + 0.5*P(equal)
    total = 0.0
    for s in pos:
        total += bisect.bisect_left(neg, s) + 0.5 * (bisect.bisect_right(neg, s) - bisect.bisect_left(neg, s))
    return total / (len(pos) * len(neg))

def fisher_2x2(a, b, c, d):
    """Fisher exact (two-sided approx via hypergeometric tail). a,b = case+/-; c,d = ctrl+/-"""
    from math import comb
    n = a + b + c + d
    def prob(x):
        return comb(a + c, x) * comb(n - a - c, a + b - x) / comb(n, a + b)
    lo = max(0, a + b - (n - a - c))
    hi = min(a + c, a + b)
    p_obs = prob(a)
    pv = sum(prob(x) for x in range(lo, hi + 1) if prob(x) <= p_obs + 1e-12)
    return min(1.0, pv)

def or_ci(a, b, c, d):
    a2, b2, c2, d2 = [x + 0.5 for x in (a, b, c, d)]
    orr = (a2 * d2) / (b2 * c2)
    return orr

# ============ 1. 既存スコアのAUC ============
p("=" * 70)
p("1. 既存スコアの判別力（AUC）")
p("=" * 70)
for label, cases in [("不倫", affair), ("離婚", divorce), ("不倫+離婚", affair + divorce)]:
    a_affair = auc([(d["affair_score"], 1) for d in cases] + [(d["affair_score"], 0) for d in control])
    a_marriage = auc([(d["marriage_score"], 0) for d in cases] + [(d["marriage_score"], 1) for d in control])
    p(f"  {label}: affair_score AUC={a_affair:.3f} / marriage_score AUC={a_marriage:.3f}")
p()

# ============ 2. 構成要素ごとの単変量評価 ============
p("=" * 70)
p("2. スコア構成要素の実データ相関（不倫+離婚ケース vs 対照）")
p("=" * 70)

cases_all = affair + divorce

def feat_test(name, extractor):
    """extractor(d) -> bool"""
    a = sum(1 for d in cases_all if extractor(d))
    b = len(cases_all) - a
    c = sum(1 for d in control if extractor(d))
    d_ = len(control) - c
    pv = fisher_2x2(a, b, c, d_)
    orr = or_ci(a, b, c, d_)
    mark = "*" if pv < 0.05 else ("+" if pv < 0.10 else " ")
    p(f"  {mark} {name:40s} case {a}/{len(cases_all)} ({a/len(cases_all)*100:.0f}%) vs ctrl {c}/{len(control)} ({c/len(control)*100:.0f}%)  OR={orr:.2f}  p={pv:.4f}")

# 主星（西=配偶者宮）
for star in ["貫索星","石門星","鳳閣星","調舒星","禄存星","司禄星","車騎星","牽牛星","龍高星","玉堂星"]:
    feat_test(f"west={star}", lambda d, s=star: d["main_stars"].get("west") == s)
p()
for pos in ["center","north","south","east"]:
    for star in ["車騎星","龍高星","石門星","鳳閣星","玉堂星","司禄星","貫索星"]:
        feat_test(f"{pos}={star}", lambda d, s=star, ps=pos: d["main_stars"].get(ps) == s)
p()

# 統計因子（reduced分析で有意だったもの）
feat_test("balance_moderate", lambda d: d.get("balance_type") == "moderate")
feat_test("balance_high(gogyo_balance>=3)", lambda d: (d.get("gogyo_balance") or 0) >= 3)
feat_test("weakest_水", lambda d: "水" in (d.get("weakest_gogyo") or []))
feat_test("day_element_水", lambda d: d.get("day_element") == "水")
feat_test("tenchu_寅卯", lambda d: d.get("tenchusatsu") == "寅卯")
feat_test("is_double_en", lambda d: bool(d.get("is_double_en")))
feat_test("has_abnormal", lambda d: bool(d.get("has_abnormal")))
feat_test("male", lambda d: d.get("gender") == "male")
feat_test("topo_支合", lambda d: any(t.get("name") == "支合" for t in d.get("topology") or []))
feat_test("topo_生貴刑(南方刑)", lambda d: any("生貴刑" in (t.get("name") or "") for t in d.get("topology") or []))
feat_test("topo_対冲", lambda d: any("対冲" in (t.get("name") or "") for t in d.get("topology") or []))
feat_test("topo_害法", lambda d: any("害法" in (t.get("name") or "") for t in d.get("topology") or []))
feat_test("topo_半会", lambda d: any("半会" in (t.get("name") or "") for t in d.get("topology") or []))
feat_test("topo_刑(東方/北方/西方)", lambda d: any("刑" in (t.get("name") or "") and "生貴" not in t["name"] for t in d.get("topology") or []))
feat_test("spouse_energy_天恍", lambda d: d.get("spouse_energy") == "天恍")
feat_test("spouse_energy_天馳", lambda d: d.get("spouse_energy") == "天馳")
feat_test("spouse_energy_天南", lambda d: d.get("spouse_energy") == "天南")
feat_test("day_yin_yang_陽", lambda d: d.get("day_yin_yang") == "陽")
p()

# ============ 3. 新スコア設計（単変量で OR方向が実データと一致した要素のみ） ============
p("=" * 70)
p("3. 新スコア: 実データ裏付け要素のみで構成")
p("=" * 70)

# リスク/保護を実データのOR方向で決定（p<0.15 の要素を採用、重みは |ln(OR)| ベース）
def risk_flags(d):
    flags = {}
    flags["moderate"] = d.get("balance_type") == "moderate"
    flags["weak_water"] = "水" in (d.get("weakest_gogyo") or [])
    flags["tenchu_tora_u"] = d.get("tenchusatsu") == "寅卯"
    flags["double_en"] = bool(d.get("is_double_en"))
    flags["abnormal"] = bool(d.get("has_abnormal"))
    flags["male"] = d.get("gender") == "male"
    flags["day_water"] = d.get("day_element") == "水"
    flags["shigo"] = any(t.get("name") == "支合" for t in d.get("topology") or [])
    flags["seikikei"] = any("生貴刑" in (t.get("name") or "") for t in d.get("topology") or [])
    flags["west_kansho"] = d["main_stars"].get("west") == "貫索星"
    flags["west_ryuko"] = d["main_stars"].get("west") == "龍高星"
    flags["west_gyokudo"] = d["main_stars"].get("west") == "玉堂星"
    flags["west_rokuson"] = d["main_stars"].get("west") == "禄存星"
    flags["east_kansho"] = d["main_stars"].get("east") == "貫索星"
    flags["east_ryuko"] = d["main_stars"].get("east") == "龍高星"
    flags["center_shiroku"] = d["main_stars"].get("center") == "司禄星"
    flags["south_choshuku"] = d["main_stars"].get("south") == "調舒星"
    flags["north_shakki"] = d["main_stars"].get("north") == "車騎星"
    return flags

# 各要素のORを計測して重みを決定（実データ方向）
weight_table = {}
for k in ["moderate","weak_water","tenchu_tora_u","double_en","abnormal","male",
          "day_water","shigo","seikikei","west_kansho","west_ryuko","west_gyokudo",
          "west_rokuson","east_kansho","east_ryuko","center_shiroku","south_choshuku","north_shakki"]:
    a = sum(1 for d in cases_all if risk_flags(d)[k])
    b = len(cases_all) - a
    c = sum(1 for d in control if risk_flags(d)[k])
    dd = len(control) - c
    orr = or_ci(a, b, c, dd)
    pv = fisher_2x2(a, b, c, dd)
    if pv < 0.15 and a + c >= 4:
        w = round(math.log(orr) * 8)  # ln(OR)*8 → OR2で±5.5点程度
        weight_table[k] = w
        p(f"  {k:20s} OR={orr:6.2f} p={pv:.4f} → 重み {w:+d}")

def new_score(d):
    f = risk_flags(d)
    s = 50 + sum(w for k, w in weight_table.items() if f.get(k))
    return max(5, min(98, s))

p()
p("【新スコア AUC（インサンプル）】")
for label, cases in [("不倫", affair), ("離婚", divorce), ("不倫+離婚", affair + divorce)]:
    a_new = auc([(new_score(d), 1) for d in cases] + [(new_score(d), 0) for d in control])
    p(f"  {label}: {a_new:.3f}")
p()

# ============ 4. 交差検証（過学習チェック） ============
p("=" * 70)
p("4. 新スコアの5-fold交差検証（重みをfold内で再学習）")
p("=" * 70)

random.seed(42)
all_people = cases_all + control
random.shuffle(all_people)
K = 5
folds = [all_people[i::K] for i in range(K)]
cv_scores = []
for i in range(K):
    test = folds[i]
    train = [x for j, f in enumerate(folds) if j != i for x in f]
    tr_cases = [d for d in train if d["group"] != "control"]
    tr_ctrl = [d for d in train if d["group"] == "control"]
    wt = {}
    keys = list(weight_table.keys())
    for k in keys:
        a = sum(1 for d in tr_cases if risk_flags(d)[k])
        b = len(tr_cases) - a
        c = sum(1 for d in tr_ctrl if risk_flags(d)[k])
        dd = len(tr_ctrl) - c
        if a + c < 4:
            continue
        orr = or_ci(a, b, c, dd)
        pv = fisher_2x2(a, b, c, dd)
        if pv < 0.15:
            wt[k] = round(math.log(orr) * 8)
    for d in test:
        f = risk_flags(d)
        s = 50 + sum(w for k, w in wt.items() if f.get(k))
        cv_scores.append((s, 0 if d["group"] == "control" else 1))

p(f"  CV AUC（不倫+離婚 vs 対照）: {auc(cv_scores):.3f}")
affair_idx = [(s, l, all_people[i]["group"]) for i, (s, l) in enumerate(cv_scores)]
cv_affair = [(s, 1 if g == "affair_case" else 0) for s, l, g in affair_idx if g != "divorce_case"]
cv_div = [(s, 1 if g == "divorce_case" else 0) for s, l, g in affair_idx if g != "affair_case"]
p(f"  CV AUC（不倫のみ）: {auc(cv_affair):.3f}")
p(f"  CV AUC（離婚のみ）: {auc(cv_div):.3f}")
p()

# ============ 4.5 最終複合式（統計因子 + 伝統要素の小係数） ============
p("=" * 70)
p("4.5 最終複合式の評価（統計因子 + 伝統テクスチャ ±5以内）")
p("=" * 70)

AFFAIR_BASE = {"貫索星":28,"石門星":62,"鳳閣星":72,"調舒星":58,"禄存星":25,
               "司禄星":12,"車騎星":65,"牽牛星":18,"龍高星":78,"玉堂星":10}
AFFAIR_ENERGY = {"天報星":8,"天印星":-8,"天貴星":0,"天恍星":20,"天南星":15,
                 "天禄星":-15,"天将星":15,"天堂星":-15,"天胡星":15,"天極星":-8,
                 "天庫星":-15,"天馳星":20}
AFFAIR_STAR_INFL = {"貫索星":-8,"石門星":8,"鳳閣星":15,"調舒星":8,"禄存星":0,
                    "司禄星":-8,"車騎星":15,"牽牛星":-8,"龍高星":18,"玉堂星":-12}
MARRIAGE_BASE = {"貫索星":65,"石門星":70,"鳳閣星":45,"調舒星":40,"禄存星":80,
                 "司禄星":85,"車騎星":42,"牽牛星":72,"龍高星":38,"玉堂星":75}
MARRIAGE_ENERGY = {"天報星":-10,"天印星":12,"天貴星":10,"天恍星":-12,"天南星":-8,
                   "天禄星":12,"天将星":-5,"天堂星":12,"天胡星":5,"天極星":8,
                   "天庫星":10,"天馳星":-12}
MARRIAGE_WEST = {"貫索星":8,"石門星":6,"鳳閣星":-8,"調舒星":-6,"禄存星":10,
                 "司禄星":12,"車騎星":-8,"牽牛星":8,"龍高星":-10,"玉堂星":8}

def topo_has(d, kw):
    return any(kw in (t.get("name") or "") for t in d.get("topology") or [])

def final_affair(d):
    ms = d["main_stars"]
    s = 50.0
    # 統計実績因子
    if d.get("balance_type") == "moderate": s += 7
    if d.get("day_element") == "水": s -= 9
    if topo_has(d, "生貴刑"): s -= 10
    if ms.get("east") == "車騎星": s -= 5
    if d.get("gender") == "male": s -= 7
    if ms.get("east") == "貫索星": s += 6
    if ms.get("east") == "玉堂星": s += 5
    if ms.get("north") == "貫索星": s += 5
    if topo_has(d, "半会"): s += 5
    if d.get("day_yin_yang") == "陽": s += 4
    if topo_has(d, "支合"): s += 3
    if "水" in (d.get("weakest_gogyo") or []): s += 3
    if d.get("is_double_en"): s -= 2
    if d.get("has_abnormal"): s += 2
    # 伝統テクスチャ（小係数）
    s += (AFFAIR_BASE.get(ms.get("west"), 45) - 45) * 0.12
    se = d.get("spouse_energy") or ""
    se_name = se + "星" if not se.endswith("星") else se
    s += AFFAIR_ENERGY.get(se_name, 0) * 0.25
    s += AFFAIR_STAR_INFL.get(ms.get("center"), 0) * 0.25
    s += AFFAIR_STAR_INFL.get(ms.get("south"), 0) * 0.15
    if d.get("has_top_three_abnormal"): s += 5
    return max(5, min(98, s))

def final_marriage(d, aff):
    ms = d["main_stars"]
    s = 55.0
    if d.get("balance_type") == "moderate": s -= 7
    if d.get("day_element") == "水": s += 9
    if topo_has(d, "生貴刑"): s += 10
    if ms.get("east") == "車騎星": s += 5
    if d.get("gender") == "male": s += 7
    if ms.get("east") == "貫索星": s -= 6
    if ms.get("east") == "玉堂星": s -= 5
    if ms.get("north") == "貫索星": s -= 5
    if topo_has(d, "半会"): s -= 5
    if d.get("day_yin_yang") == "陽": s -= 4
    if topo_has(d, "支合"): s -= 3
    if "水" in (d.get("weakest_gogyo") or []): s -= 3
    if d.get("is_double_en"): s += 2
    if d.get("has_abnormal"): s -= 2
    s += (MARRIAGE_BASE.get(ms.get("center"), 55) - 55) * 0.15
    se = d.get("spouse_energy") or ""
    se_name = se + "星" if not se.endswith("星") else se
    s += MARRIAGE_ENERGY.get(se_name, 0) * 0.25
    s += MARRIAGE_WEST.get(ms.get("west"), 0) * 0.25
    if d.get("has_top_three_abnormal"): s -= 5
    s += (100 - aff) * 0.10
    return max(5, min(98, s))

for label, cases in [("不倫", affair), ("離婚", divorce), ("不倫+離婚", affair + divorce)]:
    aa = auc([(final_affair(d), 1) for d in cases] + [(final_affair(d), 0) for d in control])
    am = auc([(final_marriage(d, final_affair(d)), 0) for d in cases] +
             [(final_marriage(d, final_affair(d)), 1) for d in control])
    p(f"  {label}: affair={aa:.3f} / marriage={am:.3f}")
p()

# ============ 5. 最終重みテーブル出力 ============
p("=" * 70)
p("5. app.js実装用 最終重みテーブル")
p("=" * 70)
for k, w in sorted(weight_table.items(), key=lambda x: -abs(x[1])):
    p(f"  {k:20s} {w:+d}")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print("\n".join(lines[-30:]))
print(f"\n→ {OUT}")
