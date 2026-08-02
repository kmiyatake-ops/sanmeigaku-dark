# -*- coding: utf-8 -*-
"""
変数を絞った再分析（過学習対策）
前回のロジスティック回帰で有意だった要素から15個を選択し、安定したモデルを構築
"""

import json
import os
import math
from collections import Counter

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
print("変数絞り再分析（過学習対策）")
print("=" * 80)
print(f"総対象者数: {len(data)}名")
print(f"  不倫ケース: {len(affair_cases)}名")
print(f"  離婚ケース: {len(divorce_cases)}名")
print(f"  コントロール: {len(controls)}名")

# === 絞り込んだ特徴量（15個）===
# 前回の全変数ロジスティック回帰で一貫して有意だった要素
SELECTED_FEATURES = [
    "male",                    # 性別（交絡因子）
    "balance_moderate",        # 五行バランス中程度
    "balance_high",            # 五行バランス大きい（保護的）
    "has_abnormal",            # 異常干支あり（保護的）
    "is_double_en",            # 双方の縁（保護的）
    "day_element_土",          # 日干五行「土」（リスク）
    "day_element_水",          # 日干五行「水」（保護的）
    "weakest_水",              # 水が最弱（リスク）
    "weakest_金",              # 金が最弱（リスク）
    "tenchu_寅卯",             # 天中殺寅卯（リスク）
    "center_司禄星",           # 中星司禄星（リスク）
    "east_貫索星",             # 東星貫索星（リスク）
    "topo_半会_木局",          # 半会木局（リスク）
    "topo_生貴刑_南方刑",      # 生貴刑南方刑（保護的）
    "topo_支合",               # 支合（リスク）
]

def get_birth_decade(d):
    try:
        year = int(d["birth_date"][:4])
        return (year // 10) * 10
    except:
        return None

def get_topology_names(d):
    topo = d.get("topology", [])
    return [t.get("name", "") for t in topo if isinstance(t, dict)]

def make_features(d):
    f = {}
    f["male"] = 1 if d.get("gender") == "male" else 0
    f["balance_moderate"] = 1 if d.get("balance_type") == "moderate" else 0
    f["balance_high"] = 1 if d.get("gogyo_balance", 0) >= 3 else 0
    f["has_abnormal"] = 1 if d.get("has_abnormal") else 0
    f["is_double_en"] = 1 if d.get("is_double_en") else 0
    f["day_element_土"] = 1 if d.get("day_element") == "土" else 0
    f["day_element_水"] = 1 if d.get("day_element") == "水" else 0
    f["weakest_水"] = 1 if "水" in d.get("weakest_gogyo", []) else 0
    f["weakest_金"] = 1 if "金" in d.get("weakest_gogyo", []) else 0
    f["tenchu_寅卯"] = 1 if d.get("tenchusatsu") == "寅卯" else 0
    f["center_司禄星"] = 1 if d.get("main_stars", {}).get("center") == "司禄星" else 0
    f["east_貫索星"] = 1 if d.get("main_stars", {}).get("east") == "貫索星" else 0
    topo_names = get_topology_names(d)
    f["topo_半会_木局"] = 1 if "半会（木局）" in topo_names else 0
    f["topo_生貴刑_南方刑"] = 1 if "生貴刑（南方刑）" in topo_names else 0
    f["topo_支合"] = 1 if "支合" in topo_names else 0
    return f

all_features = {id(d): make_features(d) for d in data}

# === Fisher正確検定 ===
def log_factorial(n):
    if n <= 1: return 0.0
    return sum(math.log(i) for i in range(2, n + 1))

def fisher_exact_p(a, b, c, d_val):
    n = a + b + c + d_val
    row1 = a + b; row2 = c + d_val
    col1 = a + c; col2 = b + d_val
    if row1 == 0 or row2 == 0 or col1 == 0 or col2 == 0: return 1.0
    log_denom = log_factorial(row1) + log_factorial(row2) + log_factorial(col1) + log_factorial(col2) - log_factorial(n)
    min_val = min(row1, col1)
    p_total = 0.0
    for i in range(min_val + 1):
        j = row1 - i; k = col1 - i; l = row2 - k
        if j < 0 or k < 0 or l < 0: continue
        log_p = log_factorial(i) + log_factorial(j) + log_factorial(k) + log_factorial(l) - log_denom
        p_val = math.exp(log_p)
        if i >= a: p_total += p_val
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

# === ロジスティック回帰 ===
def sigmoid(z):
    if z >= 0: return 1.0 / (1.0 + math.exp(-z))
    else: ez = math.exp(z); return ez / (1.0 + ez)

def matrix_inverse(M):
    n = len(M)
    aug = [row[:] + [1.0 if i == j else 0.0 for j in range(n)] for i, row in enumerate(M)]
    for col in range(n):
        max_row = col
        for r in range(col + 1, n):
            if abs(aug[r][col]) > abs(aug[max_row][col]): max_row = r
        aug[col], aug[max_row] = aug[max_row], aug[col]
        if abs(aug[col][col]) < 1e-12: raise ValueError("singular")
        pivot = aug[col][col]
        for j in range(2 * n): aug[col][j] /= pivot
        for r in range(n):
            if r == col: continue
            factor = aug[r][col]
            for j in range(2 * n): aug[r][j] -= factor * aug[col][j]
    return [[aug[i][n + j] for j in range(n)] for i in range(n)]

def logistic_regression(X, y, max_iter=200, tol=1e-6, l2=0.1):
    n = len(y); p = len(X[0])
    beta = [0.0] * p
    for iteration in range(max_iter):
        probs = [sigmoid(sum(beta[j] * X[i][j] for j in range(p))) for i in range(n)]
        grad = []
        for j in range(p):
            g = sum(X[i][j] * (y[i] - probs[i]) for i in range(n))
            if j > 0: g -= l2 * beta[j]
            grad.append(g)
        W = [probs[i] * (1 - probs[i]) for i in range(n)]
        H = [[0.0] * p for _ in range(p)]
        for j in range(p):
            for k in range(p):
                h_jk = -sum(X[i][j] * W[i] * X[i][k] for i in range(n))
                if j > 0 and j == k: h_jk -= l2
                H[j][k] = h_jk
        try: H_inv = matrix_inverse(H)
        except:
            for j in range(p): H[j][j] -= 1e-6
            try: H_inv = matrix_inverse(H)
            except: break
        delta = [sum(H_inv[j][k] * grad[k] for k in range(p)) for j in range(p)]
        beta_new = [beta[j] - delta[j] for j in range(p)]
        max_delta = max(abs(d) for d in delta)
        beta = beta_new
        if max_delta < tol: break
    return beta

def predict_proba(X, beta):
    return [sigmoid(sum(beta[j] * X[i][j] for j in range(len(beta)))) for i in range(len(X))]

def compute_auc(y_true, y_pred):
    pairs = list(zip(y_true, y_pred))
    pairs.sort(key=lambda x: -x[1])
    n_pos = sum(1 for y, _ in pairs if y == 1)
    n_neg = len(pairs) - n_pos
    if n_pos == 0 or n_neg == 0: return 0.5
    tp = 0; auc = 0.0
    for y, score in pairs:
        if y == 1: tp += 1
        else: auc += tp
    auc /= (n_pos * n_neg)
    return auc

def make_feature_vector(d, feature_keys):
    vec = [1.0]  # intercept
    for k in feature_keys:
        vec.append(float(all_features[id(d)].get(k, 0)))
    return vec

# === 分析実行 ===
def run_analysis(cases, controls, label):
    print(f"\n{'=' * 80}")
    print(f"【{label}】")
    print(f"  ケース: {len(cases)}名 vs コントロール: {len(controls)}名")
    print(f"{'=' * 80}")

    # Fisher検定
    print(f"\n  --- Fisher正確検定 ---")
    fisher_results = []
    for key in SELECTED_FEATURES:
        case_has = sum(1 for d in cases if all_features[id(d)].get(key, 0) == 1)
        ctrl_has = sum(1 for d in controls if all_features[id(d)].get(key, 0) == 1)
        a = case_has; b = len(cases) - case_has
        c = ctrl_has; d_val = len(controls) - ctrl_has
        if a + b == 0 or c + d_val == 0 or a + c == 0 or b + d_val == 0: continue
        p_val = fisher_exact_p(a, b, c, d_val)
        case_rate = a / len(cases); ctrl_rate = c / len(controls)
        or_val = (a * d_val) / (b * c) if b > 0 and c > 0 else float('inf')
        fisher_results.append({"feature": key, "case_rate": case_rate, "ctrl_rate": ctrl_rate,
                               "OR": or_val, "p": p_val, "case_has": a, "ctrl_has": c})

    fisher_results.sort(key=lambda x: x["p"])
    p_values = [r["p"] for r in fisher_results]
    bh = benjamini_hochberg(p_values)

    sig_count = 0
    for i, r in enumerate(fisher_results):
        sig = "***" if r["p"] < 0.001 else "**" if r["p"] < 0.01 else "*" if r["p"] < 0.05 else ""
        if r["p"] < 0.10:
            sig_count += 1
            print(f"    {r['feature']}: OR={r['OR']:.2f} p={r['p']:.4f} {sig} "
                  f"(ケース{r['case_has']}/{len(cases)}={r['case_rate']:.1%} vs "
                  f"対照{r['ctrl_has']}/{len(controls)}={r['ctrl_rate']:.1%}) "
                  f"BH={bh[i]:.4f}")
    if sig_count == 0:
        print(f"    有意・傾向なし")

    # ロジスティック回帰
    print(f"\n  --- ロジスティック回帰（15変数+交絡因子, L2=0.1）---")
    all_data = cases + controls
    y = [1] * len(cases) + [0] * len(controls)
    X = [make_feature_vector(d, SELECTED_FEATURES) for d in all_data]
    beta = logistic_regression(X, y, l2=0.1)
    y_pred = predict_proba(X, beta)
    auc = compute_auc(y, y_pred)
    print(f"  モデルAUC: {auc:.4f}")

    p_features = len(X[0])
    probs = [sigmoid(sum(beta[j] * X[i][j] for j in range(p_features))) for i in range(len(y))]
    W = [probs[i] * (1 - probs[i]) for i in range(len(y))]

    log_results = []
    for j in range(1, p_features):
        se_sq = 1.0 / (sum(W[i] * X[i][j] ** 2 for i in range(len(y))) + 0.1)
        se = math.sqrt(se_sq)
        z = beta[j] / se if se > 0 else 0
        p_val = 2 * (1 - 0.5 * (1 + math.erf(abs(z) / math.sqrt(2))))
        or_val = math.exp(beta[j])
        ci_low = math.exp(beta[j] - 1.96 * se)
        ci_high = math.exp(beta[j] + 1.96 * se)
        log_results.append({"feature": SELECTED_FEATURES[j - 1], "OR": or_val,
                           "CI_low": ci_low, "CI_high": ci_high, "p": p_val, "beta": beta[j]})

    log_results.sort(key=lambda x: x["p"])
    for r in log_results:
        sig = "***" if r["p"] < 0.001 else "**" if r["p"] < 0.01 else "*" if r["p"] < 0.05 else ""
        if r["p"] < 0.10:
            print(f"    {r['feature']}: OR={r['OR']:.2f} [95%CI: {r['CI_low']:.2f}-{r['CI_high']:.2f}] p={r['p']:.4f} {sig}")

    # 現在のスコア評価
    print(f"\n  --- 現在のスコア予測精度 ---")
    affair_scores = [d["affair_score"] for d in all_data]
    marriage_scores = [-d["marriage_score"] for d in all_data]
    auc_affair = compute_auc(y, affair_scores)
    auc_marriage = compute_auc(y, marriage_scores)
    print(f"  affair_score AUC: {auc_affair:.4f}")
    print(f"  marriage_score AUC（逆転）: {auc_marriage:.4f}")

    case_affair = [d["affair_score"] for d in cases]
    ctrl_affair = [d["affair_score"] for d in controls]
    print(f"  affair_score平均: ケース={sum(case_affair)/len(case_affair):.1f} vs 対照={sum(ctrl_affair)/len(ctrl_affair):.1f}")

    return fisher_results, log_results, auc, auc_affair, auc_marriage

# 3つの分析を実行
f1, l1, auc1, aa1, am1 = run_analysis(affair_cases, controls, "不倫ケース vs 対照")
f2, l2, auc2, aa2, am2 = run_analysis(divorce_cases, controls, "離婚ケース vs 対照")
f3, l3, auc3, aa3, am3 = run_analysis(affair_cases + divorce_cases, controls, "総合ケース vs 対照")

# === 総合まとめ ===
print(f"\n{'=' * 80}")
print(f"【総合まとめ】")
print(f"{'=' * 80}")

print(f"\n1. モデルAUC（15変数絞り）:")
print(f"   不倫 vs 対照: {auc1:.4f}")
print(f"   離婚 vs 対照: {auc2:.4f}")
print(f"   総合 vs 対照: {auc3:.4f}")

print(f"\n2. 現在のスコアAUC:")
print(f"   {'分析':<20} {'affair_AUC':>12} {'marriage_AUC':>14}")
print(f"   {'-' * 46}")
print(f"   {'不倫 vs 対照':<18} {aa1:>12.4f} {am1:>14.4f}")
print(f"   {'離婚 vs 対照':<18} {aa2:>12.4f} {am2:>14.4f}")
print(f"   {'総合 vs 対照':<18} {aa3:>12.4f} {am3:>14.4f}")

print(f"\n3. ロジスティック回帰 有意要素 (p<0.05):")
for label, log_res in [("不倫", l1), ("離婚", l2), ("総合", l3)]:
    sig = [r for r in log_res if r["p"] < 0.05]
    if sig:
        print(f"   {label}:")
        for r in sig:
            direction = "リスク" if r["OR"] > 1 else "保護"
            print(f"     {r['feature']}: OR={r['OR']:.2f} p={r['p']:.4f} ({direction})")
    else:
        print(f"   {label}: 有意要素なし")

print(f"\n4. Fisher検定 有意要素 (p<0.05):")
for label, fisher_res in [("不倫", f1), ("離婚", f2), ("総合", f3)]:
    sig = [r for r in fisher_res if r["p"] < 0.05]
    if sig:
        print(f"   {label}:")
        for r in sig:
            direction = "リスク" if r["OR"] > 1 else "保護"
            print(f"     {r['feature']}: OR={r['OR']:.2f} p={r['p']:.4f} ({direction})")
    else:
        print(f"   {label}: 有意要素なし")

# 結論
print(f"\n5. 結論と推奨事項:")
if auc3 > 0.7:
    print(f"   ✅ 絞り込みモデルは良好な予測力 (AUC={auc3:.2f})")
elif auc3 > 0.6:
    print(f"   △ 絞り込みモデルは中程度の予測力 (AUC={auc3:.2f})")
else:
    print(f"   ❌ 絞り込みモデルも予測力不十分 (AUC={auc3:.2f})")

# app.js改善のための推奨重み
print(f"\n6. app.js改善のための推奨重み（総合ケースより）:")
print(f"   リスク因子（スコア加算）:")
for r in l3:
    if r["p"] < 0.05 and r["OR"] > 1:
        weight = min(20, math.log(r["OR"]) * 5)
        print(f"     {r['feature']}: +{weight:.1f}点 (OR={r['OR']:.2f})")
print(f"   保護因子（スコア減算）:")
for r in l3:
    if r["p"] < 0.05 and r["OR"] < 1:
        weight = min(20, -math.log(r["OR"]) * 5)
        print(f"     {r['feature']}: -{weight:.1f}点 (OR={r['OR']:.2f})")

output_path = os.path.join(BASE_DIR, "marriage_analysis_reduced.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(_output_lines))
print(f"\n出力: {output_path}")
