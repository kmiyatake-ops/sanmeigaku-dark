# -*- coding: utf-8 -*-
"""
ロジスティック回帰による多変量解析
交絡因子（性別、出生年代）を調整した上で、
算命学要素と疾患の関連性を評価する。

モデル1: 全ケース vs コントロール（性別・出生年代調整）
モデル2: 病気カテゴリ別 vs コントロール（性別・出生年代調整）
モデル3: 全ケース vs コントロール（性別・出生年代 + 有意な算命学要素を同時投入）
"""

import json
import os
import sys
import math
from collections import Counter, defaultdict

# === 出力用 ===
_output_lines = []
def print(*args, **kwargs):
    _output_lines.append(" ".join(str(a) for a in args))

# === データ読み込み ===
BASE_DIR = os.path.dirname(__file__)
input_path = os.path.join(BASE_DIR, "celebrity_sanmeigaku_results.json")
with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

data = [d for d in data if "error" not in d]

cases = [d for d in data if d.get("group", "case") == "case"]
controls = [d for d in data if d.get("group", "case") == "control"]

print("=" * 80)
print("ロジスティック回帰による多変量解析")
print("交絡因子: 性別、出生年代")
print("=" * 80)
print(f"総対象者数: {len(data)}名")
print(f"ケース群: {len(cases)}名")
print(f"コントロール群: {len(controls)}名")
print()

# === 病気カテゴリ分類 ===
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

# === 特徴量エンジニアリング ===

def get_birth_decade(d):
    try:
        year = int(d["birth_date"][:4])
        return (year // 10) * 10
    except:
        return None

def get_gender_code(d):
    return 1 if d.get("gender") == "male" else 0

# 交絡因子のダミー変数
all_decades = sorted(set(get_birth_decade(d) for d in data if get_birth_decade(d) is not None))
decade_reference = all_decades[len(all_decades) // 2]  # 中央の年代を参照カテゴリに

print(f"出生年代の参照カテゴリ: {decade_reference}年代")
print(f"出生年代一覧: {all_decades}")
print()

def make_confounder_features(d):
    """性別と出生年代のダミー変数を作成"""
    features = {}
    features["male"] = get_gender_code(d)
    decade = get_birth_decade(d)
    for dec in all_decades:
        if dec == decade_reference:
            continue
        features[f"decade_{dec}"] = 1 if decade == dec else 0
    return features

# 算命学特徴量の抽出
star_list = ["貫索星", "石門星", "司禄星", "禄存星", "牽牛星", "車騎星", "玉堂星", "龍高星", "調舒星", "鳳閣星"]
gogyo_list = ["木", "火", "土", "金", "水"]
tenchu_list = ["子丑", "寅卯", "辰巳", "午未", "申酉", "戌亥"]

def get_topology_names(d):
    topo = d.get("topology", [])
    return [t.get("name", "") for t in topo if isinstance(t, dict)]

all_topo_names = set()
for d in data:
    all_topo_names.update(get_topology_names(d))

def make_sanmeigaku_features(d):
    """算命学要素のバイナリ特徴量を作成"""
    features = {}

    # 五行過剰・欠乏
    for g in gogyo_list:
        features[f"strongest_{g}"] = 1 if g in d.get("strongest_gogyo", []) else 0
        features[f"weakest_{g}"] = 1 if g in d.get("weakest_gogyo", []) else 0

    # 日干陰陽
    features["day_yin"] = 1 if d.get("day_yin_yang") == "陰" else 0
    features["day_yang"] = 1 if d.get("day_yin_yang") == "陽" else 0

    # 日干五行
    for g in gogyo_list:
        features[f"day_element_{g}"] = 1 if d.get("day_element") == g else 0

    # 中央星
    for s in star_list:
        features[f"center_{s}"] = 1 if d.get("main_stars", {}).get("center") == s else 0

    # 方位星
    for pos in ["north", "south", "east", "west"]:
        for s in star_list:
            features[f"{pos}_{s}"] = 1 if d.get("main_stars", {}).get(pos) == s else 0

    # 宿命天中殺
    for t in tenchu_list:
        features[f"tenchu_{t}"] = 1 if d.get("tenchusatsu") == t else 0

    # 五行バランス度
    features["balance_high"] = 1 if d.get("gogyo_balance", 0) >= 3 else 0
    features["balance_low"] = 1 if d.get("gogyo_balance", 0) <= 1 else 0

    # バランスタイプ
    features["balance_balanced"] = 1 if d.get("balance_type") == "balanced" else 0
    features["balance_moderate"] = 1 if d.get("balance_type") == "moderate" else 0
    features["balance_imbalanced"] = 1 if d.get("balance_type") == "imbalanced" else 0

    # 位相法
    topo_names = get_topology_names(d)
    for tn in all_topo_names:
        if tn:
            features[f"topo_{tn}"] = 1 if tn in topo_names else 0

    return features

# 全特徴量リスト
confounder_keys = list(make_confounder_features(data[0]).keys())
sanmeigaku_keys = list(make_sanmeigaku_features(data[0]).keys())

print(f"交絡因子特徴量数: {len(confounder_keys)}")
print(f"算命学特徴量数: {len(sanmeigaku_keys)}")
print()

# === ロジスティック回帰の実装（ニュートン・ラプソン法） ===

def sigmoid(z):
    if z >= 0:
        return 1.0 / (1.0 + math.exp(-z))
    else:
        ez = math.exp(z)
        return ez / (1.0 + ez)

def logistic_regression(X, y, max_iter=100, tol=1e-6, l2=0.01):
    """
    ロジスティック回帰（ニュートン・ラプソン法 + L2正則化）
    X: list of lists (特徴量ベクトル、切片含む)
    y: list of 0/1
    戻り値: (係数, 収束情報)
    """
    n = len(y)
    p_features = len(X[0])

    # 初期値 = 0
    beta = [0.0] * p_features

    for iteration in range(max_iter):
        # p_i = sigmoid(beta . x_i)
        p = [sigmoid(sum(beta[j] * X[i][j] for j in range(p_features))) for i in range(n)]

        # 勾配: X^T (y - p) - l2 * beta
        grad = []
        for j in range(p_features):
            g = sum(X[i][j] * (y[i] - p[i]) for i in range(n))
            if j > 0:  # 切片以外に正則化
                g -= l2 * beta[j]
            grad.append(g)

        # ヘッセ行列: -X^T diag(p(1-p)) X - l2 * I
        # W = p_i * (1 - p_i)
        W = [p[i] * (1 - p[i]) for i in range(n)]

        # ヘッセ行列の計算
        H = [[0.0] * p_features for _ in range(p_features)]
        for j in range(p_features):
            for k in range(p_features):
                h_jk = -sum(X[i][j] * W[i] * X[i][k] for i in range(n))
                if j > 0 and j == k:  # 切片以外に正則化
                    h_jk -= l2
                H[j][k] = h_jk

        # ヘッセ行列の逆行列（ガウス消去法）
        try:
            H_inv = matrix_inverse(H)
        except:
            # 特異行列の場合、微小な値を加える
            for j in range(p_features):
                H[j][j] -= 1e-8
            try:
                H_inv = matrix_inverse(H)
            except:
                break

        # 更新: beta -= H^{-1} grad
        delta = [sum(H_inv[j][k] * grad[k] for k in range(p_features)) for j in range(p_features)]
        beta_new = [beta[j] - delta[j] for j in range(p_features)]

        # 収束判定
        max_delta = max(abs(d) for d in delta)
        beta = beta_new
        if max_delta < tol:
            break

    # 標準誤差の計算
    p = [sigmoid(sum(beta[j] * X[i][j] for j in range(p_features))) for i in range(n)]
    W = [p[i] * (1 - p[i]) for i in range(n)]

    # Fisher情報行列の逆行列 = ヘッセ行列の逆行列
    H_final = [[0.0] * p_features for _ in range(p_features)]
    for j in range(p_features):
        for k in range(p_features):
            h_jk = -sum(X[i][j] * W[i] * X[i][k] for i in range(n))
            if j > 0 and j == k:
                h_jk -= l2
            H_final[j][k] = h_jk

    try:
        H_inv_final = matrix_inverse(H_final)
        se = [math.sqrt(-H_inv_final[j][j]) if H_inv_final[j][j] < 0 else float('nan') for j in range(p_features)]
    except:
        se = [float('nan')] * p_features

    return beta, se, iteration + 1

def matrix_inverse(M):
    """ガウス消去法による逆行列計算"""
    n = len(M)
    # 拡大行列 [M | I]
    aug = [row[:] + [1.0 if i == j else 0.0 for j in range(n)] for i, row in enumerate(M)]

    for col in range(n):
        # ピボット選択
        max_row = col
        for r in range(col + 1, n):
            if abs(aug[r][col]) > abs(aug[max_row][col]):
                max_row = r
        aug[col], aug[max_row] = aug[max_row], aug[col]

        if abs(aug[col][col]) < 1e-12:
            raise ValueError("特異行列")

        # ピボットを1に
        pivot = aug[col][col]
        for j in range(2 * n):
            aug[col][j] /= pivot

        # 他の行を消去
        for r in range(n):
            if r == col:
                continue
            factor = aug[r][col]
            for j in range(2 * n):
                aug[r][j] -= factor * aug[col][j]

    return [[aug[i][n + j] for j in range(n)] for i in range(n)]

def z_score_to_p(z):
    """標準正規分布の両側p値"""
    if math.isnan(z) or math.isinf(z):
        return 1.0
    abs_z = abs(z)
    # 近似: erfc
    p = math.erfc(abs_z / math.sqrt(2))
    return p

def benjamini_hochberg(p_values):
    m = len(p_values)
    if m == 0:
        return []
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

def bonferroni_correction(p_values):
    m = len(p_values)
    return [min(p * m, 1.0) for p in p_values]

# === モデル1: 全ケース vs コントロール（交絡因子のみ） ===
print("=" * 80)
print("【モデル1: 交絡因子のみ（ベースラインモデル）】")
print("  従属変数: case=1, control=0")
print("  独立変数: 性別、出生年代")
print("=" * 80)

y_all = [1] * len(cases) + [0] * len(controls)
X_all_base = []
for d in cases + controls:
    cf = make_confounder_features(d)
    X_all_base.append([1.0] + [float(cf[k]) for k in confounder_keys])

beta_base, se_base, iter_base = logistic_regression(X_all_base, y_all, l2=0.01)

print(f"  反復回数: {iter_base}")
print(f"  切片(β0): {beta_base[0]:.4f} (SE={se_base[0]:.4f})")
for i, key in enumerate(confounder_keys):
    z = beta_base[i + 1] / se_base[i + 1] if se_base[i + 1] > 0 else 0
    p = z_score_to_p(z)
    print(f"  {key}: β={beta_base[i + 1]:.4f} (SE={se_base[i + 1]:.4f}, z={z:.2f}, p={p:.4f})")

# ベースラインモデルの対数尤度
def log_likelihood(X, y, beta):
    n = len(y)
    ll = 0.0
    for i in range(n):
        p = sigmoid(sum(beta[j] * X[i][j] for j in range(len(beta))))
        if y[i] == 1:
            ll += math.log(max(p, 1e-15))
        else:
            ll += math.log(max(1 - p, 1e-15))
    return ll

ll_base = log_likelihood(X_all_base, y_all, beta_base)
print(f"  対数尤度: {ll_base:.2f}")
print()

# === モデル2: 各算命学要素を個別に追加（交絡因子調整後） ===
print("=" * 80)
print("【モデル2: 各算命学要素の個別ロジスティック回帰（交絡因子調整）】")
print("  各算命学要素について、交絡因子（性別・出生年代）+ 当該要素のモデルを適合")
print("  オッズ比(OR) = exp(β)、p値はWald検定")
print("=" * 80)

# 特徴量の準備
all_features = {}
for d in cases + controls:
    sf = make_sanmeigaku_features(d)
    cf = make_confounder_features(d)
    all_features[id(d)] = {**cf, **sf}

# 各算命学要素について個別に回帰
univariate_results = []

for feat_key in sanmeigaku_keys:
    # 完全分離を避けるため、ケース・コントロール両方に存在する特徴量のみ
    case_vals = [all_features[id(d)][feat_key] for d in cases]
    ctrl_vals = [all_features[id(d)][feat_key] for d in controls]

    if sum(case_vals) == 0 and sum(ctrl_vals) == 0:
        continue
    if sum(case_vals) == len(cases) or sum(ctrl_vals) == len(controls):
        continue  # 完全分離

    # 特徴量ベクトル構築: [切片, 交絡因子..., 当該要素]
    X = []
    y = []
    for d in cases + controls:
        cf = make_confounder_features(d)
        row = [1.0] + [float(cf[k]) for k in confounder_keys]
        row.append(float(all_features[id(d)][feat_key]))
        X.append(row)
        y.append(1 if d.get("group", "case") == "case" else 0)

    try:
        beta, se, n_iter = logistic_regression(X, y, l2=0.01)
        feat_idx = len(beta) - 1
        coef = beta[feat_idx]
        std_err = se[feat_idx]

        if std_err > 0 and not math.isnan(std_err):
            z = coef / std_err
            p_val = z_score_to_p(z)
            or_val = math.exp(coef)
            ci_lower = math.exp(coef - 1.96 * std_err)
            ci_upper = math.exp(coef + 1.96 * std_err)

            univariate_results.append({
                "feature": feat_key,
                "coef": coef,
                "se": std_err,
                "z": z,
                "p": p_val,
                "OR": or_val,
                "CI_lower": ci_lower,
                "CI_upper": ci_upper,
                "n_case_pos": sum(case_vals),
                "n_case_neg": len(cases) - sum(case_vals),
                "n_ctrl_pos": sum(ctrl_vals),
                "n_ctrl_neg": len(controls) - sum(ctrl_vals),
            })
    except Exception as e:
        pass

# p値でソート
univariate_results.sort(key=lambda x: x["p"])

# BH補正
p_values = [r["p"] for r in univariate_results]
bh_adj = benjamini_hochberg(p_values)
bf_adj = bonferroni_correction(p_values)
for i, r in enumerate(univariate_results):
    r["p_bh"] = bh_adj[i]
    r["p_bf"] = bf_adj[i]

# 有意な結果を出力（p < 0.05）
sig_results = [r for r in univariate_results if r["p"] < 0.05]
print(f"\n有意な算命学要素（p < 0.05、補正前）: {len(sig_results)} / {len(univariate_results)}")
print()
print(f"{'特徴量':<30} {'OR':>8} {'95%CI':>20} {'β':>8} {'SE':>6} {'z':>6} {'p':>8} {'p(BH)':>8} {'p(BF)':>8} {'ケース+':>7} {'対照+':>6}")
print("-" * 140)

for r in sig_results:
    sig_mark = " **" if r["p_bh"] < 0.05 else (" *" if r["p_bf"] < 0.05 else "")
    ci_str = f"[{r['CI_lower']:.2f}-{r['CI_upper']:.2f}]"
    print(f"{r['feature']:<30} {r['OR']:>8.2f} {ci_str:>20} {r['coef']:>8.3f} {r['se']:>6.3f} {r['z']:>6.2f} {r['p']:>8.4f} {r['p_bh']:>8.4f} {r['p_bf']:>8.4f}{sig_mark} {r['n_case_pos']:>5}/{len(cases)} {r['n_ctrl_pos']:>4}/{len(controls)}")

print(f"\n(*: Bonferroni補正後p<0.05, **: BH補正後p<0.05)")

# 傾向あり（p < 0.10）
trend_results = [r for r in univariate_results if 0.05 <= r["p"] < 0.10]
print(f"\n傾向あり（0.05 ≤ p < 0.10）: {len(trend_results)}件")
print(f"{'特徴量':<30} {'OR':>8} {'95%CI':>20} {'p':>8} {'p(BH)':>8}")
print("-" * 80)
for r in trend_results:
    ci_str = f"[{r['CI_lower']:.2f}-{r['CI_upper']:.2f}]"
    print(f"{r['feature']:<30} {r['OR']:>8.2f} {ci_str:>20} {r['p']:>8.4f} {r['p_bh']:>8.4f}")

print()

# === モデル3: 病気カテゴリ別の個別ロジスティック回帰 ===
print("=" * 80)
print("【モデル3: 病気カテゴリ別 vs コントロール（交絡因子調整）】")
print("=" * 80)

target_disease_groups = [g for g in disease_groups.keys() if disease_groups[g] >= 5]

disease_lr_results = []

for dg in target_disease_groups:
    group_cases = [d for d in cases if d["disease_group"] == dg]
    n_group = len(group_cases)

    print(f"\n--- {dg} vs Control (n={n_group}) ---")

    for feat_key in sanmeigaku_keys:
        case_vals = [all_features[id(d)][feat_key] for d in group_cases]
        ctrl_vals = [all_features[id(d)][feat_key] for d in controls]

        if sum(case_vals) == 0 and sum(ctrl_vals) == 0:
            continue
        if sum(case_vals) == len(group_cases) or sum(ctrl_vals) == len(controls):
            continue

        X = []
        y = []
        for d in group_cases + controls:
            cf = make_confounder_features(d)
            row = [1.0] + [float(cf[k]) for k in confounder_keys]
            row.append(float(all_features[id(d)][feat_key]))
            X.append(row)
            y.append(1 if d in group_cases else 0)

        try:
            beta, se, n_iter = logistic_regression(X, y, l2=0.01)
            feat_idx = len(beta) - 1
            coef = beta[feat_idx]
            std_err = se[feat_idx]

            if std_err > 0 and not math.isnan(std_err):
                z = coef / std_err
                p_val = z_score_to_p(z)
                or_val = math.exp(coef)
                ci_lower = math.exp(coef - 1.96 * std_err)
                ci_upper = math.exp(coef + 1.96 * std_err)

                disease_lr_results.append({
                    "disease": dg,
                    "feature": feat_key,
                    "coef": coef,
                    "se": std_err,
                    "z": z,
                    "p": p_val,
                    "OR": or_val,
                    "CI_lower": ci_lower,
                    "CI_upper": ci_upper,
                    "n_case_pos": sum(case_vals),
                    "n_case": n_group,
                    "n_ctrl_pos": sum(ctrl_vals),
                    "n_ctrl": len(controls),
                })
        except:
            pass

# p値でソート
disease_lr_results.sort(key=lambda x: x["p"])

# BH補正（病気カテゴリ別全体で）
p_values_disease = [r["p"] for r in disease_lr_results]
bh_adj_d = benjamini_hochberg(p_values_disease)
bf_adj_d = bonferroni_correction(p_values_disease)
for i, r in enumerate(disease_lr_results):
    r["p_bh"] = bh_adj_d[i]
    r["p_bf"] = bf_adj_d[i]

# 有意な結果
disease_sig = [r for r in disease_lr_results if r["p"] < 0.05]
print(f"\n\n有意な相関（p < 0.05、補正前）: {len(disease_sig)} / {len(disease_lr_results)}")
print()
print(f"{'病気':<25} {'特徴量':<30} {'OR':>8} {'95%CI':>20} {'p':>8} {'p(BH)':>8} {'ケース+':>8} {'対照+':>7}")
print("-" * 140)

for r in disease_sig:
    sig_mark = " **" if r["p_bh"] < 0.05 else (" *" if r["p_bf"] < 0.05 else "")
    ci_str = f"[{r['CI_lower']:.2f}-{r['CI_upper']:.2f}]"
    print(f"{r['disease']:<25} {r['feature']:<30} {r['OR']:>8.2f} {ci_str:>20} {r['p']:>8.4f} {r['p_bh']:>8.4f}{sig_mark} {r['n_case_pos']:>5}/{r['n_case']} {r['n_ctrl_pos']:>4}/{r['n_ctrl']}")

print(f"\n(*: Bonferroni補正後p<0.05, **: BH補正後p<0.05)")

# 病気カテゴリ別の傾向
disease_trend = [r for r in disease_lr_results if 0.05 <= r["p"] < 0.10]
if disease_trend:
    print(f"\n傾向あり（0.05 ≤ p < 0.10）: {len(disease_trend)}件")
    print(f"{'病気':<25} {'特徴量':<30} {'OR':>8} {'p':>8} {'p(BH)':>8}")
    print("-" * 90)
    for r in disease_trend:
        print(f"{r['disease']:<25} {r['feature']:<30} {r['OR']:>8.2f} {r['p']:>8.4f} {r['p_bh']:>8.4f}")

print()

# === モデル4: 多変量モデル（有意な要素を同時投入） ===
print("=" * 80)
print("【モデル4: 多変量ロジスティック回帰（有意な要素を同時投入）】")
print("  Fisher検定でp<0.05だった上位要素を同時にモデルに投入")
print("=" * 80)

# 全体比較でp<0.05だった上位5要素を選択
top_features = [r["feature"] for r in univariate_results if r["p"] < 0.05][:10]

if len(top_features) >= 2:
    print(f"  投入要素: {top_features}")

    X_multi = []
    y_multi = []
    for d in cases + controls:
        cf = make_confounder_features(d)
        row = [1.0] + [float(cf[k]) for k in confounder_keys]
        for feat_key in top_features:
            row.append(float(all_features[id(d)][feat_key]))
        X_multi.append(row)
        y_multi.append(1 if d.get("group", "case") == "case" else 0)

    try:
        beta_multi, se_multi, iter_multi = logistic_regression(X_multi, y_multi, l2=0.05)

        ll_multi = log_likelihood(X_multi, y_multi, beta_multi)

        # 尤度比検定（ベースライン vs 多変量）
        lr_stat = 2 * (ll_multi - ll_base)
        df = len(top_features)
        # カイ二乗分布のp値（近似）
        from math import lgamma
        def chi2_sf(x, df):
            """カイ二乗分布の上側確率（近似）"""
            if x <= 0:
                return 1.0
            if df == 2:
                return math.exp(-x / 2)
            # Wilson-Hilferty近似
            z = ((x / df) ** (1/3) - (1 - 2/(9*df))) / math.sqrt(2/(9*df))
            return z_score_to_p(z) / 2  # 片側

        p_lr = chi2_sf(lr_stat, df)

        print(f"\n  反復回数: {iter_multi}")
        print(f"  対数尤度: {ll_multi:.2f} (ベースライン: {ll_base:.2f})")
        print(f"  尤度比検定: χ²={lr_stat:.2f}, df={df}, p={p_lr:.4f}")
        print()

        print(f"  {'変数':<30} {'β':>8} {'SE':>6} {'z':>6} {'p':>8} {'OR':>8} {'95%CI':>20}")
        print("  " + "-" * 100)

        all_var_names = ["切片"] + confounder_keys + top_features
        for i, name in enumerate(all_var_names):
            z = beta_multi[i] / se_multi[i] if se_multi[i] > 0 else 0
            p = z_score_to_p(z)
            or_val = math.exp(beta_multi[i]) if i > 0 else None
            if or_val:
                ci_l = math.exp(beta_multi[i] - 1.96 * se_multi[i])
                ci_u = math.exp(beta_multi[i] + 1.96 * se_multi[i])
                ci_str = f"[{ci_l:.2f}-{ci_u:.2f}]"
                print(f"  {name:<30} {beta_multi[i]:>8.3f} {se_multi[i]:>6.3f} {z:>6.2f} {p:>8.4f} {or_val:>8.2f} {ci_str:>20}")
            else:
                print(f"  {name:<30} {beta_multi[i]:>8.3f} {se_multi[i]:>6.3f} {z:>6.2f} {p:>8.4f}")

        # Pseudo R² (Nagelkerke)
        ll_null = ll_base
        n = len(y_multi)
        cox_snell = 1 - math.exp(2 * (ll_null - ll_multi) / n)
        max_r2 = 1 - math.exp(2 * ll_null / n)
        nagelkerke = cox_snell / max_r2 if max_r2 > 0 else 0
        print(f"\n  Pseudo R² (Nagelkerke): {nagelkerke:.4f}")
        print(f"  Pseudo R² (Cox-Snell): {cox_snell:.4f}")

    except Exception as e:
        print(f"  エラー: {e}")
else:
    print("  有意な要素が2つ未満のため、多変量モデルはスキップ")

print()

# === サマリー ===
print("=" * 80)
print("【総合サマリー】")
print("=" * 80)
print(f"  総検定数（全体比較）: {len(univariate_results)}")
print(f"  総検定数（病気カテゴリ別）: {len(disease_lr_results)}")
print(f"  p < 0.05 (補正前・全体): {len(sig_results)}")
print(f"  p < 0.05 (補正前・病気別): {len(disease_sig)}")
print(f"  p < 0.05 (BH補正後・全体): {len([r for r in univariate_results if r['p_bh'] < 0.05])}")
print(f"  p < 0.05 (BH補正後・病気別): {len([r for r in disease_lr_results if r['p_bh'] < 0.05])}")
print(f"  p < 0.05 (BF補正後・全体): {len([r for r in univariate_results if r['p_bf'] < 0.05])}")
print(f"  p < 0.05 (BF補正後・病気別): {len([r for r in disease_lr_results if r['p_bf'] < 0.05])}")
print()

# トップ10知見（p値順、全体比較）
print("全体比較 トップ10（補正前p値順）:")
print(f"  {'特徴量':<30} {'OR':>8} {'95%CI':>20} {'p':>8} {'p(BH)':>8}")
print("  " + "-" * 80)
for r in univariate_results[:10]:
    ci_str = f"[{r['CI_lower']:.2f}-{r['CI_upper']:.2f}]"
    print(f"  {r['feature']:<30} {r['OR']:>8.2f} {ci_str:>20} {r['p']:>8.4f} {r['p_bh']:>8.4f}")

print()

# 病気カテゴリ別トップ10
print("病気カテゴリ別 トップ10（補正前p値順）:")
print(f"  {'病気':<25} {'特徴量':<30} {'OR':>8} {'p':>8} {'p(BH)':>8}")
print("  " + "-" * 90)
for r in disease_lr_results[:10]:
    print(f"  {r['disease']:<25} {r['feature']:<30} {r['OR']:>8.2f} {r['p']:>8.4f} {r['p_bh']:>8.4f}")

print()
print("※ロジスティック回帰により性別・出生年代の交絡を調整したオッズ比(OR)を算出。")
print("※L2正則化(λ=0.01)を適用し、完全分離を防止。")
print("※Wald検定によるp値、BH法・Bonferroni法による多重比較補正を実施。")

# Write output
output_path = os.path.join(BASE_DIR, "logistic_regression_results.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(_output_lines))
sys.stdout.write(f"Results written to {output_path}\n")
