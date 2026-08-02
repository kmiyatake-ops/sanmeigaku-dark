# -*- coding: utf-8 -*-
"""
浮気・不倫・離婚・結婚適性度の統計分析
ケース・コントロール研究デザイン:
- 分析1: 不倫ケース vs コントロール（浮気リスクの検証）
- 分析2: 離婚ケース vs コントロール（結婚適性度の検証）
- 分析3: 不倫+離婚 vs コントロール（総合結婚リスク）

各分析で:
- Fisher正確検定（各算命学要素）
- ロジスティック回帰（交絡因子調整）
- 現在のaffair_score/marriage_scoreの予測精度評価（AUC）
"""

import json
import os
import sys
import math
from collections import Counter, defaultdict

_output_lines = []
def print(*args, **kwargs):
    _output_lines.append(" ".join(str(a) for a in args))

BASE_DIR = os.path.dirname(__file__)
input_path = os.path.join(BASE_DIR, "celebrity_marriage_sanmeigaku.json")
with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data = [d for d in data if "error" not in d]

affair_cases = [d for d in data if d["group"] == "affair_case"]
divorce_cases = [d for d in data if d["group"] == "divorce_case"]
controls = [d for d in data if d["group"] == "control"]

print("=" * 80)
print("浮気・不倫・離婚・結婚適性度 統計分析")
print("=" * 80)
print(f"総対象者数: {len(data)}名")
print(f"  不倫ケース: {len(affair_cases)}名")
print(f"  離婚ケース: {len(divorce_cases)}名")
print(f"  コントロール: {len(controls)}名")
print()

# === 特徴量エンジニアリング ===
star_list = ["貫索星", "石門星", "司禄星", "禄存星", "牽牛星", "車騎星", "玉堂星", "龍高星", "調舒星", "鳳閣星"]
gogyo_list = ["木", "火", "土", "金", "水"]
tenchu_list = ["子丑", "寅卯", "辰巳", "午未", "申酉", "戌亥"]

def get_birth_decade(d):
    try:
        year = int(d["birth_date"][:4])
        return (year // 10) * 10
    except:
        return None

def get_gender_code(d):
    return 1 if d.get("gender") == "male" else 0

all_decades = sorted(set(get_birth_decade(d) for d in data if get_birth_decade(d) is not None))
decade_reference = all_decades[len(all_decades) // 2]

def get_topology_names(d):
    topo = d.get("topology", [])
    return [t.get("name", "") for t in topo if isinstance(t, dict)]

all_topo_names = set()
for d in data:
    all_topo_names.update(get_topology_names(d))

def make_confounder_features(d):
    features = {}
    features["male"] = get_gender_code(d)
    decade = get_birth_decade(d)
    for dec in all_decades:
        if dec == decade_reference:
            continue
        features[f"decade_{dec}"] = 1 if decade == dec else 0
    return features

def make_sanmeigaku_features(d):
    features = {}
    for g in gogyo_list:
        features[f"strongest_{g}"] = 1 if g in d.get("strongest_gogyo", []) else 0
        features[f"weakest_{g}"] = 1 if g in d.get("weakest_gogyo", []) else 0
    features["day_yin"] = 1 if d.get("day_yin_yang") == "陰" else 0
    features["day_yang"] = 1 if d.get("day_yin_yang") == "陽" else 0
    for g in gogyo_list:
        features[f"day_element_{g}"] = 1 if d.get("day_element") == g else 0
    for s in star_list:
        features[f"center_{s}"] = 1 if d.get("main_stars", {}).get("center") == s else 0
    for pos in ["north", "south", "east", "west"]:
        for s in star_list:
            features[f"{pos}_{s}"] = 1 if d.get("main_stars", {}).get(pos) == s else 0
    for t in tenchu_list:
        features[f"tenchu_{t}"] = 1 if d.get("tenchusatsu") == t else 0
    features["balance_high"] = 1 if d.get("gogyo_balance", 0) >= 3 else 0
    features["balance_low"] = 1 if d.get("gogyo_balance", 0) <= 1 else 0
    features["balance_balanced"] = 1 if d.get("balance_type") == "balanced" else 0
    features["balance_moderate"] = 1 if d.get("balance_type") == "moderate" else 0
    features["balance_imbalanced"] = 1 if d.get("balance_type") == "imbalanced" else 0
    features["is_double_en"] = 1 if d.get("is_double_en") else 0
    features["has_abnormal"] = 1 if d.get("has_abnormal") else 0
    features["has_top_three_abnormal"] = 1 if d.get("has_top_three_abnormal") else 0
    topo_names = get_topology_names(d)
    for tn in all_topo_names:
        if tn:
            features[f"topo_{tn}"] = 1 if tn in topo_names else 0
    return features

confounder_keys = list(make_confounder_features(data[0]).keys())
sanmeigaku_keys = list(make_sanmeigaku_features(data[0]).keys())

all_features = {}
for d in data:
    cf = make_confounder_features(d)
    sf = make_sanmeigaku_features(d)
    all_features[id(d)] = {**cf, **sf}

# === Fisher正確検定 ===
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def log_factorial(n):
    if n <= 1:
        return 0.0
    return sum(math.log(i) for i in range(2, n + 1))

def fisher_exact_p(a, b, c, d):
    n = a + b + c + d
    row1 = a + b
    row2 = c + d
    col1 = a + c
    col2 = b + d
    if row1 == 0 or row2 == 0 or col1 == 0 or col2 == 0:
        return 1.0
    log_denom = log_factorial(row1) + log_factorial(row2) + log_factorial(col1) + log_factorial(col2) - log_factorial(n)
    min_val = min(row1, col1)
    p_total = 0.0
    for i in range(min_val + 1):
        j = row1 - i
        k = col1 - i
        l = row2 - k
        if j < 0 or k < 0 or l < 0:
            continue
        log_p = log_factorial(i) + log_factorial(j) + log_factorial(k) + log_factorial(l) - log_denom
        p_val = math.exp(log_p)
        if i >= a:
            p_total += p_val
    return min(1.0, p_total)

def benjamini_hochberg(p_values):
    n = len(p_values)
    indexed = sorted(enumerate(p_values), key=lambda x: x[1])
    bh_values = [0.0] * n
    prev = 1.0
    for rank in range(n - 1, -1, -1):
        orig_idx, p = indexed[rank]
        bh_val = p * n / (rank + 1)
        bh_val = min(bh_val, prev)
        bh_values[orig_idx] = bh_val
        prev = bh_val
    return bh_values

def bonferroni(p_values, n_tests):
    return [min(1.0, p * n_tests) for p in p_values]

# === ロジスティック回帰 ===
def sigmoid(z):
    if z >= 0:
        return 1.0 / (1.0 + math.exp(-z))
    else:
        ez = math.exp(z)
        return ez / (1.0 + ez)

def matrix_inverse(M):
    n = len(M)
    aug = [row[:] + [1.0 if i == j else 0.0 for j in range(n)] for i, row in enumerate(M)]
    for col in range(n):
        max_row = col
        for r in range(col + 1, n):
            if abs(aug[r][col]) > abs(aug[max_row][col]):
                max_row = r
        aug[col], aug[max_row] = aug[max_row], aug[col]
        if abs(aug[col][col]) < 1e-12:
            raise ValueError("singular")
        pivot = aug[col][col]
        for j in range(2 * n):
            aug[col][j] /= pivot
        for r in range(n):
            if r == col:
                continue
            factor = aug[r][col]
            for j in range(2 * n):
                aug[r][j] -= factor * aug[col][j]
    return [[aug[i][n + j] for j in range(n)] for i in range(n)]

def logistic_regression(X, y, max_iter=100, tol=1e-6, l2=0.01):
    n = len(y)
    p_features = len(X[0])
    beta = [0.0] * p_features
    for iteration in range(max_iter):
        p = [sigmoid(sum(beta[j] * X[i][j] for j in range(p_features))) for i in range(n)]
        grad = []
        for j in range(p_features):
            g = sum(X[i][j] * (y[i] - p[i]) for i in range(n))
            if j > 0:
                g -= l2 * beta[j]
            grad.append(g)
        W = [p[i] * (1 - p[i]) for i in range(n)]
        H = [[0.0] * p_features for _ in range(p_features)]
        for j in range(p_features):
            for k in range(p_features):
                h_jk = -sum(X[i][j] * W[i] * X[i][k] for i in range(n))
                if j > 0 and j == k:
                    h_jk -= l2
                H[j][k] = h_jk
        try:
            H_inv = matrix_inverse(H)
        except:
            for j in range(p_features):
                H[j][j] -= 1e-8
            try:
                H_inv = matrix_inverse(H)
            except:
                break
        delta = [sum(H_inv[j][k] * grad[k] for k in range(p_features)) for j in range(p_features)]
        beta_new = [beta[j] - delta[j] for j in range(p_features)]
        max_delta = max(abs(d) for d in delta)
        beta = beta_new
        if max_delta < tol:
            break
    return beta

def predict_proba(X, beta):
    return [sigmoid(sum(beta[j] * X[i][j] for j in range(len(beta)))) for i in range(len(X))]

def compute_auc(y_true, y_pred):
    pairs = list(zip(y_true, y_pred))
    pairs.sort(key=lambda x: -x[1])
    n_pos = sum(1 for y, _ in pairs if y == 1)
    n_neg = len(pairs) - n_pos
    if n_pos == 0 or n_neg == 0:
        return 0.5
    tp = 0
    auc = 0.0
    for y, score in pairs:
        if y == 1:
            tp += 1
        else:
            auc += tp
    auc /= (n_pos * n_neg)
    return auc

def make_feature_vector(d, feature_keys, include_intercept=True):
    vec = []
    if include_intercept:
        vec.append(1.0)
    for k in feature_keys:
        vec.append(float(all_features[id(d)].get(k, 0)))
    return vec

# === 分析関数 ===
def run_fisher_analysis(cases, controls, label):
    print(f"\n{'=' * 80}")
    print(f"【{label}】Fisher正確検定")
    print(f"  ケース: {len(cases)}名 vs コントロール: {len(controls)}名")
    print(f"{'=' * 80}")

    results = []
    for key in sanmeigaku_keys:
        case_has = sum(1 for d in cases if all_features[id(d)].get(key, 0) == 1)
        case_total = len(cases)
        ctrl_has = sum(1 for d in controls if all_features[id(d)].get(key, 0) == 1)
        ctrl_total = len(controls)

        a = case_has
        b = case_total - case_has
        c = ctrl_has
        d_val = ctrl_total - ctrl_has

        if a + b == 0 or c + d_val == 0:
            continue
        if a + c == 0 or b + d_val == 0:
            continue

        p_val = fisher_exact_p(a, b, c, d_val)
        case_rate = a / case_total if case_total > 0 else 0
        ctrl_rate = c / ctrl_total if ctrl_total > 0 else 0
        or_val = (a * d_val) / (b * c) if b > 0 and c > 0 else float('inf')

        results.append({
            "feature": key,
            "case_rate": case_rate,
            "ctrl_rate": ctrl_rate,
            "OR": or_val,
            "p": p_val,
            "case_has": a,
            "case_total": case_total,
            "ctrl_has": c,
            "ctrl_total": ctrl_total,
        })

    results.sort(key=lambda x: x["p"])
    p_values = [r["p"] for r in results]
    bh = benjamini_hochberg(p_values)
    bf = bonferroni(p_values, len(p_values))

    print(f"\n  有意な要素 (p < 0.05, 未補正):")
    sig_count = 0
    for i, r in enumerate(results):
        if r["p"] < 0.05:
            sig_count += 1
            sig = "***" if r["p"] < 0.001 else "**" if r["p"] < 0.01 else "*" if r["p"] < 0.05 else ""
            print(f"    {r['feature']}: OR={r['OR']:.2f} p={r['p']:.4f} {sig} "
                  f"(ケース{r['case_has']}/{r['case_total']}={r['case_rate']:.1%} vs "
                  f"対照{r['ctrl_has']}/{r['ctrl_total']}={r['ctrl_rate']:.1%}) "
                  f"BH={bh[i]:.4f} BF={bf[i]:.4f}")
    if sig_count == 0:
        print(f"    なし")

    print(f"\n  傾向あり (p < 0.10, 未補正):")
    trend_count = 0
    for i, r in enumerate(results):
        if 0.05 <= r["p"] < 0.10:
            trend_count += 1
            print(f"    {r['feature']}: OR={r['OR']:.2f} p={r['p']:.4f} "
                  f"(ケース{r['case_rate']:.1%} vs 対照{r['ctrl_rate']:.1%})")
    if trend_count == 0:
        print(f"    なし")

    print(f"\n  BH補正後有意 (p < 0.05):")
    bh_sig = sum(1 for b in bh if b < 0.05)
    if bh_sig > 0:
        for i, r in enumerate(results):
            if bh[i] < 0.05:
                print(f"    {r['feature']}: BH={bh[i]:.4f}")
    else:
        print(f"    なし")

    return results, bh, bf

def run_logistic_regression(cases, controls, label, feature_keys):
    print(f"\n{'=' * 80}")
    print(f"【{label}】ロジスティック回帰（交絡因子調整済み）")
    print(f"{'=' * 80}")

    all_data = cases + controls
    y = [1] * len(cases) + [0] * len(controls)

    X = [make_feature_vector(d, feature_keys) for d in all_data]
    beta = logistic_regression(X, y, l2=0.01)
    y_pred = predict_proba(X, beta)
    auc = compute_auc(y, y_pred)

    print(f"\n  モデルAUC: {auc:.4f}")
    print(f"  特徴量数: {len(feature_keys)}")

    # 各特徴量のWald検定
    p_features = len(X[0])
    p_vals = [sigmoid(sum(beta[j] * X[i][j] for j in range(p_features))) for i in range(len(y))]
    W = [p_vals[i] * (1 - p_vals[i]) for i in range(len(y))]

    results = []
    for j in range(1, p_features):
        se_sq = 1.0 / (sum(W[i] * X[i][j] ** 2 for i in range(len(y))) + 0.01)
        se = math.sqrt(se_sq)
        z = beta[j] / se if se > 0 else 0
        p_val = 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))
        or_val = math.exp(beta[j])
        ci_low = math.exp(beta[j] - 1.96 * se)
        ci_high = math.exp(beta[j] + 1.96 * se)
        feature_name = feature_keys[j - 1]
        results.append({
            "feature": feature_name,
            "OR": or_val,
            "CI_low": ci_low,
            "CI_high": ci_high,
            "p": p_val,
            "beta": beta[j],
        })

    results.sort(key=lambda x: x["p"])
    print(f"\n  有意な要素 (p < 0.05, 未補正):")
    sig_count = 0
    for r in results:
        if r["p"] < 0.05:
            sig_count += 1
            sig = "***" if r["p"] < 0.001 else "**" if r["p"] < 0.01 else "*"
            print(f"    {r['feature']}: OR={r['OR']:.2f} [95%CI: {r['CI_low']:.2f}-{r['CI_high']:.2f}] p={r['p']:.4f} {sig}")
    if sig_count == 0:
        print(f"    なし")

    print(f"\n  傾向あり (p < 0.10):")
    trend_count = 0
    for r in results:
        if 0.05 <= r["p"] < 0.10:
            trend_count += 1
            print(f"    {r['feature']}: OR={r['OR']:.2f} p={r['p']:.4f}")
    if trend_count == 0:
        print(f"    なし")

    return results, auc

def evaluate_current_scores(cases, controls, label):
    """現在のapp.jsのaffair_score/marriage_scoreの予測精度を評価"""
    print(f"\n{'=' * 80}")
    print(f"【{label}】現在のスコア予測精度評価")
    print(f"{'=' * 80}")

    all_data = cases + controls
    y = [1] * len(cases) + [0] * len(controls)

    # affair_scoreのAUC
    affair_scores = [d["affair_score"] for d in all_data]
    auc_affair = compute_auc(y, affair_scores)

    # marriage_scoreのAUC（逆転: スコア低いほどリスク）
    marriage_scores = [-d["marriage_score"] for d in all_data]
    auc_marriage = compute_auc(y, marriage_scores)

    print(f"\n  現在のaffair_score AUC: {auc_affair:.4f}")
    print(f"  現在のmarriage_score AUC（逆転）: {auc_marriage:.4f}")

    # スコア分布
    case_affair = [d["affair_score"] for d in cases]
    ctrl_affair = [d["affair_score"] for d in controls]
    case_marriage = [d["marriage_score"] for d in cases]
    ctrl_marriage = [d["marriage_score"] for d in controls]

    print(f"\n  affair_score平均: ケース={sum(case_affair)/len(case_affair):.1f} vs 対照={sum(ctrl_affair)/len(ctrl_affair):.1f}")
    print(f"  marriage_score平均: ケース={sum(case_marriage)/len(case_marriage):.1f} vs 対照={sum(ctrl_marriage)/len(ctrl_marriage):.1f}")

    # t検定的な効果量
    pooled_std_a = math.sqrt((sum((x - sum(case_affair)/len(case_affair))**2 for x in case_affair) + sum((x - sum(ctrl_affair)/len(ctrl_affair))**2 for x in ctrl_affair)) / (len(case_affair) + len(ctrl_affair)))
    d_affair = (sum(case_affair)/len(case_affair) - sum(ctrl_affair)/len(ctrl_affair)) / pooled_std_a if pooled_std_a > 0 else 0

    pooled_std_m = math.sqrt((sum((x - sum(case_marriage)/len(case_marriage))**2 for x in case_marriage) + sum((x - sum(ctrl_marriage)/len(ctrl_marriage))**2 for x in ctrl_marriage)) / (len(case_marriage) + len(ctrl_marriage)))
    d_marriage = (sum(case_marriage)/len(case_marriage) - sum(ctrl_marriage)/len(ctrl_marriage)) / pooled_std_m if pooled_std_m > 0 else 0

    print(f"  Cohen's d (affair_score): {d_affair:.3f}")
    print(f"  Cohen's d (marriage_score): {d_marriage:.3f}")

    return auc_affair, auc_marriage, d_affair, d_marriage

# === 分析1: 不倫ケース vs コントロール ===
print("\n" + "=" * 80)
print("分析1: 不倫・浮気ケース vs コントロール")
print("=" * 80)

fisher1, bh1, bf1 = run_fisher_analysis(affair_cases, controls, "不倫ケース vs 対照")
logistic1, auc1 = run_logistic_regression(affair_cases, controls, "不倫ケース vs 対照", confounder_keys + sanmeigaku_keys)
auc_affair1, auc_marriage1, d_affair1, d_marriage1 = evaluate_current_scores(affair_cases, controls, "不倫ケース vs 対照")

# === 分析2: 離婚ケース vs コントロール ===
print("\n" + "=" * 80)
print("分析2: 離婚ケース vs コントロール")
print("=" * 80)

fisher2, bh2, bf2 = run_fisher_analysis(divorce_cases, controls, "離婚ケース vs 対照")
logistic2, auc2 = run_logistic_regression(divorce_cases, controls, "離婚ケース vs 対照", confounder_keys + sanmeigaku_keys)
auc_affair2, auc_marriage2, d_affair2, d_marriage2 = evaluate_current_scores(divorce_cases, controls, "離婚ケース vs 対照")

# === 分析3: 不倫+離婚 vs コントロール ===
combined_cases = affair_cases + divorce_cases
print("\n" + "=" * 80)
print("分析3: 不倫+離婚（総合）vs コントロール")
print("=" * 80)

fisher3, bh3, bf3 = run_fisher_analysis(combined_cases, controls, "総合ケース vs 対照")
logistic3, auc3 = run_logistic_regression(combined_cases, controls, "総合ケース vs 対照", confounder_keys + sanmeigaku_keys)
auc_affair3, auc_marriage3, d_affair3, d_marriage3 = evaluate_current_scores(combined_cases, controls, "総合ケース vs 対照")

# === 総合まとめ ===
print("\n" + "=" * 80)
print("【総合まとめ】")
print("=" * 80)

print(f"\n1. 現在のスコア予測精度 (AUC):")
print(f"   {'分析':<25} {'affair_score AUC':>18} {'marriage_score AUC':>20} {'d(affair)':>10} {'d(marriage)':>12}")
print(f"   {'-' * 85}")
print(f"   {'不倫 vs 対照':<23} {auc_affair1:>18.4f} {auc_marriage1:>20.4f} {d_affair1:>10.3f} {d_marriage1:>12.3f}")
print(f"   {'離婚 vs 対照':<23} {auc_affair2:>18.4f} {auc_marriage2:>20.4f} {d_affair2:>10.3f} {d_marriage2:>12.3f}")
print(f"   {'総合 vs 対照':<23} {auc_affair3:>18.4f} {auc_marriage3:>20.4f} {d_affair3:>10.3f} {d_marriage3:>12.3f}")

print(f"\n2. ロジスティック回帰モデルAUC:")
print(f"   不倫 vs 対照: {auc1:.4f}")
print(f"   離婚 vs 対照: {auc2:.4f}")
print(f"   総合 vs 対照: {auc3:.4f}")

print(f"\n3. 結論:")
if auc_affair3 > 0.65:
    print(f"   ✅ 現在のaffair_scoreは予測力あり (AUC={auc_affair3:.2f})")
elif auc_affair3 > 0.55:
    print(f"   △ 現在のaffair_scoreは弱い予測力 (AUC={auc_affair3:.2f})")
else:
    print(f"   ❌ 現在のaffair_scoreは予測力不十分 (AUC={auc_affair3:.2f})")

if auc_marriage3 > 0.65:
    print(f"   ✅ 現在のmarriage_scoreは予測力あり (AUC={auc_marriage3:.2f})")
elif auc_marriage3 > 0.55:
    print(f"   △ 現在のmarriage_scoreは弱い予測力 (AUC={auc_marriage3:.2f})")
else:
    print(f"   ❌ 現在のmarriage_scoreは予測力不十分 (AUC={auc_marriage3:.2f})")

# 上位有意要素
print(f"\n4. 各分析の上位有意要素 (p<0.10, Fisher):")
for label, fisher_res in [("不倫", fisher1), ("離婚", fisher2), ("総合", fisher3)]:
    top = [r for r in fisher_res if r["p"] < 0.10][:5]
    if top:
        print(f"   {label}:")
        for r in top:
            print(f"     {r['feature']}: OR={r['OR']:.2f} p={r['p']:.4f}")
    else:
        print(f"   {label}: 有意要素なし")

# Write output
output_path = os.path.join(BASE_DIR, "marriage_analysis_results.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(_output_lines))
sys.stdout.write(f"\nResults written to {output_path}\n")
