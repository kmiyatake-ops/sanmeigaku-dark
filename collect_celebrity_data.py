# -*- coding: utf-8 -*-
"""
Wikipedia API から芸能人の病気公表情報を自動収集するスクリプト（改善版）
・Wikipedia検索APIで病気関連記事を直接検索
・各記事から生年月日・性別・病気情報を抽出
・公開情報のみを対象、アクセス間隔1.5秒
"""

import json
import os
import re
import time
import urllib.request
import urllib.parse
from collections import defaultdict

OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "celebrity_illness_data_expanded.json")
REQUEST_INTERVAL = 1.5
USER_AGENT = "SanmeigakuResearchBot/1.0 (research purpose; contact: researcher@example.com)"
API_URL = "https://ja.wikipedia.org/w/api.php"

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

# === 情報抽出 ===

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

def extract_illness_info(text):
    """ウィキテキストから病気情報を抽出（改善版）"""
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
        "脳梗塞": "脳血管疾患", "脳出血": "脳血管疾患",
        "くも膜下出血": "脳血管疾患", "心原性脳塞栓症": "脳血管疾患",
        "脳腫瘍": "脳腫瘍", "髄膜腫": "脳腫瘍", "もやもや病": "脳血管疾患",
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
        # パターン1: YYYY年に...病名
        for m in re.finditer(r'(\d{4})年[^。]{0,30}' + re.escape(keyword), text):
            year = int(m.group(1))
            if 1950 <= year <= 2026:
                illnesses.append({"illness": keyword, "illness_category": category, "onset_year": year})
                break
        
        # パターン2: 病名...YYYY年
        if not any(i["illness"] == keyword for i in illnesses):
            for m in re.finditer(re.escape(keyword) + r'[^。]{0,20}(\d{4})年', text):
                year = int(m.group(1))
                if 1950 <= year <= 2026:
                    illnesses.append({"illness": keyword, "illness_category": category, "onset_year": year})
                    break
        
        # パターン3: より広い範囲で検索
        if not any(i["illness"] == keyword for i in illnesses):
            for m in re.finditer(r'(\d{4})年[^。]{0,50}' + re.escape(keyword), text):
                year = int(m.group(1))
                if 1950 <= year <= 2026:
                    illnesses.append({"illness": keyword, "illness_category": category, "onset_year": year})
                    break
        
        # パターン4: 前後500文字から年を探す
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
    m = re.search(r'本名は(.+?)[、。]', text[:3000])
    if m:
        return m.group(1).strip()
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
        "上白石", "賀来", "マツコ", "和",
    ]
    for surname in sorted(common_surnames, key=len, reverse=True):
        if name.startswith(surname) and len(name) > len(surname):
            return surname, name[len(surname):]
    if len(name) >= 3:
        return name[:2], name[2:]
    elif len(name) == 2:
        return name[:1], name[1:]
    return name, ""

# === メイン処理 ===

def main():
    print("=" * 60)
    print("Wikipedia API から芸能人病気データを収集（改善版）")
    print("=" * 60)
    
    # アプローチ1: 検索APIで病気+芸能人を直接検索
    search_queries = [
        "芸能人 がん 公表",
        "芸能人 うつ病",
        "芸能人 パニック障害",
        "芸能人 脳梗塞",
        "芸能人 白血病",
        "芸能人 心筋梗塞",
        "芸能人 双極性障害",
        "タレント がん 発症",
        "俳優 がん 公表",
        "女優 乳がん",
        "歌手 がん",
        "お笑い うつ病",
        "アイドル うつ病",
        "芸能人 脳腫瘍",
        "芸能人 大腸がん",
        "芸能人 肺がん",
        "芸能人 食道がん",
        "芸能人 喉頭がん",
        "芸能人 膀胱がん",
        "芸能人 甲状腺がん",
        "芸能人 肝がん",
        "芸能人 膵がん",
        "芸能人 悪性リンパ腫",
        "芸能人 心不全",
        "芸能人 くも膜下出血",
        "芸能人 適応障害",
        "芸能人 パーキンソン",
        "芸能人 ALS",
    ]
    
    all_titles = set()
    
    for query in search_queries:
        print(f"  検索中: {query}")
        try:
            results = search_wikipedia(query, limit=50)
            for title, snippet in results:
                if any(x in title for x in ["一覧", "カテゴリ", "テンプレート", "Wikipedia", "Help", "ファイル"]):
                    continue
                all_titles.add(title)
            print(f"    -> {len(results)}件（累計ユニーク: {len(all_titles)}）")
        except Exception as e:
            print(f"    -> エラー: {e}")
        time.sleep(REQUEST_INTERVAL)
    
    # アプローチ2: カテゴリからも収集
    target_categories = [
        "日本の芸能人",
        "日本の俳優",
        "日本の女優",
        "日本の歌手",
        "日本のタレント",
        "日本のお笑いタレント",
        "日本のミュージシャン",
        "日本の声優",
        "日本のアイドル",
    ]
    
    for cat in target_categories:
        print(f"  カテゴリ取得中: {cat}")
        try:
            members = get_category_members(cat, limit=200)
            all_titles.update(members)
            print(f"    -> {len(members)}件（累計ユニーク: {len(all_titles)}）")
        except Exception as e:
            print(f"    -> エラー: {e}")
        time.sleep(REQUEST_INTERVAL)
    
    print(f"\n収集したページ総数: {len(all_titles)}件")
    print("各ページから病気情報を抽出中...\n")
    
    results = []
    processed = 0
    found_illness = 0
    
    for title in sorted(all_titles):
        processed += 1
        if processed % 50 == 0:
            print(f"  進捗: {processed}/{len(all_titles)} (病気情報あり: {found_illness})")
        
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
            
            real_name = extract_real_name(text)
            if not real_name:
                real_name = title
            
            last_name, first_name = split_japanese_name(real_name)
            
            found_illness += 1
            
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
                results.append(entry)
            
            print(f"  [OK] {title}: {birth_date} {gender} - {', '.join(i['illness'] for i in illnesses)}")
            
        except Exception as e:
            print(f"  [ERR] {title}: {e}")
        
        time.sleep(REQUEST_INTERVAL)
    
    print(f"\n{'=' * 60}")
    print(f"収集完了: {found_illness}名の芸能人から{len(results)}件の病気レコードを抽出")
    print(f"{'=' * 60}")
    
    existing_path = os.path.join(os.path.dirname(__file__), "celebrity_illness_data.json")
    existing_names = set()
    if os.path.exists(existing_path):
        with open(existing_path, "r", encoding="utf-8") as f:
            existing = json.load(f)
            existing_names = set(d.get("name", "") for d in existing)
    
    new_results = [r for r in results if r["name"] not in existing_names]
    print(f"既存データとの重複を除外: {len(results) - len(new_results)}件")
    print(f"新規追加候補: {len(new_results)}件")
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(new_results, f, ensure_ascii=False, indent=2)
    
    print(f"\n結果を保存: {OUTPUT_FILE}")
    
    if new_results:
        cat_count = defaultdict(int)
        for r in new_results:
            cat_count[r["illness_category"]] += 1
        print("\n病気カテゴリ別集計:")
        for cat, cnt in sorted(cat_count.items(), key=lambda x: -x[1]):
            print(f"  {cat}: {cnt}件")

if __name__ == "__main__":
    main()
