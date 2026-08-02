# -*- coding: utf-8 -*-
"""
収集したWikipediaデータからノイズを除去するフィルタリングスクリプト
"""

import json
import os
import re
from collections import defaultdict

INPUT_FILE = os.path.join(os.path.dirname(__file__), "celebrity_illness_data_expanded.json")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "celebrity_illness_data_filtered.json")

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"フィルタリング前: {len(data)}件")

# === ノイズ除去 ===

# 1. 非人物エントリの除外キーワード
non_person_keywords = [
    "のテレビ", "のラジオ", "の映画", "のアニメ", "のドラマ",
    "年のテレビ", "年のラジオ", "年の映画", "年のアニメ", "年のドラマ",
    "週刊", "月刊", "テレビ番組", "ラジオ番組",
    "ミュージックステーション", "メレンゲの気持ち", "ドクターX",
    "PRODUCE 101", "SUPER☆GiRLS", "OCTPATH", "ハニースパイス",
    "I.B.I", "Baby KARA", "アシュラシンドローム",
    "ザ・ドリフターズ", "チェリッシュ (歌手グループ)", "ロス・プリモス",
    "アーサー・コンリー",
]

# 2. 人物らしい名前かチェック
def is_likely_person(name):
    for kw in non_person_keywords:
        if kw in name:
            return False
    # 年号のみのタイトル
    if re.match(r'^\d{4}年', name):
        return False
    # 「〜番組」「〜シリーズ」等
    if any(x in name for x in ["番組", "シリーズ", "一覧", "カテゴリ", "テンプレート"]):
        return False
    return True

# 3. 性別と病気の矛盾チェック
gender_illness_conflicts = {
    ("female", "精巣がん"),
    ("female", "前立腺がん"),
    ("male", "乳がん"),  # 男性乳がんは稀だが存在するため除外しない
    ("male", "子宮頸がん"),
    ("male", "子宮体がん"),
    ("male", "卵巣がん"),
}

def has_gender_conflict(gender, illness):
    return (gender, illness) in gender_illness_conflicts

# 4. 発症年が生年月日より前、または年齢が極端に若い/高齢すぎる
def is_valid_onset_age(birth_date, onset_year):
    try:
        birth_year = int(birth_date[:4])
        age = onset_year - birth_year
        return 0 <= age <= 100
    except:
        return False

# 5. 同一人物・同一病気の重複排除（最も早い発症年を採用）
def deduplicate(entries):
    seen = {}
    for e in entries:
        key = (e["name"], e["illness"])
        if key not in seen or e["onset_year"] < seen[key]["onset_year"]:
            seen[key] = e
    return list(seen.values())

# === フィルタリング実行 ===
filtered = []
removed_reasons = defaultdict(int)

for entry in data:
    # 非人物除外
    if not is_likely_person(entry["name"]):
        removed_reasons["非人物"] += 1
        continue
    
    # 性別・病気の矛盾
    if has_gender_conflict(entry["gender"], entry["illness"]):
        removed_reasons["性別・病気矛盾"] += 1
        continue
    
    # 発症年齢チェック
    if not is_valid_onset_age(entry["birth_date"], entry["onset_year"]):
        removed_reasons["発症年齢不正"] += 1
        continue
    
    # 実名が非人物っぽい場合
    if not is_likely_person(entry.get("real_name", "")):
        removed_reasons["実名が非人物"] += 1
        continue
    
    filtered.append(entry)

# 重複排除
before_dedup = len(filtered)
filtered = deduplicate(filtered)
removed_reasons["重複"] = before_dedup - len(filtered)

print(f"フィルタリング後: {len(filtered)}件")
print(f"除外件数: {sum(removed_reasons.values())}件")
print("\n除外理由:")
for reason, count in sorted(removed_reasons.items(), key=lambda x: -x[1]):
    print(f"  {reason}: {count}件")

# === 病気カテゴリ別集計 ===
cat_count = defaultdict(int)
for r in filtered:
    cat_count[r["illness_category"]] += 1
print("\n病気カテゴリ別集計:")
for cat, cnt in sorted(cat_count.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {cnt}件")

# === 人物数カウント ===
persons = set(r["name"] for r in filtered)
print(f"\nユニーク人物数: {len(persons)}名")

# === 結果保存 ===
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(filtered, f, ensure_ascii=False, indent=2)
print(f"\n結果を保存: {OUTPUT_FILE}")

# === サンプル出力 ===
print("\n=== 抽出された人物（最初の30名）===")
person_illnesses = defaultdict(list)
for r in filtered:
    person_illnesses[r["name"]].append(r["illness"])

for i, (name, illnesses) in enumerate(sorted(person_illnesses.items())):
    if i >= 30:
        break
    entry = filtered[[r["name"] for r in filtered].index(name)]
    print(f"  {name} ({entry['birth_date']} {entry['gender']}): {', '.join(illnesses)}")
