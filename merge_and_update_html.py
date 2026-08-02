# -*- coding: utf-8 -*-
"""
既存40名 + Wikipedia収集データをマージし、batch_calculate.htmlのCELEB_DATAを更新する。
"""

import json
import os
import re

BASE_DIR = os.path.dirname(__file__)
HTML_FILE = os.path.join(BASE_DIR, "batch_calculate.html")
FILTERED_FILE = os.path.join(BASE_DIR, "celebrity_illness_data_filtered.json")

# 1. 既存のCELEB_DATAをHTMLから抽出
with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# CELEB_DATA配列を抽出
m = re.search(r'const CELEB_DATA = \[(.*?)\];', html, re.DOTALL)
if not m:
    print("ERROR: CELEB_DATA not found")
    exit(1)

# JSONとしてパース
existing_json_str = "[" + m.group(1) + "]"
existing_data = json.loads(existing_json_str)
print(f"既存データ: {len(existing_data)}件")

# 既存名前セット
existing_names = set()
for d in existing_data:
    existing_names.add(d.get("name", ""))
    existing_names.add(d.get("real_name", ""))

# 2. フィルタ済み新規データを読み込み
with open(FILTERED_FILE, "r", encoding="utf-8") as f:
    new_data = json.load(f)
print(f"新規データ: {len(new_data)}件")

# 3. 重複除外
unique_new = {}
for d in new_data:
    name = d["name"]
    if name in existing_names:
        continue
    if name in unique_new:
        continue
    unique_new[name] = d

print(f"重複除外後: {len(unique_new)}件")

# 4. IDを割り当て
next_id = max(d["id"] for d in existing_data) + 1
merged = list(existing_data)

for name, d in unique_new.items():
    entry = {
        "id": next_id,
        "name": d["name"],
        "real_name": d.get("real_name", d["name"]),
        "last_name": d.get("last_name", ""),
        "first_name": d.get("first_name", ""),
        "birth_date": d["birth_date"],
        "gender": d["gender"],
        "illness": d["illness"],
        "illness_category": d["illness_category"],
        "onset_year": d["onset_year"],
        "notes": d.get("notes", ""),
    }
    merged.append(entry)
    next_id += 1

print(f"マージ後総数: {len(merged)}件")

# 5. HTMLのCELEB_DATAを更新
# JSON文字列を生成（JavaScript互換）
new_celeb_json = json.dumps(merged, ensure_ascii=False, indent=2)
# JavaScriptの配列として整形
new_celeb_str = "const CELEB_DATA = " + new_celeb_json + ";"

# 古いCELEB_DATAブロックを置換
new_html = re.sub(
    r'const CELEB_DATA = \[.*?\];',
    new_celeb_str.replace(";", ";").replace("\n", "\n"),
    html,
    count=1,
    flags=re.DOTALL
)

# 説明文も更新
new_html = new_html.replace(
    "40名の芸能人データに対して算命学計算を実行し、結果をJSONとして出力します。",
    f"{len(merged)}名の芸能人データに対して算命学計算を実行し、結果をJSONとして出力します。"
)

# キャッシュバスティング更新
new_html = re.sub(r'kanji-data\.js\?v=\w+', 'kanji-data.js?v=20260721d', new_html)
new_html = re.sub(r'app\.js\?v=\w+', 'app.js?v=20260721d', new_html)

# 6. ファイルに保存
with open(HTML_FILE, "w", encoding="utf-8") as f:
    f.write(new_html)

print(f"\nbatch_calculate.html を更新しました。")
print(f"総人数: {len(merged)}名")

# 病気カテゴリ別集計
from collections import Counter
cat_count = Counter(d["illness_category"] for d in merged)
print("\n病気カテゴリ別集計:")
for cat, cnt in sorted(cat_count.items(), key=lambda x: -x[1]):
    print(f"  {cat}: {cnt}件")
