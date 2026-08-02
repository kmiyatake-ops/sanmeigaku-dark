# -*- coding: utf-8 -*-
"""
ケース・コントロール研究デザインに基づく統計解析スクリプト
ケース群（病気公表あり）vs コントロール群（病気公表なし）の比較を行う。
Fisher's exact test / Chi-square test により各算命学要素の有意差を検定する。
"""

import json
import os
import sys
import math
from collections import Counter, defaultdict

# Write output to file with UTF-8
_output_lines = []
def print(*args, **kwargs):
    _output_lines.append(" ".join(str(a) for a in args))

# === データ読み込み ===
input_path = os.path.join(os.path.dirname(__file__), "celebrity_sanmeigaku_results.json")
with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data = [d for d in data if "error" not in d]

cases = [d for d in data if d.get("group", "case") == "case"]
controls = [d for d in data if d.get("group", "case") == "control"]

print("=" * 80)
print("ケース・コントロール研究デザイン 統計解析")
print("=" * 80)
print(f"総対象者数: {len(data)}名")
print(f"ケース群: {len(cases)}名")
print(f"コントロール群: {len(controls)}名")
print()

# === 病気カテゴリの分類 ===
def get_disease_group(category):
    if not category:
        return "不明"
    if "がん" in category:
        if "頭頸部" in category: return "がん（頭頸部）"
        elif "乳がん" in category: return "がん（乳がん）"
        elif "消化器" in category: return "がん（消化器）"
        elif "呼吸器" in category: return "がん（呼吸器）"
        elif "泌尿器" in category: return "がん（泌尿器）"
        else: return "がん（その他）"
    elif "脳血管" in category or "脳腫瘍" in category: return "脳血管・脳腫瘍"
    elif "うつ" in category and "双極性" not in category: return "精神疾患（うつ・抑うつ）"
    elif "パニック" in category: return "精神疾患（パニック障害）"
    elif "双極性" in category: return "精神疾患（双極性障害）"
    elif "血液" in category: return "血液疾患"
    elif "循環器" in category: return "循環器疾患"
    elif "神経" in category: return "神経疾患"
    else: return "その他"

for d in cases:
    d["disease_group"] = get_disease_group(d.get("illness_category", ""))

disease_groups = Counter(d["disease_group"] for d in cases)
print("ケース群の病気カテゴリ別:")
for g, cnt in sorted(disease_groups.items(), key=lambda x: -x[1]):
    print(f"  {g}: {cnt}名")
print()

# === 統計検定関数 ===

def log_factorial(n):
    if n <= 1:
        return 0.0
    return sum(math.log(i) for i in range(2, n + 1))

def fisher_exact_test(a, b, c, d):
    n = a + b + c + d
    if n == 0:
        return 1.0, 0.0
    if b == 0 or c == 0:
        odds_ratio = float('inf') if a > 0 and d > 0 else 0.0
    else:
        odds_ratio = (a * d) / (b * c)
    row1 = a + b
    col1 = a + c
    def log_hypergeom(i):
        return (
            log_factorial(col1) + log_factorial(n - col1) +
            log_factorial(row1) + log_factorial(n - row1) -
            log_factorial(n) -
            log_factorial(i) - log_factorial(col1 - i) -
            log_factorial(row1 - i) - log_factorial(n - col1 - row1 + i)
        )
    i_min = max(0, col1 - (n - row1))
    i_max = min(col1, row1)
    log_p_obs = log_hypergeom(a)
    p_obs = math.exp(log_p_obs)
    p_two_sided = 0.0
    for i in range(i_min, i_max + 1):
        p_i = math.exp(log_hypergeom(i))
        if p_i <= p_obs + 1e-15:
            p_two_sided += p_i
    return p_two_sided, odds_ratio

def chi_square_test(a, b, c, d):
    n = a + b + c + d
    if n == 0:
        return 0.0, 1.0
    row1 = a + b
    col1 = a + c
    e11 = row1 * col1 / n
    e12 = row1 * (n - col1) / n
    e21 = (n - row1) * col1 / n
    e22 = (n - row1) * (n - col1) / n
    chi2 = 0.0
    for obs, exp in [(a, e11), (b, e12), (c, e21), (d, e22)]:
        if exp > 0:
            chi2 += (obs - exp) ** 2 / exp
    p_value = math.erfc(math.sqrt(chi2 / 2))
    return chi2, p_value

def bonferroni_correction(p_values):
    m = len(p_values)
    return [min(p * m, 1.0) for p in p_values]

def benjamini_hochberg(p_values):
    m = len(p_values)
    indexed = sorted(enumerate(p_values), key=lambda x: x[1])
    adjusted = [0.0] * m
    prev = 1.0
    for k in range(m - 1, -1, -1):
        idx, p = indexed[k]
        adj = p * m / (k + 1)
        adj = min(adj, prev)
        adjusted[idx] = adj
        prev = adj
    return adjusted

# === 検定対象の定義 ===
gogyo_list = ["木", "火", "土", "金", "水"]
star_list = ["貫索星", "石門星", "司禄星", "禄存星", "牽牛星", "車騎星", "玉堂星", "龍高星", "調舒星", "鳳閣星"]
tenchu_list = ["子丑", "寅卯", "辰巳", "午未", "申酉", "戌亥"]

tests = []

# A. 五行バランス（最強・最弱）
for g in gogyo_list:
    tests.append(("五行過剰", g, lambda d, g=g: g in d.get("strongest_gogyo", [])))
    tests.append(("五行欠乏", g, lambda d, g=g: g in d.get("weakest_gogyo", [])))

# B. 日干の陰陽・五行
tests.append(("日干陰陽", "陰干", lambda d: d.get("day_yin_yang") == "陰"))
tests.append(("日干陰陽", "陽干", lambda d: d.get("day_yin_yang") == "陽"))
for g in gogyo_list:
    tests.append(("日干五行", g, lambda d, g=g: d.get("day_element") == g))

# C. 中央星（十大主星）
for s in star_list:
    tests.append(("中央星", s, lambda d, s=s: d.get("main_stars", {}).get("center") == s))

# D. 北方星・南方星・東方星・西方星
for pos in ["north", "south", "east", "west"]:
    for s in star_list:
        tests.append((f"{pos}星", s, lambda d, s=s, pos=pos: d.get("main_stars", {}).get(pos) == s))

# E. 宿命天中殺
for t in tenchu_list:
    tests.append(("宿命天中殺", t, lambda d, t=t: d.get("tenchusatsu") == t))

# F. 五行バランス度
tests.append(("五行バランス度", "偏り大(3以上)", lambda d: d.get("gogyo_balance", 0) >= 3))
tests.append(("五行バランス度", "バランス良好(1以下)", lambda d: d.get("gogyo_balance", 0) <= 1))

# G. バランスタイプ
balance_types_set = set(d.get("balance_type", "") for d in data)
for bt in balance_types_set:
    if bt:
        tests.append(("バランスタイプ", bt, lambda d, bt=bt: d.get("balance_type") == bt))

# H. 位相法（宿命内）
def get_topology_names(d):
    topo = d.get("topology", [])
    return [t.get("name", "") for t in topo if isinstance(t, dict)]

all_topo_names = set()
for d in data:
    all_topo_names.update(get_topology_names(d))
for tn in all_topo_names:
    if tn:
        tests.append(("位相法", tn, lambda d, tn=tn: tn in get_topology_names(d)))

# I. 姓名判断（ランク）
def get_seimei_ranks(d):
    s = d.get("seimei")
    if not s or not isinstance(s, dict):
        return {}
    ranks = {}
    for key in ["ten_rank", "jin_rank", "chi_rank", "gai_rank", "sou_rank"]:
        val = s.get(key)
        if val is not None:
            ranks[key] = val
    return ranks

# 姓名判断のランク分布を確認（dict型の場合は文字列に変換）
seimei_ranks_set = set()
for d in data:
    ranks = get_seimei_ranks(d)
    for v in ranks.values():
        if isinstance(v, dict):
            seimei_ranks_set.add(str(v.get("rank", v.get("name", str(v)))))
        elif isinstance(v, (int, float, str)):
            seimei_ranks_set.add(str(v))

for rank_val in seimei_ranks_set:
    if rank_val:
        tests.append(("姓名判断・天格", rank_val, lambda d, rv=rank_val: str(get_seimei_ranks(d).get("ten_rank", "")) == rv))
        tests.append(("姓名判断・人格", rank_val, lambda d, rv=rank_val: str(get_seimei_ranks(d).get("jin_rank", "")) == rv))
        tests.append(("姓名判断・地格", rank_val, lambda d, rv=rank_val: str(get_seimei_ranks(d).get("chi_rank", "")) == rv))

# === 検定実行 ===
n_cases = len(cases)
n_controls = len(controls)

print("=" * 80)
print("【ケース vs コントロール 全体比較】 Fisher's exact test")
print("=" * 80)
print(f"ケース群: {n_cases}名 / コントロール群: {n_controls}名")
print()

results = []

for category, condition_name, condition_fn in tests:
    a = sum(1 for d in cases if condition_fn(d))
    b = n_cases - a
    c = sum(1 for d in controls if condition_fn(d))
    d_val = n_controls - c

    p_fisher, odds_ratio = fisher_exact_test(a, b, c, d_val)
    chi2, p_chi = chi_square_test(a, b, c, d_val)

    results.append({
        "comparison": "Case vs Control",
        "category": category,
        "condition": condition_name,
        "a": a, "b": b, "c": c, "d": d_val,
        "n_cases": n_cases,
        "n_controls": n_controls,
        "pct_cases": a / n_cases * 100 if n_cases > 0 else 0,
        "pct_controls": c / n_controls * 100 if n_controls > 0 else 0,
        "odds_ratio": odds_ratio,
        "p_fisher": p_fisher,
        "chi2": chi2,
        "p_chi": p_chi,
    })

# === 病気カテゴリ別のケース・コントロール比較 ===
target_disease_groups = [g for g in disease_groups.keys() if disease_groups[g] >= 5]

for dg in target_disease_groups:
    group_cases = [d for d in cases if d["disease_group"] == dg]
    n_group = len(group_cases)

    for category, condition_name, condition_fn in tests:
        a = sum(1 for d in group_cases if condition_fn(d))
        b = n_group - a
        c = sum(1 for d in controls if condition_fn(d))
        d_val = n_controls - c

        p_fisher, odds_ratio = fisher_exact_test(a, b, c, d_val)
        chi2, p_chi = chi_square_test(a, b, c, d_val)

        results.append({
            "comparison": f"{dg} vs Control",
            "category": category,
            "condition": condition_name,
            "a": a, "b": b, "c": c, "d": d_val,
            "n_cases": n_group,
            "n_controls": n_controls,
            "pct_cases": a / n_group * 100 if n_group > 0 else 0,
            "pct_controls": c / n_controls * 100 if n_controls > 0 else 0,
            "odds_ratio": odds_ratio,
            "p_fisher": p_fisher,
            "chi2": chi2,
            "p_chi": p_chi,
        })

# === p値の多重比較補正 ===
all_p_values = [r["p_fisher"] for r in results]
bh_adjusted = benjamini_hochberg(all_p_values)
bf_adjusted = bonferroni_correction(all_p_values)

for i, r in enumerate(results):
    r["p_fisher_bh"] = bh_adjusted[i]
    r["p_fisher_bf"] = bf_adjusted[i]

# === 結果出力 ===

# 1. 全体比較の有意な結果
print("\n" + "=" * 80)
print("【ケース vs コントロール 有意な相関（p < 0.05、補正前）】")
print("=" * 80)
print(f"{'カテゴリ':<16} {'条件':<20} {'ケース%':>8} {'コントロール%':>14} {'OR':>8} {'p(Fisher)':>10} {'p(BH)':>10} {'p(BF)':>10}")
print("-" * 120)

overall_results = [r for r in results if r["comparison"] == "Case vs Control"]
significant = [r for r in overall_results if r["p_fisher"] < 0.05]
significant.sort(key=lambda x: x["p_fisher"])

for r in significant:
    or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
    sig_mark = ""
    if r["p_fisher_bh"] < 0.05:
        sig_mark = " **"
    elif r["p_fisher_bf"] < 0.05:
        sig_mark = " *"
    print(f"{r['category']:<16} {r['condition']:<20} {r['pct_cases']:>7.1f}% {r['pct_controls']:>13.1f}% {or_str:>8} {r['p_fisher']:>10.4f} {r['p_fisher_bh']:>10.4f} {r['p_fisher_bf']:>10.4f}{sig_mark}")

print(f"\n(*: Bonferroni補正後p<0.05, **: BH補正後p<0.05)")
print(f"有意な相関数: {len(significant)} / {len(overall_results)} 検定")

# 2. 病気カテゴリ別の有意な結果
print("\n" + "=" * 80)
print("【病気カテゴリ別 vs コントロール 有意な相関（p < 0.05、補正前）】")
print("=" * 80)
print(f"{'比較':<30} {'カテゴリ':<16} {'条件':<20} {'ケース%':>8} {'CTRL%':>8} {'OR':>8} {'p(Fisher)':>10} {'p(BH)':>10}")
print("-" * 140)

disease_results = [r for r in results if r["comparison"] != "Case vs Control"]
disease_sig = [r for r in disease_results if r["p_fisher"] < 0.05]
disease_sig.sort(key=lambda x: x["p_fisher"])

for r in disease_sig:
    or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
    sig_mark = " **" if r["p_fisher_bh"] < 0.05 else (" *" if r["p_fisher_bf"] < 0.05 else "")
    print(f"{r['comparison']:<30} {r['category']:<16} {r['condition']:<20} {r['pct_cases']:>7.1f}% {r['pct_controls']:>7.1f}% {or_str:>8} {r['p_fisher']:>10.4f} {r['p_fisher_bh']:>10.4f}{sig_mark}")

print(f"\n有意な相関数: {len(disease_sig)} / {len(disease_results)} 検定")

# 3. BH補正後も有意な結果
bh_sig = [r for r in results if r["p_fisher_bh"] < 0.05]
if bh_sig:
    print("\n" + "=" * 80)
    print("【BH補正後も有意な相関（FDR < 0.05）】")
    print("=" * 80)
    for r in bh_sig:
        or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
        print(f"  {r['comparison']} | {r['category']}: {r['condition']}")
        print(f"    ケース: {r['a']}/{r['n_cases']} ({r['pct_cases']:.1f}%) vs コントロール: {r['c']}/{r['n_controls']} ({r['pct_controls']:.1f}%)")
        print(f"    OR={or_str}, p={r['p_fisher']:.4f}, p(BH)={r['p_fisher_bh']:.4f}")
        print()
else:
    print("\n※BH補正後も有意な相関はありませんでした。")

# 4. Bonferroni補正後
bf_sig = [r for r in results if r["p_fisher_bf"] < 0.05]
if bf_sig:
    print("\n" + "=" * 80)
    print("【Bonferroni補正後も有意な相関（最も厳格）】")
    print("=" * 80)
    for r in bf_sig:
        or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
        print(f"  {r['comparison']} | {r['category']}: {r['condition']}")
        print(f"    OR={or_str}, p={r['p_fisher']:.4f}, p(BF)={r['p_fisher_bf']:.4f}")
else:
    print("\n※Bonferroni補正後も有意な相関はありませんでした。")

# 5. 傾向あり（p < 0.10）
print("\n" + "=" * 80)
print("【傾向あり（p < 0.10、補正前）】")
print("=" * 80)
print(f"{'比較':<30} {'カテゴリ':<16} {'条件':<20} {'ケース%':>8} {'CTRL%':>8} {'OR':>8} {'p(Fisher)':>10}")
print("-" * 120)

trend = [r for r in results if r["p_fisher"] < 0.10 and r["p_fisher"] >= 0.05]
trend.sort(key=lambda x: x["p_fisher"])
for r in trend:
    or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
    print(f"{r['comparison']:<30} {r['category']:<16} {r['condition']:<20} {r['pct_cases']:>7.1f}% {r['pct_controls']:>7.1f}% {or_str:>8} {r['p_fisher']:>10.4f}")

# 6. サマリー
print("\n" + "=" * 80)
print("【検定サマリー】")
print("=" * 80)
print(f"  総検定数: {len(results)}")
print(f"    全体比較: {len(overall_results)}")
print(f"    病気カテゴリ別: {len(disease_results)}")
print(f"  p < 0.05 (補正前): {len(significant) + len(disease_sig)}")
print(f"  p < 0.05 (BH補正後): {len(bh_sig)}")
print(f"  p < 0.05 (Bonferroni補正後): {len(bf_sig)}")
print(f"  p < 0.10 (補正前): {len(significant) + len(disease_sig) + len(trend)}")
print()
print(f"※ケース・コントロール研究デザイン:")
print(f"  ケース{n_cases}名 vs コントロール{n_controls}名の比較")
print(f"  統計検出力はサンプルサイズに依存します。")

# Write output to file
output_path = os.path.join(os.path.dirname(__file__), "case_control_results.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(_output_lines))
sys.stdout.write(f"Results written to {output_path}\n")
