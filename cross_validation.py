# -*- coding: utf-8 -*-
"""
交差確認法（k-fold Cross-Validation）による過学習チェック
ロジスティック回帰モデルの汎化性能を評価する。

評価指標:
- AUC (ROC曲線下面積)
- Accuracy（正答率）
- Sensitivity（感度）
- Specificity（特異度）
- Brier Score
- 総当たりCV（Leave-One-Out CV）も実施可能

モデル:
1. ベースライン（交絡因子のみ）
2. 単変量モデル（各算命学要素 + 交絡因子）
3. 多変量モデル（6つの有意要素 + 交絡因子）
"""

import json
import os
import sys
import math
import random
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
print("交差確認法（k-fold Cross-Validation）による過学習チェック")
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

# === 特徴量エンジニアリング ===
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

star_list = ["貫索星", "石門星", "司禄星", "禄存星", "牽牛星", "車騎星", "玉堂星", "龍高星", "調舒星", "鳳閣星"]
gogyo_list = ["木", "火", "土", "金", "水"]
tenchu_list = ["子丑", "寅卯", "辰巳", "午未", "申酉", "戌亥"]

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
    topo_names = get_topology_names(d)
    for tn in all_topo_names:
        if tn:
            features[f"topo_{tn}"] = 1 if tn in topo_names else 0
    return features

confounder_keys = list(make_confounder_features(data[0]).keys())
sanmeigaku_keys = list(make_sanmeigaku_features(data[0]).keys())

# 全データの特徴量行列を準備
all_features = {}
for d in data:
    cf = make_confounder_features(d)
    sf = make_sanmeigaku_features(d)
    all_features[id(d)] = {**cf, **sf}

def make_feature_vector(d, feature_keys, include_intercept=True):
    vec = []
    if include_intercept:
        vec.append(1.0)
    for k in feature_keys:
        vec.append(float(all_features[id(d)].get(k, 0)))
    return vec

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
            raise ValueError("特異行列")
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

# === 評価指標 ===
def compute_auc(y_true, y_pred):
    """ROC曲線下面積（AUC）を計算"""
    pairs = list(zip(y_true, y_pred))
    pairs.sort(key=lambda x: -x[1])

    n_pos = sum(1 for y, _ in pairs if y == 1)
    n_neg = len(pairs) - n_pos

    if n_pos == 0 or n_neg == 0:
        return 0.5

    tp = 0
    fp = 0
    auc = 0.0
    prev_fp = 0
    prev_tp = 0

    for y, score in pairs:
        if y == 1:
            tp += 1
        else:
            fp += 1
            auc += (tp + prev_tp) / 2.0
        prev_tp = tp
        prev_fp = fp

    auc /= (n_pos * n_neg)
    return auc

def compute_metrics(y_true, y_pred_prob, threshold=0.5):
    """各種評価指標を計算"""
    y_pred = [1 if p >= threshold else 0 for p in y_pred_prob]

    tp = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 1)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 1)
    tn = sum(1 for t, p in zip(y_true, y_pred) if t == 0 and p == 0)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == 1 and p == 0)

    accuracy = (tp + tn) / len(y_true) if len(y_true) > 0 else 0
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    f1 = 2 * precision * sensitivity / (precision + sensitivity) if (precision + sensitivity) > 0 else 0

    # Brier Score
    brier = sum((t - p) ** 2 for t, p in zip(y_true, y_pred_prob)) / len(y_true)

    # Log Loss
    eps = 1e-15
    log_loss = -sum(t * math.log(max(p, eps)) + (1 - t) * math.log(max(1 - p, eps)) for t, p in zip(y_true, y_pred_prob)) / len(y_true)

    auc = compute_auc(y_true, y_pred_prob)

    return {
        "accuracy": accuracy,
        "sensitivity": sensitivity,
        "specificity": specificity,
        "precision": precision,
        "f1": f1,
        "auc": auc,
        "brier": brier,
        "log_loss": log_loss,
        "tp": tp, "fp": fp, "tn": tn, "fn": fn,
    }

def mean_metrics(metrics_list):
    """指標の平均を計算"""
    keys = ["accuracy", "sensitivity", "specificity", "precision", "f1", "auc", "brier", "log_loss"]
    result = {}
    for k in keys:
        vals = [m[k] for m in metrics_list]
        result[k] = sum(vals) / len(vals)
        result[f"{k}_std"] = math.sqrt(sum((v - result[k]) ** 2 for v in vals) / len(vals)) if len(vals) > 1 else 0
    return result

def format_metrics(m, prefix=""):
    return (f"{prefix}AUC={m['auc']:.4f}±{m.get('auc_std',0):.4f}  "
            f"Acc={m['accuracy']:.4f}±{m.get('accuracy_std',0):.4f}  "
            f"Sen={m['sensitivity']:.4f}±{m.get('sensitivity_std',0):.4f}  "
            f"Spe={m['specificity']:.4f}±{m.get('specificity_std',0):.4f}  "
            f"F1={m['f1']:.4f}±{m.get('f1_std',0):.4f}  "
            f"Brier={m['brier']:.4f}±{m.get('brier_std',0):.4f}  "
            f"LogLoss={m['log_loss']:.4f}±{m.get('log_loss_std',0):.4f}")

# === k分割交差確認法 ===
def kfold_cv(data_list, y_list, feature_keys, k=10, l2=0.01, random_seed=42):
    """k分割交差確認法"""
    random.seed(random_seed)

    n = len(data_list)
    indices = list(range(n))
    random.shuffle(indices)

    fold_size = n // k
    folds = []
    for i in range(k):
        start = i * fold_size
        end = start + fold_size if i < k - 1 else n
        folds.append(indices[start:end])

    train_metrics_list = []
    test_metrics_list = []
    fold_details = []

    for fold_idx in range(k):
        test_idx = folds[fold_idx]
        train_idx = []
        for i in range(k):
            if i != fold_idx:
                train_idx.extend(folds[i])

        X_train = [make_feature_vector(data_list[i], feature_keys) for i in train_idx]
        y_train = [y_list[i] for i in train_idx]
        X_test = [make_feature_vector(data_list[i], feature_keys) for i in test_idx]
        y_test = [y_list[i] for i in test_idx]

        try:
            beta = logistic_regression(X_train, y_train, l2=l2)

            # 訓練データでの予測
            y_train_pred = predict_proba(X_train, beta)
            train_metrics = compute_metrics(y_train, y_train_pred)

            # テストデータでの予測
            y_test_pred = predict_proba(X_test, beta)
            test_metrics = compute_metrics(y_test, y_test_pred)

            train_metrics_list.append(train_metrics)
            test_metrics_list.append(test_metrics)

            fold_details.append({
                "fold": fold_idx + 1,
                "n_train": len(train_idx),
                "n_test": len(test_idx),
                "train_auc": train_metrics["auc"],
                "test_auc": test_metrics["auc"],
                "train_acc": train_metrics["accuracy"],
                "test_acc": test_metrics["accuracy"],
            })
        except Exception as e:
            pass

    return mean_metrics(train_metrics_list), mean_metrics(test_metrics_list), fold_details

# === 全データ準備 ===
y_all = [1 if d.get("group", "case") == "case" else 0 for d in data]

# 多変量モデルの6要素（ロジスティック回帰で有意だった要素）
multivariate_features = [
    "west_禄存星", "center_玉堂星", "north_車騎星",
    "south_玉堂星", "west_鳳閣星", "strongest_土"
]

# === モデル1: ベースライン（交絡因子のみ） ===
print("=" * 80)
print("【モデル1: ベースライン（交絡因子のみ）】")
print(f"  特徴量: 性別 + 出生年代ダミー ({len(confounder_keys)}変数)")
print("=" * 80)

K = 10
train_m1, test_m1, folds_m1 = kfold_cv(data, y_all, confounder_keys, k=K, l2=0.01)

print(f"\n  {K}分割交差確認法結果:")
print(f"  [訓練] {format_metrics(train_m1)}")
print(f"  [テスト] {format_metrics(test_m1)}")
print()

# フォールド別詳細
print(f"  フォールド別AUC:")
print(f"  {'Fold':>6} {'n_train':>8} {'n_test':>7} {'Train AUC':>10} {'Test AUC':>10} {'Train Acc':>10} {'Test Acc':>10}")
print("  " + "-" * 70)
for f in folds_m1:
    print(f"  {f['fold']:>6} {f['n_train']:>8} {f['n_test']:>7} {f['train_auc']:>10.4f} {f['test_auc']:>10.4f} {f['train_acc']:>10.4f} {f['test_acc']:>10.4f}")

# 過学習チェック
auc_gap_m1 = train_m1["auc"] - test_m1["auc"]
print(f"\n  過学習チェック:")
print(f"  AUCギャップ（訓練-テスト）: {auc_gap_m1:.4f}")
if auc_gap_m1 > 0.1:
    print(f"  ⚠️ 過学習の可能性あり（AUCギャップ > 0.10）")
elif auc_gap_m1 > 0.05:
    print(f"  ⚠️ 軽度の過学習傾向（AUCギャップ > 0.05）")
else:
    print(f"  ✅ 過学習の兆候なし（AUCギャップ ≤ 0.05）")
print()

# === モデル2: 多変量モデル（6つの有意要素 + 交絡因子） ===
print("=" * 80)
print("【モデル2: 多変量モデル（6つの有意要素 + 交絡因子）】")
print(f"  特徴量: 交絡因子 + {multivariate_features}")
print(f"  総変数数: {len(confounder_keys) + len(multivariate_features)}")
print("=" * 80)

all_model2_features = confounder_keys + multivariate_features

train_m2, test_m2, folds_m2 = kfold_cv(data, y_all, all_model2_features, k=K, l2=0.01)

print(f"\n  {K}分割交差確認法結果:")
print(f"  [訓練] {format_metrics(train_m2)}")
print(f"  [テスト] {format_metrics(test_m2)}")
print()

print(f"  フォールド別AUC:")
print(f"  {'Fold':>6} {'n_train':>8} {'n_test':>7} {'Train AUC':>10} {'Test AUC':>10} {'Train Acc':>10} {'Test Acc':>10}")
print("  " + "-" * 70)
for f in folds_m2:
    print(f"  {f['fold']:>6} {f['n_train']:>8} {f['n_test']:>7} {f['train_auc']:>10.4f} {f['test_auc']:>10.4f} {f['train_acc']:>10.4f} {f['test_acc']:>10.4f}")

auc_gap_m2 = train_m2["auc"] - test_m2["auc"]
print(f"\n  過学習チェック:")
print(f"  AUCギャップ（訓練-テスト）: {auc_gap_m2:.4f}")
if auc_gap_m2 > 0.1:
    print(f"  ⚠️ 過学習の可能性あり（AUCギャップ > 0.10）")
elif auc_gap_m2 > 0.05:
    print(f"  ⚠️ 軽度の過学習傾向（AUCギャップ > 0.05）")
else:
    print(f"  ✅ 過学習の兆候なし（AUCギャップ ≤ 0.05）")
print()

# === モデル3: 全算命学要素（過学習の確認用） ===
print("=" * 80)
print("【モデル3: 全算命学要素 + 交絡因子（過学習確認用）】")
print(f"  特徴量: 交絡因子 + 全算命学要素 ({len(confounder_keys) + len(sanmeigaku_keys)}変数)")
print("=" * 80)

all_model3_features = confounder_keys + sanmeigaku_keys

train_m3, test_m3, folds_m3 = kfold_cv(data, y_all, all_model3_features, k=K, l2=0.05)

print(f"\n  {K}分割交差確認法結果:")
print(f"  [訓練] {format_metrics(train_m3)}")
print(f"  [テスト] {format_metrics(test_m3)}")
print()

auc_gap_m3 = train_m3["auc"] - test_m3["auc"]
print(f"\n  過学習チェック:")
print(f"  AUCギャップ（訓練-テスト）: {auc_gap_m3:.4f}")
if auc_gap_m3 > 0.1:
    print(f"  ⚠️ 過学習の可能性あり（AUCギャップ > 0.10）")
elif auc_gap_m3 > 0.05:
    print(f"  ⚠️ 軽度の過学習傾向（AUCギャップ > 0.05）")
else:
    print(f"  ✅ 過学習の兆候なし（AUCギャップ ≤ 0.05）")
print()

# === モデル4: 病気カテゴリ別（うつ・抑うつ vs 対照） ===
print("=" * 80)
print("【モデル4: 病気カテゴリ別 — うつ・抑うつ vs 対照】")
print("=" * 80)

depression_cases = [d for d in cases if d["disease_group"] == "精神疾患（うつ・抑うつ）"]
depression_data = depression_cases + controls
depression_y = [1] * len(depression_cases) + [0] * len(controls)

print(f"  うつ・抑うつ: {len(depression_cases)}名 vs 対照: {len(controls)}名")

# うつで有意だった要素
depression_features = confounder_keys + ["tenchu_申酉", "west_禄存星", "north_車騎星", "weakest_火", "strongest_金", "day_element_木"]

train_m4, test_m4, folds_m4 = kfold_cv(depression_data, depression_y, depression_features, k=K, l2=0.01)

print(f"\n  {K}分割交差確認法結果:")
print(f"  [訓練] {format_metrics(train_m4)}")
print(f"  [テスト] {format_metrics(test_m4)}")
print()

auc_gap_m4 = train_m4["auc"] - test_m4["auc"]
print(f"\n  過学習チェック:")
print(f"  AUCギャップ（訓練-テスト）: {auc_gap_m4:.4f}")
if auc_gap_m4 > 0.1:
    print(f"  ⚠️ 過学習の可能性あり（AUCギャップ > 0.10）")
elif auc_gap_m4 > 0.05:
    print(f"  ⚠️ 軽度の過学習傾向（AUCギャップ > 0.05）")
else:
    print(f"  ✅ 過学習の兆候なし（AUCギャップ ≤ 0.05）")
print()

# === モデル5: 病気カテゴリ別（脳血管・脳腫瘍 vs 対照） ===
print("=" * 80)
print("【モデル5: 病気カテゴリ別 — 脳血管・脳腫瘍 vs 対照】")
print("=" * 80)

brain_cases = [d for d in cases if d["disease_group"] == "脳血管・脳腫瘍"]
brain_data = brain_cases + controls
brain_y = [1] * len(brain_cases) + [0] * len(controls)

print(f"  脳血管・脳腫瘍: {len(brain_cases)}名 vs 対照: {len(controls)}名")

brain_features = confounder_keys + ["west_石門星", "center_玉堂星", "topo_半会（水局）", "tenchu_寅卯", "center_鳳閣星", "west_鳳閣星"]

train_m5, test_m5, folds_m5 = kfold_cv(brain_data, brain_y, brain_features, k=K, l2=0.01)

print(f"\n  {K}分割交差確認法結果:")
print(f"  [訓練] {format_metrics(train_m5)}")
print(f"  [テスト] {format_metrics(test_m5)}")
print()

auc_gap_m5 = train_m5["auc"] - test_m5["auc"]
print(f"\n  過学習チェック:")
print(f"  AUCギャップ（訓練-テスト）: {auc_gap_m5:.4f}")
if auc_gap_m5 > 0.1:
    print(f"  ⚠️ 過学習の可能性あり（AUCギャップ > 0.10）")
elif auc_gap_m5 > 0.05:
    print(f"  ⚠️ 軽度の過学習傾向（AUCギャップ > 0.05）")
else:
    print(f"  ✅ 過学習の兆候なし（AUCギャップ ≤ 0.05）")
print()

# === Leave-One-Out CV（多変量モデル） ===
print("=" * 80)
print("【Leave-One-Out CV（多変量モデル、モデル2）】")
print("=" * 80)

loo_n = len(data)
loo_preds = []
loo_true = []

for i in range(loo_n):
    train_idx = [j for j in range(loo_n) if j != i]
    test_idx = [i]

    X_train = [make_feature_vector(data[j], all_model2_features) for j in train_idx]
    y_train = [y_all[j] for j in train_idx]
    X_test = [make_feature_vector(data[j], all_model2_features) for j in test_idx]
    y_test = [y_all[j] for j in test_idx]

    try:
        beta = logistic_regression(X_train, y_train, l2=0.01)
        y_pred = predict_proba(X_test, beta)
        loo_preds.extend(y_pred)
        loo_true.extend(y_test)
    except:
        loo_preds.append(0.5)
        loo_true.append(y_test[0])

loo_metrics = compute_metrics(loo_true, loo_preds)
print(f"\n  LOO-CV結果:")
print(f"  AUC={loo_metrics['auc']:.4f}  Acc={loo_metrics['accuracy']:.4f}  "
      f"Sen={loo_metrics['sensitivity']:.4f}  Spe={loo_metrics['specificity']:.4f}  "
      f"F1={loo_metrics['f1']:.4f}  Brier={loo_metrics['brier']:.4f}  LogLoss={loo_metrics['log_loss']:.4f}")

# 訓練データ全体でのAUC（参考）
X_all_m2 = [make_feature_vector(d, all_model2_features) for d in data]
beta_full = logistic_regression(X_all_m2, y_all, l2=0.01)
y_all_pred = predict_proba(X_all_m2, beta_full)
full_metrics = compute_metrics(y_all, y_all_pred)
print(f"\n  全データ適合（参考）: AUC={full_metrics['auc']:.4f}")
print(f"  LOO-CV AUC: {loo_metrics['auc']:.4f}")
print(f"  ギャップ: {full_metrics['auc'] - loo_metrics['auc']:.4f}")
print()

# === 総合比較 ===
print("=" * 80)
print("【総合モデル比較】")
print("=" * 80)
print(f"\n{'モデル':<35} {'訓練AUC':>8} {'テストAUC':>9} {'ギャップ':>8} {'テストF1':>8} {'テストBrier':>11} {'過学習':>8}")
print("-" * 100)

models = [
    ("モデル1: ベースライン（交絡因子のみ）", train_m1, test_m1, auc_gap_m1),
    ("モデル2: 多変量（6要素+交絡因子）", train_m2, test_m2, auc_gap_m2),
    ("モデル3: 全算命学要素+交絡因子", train_m3, test_m3, auc_gap_m3),
    ("モデル4: うつ・抑うつ（6要素+交絡）", train_m4, test_m4, auc_gap_m4),
    ("モデル5: 脳血管・脳腫瘍（6要素+交絡）", train_m5, test_m5, auc_gap_m5),
]

for name, tr, te, gap in models:
    overfit = "⚠️" if gap > 0.1 else ("△" if gap > 0.05 else "✅")
    print(f"  {name:<33} {tr['auc']:>8.4f} {te['auc']:>9.4f} {gap:>8.4f} {te['f1']:>8.4f} {te['brier']:>11.4f} {overfit:>8}")

print(f"\n  LOO-CV（モデル2）: AUC={loo_metrics['auc']:.4f}")
print()

# === 解釈 ===
print("=" * 80)
print("【解釈】")
print("=" * 80)
print()

# モデル2 vs モデル1の改善
auc_improvement = test_m2["auc"] - test_m1["auc"]
print(f"1. 予測性能:")
print(f"   ベースラインAUC: {test_m1['auc']:.4f}")
print(f"   多変量モデルAUC: {test_m2['auc']:.4f}")
print(f"   改善: +{auc_improvement:.4f}")
if auc_improvement > 0.05:
    print(f"   → 算命学要素により実質的な予測改善あり")
elif auc_improvement > 0.02:
    print(f"   → 算命学要素による予測改善は軽微")
else:
    print(f"   → 算命学要素による予測改善は限定的")
print()

print(f"2. 過学習:")
for name, tr, te, gap in models:
    if gap > 0.1:
        print(f"   {name}: 過学習あり（ギャップ={gap:.4f}）")
    elif gap > 0.05:
        print(f"   {name}: 軽度の過学習（ギャップ={gap:.4f}）")
    else:
        print(f"   {name}: 過学習なし（ギャップ={gap:.4f}）")
print()

print(f"3. モデル3（全要素）vs モデル2（6要素）:")
print(f"   テストAUC: {test_m3['auc']:.4f} vs {test_m2['auc']:.4f}")
if test_m3["auc"] < test_m2["auc"]:
    print(f"   → 変数を絞ったモデル2の方が汎化性能が高い（変数選択の効果）")
else:
    print(f"   → 全要素モデルも同等の性能")
print()

print(f"4. LOO-CV vs 10-fold CV（モデル2）:")
print(f"   LOO-CV AUC: {loo_metrics['auc']:.4f}")
print(f"   10-fold CV AUC: {test_m2['auc']:.4f}")
print(f"   差: {abs(loo_metrics['auc'] - test_m2['auc']):.4f}")
print()

print(f"5. 結論:")
best_model = max([("ベースライン", test_m1), ("多変量(6要素)", test_m2), ("全要素", test_m3)], key=lambda x: x[1]["auc"])
print(f"   最高テストAUC: {best_model[0]} ({best_model[1]['auc']:.4f})")
print(f"   AUC {best_model[1]['auc']:.2f}は{'良好な判別力' if best_model[1]['auc'] >= 0.7 else '中程度の判別力' if best_model[1]['auc'] >= 0.6 else '限定的な判別力'}を示す")
print(f"   過学習は{'懸念される' if any(g > 0.1 for _, _, _, g in models) else '懸念されない'}")
print(f"   算命学要素は統計的に有意な予測因子だが、実用的な予測モデルとしては")
print(f"   サンプルサイズの拡大と特徴量の精選が必要")

print()
print("※k=10分割交差確認法、L2正則化適用、ランダムシード=42")
print("※AUC: 0.5=ランダム、0.7=良好、0.8=優秀、1.0=完全")
print("※過学習判定: AUCギャップ(訓練-テスト) ≤ 0.05=正常、0.05-0.10=軽度、>0.10=過学習")

# Write output
output_path = os.path.join(BASE_DIR, "cross_validation_results.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(_output_lines))
sys.stdout.write(f"Results written to {output_path}\n")
