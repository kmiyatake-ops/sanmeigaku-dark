# -*- coding: utf-8 -*-
"""
batch_calculate.htmlからCELEB_DATAを抽出してJSONファイルとして保存する。
"""
import json
import os
import re

BASE_DIR = os.path.dirname(__file__)
HTML_FILE = os.path.join(BASE_DIR, "batch_calculate.html")
OUTPUT_FILE = os.path.join(BASE_DIR, "celebrity_illness_data_merged.json")

with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

m = re.search(r'const CELEB_DATA = (\[.*?\]);', html, re.DOTALL)
if not m:
    print("ERROR: CELEB_DATA not found")
    exit(1)

data = json.loads(m.group(1))
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"マージ済みデータを保存: {OUTPUT_FILE} ({len(data)}名)")
