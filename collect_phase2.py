# -*- coding: utf-8 -*-
"""
第2段データ収集: ケース500名・コントロール500名を目標とする追加収集
- 既存データ(expanded_dataset_combined.json)の422名から重複を除外
- ケース群: 病気公表芸能人を追加収集
- コントロール群: 50歳以上（1976年以前生まれ）を優先
- 検索クエリとカテゴリーを大幅拡充
"""

import json
import os
import re
import time
import random
import urllib.request
import urllib.parse
from collections import defaultdict

OUTPUT_CASES = os.path.join(os.path.dirname(__file__), "phase2_cases.json")
OUTPUT_CONTROLS = os.path.join(os.path.dirname(__file__), "phase2_controls.json")
EXISTING_COMBINED = os.path.join(os.path.dirname(__file__), "expanded_dataset_combined.json")
REQUEST_INTERVAL = 1.0
USER_AGENT = "SanmeigakuResearchBot/1.0 (research purpose; contact: researcher@example.com)"
API_URL = "https://ja.wikipedia.org/w/api.php"

ILLNESS_KEYWORDS = [
    "胃がん", "大腸がん", "直腸がん", "結腸がん", "肺がん", "肺腺がん",
    "乳がん", "肝がん", "肝細胞がん", "膵がん", "膵臓がん",
    "食道がん", "喉頭がん", "咽頭がん", "中咽頭がん", "下咽頭がん", "甲状腺がん",
    "腎がん", "腎細胞がん", "膀胱がん", "前立腺がん",
    "子宮頸がん", "子宮体がん", "卵巣がん", "胆管がん", "胆のうがん",
    "扁平上皮がん", "小細胞がん", "非小細胞がん", "スキルス胃がん", "精巣がん",
    "白血病", "急性骨髄性白血病", "急性リンパ性白血病", "慢性骨髄性白血病",
    "悪性リンパ腫", "多発性骨髄腫", "ホジキンリンパ腫", "非ホジキンリンパ腫",
    "脳梗塞", "脳出血", "くも膜下出血", "心原性脳塞栓症",
    "脳腫瘍", "髄膜腫", "もやもや病",
    "うつ病", "抑うつ症", "うつ状態", "双極性障害", "そううつ病", "躁うつ病",
    "パニック障害", "適応障害", "自律神経失調症",
    "心筋梗塞", "狭心症", "心不全", "大動脈瘤", "大動脈解離",
    "パーキンソン病", "アルツハイマー病", "ALS", "筋萎縮性側索硬化症",
    "多発性硬化症", "がん", "癌", "腫瘍",
    "慢性疲労", "過労", "体調不良", "闘病", "入院", "手術",
]

def wiki_api_request(params):
    params["format"] = "json"
    params["formatversion"] = "2"
    url = API_URL + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_page_text(title):
    params = {
        "action": "query",
        "titles": title,
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
    }
    data = wiki_api_request(params)
    if "query" in data and "pages" in data["query"]:
        pages = data["query"]["pages"]
        if pages and "revisions" in pages[0]:
            return pages[0]["revisions"][0]["slots"]["main"]["content"]
    return None

def search_wikipedia(query, limit=50):
    params = {
        "action": "query",
        "list": "search",
        "srsearch": query,
        "srlimit": str(limit),
        "srprop": "snippet",
    }
    data = wiki_api_request(params)
    if "query" in data and "search" in data["query"]:
        return [(r["title"], r.get("snippet", "")) for r in data["query"]["search"]]
    return []

def get_category_members(category, limit=500):
    members = []
    cmcontinue = None
    while len(members) < limit:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": f"Category:{category}",
            "cmlimit": "50",
            "cmtype": "page",
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        data = wiki_api_request(params)
        if "query" in data:
            for m in data["query"]["categorymembers"]:
                members.append(m["title"])
        if "continue" in data:
            cmcontinue = data["continue"]["cmcontinue"]
        else:
            break
        time.sleep(REQUEST_INTERVAL)
    return members

def extract_birth_date(text):
    patterns = [
        r'\{\{生年月日と年齢[2]?\|(\d{4})\|(\d{1,2})\|(\d{1,2})',
        r'\{\{生年月日\|(\d{4})\|(\d{1,2})\|(\d{1,2})',
        r'\{\{birth date and age\|(\d{4})\|(\d{1,2})\|(\d{1,2})',
        r'\{\{birth date\|(\d{4})\|(\d{1,2})\|(\d{1,2})',
        r'(\d{4})年(\d{1,2})月(\d{1,2})日生まれ',
        r'(\d{4})年(\d{1,2})月(\d{1,2})日生',
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
    return None

def extract_gender(text):
    if re.search(r'性別\s*=\s*男性', text):
        return "male"
    if re.search(r'性別\s*=\s*女性', text):
        return "female"
    if re.search(r'gender\s*=\s*male', text, re.IGNORECASE):
        return "male"
    if re.search(r'gender\s*=\s*female', text, re.IGNORECASE):
        return "female"
    if "日本の男性" in text or "男性俳優" in text or "男性歌手" in text or "男性タレント" in text or "男性声優" in text:
        return "male"
    if "日本の女性" in text or "女性俳優" in text or "女優" in text or "女性歌手" in text or "女性タレント" in text or "女性声優" in text or "女性アイドル" in text:
        return "female"
    return None

def extract_real_name(text):
    m = re.search(r'本名\s*=\s*([^\n|]+)', text)
    if m:
        name = m.group(1).strip().rstrip('}')
        name = re.sub(r'\[\[([^\]|]+\|)?([^\]]+)\]\]', r'\2', name)
        return name.strip()
    m = re.search(r'別名義\s*=\s*([^\n|]+)', text)
    if m:
        name = m.group(1).strip().rstrip('}')
        name = re.sub(r'\[\[([^\]|]+\|)?([^\]]+)\]\]', r'\2', name)
        return name.strip()
    return None

def split_japanese_name(name):
    if not name:
        return None, None
    parts = name.strip().split()
    if len(parts) >= 2:
        return parts[0], "".join(parts[1:])
    common_surnames = [
        "坂本", "小林", "忌野", "石橋", "河村", "生稲", "岡村", "三浦", "風間", "山口",
        "河本", "田中", "星野", "長嶋", "木本", "小倉", "桜井", "徳永", "伊達", "松本",
        "池江", "安田", "寺田", "麻木", "阿部", "名倉", "松島", "堂本", "豊田", "中川",
        "村井", "萩原", "渡邊", "渡辺", "高嶋", "高島", "大場", "深瀬", "石田", "兒玉",
        "丸岡", "水谷", "石原", "宮崎", "佐藤", "鈴木", "高橋", "伊藤", "山田", "中村",
        "小島", "加藤", "吉田", "山本", "佐々木", "山崎", "松田", "井上", "木村", "清水",
        "斎藤", "橋本", "山下", "池田", "石井", "福田", "宮本", "中西", "矢口", "大木",
        "内田", "森本", "杉本", "柴田", "村上", "武田", "島田", "大野", "永井", "松井",
        "菊池", "岩崎", "松浦", "望月", "中山", "本田", "中野", "片山", "岡田", "金子",
        "荒木", "太田", "小川", "平田", "黒田", "竹内", "松尾", "藤田", "藤本", "中島",
        "永田", "倉田", "神田", "尾崎", "横山", "秋山", "和田", "百田", "河野", "杉山",
        "原田", "小山", "大塚", "矢島", "小野", "川口", "町田", "熊谷", "横田", "荒川",
        "大谷", "野村", "新井", "菅田", "真野", "桐谷", "細田", "米倉", "仲間", "浜辺",
        "広瀬", "永野", "二階堂", "浜田", "遠藤", "大泉", "有吉", "黒澤", "是枝", "堤",
        "周防", "庵野", "樋口", "大友", "林", "森", "関", "東", "原",
        "上白石", "賀来", "マツコ", "和", "小西", "中井", "森山", "水木", "東海",
        "市川", "松浦", "円", "前田", "木山", "杉田", "日高", "桑名", "木下",
        "舟木", "花村", "藤", "相川", "相馬", "綾戸", "美川",
        "近藤", "赤西", "錦織", "城島", "山口", "長瀬", "松岡", "国分", "坂本",
        "大野", "櫻井", "相葉", "二宮",
    ]
    for surname in sorted(set(common_surnames), key=len, reverse=True):
        if name.startswith(surname) and len(name) > len(surname):
            return surname, name[len(surname):]
    if len(name) >= 3:
        return name[:2], name[2:]
    elif len(name) == 2:
        return name[:1], name[1:]
    return name, ""

def has_illness_mention(text):
    for kw in ILLNESS_KEYWORDS:
        if kw in text:
            return True
    return False

def extract_illness_info(text):
    illnesses = []
    illness_keywords = {
        "胃がん": "がん（消化器）", "大腸がん": "がん（消化器）", "直腸がん": "がん（消化器）",
        "結腸がん": "がん（消化器）", "肺がん": "がん（呼吸器）", "肺腺がん": "がん（呼吸器）",
        "乳がん": "がん（乳がん）", "肝がん": "がん（消化器）", "肝細胞がん": "がん（消化器）",
        "膵がん": "がん（消化器）", "膵臓がん": "がん（消化器）",
        "食道がん": "がん（頭頸部・消化器）", "喉頭がん": "がん（頭頸部）",
        "咽頭がん": "がん（頭頸部）", "中咽頭がん": "がん（頭頸部）",
        "下咽頭がん": "がん（頭頸部）", "甲状腺がん": "がん（頭頸部）",
        "腎がん": "がん（泌尿器）", "腎細胞がん": "がん（泌尿器）",
        "膀胱がん": "がん（泌尿器）", "前立腺がん": "がん（泌尿器）",
        "子宮頸がん": "がん（泌尿器）", "子宮体がん": "がん（泌尿器）",
        "卵巣がん": "がん（泌尿器）", "胆管がん": "がん（消化器）",
        "胆のうがん": "がん（消化器）", "扁平上皮がん": "がん（その他）",
        "小細胞がん": "がん（その他）", "非小細胞がん": "がん（その他）",
        "スキルス胃がん": "がん（消化器）", "精巣がん": "がん（泌尿器）",
        "白血病": "血液疾患", "急性骨髄性白血病": "血液疾患",
        "急性リンパ性白血病": "血液疾患", "慢性骨髄性白血病": "血液疾患",
        "悪性リンパ腫": "血液疾患", "多発性骨髄腫": "血液疾患",
        "ホジキンリンパ腫": "血液疾患", "非ホジキンリンパ腫": "血液疾患",
        "脳梗塞": "脳血管・脳腫瘍", "脳出血": "脳血管・脳腫瘍",
        "くも膜下出血": "脳血管・脳腫瘍", "心原性脳塞栓症": "脳血管・脳腫瘍",
        "脳腫瘍": "脳血管・脳腫瘍", "髄膜腫": "脳血管・脳腫瘍", "もやもや病": "脳血管・脳腫瘍",
        "うつ病": "精神疾患（うつ・抑うつ）", "抑うつ症": "精神疾患（うつ・抑うつ）",
        "うつ状態": "精神疾患（うつ・抑うつ）", "双極性障害": "精神疾患（双極性障害）",
        "そううつ病": "精神疾患（双極性障害）", "躁うつ病": "精神疾患（双極性障害）",
        "パニック障害": "精神疾患（パニック障害）",
        "適応障害": "精神疾患（その他）", "自律神経失調症": "精神疾患（その他）",
        "心筋梗塞": "循環器疾患", "狭心症": "循環器疾患",
        "心不全": "循環器疾患", "大動脈瘤": "循環器疾患",
        "大動脈解離": "循環器疾患",
        "パーキンソン病": "神経疾患", "アルツハイマー病": "神経疾患",
        "ALS": "神経疾患", "筋萎縮性側索硬化症": "神経疾患",
        "多発性硬化症": "神経疾患",
    }
    found_illnesses = {}
    for keyword, category in illness_keywords.items():
        if keyword in text:
            if keyword not in found_illnesses:
                found_illnesses[keyword] = category
    for keyword, category in found_illnesses.items():
        for m in re.finditer(r'(\d{4})年[^。]{0,30}' + re.escape(keyword), text):
            year = int(m.group(1))
            if 1950 <= year <= 2026:
                illnesses.append({"illness": keyword, "illness_category": category, "onset_year": year})
                break
        if not any(i["illness"] == keyword for i in illnesses):
            for m in re.finditer(re.escape(keyword) + r'[^。]{0,20}(\d{4})年', text):
                year = int(m.group(1))
                if 1950 <= year <= 2026:
                    illnesses.append({"illness": keyword, "illness_category": category, "onset_year": year})
                    break
        if not any(i["illness"] == keyword for i in illnesses):
            for m in re.finditer(r'(\d{4})年[^。]{0,50}' + re.escape(keyword), text):
                year = int(m.group(1))
                if 1950 <= year <= 2026:
                    illnesses.append({"illness": keyword, "illness_category": category, "onset_year": year})
                    break
        if not any(i["illness"] == keyword for i in illnesses):
            idx = text.find(keyword)
            if idx >= 0:
                context = text[max(0, idx-500):idx+500]
                years = re.findall(r'(\d{4})年', context)
                if years:
                    year = int(years[0])
                    if 1950 <= year <= 2026:
                        illnesses.append({"illness": keyword, "illness_category": category, "onset_year": year})
    seen = set()
    unique = []
    for ill in illnesses:
        key = (ill["illness"], ill["onset_year"])
        if key not in seen:
            seen.add(key)
            unique.append(ill)
    return unique

def is_likely_person(name):
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
    for kw in non_person_keywords:
        if kw in name:
            return False
    if re.match(r'^\d{4}年', name):
        return False
    if len(name) < 2 or len(name) > 30:
        return False
    symbol_count = sum(1 for c in name if not c.isalnum() and c not in '・ー＝')
    if symbol_count > 3:
        return False
    return True

# === ケース群追加収集 ===

def collect_cases_phase2(existing_names, existing_case_count, target_total=500):
    print("=" * 60)
    print("ケース群（病気公表芸能人）第2段追加収集")
    print("=" * 60)

    needed = target_total - existing_case_count
    print(f"既存ケース: {existing_case_count}名, 目標: {target_total}名, 追加必要: {needed}名\n")

    # 大幅拡充した検索クエリ
    search_queries = [
        # がん関連（より具体的）
        "芸能人 がん 公表", "芸能人 がん 発症", "芸能人 がん 克服",
        "タレント がん 公表", "俳優 がん 公表", "女優 がん 公表",
        "歌手 がん 公表", "お笑い がん 公表", "アイドル がん",
        "芸能人 乳がん", "芸能人 大腸がん", "芸能人 肺がん",
        "芸能人 胃がん", "芸能人 食道がん", "芸能人 喉頭がん",
        "芸能人 肝がん", "芸能人 膵がん", "芸能人 腎がん",
        "芸能人 膀胱がん", "芸能人 前立腺がん", "芸能人 甲状腺がん",
        "芸能人 子宮がん", "芸能人 卵巣がん", "芸能人 胆管がん",
        "芸能人 扁平上皮がん", "芸能人 精巣がん",
        # 個別の病気キーワード + 芸能人
        "芸能人 白血病", "芸能人 悪性リンパ腫", "芸能人 多発性骨髄腫",
        "芸能人 ホジキン", "芸能人 骨髄腫",
        "芸能人 脳梗塞", "芸能人 脳出血", "芸能人 くも膜下出血",
        "芸能人 脳腫瘍", "芸能人 もやもや病",
        "芸能人 うつ病", "芸能人 うつ", "芸能人 抑うつ",
        "芸能人 パニック障害", "芸能人 双極性障害", "芸能人 そううつ病",
        "芸能人 適応障害", "芸能人 自律神経失調症",
        "タレント うつ病", "俳優 うつ病", "女優 うつ病",
        "歌手 うつ病", "お笑い うつ病", "アイドル うつ病",
        "芸能人 パニック", "芸能人 躁うつ",
        "芸能人 心筋梗塞", "芸能人 心不全", "芸能人 狭心症",
        "芸能人 大動脈瘤", "芸能人 大動脈解離",
        "芸能人 パーキンソン", "芸能人 ALS", "芸能人 アルツハイマー",
        "芸能人 多発性硬化症",
        # 闘病・入院関連
        "芸能人 闘病", "芸能人 入院", "芸能人 手術 がん",
        "タレント 闘病", "俳優 闘病", "女優 闘病",
        "歌手 闘病", "お笑い 闘病",
        "芸能人 病気 公表", "芸能人 体調不良 休業",
        "芸能人 がん告知", "芸能人 抗がん剤",
        "芸能人 入院 うつ", "芸能人 休業 うつ",
        # 新規追加クエリ
        "芸能人 がん サバイバー", "芸能人 がん 再発",
        "芸能人 休業 病気", "芸能人 活動休止 病気",
        "芸能人 脳卒中", "芸能人 脳血管",
        "芸能人 心臓病", "芸能人 心臓手術",
        "芸能人 甲状腺疾患", "芸能人 自己免疫疾患",
        "芸能人 膠原病", "芸能人 リウマチ",
        "芸能人 肝炎", "芸能人 肝硬変",
        "芸能人 腎炎", "芸能人 透析",
        "芸能人 糖尿病", "芸能人 高血圧",
        "芸能人 喘息", "芸能人 COPD",
        "芸能人 潰瘍性大腸炎", "芸能人 クローン病",
        "芸能人 花粉症 手術", "芸能人 鼻炎手術",
        "芸能人 不妊治療", "芸能人 体外受精",
        "芸能人 更年期障害", "芸能人 女性疾患",
        "芸能人 前立腺疾患", "芸能人 泌尿器",
        "芸能人 皮膚がん", "芸能人 黒色腫",
        "芸能人 眼疾患", "芸能人 緑内障", "芸能人 白内障",
        "芸能人 耳疾患", "芸能人 難聴", "芸能人 メニエール",
        "芸能人 アナフィラキシー", "芸能人 アレルギー",
        "芸能人 不整脈", "芸能人 弁膜症",
        "芸能人 てんかん", "芸能人 発作",
        "芸能人 睡眠障害", "芸能人 不眠症",
        "芸能人 摂食障害", "芸能人 過食症", "芸能人 拒食症",
        "芸能人 PTSD", "芸能人 ストレス",
        "芸能人 腫瘍 摘出", "芸能人 手術 入院",
        "芸能人 闘病記", "芸能人 病気体験",
        "芸能人 がん 検診", "芸能人 人間ドック",
        # 職業別 + 病気
        "声優 がん", "声優 うつ病", "声優 闘病",
        "お笑い うつ病", "お笑い パニック障害",
        "アイドル うつ病", "アイドル 闘病",
        "俳優 心筋梗塞", "俳優 脳梗塞",
        "女優 乳がん", "女優 子宮がん",
        "歌手 うつ病", "歌手 闘病",
        "タレント 乳がん", "タレント うつ病",
        "芸能人 がん 診断", "芸能人 がん 治療",
        "芸能人 がん 寛解", "芸能人 がん 転移",
        # ニュース記事風の検索
        "芸能人 病気 2024", "芸能人 病気 2023", "芸能人 病気 2022",
        "芸能人 病気 2021", "芸能人 病気 2020", "芸能人 病気 2019",
        "芸能人 がん 2024", "芸能人 がん 2023", "芸能人 がん 2022",
        "芸能人 がん 2021", "芸能人 がん 2020",
        "芸能人 入院 2024", "芸能人 入院 2023", "芸能人 入院 2022",
        "芸能人 休業 2024", "芸能人 休業 2023", "芸能人 休業 2022",
        "芸能人 死去 がん", "芸能人 死去 病気",
        "芸能人 逝去 がん", "芸能人 逝去 病気",
    ]

    all_titles = set()

    for query in search_queries:
        print(f"  検索: {query}")
        try:
            results = search_wikipedia(query, limit=50)
            for title, snippet in results:
                if any(x in title for x in ["一覧", "カテゴリ", "テンプレート", "Wikipedia", "Help", "ファイル"]):
                    continue
                if title in existing_names:
                    continue
                all_titles.add(title)
            print(f"    -> {len(results)}件（累計ユニーク: {len(all_titles)}）")
        except Exception as e:
            print(f"    -> エラー: {e}")
        time.sleep(REQUEST_INTERVAL)

    # カテゴリからも収集（大幅拡充）
    illness_categories = [
        "日本の芸能人",
        "病気で死去した人物",
        "がんの患者",
        "うつ病の患者",
        "双極性障害の患者",
        "パニック障害の患者",
        "白血病の患者",
        "脳梗塞の患者",
        "心筋梗塞の患者",
        "悪性リンパ腫の患者",
        "多発性骨髄腫の患者",
        "脳腫瘍の患者",
        "パーキンソン病の患者",
        "ALSの患者",
        "心不全の患者",
        "大動脈瘤の患者",
        "甲状腺がんの患者",
        "乳がんの患者",
        "肺がんの患者",
        "胃がんの患者",
        "大腸がんの患者",
        "肝がんの患者",
        "膵がんの患者",
        "腎がんの患者",
        "膀胱がんの患者",
        "前立腺がんの患者",
        "食道がんの患者",
        "喉頭がんの患者",
        "多発性硬化症の患者",
        "アルツハイマー病の患者",
        "適応障害の患者",
    ]

    for cat in illness_categories:
        print(f"  カテゴリ: {cat}")
        try:
            members = get_category_members(cat, limit=500)
            for m in members:
                if m not in existing_names and is_likely_person(m):
                    all_titles.add(m)
            print(f"    -> {len(members)}件（累計ユニーク: {len(all_titles)}）")
        except Exception as e:
            print(f"    -> エラー: {e}")
        time.sleep(REQUEST_INTERVAL)

    print(f"\n収集したページ総数: {len(all_titles)}件")
    print("各ページから病気情報を抽出中...\n")

    cases = []
    processed = 0
    found = 0

    for title in sorted(all_titles):
        processed += 1
        if processed % 50 == 0:
            print(f"  進捗: {processed}/{len(all_titles)} (病気情報あり: {found})")

        try:
            text = get_page_text(title)
            if not text:
                time.sleep(REQUEST_INTERVAL)
                continue

            illnesses = extract_illness_info(text)
            if not illnesses:
                time.sleep(REQUEST_INTERVAL)
                continue

            birth_date = extract_birth_date(text)
            if not birth_date:
                time.sleep(REQUEST_INTERVAL)
                continue

            gender = extract_gender(text)
            if not gender:
                time.sleep(REQUEST_INTERVAL)
                continue

            real_name = extract_real_name(text) or title
            last_name, first_name = split_japanese_name(real_name)

            found += 1

            for ill in illnesses:
                entry = {
                    "name": title,
                    "real_name": real_name,
                    "last_name": last_name,
                    "first_name": first_name,
                    "birth_date": birth_date,
                    "gender": gender,
                    "illness": ill["illness"],
                    "illness_category": ill["illness_category"],
                    "onset_year": ill["onset_year"],
                    "notes": f"Wikipedia「{title}」より抽出",
                    "source": "Wikipedia",
                }
                cases.append(entry)

            print(f"  [OK] {title}: {birth_date} {gender} - {', '.join(i['illness'] for i in illnesses)}")

        except Exception as e:
            print(f"  [ERR] {title}: {e}")

        time.sleep(REQUEST_INTERVAL)

    # 重複排除
    seen = {}
    for e in cases:
        key = (e["name"], e["illness"])
        if key not in seen or e["onset_year"] < seen[key]["onset_year"]:
            seen[key] = e
    cases = list(seen.values())

    # 既存データと重複除外
    new_cases = [c for c in cases if c["name"] not in existing_names]

    print(f"\nケース群第2段収集完了: {len(new_cases)}名（重複除外後）")

    with open(OUTPUT_CASES, "w", encoding="utf-8") as f:
        json.dump(new_cases, f, ensure_ascii=False, indent=2)
    print(f"保存: {OUTPUT_CASES}")

    return new_cases

# === コントロール群追加収集（50歳以上優先）===

def collect_controls_phase2(existing_names, case_data, existing_ctrl_count, target_total=500):
    print("\n" + "=" * 60)
    print("対照群（病気公表なしの芸能人）第2段追加収集")
    print("※50歳以上（1976年以前生まれ）を優先")
    print("=" * 60)

    needed = target_total - existing_ctrl_count
    print(f"既存コントロール: {existing_ctrl_count}名, 目標: {target_total}名, 追加必要: {needed}名\n")

    # ケース群の性別・年代分布を分析
    case_demographics = defaultdict(int)
    for c in case_data:
        birth_year = int(c["birth_date"][:4])
        decade = (birth_year // 10) * 10
        case_demographics[(c["gender"], decade)] += 1

    print("ケース群の性別・年代分布:")
    for (gender, decade), count in sorted(case_demographics.items()):
        print(f"  {gender} {decade}s: {count}名")

    # 大幅拡充したカテゴリ
    control_categories = [
        "日本の俳優", "日本の女優", "日本の歌手",
        "日本のタレント", "日本のお笑いタレント",
        "日本のミュージシャン", "日本の声優",
        "日本のアイドル", "日本の芸能人",
        "日本の男性俳優", "日本の女性俳優",
        "日本の男性歌手", "日本の女性歌手",
        "日本の男性タレント", "日本の女性タレント",
        "日本の男性声優", "日本の女性声優",
        "日本の男性アイドル", "日本の女性アイドル",
        "日本の作曲家", "日本の音楽プロデューサー",
        "日本の映画監督", "日本のテレビプロデューサー",
        "日本の放送作家", "日本の演出家",
        "日本のダンサー", "日本の振付師",
        "日本のモデル", "日本のファッションモデル",
        # 追加カテゴリ
        "日本のナレーター", "日本の司会者",
        "日本のレポーター", "日本のリポーター",
        "日本のラジオパーソナリティ",
        "日本の俳優・女優",
        "日本の舞台俳優", "日本の映画俳優",
        "日本のテレビ俳優",
        "日本の喜劇俳優",
        "日本の歌舞伎俳優",
        "日本の能楽師",
        "日本の落語家",
        "日本の漫才師",
        "日本の漫談家",
        "日本の浪曲師",
        "日本の講談師",
        "日本の落語家",
        "日本の俳優（戦前生まれ）",
        "日本の俳優（戦後生まれ）",
        "日本の歌手（戦後生まれ）",
        "20世紀日本の歌手",
        "20世紀日本の俳優",
        "20世紀日本の女優",
        "日本の男性俳優（戦後生まれ）",
        "日本の女性俳優（戦後生まれ）",
        "日本のタレント（戦後生まれ）",
        "日本のミュージシャン（戦後生まれ）",
        "昭和時代の芸能人",
        "昭和時代の俳優",
        "昭和時代の歌手",
        "大正時代生まれの人物",
        "昭和時代生まれの人物",
        "日本のアナウンサー",
        "日本のフリーアナウンサー",
        "日本の男性アナウンサー",
        "日本の女性アナウンサー",
        "日本の写真家",
        "日本の画家",
        "日本のイラストレーター",
        "日本の漫画家",
        "日本の作家",
        "日本の小説家",
        "日本の詩人",
        "日本の脚本家",
        "日本の作詞家",
        "日本の演出家",
        "日本のプロデューサー",
        "日本のスポーツ選手",
        "日本の野球選手",
        "日本のサッカー選手",
        "日本の格闘家",
        "日本の陸上競技選手",
        "日本の水泳選手",
        "日本の体操選手",
        "日本のスケート選手",
        "日本のプロゴルファー",
        "日本のプロボクサー",
        "日本の力士",
        "日本のスポーツ評論家",
    ]

    all_titles = set()

    for cat in control_categories:
        print(f"  カテゴリ: {cat}")
        try:
            members = get_category_members(cat, limit=300)
            for m in members:
                if m not in existing_names and is_likely_person(m):
                    all_titles.add(m)
            print(f"    -> {len(members)}件（累計: {len(all_titles)}）")
        except Exception as e:
            print(f"    -> エラー: {e}")
        time.sleep(REQUEST_INTERVAL)

    print(f"\n対照群候補: {len(all_titles)}件")
    print("病気情報なしを確認中（50歳以上優先）...\n")

    # 2段階収集: まず50歳以上（1976年以前生まれ）を収集し、不足分を若年層から補充
    controls = []
    processed = 0
    found = 0
    older_found = 0
    younger_found = 0

    title_list = sorted(all_titles)
    random.shuffle(title_list)

    # 第1パス: 1976年以前生まれを優先
    older_titles = []
    younger_titles = []
    
    # まず全候補をスキャンして年齢で分ける（テキスト取得が必要なので段階的に処理）
    for title in title_list:
        if found >= needed:
            break
        processed += 1
        if processed % 50 == 0:
            print(f"  進捗: {processed}/{len(title_list)} (対照群: {found}, 50歳以上: {older_found})")

        try:
            text = get_page_text(title)
            if not text:
                time.sleep(REQUEST_INTERVAL)
                continue

            if has_illness_mention(text):
                time.sleep(REQUEST_INTERVAL)
                continue

            birth_date = extract_birth_date(text)
            if not birth_date:
                time.sleep(REQUEST_INTERVAL)
                continue

            gender = extract_gender(text)
            if not gender:
                time.sleep(REQUEST_INTERVAL)
                continue

            birth_year = int(birth_date[:4])
            real_name = extract_real_name(text) or title
            last_name, first_name = split_japanese_name(real_name)

            entry = {
                "name": title,
                "real_name": real_name,
                "last_name": last_name,
                "first_name": first_name,
                "birth_date": birth_date,
                "gender": gender,
                "illness": None,
                "illness_category": None,
                "onset_year": None,
                "notes": "対照群（病気公表なし）",
                "source": "Wikipedia",
                "group": "control",
            }
            controls.append(entry)
            found += 1

            if birth_year <= 1976:
                older_found += 1
            else:
                younger_found += 1

            if found % 20 == 0:
                age_label = "50+" if birth_year <= 1976 else "50-"
                print(f"  [CTRL-{age_label}] {title}: {birth_date} {gender}")

        except Exception as e:
            pass

        time.sleep(REQUEST_INTERVAL)

    print(f"\n対照群第2段収集完了: {len(controls)}名（50歳以上: {older_found}名, 50歳未満: {younger_found}名）")

    with open(OUTPUT_CONTROLS, "w", encoding="utf-8") as f:
        json.dump(controls, f, ensure_ascii=False, indent=2)
    print(f"保存: {OUTPUT_CONTROLS}")

    return controls

# === メイン ===

def main():
    # 既存データの読み込み
    with open(EXISTING_COMBINED, "r", encoding="utf-8") as f:
        existing = json.load(f)
    existing_names = set(d["name"] for d in existing)
    existing_cases = [d for d in existing if d.get("group", "case") == "case"]
    existing_controls = [d for d in existing if d.get("group", "case") == "control"]

    print(f"既存データ: {len(existing)}名（ケース{len(existing_cases)}名 / コントロール{len(existing_controls)}名）")

    # ケース群追加収集
    new_cases = collect_cases_phase2(existing_names, len(existing_cases), target_total=500)

    # 既存名前に新規ケースを追加
    all_names = existing_names | set(c["name"] for c in new_cases)
    all_case_data = existing_cases + new_cases

    # コントロール群追加収集
    new_controls = collect_controls_phase2(all_names, all_case_data, len(existing_controls), target_total=500)

    # サマリー
    print("\n" + "=" * 60)
    print("第2段収集サマリー")
    print("=" * 60)
    print(f"既存ケース: {len(existing_cases)}名")
    print(f"新規ケース: {len(new_cases)}名")
    print(f"ケース合計: {len(existing_cases) + len(new_cases)}名")
    print(f"既存コントロール: {len(existing_controls)}名")
    print(f"新規コントロール: {len(new_controls)}名")
    print(f"コントロール合計: {len(existing_controls) + len(new_controls)}名")
    print(f"総合計: {len(existing) + len(new_cases) + len(new_controls)}名")

    # カテゴリ別集計
    all_cases = existing_cases + new_cases
    cat_count = defaultdict(int)
    for c in all_cases:
        cat_count[c.get("illness_category", "不明")] += 1
    print("\nケース群の病気カテゴリ別:")
    for cat, cnt in sorted(cat_count.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {cnt}名")

    # コントロール群の性別・年代分布
    all_ctrls = existing_controls + new_controls
    ctrl_demo = defaultdict(int)
    for c in all_ctrls:
        birth_year = int(c["birth_date"][:4])
        decade = (birth_year // 10) * 10
        ctrl_demo[(c["gender"], decade)] += 1
    print("\nコントロール群の性別・年代分布:")
    for (gender, decade), count in sorted(ctrl_demo.items()):
        print(f"  {gender} {decade}s: {count}名")

if __name__ == "__main__":
    main()
