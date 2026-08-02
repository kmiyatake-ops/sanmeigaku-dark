# -*- coding: utf-8 -*-
"""
芸能人病気データ 算命学 相関分析スクリプト
celebrity_sanmeigaku_results.json を読み込み、
病気カテゴリ別に算命学要素の集計・相関分析を行う。
"""

import json
import os
import sys
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

# エラーのあるデータを除外
data = [d for d in data if "error" not in d]
print(f"分析対象: {len(data)}名\n")

# === 病気カテゴリの分類 ===
def get_disease_group(category):
    """病気カテゴリを大分類にまとめる"""
    if "がん" in category:
        if "頭頸部" in category:
            return "がん（頭頸部）"
        elif "乳がん" in category:
            return "がん（乳がん）"
        elif "消化器" in category:
            return "がん（消化器）"
        elif "呼吸器" in category:
            return "がん（呼吸器）"
        elif "泌尿器" in category:
            return "がん（泌尿器）"
        else:
            return "がん（その他）"
    elif "脳血管" in category or "脳腫瘍" in category:
        return "脳血管・脳腫瘍"
    elif "うつ" in category and "双極性" not in category:
        return "精神疾患（うつ・抑うつ）"
    elif "パニック" in category:
        return "精神疾患（パニック障害）"
    elif "双極性" in category:
        return "精神疾患（双極性障害）"
    elif "血液" in category:
        return "血液疾患"
    else:
        return "その他"

# 各データに病気大分類を追加
for d in data:
    d["disease_group"] = get_disease_group(d["illness_category"])

# 病気大分類の集計
disease_groups = Counter(d["disease_group"] for d in data)
print("=" * 60)
print("【病気大分類別 人数】")
print("=" * 60)
for group, count in disease_groups.most_common():
    print(f"  {group}: {count}名")
print()

# === 分析関数 ===
def analyze_by_disease_group(field_extractor, field_name):
    """病気グループ別に指定フィールドの分布を集計"""
    print("=" * 60)
    print(f"【{field_name} × 病気グループ】")
    print("=" * 60)

    # 全体分布
    all_values = []
    for d in data:
        vals = field_extractor(d)
        if isinstance(vals, list):
            all_values.extend(vals)
        else:
            all_values.append(vals)

    all_counter = Counter(all_values)
    total = len(data)

    print(f"\n  ■ 全体分布 (n={total}):")
    for val, count in all_counter.most_common():
        pct = count / total * 100
        print(f"    {val}: {count}名 ({pct:.1f}%)")

    # 病気グループ別
    for group in sorted(disease_groups.keys()):
        group_data = [d for d in data if d["disease_group"] == group]
        n = len(group_data)
        group_values = []
        for d in group_data:
            vals = field_extractor(d)
            if isinstance(vals, list):
                group_values.extend(vals)
            else:
                group_values.append(vals)

        group_counter = Counter(group_values)
        print(f"\n  ■ {group} (n={n}):")
        for val, count in group_counter.most_common(5):
            pct = count / n * 100
            # 全体平均との比較
            overall_pct = all_counter.get(val, 0) / total * 100
            diff = pct - overall_pct
            marker = " ▲偏高" if diff > 10 else " ▼偏低" if diff < -10 else ""
            print(f"    {val}: {count}名 ({pct:.1f}%) [全体{overall_pct:.1f}%{marker}]")
    print()

# === A. 五行バランスと病気の関係 ===
print("\n" + "█" * 60)
print("█ A. 五行バランスと病気の関係")
print("█" * 60 + "\n")

# A-1. 最強五行
analyze_by_disease_group(
    lambda d: d["strongest_gogyo"],
    "最強五行（宿命で最も強い五行）"
)

# A-2. 最弱五行
analyze_by_disease_group(
    lambda d: d["weakest_gogyo"],
    "最弱五行（宿命で最も弱い五行）"
)

# A-3. 五行バランス度
print("=" * 60)
print("【五行バランス度 × 病気グループ】")
print("=" * 60)
for group in sorted(disease_groups.keys()):
    group_data = [d for d in data if d["disease_group"] == group]
    balances = [d["gogyo_balance"] for d in group_data]
    avg = sum(balances) / len(balances)
    balanced = sum(1 for b in balances if b <= 1)
    imbalanced = sum(1 for b in balances if b >= 3)
    print(f"  {group} (n={len(group_data)}): 平均偏り={avg:.1f}, バランス良好={balanced}名, 偏り大={imbalanced}名")

all_balances = [d["gogyo_balance"] for d in data]
print(f"  全体 (n={len(data)}): 平均偏り={sum(all_balances)/len(all_balances):.1f}")
print()

# A-4. 日干の五行
analyze_by_disease_group(
    lambda d: d["day_element"],
    "日干の五行"
)

# A-5. 日干の陰陽
analyze_by_disease_group(
    lambda d: d["day_yin_yang"],
    "日干の陰陽"
)

# === B. 十大主星と病気の関係 ===
print("\n" + "█" * 60)
print("█ B. 十大主星と病気の関係")
print("█" * 60 + "\n")

# B-1. 中央星（本質）
analyze_by_disease_group(
    lambda d: d["main_stars"]["center"],
    "中央星（本質・胸）"
)

# B-2. 北星（頭）
analyze_by_disease_group(
    lambda d: d["main_stars"]["north"],
    "北星（頭）"
)

# B-3. 南星（腹）
analyze_by_disease_group(
    lambda d: d["main_stars"]["south"],
    "南星（腹）"
)

# B-4. 西星（右手・配偶者）
analyze_by_disease_group(
    lambda d: d["main_stars"]["west"],
    "西星（右手・配偶者）"
)

# B-5. 全主星の集計（6つの星すべて）
def get_all_stars(d):
    return list(d["main_stars"].values())

analyze_by_disease_group(
    get_all_stars,
    "全主星（6星すべての集計）"
)

# === C. 大運と発症時期の関係 ===
print("\n" + "█" * 60)
print("█ C. 大運と発症時期の関係")
print("█" * 60 + "\n")

# C-1. 発症時の大運の主星
analyze_by_disease_group(
    lambda d: [d["onset_data"]["taiun"]["star"]] if d["onset_data"]["taiun"] else [],
    "発症時の大運の主星"
)

# C-2. 発症時の大運の十二大従星
analyze_by_disease_group(
    lambda d: [d["onset_data"]["taiun"]["energy"]["name"]] if d["onset_data"]["taiun"] and d["onset_data"]["taiun"]["energy"] else [],
    "発症時の大運の十二大従星"
)

# C-3. 発症時の大運が天中殺かどうか
print("=" * 60)
print("【発症時の大運天中殺 × 病気グループ】")
print("=" * 60)
for group in sorted(disease_groups.keys()):
    group_data = [d for d in data if d["disease_group"] == group]
    tenchu_count = sum(1 for d in group_data if d["onset_data"]["taiun"] and d["onset_data"]["taiun"]["is_tenchu"])
    pct = tenchu_count / len(group_data) * 100 if group_data else 0
    print(f"  {group} (n={len(group_data)}): 大運天中殺中の発症={tenchu_count}名 ({pct:.1f}%)")

all_tenchu = sum(1 for d in data if d["onset_data"]["taiun"] and d["onset_data"]["taiun"]["is_tenchu"])
print(f"  全体 (n={len(data)}): 大運天中殺中の発症={all_tenchu}名 ({all_tenchu/len(data)*100:.1f}%)")
print()

# C-4. 発症時の年運が天中殺かどうか
print("=" * 60)
print("【発症時の年運天中殺 × 病気グループ】")
print("=" * 60)
for group in sorted(disease_groups.keys()):
    group_data = [d for d in data if d["disease_group"] == group]
    tenchu_count = sum(1 for d in group_data if d["onset_data"]["is_tenchu_year"])
    pct = tenchu_count / len(group_data) * 100 if group_data else 0
    print(f"  {group} (n={len(group_data)}): 年運天中殺中の発症={tenchu_count}名 ({pct:.1f}%)")

all_year_tenchu = sum(1 for d in data if d["onset_data"]["is_tenchu_year"])
print(f"  全体 (n={len(data)}): 年運天中殺中の発症={all_year_tenchu}名 ({all_year_tenchu/len(data)*100:.1f}%)")
print()

# C-5. 発症時の年運の主星
analyze_by_disease_group(
    lambda d: [d["onset_data"]["year_star"]],
    "発症時の年運の主星"
)

# C-6. 発症時の年運の十二大従星
analyze_by_disease_group(
    lambda d: [d["onset_data"]["year_energy"]["name"]] if d["onset_data"]["year_energy"] else [],
    "発症時の年運の十二大従星"
)

# === D. 位相法と病気の関係 ===
print("\n" + "█" * 60)
print("█ D. 位相法と病気の関係")
print("█" * 60 + "\n")

# D-1. 宿命内の位相法（合法・散法）
def get_topology_groups(d):
    groups = []
    for t in d["topology"]:
        groups.append(t["group"])
    return groups

analyze_by_disease_group(
    get_topology_groups,
    "宿命内の位相法（合法/散法）"
)

# D-2. 宿命内の位相法（詳細）
def get_topology_names(d):
    return [t["name"] for t in d["topology"]]

analyze_by_disease_group(
    get_topology_names,
    "宿命内の位相法（詳細）"
)

# D-3. 発症時の位相法
def get_onset_topology_groups(d):
    return [t["group"] for t in d["onset_data"]["topology"]]

analyze_by_disease_group(
    get_onset_topology_groups,
    "発症時の位相法（合法/散法）"
)

# D-4. 発症時の位相法（詳細）
def get_onset_topology_names(d):
    return [t["name"] for t in d["onset_data"]["topology"]]

analyze_by_disease_group(
    get_onset_topology_names,
    "発症時の位相法（詳細）"
)

# === E. 姓名判断と病気の関係 ===
print("\n" + "█" * 60)
print("█ E. 姓名判断と病気の関係")
print("█" * 60 + "\n")

# 姓名判断データがある人数
def has_valid_seimei(d):
    s = d.get("seimei")
    return s and isinstance(s, dict) and "error" not in s

seimei_count = sum(1 for d in data if has_valid_seimei(d))
seimei_error_count = sum(1 for d in data if d.get("seimei") and isinstance(d["seimei"], dict) and "error" in d["seimei"])
print(f"姓名判断データあり: {seimei_count}名 / {len(data)}名（画数未登録エラー: {seimei_error_count}名）\n")

if seimei_count > 0:
    # E-1. 三才配置
    analyze_by_disease_group(
        lambda d: [d["seimei"]["sancai"]] if has_valid_seimei(d) else [],
        "三才配置（天格・人格・地格の五行）"
    )

    def get_rank_value(seimei, key):
        if not seimei or not isinstance(seimei, dict):
            return None
        v = seimei.get(key)
        if v is None:
            return None
        if isinstance(v, dict):
            return v.get("rank")
        if isinstance(v, str):
            return v
        return None

    # E-2. 人格の吉凶
    analyze_by_disease_group(
        lambda d: [r] if (r := get_rank_value(d.get("seimei"), "jin_rank")) else [],
        "人格の吉凶"
    )

    # E-3. 総格の吉凶
    analyze_by_disease_group(
        lambda d: [r] if (r := get_rank_value(d.get("seimei"), "sou_rank")) else [],
        "総格の吉凶"
    )

    # E-4. 総合判定
    analyze_by_disease_group(
        lambda d: [r] if (r := get_rank_value(d.get("seimei"), "overall_rank")) else [],
        "姓名判断 総合判定"
    )

# === F. 天中殺と病気の関係 ===
print("\n" + "█" * 60)
print("█ F. 天中殺と病気の関係")
print("█" * 60 + "\n")

analyze_by_disease_group(
    lambda d: [d["tenchusatsu"]],
    "宿命の天中殺"
)

# 宿命天中殺の詳細
print("=" * 60)
print("【宿命天中殺（詳細） × 病気グループ】")
print("=" * 60)
for group in sorted(disease_groups.keys()):
    group_data = [d for d in data if d["disease_group"] == group]
    seinen = sum(1 for d in group_data if d["fate_tenchusatsu"]["seinen"])
    seigetsu = sum(1 for d in group_data if d["fate_tenchusatsu"]["seigetsu"])
    seinichi = sum(1 for d in group_data if d["fate_tenchusatsu"]["seinichi"])
    print(f"  {group} (n={len(group_data)}): 生年天中殺={seinen}, 生月天中殺={seigetsu}, 生日天中殺={seinichi}")

print()

# === G. 健康リスク分析との照合 ===
print("\n" + "█" * 60)
print("█ G. 健康リスク分析と実際の発症の照合")
print("█" * 60 + "\n")

print("=" * 60)
print("【発症年に健康リスクが検出されていたか】")
print("=" * 60)
for group in sorted(disease_groups.keys()):
    group_data = [d for d in data if d["disease_group"] == group]
    detected = sum(1 for d in group_data if d["onset_data"]["health_risk"])
    pct = detected / len(group_data) * 100 if group_data else 0
    print(f"  {group} (n={len(group_data)}): リスク検出={detected}名 ({pct:.1f}%)")

all_detected = sum(1 for d in data if d["onset_data"]["health_risk"])
print(f"  全体 (n={len(data)}): リスク検出={all_detected}名 ({all_detected/len(data)*100:.1f}%)")
print()

# 発症年の健康リスクスコア
print("=" * 60)
print("【発症年の健康リスクスコア分布】")
print("=" * 60)
for group in sorted(disease_groups.keys()):
    group_data = [d for d in data if d["disease_group"] == group]
    scores = [d["onset_data"]["health_risk"]["risk_score"] for d in group_data if d["onset_data"]["health_risk"]]
    if scores:
        avg = sum(scores) / len(scores)
        mx = max(scores)
        mn = min(scores)
        print(f"  {group}: 検出数={len(scores)}, 平均={avg:.0f}, 最高={mx}, 最低={mn}")
    else:
        print(f"  {group}: リスク検出なし")
print()

# === H. 日干体質と病気の関係 ===
print("\n" + "█" * 60)
print("█ H. 日干体質と病気の関係")
print("█" * 60 + "\n")

# 日干ごとの体質的弱点と実際の病気の対応
print("=" * 60)
print("【日干 × 病気グループ】")
print("=" * 60)
day_stem_groups = defaultdict(list)
for d in data:
    day_stem_groups[d["day_stem"]].append(d)

for stem in sorted(day_stem_groups.keys()):
    group_list = day_stem_groups[stem]
    diseases = Counter(d["disease_group"] for d in group_list)
    constitution = group_list[0]["health_risk_summary"]["constitution"]
    natal_weakness = group_list[0]["health_risk_summary"]["natal_weakness"]
    natal_excess = group_list[0]["health_risk_summary"]["natal_excess"]
    print(f"\n  日干{stem} (n={len(group_list)}):")
    print(f"    体質: {constitution}")
    if natal_weakness:
        for nw in natal_weakness:
            print(f"    弱点: {nw['element']}→{nw['organs']} ({nw['risk']})")
    if natal_excess:
        for ne in natal_excess:
            print(f"    過剰: {ne['element']}→{ne['organs']} ({ne['risk']})")
    print(f"   気: ", end="")
    print(", ".join(f"{g}({c})" for g, c in diseases.most_common()))

print()

# === 個別データサマリー ===
print("\n" + "█" * 60)
print("█ 個別データサマリー（全40名）")
print("█" * 60 + "\n")

for d in data:
    onset = d["onset_data"]
    taiun_info = onset["taiun"]
    tenchu_mark = "★天中殺" if (onset["is_tenchu_year"] or (taiun_info and taiun_info["is_tenchu"])) else ""
    print(f"  [{d['id']:2d}] {d['name']:12s} | {d['birth_date']} | {d['day_stem']}{d['day_branch']} ({d['day_element']}{d['day_yin_yang']}) | "
          f"{d['disease_group']:20s} | 発症{onset['age']}歳({d['onset_year']}) | "
          f"年運:{onset['year_star']} | 大運:{taiun_info['star'] if taiun_info else '-'} | "
          f"中央:{d['main_stars']['center']} | {tenchu_mark}")

print("\n" + "=" * 60)
print("分析完了")
print("=" * 60)

# Write all output to file
output_path = os.path.join(os.path.dirname(__file__), "analysis_output.txt")
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(_output_lines))
sys.stdout.write(f"Analysis written to {output_path}\n")
