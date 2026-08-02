# -*- coding: utf-8 -*-
"""
芸能人病気データ 算命学 統計的検定スクリプト
Fisher's exact test / Chi-square test により相関の有意性を検定する。
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
if not os.path.exists(input_path):
    input_path = os.path.join(os.path.dirname(__file__), "..", "..", "Downloads", "celebrity_sanmeigaku_results (1).json")
if not os.path.exists(input_path):
    input_path = os.path.join(os.path.expanduser("~"), "Downloads", "celebrity_sanmeigaku_results (1).json")
if not os.path.exists(input_path):
    input_path = os.path.join(os.path.expanduser("~"), "Downloads", "celebrity_sanmeigaku_results.json")

with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data = [d for d in data if "error" not in d]
print(f"統計検定対象: {len(data)}名\n")

# === 病気カテゴリの分類 ===
def get_disease_group(category):
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
    else: return "その他"

for d in data:
    d["disease_group"] = get_disease_group(d["illness_category"])

disease_groups = Counter(d["disease_group"] for d in data)
total_n = len(data)

# === 統計検定関数 ===

def log_factorial(n):
    if n <= 1:
        return 0.0
    return sum(math.log(i) for i in range(2, n + 1))

def fisher_exact_test(a, b, c, d):
    """2x2分割表のFisher's exact test（両側）"""
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
    """カイ二乗検定（2x2分割表）"""
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
def has_seimei(d):
    s = d.get("seimei")
    return s and isinstance(s, dict) and "error" not in s

gogyo_list = ["木", "火", "土", "金", "水"]
star_list = ["貫索星", "石門星", "司禄星", "禄存星", "牽牛星", "車騎星", "玉堂星", "龍高星", "調舒星", "鳳閣星"]
tenchu_list = ["子丑", "寅卯", "辰巳", "午未", "申酉", "戌亥"]

tests = []

# A. 五行バランス
for g in gogyo_list:
    tests.append(("五行過剰", g, lambda d, g=g: g in d.get("strongest_gogyo", [])))
    tests.append(("五行欠乏", g, lambda d, g=g: g in d.get("weakest_gogyo", [])))

# B. 日干の陰陽・五行
tests.append(("日干陰陽", "陰干", lambda d: d["day_yin_yang"] == "陰"))
tests.append(("日干陰陽", "陽干", lambda d: d["day_yin_yang"] == "陽"))
for g in gogyo_list:
    tests.append(("日干五行", g, lambda d, g=g: d["day_element"] == g))

# C. 中央星
for s in star_list:
    tests.append(("中央星", s, lambda d, s=s: d["main_stars"]["center"] == s))

# D. 全主星含有
for s in star_list:
    tests.append(("全主星含有", s, lambda d, s=s: s in d.get("main_stars_all", [])))

# E. 発症時天中殺
tests.append(("発症時年運天中殺", "天中殺中", lambda d: d.get("onset_data", {}).get("is_year_tenchu", False)))
tests.append(("発症時大運天中殺", "天中殺中", lambda d: d.get("onset_data", {}).get("is_taiun_tenchu", False)))

# F. 宿命天中殺
for t in tenchu_list:
    tests.append(("宿命天中殺", t, lambda d, t=t: d.get("tenchusatsu") == t))

# G. 発症時の位相法
def has_koki_kei(d):
    onset = d.get("onset_data", {})
    topo = onset.get("onset_topology", {})
    names = topo.get("names", [])
    return any("庫気刑" in n for n in names)
tests.append(("発症時位相法", "庫気刑（北方刑）", has_koki_kei))

def has_happo(d):
    onset = d.get("onset_data", {})
    topo = onset.get("onset_topology", {})
    names = topo.get("names", [])
    return any("破法" in n for n in names)
tests.append(("発症時位相法", "破法", has_happo))

def has_seiki_kei(d):
    onset = d.get("onset_data", {})
    topo = onset.get("onset_topology", {})
    names = topo.get("names", [])
    return any("生貴刑" in n for n in names)
tests.append(("発症時位相法", "生貴刑（南方刑）", has_seiki_kei))

# H. 健康リスク検出
def has_health_risk(d):
    onset = d.get("onset_data", {})
    hr = onset.get("health_risk")
    return hr is not None
tests.append(("健康リスク", "発症年検出", has_health_risk))

# I. 発症時の大運・年運主星
for s in star_list:
    tests.append(("発症時大運主星", s, lambda d, s=s: d.get("onset_data", {}).get("taiun_star") == s))
    tests.append(("発症時年運主星", s, lambda d, s=s: d.get("onset_data", {}).get("year_star") == s))

# J. 五行バランス度
tests.append(("五行バランス度", "偏り大(3以上)", lambda d: d["gogyo_balance"] >= 3))
tests.append(("五行バランス度", "バランス良好(1以下)", lambda d: d["gogyo_balance"] <= 1))

# === 検定実行 ===
print("=" * 80)
print("【統計的検定結果】 Fisher's exact test (両側) + カイ二乗検定")
print("=" * 80)
print(f"対象人数: {total_n}名")
print(f"病気グループ数: {len(disease_groups)}")
print()

target_groups = [g for g in disease_groups.keys() if disease_groups[g] >= 2]

results = []

for group in target_groups:
    group_data = [d for d in data if d["disease_group"] == group]
    n_group = len(group_data)
    other_data = [d for d in data if d["disease_group"] != group]
    n_other = len(other_data)

    for category, condition_name, condition_fn in tests:
        a = sum(1 for d in group_data if condition_fn(d))
        b = n_group - a
        c = sum(1 for d in other_data if condition_fn(d))
        d_val = n_other - c

        p_fisher, odds_ratio = fisher_exact_test(a, b, c, d_val)
        chi2, p_chi = chi_square_test(a, b, c, d_val)

        results.append({
            "group": group,
            "category": category,
            "condition": condition_name,
            "a": a, "b": b, "c": c, "d": d_val,
            "n_group": n_group,
            "pct_group": a / n_group * 100 if n_group > 0 else 0,
            "pct_other": c / n_other * 100 if n_other > 0 else 0,
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

# 1. 有意な結果のみ（p < 0.05 before correction）
print("\n" + "=" * 80)
print("【有意な相関（Fisher's exact p < 0.05、補正前）】")
print("=" * 80)
print(f"{'疾患群':<20} {'カテゴリ':<12} {'条件':<16} {'群内%':>6} {'他群%':>6} {'OR':>8} {'p(Fisher)':>10} {'p(BH)':>10} {'p(BF)':>10}")
print("-" * 120)

significant = [r for r in results if r["p_fisher"] < 0.05]
significant.sort(key=lambda x: x["p_fisher"])

for r in significant:
    or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
    sig_mark = ""
    if r["p_fisher_bh"] < 0.05:
        sig_mark = " **"
    elif r["p_fisher_bf"] < 0.05:
        sig_mark = " *"
    print(f"{r['group']:<20} {r['category']:<12} {r['condition']:<16} {r['pct_group']:>5.1f}% {r['pct_other']:>5.1f}% {or_str:>8} {r['p_fisher']:>10.4f} {r['p_fisher_bh']:>10.4f} {r['p_fisher_bf']:>10.4f}{sig_mark}")

print(f"\n(*: Bonferroni補正後p<0.05, **: BH補正後p<0.05)")
print(f"有意な相関数: {len(significant)} / {len(results)} 検定")

# 2. BH補正後も有意な結果
bh_sig = [r for r in results if r["p_fisher_bh"] < 0.05]
if bh_sig:
    print("\n" + "=" * 80)
    print("【BH補正後も有意な相関（FDR < 0.05）】")
    print("=" * 80)
    for r in bh_sig:
        or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
        print(f"  {r['group']} | {r['category']}: {r['condition']}")
        print(f"    群内: {r['a']}/{r['n_group']} ({r['pct_group']:.1f}%) vs 他群: {r['c']}/{r['n_group']+r['d']} ({r['pct_other']:.1f}%)")
        print(f"    OR={or_str}, p={r['p_fisher']:.4f}, p(BH)={r['p_fisher_bh']:.4f}")
        print()

# 3. Bonferroni補正後も有意な結果
bf_sig = [r for r in results if r["p_fisher_bf"] < 0.05]
if bf_sig:
    print("\n" + "=" * 80)
    print("【Bonferroni補正後も有意な相関（最も厳格）】")
    print("=" * 80)
    for r in bf_sig:
        or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
        print(f"  {r['group']} | {r['category']}: {r['condition']}")
        print(f"    群内: {r['a']}/{r['n_group']} ({r['pct_group']:.1f}%) vs 他群: {r['c']}/{r['n_group']+r['d']} ({r['pct_other']:.1f}%)")
        print(f"    OR={or_str}, p={r['p_fisher']:.4f}, p(BF)={r['p_fisher_bf']:.4f}")
        print()
else:
    print("\n※Bonferroni補正後も有意な相関はありませんでした（サンプルサイズ不足の可能性）")

# 4. 全結果（CSV風）
print("\n" + "=" * 80)
print("【全検定結果（p < 0.10のもの）】")
print("=" * 80)
print(f"{'疾患群':<20} {'カテゴリ':<12} {'条件':<16} {'群内%':>6} {'他群%':>6} {'OR':>8} {'p(Fisher)':>10} {'p(BH)':>10} {'p(BF)':>10}")
print("-" * 120)

trend = [r for r in results if r["p_fisher"] < 0.10]
trend.sort(key=lambda x: x["p_fisher"])
for r in trend:
    or_str = f"{r['odds_ratio']:.2f}" if r['odds_ratio'] != float('inf') else "inf"
    print(f"{r['group']:<20} {r['category']:<12} {r['condition']:<16} {r['pct_group']:>5.1f}% {r['pct_other']:>5.1f}% {or_str:>8} {r['p_fisher']:>10.4f} {r['p_fisher_bh']:>10.4f} {r['p_fisher_bf']:>10.4f}")

# 5. 検定数のサマリー
print("\n" + "=" * 80)
print("【検定サマリー】")
print("=" * 80)
print(f"  総検定数: {len(results)}")
print(f"  p < 0.05 (補正前): {len(significant)}")
print(f"  p < 0.05 (BH補正後): {len(bh_sig)}")
print(f"  p < 0.05 (Bonferroni補正後): {len(bf_sig)}")
print(f"  p < 0.10 (補正前): {len(trend)}")
print()
print(f"※注意: サンプルサイズが{len(data)}名のため、検出力が低い可能性があります。")
print("  データをさらに拡充することで、より信頼性の高い結果が得られます。")

# Write output to file
output_path = os.path.join(os.path.dirname(__file__), "statistical_test_results.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(_output_lines))
sys.stdout.write(f"Statistical test results written to {output_path}\n")
