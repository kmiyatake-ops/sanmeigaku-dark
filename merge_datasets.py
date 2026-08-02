# -*- coding: utf-8 -*-
"""
旧の手動キュレーションデータ（celebrity_marriage_sanmeigaku.jsonから復元）と
新規API収集データ（marriage_dataset.json）をマージして大規模データセットを作成
"""

import json
import os

BASE_DIR = os.path.dirname(__file__)

# 1. 旧データを復元（celebrity_marriage_sanmeigaku.jsonから）
old_results_path = os.path.join(BASE_DIR, "celebrity_marriage_sanmeigaku.json")
with open(old_results_path, "r", encoding="utf-8") as f:
    old_results = json.load(f)

old_data = []
for r in old_results:
    if "error" in r:
        continue
    old_data.append({
        "name": r["name"],
        "real_name": r.get("real_name", r["name"]),
        "birth_date": r["birth_date"],
        "gender": r["gender"],
        "group": r["group"],
        "notes": r.get("notes", ""),
        "source": "curated"
    })

print(f"旧データ: {len(old_data)}名")
for group in ["affair_case", "divorce_case", "control"]:
    count = sum(1 for d in old_data if d["group"] == group)
    print(f"  {group}: {count}名")

# 2. 新規APIデータを読み込み
new_data_path = os.path.join(BASE_DIR, "marriage_dataset.json")
with open(new_data_path, "r", encoding="utf-8") as f:
    new_data = json.load(f)

# データクレンジング: 明らかな誤りを修正
gender_fixes = {
    "ヒカル (YouTuber)": "male",  # ヒカルは男性
    "今井美樹": "female",
    "森山良子": "female",
    "サリー・イップ": "female",
    "水前寺清子": "female",
    "中山美穂": "female",
    "浅香唯": "female",
    "石川秀美": "female",
    "CHARA": "female",
    "コン・リー": "female",
    "プリンス (ミュージシャン)": "male",
}

# 除外すべきエントリ（個人でない、または明らかに誤分類）
exclude_names = {
    "2011年の音楽",  # 番組/記事名
    "Perfume",  # グループ
    "TBSスター育成プロジェクト 私が女優になる日",  # 番組名
    "フレンチ・キス (アイドルユニット)",  # グループ
}

cleaned_new = []
for d in new_data:
    name = d["name"]
    if name in exclude_names:
        print(f"  除外: {name} (個人でない)")
        continue
    # 性別修正
    if name in gender_fixes:
        d["gender"] = gender_fixes[name]
        print(f"  性別修正: {name} -> {d['gender']}")
    d["source"] = "api"
    cleaned_new.append(d)

print(f"\n新規APIデータ（クレンジング後）: {len(cleaned_new)}名")
for group in ["affair_case", "divorce_case", "control"]:
    count = sum(1 for d in cleaned_new if d["group"] == group)
    print(f"  {group}: {count}名")

# 3. マージ（重複除去）
all_names = set()
merged = []

# 旧データを先に追加
for d in old_data:
    key = d["name"]
    if key not in all_names:
        all_names.add(key)
        merged.append(d)

# 新規データを追加（重複チェック）
new_added = 0
for d in cleaned_new:
    key = d["name"]
    if key not in all_names:
        all_names.add(key)
        merged.append(d)
        new_added += 1

print(f"\nマージ結果: 合計{len(merged)}名（新規追加: {new_added}名）")
for group in ["affair_case", "divorce_case", "control"]:
    count = sum(1 for d in merged if d["group"] == group)
    print(f"  {group}: {count}名")

# 4. IDを振り直し
for i, celeb in enumerate(merged, 1):
    celeb["id"] = i
    # 不要なフィールドを削除
    celeb.pop("evidence_score", None)

# 5. 出力
output_path = os.path.join(BASE_DIR, "marriage_dataset.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(merged, f, ensure_ascii=False, indent=2)

print(f"\n出力: {output_path}")
print(f"完了: {len(merged)}名")
