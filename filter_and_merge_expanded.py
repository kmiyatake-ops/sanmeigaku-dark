# -*- coding: utf-8 -*-
"""
expanded_cases.json と expanded_controls.json をフィルタリングし、
既存の celebrity_illness_data_merged.json とマージするスクリプト
"""

import json
import os
import re
from collections import defaultdict

BASE_DIR = os.path.dirname(__file__)

INPUT_EXISTING = os.path.join(BASE_DIR, "celebrity_illness_data_merged.json")
INPUT_CASES = os.path.join(BASE_DIR, "phase2_cases.json")
INPUT_CONTROLS = os.path.join(BASE_DIR, "phase2_controls.json")
OUTPUT_CASES = os.path.join(BASE_DIR, "expanded_dataset_cases.json")
OUTPUT_CONTROLS = os.path.join(BASE_DIR, "expanded_dataset_controls.json")
OUTPUT_COMBINED = os.path.join(BASE_DIR, "expanded_dataset_combined.json")

# === 非人物エントリ除外キーワード ===
non_person_keywords = [
    "のテレビ", "のラジオ", "の映画", "のアニメ", "のドラマ",
    "年のテレビ", "年のラジオ", "年の映画", "年のアニメ", "年のドラマ",
    "週刊", "月刊", "テレビ番組", "ラジオ番組",
    "ミュージックステーション", "メレンゲの気持ち", "ドクターX",
    "PRODUCE 101", "SUPER☆GiRLS", "OCTPATH", "ハニースパイス",
    "I.B.I", "Baby KARA", "アシュラシンドローム",
    "ザ・ドリフターズ", "チェリッシュ", "ロス・プリモス",
    "アーサー・コンリー", "Juice=Juice",
    "一覧", "カテゴリ", "テンプレート", "シリーズ",
    "番組", "放送", "局", "新聞", "雑誌",
]

def is_likely_person(name):
    for kw in non_person_keywords:
        if kw in name:
            return False
    if re.match(r'^\d{4}年', name):
        return False
    # 名前が短すぎるor長すぎる
    if len(name) < 2 or len(name) > 30:
        return False
    # 記号が多すぎる
    symbol_count = sum(1 for c in name if not c.isalnum() and c not in '・ー＝')
    if symbol_count > 3:
        return False
    return True

# === 性別と病気の矛盾 ===
gender_illness_conflicts = {
    ("female", "精巣がん"),
    ("female", "前立腺がん"),
    ("male", "子宮頸がん"),
    ("male", "子宮体がん"),
    ("male", "卵巣がん"),
}

def has_gender_conflict(gender, illness):
    if not illness:
        return False
    for conflict_gender, conflict_illness in gender_illness_conflicts:
        if conflict_illness in illness:
            return gender == conflict_gender
    return False

# === 発症年齢チェック ===
def is_valid_onset_age(birth_date, onset_year):
    try:
        birth_year = int(birth_date[:4])
        if onset_year is None:
            return True  # 発症年不明は許可
        age = onset_year - birth_year
        return 0 <= age <= 100
    except:
        return False

# === 同一人物・同一病気の重複排除 ===
def deduplicate_cases(entries):
    seen = {}
    for e in entries:
        key = (e["name"], e.get("illness", ""))
        if key not in seen:
            seen[key] = e
        else:
            # より早い発症年を採用
            existing_year = seen[key].get("onset_year")
            new_year = e.get("onset_year")
            if existing_year and new_year and new_year < existing_year:
                seen[key] = e
    return list(seen.values())

def deduplicate_by_name(entries):
    seen = {}
    for e in entries:
        name = e["name"]
        if name not in seen:
            seen[name] = e
    return list(seen.values())

# === 既存データ読み込み ===
with open(INPUT_EXISTING, "r", encoding="utf-8") as f:
    existing_data = json.load(f)
print(f"既存ケース: {len(existing_data)}件")

# === 新規ケース読み込み ===
with open(INPUT_CASES, "r", encoding="utf-8") as f:
    new_cases = json.load(f)
print(f"新規ケース（フィルタ前）: {len(new_cases)}件")

# === 新規ケースフィルタリング ===
filtered_cases = []
removed_reasons = defaultdict(int)

for entry in new_cases:
    name = entry.get("name", "")
    
    # 非人物除外
    if not is_likely_person(name):
        removed_reasons["非人物"] += 1
        continue
    
    # 実名が非人物っぽい場合
    real_name = entry.get("real_name", "")
    if real_name and not is_likely_person(real_name):
        removed_reasons["実名が非人物"] += 1
        continue
    
    # 性別・病気の矛盾
    if has_gender_conflict(entry.get("gender", ""), entry.get("illness", "")):
        removed_reasons["性別・病気矛盾"] += 1
        continue
    
    # 発症年齢チェック
    if not is_valid_onset_age(entry.get("birth_date", ""), entry.get("onset_year")):
        removed_reasons["発症年齢不正"] += 1
        continue
    
    # birth_dateの基本チェック
    birth_date = entry.get("birth_date", "")
    if not birth_date or len(birth_date) < 8:
        removed_reasons["生年月日不正"] += 1
        continue
    
    filtered_cases.append(entry)

print(f"新規ケース（フィルタ後）: {len(filtered_cases)}件")
print(f"除外件数: {sum(removed_reasons.values())}件")
print("除外理由:")
for reason, count in sorted(removed_reasons.items(), key=lambda x: -x[1]):
    print(f"  {reason}: {count}件")

# 重複排除（同一人物・同一病気）
before_dedup = len(filtered_cases)
filtered_cases = deduplicate_cases(filtered_cases)
print(f"重複排除: {before_dedup - len(filtered_cases)}件除外 -> {len(filtered_cases)}件")

# === 既存データとの重複排除 ===
existing_names = set(e["name"] for e in existing_data)
unique_new_cases = [e for e in filtered_cases if e["name"] not in existing_names]
print(f"既存データとの重複除外後: {len(unique_new_cases)}件")

# === マージ ===
merged_cases = list(existing_data)
next_id = max(e.get("id", 0) for e in existing_data) + 1 if existing_data else 1

for entry in unique_new_cases:
    entry["id"] = next_id
    entry["group"] = "case"
    merged_cases.append(entry)
    next_id += 1

print(f"マージ後ケース総数: {len(merged_cases)}件")

# === コントロール群読み込み・フィルタリング ===
with open(INPUT_CONTROLS, "r", encoding="utf-8") as f:
    controls = json.load(f)
print(f"\nコントロール群（フィルタ前）: {len(controls)}件")

filtered_controls = []
ctrl_removed = defaultdict(int)

for entry in controls:
    name = entry.get("name", "")
    
    if not is_likely_person(name):
        ctrl_removed["非人物"] += 1
        continue
    
    real_name = entry.get("real_name", "")
    if real_name and not is_likely_person(real_name):
        ctrl_removed["実名が非人物"] += 1
        continue
    
    birth_date = entry.get("birth_date", "")
    if not birth_date or len(birth_date) < 8:
        ctrl_removed["生年月日不正"] += 1
        continue
    
    # ケース群と重複しないか
    if name in existing_names or name in set(e["name"] for e in unique_new_cases):
        ctrl_removed["ケース群と重複"] += 1
        continue
    
    filtered_controls.append(entry)

print(f"コントロール群（フィルタ後）: {len(filtered_controls)}件")
print("除外理由:")
for reason, count in sorted(ctrl_removed.items(), key=lambda x: -x[1]):
    print(f"  {reason}: {count}件")

# コントロール群の重複排除（名前ベース）
before_ctrl_dedup = len(filtered_controls)
filtered_controls = deduplicate_by_name(filtered_controls)
print(f"重複排除: {before_ctrl_dedup - len(filtered_controls)}件除外 -> {len(filtered_controls)}件")

# ID付与
for i, entry in enumerate(filtered_controls):
    entry["id"] = next_id + i
    entry["group"] = "control"

# === 保存 ===
with open(OUTPUT_CASES, "w", encoding="utf-8") as f:
    json.dump(merged_cases, f, ensure_ascii=False, indent=2)
print(f"\nケース保存: {OUTPUT_CASES} ({len(merged_cases)}件)")

with open(OUTPUT_CONTROLS, "w", encoding="utf-8") as f:
    json.dump(filtered_controls, f, ensure_ascii=False, indent=2)
print(f"コントロール保存: {OUTPUT_CONTROLS} ({len(filtered_controls)}件)")

# === 統合データセット（ケース＋コントロール）===
combined = merged_cases + filtered_controls
with open(OUTPUT_COMBINED, "w", encoding="utf-8") as f:
    json.dump(combined, f, ensure_ascii=False, indent=2)
print(f"統合データセット保存: {OUTPUT_COMBINED} ({len(combined)}件)")

# === サマリー ===
print("\n" + "=" * 60)
print("フィルタ・マージ サマリー")
print("=" * 60)
case_persons = set(e["name"] for e in merged_cases)
ctrl_persons = set(e["name"] for e in filtered_controls)
print(f"ケース群ユニーク人物数: {len(case_persons)}名")
print(f"コントロール群ユニーク人物数: {len(ctrl_persons)}名")
print(f"合計: {len(case_persons) + len(ctrl_persons)}名")

# 病気カテゴリ別
cat_count = defaultdict(int)
for r in merged_cases:
    cat = r.get("illness_category", "不明")
    cat_count[cat] += 1
print("\nケース群の病気カテゴリ別:")
for cat, cnt in sorted(cat_count.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {cnt}件")

# 性別分布
print("\nケース群の性別分布:")
gender_count = defaultdict(int)
for r in merged_cases:
    gender_count[r.get("gender", "不明")] += 1
for g, cnt in sorted(gender_count.items()):
    print(f"  {g}: {cnt}名")

print("\nコントロール群の性別分布:")
ctrl_gender = defaultdict(int)
for r in filtered_controls:
    ctrl_gender[r.get("gender", "不明")] += 1
for g, cnt in sorted(ctrl_gender.items()):
    print(f"  {g}: {cnt}名")
